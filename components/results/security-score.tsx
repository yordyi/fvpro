'use client'

import { DetectionResults } from '@/lib/types/detection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'

interface SecurityScoreProps {
  results: DetectionResults
}

export function SecurityScore({ results }: SecurityScoreProps) {
  const { score } = results

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-400'
    if (value >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreIcon = () => {
    if (score.total >= 80) return <CheckCircle className="w-6 h-6 text-green-400" />
    if (score.total >= 50) return <AlertTriangle className="w-6 h-6 text-yellow-400" />
    return <AlertTriangle className="w-6 h-6 text-red-400" />
  }

  const getScoreMessage = () => {
    if (score.total >= 80) return '您的隐私保护良好'
    if (score.total >= 50) return '您的隐私保护一般，建议改进'
    return '您的隐私保护较弱，需要加强'
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>隐私安全评分</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {getScoreIcon()}
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(score.total)}`}>
                {score.total}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">/ 100</div>
              <div className="text-slate-700 dark:text-slate-300 text-sm mt-3">
                {getScoreMessage()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">IP隐私保护</span>
                <span className={getScoreColor(score.breakdown.ipPrivacy)}>
                  {score.breakdown.ipPrivacy}%
                </span>
              </div>
              <Progress value={score.breakdown.ipPrivacy} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">WebRTC防护</span>
                <span className={getScoreColor(score.breakdown.webrtcProtection)}>
                  {score.breakdown.webrtcProtection}%
                </span>
              </div>
              <Progress value={score.breakdown.webrtcProtection} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">DNS隐私</span>
                <span className={getScoreColor(score.breakdown.dnsPrivacy)}>
                  {score.breakdown.dnsPrivacy}%
                </span>
              </div>
              <Progress value={score.breakdown.dnsPrivacy} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">IPv6防护</span>
                <span className={getScoreColor(score.breakdown.ipv6Protection)}>
                  {score.breakdown.ipv6Protection}%
                </span>
              </div>
              <Progress value={score.breakdown.ipv6Protection} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">指纹抗性</span>
                <span className={getScoreColor(score.breakdown.fingerprintResistance)}>
                  {score.breakdown.fingerprintResistance}%
                </span>
              </div>
              <Progress value={score.breakdown.fingerprintResistance} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">浏览器加固</span>
                <span className={getScoreColor(score.breakdown.browserHardening)}>
                  {score.breakdown.browserHardening}%
                </span>
              </div>
              <Progress value={score.breakdown.browserHardening} className="h-2" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <div className="text-slate-700 dark:text-slate-300 text-sm">
              <div className="font-medium mb-2">安全等级: {
                score.level === 'high' ? '高' :
                score.level === 'medium' ? '中' : '低'
              }</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs">
                检测时间: {new Date(results.timestamp).toLocaleString('zh-CN')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}