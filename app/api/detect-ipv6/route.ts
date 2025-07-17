import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(_request: NextRequest) {
  try {
    const headersList = await headers()
    
    // 获取客户端 IP（可能包含 IPv6）
    const forwarded = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown'
    
    // 检测 IPv6 地址 - 使用更多的源
    const ipv6Sources = [
      { url: 'https://v6.ipv6-test.com/api/myip.php', name: 'IPv6-Test' },
      { url: 'https://api6.ipify.org?format=json', name: 'IPify v6' },
      { url: 'https://v6.ident.me', name: 'Ident.me v6' },
      { url: 'https://ipv6.icanhazip.com', name: 'ICanHazIP v6' }
    ]
    
    const ipv4Sources = [
      { url: 'https://api.ipify.org?format=json', name: 'IPify v4' },
      { url: 'https://v4.ident.me', name: 'Ident.me v4' },
      { url: 'https://ipv4.icanhazip.com', name: 'ICanHazIP v4' }
    ]
    
    // 并行获取 IPv4 和 IPv6 地址
    const [ipv6Results, ipv4Results] = await Promise.all([
      Promise.allSettled(
        ipv6Sources.map(async ({ url, name }) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          
          try {
            const response = await fetch(url, { 
              signal: controller.signal,
              headers: { 'Accept': 'application/json,text/plain' }
            })
            clearTimeout(timeoutId)
            
            const contentType = response.headers.get('content-type')
            let ip: string
            
            if (contentType?.includes('json')) {
              const data = await response.json()
              ip = data.ip || data.address
            } else {
              ip = (await response.text()).trim()
            }
            
            return { ip, source: name, success: true }
          } catch (error) {
            clearTimeout(timeoutId)
            return { error: error.message, source: name, success: false }
          }
        })
      ),
      Promise.allSettled(
        ipv4Sources.map(async ({ url, name }) => {
          try {
            const response = await fetch(url)
            const contentType = response.headers.get('content-type')
            let ip: string
            
            if (contentType?.includes('json')) {
              const data = await response.json()
              ip = data.ip || data.address
            } else {
              ip = (await response.text()).trim()
            }
            
            return { ip, source: name, success: true }
          } catch (error) {
            return { error: error.message, source: name, success: false }
          }
        })
      )
    ])
    
    // 提取和分析 IPv6 地址
    const ipv6Data = ipv6Results
      .filter(result => result.status === 'fulfilled')
      .map((result: any) => result.value)
    
    const successfulIPv6 = ipv6Data.filter(d => d.success && isIPv6(d.ip))
    const ipv6Addresses = [...new Set(successfulIPv6.map(d => d.ip))]
    
    // 提取和分析 IPv4 地址
    const ipv4Data = ipv4Results
      .filter(result => result.status === 'fulfilled')
      .map((result: any) => result.value)
    
    const successfulIPv4 = ipv4Data.filter(d => d.success && isIPv4(d.ip))
    const ipv4Addresses = [...new Set(successfulIPv4.map(d => d.ip))]
    
    // 获取位置信息
    const locationData = await getIPLocations(ipv6Addresses, ipv4Addresses)
    
    // 分析结果
    const analysis = analyzeIPv6Leak(
      ipv6Addresses, 
      ipv4Addresses, 
      locationData,
      ipv6Data.filter(d => !d.success).length
    )
    
    return NextResponse.json({
      success: true,
      data: {
        hasIPv6: analysis.hasIPv6,
        hasIPv6Leak: analysis.hasIPv6Leak,
        ipv6Addresses,
        ipv4Addresses,
        isIPv6Disabled: analysis.isIPv6Disabled,
        leakType: analysis.leakType,
        leakDetails: analysis.leakDetails,
        recommendations: analysis.recommendations,
        locationData,
        clientIP,
        detectionSources: {
          ipv6: ipv6Data,
          ipv4: ipv4Data
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('IPv6 检测错误:', error)
    return NextResponse.json(
      { success: false, error: 'IPv6 检测失败' },
      { status: 500 }
    )
  }
}

// 检查是否为 IPv6 地址
function isIPv6(address: string): boolean {
  if (!address) return false
  
  // 清理地址中的额外字符
  const cleanAddress = address.trim()
  
  // IPv6 正则表达式
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
  
  return ipv6Regex.test(cleanAddress)
}

// 检查是否为 IPv4 地址
function isIPv4(address: string): boolean {
  if (!address) return false
  
  const cleanAddress = address.trim()
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
  
  if (!ipv4Regex.test(cleanAddress)) return false
  
  // 验证每个段都在 0-255 范围内
  const parts = cleanAddress.split('.')
  return parts.every(part => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255
  })
}

// 获取IP位置信息
async function getIPLocations(ipv6Addresses: string[], ipv4Addresses: string[]) {
  const locations: any = {
    ipv6: [],
    ipv4: []
  }
  
  // 获取IPv6位置
  for (const ip of ipv6Addresses.slice(0, 2)) { // 限制请求数量
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      const data = await response.json()
      locations.ipv6.push({
        ip,
        country: data.country_name,
        city: data.city,
        region: data.region,
        isp: data.org,
        latitude: data.latitude,
        longitude: data.longitude
      })
    } catch (error) {
      console.error(`获取IPv6 ${ip} 位置失败:`, error)
    }
  }
  
  // 获取IPv4位置
  for (const ip of ipv4Addresses.slice(0, 2)) { // 限制请求数量
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      const data = await response.json()
      locations.ipv4.push({
        ip,
        country: data.country_name,
        city: data.city,
        region: data.region,
        isp: data.org,
        latitude: data.latitude,
        longitude: data.longitude
      })
    } catch (error) {
      console.error(`获取IPv4 ${ip} 位置失败:`, error)
    }
  }
  
  return locations
}

// 分析IPv6泄露
function analyzeIPv6Leak(
  ipv6Addresses: string[], 
  ipv4Addresses: string[], 
  locationData: any,
  failedIPv6Requests: number
) {
  const analysis = {
    hasIPv6: ipv6Addresses.length > 0,
    hasIPv6Leak: false,
    isIPv6Disabled: false,
    leakType: null as string | null,
    leakDetails: [] as string[],
    recommendations: [] as string[]
  }
  
  // 检查是否禁用了IPv6
  if (ipv6Addresses.length === 0 && failedIPv6Requests >= 3) {
    analysis.isIPv6Disabled = true
    analysis.recommendations.push('您的IPv6似乎已禁用，这有助于防止IPv6泄露')
  }
  
  // 如果同时有IPv4和IPv6，可能存在泄露
  if (ipv6Addresses.length > 0 && ipv4Addresses.length > 0) {
    analysis.hasIPv6Leak = true
    analysis.leakType = 'dual-stack'
    analysis.leakDetails.push('同时检测到IPv4和IPv6地址，可能存在隐私泄露风险')
    
    // 检查位置是否一致
    if (locationData.ipv6.length > 0 && locationData.ipv4.length > 0) {
      const ipv6Countries = [...new Set(locationData.ipv6.map((l: any) => l.country))]
      const ipv4Countries = [...new Set(locationData.ipv4.map((l: any) => l.country))]
      
      const differentCountries = ipv6Countries.some(c => !ipv4Countries.includes(c))
      if (differentCountries) {
        analysis.leakDetails.push('IPv6和IPv4地址显示不同的地理位置')
        analysis.recommendations.push('确保VPN同时处理IPv4和IPv6流量')
      }
    }
  }
  
  // 只有IPv6的情况
  if (ipv6Addresses.length > 0 && ipv4Addresses.length === 0) {
    analysis.leakDetails.push('仅检测到IPv6地址，这是较为安全的配置')
  }
  
  // 检查是否为本地IPv6地址
  const hasLocalIPv6 = ipv6Addresses.some(ip => 
    ip.startsWith('fe80:') || // 链路本地地址
    ip.startsWith('fc00:') || // 唯一本地地址
    ip.startsWith('fd00:')    // 唯一本地地址
  )
  
  if (hasLocalIPv6) {
    analysis.leakDetails.push('检测到本地IPv6地址')
  }
  
  // 建议
  if (analysis.hasIPv6) {
    if (!analysis.hasIPv6Leak) {
      analysis.recommendations.push('继续保持当前的IPv6配置')
    } else {
      analysis.recommendations.push('考虑禁用IPv6以防止泄露')
      analysis.recommendations.push('使用支持IPv6的VPN服务')
      analysis.recommendations.push('在路由器级别配置IPv6防火墙规则')
    }
  }
  
  return analysis
}