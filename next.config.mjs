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
      { source: "/index.php/:path*",  destination: "/", permanent: true },
      // Catch-all para feeds RSS do WordPress (qualquer /feed/ em qualquer nível)
      { source: "/:path*/feed",       destination: "/", permanent: true },
      { source: "/:path*/feed/",      destination: "/", permanent: true },
      // Catch-all para páginas AMP do WordPress (incluindo rotas aninhadas)
      { source: "/amp/:path*",        destination: "/", permanent: true },
      { source: "/amp",               destination: "/", permanent: true },
      // Paginação antiga do WordPress (/page/2/, /page/3/, etc.)
      { source: "/page/:path*",       destination: "/", permanent: true },
      // Slugs antigos de produtos aninhados (com e sem trailing slash após /amp)
      { source: "/produtos/:cat/:slug*/amp/", destination: "/", permanent: true },
      { source: "/produtos/:cat/:slug*/amp",  destination: "/", permanent: true },
      { source: "/produtos/:cat/:slug*",      destination: "/produtos", permanent: true },
      // Slug de produto com equivalente no novo site (com e sem barra final)
      { source: "/produtos/controle-acesso",  destination: "/controle-de-acesso-curitiba", permanent: true },
      { source: "/produtos/controle-acesso/", destination: "/controle-de-acesso-curitiba", permanent: true },
      // Slugs antigos sem equivalente — sem barra final
      { source: "/a-empresa",         destination: "/", permanent: true },
      { source: "/servicos",          destination: "/", permanent: true },
      { source: "/contato",           destination: "/", permanent: true },
      // Slugs antigos sem equivalente — com barra final
      { source: "/a-empresa/",        destination: "/", permanent: true },
      { source: "/servicos/",         destination: "/", permanent: true },
      { source: "/contato/",          destination: "/", permanent: true },
      { source: "/produtos/",         destination: "/produtos", permanent: true },
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
