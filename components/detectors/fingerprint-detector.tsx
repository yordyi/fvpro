'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { detectFingerprint } from '@/lib/detectors/fingerprint-detection'
import { Fingerprint, Monitor, Volume2, Type } from 'lucide-react'

export function FingerprintDetector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDetection = async () => {
      setIsLoading(true)
      try {
        const fingerprintResult = await detectFingerprint()
        setResult(fingerprintResult)
      } catch (error) {
        console.error('指纹检测失败:', error)
        setResult({ error: '指纹检测失败' })
      } finally {
        setIsLoading(false)
      }
    }

    runDetection()
  }, [])

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Fingerprint className="w-5 h-5" />
          <span>浏览器指纹分析</span>
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
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">唯一性评分</span>
                  <div className={`px-2 py-1 rounded text-sm ${
                    result.uniquenessScore > 70 
                      ? 'bg-red-600/20 text-red-400'
                      : result.uniquenessScore > 40
                      ? 'bg-yellow-600/20 text-yellow-400'
                      : 'bg-green-600/20 text-green-400'
                  }`}>
                    {result.uniquenessScore}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      Canvas指纹: {result.canvasFingerprint ? '已检测' : '未检测'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      WebGL指纹: {result.webglFingerprint ? '已检测' : '未检测'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      音频指纹: {result.audioFingerprint ? '已检测' : '未检测'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      检测到 {result.fontFingerprint?.length || 0} 种字体
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 mt-3">
                  提示: 唯一性评分越高，越容易被追踪
                </div>
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