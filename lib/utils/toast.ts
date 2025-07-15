import { Toast, ToastType } from '@/components/ui/toast'

export function showToast(options: Omit<Toast, 'id'>) {
  if (typeof window === 'undefined') {
    return
  }
  
  const toast: Toast = {
    ...options,
    id: Math.random().toString(36).substring(2, 9),
  }

  const event = new CustomEvent('show-toast', { detail: toast })
  window.dispatchEvent(event)
}

export const toast = {
  success: (title: string, description?: string) =>
    showToast({ type: 'success', title, description }),
  error: (title: string, description?: string) =>
    showToast({ type: 'error', title, description }),
  warning: (title: string, description?: string) =>
    showToast({ type: 'warning', title, description }),
  info: (title: string, description?: string) =>
    showToast({ type: 'info', title, description }),
}