'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { MobileMenuButton, MobileSideMenu, useTouchGestures } from './mobile-nav'

function useNavLinks() {
  const t = useTranslations('navigation')
  
  return [
    { name: t('home'), href: '/' },
    { name: t('results'), href: '/results' },
    { name: t('history'), href: '/history' },
    { 
      name: t('resources'), 
      href: '#',
      dropdown: [
        { name: t('guide'), href: '/guide' },
        { name: t('education'), href: '/education' },
        { name: t('faq'), href: '/faq' },
        { name: t('design'), href: '/design-system' }
      ]
    },
    { name: t('about'), href: '/about' }
  ]
}

// 下拉菜单组件
function DropdownMenu({ item, isOpen, onToggle }: { 
  item: any; 
  isOpen: boolean; 
  onToggle: () => void 
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 privacy-text-body text-sm font-medium hover:text-primary transition-colors"
      >
        {item.name}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-48 bg-background-secondary/95 backdrop-blur-md border border-border-primary rounded-xl shadow-lg overflow-hidden"
          >
            {item.dropdown?.map((dropdownItem) => (
              <Link
                key={dropdownItem.name}
                href={dropdownItem.href}
                className="block px-4 py-3 privacy-text-body text-sm hover:bg-background-tertiary hover:text-primary transition-colors"
                onClick={() => onToggle()}
              >
                {dropdownItem.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export function Header() {
  const t = useTranslations('app')
  const navLinks = useNavLinks()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  // 触摸手势支持
  useTouchGestures(() => setIsMobileMenuOpen(true))

  // 监听滚动以改变头部透明度
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 处理下拉菜单
  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background-secondary/90 backdrop-blur-md border-b border-border-primary shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm"
            >
              <Shield className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="privacy-text-heading text-xl font-bold">
              {t('title')}
            </span>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <div key={item.name} onClick={(e) => e.stopPropagation()}>
                {item.dropdown ? (
                  <DropdownMenu 
                    item={item} 
                    isOpen={activeDropdown === item.name}
                    onToggle={() => handleDropdownToggle(item.name)}
                  />
                ) : (
                  <Link 
                    href={item.href} 
                    className="privacy-text-body text-sm font-medium hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <LanguageToggle />
            <ThemeToggle />
          </nav>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            <MobileMenuButton 
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </motion.header>

      {/* 移动端菜单 */}
      <MobileSideMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}