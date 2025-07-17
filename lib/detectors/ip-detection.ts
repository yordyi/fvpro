export interface IPInfo {
  ip: string
  source: string
}

export interface IPDetectionResult {
  clientIP: string
  detectedIPs: IPInfo[]
  isConsistent: boolean
  isVPN: boolean
  isProxy: boolean
  isTor: boolean
  isHosting: boolean
  location?: {
    country: string
    countryCode?: string
    city: string
    region: string
    timezone?: string
    latitude?: number
    longitude?: number
    isp?: string
  }
}

export async function detectIP(): Promise<IPDetectionResult> {
  try {
    // 调用我们的API端点
    const response = await fetch('/api/detect-ip')
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'IP detection failed')
    }
    
    return data.data
  } catch (error) {
    console.error('IP detection error:', error)
    throw error
  }
}

export function analyzeIPPrivacy(ips: Array<{ ip?: string; origin?: string; source?: string }>): {
  score: number
  issues: string[]
} {
  const issues: string[] = []
  let score = 100
  
  // 检查IP一致性
  const ipAddresses = ips.map(item => item.ip || item.origin).filter(Boolean)
  const uniqueIPs = new Set(ipAddresses)
  if (uniqueIPs.size > 1) {
    issues.push('检测到多个不同的IP地址，可能存在泄露')
    score -= 30
  }
  
  // 检查是否有本地IP泄露
  const hasLocalIP = ipAddresses.some(ip => 
    ip?.startsWith('192.168.') || 
    ip?.startsWith('10.') || 
    ip?.startsWith('172.')
  )
  
  if (hasLocalIP) {
    issues.push('检测到本地IP地址泄露')
    score -= 20
  }
  
  return { score: Math.max(0, score), issues }
}