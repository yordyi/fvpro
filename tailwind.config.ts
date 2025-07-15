import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 现代化设计系统 - 颜色
      colors: {
        // 主背景色
        background: {
          DEFAULT: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        foreground: "var(--text-primary)",
        
        // 强调色系统
        primary: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          foreground: "var(--text-primary)",
        },
        secondary: {
          DEFAULT: "var(--accent-secondary)",
          foreground: "var(--text-primary)",
        },
        
        // 语义颜色
        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)",
          foreground: "var(--text-primary)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          light: "var(--warning-light)",
          foreground: "var(--text-primary)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          light: "var(--error-light)",
          foreground: "var(--text-primary)",
        },
        
        // 文本颜色
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
        },
        
        // 边框颜色
        border: {
          DEFAULT: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          muted: "var(--border-muted)",
        },
        
        // 卡片颜色
        card: {
          DEFAULT: "rgba(30, 41, 59, 0.8)",
          foreground: "var(--text-primary)",
        },
        
        // 表单元素
        input: "var(--border-primary)",
        ring: "var(--accent-primary)",
        
        // 互动状态
        muted: {
          DEFAULT: "var(--bg-tertiary)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent-primary)",
          foreground: "var(--text-primary)",
        },
      },
      
      // 字体系统
      fontFamily: {
        heading: ["var(--font-family-heading)"],
        body: ["var(--font-family-body)"],
        mono: ["var(--font-family-mono)"],
        sans: ["var(--font-family-body)"],
      },
      
      // 字体权重
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      // 间距系统
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
      },
      
      // 圆角系统
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      
      // 阴影系统
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        inset: "var(--shadow-inset)",
      },
      
      // 过渡动画
      transitionDuration: {
        fast: "var(--transition-fast)",
        normal: "var(--transition-normal)",
        slow: "var(--transition-slow)",
      },
      
      // 背景渐变
      backgroundImage: {
        'gradient-primary': "var(--bg-gradient)",
        'gradient-accent': "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
      },
      
      // 动画
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      
      // 关键帧
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            'box-shadow': '0 0 0 0 rgba(99, 102, 241, 0.7)'
          },
          '50%': { 
            'box-shadow': '0 0 0 10px rgba(99, 102, 241, 0)'
          },
        },
        'slide-up': {
          '0%': { 
            'opacity': '0',
            'transform': 'translateY(20px)'
          },
          '100%': { 
            'opacity': '1',
            'transform': 'translateY(0)'
          },
        },
        'fade-in': {
          '0%': { 'opacity': '0' },
          '100%': { 'opacity': '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;