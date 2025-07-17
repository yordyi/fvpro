'use client'

import { DetectionResults } from '@/lib/types/detection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, CheckCircle, Download, RefreshCw } from 'lucide-react'
import { exportReportAsPDF } from '@/lib/utils/pdf-export'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'

interface SecurityScoreProps {
  results: DetectionResults
  onReset?: () => void
}

export function SecurityScore({ results, onReset }: SecurityScoreProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { score } = results
  const [isExporting, setIsExporting] = useState(false)

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
    if (score.total >= 80) return t('security.score.excellent')
    if (score.total >= 50) return t('security.score.good')  
    if (score.total >= 30) return t('security.score.fair')
    return t('security.score.poor')
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const filename = `${t('export.filename')}-${new Date().toISOString().split('T')[0]}.pdf`
      await exportReportAsPDF(results, filename)
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>{t('detection.score')}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {onReset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="h-8"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  {t('detection.reset')}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="h-8"
              >
                <Download className="w-4 h-4 mr-1" />
                {isExporting ? t('export.generating') : t('export.pdf')}
              </Button>
            </div>
          </div>
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
                <span className="text-slate-600 dark:text-slate-400">{t('categories.ip')}</span>
                <span className={getScoreColor(score.breakdown.ipPrivacy)}>
                  {score.breakdown.ipPrivacy}%
                </span>
              </div>
              <Progress value={score.breakdown.ipPrivacy} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">{t('categories.webrtc')}</span>
                <span className={getScoreColor(score.breakdown.webrtcProtection)}>
                  {score.breakdown.webrtcProtection}%
                </span>
              </div>
              <Progress value={score.breakdown.webrtcProtection} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">{t('categories.dns')}</span>
                <span className={getScoreColor(score.breakdown.dnsPrivacy)}>
                  {score.breakdown.dnsPrivacy}%
                </span>
              </div>
              <Progress value={score.breakdown.dnsPrivacy} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">{t('categories.ipv6')}</span>
                <span className={getScoreColor(score.breakdown.ipv6Protection)}>
                  {score.breakdown.ipv6Protection}%
                </span>
              </div>
              <Progress value={score.breakdown.ipv6Protection} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">{t('categories.fingerprint')}</span>
                <span className={getScoreColor(score.breakdown.fingerprintResistance)}>
                  {score.breakdown.fingerprintResistance}%
                </span>
              </div>
              <Progress value={score.breakdown.fingerprintResistance} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">{t('categories.browser')}</span>
                <span className={getScoreColor(score.breakdown.browserHardening)}>
                  {score.breakdown.browserHardening}%
                </span>
              </div>
              <Progress value={score.breakdown.browserHardening} className="h-2" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <div className="text-slate-700 dark:text-slate-300 text-sm">
              <div className="font-medium mb-2">
                {t('detection.level')}: {t(`security.level.${score.level}`)}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs">
                {t('detection.timestamp')}: {new Date(results.timestamp).toLocaleString(locale)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}