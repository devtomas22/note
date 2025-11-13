/**
 * Hypothetical Backend API for Jupyter Clone
 *
 * This module defines the interface for communicating with a Jupyter kernel backend.
 * In a real implementation, this would connect to:
 * - Jupyter Kernel Gateway (https://jupyter-kernel-gateway.readthedocs.io/)
 * - JupyterLab Server
 * - Custom kernel implementation
 *
 * Communication Protocol:
 * - Uses WebSocket for real-time kernel communication
 * - REST API for notebook management (CRUD operations)
 * - Follows Jupyter messaging protocol specification
 */

export interface KernelInfo {
  id: string
  name: string
  language: string
  status: 'idle' | 'busy' | 'starting' | 'dead'
}

export interface ExecutionResult {
  execution_count: number
  outputs: CellOutput[]
  execution_time?: number
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

export interface NotebookMetadata {
  id: string
  name: string
  path: string
  created_at: string
  modified_at: string
  kernel: KernelInfo
}

/**
 * Backend API Client
 *
 * Hypothetical implementation that would connect to:
 * - POST /api/kernels - Start a new kernel
 * - GET /api/kernels/{id} - Get kernel status
 * - DELETE /api/kernels/{id} - Shutdown kernel
 * - WS /api/kernels/{id}/channels - WebSocket for kernel communication
 * - POST /api/execute - Execute code in kernel
 * - GET /api/notebooks - List notebooks
 * - POST /api/notebooks - Create new notebook
 * - PUT /api/notebooks/{id} - Update notebook
 * - DELETE /api/notebooks/{id} - Delete notebook
 */
export class JupyterBackendAPI {
  private ws: WebSocket | null = null

  constructor(private baseUrl = 'http://localhost:8888') {
    // baseUrl will be used for REST API calls in production
  }

  /**
   * Start a new kernel session
   * Real implementation would make POST request to /api/kernels
   */
  async startKernel(language = 'python'): Promise<KernelInfo> {
    // Simulated implementation
    // biome-ignore lint/suspicious/noConsole: Demo logging
    console.log(`[Backend API] Starting ${language} kernel at ${this.baseUrl}...`)

    // In real implementation:
    // const response = await fetch(`${this.baseUrl}/api/kernels`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: language })
    // })
    // return await response.json()

    return {
      id: `kernel-${Date.now()}`,
      name: language,
      language,
      status: 'idle',
    }
  }

  /**
   * Connect to kernel via WebSocket
   * Real implementation would establish WebSocket connection
   */
  connectToKernel(kernelId: string): void {
    // biome-ignore lint/suspicious/noConsole: Demo logging
    console.log(`[Backend API] Connecting to kernel ${kernelId}...`)

    // In real implementation:
    // this.ws = new WebSocket(`ws://localhost:8888/api/kernels/${kernelId}/channels`)
    // this.ws.onmessage = (event) => {
    //   const message = JSON.parse(event.data)
    //   this.handleKernelMessage(message)
    // }
  }

  /**
   * Execute code in the kernel
   * Real implementation would send execute_request message via WebSocket
   */
  async executeCode(code: string, _kernelId: string): Promise<ExecutionResult> {
    // biome-ignore lint/suspicious/noConsole: Demo logging
    console.log(`[Backend API] Executing code:`, code)

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // In real implementation:
    // const msgId = uuid()
    // const message = {
    //   header: {
    //     msg_id: msgId,
    //     msg_type: 'execute_request',
    //   },
    //   content: {
    //     code,
    //     silent: false,
    //     store_history: true,
    //   }
    // }
    // this.ws?.send(JSON.stringify(message))
    // return new Promise((resolve) => {
    //   this.executionCallbacks.set(msgId, resolve)
    // })

    // Simulated result
    return this.simulateExecution(code)
  }

  /**
   * Simulate code execution for demo purposes
   */
  private simulateExecution(code: string): ExecutionResult {
    const outputs: CellOutput[] = []

    // Simple simulation of Python code
    if (code.includes('print(')) {
      const match = code.match(/print\((.*)\)/)
      if (match) {
        outputs.push({
          output_type: 'stream',
          name: 'stdout',
          text: `${match[1].replace(/['"]/g, '')}\n`,
        })
      }
    } else if (code.includes('import')) {
      // Import statements produce no output
      // biome-ignore lint/complexity/noUselessEscapeInRegex: Escaped characters for clarity
    } else if (code.trim().match(/^\d+\s*[\+\-\*\/]\s*\d+$/)) {
      // Simple math expression
      try {
        // biome-ignore lint/security/noGlobalEval: simulation only
        const result = eval(code.trim())
        outputs.push({
          output_type: 'execute_result',
          text: String(result),
        })
      } catch (_e) {
        outputs.push({
          output_type: 'error',
          ename: 'SyntaxError',
          evalue: 'Invalid syntax',
          traceback: ['  File "<stdin>", line 1', `    ${code}`, '    ^', 'SyntaxError: invalid syntax'],
        })
      }
    } else if (code.trim()) {
      // Other code - simulate output
      outputs.push({
        output_type: 'execute_result',
        text: `Executed: ${code.substring(0, 50)}${code.length > 50 ? '...' : ''}`,
      })
    }

    return {
      execution_count: Math.floor(Math.random() * 100) + 1,
      outputs,
      execution_time: Math.random() * 1000,
    }
  }

  /**
   * Shutdown kernel
   * Real implementation would make DELETE request to /api/kernels/{id}
   */
  async shutdownKernel(kernelId: string): Promise<void> {
    // biome-ignore lint/suspicious/noConsole: Demo logging
    console.log(`[Backend API] Shutting down kernel ${kernelId}...`)

    // In real implementation:
    // await fetch(`${this.baseUrl}/api/kernels/${kernelId}`, {
    //   method: 'DELETE'
    // })

    this.ws?.close()
    this.ws = null
  }

  /**
   * Save notebook to backend
   * Real implementation would make PUT request to /api/notebooks/{id}
   */
  async saveNotebook(notebook: unknown): Promise<void> {
    // biome-ignore lint/suspicious/noConsole: Demo logging
    console.log('[Backend API] Saving notebook...', notebook)

    // In real implementation:
    // await fetch(`${this.baseUrl}/api/notebooks/${notebook.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(notebook)
    // })
  }

  /**
   * Load notebook from backend
   * Real implementation would make GET request to /api/notebooks/{id}
   */
  async loadNotebook(notebookId: string): Promise<unknown> {
    // biome-ignore lint/suspicious/noConsole: Demo logging
    console.log(`[Backend API] Loading notebook ${notebookId}...`)

    // In real implementation:
    // const response = await fetch(`${this.baseUrl}/api/notebooks/${notebookId}`)
    // return await response.json()

    return null
  }
}

// Singleton instance
export const backendAPI = new JupyterBackendAPI()
