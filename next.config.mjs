/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "isf.com.br",
      },
      {
        protocol: "https",
        hostname: "www.isf.com.br",
      },
      {
        protocol: "https",
        hostname: "**.intelbras.com.br",
      },
      {
        protocol: "https",
        hostname: "**.intelbras.com",
      },
    ],
  },
  async rewrites() {
    return {
      // Only applied if no static file matched in public/uploads/
      afterFiles: [
        { source: "/uploads/:path*", destination: "/api/uploads/:path*" },
      ],
    };
  },
};
export default nextConfig;
