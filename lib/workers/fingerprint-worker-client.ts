// Web Worker client for fingerprint detection

export class FingerprintWorkerClient {
  private worker: Worker | null = null
  private messageId = 0
  private pendingCallbacks = new Map<number, { resolve: Function; reject: Function }>()

  constructor() {
    if (typeof window !== 'undefined' && window.Worker) {
      try {
        this.worker = new Worker('/workers/fingerprint.worker.js')
        this.worker.addEventListener('message', this.handleMessage.bind(this))
        this.worker.addEventListener('error', this.handleError.bind(this))
      } catch (error) {
        console.warn('Failed to initialize Web Worker:', error)
      }
    }
  }

  private handleMessage(event: MessageEvent) {
    const { type, data, error, id } = event.data
    
    if (id && this.pendingCallbacks.has(id)) {
      const callback = this.pendingCallbacks.get(id)!
      this.pendingCallbacks.delete(id)
      
      if (error) {
        callback.reject(new Error(error))
      } else {
        callback.resolve(data)
      }
    }
  }

  private handleError(error: ErrorEvent) {
    console.error('Worker error:', error)
    // Reject all pending callbacks
    this.pendingCallbacks.forEach(callback => {
      callback.reject(new Error('Worker error'))
    })
    this.pendingCallbacks.clear()
  }

  private postMessage<T>(type: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'))
        return
      }

      const id = ++this.messageId
      this.pendingCallbacks.set(id, { resolve, reject })
      
      // Set timeout to prevent hanging
      const timeout = setTimeout(() => {
        if (this.pendingCallbacks.has(id)) {
          this.pendingCallbacks.delete(id)
          reject(new Error('Worker timeout'))
        }
      }, 5000)

      this.worker.postMessage({ type, data, id })
      
      // Clear timeout on response
      const originalResolve = resolve
      resolve = (value) => {
        clearTimeout(timeout)
        originalResolve(value)
      }
    })
  }

  async generateCanvasFingerprint(): Promise<string> {
    if (!this.worker) {
      throw new Error('Worker not available')
    }
    
    return this.postMessage<string>('generateCanvas')
  }

  async calculateUniquenessScore(data: {
    canvas: string
    webgl: string
    audio: string
    fonts: string[]
    screen: string
  }): Promise<number> {
    if (!this.worker) {
      throw new Error('Worker not available')
    }
    
    return this.postMessage<number>('calculateScore', data)
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.pendingCallbacks.clear()
  }

  isAvailable(): boolean {
    return this.worker !== null
  }
}

// Singleton instance
let workerInstance: FingerprintWorkerClient | null = null

export function getFingerprintWorker(): FingerprintWorkerClient {
  if (!workerInstance) {
    workerInstance = new FingerprintWorkerClient()
  }
  return workerInstance
}

export function terminateFingerprintWorker() {
  if (workerInstance) {
    workerInstance.terminate()
    workerInstance = null
  }
}