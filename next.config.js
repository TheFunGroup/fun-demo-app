/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@web3auth/web3auth-wagmi-connector'],
}

module.exports = nextConfig
