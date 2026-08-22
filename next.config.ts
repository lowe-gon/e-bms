import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
