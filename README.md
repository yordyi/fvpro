# Privacy Guardian

一个现代化的浏览器隐私检测工具，使用 Next.js 14 构建，帮助用户检测浏览器隐私和安全状况。

## 功能特性

- 🌐 **IP地址检测** - 检测真实IP地址是否暴露，包括VPN检测
- 🔒 **WebRTC泄露检测** - 检测WebRTC是否泄露本地和公网IP
- 🔍 **浏览器指纹分析** - 分析Canvas、WebGL、音频等指纹唯一性
- 🛡️ **浏览器配置检查** - 检查隐私相关的浏览器设置
- 📊 **安全评分系统** - 综合评估隐私保护等级

## 技术栈

- **Next.js 14** - React全栈框架（App Router）
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化CSS框架
- **Framer Motion** - 动画库
- **Zustand** - 状态管理
- **Lucide React** - 图标库

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
privacy-guardian/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── ui/               # 通用UI组件
│   ├── detectors/        # 检测器组件
│   └── results/          # 结果展示组件
├── lib/                   # 核心库
│   ├── detectors/        # 检测逻辑
│   ├── types/            # TypeScript类型
│   └── utils/            # 工具函数
└── stores/               # Zustand状态管理
```

## 检测原理

### IP检测
- 通过多个IP检测源获取客户端IP
- 比较不同源的IP一致性
- 使用IP定位服务获取地理位置

### WebRTC检测
- 创建RTCPeerConnection连接
- 通过ICE候选者获取本地和公网IP
- 检测是否存在IP泄露

### 浏览器指纹
- Canvas指纹：绘制特定图形生成唯一标识
- WebGL指纹：获取GPU和渲染器信息
- 音频指纹：分析音频处理特征
- 字体检测：检测系统安装的字体

### 安全评分
- IP隐私保护（25%权重）
- WebRTC防护（30%权重）
- 指纹抗性（25%权重）
- 浏览器加固（20%权重）

## 开发指南

### 添加新的检测器

1. 在 `lib/detectors/` 创建检测逻辑
2. 在 `components/detectors/` 创建UI组件
3. 更新状态管理和评分系统

### 自定义样式

项目使用 Tailwind CSS，可以在 `tailwind.config.ts` 中自定义主题。

## 部署

推荐使用 [Vercel](https://vercel.com) 部署：

```bash
npx vercel --prod
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT