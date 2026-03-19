/** @type {import('next').NextConfig} */
const nextConfig = {
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
