import { DetectionResults } from '@/lib/types/detection'

const STORAGE_KEY = 'privacy-guardian-history'
const MAX_HISTORY_ITEMS = 20

export interface HistoryItem {
  id: string
  results: DetectionResults
  timestamp: string
  label?: string
}

export function saveToHistory(results: DetectionResults): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  
  try {
    const history = getHistory()
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      results,
      timestamp: results.timestamp,
      label: new Date(results.timestamp).toLocaleString('zh-CN')
    }
    
    // 添加到历史记录开头
    history.unshift(newItem)
    
    // 限制历史记录数量
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const history = JSON.parse(stored)
    return Array.isArray(history) ? history : []
  } catch (error) {
    console.error('读取历史记录失败:', error)
    return []
  }
}

export function getHistoryItem(id: string): HistoryItem | null {
  const history = getHistory()
  return history.find(item => item.id === id) || null
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  
  try {
    const history = getHistory()
    const filtered = history.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('删除历史记录失败:', error)
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('清空历史记录失败:', error)
  }
}

export function updateHistoryLabel(id: string, label: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  
  try {
    const history = getHistory()
    const item = history.find(item => item.id === id)
    if (item) {
      item.label = label
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    }
  } catch (error) {
    console.error('更新历史记录标签失败:', error)
  }
}