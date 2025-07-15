'use client'

import React from 'react'
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

/**
 * Privacy Guardian 现代化设计系统组件
 * 基于深蓝渐变背景和现代化用户体验设计
 */

// 1. 颜色系统展示
export function ColorPalette() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* 主色调 */}
      <div className="privacy-card p-6">
        <h3 className="privacy-text-heading text-lg mb-4">主色调</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary rounded-md"></div>
            <span className="privacy-text-body text-sm">Primary (#6366f1)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-secondary rounded-md"></div>
            <span className="privacy-text-body text-sm">Secondary (#3b82f6)</span>
          </div>
        </div>
      </div>

      {/* 语义颜色 */}
      <div className="privacy-card p-6">
        <h3 className="privacy-text-heading text-lg mb-4">语义颜色</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-success rounded-md"></div>
            <span className="privacy-text-body text-sm">Success (#10b981)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-warning rounded-md"></div>
            <span className="privacy-text-body text-sm">Warning (#f59e0b)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-destructive rounded-md"></div>
            <span className="privacy-text-body text-sm">Error (#ef4444)</span>
          </div>
        </div>
      </div>

      {/* 文本颜色 */}
      <div className="privacy-card p-6">
        <h3 className="privacy-text-heading text-lg mb-4">文本颜色</h3>
        <div className="space-y-3">
          <div className="text-text-primary">Primary Text</div>
          <div className="text-text-secondary">Secondary Text</div>
          <div className="text-text-muted">Muted Text</div>
          <div className="text-text-disabled">Disabled Text</div>
        </div>
      </div>
    </div>
  )
}

// 2. 按钮组件系统
export function ButtonSystem() {
  return (
    <div className="privacy-card p-6">
      <h3 className="privacy-text-heading text-lg mb-6">按钮系统</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 主要按钮 */}
        <div className="space-y-4">
          <h4 className="privacy-text-body font-medium">主要按钮</h4>
          <button className="privacy-button-primary">
            <Shield className="w-4 h-4 mr-2" />
            开始隐私检测
          </button>
          <button className="privacy-button-primary hover:bg-primary-hover">
            立即扫描
          </button>
        </div>

        {/* 次要按钮 */}
        <div className="space-y-4">
          <h4 className="privacy-text-body font-medium">次要按钮</h4>
          <button className="privacy-button-secondary">
            查看详情
          </button>
          <button className="privacy-button-secondary">
            重新检测
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. 状态指示器组件
export function StatusIndicators() {
  return (
    <div className="privacy-card p-6">
      <h3 className="privacy-text-heading text-lg mb-6">状态指示器</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 privacy-status-success" />
          <span className="privacy-text-body">安全 - 未发现隐私泄露</span>
        </div>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 privacy-status-warning" />
          <span className="privacy-text-body">警告 - 发现潜在风险</span>
        </div>
        <div className="flex items-center space-x-3">
          <XCircle className="w-5 h-5 privacy-status-error" />
          <span className="privacy-text-body">危险 - 发现隐私泄露</span>
        </div>
      </div>
    </div>
  )
}

// 4. 进度条组件
export function ProgressBar({ value = 60, label = "扫描进度" }: { value?: number; label?: string }) {
  return (
    <div className="privacy-card p-6">
      <h3 className="privacy-text-heading text-lg mb-6">进度条</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="privacy-text-body">{label}</span>
          <span className="privacy-text-body font-medium">{value}%</span>
        </div>
        <div className="privacy-progress-bar">
          <div 
            className="privacy-progress-fill" 
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

// 5. 卡片布局组件
export function CardLayout({ children, title, icon }: { 
  children: React.ReactNode; 
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="privacy-card p-6 animate-slide-up">
      <div className="flex items-center space-x-3 mb-4">
        {icon}
        <h3 className="privacy-text-heading text-lg">{title}</h3>
      </div>
      <div className="privacy-text-body">
        {children}
      </div>
    </div>
  )
}

// 6. 代码展示组件
export function CodeBlock({ code, language = "javascript" }: { code: string; language?: string }) {
  return (
    <div className="privacy-card p-6">
      <h3 className="privacy-text-heading text-lg mb-4">代码示例</h3>
      <pre className="privacy-text-mono bg-background-tertiary p-4 rounded-md overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  )
}

// 7. 设计系统展示组件
export function DesignSystemShowcase() {
  const usageExample = `
// 使用现代化设计系统
<div className="privacy-card p-6">
  <h3 className="privacy-text-heading">标题</h3>
  <p className="privacy-text-body">正文内容</p>
  <button className="privacy-button-primary">
    主要操作
  </button>
</div>

// 或使用 Tailwind 类
<div className="bg-card rounded-md p-6 shadow-md">
  <h3 className="text-text-primary font-heading">标题</h3>
  <p className="text-text-secondary">正文内容</p>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-sm">
    主要操作
  </button>
</div>
  `.trim()

  return (
    <div className="min-h-screen bg-gradient-primary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="privacy-text-heading text-4xl mb-4">
            Privacy Guardian 设计系统
          </h1>
          <p className="privacy-text-body text-xl max-w-2xl mx-auto">
            现代化的隐私安全检测应用设计系统，采用深蓝渐变背景和专业的用户体验设计
          </p>
        </div>

        <div className="grid gap-8">
          {/* 颜色系统 */}
          <ColorPalette />

          {/* 按钮系统 */}
          <ButtonSystem />

          {/* 状态指示器 */}
          <StatusIndicators />

          {/* 进度条 */}
          <ProgressBar />

          {/* 卡片布局示例 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardLayout title="IP地址检测" icon={<Shield className="w-5 h-5" />}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>客户端IP:</span>
                  <span className="privacy-text-mono">192.168.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span>位置:</span>
                  <span>Los Angeles, United States</span>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <CheckCircle className="w-4 h-4 privacy-status-success" />
                  <span className="text-sm">IP已加密</span>
                </div>
              </div>
            </CardLayout>

            <CardLayout title="WebRTC泄露检测" icon={<AlertTriangle className="w-5 h-5" />}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>公网IP地址:</span>
                  <span className="privacy-text-mono">38.181.81.169</span>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <XCircle className="w-4 h-4 privacy-status-error" />
                  <span className="text-sm">检测到IP泄露</span>
                </div>
              </div>
            </CardLayout>
          </div>

          {/* 代码示例 */}
          <CodeBlock code={usageExample} />
        </div>
      </div>
    </div>
  )
}

export default DesignSystemShowcase