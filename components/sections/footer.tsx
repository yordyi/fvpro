'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Github, 
  Twitter, 
  Mail, 
  Heart, 
  Globe, 
  Lock, 
  Code, 
  Users,
  ArrowRight,
  ExternalLink 
} from 'lucide-react'
import Link from 'next/link'

// 链接数据
const footerLinks = {
  product: [
    { name: '隐私检测', href: '/' },
    { name: '检测历史', href: '/history' },
    { name: '安全评分', href: '/score' },
    { name: '隐私教育', href: '/education' }
  ],
  resources: [
    { name: '用户指南', href: '/guide' },
    { name: '隐私政策', href: '/privacy' },
    { name: '服务条款', href: '/terms' },
    { name: '常见问题', href: '/faq' }
  ],
  developers: [
    { name: '开发文档', href: '/docs' },
    { name: 'API接口', href: '/api' },
    { name: '设计系统', href: '/design-system' },
    { name: '贡献指南', href: '/contributing' }
  ]
}

// 社交链接
const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/privacy-guardian' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/privacy_guardian' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@privacy-guardian.com' }
]

// 特性标签
const features = [
  { icon: Lock, text: '100% 开源' },
  { icon: Globe, text: '本地检测' },
  { icon: Users, text: '隐私优先' },
  { icon: Code, text: '透明安全' }
]

// 链接组件
function FooterLink({ href, children, external = false }: { 
  href: string; 
  children: React.ReactNode; 
  external?: boolean 
}) {
  const linkClass = "privacy-text-body text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all duration-300 flex items-center gap-1"
  
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
        <ExternalLink className="w-3 h-3" />
      </a>
    )
  }
  
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  )
}

// 社交图标组件
function SocialIcon({ social }: { social: typeof socialLinks[0] }) {
  const Icon = social.icon
  
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-background-secondary border border-border-primary rounded-xl hover:bg-background-tertiary hover:border-primary/50 transition-all duration-300 group"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
    </motion.a>
  )
}

// 特性徽章组件
function FeatureBadge({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/20 rounded-lg">
      <Icon className="w-4 h-4 text-success" />
      <span className="privacy-text-body text-sm text-success font-medium">{feature.text}</span>
    </div>
  )
}

// 主要底部组件
export function Footer() {
  return (
    <footer className="relative bg-gradient-to-t from-background-secondary to-background border-t border-border-primary">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%236366f1\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }} />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* 品牌信息 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Logo和标题 */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="privacy-text-heading text-2xl font-bold">Privacy Guardian</h3>
                  <p className="privacy-text-body text-sm opacity-60">保护您的数字隐私</p>
                </div>
              </div>

              {/* 描述 */}
              <p className="privacy-text-body text-lg opacity-80 leading-relaxed max-w-lg">
                专业的浏览器隐私检测工具，帮助您发现和修复潜在的隐私泄露风险，保护您的数字身份安全。
              </p>

              {/* 特性徽章 */}
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <FeatureBadge feature={feature} />
                  </motion.div>
                ))}
              </div>

              {/* 社交链接 */}
              <div className="flex items-center gap-4 pt-4">
                <span className="privacy-text-body text-sm opacity-60">关注我们:</span>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <SocialIcon key={social.name} social={social} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* 链接组 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* 产品链接 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="privacy-text-heading text-lg font-semibold mb-4">产品</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 资源链接 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="privacy-text-heading text-lg font-semibold mb-4">资源</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* 开发者区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="privacy-card p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="privacy-text-heading text-lg font-semibold">开发者资源</h4>
                <p className="privacy-text-body text-sm opacity-80">API文档、SDK和开发工具</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {footerLinks.developers.map((link) => (
                <FooterLink key={link.name} href={link.href}>
                  <span className="flex items-center gap-1">
                    {link.name}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </FooterLink>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 底部版权信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-8 border-t border-border-primary"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 privacy-text-body text-sm opacity-60">
              <span>© 2024 Privacy Guardian. 保留所有权利.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-destructive" /> for privacy
              </span>
            </div>
            <div className="flex items-center gap-6 privacy-text-body text-sm opacity-60">
              <Link href="/privacy" className="hover:opacity-100 hover:text-primary transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:opacity-100 hover:text-primary transition-colors">
                服务条款
              </Link>
              <Link href="/security" className="hover:opacity-100 hover:text-primary transition-colors">
                安全说明
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}