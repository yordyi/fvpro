import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // 指纹检测必须在客户端执行
    return NextResponse.json({
      success: true,
      data: {
        message: '浏览器指纹检测需要在客户端执行',
        clientSideRequired: true,
        components: [
          'canvas',
          'webgl',
          'audio',
          'fonts',
          'screen',
          'browser'
        ]
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '指纹检测API错误' },
      { status: 500 }
    )
  }
}