'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Menu, X, ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'

// 导航链接数据
const navLinks = [
  { name: '隐私检测', href: '/' },
  { name: '检测结果', href: '/results' },
  { name: '历史记录', href: '/history' },
  { 
    name: '资源', 
    href: '#',
    dropdown: [
      { name: '用户指南', href: '/guide' },
      { name: '隐私教育', href: '/education' },
      { name: '常见问题', href: '/faq' },
      { name: '设计系统', href: '/design-system' }
    ]
  },
  { name: '关于', href: '/about' }
]

// 下拉菜单组件
function DropdownMenu({ item, isOpen, onToggle }: { 
  item: typeof navLinks[2]; 
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

// 移动端菜单组件
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* 菜单面板 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-background-secondary/95 backdrop-blur-md border-l border-border-primary z-50"
          >
            <div className="p-6">
              {/* 关闭按钮 */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* 菜单链接 */}
              <nav className="space-y-6">
                {navLinks.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="space-y-2">
                        <div className="privacy-text-body font-medium text-text-primary">{item.name}</div>
                        <div className="pl-4 space-y-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block privacy-text-body text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors py-1"
                              onClick={onClose}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block privacy-text-body text-lg hover:text-primary transition-colors py-2"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

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
              Privacy Guardian
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
            <ThemeToggle />
          </nav>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* 移动端菜单 */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}