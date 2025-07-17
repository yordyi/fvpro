'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Home, 
  Activity, 
  Clock, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

// 导航项数据
const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/results', label: '检测结果', icon: Activity },
  { href: '/history', label: '历史记录', icon: Clock },
]

// 汉堡菜单按钮
export function MobileMenuButton({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-lg hover:bg-background-secondary transition-colors"
      aria-label="Toggle menu"
    >
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.div>
    </button>
  )
}

// 移动端侧边菜单
export function MobileSideMenu({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
          
          {/* 侧边菜单 */}
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 bg-background-secondary z-50 shadow-xl md:hidden"
          >
            {/* 头部 */}
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-primary rounded-lg">
                    <Shield size={24} />
                  </div>
                  <span className="text-lg font-semibold">Privacy Guardian</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* 导航项 */}
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      isActive ? [
                        "bg-accent-primary text-white",
                        "shadow-md"
                      ] : [
                        "hover:bg-background-tertiary",
                        "text-text-secondary hover:text-text-primary"
                      ]
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </Link>
                )
              })}
            </div>
            
            {/* 底部信息 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border-primary">
              <div className="text-center text-sm text-text-muted">
                <p>隐私保护专家</p>
                <p className="mt-1">v1.0.0</p>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

// 底部导航栏
export function BottomNav() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border-primary z-30 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
                "relative group",
                isActive ? "text-accent-primary" : "text-text-muted"
              )}
            >
              {/* 活动指示器 */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full"
                />
              )}
              
              {/* 图标 */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon size={24} />
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-accent-primary/20 rounded-full blur-xl"
                  />
                )}
              </motion.div>
              
              {/* 标签 */}
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      
      {/* iPhone安全区域 */}
      <div className="h-safe-area-inset-bottom bg-background-secondary" />
    </nav>
  )
}

// 触摸手势支持
export function useTouchGestures(onSwipeRight?: () => void) {
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }
    
    const handleSwipe = () => {
      if (touchEndX - touchStartX > 50 && touchStartX < 50) {
        onSwipeRight?.()
      }
    }
    
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeRight])
}