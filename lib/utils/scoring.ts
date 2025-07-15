import { IPDetectionResult, WebRTCResult, FingerprintResult, BrowserResult, DNSResult, IPv6Result, SecurityScore } from '@/lib/types/detection'
import { analyzeIPPrivacy } from '@/lib/detectors/ip-detection'
import { analyzeWebRTCPrivacy } from '@/lib/detectors/webrtc-detection'
import { analyzeBrowserPrivacy } from '@/lib/detectors/browser-analysis'
import { analyzeDNSPrivacy } from '@/lib/detectors/dns-detection'
import { analyzeIPv6Privacy } from '@/lib/detectors/ipv6-detection'

export function calculateSecurityScore(data: {
  ipResult: IPDetectionResult
  webrtcResult: WebRTCResult
  fingerprintResult: FingerprintResult
  browserResult: BrowserResult
  dnsResult: DNSResult
  ipv6Result: IPv6Result
}): SecurityScore {
  // 计算各项得分
  const ipAnalysis = analyzeIPPrivacy(data.ipResult.detectedIPs)
  const webrtcAnalysis = analyzeWebRTCPrivacy(data.webrtcResult)
  const browserAnalysis = analyzeBrowserPrivacy(data.browserResult)
  const dnsAnalysis = analyzeDNSPrivacy(data.dnsResult, data.ipResult.location)
  const ipv6Analysis = analyzeIPv6Privacy(data.ipv6Result)
  
  // 指纹抗性得分
  const fingerprintScore = 100 - data.fingerprintResult.uniquenessScore
  
  // 计算总分（更新权重以包含新项目）
  const weights = {
    ip: 0.2,
    webrtc: 0.2,
    fingerprint: 0.2,
    browser: 0.15,
    dns: 0.15,
    ipv6: 0.1
  }
  
  const breakdown = {
    ipPrivacy: ipAnalysis.score,
    webrtcProtection: webrtcAnalysis.score,
    fingerprintResistance: fingerprintScore,
    browserHardening: browserAnalysis.score,
    dnsPrivacy: dnsAnalysis.score,
    ipv6Protection: ipv6Analysis.score
  }
  
  const total = Math.round(
    breakdown.ipPrivacy * weights.ip +
    breakdown.webrtcProtection * weights.webrtc +
    breakdown.fingerprintResistance * weights.fingerprint +
    breakdown.browserHardening * weights.browser +
    breakdown.dnsPrivacy * weights.dns +
    breakdown.ipv6Protection * weights.ipv6
  )
  
  // 确定安全等级
  let level: 'low' | 'medium' | 'high'
  if (total >= 80) {
    level = 'high'
  } else if (total >= 50) {
    level = 'medium'
  } else {
    level = 'low'
  }
  
  return {
    total,
    breakdown,
    level
  }
}