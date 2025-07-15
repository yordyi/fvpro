'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { detectIPv6Leak } from '@/lib/detectors/ipv6-detection'
import { Network, Shield, AlertTriangle, WifiOff } from 'lucide-react'

export function IPv6Detector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDetection = async () => {
      setIsLoading(true)
      try {
        const ipv6Result = await detectIPv6Leak()
        setResult(ipv6Result)
      } catch (error) {
        console.error('IPv6检测失败:', error)
        setResult({ error: 'IPv6检测失败' })
      } finally {
        setIsLoading(false)
      }
    }

    runDetection()
  }, [])

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
          <Network className="w-5 h-5" />
          <span>IPv6 泄露检测</span>
          {isLoading && (
            <div className="ml-auto animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-3">
            {result.error ? (
              <div className="text-red-600 dark:text-red-400 text-sm">{result.error}</div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {result.isIPv6Disabled ? (
                    <WifiOff className="w-4 h-4 text-blue-500" />
                  ) : result.hasIPv6Leak ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Shield className="w-4 h-4 text-green-500" />
                  )}
                  <div className={`inline-block px-2 py-1 rounded text-sm ${
                    result.isIPv6Disabled 
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400'
                      : result.hasIPv6Leak 
                      ? 'bg-red-600/20 text-red-600 dark:text-red-400' 
                      : 'bg-green-600/20 text-green-600 dark:text-green-400'
                  }`}>
                    {result.isIPv6Disabled 
                      ? 'IPv6 已禁用' 
                      : result.hasIPv6Leak 
                      ? '检测到 IPv6 泄露' 
                      : '无 IPv6 泄露'}
                  </div>
                </div>
                
                {result.ipv6Addresses.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-slate-600 dark:text-slate-400 text-sm">IPv6 地址:</div>
                    {result.ipv6Addresses.map((addr: string, index: number) => (
                      <div key={index} className="ml-4 text-slate-700 dark:text-slate-300 text-xs font-mono break-all">
                        {addr}
                      </div>
                    ))}
                  </div>
                )}
                
                {result.ipv4Addresses.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-slate-600 dark:text-slate-400 text-sm">IPv4 地址:</div>
                    {result.ipv4Addresses.map((addr: string, index: number) => (
                      <div key={index} className="ml-4 text-slate-700 dark:text-slate-300 text-sm font-mono">
                        {addr}
                      </div>
                    ))}
                  </div>
                )}
                
                {result.hasIPv6 && result.ipv4Addresses.length > 0 && (
                  <div className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
                    ⚠ 检测到双栈配置（IPv4 + IPv6）
                  </div>
                )}
                
                {result.isIPv6Disabled && (
                  <div className="text-blue-600 dark:text-blue-400 text-sm mt-2">
                    ℹ IPv6 已禁用有助于减少追踪面
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400">检测中...</div>
        )}
      </CardContent>
    </Card>
  )
}