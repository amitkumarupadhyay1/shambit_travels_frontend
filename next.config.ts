import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
        pathname: '/media/**',
      },
    ],
    // Allow localhost images in development
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Disable image optimization for localhost in development
  ...(process.env.NODE_ENV === 'development' && {
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;
