import { BrowserResult } from '@/lib/types/detection'

export async function detectBrowser(): Promise<BrowserResult> {
  const nav = window.navigator
  
  // 获取插件列表
  const plugins: string[] = []
  for (let i = 0; i < nav.plugins.length; i++) {
    plugins.push(nav.plugins[i].name)
  }
  
  // 检测隐私相关设置
  const doNotTrack = nav.doNotTrack === '1' || 
                     (nav as any).msDoNotTrack === '1' || 
                     (window as any).doNotTrack === '1'
  
  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    vendor: nav.vendor || 'unknown',
    language: nav.language,
    cookiesEnabled: nav.cookieEnabled,
    doNotTrack,
    hardwareConcurrency: nav.hardwareConcurrency || 0,
    deviceMemory: (nav as any).deviceMemory || 0,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    plugins
  }
}

export function analyzeBrowserPrivacy(browser: BrowserResult): {
  score: number
  issues: string[]
} {
  const issues: string[] = []
  let score = 100
  
  // 检查Do Not Track
  if (!browser.doNotTrack) {
    issues.push('未启用"请勿追踪"(Do Not Track)功能')
    score -= 10
  }
  
  // 检查Cookie
  if (browser.cookiesEnabled) {
    issues.push('已启用Cookie，可能被用于追踪')
    score -= 15
  }
  
  // 检查插件数量
  if (browser.plugins.length > 5) {
    issues.push(`检测到 ${browser.plugins.length} 个浏览器插件，可能增加指纹识别风险`)
    score -= 10
  }
  
  // 检查硬件信息暴露
  if (browser.hardwareConcurrency > 0) {
    issues.push('暴露了CPU核心数信息')
    score -= 5
  }
  
  if (browser.deviceMemory > 0) {
    issues.push('暴露了设备内存信息')
    score -= 5
  }
  
  // 检查用户代理字符串
  const ua = browser.userAgent.toLowerCase()
  if (ua.includes('chrome') && !ua.includes('edg')) {
    issues.push('使用Chrome浏览器，隐私保护较弱')
    score -= 10
  } else if (ua.includes('firefox')) {
    score += 5 // Firefox隐私保护较好，加分
  }
  
  return { score: Math.max(0, Math.min(100, score)), issues }
}