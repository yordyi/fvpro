'use client'

import { useState, useEffect } from 'react'
import { getHistory, deleteHistoryItem, clearHistory, updateHistoryLabel, HistoryItem } from '@/lib/utils/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SecurityScore } from '@/components/results/security-score'
import { toast } from '@/lib/utils/toast'
import { History, Trash2, Download, Edit2, X, Check, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const items = getHistory()
    setHistory(items)
  }

  const handleDelete = (id: string) => {
    deleteHistoryItem(id)
    loadHistory()
    toast.success('删除成功', '历史记录已删除')
    if (selectedItem?.id === id) {
      setSelectedItem(null)
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      clearHistory()
      loadHistory()
      setSelectedItem(null)
      toast.success('清空成功', '所有历史记录已清空')
    }
  }

  const handleEditLabel = (item: HistoryItem) => {
    setEditingId(item.id)
    setEditLabel(item.label || '')
  }

  const handleSaveLabel = () => {
    if (editingId) {
      updateHistoryLabel(editingId, editLabel)
      loadHistory()
      setEditingId(null)
      toast.success('更新成功', '标签已更新')
    }
  }

  const handleExport = (item: HistoryItem) => {
    const dataStr = JSON.stringify(item.results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `privacy-report-${item.id}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('导出成功', '检测报告已导出')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <History className="w-8 h-8" />
            检测历史记录
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            查看您过去的隐私检测结果，跟踪隐私保护改进情况
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 历史列表 */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">历史记录</CardTitle>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    清空
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    暂无历史记录
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    <AnimatePresence>
                      {history.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                            selectedItem?.id === item.id ? 'bg-slate-50 dark:bg-slate-700/50' : ''
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {editingId === item.id ? (
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="text"
                                    value={editLabel}
                                    onChange={(e) => setEditLabel(e.target.value)}
                                    className="flex-1 px-2 py-1 text-sm border rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSaveLabel()
                                    }}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingId(null)
                                    }}
                                    className="text-slate-600 hover:text-slate-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                  {item.label}
                                </div>
                              )}
                              <div className={`text-2xl font-bold ${getScoreColor(item.results.score.total)}`}>
                                {item.results.score.total}
                                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                                  / 100
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditLabel(item)
                                }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                              >
                                <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleExport(item)
                                }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                              >
                                <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(item.id)
                                }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 详情展示 */}
          <div className="lg:col-span-2">
            {selectedItem ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedItem.id}
              >
                <SecurityScore results={selectedItem.results} />
                
                {/* 检测详情 */}
                <Card className="mt-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">检测详情</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">IP 检测</h4>
                      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <div>客户端 IP: {selectedItem.results.ip.clientIP}</div>
                        <div>IP 一致: {selectedItem.results.ip.isConsistent ? '是' : '否'}</div>
                        <div>VPN 检测: {selectedItem.results.ip.isVPN ? '是' : '否'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">WebRTC</h4>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        泄露状态: {selectedItem.results.webrtc.hasLeak ? '有泄露' : '无泄露'}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">DNS</h4>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        DNS 泄露: {selectedItem.results.dns.hasDNSLeak ? '有泄露' : '无泄露'}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">IPv6</h4>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        IPv6 状态: {selectedItem.results.ipv6.isIPv6Disabled ? '已禁用' : 
                                  selectedItem.results.ipv6.hasIPv6Leak ? '有泄露' : '正常'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="py-20 text-center">
                  <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    选择一个历史记录查看详情
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}