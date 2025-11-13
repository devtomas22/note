<script lang="ts">
  interface Props {
    onAddCodeCell: () => void
    onAddMarkdownCell: () => void
    onSave: () => void
    onRunAll: () => void
    onClearOutputs: () => void
  }

  let { onAddCodeCell, onAddMarkdownCell, onSave, onRunAll, onClearOutputs }: Props = $props()
</script>

<div class="notebook-toolbar">
  <button type="button" class="toolbar-button" onclick={onSave} title="Save notebook (Ctrl+S)">
    <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Save">
      <path
        fill="currentColor"
        d="M13.5 0h-12C.67 0 0 .67 0 1.5v13c0 .83.67 1.5 1.5 1.5h12c.83 0 1.5-.67 1.5-1.5v-13c0-.83-.67-1.5-1.5-1.5zM13 14H2V2h11v12zM11 3H4v5h7V3z"
      />
    </svg>
    Save
  </button>

  <div class="toolbar-separator"></div>

  <button type="button" class="toolbar-button" onclick={onAddCodeCell} title="Insert cell below">
    <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Add code cell">
      <path fill="currentColor" d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" />
    </svg>
    + Code
  </button>

  <button type="button" class="toolbar-button" onclick={onAddMarkdownCell} title="Insert markdown cell">
    <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Add markdown cell">
      <path
        fill="currentColor"
        d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"
      />
    </svg>
    + Markdown
  </button>

  <div class="toolbar-separator"></div>

  <button type="button" class="toolbar-button" onclick={onRunAll} title="Run all cells">
    <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Run all cells">
      <path fill="currentColor" d="M2 2l12 6-12 6z" />
    </svg>
    Run All
  </button>

  <button type="button" class="toolbar-button" onclick={onClearOutputs} title="Clear all outputs">
    <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Clear outputs">
      <path fill="currentColor" d="M14 2H9L7 0H2v14h12z" opacity="0.6" />
      <path fill="currentColor" d="M11 6l-4 4M7 6l4 4" stroke="currentColor" stroke-width="2" />
    </svg>
    Clear Outputs
  </button>

  <div class="toolbar-separator"></div>

  <div class="toolbar-help">
    <span class="keyboard-hint">
      Shift+Enter: Run cell | Ctrl+Enter: Run cell (stay) | Alt+Enter: Run and insert below
    </span>
  </div>
</div>
