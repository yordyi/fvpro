'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Filter,
  RefreshCw,
  Info,
  TrendingUp,
  Award
} from 'lucide-react'

// 安全评分圆环组件
function SecurityScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981' // 绿色
    if (score >= 60) return '#f59e0b' // 橙色
    return '#ef4444' // 红色
  }
  
  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    return 'D'
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-background-tertiary"
        />
        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      
      {/* 分数显示 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-2xl font-bold privacy-text-heading" style={{ color: getScoreColor(score) }}>
            {score}
          </div>
          <div className="text-xs privacy-text-body opacity-60">
            {getScoreGrade(score)}级
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// 状态统计组件
function StatusStats({ stats }: { stats: { safe: number; warning: number; error: number } }) {
  const total = stats.safe + stats.warning + stats.error
  
  return (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-success" />
        <div className="text-center">
          <div className="text-base sm:text-lg font-semibold privacy-text-heading text-success">
            {stats.safe}
          </div>
          <div className="text-xs privacy-text-body opacity-60 hidden sm:block">安全</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <div className="text-center">
          <div className="text-base sm:text-lg font-semibold privacy-text-heading text-warning">
            {stats.warning}
          </div>
          <div className="text-xs privacy-text-body opacity-60 hidden sm:block">警告</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <XCircle className="w-5 h-5 text-destructive" />
        <div className="text-center">
          <div className="text-base sm:text-lg font-semibold privacy-text-heading text-destructive">
            {stats.error}
          </div>
          <div className="text-xs privacy-text-body opacity-60 hidden sm:block">错误</div>
        </div>
      </div>
    </div>
  )
}

// 检测进度条组件
function DetectionProgress({ progress, isCompleted }: { progress: number; isCompleted: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-success" />
          ) : (
            <Clock className="w-4 h-4 text-primary animate-pulse" />
          )}
          <span className="text-sm privacy-text-body">
            {isCompleted ? '检测完成' : `检测进度 ${progress}%`}
          </span>
        </div>
        <span className="text-xs privacy-text-body opacity-60">
          {isCompleted ? '100%' : `${progress}%`}
        </span>
      </div>
      
      <div className="privacy-progress-bar">
        <motion.div
          className="privacy-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${isCompleted ? 100 : progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  )
}

// 操作按钮组件
function ActionButtons({ 
  onRefresh, 
  onFilter, 
  onExport, 
  isRefreshing,
  filterActive
}: {
  onRefresh: () => void
  onFilter: () => void
  onExport: () => void
  isRefreshing: boolean
  filterActive: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`p-2 rounded-lg border transition-colors touch-target ${
          isRefreshing 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-border-primary hover:border-primary hover:bg-primary/5'
        }`}
        aria-label="刷新检测"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFilter}
        className={`p-2 rounded-lg border transition-colors touch-target ${
          filterActive 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-border-primary hover:border-primary hover:bg-primary/5'
        }`}
        aria-label="筛选结果"
      >
        <Filter className="w-4 h-4" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExport}
        className="privacy-button-secondary px-3 sm:px-4 py-2 text-sm flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">导出报告</span>
        <span className="sm:hidden">导出</span>
      </motion.button>
    </div>
  )
}

// 主要检测头部组件
interface DetectionHeaderProps {
  score: number
  stats: { safe: number; warning: number; error: number }
  progress: number
  isCompleted: boolean
  onRefresh: () => void
  onFilter: () => void
  onExport: () => void
  isRefreshing?: boolean
  filterActive?: boolean
}

export function DetectionHeader({
  score,
  stats,
  progress,
  isCompleted,
  onRefresh,
  onFilter,
  onExport,
  isRefreshing = false,
  filterActive = false
}: DetectionHeaderProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="privacy-card p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-center">
        {/* 安全评分 */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="mb-4">
            <h2 className="privacy-text-heading text-2xl font-bold mb-2">
              隐私安全评分
            </h2>
            <p className="privacy-text-body text-sm opacity-80">
              基于6项核心指标的综合评估
            </p>
          </div>
          <SecurityScoreRing score={score} />
        </div>

        {/* 状态统计 */}
        <div className="text-center lg:text-left">
          <div className="mb-4">
            <h3 className="privacy-text-heading text-lg font-semibold mb-2">
              检测结果统计
            </h3>
            <StatusStats stats={stats} />
          </div>
          
          <div className="mt-6">
            <DetectionProgress progress={progress} isCompleted={isCompleted} />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col items-center lg:items-end">
          <ActionButtons
            onRefresh={onRefresh}
            onFilter={onFilter}
            onExport={onExport}
            isRefreshing={isRefreshing}
            filterActive={filterActive}
          />
          
          <motion.button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 flex items-center gap-2 text-sm privacy-text-body opacity-60 hover:opacity-100 transition-opacity"
          >
            <Info className="w-4 h-4" />
            {showDetails ? '隐藏' : '查看'}详细信息
          </motion.button>
        </div>
      </div>

      {/* 详细信息展开区域 */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-border-primary"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="privacy-card p-4 bg-success/5 border-success/20">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-success" />
                  <h4 className="privacy-text-heading font-semibold">安全等级</h4>
                </div>
                <div className="text-2xl font-bold text-success mb-1">
                  {score >= 80 ? '优秀' : score >= 60 ? '良好' : '需改进'}
                </div>
                <p className="privacy-text-body text-xs opacity-80">
                  您的隐私保护水平{score >= 80 ? '非常好' : score >= 60 ? '还不错' : '需要加强'}
                </p>
              </div>

              <div className="privacy-card p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h4 className="privacy-text-heading font-semibold">检测项目</h4>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.safe + stats.warning + stats.error}
                </div>
                <p className="privacy-text-body text-xs opacity-80">
                  已完成全部隐私检测项目
                </p>
              </div>

              <div className="privacy-card p-4 bg-secondary/5 border-secondary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-secondary" />
                  <h4 className="privacy-text-heading font-semibold">建议操作</h4>
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {stats.warning + stats.error}
                </div>
                <p className="privacy-text-body text-xs opacity-80">
                  {stats.warning + stats.error > 0 ? '个问题需要处理' : '无需额外操作'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}