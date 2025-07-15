export interface WebRTCResult {
  hasLeak: boolean
  localIPs: string[]
  publicIPs: string[]
  error?: string
}

export async function detectWebRTCLeak(): Promise<WebRTCResult> {
  return new Promise((resolve) => {
    const localIPs: string[] = []
    const publicIPs: string[] = []

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })

      pc.createDataChannel('')
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => {})

      pc.onicecandidate = (event) => {
        if (!event.candidate) return

        const candidate = event.candidate.candidate
        const ipMatch = candidate.match(/([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)
        
        if (ipMatch) {
          const ip = ipMatch[0]
          
          // 判断是否为本地IP
          if (ip.startsWith('192.168.') || 
              ip.startsWith('10.') || 
              ip.startsWith('172.16.') ||
              ip.startsWith('fe80:') ||
              ip === '127.0.0.1' ||
              ip === '::1') {
            if (!localIPs.includes(ip)) {
              localIPs.push(ip)
            }
          } else {
            if (!publicIPs.includes(ip)) {
              publicIPs.push(ip)
            }
          }
        }
      }

      // 5秒后结束检测
      setTimeout(() => {
        pc.close()
        resolve({
          hasLeak: localIPs.length > 0 || publicIPs.length > 0,
          localIPs,
          publicIPs
        })
      }, 5000)

    } catch (error) {
      resolve({
        hasLeak: false,
        localIPs: [],
        publicIPs: [],
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  })
}

export function analyzeWebRTCPrivacy(result: WebRTCResult): {
  score: number
  issues: string[]
} {
  const issues: string[] = []
  let score = 100
  
  if (result.localIPs.length > 0) {
    issues.push(`检测到 ${result.localIPs.length} 个本地IP地址泄露`)
    score -= 40
  }
  
  if (result.publicIPs.length > 0) {
    issues.push(`检测到 ${result.publicIPs.length} 个公网IP地址泄露`)
    score -= 30
  }
  
  if (result.error) {
    issues.push(`WebRTC检测出错: ${result.error}`)
    score = 50 // 无法判断时给中等分数
  }
  
  return { score: Math.max(0, score), issues }
}