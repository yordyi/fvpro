'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Globe, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface IPDetectionState {
  isLoading: boolean
  data: any
  error: string | null
}

export function IPDetector() {
  const [state, setState] = useState<IPDetectionState>({
    isLoading: true,
    data: null,
    error: null
  })

  useEffect(() => {
    const detectIP = async () => {
      try {
        const response = await fetch('/api/detect-ip')
        const result = await response.json()
        
        if (result.success) {
          setState({ isLoading: false, data: result.data, error: null })
        } else {
          setState({ isLoading: false, data: null, error: result.error })
        }
      } catch (error) {
        setState({ 
          isLoading: false, 
          data: null, 
          error: 'IP检测失败' 
        })
      }
    }

    detectIP()
  }, [])

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <span>IP地址检测</span>
          {state.isLoading && (
            <div className="ml-auto animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state.error ? (
          <div className="text-red-600 dark:text-red-400 text-sm">{state.error}</div>
        ) : state.data ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300 text-sm">
                客户端IP: {state.data.clientIP}
              </span>
            </div>
            
            {state.data.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">
                  位置: {state.data.location.city}, {state.data.location.country}
                </span>
              </div>
            )}
            
            <div className="mt-2">
              <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
                state.data.isConsistent 
                  ? 'bg-green-600/20 text-green-400' 
                  : 'bg-red-600/20 text-red-400'
              }`}>
                {state.data.isConsistent ? '✓ IP一致' : '⚠ IP不一致'}
              </div>
              
              {state.data.isVPN && (
                <div className="inline-flex items-center ml-2 px-2 py-1 rounded text-sm bg-yellow-600/20 text-yellow-400">
                  可能使用VPN
                </div>
              )}
            </div>
            
            {state.data.detectedIPs.length > 1 && (
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                检测到多个IP源:
                {state.data.detectedIPs.map((item: any, index: number) => (
                  <div key={index} className="ml-2">
                    {item.source}: {item.ip}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400">检测中...</div>
        )}
      </CardContent>
    </Card>
  )
}