export interface DNSResult {
  hasDNSLeak: boolean
  dnsServers: string[]
  isUsingVPNDNS: boolean
  dnsLocation?: {
    country: string
    city: string
    isp: string
  }
  error?: string
}

// DNS 检测服务列表
const DNS_CHECK_SERVICES = [
  'https://dnsleaktest.com/api',
  'https://ipleak.net/api',
  'https://browserleaks.com/api'
]

export async function detectDNSLeak(): Promise<DNSResult> {
  try {
    // 通过我们的 API 路由进行 DNS 检测
    const response = await fetch('/api/detect-dns')
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'DNS 检测失败')
    }
    
    return data.data
  } catch (error) {
    console.error('DNS 检测错误:', error)
    return {
      hasDNSLeak: false,
      dnsServers: [],
      isUsingVPNDNS: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

export function analyzeDNSPrivacy(dnsResult: DNSResult, ipLocation?: { country: string }): {
  score: number
  issues: string[]
} {
  const issues: string[] = []
  let score = 100
  
  // 检查是否有 DNS 泄露
  if (dnsResult.hasDNSLeak) {
    issues.push('检测到 DNS 泄露，您的 DNS 查询可能暴露您的真实位置')
    score -= 40
  }
  
  // 检查是否使用 VPN 的 DNS
  if (!dnsResult.isUsingVPNDNS && ipLocation) {
    issues.push('您未使用 VPN 提供的 DNS 服务器')
    score -= 20
  }
  
  // 检查 DNS 服务器数量
  if (dnsResult.dnsServers.length > 2) {
    issues.push('检测到多个 DNS 服务器，可能存在隐私风险')
    score -= 10
  }
  
  // 检查位置一致性
  if (dnsResult.dnsLocation && ipLocation && 
      dnsResult.dnsLocation.country !== ipLocation.country) {
    issues.push('DNS 服务器位置与 IP 地址位置不一致')
    score -= 15
  }
  
  // 检查是否使用已知的隐私 DNS
  const privacyDNSProviders = [
    'Cloudflare',
    'Quad9',
    'NextDNS',
    'AdGuard'
  ]
  
  if (dnsResult.dnsLocation?.isp && 
      privacyDNSProviders.some(provider => 
        dnsResult.dnsLocation!.isp.includes(provider))) {
    score += 10 // 使用隐私 DNS 加分
  }
  
  return { 
    score: Math.max(0, Math.min(100, score)), 
    issues 
  }
}