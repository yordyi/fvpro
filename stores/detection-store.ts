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

interface DetectionStore {
  isDetecting: boolean
  results: DetectionResults | null
  progress: number
  currentStep: string
  error: string | null
  startDetection: () => void
  updateProgress: (step: string, progress: number) => void
  setResults: (results: DetectionResults) => void
  resetDetection: () => void
  setError: (error: string) => void
}

export const useDetectionStore = create<DetectionStore>((set, get) => ({
  isDetecting: false,
  results: null,
  progress: 0,
  currentStep: '',
  error: null,

  startDetection: async () => {
    set({ isDetecting: true, progress: 0, results: null, error: null })
    
    try {
      toast.info('开始隐私检测', '正在分析您的浏览器安全状况...')
      
      // 更新进度
      set({ currentStep: '正在检测IP地址...', progress: 10 })
      const ipResult = await detectIP()
      
      set({ currentStep: '正在检测WebRTC泄露...', progress: 20 })
      const webrtcResult = await detectWebRTCLeak()
      
      set({ currentStep: '正在检测DNS泄露...', progress: 35 })
      const dnsResult = await detectDNSLeak()
      
      set({ currentStep: '正在检测IPv6泄露...', progress: 50 })
      const ipv6Result = await detectIPv6Leak()
      
      set({ currentStep: '正在分析浏览器指纹...', progress: 65 })
      const fingerprintResult = await detectFingerprint()
      
      set({ currentStep: '正在收集浏览器信息...', progress: 80 })
      const browserResult = await detectBrowser()
      
      set({ currentStep: '正在计算安全评分...', progress: 90 })
      
      const results: DetectionResults = {
        ip: ipResult,
        webrtc: webrtcResult,
        fingerprint: fingerprintResult,
        browser: browserResult,
        dns: dnsResult,
        ipv6: ipv6Result,
        score: calculateSecurityScore({
          ipResult,
          webrtcResult,
          fingerprintResult,
          browserResult,
          dnsResult,
          ipv6Result
        }),
        timestamp: new Date().toISOString()
      }

      set({ 
        results, 
        isDetecting: false, 
        progress: 100,
        currentStep: '检测完成'
      })
      
      // 保存到历史记录
      saveToHistory(results)
      
      // 根据评分显示不同的提示
      if (results.score.total >= 80) {
        toast.success('检测完成', '您的隐私保护状况良好！')
      } else if (results.score.total >= 50) {
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
      error: null
    })
  },

  setError: (error: string) => {
    set({ error, isDetecting: false })
  }
}))