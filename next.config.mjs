import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolve: {
      symlinks: false,
    },
  },
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
export default withBundleAnalyzer(nextConfig);
