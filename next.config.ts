// next.config.ts
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (
    config: Configuration,
    options: {}
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
    };

    return config;
  },
};

export default nextConfig;