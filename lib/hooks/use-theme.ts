import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('privacy-guardian-theme') as Theme
    if (savedTheme) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    
    const root = window.document.documentElement
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    // Determine the actual theme to apply
    const activeTheme = theme === 'system' ? systemTheme : theme
    setResolvedTheme(activeTheme)

    // Apply theme to document
    root.classList.remove('light', 'dark')
    root.classList.add(activeTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newTheme = e.matches ? 'dark' : 'light'
        setResolvedTheme(newTheme)
        root.classList.remove('light', 'dark')
        root.classList.add(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('privacy-guardian-theme', newTheme)
    }
  }

  return {
    theme,
    setTheme,
    resolvedTheme
  }
}