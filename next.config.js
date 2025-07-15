/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  // Disable problematic DevTools features
  devIndicators: {
    appIsrStatus: false,
    position: 'bottom-left',
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      // Enhanced DevTools error handling
      config.infrastructureLogging = {
        level: 'error',
      }
      // Disable DevTools overlay
      config.devtool = false
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig