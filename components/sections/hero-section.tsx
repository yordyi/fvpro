'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Shield, Play, Sparkles, Lock, Eye, Globe, Zap } from 'lucide-react'

// 动态粒子效果组件
export function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
  }>>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 20 + 10
      }))
      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [particle.opacity, 0.8, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// 盾牌图标动画组件
export function AnimatedShield() {
  return (
    <div className="relative">
      <motion.div
        className="relative z-10"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl backdrop-blur-sm border border-primary/30">
          <Shield className="w-16 h-16 text-primary drop-shadow-lg" />
        </div>
      </motion.div>
      
      {/* 呼吸光环效果 */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* 外圈脉冲效果 */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-primary/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  )
}

// 渐变文字组件
export function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-text-primary via-primary to-secondary bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}

// 主英雄区域组件
interface HeroSectionProps {
  onStartDetection: () => void
  isDetecting: boolean
}

export function HeroSection({ onStartDetection, isDetecting }: HeroSectionProps) {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  }, [controls])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-primary" />
      
      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%236366f1\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }} />
      
      {/* 动态粒子背景 */}
      <ParticleBackground />
      
      {/* 主要内容 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="space-y-8"
        >
          {/* 动画盾牌图标 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <AnimatedShield />
          </motion.div>

          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <GradientText>Privacy</GradientText>
              <br />
              <span className="privacy-text-heading">Guardian</span>
            </h1>
          </motion.div>

          {/* 副标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl privacy-text-body max-w-3xl mx-auto leading-relaxed">
              全面检测您的浏览器隐私和安全状况，保护您的数字身份免受追踪和泄露
            </p>
          </motion.div>

          {/* CTA按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="pt-8"
          >
            <motion.button
              onClick={onStartDetection}
              disabled={isDetecting}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 按钮背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              {isDetecting ? (
                <>
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>检测中...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 transition-transform group-hover:scale-110" />
                  <span>开始隐私检测</span>
                  <Sparkles className="w-5 h-5 opacity-80 transition-transform group-hover:scale-110" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* 信任指标 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="pt-12"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm privacy-text-body opacity-80">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-success" />
                <span>100% 本地检测</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span>无数据收集</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-secondary" />
                <span>开源透明</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                <span>实时检测</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 底部滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-text-muted"
        >
          <span className="text-sm">滚动查看更多</span>
          <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-text-muted rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}