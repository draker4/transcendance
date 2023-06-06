/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: true,
  },
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
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    CRYPTO_KEY: process.env.CRYPTO_KEY,
    WEBSITE_KEY: process.env.WEBSITE_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
  }
};
  
module.exports = nextConfig;
  