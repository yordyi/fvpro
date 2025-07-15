export interface IPv6Result {
  hasIPv6: boolean
  hasIPv6Leak: boolean
  ipv6Addresses: string[]
  ipv4Addresses: string[]
  isIPv6Disabled: boolean
  error?: string
}

export async function detectIPv6Leak(): Promise<IPv6Result> {
  try {
    // 通过 API 端点检测 IPv6
    const response = await fetch('/api/detect-ipv6')
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'IPv6 检测失败')
    }
    
    return data.data
  } catch (error) {
    console.error('IPv6 检测错误:', error)
    return {
      hasIPv6: false,
      hasIPv6Leak: false,
      ipv6Addresses: [],
      ipv4Addresses: [],
      isIPv6Disabled: true,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

export function analyzeIPv6Privacy(ipv6Result: IPv6Result): {
  score: number
  issues: string[]
} {
  const issues: string[] = []
  let score = 100
  
  // 如果检测到 IPv6 泄露
  if (ipv6Result.hasIPv6Leak) {
    issues.push('检测到 IPv6 地址泄露，可能暴露您的真实位置')
    score -= 40
  }
  
  // 如果同时有 IPv4 和 IPv6，可能存在双栈泄露
  if (ipv6Result.ipv4Addresses.length > 0 && ipv6Result.ipv6Addresses.length > 0) {
    issues.push('检测到双栈配置（IPv4 + IPv6），增加了追踪风险')
    score -= 20
  }
  
  // 如果 IPv6 地址包含 MAC 地址信息（EUI-64）
  const hasEUI64 = ipv6Result.ipv6Addresses.some(addr => {
    // 检查是否包含 ff:fe 模式，这是 EUI-64 的特征
    return addr.includes('ff:fe') || addr.includes('fffe')
  })
  
  if (hasEUI64) {
    issues.push('IPv6 地址可能包含设备 MAC 地址信息')
    score -= 25
  }
  
  // 如果完全禁用了 IPv6，这实际上是好事
  if (ipv6Result.isIPv6Disabled) {
    score = Math.min(100, score + 10)
  }
  
  // 检查是否使用临时 IPv6 地址
  const hasTemporaryAddr = ipv6Result.ipv6Addresses.some(addr => {
    // 临时地址通常更频繁地改变，提供更好的隐私
    return !addr.startsWith('fe80:') && // 排除链路本地地址
           !hasEUI64 // 不包含 EUI-64
  })
  
  if (ipv6Result.hasIPv6 && !hasTemporaryAddr) {
    issues.push('未使用 IPv6 临时地址，降低了隐私保护')
    score -= 15
  }
  
  return { 
    score: Math.max(0, Math.min(100, score)), 
    issues 
  }
}

// 检查是否为 IPv6 地址
export function isIPv6(address: string): boolean {
  // 简化的 IPv6 正则表达式
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
  
  return ipv6Regex.test(address)
}