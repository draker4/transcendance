/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    distDir: 'build',
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://backend:4000/api/:path*',
        },
      ]
    }
  }
  
module.exports = nextConfig
  