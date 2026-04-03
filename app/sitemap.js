import { prisma } from "../lib/prisma";

export const revalidate = 86400; // 24 horas

export default async function sitemap() {
  const [posts, products] = await Promise.all([
    prisma.blogPost.findMany({
      select: { id: true, slug: true, createdAt: true },
      orderBy: { id: "asc" },
    }),
    prisma.product.findMany({
      select: { id: true, slug: true, createdAt: true },
      orderBy: { id: "asc" },
    }),
  ]);

  const now = new Date();

  // Data do último post/produto para páginas de listagem
  const latestPostDate = posts.length > 0
    ? posts.reduce((max, p) => (p.createdAt > max ? p.createdAt : max), posts[0].createdAt)
    : now;
  const latestProductDate = products.length > 0
    ? products.reduce((max, p) => (p.createdAt > max ? p.createdAt : max), products[0].createdAt)
    : now;

  const staticPages = [
    {
      url: "https://isf.com.br",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://isf.com.br/alarmes-curitiba/",
      lastModified: new Date("2026-03-24"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/cameras-seguranca-curitiba/",
      lastModified: new Date("2026-03-24"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/cerca-eletrica-curitiba/",
      lastModified: new Date("2026-03-24"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/controle-de-acesso-curitiba/",
      lastModified: new Date("2026-03-24"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/monitoramento-curitiba/",
      lastModified: new Date("2026-03-24"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/video-monitoramento-curitiba/",
      lastModified: new Date("2026-03-30"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/app-de-seguranca/",
      lastModified: new Date("2026-03-24"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://isf.com.br/produtos/",
      lastModified: latestProductDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://isf.com.br/blog/",
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogPages = posts.map((post) => ({
    url: `https://isf.com.br/blog/${post.slug || post.id}/`,
    lastModified: post.createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productPages = products.map((product) => ({
    url: `https://isf.com.br/produtos/${product.slug || product.id}/`,
    lastModified: product.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...productPages];
}
