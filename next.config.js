/** @type {import("next").NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.externals.push("bullmq");
    // socket.io
    config.externals.push("bufferutil", "utf-8-validate");
    return config;
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
