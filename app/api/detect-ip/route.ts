import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(_request: NextRequest) {
  try {
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown'

    // 获取多个IP检测源
    const ipSources = [
      'https://api.ipify.org?format=json',
      'https://httpbin.org/ip',
      'https://api.myip.com'
    ]

    const ipResults = await Promise.allSettled(
      ipSources.map(async (url) => {
        const response = await fetch(url)
        return response.json()
      })
    )

    const detectedIPs = ipResults
      .filter(result => result.status === 'fulfilled')
      .map((result: any) => ({
        ip: result.value.ip || result.value.origin || result.value.ip_addr,
        source: result.value.ip ? 'ipify' : result.value.origin ? 'httpbin' : 'myip'
      }))

    // 简单的VPN检测逻辑
    const isVPN = detectedIPs.length > 1 && 
      new Set(detectedIPs.map(item => item.ip)).size > 1

    // 获取位置信息（使用免费的IP-API服务）
    let location = undefined
    if (detectedIPs.length > 0) {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${detectedIPs[0].ip}`)
        const geoData = await geoResponse.json()
        if (geoData.status === 'success') {
          location = {
            country: geoData.country,
            city: geoData.city,
            region: geoData.regionName
          }
        }
      } catch (error) {
        console.error('位置信息获取失败:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        clientIP,
        detectedIPs,
        isConsistent: new Set(detectedIPs.map(item => item.ip)).size === 1,
        isVPN,
        location,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('IP检测错误:', error)
    return NextResponse.json(
      { success: false, error: 'IP检测失败' },
      { status: 500 }
    )
  }
}