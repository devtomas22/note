export type CellType = 'code' | 'markdown'

export interface Cell {
  id: string
  type: CellType
  content: string
  outputs?: CellOutput[]
  executionCount?: number
  metadata?: Record<string, unknown>
}

export interface CellOutput {
  output_type: 'stream' | 'execute_result' | 'display_data' | 'error'
  name?: string
  text?: string
  data?: Record<string, unknown>
  ename?: string
  evalue?: string
  traceback?: string[]
}

export interface Notebook {
  id: string
  name: string
  cells: Cell[]
  metadata: {
    kernelspec: {
      name: string
      language: string
    }
  }
}
