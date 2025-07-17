'use client'

import { Languages } from 'lucide-react'
import { Button } from './button'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export function LanguageToggle() {
  const t = useTranslations('language')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/'
    router.push(`/${newLocale}${currentPath}`)
    setIsOpen(false)
  }

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9"
        aria-label={t('switch')}
      >
        <Languages className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`flex w-full items-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  locale === lang.code ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}
                onClick={() => switchLocale(lang.code)}
              >
                <span className="mr-2 text-base">
                  {lang.code === 'en' ? '🇺🇸' : '🇨🇳'}
                </span>
                <span className="flex-1 text-left">{lang.nativeName}</span>
                {locale === lang.code && (
                  <span className="ml-2 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}