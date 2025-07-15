import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(_request: NextRequest) {
  try {
    const headersList = await headers()
    
    // 获取客户端 IP（可能包含 IPv6）
    const forwarded = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown'
    
    // 检测 IPv6 地址
    const ipv6Sources = [
      'https://v6.ipv6-test.com/api/myip.php',
      'https://api6.ipify.org?format=json',
      'https://v6.ident.me'
    ]
    
    const ipv4Sources = [
      'https://api.ipify.org?format=json',
      'https://v4.ident.me'
    ]
    
    // 并行获取 IPv4 和 IPv6 地址
    const [ipv6Results, ipv4Results] = await Promise.all([
      Promise.allSettled(
        ipv6Sources.map(async (url) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)
          
          try {
            const response = await fetch(url, { 
              signal: controller.signal,
              headers: { 'Accept': 'application/json,text/plain' }
            })
            clearTimeout(timeoutId)
            
            const contentType = response.headers.get('content-type')
            if (contentType?.includes('json')) {
              return await response.json()
            } else {
              const text = await response.text()
              return { ip: text.trim() }
            }
          } catch (error) {
            clearTimeout(timeoutId)
            throw error
          }
        })
      ),
      Promise.allSettled(
        ipv4Sources.map(async (url) => {
          const response = await fetch(url)
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('json')) {
            return await response.json()
          } else {
            const text = await response.text()
            return { ip: text.trim() }
          }
        })
      )
    ])
    
    // 提取 IPv6 地址
    const ipv6Addresses = ipv6Results
      .filter(result => result.status === 'fulfilled')
      .map((result: any) => result.value.ip || result.value)
      .filter((ip: string) => isIPv6(ip))
    
    // 提取 IPv4 地址
    const ipv4Addresses = ipv4Results
      .filter(result => result.status === 'fulfilled')
      .map((result: any) => result.value.ip || result.value)
      .filter((ip: string) => isIPv4(ip))
    
    // 分析结果
    const hasIPv6 = ipv6Addresses.length > 0
    const hasIPv6Leak = hasIPv6 && ipv4Addresses.length > 0 // 简化的泄露检测
    const isIPv6Disabled = ipv6Addresses.length === 0 && 
                          ipv6Results.every(r => r.status === 'rejected')
    
    return NextResponse.json({
      success: true,
      data: {
        hasIPv6,
        hasIPv6Leak,
        ipv6Addresses: [...new Set(ipv6Addresses)], // 去重
        ipv4Addresses: [...new Set(ipv4Addresses)], // 去重
        isIPv6Disabled,
        clientIP,
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
  
  // 简化的 IPv6 验证
  return cleanAddress.includes(':') && 
         !cleanAddress.includes('.') || 
         cleanAddress.includes('::')
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