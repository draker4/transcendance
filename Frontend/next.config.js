/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  distDir: "build",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:4000/api/:path*",
      },
    ];
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
    HOST_IP: process.env.HOST_IP,
  },
  images: {
    domains: ["cdn.intra.42.fr", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
