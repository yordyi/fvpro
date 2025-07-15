'use client'

import React from 'react'
import { AlertTriangle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} reset={this.reset} />
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          出错了
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {error.message || '发生了意外错误'}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="default">
            重试
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            刷新页面
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left text-sm text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer">错误详情</summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export function DevToolsErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3">
            <Settings className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-yellow-900 dark:text-yellow-100">
          DevTools Error
        </h3>
        <p className="mb-4 text-sm text-yellow-700 dark:text-yellow-300">
          {error.message || 'Next.js DevTools encountered an error'}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="outline" size="sm">
            Retry
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
          >
            Reload
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-3 text-left text-xs text-yellow-600 dark:text-yellow-400">
            <summary className="cursor-pointer">DevTools Stack Trace</summary>
            <pre className="mt-2 overflow-auto rounded bg-yellow-100 dark:bg-yellow-800/20 p-2 text-xs">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}