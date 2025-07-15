'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Monitor, 
  Wifi, 
  Fingerprint, 
  Network, 
  Route,
  Download,
  Share2,
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react'
import { DetectionHeader } from './detection-header'
import { DetectionCategories } from './detection-categories'
import { DetectionResult } from './detection-card'

// 模拟检测结果数据
const mockResults: DetectionResult[] = [
  {
    id: 'ip-detection',
    title: 'IP地址检测',
    description: '检测您的真实IP地址是否暴露',
    status: 'success',
    score: 85,
    icon: Globe,
    category: 'network',
    details: {
      summary: '您的IP地址已通过VPN或代理服务器进行了很好的保护，未发现明显的IP泄露问题。',
      findings: [
        {
          type: 'info',
          title: '公网IP地址',
          description: '当前检测到的公网IP地址',
          value: '203.0.113.0',
          recommendation: '建议定期更换VPN服务器位置以提高隐私保护'
        },
        {
          type: 'info',
          title: '地理位置',
          description: '根据IP地址推断的地理位置',
          value: 'Los Angeles, United States'
        }
      ],
      metrics: [
        { label: '检测状态', value: '正常', status: 'success' },
        { label: 'VPN状态', value: '已启用', status: 'success' },
        { label: '代理检测', value: '未发现', status: 'success' },
        { label: '位置准确度', value: '城市级', status: 'warning' }
      ]
    },
    lastChecked: new Date(),
    recommendations: [
      '继续使用VPN服务以保护真实IP地址',
      '定期更换VPN服务器节点',
      '避免访问会记录IP地址的敏感网站'
    ]
  },
  {
    id: 'webrtc-detection',
    title: 'WebRTC泄露检测',
    description: '检测WebRTC是否泄露本地IP地址',
    status: 'error',
    score: 45,
    icon: Wifi,
    category: 'network',
    details: {
      summary: '发现WebRTC存在IP泄露风险，您的本地IP地址可能被网站获取，建议立即修复。',
      findings: [
        {
          type: 'error',
          title: '本地IP泄露',
          description: 'WebRTC暴露了您的本地网络IP地址',
          value: '192.168.1.100',
          recommendation: '在浏览器中禁用WebRTC或使用WebRTC控制扩展程序'
        },
        {
          type: 'warning',
          title: 'STUN服务器',
          description: '检测到使用公共STUN服务器',
          value: 'stun.l.google.com:19302'
        }
      ],
      metrics: [
        { label: '泄露状态', value: '存在泄露', status: 'error' },
        { label: '本地IP', value: '已暴露', status: 'error' },
        { label: '公网IP', value: '正常', status: 'success' },
        { label: '风险等级', value: '高', status: 'error' }
      ]
    },
    lastChecked: new Date(),
    recommendations: [
      '在浏览器设置中禁用WebRTC',
      '安装WebRTC控制扩展程序',
      '使用支持WebRTC保护的VPN服务',
      '定期检查WebRTC泄露状态'
    ]
  },
  {
    id: 'dns-detection',
    title: 'DNS泄露检测',
    description: '检测DNS查询是否泄露真实位置',
    status: 'warning',
    score: 65,
    icon: Network,
    category: 'network',
    details: {
      summary: 'DNS查询部分通过VPN服务器，但仍有少量查询可能暴露您的真实位置。',
      findings: [
        {
          type: 'warning',
          title: 'DNS服务器',
          description: '检测到使用的DNS服务器',
          value: '8.8.8.8, 1.1.1.1',
          recommendation: '建议使用VPN提供的DNS服务器'
        },
        {
          type: 'info',
          title: 'DNS位置',
          description: 'DNS服务器地理位置',
          value: 'Mountain View, United States'
        }
      ],
      metrics: [
        { label: '泄露状态', value: '轻微泄露', status: 'warning' },
        { label: 'DNS服务器', value: '公共DNS', status: 'warning' },
        { label: 'VPN DNS', value: '部分使用', status: 'warning' },
        { label: '查询加密', value: '已启用', status: 'success' }
      ]
    },
    lastChecked: new Date(),
    recommendations: [
      '配置VPN客户端使用VPN提供的DNS',
      '启用DNS over HTTPS (DoH)',
      '使用隐私优先的DNS服务如1.1.1.1',
      '定期检查DNS泄露状态'
    ]
  },
  {
    id: 'fingerprint-detection',
    title: '浏览器指纹分析',
    description: '分析您的浏览器指纹唯一性',
    status: 'warning',
    score: 60,
    icon: Fingerprint,
    category: 'browser',
    details: {
      summary: '您的浏览器指纹具有一定的唯一性，可能被用于跟踪。建议调整浏览器设置以降低指纹特征。',
      findings: [
        {
          type: 'warning',
          title: '指纹唯一性',
          description: '浏览器指纹的唯一性评估',
          value: '78% 唯一',
          recommendation: '启用浏览器的隐私模式或使用指纹保护扩展'
        },
        {
          type: 'info',
          title: '用户代理',
          description: '浏览器用户代理字符串',
          value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      ],
      metrics: [
        { label: '唯一性', value: '78%', unit: '', status: 'warning' },
        { label: '指纹强度', value: '中等', status: 'warning' },
        { label: '跟踪风险', value: '中等', status: 'warning' },
        { label: '保护措施', value: '部分', status: 'warning' }
      ]
    },
    lastChecked: new Date(),
    recommendations: [
      '启用浏览器的指纹保护功能',
      '使用隐私模式浏览敏感网站',
      '安装反指纹跟踪扩展程序',
      '定期清理浏览器缓存和Cookie'
    ]
  },
  {
    id: 'browser-info',
    title: '浏览器信息检测',
    description: '检查浏览器配置和隐私设置',
    status: 'success',
    score: 90,
    icon: Monitor,
    category: 'browser',
    details: {
      summary: '您的浏览器隐私设置配置良好，大多数隐私保护功能已启用。',
      findings: [
        {
          type: 'info',
          title: '浏览器版本',
          description: '当前使用的浏览器版本',
          value: 'Chrome 120.0.0.0'
        },
        {
          type: 'info',
          title: 'Do Not Track',
          description: 'DNT头部发送状态',
          value: '已启用',
          recommendation: '继续保持DNT设置启用'
        }
      ],
      metrics: [
        { label: '隐私设置', value: '优秀', status: 'success' },
        { label: 'Cookie设置', value: '严格', status: 'success' },
        { label: '弹窗阻止', value: '已启用', status: 'success' },
        { label: '追踪保护', value: '已启用', status: 'success' }
      ]
    },
    lastChecked: new Date(),
    recommendations: [
      '保持浏览器更新到最新版本',
      '定期检查隐私设置',
      '使用广告拦截器增强保护'
    ]
  },
  {
    id: 'ipv6-detection',
    title: 'IPv6泄露检测',
    description: '检测IPv6地址是否泄露',
    status: 'success',
    score: 95,
    icon: Route,
    category: 'connection',
    details: {
      summary: 'IPv6连接已被正确禁用或保护，未发现IPv6地址泄露问题。',
      findings: [
        {
          type: 'info',
          title: 'IPv6状态',
          description: 'IPv6连接状态检测',
          value: '已禁用',
          recommendation: '继续保持IPv6禁用状态以避免泄露'
        }
      ],
      metrics: [
        { label: 'IPv6状态', value: '已禁用', status: 'success' },
        { label: '泄露检测', value: '未发现', status: 'success' },
        { label: '双栈检测', value: '安全', status: 'success' },
        { label: '隧道检测', value: '正常', status: 'success' }
      ]
    },
    lastChecked: new Date(),
    recommendations: [
      '继续保持IPv6禁用状态',
      '定期检查IPv6设置',
      '确保VPN服务支持IPv6保护'
    ]
  }
]

// 导出选项
const exportOptions = [
  { label: '导出PDF报告', value: 'pdf', icon: FileText },
  { label: '导出JSON数据', value: 'json', icon: Download },
  { label: '分享检测结果', value: 'share', icon: Share2 }
]

// 主要检测结果组件
export function DetectionResults() {
  const [results, setResults] = useState<DetectionResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterActive, setFilterActive] = useState(false)
  
  // 模拟加载检测结果
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true)
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResults(mockResults)
      setIsLoading(false)
    }
    
    loadResults()
  }, [])
  
  // 计算统计信息
  const stats = useMemo(() => {
    return results.reduce((acc, result) => {
      const statusKey = result.status === 'success' ? 'safe' : result.status
      acc[statusKey] = (acc[statusKey] || 0) + 1
      return acc
    }, { safe: 0, warning: 0, error: 0 } as { safe: number; warning: number; error: number })
  }, [results])
  
  // 计算总体安全分数
  const overallScore = useMemo(() => {
    if (results.length === 0) return 0
    return Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
  }, [results])
  
  // 刷新检测
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // 模拟重新检测
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 更新检测时间
    const updatedResults = results.map(result => ({
      ...result,
      lastChecked: new Date()
    }))
    setResults(updatedResults)
    setIsRefreshing(false)
  }
  
  // 切换筛选
  const handleFilter = () => {
    setFilterActive(!filterActive)
  }
  
  // 导出报告
  const handleExport = () => {
    // 这里实现导出功能
    console.log('导出报告', results)
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="privacy-text-body">正在加载检测结果...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="privacy-text-heading text-3xl md:text-4xl font-bold mb-4">
            隐私检测结果
          </h1>
          <p className="privacy-text-body text-lg opacity-80">
            全面分析您的浏览器隐私和网络安全状况
          </p>
        </motion.div>
        
        {/* 检测头部状态 */}
        <DetectionHeader
          score={overallScore}
          stats={stats}
          progress={100}
          isCompleted={true}
          onRefresh={handleRefresh}
          onFilter={handleFilter}
          onExport={handleExport}
          isRefreshing={isRefreshing}
          filterActive={filterActive}
        />
        
        {/* 检测结果分类 */}
        <DetectionCategories results={results} />
        
        {/* 底部操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="privacy-card p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <h3 className="privacy-text-heading text-xl font-semibold mb-4">
              导出和分享
            </h3>
            <p className="privacy-text-body opacity-80 mb-6">
              将检测结果导出为报告或分享给安全专家
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {exportOptions.map((option) => {
                const Icon = option.icon
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="privacy-button-secondary px-6 py-3 flex items-center gap-2"
                  >
                    <Icon className="w-5 h-5" />
                    {option.label}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}