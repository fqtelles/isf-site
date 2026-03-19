import { prisma } from "../lib/prisma";

export default async function sitemap() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, createdAt: true },
    orderBy: { id: "asc" },
  });

  const staticPages = [
    {
      url: "https://isf.com.br",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://isf.com.br/alarmes-curitiba",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/cameras-seguranca-curitiba",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/cerca-eletrica-curitiba",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://isf.com.br/monitoramento-curitiba",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const blogPages = posts.map((post) => ({
    url: `https://isf.com.br/blog/${post.id}`,
    lastModified: post.createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
