/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['firebasestorage.googleapis.com', 'placehold.co'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable experimental features that might cause issues
  experimental: {
    // optimizeCss: true, // Commenting this out to fix critters issue
  },
  webpack: (config, { isServer }) => {
    // Enable tree shaking for moment.js
    config.resolve.alias = {
      ...config.resolve.alias,
      moment$: 'moment/moment.js',
    };
    
    // Add bundle analyzer in analyze mode
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig; 