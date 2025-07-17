'use client'

import { useState, useEffect } from 'react'

// 预定义的断点
export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  largeDesktop: '(min-width: 1440px)',
  
  // 方向
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // 设备特性
  touchDevice: '(hover: none) and (pointer: coarse)',
  mouseDevice: '(hover: hover) and (pointer: fine)',
  
  // 动画偏好
  reducedMotion: '(prefers-reduced-motion: reduce)',
  
  // 颜色模式
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  
  // 高DPI
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
} as const

// 单个媒体查询hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    // 检查是否在客户端
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleChange)
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [query])
  
  return matches
}

// 多个媒体查询hook
export function useMediaQueries<T extends Record<string, string>>(
  queries: T
): Record<keyof T, boolean> {
  const [matches, setMatches] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  )
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQueries = Object.entries(queries).map(([key, query]) => ({
      key,
      mq: window.matchMedia(query as string)
    }))
    
    // 初始化匹配状态
    const initialMatches = mediaQueries.reduce((acc, { key, mq }) => {
      acc[key as keyof T] = mq.matches
      return acc
    }, {} as Record<keyof T, boolean>)
    
    setMatches(initialMatches)
    
    // 创建处理函数
    const handlers = mediaQueries.map(({ key, mq }) => {
      const handler = (e: MediaQueryListEvent) => {
        setMatches(prev => ({ ...prev, [key]: e.matches }))
      }
      
      if (mq.addEventListener) {
        mq.addEventListener('change', handler)
      } else {
        mq.addListener(handler)
      }
      
      return { mq, handler }
    })
    
    // 清理函数
    return () => {
      handlers.forEach(({ mq, handler }) => {
        if (mq.removeEventListener) {
          mq.removeEventListener('change', handler)
        } else {
          mq.removeListener(handler)
        }
      })
    }
  }, [queries])
  
  return matches
}

// 响应式断点hook
export function useBreakpoint() {
  const queries = useMediaQueries({
    isMobile: breakpoints.mobile,
    isTablet: breakpoints.tablet,
    isDesktop: breakpoints.desktop,
    isLargeDesktop: breakpoints.largeDesktop
  })
  
  return {
    ...queries,
    // 便捷方法
    isMobileOrTablet: queries.isMobile || queries.isTablet,
    isDesktopOrLarger: queries.isDesktop || queries.isLargeDesktop
  }
}

// 设备特性hook
export function useDeviceFeatures() {
  return useMediaQueries({
    isTouchDevice: breakpoints.touchDevice,
    isMouseDevice: breakpoints.mouseDevice,
    isRetina: breakpoints.retina,
    prefersReducedMotion: breakpoints.reducedMotion,
    prefersDarkMode: breakpoints.darkMode,
    prefersLightMode: breakpoints.lightMode,
    isPortrait: breakpoints.portrait,
    isLandscape: breakpoints.landscape
  })
}