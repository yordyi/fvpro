import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // 注意：完整的 DNS 泄露检测需要在客户端执行特殊的 DNS 查询
    // 这里我们模拟一个基本的检测，实际产品中需要更复杂的实现
    
    // 获取客户端的 DNS 解析信息
    // 在实际应用中，这需要通过特殊的 DNS 查询技术来实现
    const dnsServers = await detectDNSServers()
    
    // 分析 DNS 配置
    const hasDNSLeak = dnsServers.length > 0 && !isUsingSecureDNS(dnsServers)
    const isUsingVPNDNS = checkIfVPNDNS(dnsServers)
    
    // 获取 DNS 服务器的地理位置
    const dnsLocation = dnsServers.length > 0 ? 
      await getDNSLocation(dnsServers[0]) : undefined

    return NextResponse.json({
      success: true,
      data: {
        hasDNSLeak,
        dnsServers,
        isUsingVPNDNS,
        dnsLocation,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('DNS 检测错误:', error)
    return NextResponse.json(
      { success: false, error: 'DNS 检测失败' },
      { status: 500 }
    )
  }
}

// 模拟 DNS 服务器检测
async function detectDNSServers(): Promise<string[]> {
  // 在实际实现中，这需要：
  // 1. 客户端发起特殊的 DNS 查询
  // 2. 服务器记录查询来源
  // 3. 返回检测到的 DNS 服务器
  
  // 这里返回模拟数据
  const commonDNSServers = [
    '8.8.8.8',      // Google DNS
    '8.8.4.4',      // Google DNS
    '1.1.1.1',      // Cloudflare DNS
    '9.9.9.9',      // Quad9 DNS
    '208.67.222.222', // OpenDNS
  ]
  
  // 随机返回 1-2 个 DNS 服务器模拟检测结果
  const count = Math.floor(Math.random() * 2) + 1
  return commonDNSServers.slice(0, count)
}

// 检查是否使用安全的 DNS
function isUsingSecureDNS(dnsServers: string[]): boolean {
  const secureDNS = [
    '1.1.1.1',      // Cloudflare
    '1.0.0.1',      // Cloudflare
    '9.9.9.9',      // Quad9
    '149.112.112.112', // Quad9
    '94.140.14.14', // AdGuard
    '94.140.15.15', // AdGuard
  ]
  
  return dnsServers.some(dns => secureDNS.includes(dns))
}

// 检查是否使用 VPN DNS
function checkIfVPNDNS(dnsServers: string[]): boolean {
  // 简化的检查逻辑
  // 实际应该比较 DNS 服务器和 IP 地址的位置
  return dnsServers.length > 0 && !isPublicDNS(dnsServers[0])
}

// 检查是否为公共 DNS
function isPublicDNS(dns: string): boolean {
  const publicDNS = [
    '8.8.8.8', '8.8.4.4',           // Google
    '1.1.1.1', '1.0.0.1',           // Cloudflare
    '9.9.9.9', '149.112.112.112',   // Quad9
    '208.67.222.222', '208.67.220.220', // OpenDNS
  ]
  
  return publicDNS.includes(dns)
}

// 获取 DNS 服务器位置
async function getDNSLocation(dnsServer: string): Promise<{
  country: string
  city: string
  isp: string
} | undefined> {
  // 使用 IP 地理位置 API
  try {
    const response = await fetch(`http://ip-api.com/json/${dnsServer}`)
    const data = await response.json()
    
    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city,
        isp: data.isp
      }
    }
  } catch (error) {
    console.error('获取 DNS 位置失败:', error)
  }
  
  return undefined
}