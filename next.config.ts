// next.config.ts
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [85, 90, 100],
  },
  // Fix for react-pdf / pdfjs-dist ESBuild issues
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' unpkg.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https: http://localhost:8000 ws://localhost:8000 https://localhost wss://localhost unpkg.com",
              "worker-src 'self' blob: unpkg.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
  webpack: (
    config: Configuration,
    options: { dev: boolean }
  ) => {
    // Ensure config.resolve object exists
    config.resolve = config.resolve || {};

    // Condensed logic for setting the alias
    config.resolve.alias = {
      // Spread existing aliases if they are in object form (and not an array)
      ...((typeof config.resolve.alias === 'object' && !Array.isArray(config.resolve.alias))
        ? config.resolve.alias
        : {}),
      // Add your new alias
      '@': path.resolve(__dirname, 'src'),
      // Fix for react-pdf/pdfjs-dist
      canvas: false,
    };

    // Fix for pdfjs-dist "Object.defineProperty called on non-object"
    // This often happens with "eval-source-map" (Next.js default in dev)
    if (options.dev) {
      config.devtool = 'source-map';
    }

    return config;
  },
};

export default nextConfig;