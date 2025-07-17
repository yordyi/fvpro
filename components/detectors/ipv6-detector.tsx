'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { detectIPv6Leak } from '@/lib/detectors/ipv6-detection'
import { Network, Shield, AlertTriangle, WifiOff, Info, Globe } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export function IPv6Detector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const runDetection = async () => {
      setIsLoading(true)
      setProgress(0)
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90))
      }, 400)
      
      try {
        const ipv6Result = await detectIPv6Leak()
        setResult(ipv6Result)
      } catch (error) {
        console.error('IPv6检测失败:', error)
        setResult({ error: 'IPv6检测失败' })
      } finally {
        clearInterval(progressInterval)
        setProgress(100)
        setTimeout(() => setIsLoading(false), 500)
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
        {isLoading && (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">正在检测IPv6配置...</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {result && !isLoading ? (
          <div className="space-y-4">
            {result.error ? (
              <div className="text-red-600 dark:text-red-400 text-sm">{result.error}</div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {result.isIPv6Disabled ? (
                    <WifiOff className="w-5 h-5 text-blue-500" />
                  ) : result.hasIPv6Leak ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : result.hasIPv6 ? (
                    <Shield className="w-5 h-5 text-green-500" />
                  ) : (
                    <Network className="w-5 h-5 text-gray-500" />
                  )}
                  <div className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                    result.isIPv6Disabled 
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400'
                      : result.hasIPv6Leak 
                      ? 'bg-red-600/20 text-red-600 dark:text-red-400' 
                      : result.hasIPv6
                      ? 'bg-green-600/20 text-green-600 dark:text-green-400'
                      : 'bg-gray-600/20 text-gray-600 dark:text-gray-400'
                  }`}>
                    {result.isIPv6Disabled 
                      ? 'IPv6 已禁用' 
                      : result.hasIPv6Leak 
                      ? '检测到 IPv6 泄露' 
                      : result.hasIPv6
                      ? '未检测到 IPv6 泄露'
                      : '仅使用 IPv4'}
                  </div>
                  {result.leakType && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({result.leakType})
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.ipv6Addresses.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">IPv6 地址:</div>
                      {result.ipv6Addresses.map((addr: string, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="ml-4 text-slate-700 dark:text-slate-300 text-xs font-mono break-all">
                            {addr}
                          </div>
                          {result.locationData?.ipv6[index] && (
                            <div className="ml-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {result.locationData.ipv6[index].city}, {result.locationData.ipv6[index].country}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {result.ipv4Addresses.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">IPv4 地址:</div>
                      {result.ipv4Addresses.map((addr: string, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="ml-4 text-slate-700 dark:text-slate-300 text-sm font-mono">
                            {addr}
                          </div>
                          {result.locationData?.ipv4[index] && (
                            <div className="ml-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {result.locationData.ipv4[index].city}, {result.locationData.ipv4[index].country}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {result.leakDetails && result.leakDetails.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-red-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">检测到的问题：</p>
                        {result.leakDetails.map((detail: string, index: number) => (
                          <p key={index} className="text-sm text-red-600 dark:text-red-400 ml-2">
                            • {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">建议：</p>
                        {result.recommendations.map((rec: string, index: number) => (
                          <p key={index} className="text-sm text-blue-600 dark:text-blue-400 ml-2">
                            • {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {result.hasIPv6 && result.ipv4Addresses.length > 0 && !result.hasIPv6Leak && (
                  <div className="text-yellow-600 dark:text-yellow-400 text-sm flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    检测到双栈配置（IPv4 + IPv6），请确保VPN同时处理两种协议
                  </div>
                )}
              </>
            )}
          </div>
        ) : !isLoading && (
          <div className="text-slate-500 dark:text-slate-400">准备检测...</div>
        )}
      </CardContent>
    </Card>
  )
}