/** @type {import("next").NextConfig} */
const nextConfig: import('next').NextConfig = {
  output: 'standalone',
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'panel.flittigub.no',
      },
      {
        hostname: 'via.placeholder.com'},
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
};

export default nextConfig;
