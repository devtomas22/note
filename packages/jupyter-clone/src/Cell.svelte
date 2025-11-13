<script lang="ts">
  import { onMount } from 'svelte'
  import type { Cell as CellType } from './types'

  interface Props {
    cell: CellType
    isSelected: boolean
    onSelect: () => void
    onUpdate: (content: string) => void
    onExecute: () => void
    onDelete: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    onAddBelow: () => void
  }

  let { cell, isSelected, onSelect, onUpdate, onExecute, onDelete, onMoveUp, onMoveDown, onAddBelow }: Props = $props()
  
  let isEditing = $state(false)
  let textareaEl = $state<HTMLTextAreaElement>()

  function autoResize() {
    if (textareaEl) {
      textareaEl.style.height = 'auto'
      textareaEl.style.height = `${textareaEl.scrollHeight}px`
    }
  }

  onMount(() => {
    if (textareaEl) {
      autoResize()
    }
  })

  function handleKeyDown(e: KeyboardEvent) {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      onExecute()
    } else if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      onExecute()
    } else if (e.altKey && e.key === 'Enter') {
      e.preventDefault()
      onExecute()
      onAddBelow()
    }
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement
    onUpdate(target.value)
    autoResize()
  }

  function renderMarkdown(content: string): string {
    if (!content) {
      return '<div class="empty-markdown">Double-click to edit</div>'
    }
    
    // Simple markdown rendering (in real app, use marked or similar)
    return content
      .split('\n')
      .map(line => {
        if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`
        if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`
        if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`
        if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`
        if (line.trim() === '') return '<br/>'
        return `<p>${line}</p>`
      })
      .join('')
  }
</script>

<div 
  class={`cell ${cell.type}-cell ${isSelected ? 'selected' : ''}`} 
  onclick={onSelect} 
  onkeydown={(e) => e.key === 'Enter' && onSelect()}
  role="button" 
  tabindex="0"
>
  <div class="cell-toolbar">
    <div class="cell-actions">
      {#if cell.type === 'code'}
        <button type="button" class="cell-button" onclick={onExecute} title="Run cell (Shift+Enter)">
          ▶
        </button>
      {/if}
      <button type="button" class="cell-button" onclick={onMoveUp} title="Move cell up">
        ↑
      </button>
      <button type="button" class="cell-button" onclick={onMoveDown} title="Move cell down">
        ↓
      </button>
      <button type="button" class="cell-button delete" onclick={onDelete} title="Delete cell">
        🗑
      </button>
    </div>
  </div>

  <div class="cell-container">
    {#if cell.type === 'code'}
      <div class="cell-input-area">
        <div class="cell-prompt">
          {cell.executionCount ? `[${cell.executionCount}]` : '[ ]'}
        </div>
        <textarea
          bind:this={textareaEl}
          class="cell-input"
          value={cell.content}
          oninput={handleInput}
          onkeydown={handleKeyDown}
          placeholder="Enter Python code..."
          spellcheck={false}
          onfocus={() => (isEditing = true)}
          onblur={() => (isEditing = false)}
        ></textarea>
      </div>
    {/if}

    {#if cell.type === 'markdown' && !isEditing}
      <div
        class="markdown-view"
        ondblclick={() => (isEditing = true)}
        onkeydown={(e) => e.key === 'Enter' && (isEditing = true)}
        role="button"
        tabindex="0"
      >
        {@html renderMarkdown(cell.content)}
      </div>
    {/if}

    {#if cell.type === 'markdown' && isEditing}
      <textarea
        bind:this={textareaEl}
        class="markdown-input"
        value={cell.content}
        oninput={handleInput}
        onblur={() => (isEditing = false)}
        placeholder="Enter Markdown..."
        spellcheck={false}
      ></textarea>
    {/if}

    {#if cell.type === 'code' && cell.outputs && cell.outputs.length > 0}
      <div class="cell-output-area">
        <div class="cell-prompt output-prompt">
          {cell.executionCount ? `[${cell.executionCount}]` : ''}
        </div>
        <div class="cell-output">
          {#each cell.outputs as output}
            <div class={`output output-${output.output_type}`}>
              {#if output.output_type === 'stream'}
                <pre class="output-text">{output.text}</pre>
              {/if}
              {#if output.output_type === 'execute_result'}
                <pre class="output-result">{output.text}</pre>
              {/if}
              {#if output.output_type === 'error'}
                <div class="output-error">
                  <div class="error-name">{output.ename}: {output.evalue}</div>
                  {#if output.traceback}
                    <pre class="traceback">{output.traceback.join('\n')}</pre>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
