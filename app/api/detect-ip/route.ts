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

    // 获取位置信息（使用HTTPS的ipapi.co服务）
    let location = undefined
    let vpnInfo = undefined
    if (detectedIPs.length > 0) {
      try {
        const geoResponse = await fetch(`https://ipapi.co/${detectedIPs[0].ip}/json/`)
        const geoData = await geoResponse.json()
        if (!geoData.error) {
          location = {
            country: geoData.country_name,
            countryCode: geoData.country_code,
            city: geoData.city,
            region: geoData.region,
            timezone: geoData.timezone,
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            isp: geoData.org
          }
          // ipapi.co提供VPN检测
          vpnInfo = {
            isVPN: geoData.vpn || false,
            isProxy: geoData.proxy || false,
            isTor: geoData.tor || false,
            isHosting: geoData.hosting || false
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
        isVPN: vpnInfo?.isVPN || isVPN,
        isProxy: vpnInfo?.isProxy || false,
        isTor: vpnInfo?.isTor || false,
        isHosting: vpnInfo?.isHosting || false,
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