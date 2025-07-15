'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { detectWebRTCLeak } from '@/lib/detectors/webrtc-detection'
import { Network, Shield, AlertTriangle } from 'lucide-react'

export function WebRTCDetector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDetection = async () => {
      setIsLoading(true)
      try {
        const webrtcResult = await detectWebRTCLeak()
        setResult(webrtcResult)
      } catch (error) {
        console.error('WebRTC检测失败:', error)
        setResult({ error: 'WebRTC检测失败' })
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
          <Network className="w-5 h-5" />
          <span>WebRTC泄露检测</span>
          {isLoading && (
            <div className="ml-auto animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {result.hasLeak ? (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              ) : (
                <Shield className="w-4 h-4 text-green-400" />
              )}
              <div className={`inline-block px-2 py-1 rounded text-sm ${
                result.hasLeak 
                  ? 'bg-red-600/20 text-red-400' 
                  : 'bg-green-600/20 text-green-400'
              }`}>
                {result.hasLeak ? '检测到IP泄露' : '无IP泄露'}
              </div>
            </div>
            
            {result.localIPs.length > 0 && (
              <div className="space-y-1">
                <div className="text-slate-400 text-sm">本地IP地址:</div>
                {result.localIPs.map((ip: string, index: number) => (
                  <div key={index} className="ml-4 text-slate-300 text-sm font-mono">
                    {ip}
                  </div>
                ))}
              </div>
            )}
            
            {result.publicIPs.length > 0 && (
              <div className="space-y-1">
                <div className="text-slate-400 text-sm">公网IP地址:</div>
                {result.publicIPs.map((ip: string, index: number) => (
                  <div key={index} className="ml-4 text-slate-300 text-sm font-mono">
                    {ip}
                  </div>
                ))}
              </div>
            )}
            
            {!result.hasLeak && (
              <div className="text-slate-400 text-sm mt-2">
                ✓ WebRTC已禁用或配置正确
              </div>
            )}
            
            {result.error && (
              <div className="text-red-400 text-sm">{result.error}</div>
            )}
          </div>
        ) : (
          <div className="text-slate-400">检测中...</div>
        )}
      </CardContent>
    </Card>
  )
}