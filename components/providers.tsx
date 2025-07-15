'use client'

import { ErrorBoundary } from '@/components/error-boundary'
import { ToastContainer } from '@/components/ui/toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <ToastContainer />
    </ErrorBoundary>
  )
}