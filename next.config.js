/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove distDir setting temporarily
    experimental: {
      serverActions: true
    }
  };
  
  module.exports = nextConfig;