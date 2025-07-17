export interface IPv6Result {
  hasIPv6: boolean
  hasIPv6Leak: boolean
  ipv6Addresses: string[]
  ipv4Addresses: string[]
  isIPv6Disabled: boolean
  leakType?: string | null
  leakDetails?: string[]
  recommendations?: string[]
  locationData?: {
    ipv6: Array<{
      ip: string
      country: string
      city: string
      region: string
      isp: string
      latitude?: number
      longitude?: number
    }>
    ipv4: Array<{
      ip: string
      country: string
      city: string
      region: string
      isp: string
      latitude?: number
      longitude?: number
    }>
  }
  detectionSources?: {
    ipv6: Array<{
      ip?: string
      source: string
      success: boolean
      error?: string
    }>
    ipv4: Array<{
      ip?: string
      source: string
      success: boolean
      error?: string
    }>
  }
  error?: string
}

export async function detectIPv6Leak(): Promise<IPv6Result> {
  try {
    // 先执行客户端检测
    const clientTest = await performClientIPv6Test()
    
    // 通过 API 端点检测 IPv6
    const response = await fetch('/api/detect-ipv6')
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'IPv6 检测失败')
    }
    
    // 合并客户端和服务端结果
    const result = {
      ...data.data,
      clientTest,
      // 如果客户端检测到IPv6但服务端没有，可能存在配置问题
      configMismatch: clientTest.hasIPv6Support && !data.data.hasIPv6
    }
    
    // 添加额外的建议
    if (result.configMismatch) {
      result.recommendations = result.recommendations || []
      result.recommendations.push('客户端支持IPv6但服务端未检测到，请检查网络配置')
    }
    
    // 如果检测到WebRTC IPv6泄露，添加到泄露详情
    if (clientTest.webRTCIPv6) {
      result.leakDetails = result.leakDetails || []
      result.leakDetails.push('WebRTC正在泄露IPv6地址')
      result.hasIPv6Leak = true
    }
    
    return result
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

// 客户端IPv6测试
async function performClientIPv6Test(): Promise<{
  hasIPv6Support: boolean
  webRTCIPv6: boolean
  dnsIPv6: boolean
  isProtected: boolean
}> {
  const result = {
    hasIPv6Support: false,
    webRTCIPv6: false,
    dnsIPv6: false,
    isProtected: true
  }
  
  try {
    // 检测浏览器是否支持IPv6
    // 尝试连接到已知的IPv6测试服务器
    const ipv6TestUrls = [
      'https://v6.ipv6-test.com/api/myip.php',
      'https://ipv6.icanhazip.com'
    ]
    
    const ipv6Tests = await Promise.allSettled(
      ipv6TestUrls.map(url => 
        fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        })
      )
    )
    
    // 如果任何测试成功，说明支持IPv6
    result.hasIPv6Support = ipv6Tests.some(test => test.status === 'fulfilled')
    
    // WebRTC IPv6泄露检测
    if (typeof RTCPeerConnection !== 'undefined') {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        })
        
        pc.createDataChannel('')
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        
        // 收集IPv6候选
        const ipv6Candidates = await new Promise<string[]>((resolve) => {
          const candidates: string[] = []
          let timeout: NodeJS.Timeout
          
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              const candidate = event.candidate.candidate
              // 检查是否包含IPv6地址
              const ipv6Match = candidate.match(/([0-9a-fA-F:]+:+[0-9a-fA-F:]+)/)
              if (ipv6Match) {
                candidates.push(ipv6Match[1])
              }
            }
          }
          
          pc.onicegatheringstatechange = () => {
            if (pc.iceGatheringState === 'complete') {
              clearTimeout(timeout)
              resolve(candidates)
            }
          }
          
          timeout = setTimeout(() => resolve(candidates), 3000)
        })
        
        pc.close()
        
        if (ipv6Candidates.length > 0) {
          result.webRTCIPv6 = true
          result.isProtected = false
        }
      } catch (error) {
        console.error('WebRTC IPv6检测失败:', error)
      }
    }
    
    // DNS IPv6检测 - 检查是否返回AAAA记录
    try {
      // 使用一个已知同时有IPv4和IPv6的域名
      const testDomain = 'ipv6.google.com'
      const img = new Image()
      img.src = `https://${testDomain}/favicon.ico?t=${Date.now()}`
      
      // 如果能够加载，可能使用了IPv6
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        setTimeout(reject, 2000)
      })
      
      // 如果成功加载且支持IPv6，可能有DNS IPv6
      if (result.hasIPv6Support) {
        result.dnsIPv6 = true
      }
    } catch {
      // 加载失败是正常的
    }
    
  } catch (error) {
    console.error('客户端IPv6测试失败:', error)
  }
  
  return result
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