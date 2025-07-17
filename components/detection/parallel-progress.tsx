'use client'

import { motion } from 'framer-motion'
import { 
  Globe, 
  Wifi, 
  Network, 
  Route, 
  Fingerprint, 
  Monitor,
  Check,
  X,
  Loader2
} from 'lucide-react'
import { useDetectionStore } from '@/stores/detection-store'

// 图标映射
const iconMap: Record<string, any> = {
  'IP地址检测': Globe,
  'WebRTC泄露检测': Wifi,
  'DNS泄露检测': Network,
  'IPv6泄露检测': Route,
  '浏览器指纹分析': Fingerprint,
  '浏览器信息收集': Monitor
}

// 状态颜色映射
const statusColorMap = {
  pending: 'text-gray-400 dark:text-gray-600',
  running: 'text-blue-500 dark:text-blue-400',
  completed: 'text-green-500 dark:text-green-400',
  failed: 'text-red-500 dark:text-red-400'
}

// 状态图标映射
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700" />
    case 'running':
      return <Loader2 className="w-5 h-5 animate-spin" />
    case 'completed':
      return <Check className="w-5 h-5" />
    case 'failed':
      return <X className="w-5 h-5" />
    default:
      return null
  }
}

export function ParallelProgress() {
  const { detectionItems, isDetecting } = useDetectionStore()
  
  if (!isDetecting && detectionItems.length === 0) {
    return null
  }
  
  return (
    <div className="privacy-card p-6 mb-8">
      <h3 className="privacy-text-heading text-lg font-semibold mb-4">
        检测进度
      </h3>
      
      <div className="space-y-3">
        {detectionItems.map((item, index) => {
          const Icon = iconMap[item.name] || Monitor
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* 图标 */}
              <div className={`p-2 rounded-lg bg-background-tertiary ${statusColorMap[item.status]}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              {/* 名称和状态 */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="privacy-text-body text-sm font-medium">
                    {item.name}
                  </span>
                  <div className={statusColorMap[item.status]}>
                    <StatusIcon status={item.status} />
                  </div>
                </div>
                
                {/* 错误信息 */}
                {item.error && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {item.error}
                  </p>
                )}
                
                {/* 进度条 */}
                <div className="mt-2 h-1 bg-background-tertiary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      item.status === 'completed' 
                        ? 'bg-green-500' 
                        : item.status === 'failed'
                        ? 'bg-red-500'
                        : item.status === 'running'
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: item.status === 'completed' || item.status === 'failed' 
                        ? '100%' 
                        : item.status === 'running'
                        ? '60%'
                        : '0%'
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* 总体状态摘要 */}
      {!isDetecting && detectionItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-border-primary"
        >
          <div className="flex justify-between text-sm">
            <span className="privacy-text-body">
              总计: {detectionItems.length} 项检测
            </span>
            <div className="flex gap-4">
              <span className="text-green-500 dark:text-green-400">
                成功: {detectionItems.filter(item => item.status === 'completed').length}
              </span>
              {detectionItems.filter(item => item.status === 'failed').length > 0 && (
                <span className="text-red-500 dark:text-red-400">
                  失败: {detectionItems.filter(item => item.status === 'failed').length}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}