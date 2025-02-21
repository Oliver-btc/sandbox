/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  // Comment out the redirects for now
  // async redirects() {
  //   return [
  //     {
  //       source: '/ai-reward',
  //       destination: '/ai-product-analysis',
  //       permanent: false,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;