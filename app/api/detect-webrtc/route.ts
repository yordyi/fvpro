import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // WebRTC检测必须在客户端执行，API端点只返回指示
    return NextResponse.json({
      success: true,
      data: {
        message: 'WebRTC检测需要在客户端执行',
        clientSideRequired: true
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'WebRTC检测API错误' },
      { status: 500 }
    )
  }
}