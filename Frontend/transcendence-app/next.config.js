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
  },
  env: {
    URL_42: process.env.URL_42,
    STATE_42: process.env.STATE_42,
  }
};
  
module.exports = nextConfig;
  