import jsPDF from 'jspdf'
import { DetectionResults } from '@/lib/types/detection'

export async function generatePDFReport(results: DetectionResults, title: string = '隐私检测报告') {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const margin = 20
  const lineHeight = 7
  let yPosition = margin

  // 设置字体（jsPDF默认不支持中文，这里使用英文）
  pdf.setFont('helvetica')

  // 添加标题
  pdf.setFontSize(24)
  pdf.setTextColor(33, 33, 33)
  pdf.text('Privacy Detection Report', pdf.internal.pageSize.width / 2, yPosition, { align: 'center' })
  yPosition += lineHeight * 2

  // 添加生成时间
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  const date = new Date(results.timestamp).toLocaleString('en-US')
  pdf.text(`Generated: ${date}`, pdf.internal.pageSize.width / 2, yPosition, { align: 'center' })
  yPosition += lineHeight * 3

  // 添加总分
  pdf.setFontSize(32)
  pdf.setTextColor(getScoreColor(results.score.total))
  pdf.text(results.score.total.toString(), pdf.internal.pageSize.width / 2, yPosition, { align: 'center' })
  
  pdf.setFontSize(12)
  pdf.setTextColor(100, 100, 100)
  yPosition += lineHeight
  pdf.text(`out of 100`, pdf.internal.pageSize.width / 2, yPosition, { align: 'center' })
  yPosition += lineHeight * 2

  // 安全等级
  pdf.setFontSize(16)
  const levelColor = getLevelColor(results.score.level)
  pdf.setTextColor(levelColor.r, levelColor.g, levelColor.b)
  pdf.text(`Security Level: ${results.score.level.toUpperCase()}`, pdf.internal.pageSize.width / 2, yPosition, { align: 'center' })
  yPosition += lineHeight * 3

  // 分隔线
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPosition, pdf.internal.pageSize.width - margin, yPosition)
  yPosition += lineHeight * 2

  // 各项评分
  pdf.setFontSize(14)
  pdf.setTextColor(33, 33, 33)
  pdf.text('Detection Results:', margin, yPosition)
  yPosition += lineHeight * 2

  // IP检测结果
  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  pdf.text('IP Detection:', margin, yPosition)
  yPosition += lineHeight
  
  pdf.setFontSize(10)
  pdf.setTextColor(66, 66, 66)
  pdf.text(`• Client IP: ${results.ip.clientIP}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• IP Consistent: ${results.ip.isConsistent ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• VPN Detected: ${results.ip.isVPN ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Proxy Detected: ${results.ip.isProxy ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Tor Detected: ${results.ip.isTor ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight * 2

  // WebRTC检测结果
  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  pdf.text('WebRTC Detection:', margin, yPosition)
  yPosition += lineHeight
  
  pdf.setFontSize(10)
  pdf.setTextColor(66, 66, 66)
  pdf.text(`• Leak Detected: ${results.webrtc.hasLeak ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Local IPs: ${results.webrtc.localIPs.length}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Public IPs: ${results.webrtc.publicIPs.length}`, margin + 5, yPosition)
  yPosition += lineHeight * 2

  // DNS检测结果
  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  pdf.text('DNS Detection:', margin, yPosition)
  yPosition += lineHeight
  
  pdf.setFontSize(10)
  pdf.setTextColor(66, 66, 66)
  pdf.text(`• DNS Leak: ${results.dns.hasDNSLeak ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• DNS Servers: ${results.dns.dnsServers.length}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Using VPN DNS: ${results.dns.isUsingVPNDNS ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight * 2

  // IPv6检测结果
  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  pdf.text('IPv6 Detection:', margin, yPosition)
  yPosition += lineHeight
  
  pdf.setFontSize(10)
  pdf.setTextColor(66, 66, 66)
  pdf.text(`• IPv6 Enabled: ${!results.ipv6.isIPv6Disabled ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• IPv6 Leak: ${results.ipv6.hasIPv6Leak ? 'Yes' : 'No'}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• IPv6 Addresses: ${results.ipv6.ipv6Addresses.length}`, margin + 5, yPosition)
  yPosition += lineHeight * 2

  // 浏览器指纹
  if (yPosition > 200) {
    pdf.addPage()
    yPosition = margin
  }

  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  pdf.text('Browser Fingerprint:', margin, yPosition)
  yPosition += lineHeight
  
  pdf.setFontSize(10)
  pdf.setTextColor(66, 66, 66)
  pdf.text(`• Uniqueness Score: ${results.fingerprint.uniquenessScore}%`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Browser: ${results.browser.userAgent.split(' ')[0]}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Platform: ${results.browser.platform}`, margin + 5, yPosition)
  yPosition += lineHeight
  pdf.text(`• Language: ${results.browser.language}`, margin + 5, yPosition)
  yPosition += lineHeight * 3

  // 评分详情
  pdf.setFontSize(14)
  pdf.setTextColor(33, 33, 33)
  pdf.text('Score Breakdown:', margin, yPosition)
  yPosition += lineHeight * 2

  const breakdown = results.score.breakdown
  const scoreItems = [
    { label: 'IP Privacy', score: breakdown.ipPrivacy },
    { label: 'WebRTC Protection', score: breakdown.webrtcProtection },
    { label: 'DNS Privacy', score: breakdown.dnsPrivacy },
    { label: 'IPv6 Protection', score: breakdown.ipv6Protection },
    { label: 'Fingerprint Resistance', score: breakdown.fingerprintResistance },
    { label: 'Browser Hardening', score: breakdown.browserHardening }
  ]

  pdf.setFontSize(10)
  scoreItems.forEach(item => {
    pdf.setTextColor(33, 33, 33)
    pdf.text(`${item.label}:`, margin + 5, yPosition)
    
    const scoreColor = getScoreColor(item.score)
    pdf.setTextColor(scoreColor)
    pdf.text(`${item.score}/100`, margin + 60, yPosition)
    
    yPosition += lineHeight
  })

  // 页脚
  const pageCount = pdf.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(
      `Page ${i} of ${pageCount} - Privacy Guardian Report`,
      pdf.internal.pageSize.width / 2,
      pdf.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

  return pdf
}

function getScoreColor(score: number): number[] {
  if (score >= 80) return [34, 197, 94] // green
  if (score >= 50) return [251, 191, 36] // yellow
  return [239, 68, 68] // red
}

function getLevelColor(level: string): { r: number, g: number, b: number } {
  switch (level) {
    case 'high':
      return { r: 34, g: 197, b: 94 }
    case 'medium':
      return { r: 251, g: 191, b: 36 }
    case 'low':
      return { r: 239, g: 68, b: 68 }
    default:
      return { r: 100, g: 100, b: 100 }
  }
}

export function downloadPDF(pdf: jsPDF, filename: string = 'privacy-report.pdf') {
  pdf.save(filename)
}

export async function exportReportAsPDF(results: DetectionResults, filename?: string) {
  const pdf = await generatePDFReport(results)
  const defaultFilename = `privacy-report-${new Date().toISOString().split('T')[0]}.pdf`
  downloadPDF(pdf, filename || defaultFilename)
}