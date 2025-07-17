'use client'

import { useState, useEffect } from 'react'
import { useDetectionStore } from '@/stores/detection-store'
import { IPDetector } from '@/components/detectors/ip-detector'
import { WebRTCDetector } from '@/components/detectors/webrtc-detector'
import { FingerprintDetector } from '@/components/detectors/fingerprint-detector'
import { BrowserDetector } from '@/components/detectors/browser-detector'
import { DNSDetector } from '@/components/detectors/dns-detector'
import { IPv6Detector } from '@/components/detectors/ipv6-detector'
import { SecurityScore } from '@/components/results/security-score'
import { HeroSection } from '@/components/sections/hero-section'
import { FeatureCards } from '@/components/sections/feature-cards'
import { Footer } from '@/components/sections/footer'
import { ParallelProgress } from '@/components/detection/parallel-progress'
import { motion } from 'framer-motion'
import { RefreshCw, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const { 
    isDetecting, 
    results, 
    progress,
    currentStep,
    startDetection, 
    resetDetection 
  } = useDetectionStore()

  const [showDetectors, setShowDetectors] = useState(false)

  useEffect(() => {
    if (isDetecting) {
      setShowDetectors(true)
    }
  }, [isDetecting])

  const handleStartDetection = () => {
    resetDetection()
    setShowDetectors(true)
    startDetection()
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* 英雄区域 */}
      <HeroSection onStartDetection={handleStartDetection} isDetecting={isDetecting} />

      {/* 功能预览（仅在未开始检测时显示） */}
      {!showDetectors && !results && (
        <FeatureCards />
      )}

      {/* 检测进度 */}
      {isDetecting && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="privacy-card p-8 animate-fade-in"
            >
              <div className="text-center mb-6">
                <h2 className="privacy-text-heading text-2xl mb-2">正在检测隐私状况</h2>
                <p className="privacy-text-body opacity-80">请稍候，我们正在全面分析您的浏览器隐私设置</p>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="privacy-text-body">{currentStep}</span>
                  <span className="privacy-text-body font-medium">{progress}%</span>
                </div>
                <div className="privacy-progress-bar">
                  <div 
                    className="privacy-progress-fill transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
            
            {/* 并行检测进度 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <ParallelProgress />
            </motion.div>
          </div>
        </section>
      )}

      {/* 检测组件 */}
      {showDetectors && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="privacy-text-heading text-3xl mb-4">检测结果</h2>
              <p className="privacy-text-body text-lg opacity-80">以下是您的隐私安全检测详情</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="detection-grid mb-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="animate-slide-up"
              >
                <IPDetector />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="animate-slide-up"
              >
                <WebRTCDetector />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="animate-slide-up"
              >
                <DNSDetector />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="animate-slide-up"
              >
                <IPv6Detector />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="animate-slide-up"
              >
                <FingerprintDetector />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="animate-slide-up"
              >
                <BrowserDetector />
              </motion.div>
            </motion.div>

            {/* 重新检测按钮 */}
            {results && !isDetecting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-center space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleStartDetection}
                    className="privacy-button-secondary inline-flex items-center gap-2 px-8 py-4 text-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>重新检测</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/results')}
                    className="privacy-button-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
                  >
                    <Eye className="w-5 h-5" />
                    <span>查看详细结果</span>
                  </button>
                </div>
                
                <p className="privacy-text-body text-sm opacity-60">
                  点击&quot;查看详细结果&quot;获取完整的隐私分析报告
                </p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* 安全评分 */}
      {results && !isDetecting && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SecurityScore results={results} />
            </motion.div>
          </div>
        </section>
      )}

      {/* 底部 */}
      <Footer />
    </div>
  )
}