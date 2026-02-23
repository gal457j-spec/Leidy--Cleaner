/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Turbopack (Next.js 16+)
  turbopack: {},

  // Image optimization
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Proxy API calls to backend during development
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/v1/:path*',
          destination: 'http://localhost:3001/api/v1/:path*',
        },
      ],
    };
  },

  // Disable static optimization for pages with dynamic search params
  experimental: {
    // Encourage dynamic optimization
  },
};

export default nextConfig;