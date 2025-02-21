/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  async redirects() {
    return [
      {
        source: '/bitcoin-reward',
        destination: '/ai-product-analysis',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;