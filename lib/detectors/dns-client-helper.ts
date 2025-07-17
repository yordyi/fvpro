// DNS客户端检测辅助函数
// 用于在客户端执行DNS查询以检测DNS泄露

export interface DNSTestResult {
  testDomain: string
  resolvedIPs: string[]
  queryTime: number
  error?: string
}

// 生成随机的测试子域名
function generateTestSubdomain(): string {
  const randomString = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now()
  return `${randomString}-${timestamp}`
}

// DNS测试域名列表
const DNS_TEST_DOMAINS = [
  'whoami.akamai.net',
  'resolver-identity.netdna-ssl.com',
  'whoami.ultradns.net',
  'whoami.cloudflare.com'
]

// 执行DNS查询测试
export async function performDNSTest(testId: string): Promise<DNSTestResult[]> {
  const results: DNSTestResult[] = []
  
  for (const baseDomain of DNS_TEST_DOMAINS) {
    const testDomain = `${generateTestSubdomain()}.${baseDomain}`
    const startTime = performance.now()
    
    try {
      // 使用Image对象触发DNS查询
      const img = new Image()
      const loadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('DNS resolution failed'))
        
        // 设置超时
        setTimeout(() => reject(new Error('DNS query timeout')), 5000)
      })
      
      // 触发DNS查询
      img.src = `https://${testDomain}/1x1.gif?testId=${testId}`
      
      // 等待查询完成
      await loadPromise
      
      const queryTime = performance.now() - startTime
      
      results.push({
        testDomain: baseDomain,
        resolvedIPs: [], // 客户端无法直接获取解析的IP
        queryTime,
      })
    } catch (error) {
      results.push({
        testDomain: baseDomain,
        resolvedIPs: [],
        queryTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return results
}

// 使用WebRTC检测本地DNS配置
export async function detectLocalDNSServers(): Promise<string[]> {
  const servers: string[] = []
  
  try {
    // 创建RTCPeerConnection来检测网络配置
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    })
    
    // 创建数据通道触发ICE收集
    pc.createDataChannel('')
    
    // 收集ICE候选
    const candidates: string[] = []
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const parts = event.candidate.candidate.split(' ')
        if (parts[7] === 'host') {
          const ip = parts[4]
          if (ip && !candidates.includes(ip)) {
            candidates.push(ip)
          }
        }
      }
    }
    
    // 创建offer
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    
    // 等待ICE收集完成
    await new Promise<void>((resolve) => {
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') {
          resolve()
        }
      }
      
      // 超时处理
      setTimeout(resolve, 3000)
    })
    
    // 清理
    pc.close()
    
    // 分析候选地址，推断DNS配置
    for (const ip of candidates) {
      if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        // 本地网络地址，可能指向路由器DNS
        servers.push(`${ip.split('.').slice(0, 3).join('.')}.1`)
      }
    }
  } catch (error) {
    console.error('WebRTC DNS检测失败:', error)
  }
  
  return servers
}

// 检测DNS over HTTPS (DoH) 配置
export function detectDoHConfiguration(): {
  isEnabled: boolean
  provider?: string
} {
  // 检查浏览器是否启用了DoH
  const isSecureContext = window.isSecureContext
  const hasDoHSupport = 'doh' in navigator || isSecureContext
  
  // 尝试识别DoH提供商
  let provider: string | undefined
  
  // 通过性能API检查DNS查询特征
  if (window.performance && window.performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource')
    const dnsProviders = {
      'cloudflare-dns.com': 'Cloudflare',
      'dns.google': 'Google',
      'doh.opendns.com': 'OpenDNS',
      'dns.quad9.net': 'Quad9',
      'doh.cleanbrowsing.org': 'CleanBrowsing'
    }
    
    for (const resource of resources) {
      for (const [domain, name] of Object.entries(dnsProviders)) {
        if (resource.name.includes(domain)) {
          provider = name
          break
        }
      }
    }
  }
  
  return {
    isEnabled: hasDoHSupport && isSecureContext,
    provider
  }
}

// 综合DNS泄露检测
export async function comprehensiveDNSLeakTest(testId: string): Promise<{
  testResults: DNSTestResult[]
  localServers: string[]
  dohConfig: ReturnType<typeof detectDoHConfiguration>
  hasLeak: boolean
  leakIndicators: string[]
}> {
  const [testResults, localServers] = await Promise.all([
    performDNSTest(testId),
    detectLocalDNSServers()
  ])
  
  const dohConfig = detectDoHConfiguration()
  
  // 分析是否存在DNS泄露
  const leakIndicators: string[] = []
  let hasLeak = false
  
  // 检查本地DNS服务器
  if (localServers.length > 0) {
    leakIndicators.push('检测到使用本地网络DNS服务器')
    hasLeak = true
  }
  
  // 检查DNS查询时间差异
  const queryTimes = testResults.map(r => r.queryTime)
  const avgTime = queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length
  const variance = queryTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / queryTimes.length
  
  if (variance > 1000) {
    leakIndicators.push('DNS查询时间差异较大，可能存在多个DNS服务器')
    hasLeak = true
  }
  
  // 检查DoH配置
  if (!dohConfig.isEnabled) {
    leakIndicators.push('未启用DNS over HTTPS')
  }
  
  return {
    testResults,
    localServers,
    dohConfig,
    hasLeak,
    leakIndicators
  }
}