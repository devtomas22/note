<script lang="ts">
  import { onMount } from 'svelte'
  import { v4 as uuidv4 } from 'uuid'
  import { backendAPI } from './backend-api'
  import type { Cell, Notebook } from './types'
  import NotebookToolbar from './NotebookToolbar.svelte'
  import CellComponent from './Cell.svelte'

  let notebook = $state<Notebook>({
    id: uuidv4(),
    name: 'Untitled.ipynb',
    cells: [
      {
        id: uuidv4(),
        type: 'code',
        content: '',
        outputs: [],
      },
    ],
    metadata: {
      kernelspec: {
        name: 'python3',
        language: 'python',
      },
    },
  })

  let selectedCellId = $state(notebook.cells[0].id)
  let kernelStatus = $state<'idle' | 'busy' | 'starting'>('idle')

  onMount(async () => {
    // Initialize kernel on mount
    kernelStatus = 'starting'
    const kernel = await backendAPI.startKernel('python3')
    backendAPI.connectToKernel(kernel.id)
    kernelStatus = 'idle'
  })

  function addCell(type: 'code' | 'markdown', afterCellId?: string) {
    const newCell: Cell = {
      id: uuidv4(),
      type,
      content: '',
      outputs: type === 'code' ? [] : undefined,
    }

    const cells = [...notebook.cells]
    const index = afterCellId ? cells.findIndex(c => c.id === afterCellId) + 1 : cells.length

    cells.splice(index, 0, newCell)
    notebook.cells = cells
    selectedCellId = newCell.id
  }

  function deleteCell(cellId: string) {
    let cells = notebook.cells.filter(c => c.id !== cellId)
    
    // Keep at least one cell
    if (cells.length === 0) {
      cells = [{
        id: uuidv4(),
        type: 'code',
        content: '',
        outputs: [],
      }]
    }
    
    notebook.cells = cells
  }

  function updateCell(cellId: string, content: string) {
    notebook.cells = notebook.cells.map(cell =>
      cell.id === cellId ? { ...cell, content } : cell
    )
  }

  async function executeCell(cellId: string) {
    const cell = notebook.cells.find(c => c.id === cellId)
    if (!cell || cell.type !== 'code') return

    kernelStatus = 'busy'

    try {
      const result = await backendAPI.executeCode(cell.content, 'kernel-1')
      
      notebook.cells = notebook.cells.map(c =>
        c.id === cellId
          ? { 
              ...c, 
              outputs: result.outputs,
              executionCount: result.execution_count,
            }
          : c
      )
    } catch (error) {
      // Error handling in production
    } finally {
      kernelStatus = 'idle'
    }
  }

  async function executeAllCells() {
    for (const cell of notebook.cells) {
      if (cell.type === 'code') {
        await executeCell(cell.id)
      }
    }
  }

  function clearAllOutputs() {
    notebook.cells = notebook.cells.map(cell => ({
      ...cell,
      outputs: cell.type === 'code' ? [] : undefined,
      executionCount: undefined,
    }))
  }

  function moveCellUp(cellId: string) {
    const cells = [...notebook.cells]
    const index = cells.findIndex(c => c.id === cellId)
    if (index > 0) {
      [cells[index - 1], cells[index]] = [cells[index], cells[index - 1]]
      notebook.cells = cells
    }
  }

  function moveCellDown(cellId: string) {
    const cells = [...notebook.cells]
    const index = cells.findIndex(c => c.id === cellId)
    if (index < cells.length - 1) {
      [cells[index], cells[index + 1]] = [cells[index + 1], cells[index]]
      notebook.cells = cells
    }
  }

  async function saveNotebook() {
    await backendAPI.saveNotebook(notebook)
    alert('Notebook saved!')
  }
</script>

<div class="jupyter-app">
  <div class="jupyter-header">
    <div class="jupyter-logo">
      <svg width="44" height="51" viewBox="0 0 44 51" xmlns="http://www.w3.org/2000/svg">
        <g fill-rule="evenodd">
          <circle fill="#FF6C2C" cx="21.5" cy="45.5" r="5.5" />
          <circle fill="#4E4E4E" cx="21.5" cy="25.5" r="9.5" />
          <circle fill="#767677" cx="21.5" cy="5.5" r="5.5" />
        </g>
      </svg>
    </div>
    <div class="notebook-name">
      <input
        type="text"
        bind:value={notebook.name}
        class="notebook-name-input"
      />
    </div>
    <div class="kernel-status">
      <span class={`kernel-indicator ${kernelStatus}`}></span>
      <span>
        {kernelStatus === 'idle' ? 'Kernel Idle' : kernelStatus === 'busy' ? 'Kernel Busy' : 'Starting...'}
      </span>
    </div>
  </div>

  <NotebookToolbar
    onAddCodeCell={() => addCell('code', selectedCellId)}
    onAddMarkdownCell={() => addCell('markdown', selectedCellId)}
    onSave={saveNotebook}
    onRunAll={executeAllCells}
    onClearOutputs={clearAllOutputs}
  />

  <div class="notebook-container">
    {#each notebook.cells as cell (cell.id)}
      <CellComponent
        {cell}
        isSelected={cell.id === selectedCellId}
        onSelect={() => (selectedCellId = cell.id)}
        onUpdate={(content) => updateCell(cell.id, content)}
        onExecute={() => executeCell(cell.id)}
        onDelete={() => deleteCell(cell.id)}
        onMoveUp={() => moveCellUp(cell.id)}
        onMoveDown={() => moveCellDown(cell.id)}
        onAddBelow={() => addCell('code', cell.id)}
      />
    {/each}
  </div>
</div>
