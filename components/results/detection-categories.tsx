'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Monitor, 
  Wifi, 
  Filter, 
  Search, 
  SortAsc, 
  SortDesc,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { DetectionCard, DetectionResult, DetectionStatus } from './detection-card'

// 分类配置
const categoryConfig = {
  network: {
    title: '网络隐私',
    description: '检测网络层面的隐私泄露风险',
    icon: Globe,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  browser: {
    title: '浏览器安全',
    description: '分析浏览器配置和指纹信息',
    icon: Monitor,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  connection: {
    title: '连接状态',
    description: '检测网络连接和协议配置',
    icon: Wifi,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  }
}

// 筛选和排序类型
type FilterType = 'all' | DetectionStatus
type SortType = 'name' | 'score' | 'status' | 'lastChecked'
type ViewType = 'grid' | 'list'

// 筛选按钮组件
function FilterButton({ 
  type, 
  isActive, 
  onClick, 
  count 
}: { 
  type: FilterType
  isActive: boolean
  onClick: () => void
  count: number
}) {
  const getLabel = () => {
    switch (type) {
      case 'all': return '全部'
      case 'success': return '安全'
      case 'warning': return '警告'
      case 'error': return '错误'
      case 'loading': return '检测中'
    }
  }
  
  const getColor = () => {
    switch (type) {
      case 'all': return 'text-primary'
      case 'success': return 'text-success'
      case 'warning': return 'text-warning'
      case 'error': return 'text-destructive'
      case 'loading': return 'text-primary'
    }
  }
  
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? `${getColor()} bg-current/10` 
          : 'privacy-text-body opacity-60 hover:opacity-100'
      }`}
    >
      {getLabel()} ({count})
    </button>
  )
}

// 分类部分组件
function CategorySection({ 
  category, 
  results, 
  expandedItems, 
  onToggleItem 
}: {
  category: keyof typeof categoryConfig
  results: DetectionResult[]
  expandedItems: Set<string>
  onToggleItem: (id: string) => void
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const config = categoryConfig[category]
  const Icon = config.icon
  
  // 计算统计信息
  const stats = useMemo(() => {
    return results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1
      return acc
    }, {} as Record<DetectionStatus, number>)
  }, [results])
  
  // 计算平均分数
  const averageScore = useMemo(() => {
    if (results.length === 0) return 0
    return Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
  }, [results])
  
  return (
    <div className="space-y-4">
      {/* 分类头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`privacy-card p-4 ${config.bgColor} ${config.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="text-left">
                <h3 className="privacy-text-heading text-base sm:text-lg font-semibold">
                  {config.title}
                </h3>
                <p className="privacy-text-body text-xs sm:text-sm opacity-80 hidden sm:block">
                  {config.description}
                </p>
              </div>
            </button>
            
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 opacity-60" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-60" />
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* 统计信息 - 移动端简化 */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="privacy-text-body opacity-80">
                  {stats.success || 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span className="privacy-text-body opacity-80">
                  {stats.warning || 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-destructive rounded-full" />
                <span className="privacy-text-body opacity-80">
                  {stats.error || 0}
                </span>
              </div>
            </div>
            
            {/* 平均分数 */}
            <div className="text-right">
              <div className="text-lg font-semibold privacy-text-heading">
                {averageScore}
              </div>
              <div className="text-xs privacy-text-body opacity-60">
                平均分
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 检测结果卡片 */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="detection-grid grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {results.map((result) => (
              <DetectionCard
                key={result.id}
                result={result}
                isExpanded={expandedItems.has(result.id)}
                onToggle={() => onToggleItem(result.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 主要检测分类组件
export function DetectionCategories({ 
  results 
}: { 
  results: DetectionResult[] 
}) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('status')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewType, setViewType] = useState<ViewType>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  
  // 筛选和排序结果
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results
    
    // 应用搜索
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // 应用状态筛选
    if (filter !== 'all') {
      filtered = filtered.filter(result => result.status === filter)
    }
    
    // 应用排序
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.title
          bValue = b.title
          break
        case 'score':
          aValue = a.score
          bValue = b.score
          break
        case 'status':
          const statusOrder = { error: 0, warning: 1, success: 2, loading: 3 }
          aValue = statusOrder[a.status]
          bValue = statusOrder[b.status]
          break
        case 'lastChecked':
          aValue = a.lastChecked.getTime()
          bValue = b.lastChecked.getTime()
          break
        default:
          return 0
      }
      
      const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      return sortOrder === 'asc' ? result : -result
    })
    
    return filtered
  }, [results, filter, sortBy, sortOrder, searchTerm])
  
  // 按分类分组
  const groupedResults = useMemo(() => {
    return filteredAndSortedResults.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = []
      }
      acc[result.category].push(result)
      return acc
    }, {} as Record<keyof typeof categoryConfig, DetectionResult[]>)
  }, [filteredAndSortedResults])
  
  // 计算各状态的数量
  const statusCounts = useMemo(() => {
    return results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1
      acc.all = results.length
      return acc
    }, {} as Record<FilterType, number>)
  }, [results])
  
  const handleToggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }
  
  const handleToggleSort = (newSortBy: SortType) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }
  
  return (
    <div className="space-y-6">
      {/* 控制栏 */}
      <div className="privacy-card p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60" />
              <input
                type="text"
                placeholder="搜索检测项目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background-secondary border border-border-primary rounded-lg text-sm privacy-text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* 状态筛选 */}
            <div className="flex items-center gap-2">
              <FilterButton
                type="all"
                isActive={filter === 'all'}
                onClick={() => setFilter('all')}
                count={statusCounts.all || 0}
              />
              <FilterButton
                type="success"
                isActive={filter === 'success'}
                onClick={() => setFilter('success')}
                count={statusCounts.success || 0}
              />
              <FilterButton
                type="warning"
                isActive={filter === 'warning'}
                onClick={() => setFilter('warning')}
                count={statusCounts.warning || 0}
              />
              <FilterButton
                type="error"
                isActive={filter === 'error'}
                onClick={() => setFilter('error')}
                count={statusCounts.error || 0}
              />
            </div>
          </div>
          
          {/* 排序和视图控制 */}
          <div className="flex items-center gap-3">
            {/* 排序按钮 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleSort('status')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  sortBy === 'status' 
                    ? 'bg-primary/10 text-primary' 
                    : 'privacy-text-body opacity-60 hover:opacity-100'
                }`}
              >
                状态
                {sortBy === 'status' && (
                  sortOrder === 'asc' ? 
                    <SortAsc className="w-3 h-3" /> : 
                    <SortDesc className="w-3 h-3" />
                )}
              </button>
              
              <button
                onClick={() => handleToggleSort('score')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  sortBy === 'score' 
                    ? 'bg-primary/10 text-primary' 
                    : 'privacy-text-body opacity-60 hover:opacity-100'
                }`}
              >
                分数
                {sortBy === 'score' && (
                  sortOrder === 'asc' ? 
                    <SortAsc className="w-3 h-3" /> : 
                    <SortDesc className="w-3 h-3" />
                )}
              </button>
            </div>
            
            {/* 视图切换 */}
            <div className="flex items-center gap-1 p-1 bg-background-secondary rounded-lg">
              <button
                onClick={() => setViewType('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewType === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewType === 'list' 
                    ? 'bg-primary text-white' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {/* 展开/收起所有 */}
            <button
              onClick={() => {
                if (expandedItems.size === filteredAndSortedResults.length) {
                  setExpandedItems(new Set())
                } else {
                  setExpandedItems(new Set(filteredAndSortedResults.map(r => r.id)))
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm privacy-text-body opacity-60 hover:opacity-100 transition-opacity"
            >
              {expandedItems.size === filteredAndSortedResults.length ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  收起所有
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  展开所有
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 分类结果 */}
      <div className="space-y-8">
        {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((category) => {
          const categoryResults = groupedResults[category] || []
          if (categoryResults.length === 0) return null
          
          return (
            <CategorySection
              key={category}
              category={category}
              results={categoryResults}
              expandedItems={expandedItems}
              onToggleItem={handleToggleItem}
            />
          )
        })}
      </div>
      
      {/* 空状态 */}
      {filteredAndSortedResults.length === 0 && (
        <div className="text-center py-12">
          <div className="privacy-text-body opacity-60 mb-4">
            没有找到符合条件的检测结果
          </div>
          <button
            onClick={() => {
              setFilter('all')
              setSearchTerm('')
            }}
            className="privacy-button-secondary"
          >
            重置筛选
          </button>
        </div>
      )}
    </div>
  )
}