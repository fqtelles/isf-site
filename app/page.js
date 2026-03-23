import { prisma } from "../lib/prisma";
import HomeClient from "./HomeClient";

export const revalidate = 3600; // ISR: revalida a cada 1 hora

export default async function HomePage() {
  const [products, blogPosts] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "asc" } }),
    prisma.blogPost.findMany({ orderBy: { id: "asc" } }),
  ]);

  return <HomeClient initialProducts={products} initialBlogPosts={blogPosts} />;
}
