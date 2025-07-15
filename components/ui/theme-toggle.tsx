'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/lib/hooks/use-theme'
import { Button } from './button'
import { useState, useRef, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const Icon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9"
        aria-label="Toggle theme"
      >
        <Icon className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              className={`flex w-full items-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => {
                setTheme('light')
                setIsOpen(false)
              }}
            >
              <Sun className="mr-2 h-4 w-4" />
              浅色
            </button>
            <button
              className={`flex w-full items-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => {
                setTheme('dark')
                setIsOpen(false)
              }}
            >
              <Moon className="mr-2 h-4 w-4" />
              深色
            </button>
            <button
              className={`flex w-full items-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => {
                setTheme('system')
                setIsOpen(false)
              }}
            >
              <Monitor className="mr-2 h-4 w-4" />
              系统
            </button>
          </div>
        </div>
      )}
    </div>
  )
}