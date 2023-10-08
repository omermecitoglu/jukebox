/** @type {import("next").NextConfig} */

const nextConfig = {
  webpack: (config) => {
    // socket.io
    config.externals.push("bufferutil", "utf-8-validate");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
