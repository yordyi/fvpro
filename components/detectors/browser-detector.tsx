'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { detectBrowser } from '@/lib/detectors/browser-analysis'
import { Chrome, Shield, Cookie, Cpu } from 'lucide-react'

export function BrowserDetector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDetection = async () => {
      setIsLoading(true)
      try {
        const browserResult = await detectBrowser()
        setResult(browserResult)
      } catch (error) {
        console.error('浏览器检测失败:', error)
        setResult({ error: '浏览器检测失败' })
      } finally {
        setIsLoading(false)
      }
    }

    runDetection()
  }, [])

  const getBrowserIcon = () => {
    if (!result?.userAgent) return <Chrome className="w-5 h-5" />
    const ua = result.userAgent.toLowerCase()
    if (ua.includes('firefox')) return '🦊'
    if (ua.includes('safari') && !ua.includes('chrome')) return '🧭'
    if (ua.includes('edge')) return '🌐'
    return <Chrome className="w-5 h-5" />
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {getBrowserIcon()}
          <span>浏览器信息</span>
          {isLoading && (
            <div className="ml-auto animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-3">
            {result.error ? (
              <div className="text-red-400 text-sm">{result.error}</div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      Do Not Track: {result.doNotTrack ? (
                        <span className="text-green-400">启用 ✓</span>
                      ) : (
                        <span className="text-red-400">未启用 ✗</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Cookie className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      Cookie: {result.cookiesEnabled ? (
                        <span className="text-yellow-400">已启用</span>
                      ) : (
                        <span className="text-green-400">已禁用</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      硬件信息: {result.hardwareConcurrency > 0 && `${result.hardwareConcurrency} 核`}
                      {result.deviceMemory > 0 && ` / ${result.deviceMemory}GB`}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-slate-700">
                  <div className="text-slate-400 text-xs">
                    平台: {result.platform}
                  </div>
                  <div className="text-slate-400 text-xs">
                    语言: {result.language}
                  </div>
                  <div className="text-slate-400 text-xs">
                    分辨率: {result.screenResolution}
                  </div>
                  <div className="text-slate-400 text-xs">
                    时区: {result.timezone}
                  </div>
                </div>
                
                {result.plugins.length > 0 && (
                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">
                      插件 ({result.plugins.length}):
                    </div>
                    <div className="text-slate-300 text-xs space-y-0.5">
                      {result.plugins.slice(0, 3).map((plugin: string, index: number) => (
                        <div key={index} className="truncate">{plugin}</div>
                      ))}
                      {result.plugins.length > 3 && (
                        <div className="text-slate-500">...还有 {result.plugins.length - 3} 个</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-slate-400">检测中...</div>
        )}
      </CardContent>
    </Card>
  )
}