'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Globe, 
  Shield, 
  Fingerprint, 
  Monitor, 
  Network, 
  Route,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  Activity
} from 'lucide-react'

// 功能特性数据
const features = [
  {
    id: 'ip-detection',
    icon: Globe,
    title: 'IP地址检测',
    description: '检测您的真实IP地址是否暴露，包括IPv4和IPv6泄露检测',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    stats: { safe: 85, warning: 10, danger: 5 },
    features: ['真实IP检测', 'VPN绕过检测', '地理位置分析', '代理服务器识别']
  },
  {
    id: 'webrtc-leak',
    icon: Shield,
    title: 'WebRTC泄露检测',
    description: '检测WebRTC是否泄露本地IP地址，防止VPN绕过',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    stats: { safe: 70, warning: 20, danger: 10 },
    features: ['本地IP泄露', 'STUN服务器检测', '网络配置分析', '实时监控']
  },
  {
    id: 'dns-leak',
    icon: Network,
    title: 'DNS泄露检测',
    description: '检测DNS查询是否泄露您的真实位置和网络信息',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    stats: { safe: 75, warning: 15, danger: 10 },
    features: ['DNS服务器检测', '查询路径分析', '泄露位置识别', '安全建议']
  },
  {
    id: 'fingerprint',
    icon: Fingerprint,
    title: '浏览器指纹分析',
    description: '分析您的浏览器指纹唯一性，评估被追踪的风险',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    stats: { safe: 60, warning: 25, danger: 15 },
    features: ['指纹唯一性', '设备特征识别', '追踪风险评估', '隐私建议']
  },
  {
    id: 'browser-info',
    icon: Monitor,
    title: '浏览器信息检测',
    description: '检查浏览器配置和隐私设置，发现潜在的隐私风险',
    color: 'from-teal-500 to-blue-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
    stats: { safe: 80, warning: 15, danger: 5 },
    features: ['隐私设置检查', '扩展程序分析', 'Cookie配置', '安全建议']
  },
  {
    id: 'ipv6-leak',
    icon: Route,
    title: 'IPv6泄露检测',
    description: '专门检测IPv6地址泄露，确保完整的隐私保护',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    stats: { safe: 90, warning: 8, danger: 2 },
    features: ['IPv6地址检测', '双栈网络分析', '隧道检测', '配置建议']
  }
]

// 状态图标组件
function StatusIcon({ type, className = "" }: { type: 'safe' | 'warning' | 'danger'; className?: string }) {
  const icons = {
    safe: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle
  }
  
  const colors = {
    safe: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive'
  }
  
  const Icon = icons[type]
  return <Icon className={`${colors[type]} ${className}`} />
}

// 统计条组件
function StatBar({ label, value, type }: { label: string; value: number; type: 'safe' | 'warning' | 'danger' }) {
  const colors = {
    safe: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive'
  }
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <StatusIcon type={type} className="w-3 h-3" />
      <span className="privacy-text-body opacity-80 min-w-[40px]">{label}</span>
      <div className="flex-1 h-1 bg-background-tertiary rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colors[type]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="privacy-text-body text-xs opacity-60 min-w-[25px]">{value}%</span>
    </div>
  )
}

// 特性卡片组件
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className={`privacy-card p-6 h-full ${feature.bgColor} ${feature.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}>
        {/* 顶部图标和标题 */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="privacy-text-heading text-lg font-semibold">{feature.title}</h3>
          </div>
        </div>

        {/* 描述 */}
        <p className="privacy-text-body text-sm opacity-80 mb-6 leading-relaxed">
          {feature.description}
        </p>

        {/* 统计信息 */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary" />
            <span className="privacy-text-body text-sm font-medium">检测统计</span>
          </div>
          <StatBar label="安全" value={feature.stats.safe} type="safe" />
          <StatBar label="警告" value={feature.stats.warning} type="warning" />
          <StatBar label="危险" value={feature.stats.danger} type="danger" />
        </div>

        {/* 功能特性 */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-secondary" />
            <span className="privacy-text-body text-sm font-medium">主要功能</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {feature.features.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="privacy-text-body text-xs opacity-70">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between pt-4 border-t border-border-primary">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-success" />
            <span className="privacy-text-body text-xs opacity-60">本地检测</span>
          </div>
          <motion.div
            className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 5 }}
          >
            <span className="text-xs font-medium">开始检测</span>
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </div>

        {/* 悬浮光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
      </div>
    </motion.div>
  )
}

// 主要功能预览组件
export function FeatureCards() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题部分 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold privacy-text-heading mb-6">
            全面的隐私检测
          </h2>
          <p className="text-lg md:text-xl privacy-text-body max-w-3xl mx-auto opacity-80">
            六大维度深度检测，全方位保护您的数字隐私和网络安全
          </p>
        </motion.div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* 底部CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="privacy-card p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h3 className="privacy-text-heading text-xl font-semibold">
                立即开始隐私检测
              </h3>
            </div>
            <p className="privacy-text-body opacity-80 mb-6 max-w-2xl mx-auto">
              无需注册，无需安装，一键开始全面的隐私安全检测
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="privacy-button-primary inline-flex items-center gap-2 px-8 py-3 text-lg"
            >
              <Shield className="w-5 h-5" />
              <span>开始检测</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}