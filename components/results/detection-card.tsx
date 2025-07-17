'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  Copy,
  Shield,
  AlertCircle,
  Info,
  TrendingUp,
  BarChart3
} from 'lucide-react'

// 检测状态类型
export type DetectionStatus = 'success' | 'warning' | 'error' | 'loading'

// 检测结果数据类型
export interface DetectionResult {
  id: string
  title: string
  description: string
  status: DetectionStatus
  score: number
  icon: React.ComponentType<{ className?: string }>
  category: 'network' | 'browser' | 'connection'
  details: {
    summary: string
    findings: Array<{
      type: 'info' | 'warning' | 'error'
      title: string
      description: string
      value?: string
      recommendation?: string
    }>
    metrics: Array<{
      label: string
      value: string | number
      unit?: string
      status: DetectionStatus
    }>
  }
  lastChecked: Date
  recommendations?: string[]
}

// 状态图标映射
const statusIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  loading: Clock
}

// 状态颜色映射
const statusColors = {
  success: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    gradient: 'from-success/20 to-success/5'
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    text: 'text-warning',
    gradient: 'from-warning/20 to-warning/5'
  },
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    text: 'text-destructive',
    gradient: 'from-destructive/20 to-destructive/5'
  },
  loading: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary',
    gradient: 'from-primary/20 to-primary/5'
  }
}

// 分数条组件
function ScoreBar({ score, status }: { score: number; status: DetectionStatus }) {
  const color = statusColors[status]
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm privacy-text-body opacity-80">安全指数</span>
        <span className={`text-sm font-semibold ${color.text}`}>
          {score}/100
        </span>
      </div>
      <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// 指标组件
function MetricItem({ metric }: { metric: DetectionResult['details']['metrics'][0] }) {
  const color = statusColors[metric.status]
  
  return (
    <div className="flex items-center justify-between py-2">
      <span className="privacy-text-body text-sm opacity-80">{metric.label}</span>
      <div className={`px-2 py-1 rounded text-xs font-medium ${color.bg} ${color.text}`}>
        {metric.value}{metric.unit}
      </div>
    </div>
  )
}

// 发现项组件
function FindingItem({ finding }: { finding: DetectionResult['details']['findings'][0] }) {
  const [showDetails, setShowDetails] = useState(false)
  
  const getIcon = () => {
    switch (finding.type) {
      case 'error': return XCircle
      case 'warning': return AlertTriangle
      case 'info': return Info
    }
  }
  
  const getColor = () => {
    switch (finding.type) {
      case 'error': return 'text-destructive'
      case 'warning': return 'text-warning'
      case 'info': return 'text-primary'
    }
  }
  
  const Icon = getIcon()
  
  return (
    <div className="border border-border-primary rounded-lg p-3">
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 mt-0.5 ${getColor()}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h5 className="privacy-text-heading text-sm font-medium">
              {finding.title}
            </h5>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary hover:text-primary-hover transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <p className="privacy-text-body text-xs opacity-80 mt-1">
            {finding.description}
          </p>
          
          {finding.value && (
            <div className="mt-2 p-2 bg-background-secondary rounded font-mono text-xs">
              {finding.value}
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showDetails && finding.recommendation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-border-primary"
          >
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-success mt-0.5" />
              <div>
                <h6 className="privacy-text-heading text-xs font-medium text-success mb-1">
                  建议操作
                </h6>
                <p className="privacy-text-body text-xs opacity-80">
                  {finding.recommendation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 主要检测卡片组件
export function DetectionCard({ 
  result, 
  isExpanded = false,
  onToggle 
}: { 
  result: DetectionResult
  isExpanded?: boolean
  onToggle: () => void
}) {
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  
  const StatusIcon = statusIcons[result.status]
  const ResultIcon = result.icon
  const colors = statusColors[result.status]
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    // 这里可以添加复制成功的提示
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`privacy-card transition-all duration-300 hover:shadow-lg ${colors.bg} ${colors.border}`}
    >
      {/* 卡片头部 */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              <ResultIcon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h3 className="privacy-text-heading text-base sm:text-lg font-semibold">
                {result.title}
              </h3>
              <p className="privacy-text-body text-xs sm:text-sm opacity-80 hidden sm:block">
                {result.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
              <StatusIcon className={`w-4 h-4 ${result.status === 'loading' ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">
                {result.status === 'success' ? '安全' : 
                 result.status === 'warning' ? '警告' : 
                 result.status === 'error' ? '错误' : '检测中'}
              </span>
            </div>
            
            <button
              onClick={onToggle}
              className="p-1 hover:bg-background-tertiary rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {/* 分数条 */}
        <ScoreBar score={result.score} status={result.status} />
        
        {/* 快速指标 - 移动端隐藏 */}
        <div className="mt-4 grid grid-cols-2 gap-4 hidden sm:grid">
          {result.details.metrics.slice(0, 2).map((metric, index) => (
            <MetricItem key={index} metric={metric} />
          ))}
        </div>
      </div>
      
      {/* 展开的详细信息 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border-primary"
          >
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* 详细摘要 */}
              <div>
                <h4 className="privacy-text-heading font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  检测摘要
                </h4>
                <p className="privacy-text-body text-sm opacity-80">
                  {result.details.summary}
                </p>
              </div>
              
              {/* 所有指标 */}
              {result.details.metrics.length > 2 && (
                <div>
                  <h4 className="privacy-text-heading font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    详细指标
                  </h4>
                  <div className="space-y-2">
                    {result.details.metrics.slice(2).map((metric, index) => (
                      <MetricItem key={index} metric={metric} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* 检测发现 */}
              {result.details.findings.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="privacy-text-heading font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      检测发现 ({result.details.findings.length})
                    </h4>
                    <button
                      onClick={() => setShowSensitiveData(!showSensitiveData)}
                      className="flex items-center gap-1 text-xs privacy-text-body opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {showSensitiveData ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          隐藏敏感信息
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          显示敏感信息
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {result.details.findings.map((finding, index) => (
                      <FindingItem key={index} finding={finding} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* 建议操作 */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <h4 className="privacy-text-heading font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    改进建议
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-success rounded-full mt-2" />
                        <span className="privacy-text-body text-sm opacity-80">
                          {rec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 底部操作 */}
              <div className="flex items-center justify-between pt-4 border-t border-border-primary">
                <div className="flex items-center gap-2 text-xs privacy-text-body opacity-60">
                  <Clock className="w-3 h-3" />
                  <span>检测时间: {result.lastChecked.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify(result.details, null, 2))}
                    className="flex items-center gap-1 text-xs privacy-text-body opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-3 h-3" />
                    复制数据
                  </button>
                  
                  <button className="flex items-center gap-1 text-xs privacy-text-body opacity-60 hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3" />
                    详细报告
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}