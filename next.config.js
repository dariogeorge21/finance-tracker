/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // remove output: "export"

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
