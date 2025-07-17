import { create } from 'zustand'
import { DetectionResults } from '@/lib/types/detection'
import { detectIP } from '@/lib/detectors/ip-detection'
import { detectWebRTCLeak } from '@/lib/detectors/webrtc-detection'
import { detectFingerprint } from '@/lib/detectors/fingerprint-detection'
import { detectBrowser } from '@/lib/detectors/browser-analysis'
import { detectDNSLeak } from '@/lib/detectors/dns-detection'
import { detectIPv6Leak } from '@/lib/detectors/ipv6-detection'
import { calculateSecurityScore } from '@/lib/utils/scoring'
import { toast } from '@/lib/utils/toast'
import { saveToHistory } from '@/lib/utils/storage'

interface DetectionItem {
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  error?: string
}

interface DetectionStore {
  isDetecting: boolean
  results: DetectionResults | null
  progress: number
  currentStep: string
  error: string | null
  detectionItems: DetectionItem[]
  startDetection: () => void
  updateProgress: (step: string, progress: number) => void
  setResults: (results: DetectionResults) => void
  resetDetection: () => void
  setError: (error: string) => void
  updateDetectionItem: (name: string, status: DetectionItem['status'], error?: string) => void
}

export const useDetectionStore = create<DetectionStore>((set, get) => ({
  isDetecting: false,
  results: null,
  progress: 0,
  currentStep: '',
  error: null,
  detectionItems: [],

  startDetection: async () => {
    set({ isDetecting: true, progress: 0, results: null, error: null })
    
    try {
      toast.info('开始隐私检测', '正在分析您的浏览器安全状况...')
      
      set({ currentStep: '正在并行执行所有检测...', progress: 10 })
      
      // 定义所有检测项
      const detectionTasks = [
        { name: 'IP地址检测', promise: detectIP(), weight: 1 },
        { name: 'WebRTC泄露检测', promise: detectWebRTCLeak(), weight: 1 },
        { name: 'DNS泄露检测', promise: detectDNSLeak(), weight: 1 },
        { name: 'IPv6泄露检测', promise: detectIPv6Leak(), weight: 1 },
        { name: '浏览器指纹分析', promise: detectFingerprint(), weight: 1.5 },
        { name: '浏览器信息收集', promise: detectBrowser(), weight: 0.5 }
      ]
      
      // 初始化检测项状态
      set({
        detectionItems: detectionTasks.map(({ name }) => ({
          name,
          status: 'pending',
          progress: 0
        }))
      })
      
      // 并行执行所有检测
      const detectionPromises = detectionTasks
      
      // 计算总权重
      const totalWeight = detectionPromises.reduce((sum, d) => sum + d.weight, 0)
      let completedWeight = 0
      const baseProgress = 10
      const progressRange = 80 // 10-90的范围
      
      // 包装每个 promise 以跟踪进度
      const wrappedPromises = detectionPromises.map(({ name, promise, weight }, index) => {
        // 开始检测时更新状态为 running
        get().updateDetectionItem(name, 'running')
        
        return promise
          .then(result => {
            completedWeight += weight
            const progress = baseProgress + (completedWeight / totalWeight) * progressRange
            set({ 
              currentStep: `已完成: ${name}`,
              progress: Math.round(progress)
            })
            // 更新检测项状态为完成
            get().updateDetectionItem(name, 'completed')
            return { status: 'fulfilled', value: result, index }
          })
          .catch(error => {
            completedWeight += weight
            const progress = baseProgress + (completedWeight / totalWeight) * progressRange
            set({ 
              currentStep: `${name} 失败`,
              progress: Math.round(progress)
            })
            console.error(`${name}失败:`, error)
            // 更新检测项状态为失败
            get().updateDetectionItem(name, 'failed', error.message)
            return { status: 'rejected', reason: error, index }
          })
      })
      
      // 等待所有检测完成
      const results = await Promise.all(wrappedPromises)
      
      set({ currentStep: '正在计算安全评分...', progress: 90 })
      
      // 提取结果，使用默认值处理失败的检测
      const [ipResult, webrtcResult, dnsResult, ipv6Result, fingerprintResult, browserResult] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          // 返回默认值
          switch (index) {
            case 0: // IP检测
              return {
                clientIP: 'Unknown',
                isConsistent: false,
                detectedIPs: [],
                location: null,
                isVPN: false,
                isProxy: false,
                isTor: false,
                isHosting: false
              }
            case 1: // WebRTC检测
              return {
                hasLeak: false,
                localIPs: [],
                publicIPs: [],
                error: result.reason?.message
              }
            case 2: // DNS检测
              return {
                hasDNSLeak: false,
                dnsServers: [],
                isUsingVPNDNS: false,
                recommendations: ['DNS检测失败，请检查网络连接']
              }
            case 3: // IPv6检测
              return {
                hasIPv6: false,
                hasIPv6Leak: false,
                ipv6Addresses: [],
                isIPv6Disabled: true,
                recommendations: ['IPv6检测失败，请检查网络连接']
              }
            case 4: // 指纹检测
              return {
                canvasFingerprint: '',
                webglFingerprint: '',
                audioFingerprint: '',
                fontFingerprint: [],
                screenFingerprint: '',
                uniquenessScore: 0
              }
            case 5: // 浏览器检测
              return {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                languages: navigator.languages || [],
                cookiesEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack === '1',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                screen: {
                  width: screen.width,
                  height: screen.height,
                  colorDepth: screen.colorDepth
                },
                plugins: []
              }
            default:
              return null
          }
        }
      })
      
      // 计算有多少检测失败
      const failedCount = results.filter(r => r.status === 'rejected').length
      
      const detectionResults: DetectionResults = {
        ip: ipResult as any,
        webrtc: webrtcResult as any,
        fingerprint: fingerprintResult as any,
        browser: browserResult as any,
        dns: dnsResult as any,
        ipv6: ipv6Result as any,
        score: calculateSecurityScore({
          ipResult: ipResult as any,
          webrtcResult: webrtcResult as any,
          fingerprintResult: fingerprintResult as any,
          browserResult: browserResult as any,
          dnsResult: dnsResult as any,
          ipv6Result: ipv6Result as any
        }),
        timestamp: new Date().toISOString()
      }

      set({ 
        results: detectionResults, 
        isDetecting: false, 
        progress: 100,
        currentStep: '检测完成'
      })
      
      // 保存到历史记录
      saveToHistory(detectionResults)
      
      // 根据评分和失败情况显示不同的提示
      if (failedCount > 0) {
        toast.warning('检测部分完成', `有 ${failedCount} 项检测失败，但已生成可用报告。`)
      } else if (detectionResults.score.total >= 80) {
        toast.success('检测完成', '您的隐私保护状况良好！')
      } else if (detectionResults.score.total >= 50) {
        toast.warning('检测完成', '您的隐私保护存在一些风险，建议查看详细报告。')
      } else {
        toast.error('检测完成', '您的隐私保护较弱，请立即采取措施！')
      }
    } catch (error) {
      console.error('检测失败:', error)
      const errorMessage = error instanceof Error ? error.message : '检测过程中出现错误'
      set({ 
        isDetecting: false,
        error: errorMessage
      })
      toast.error('检测失败', errorMessage)
    }
  },

  updateProgress: (step: string, progress: number) => {
    set({ currentStep: step, progress })
  },

  setResults: (results: DetectionResults) => {
    set({ results })
  },

  resetDetection: () => {
    set({ 
      isDetecting: false, 
      results: null, 
      progress: 0, 
      currentStep: '',
      error: null,
      detectionItems: []
    })
  },

  setError: (error: string) => {
    set({ error, isDetecting: false })
  },

  updateDetectionItem: (name: string, status: DetectionItem['status'], error?: string) => {
    set((state) => ({
      detectionItems: state.detectionItems.map(item =>
        item.name === name
          ? { ...item, status, error }
          : item
      )
    }))
  }
}))