/** @type {import('next').NextConfig} */
const withLess = require("next-with-less")
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.qlogo.cn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.myqcloud.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = withLess(nextConfig)
