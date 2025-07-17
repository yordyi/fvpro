'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { detectDNSLeak } from '@/lib/detectors/dns-detection'
import { Network, Shield, AlertTriangle, Globe, Info, ShieldCheck } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export function DNSDetector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const runDetection = async () => {
      setIsLoading(true)
      setProgress(0)
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90))
      }, 300)
      
      try {
        const dnsResult = await detectDNSLeak()
        setResult(dnsResult)
      } catch (error) {
        console.error('DNS检测失败:', error)
        setResult({ error: 'DNS检测失败' })
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
          <span>DNS泄露检测</span>
          {isLoading && (
            <div className="ml-auto animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">正在分析DNS配置...</p>
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
                  {result.hasDNSLeak ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : result.isUsingVPNDNS ? (
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <Shield className="w-5 h-5 text-green-500" />
                  )}
                  <div className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                    result.hasDNSLeak 
                      ? 'bg-red-600/20 text-red-600 dark:text-red-400' 
                      : result.isUsingVPNDNS 
                        ? 'bg-green-600/20 text-green-600 dark:text-green-400'
                        : 'bg-green-600/20 text-green-600 dark:text-green-400'
                  }`}>
                    {result.hasDNSLeak ? '检测到DNS泄露' : 
                     result.isUsingVPNDNS ? '使用安全DNS配置' : 
                     '无DNS泄露'}
                  </div>
                </div>
                
                {result.dnsServers && result.dnsServers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">DNS服务器:</div>
                    {result.dnsServers.map((server: string, index: number) => (
                      <div key={index} className="ml-4 flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-mono">{server}</span>
                        {result.dnsLocation && result.dnsLocation[index] && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({result.dnsLocation[index].isp || 'Unknown'})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
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
                
                <div className="flex items-center gap-4 text-sm pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">VPN DNS:</span>
                    <span className={result.isUsingVPNDNS ? 'text-green-600 dark:text-green-400 font-medium' : 'text-yellow-600 dark:text-yellow-400'}>
                      {result.isUsingVPNDNS ? '是' : '否'}
                    </span>
                  </div>
                  
                  {result.ipInfo && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-300">
                        {result.ipInfo.city}, {result.ipInfo.country}
                      </span>
                    </div>
                  )}
                </div>
                
                {!result.hasDNSLeak && result.dnsServers && result.dnsServers.some((dns: string) => 
                  ['1.1.1.1', '1.0.0.1', '9.9.9.9', '94.140.14.14'].includes(dns)
                ) && (
                  <div className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    使用隐私优先的DNS服务
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