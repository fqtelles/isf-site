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
  async redirects() {
    return [
      // Catch-all para URLs WordPress com /index.php/
      { source: "/index.php/:path*", destination: "/", permanent: true },
      // Catch-all para páginas AMP do WordPress
      { source: "/amp/:path*",       destination: "/", permanent: true },
      { source: "/amp",              destination: "/", permanent: true },
      // Slugs antigos de produtos — redirecionar para página de serviço equivalente
      { source: "/produtos/controle-acesso", destination: "/controle-de-acesso-curitiba", permanent: true },
      // Slugs antigos sem equivalente no novo site
      { source: "/a-empresa",        destination: "/", permanent: true },
      { source: "/servicos",         destination: "/", permanent: true },
      { source: "/contato",          destination: "/", permanent: true },
    ];
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
