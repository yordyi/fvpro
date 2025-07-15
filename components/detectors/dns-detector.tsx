'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { detectDNSLeak } from '@/lib/detectors/dns-detection'
import { Network, Shield, AlertTriangle, Globe } from 'lucide-react'

export function DNSDetector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDetection = async () => {
      setIsLoading(true)
      try {
        const dnsResult = await detectDNSLeak()
        setResult(dnsResult)
      } catch (error) {
        console.error('DNS检测失败:', error)
        setResult({ error: 'DNS检测失败' })
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
          <span>DNS泄露检测</span>
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
                  {result.hasDNSLeak ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Shield className="w-4 h-4 text-green-500" />
                  )}
                  <div className={`inline-block px-2 py-1 rounded text-sm ${
                    result.hasDNSLeak 
                      ? 'bg-red-600/20 text-red-600 dark:text-red-400' 
                      : 'bg-green-600/20 text-green-600 dark:text-green-400'
                  }`}>
                    {result.hasDNSLeak ? '检测到DNS泄露' : '无DNS泄露'}
                  </div>
                </div>
                
                {result.dnsServers.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-slate-600 dark:text-slate-400 text-sm">DNS服务器:</div>
                    {result.dnsServers.map((server: string, index: number) => (
                      <div key={index} className="ml-4 text-slate-700 dark:text-slate-300 text-sm font-mono">
                        {server}
                      </div>
                    ))}
                  </div>
                )}
                
                {result.dnsLocation && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300 text-sm">
                      DNS位置: {result.dnsLocation.city}, {result.dnsLocation.country}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600 dark:text-slate-400">VPN DNS:</span>
                  <span className={result.isUsingVPNDNS ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                    {result.isUsingVPNDNS ? '是' : '否'}
                  </span>
                </div>
                
                {!result.hasDNSLeak && result.dnsServers.some((dns: string) => 
                  ['1.1.1.1', '9.9.9.9', '94.140.14.14'].includes(dns)
                ) && (
                  <div className="text-green-600 dark:text-green-400 text-sm mt-2">
                    ✓ 使用隐私优先的DNS服务
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