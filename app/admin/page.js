import { prisma } from "../../lib/prisma";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const [products, blogPosts] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "asc" } }),
    prisma.blogPost.findMany({ orderBy: { id: "desc" } }),
  ]);

  return (
    <AdminDashboard
      initialProducts={products}
      initialBlogPosts={blogPosts}
    />
  );
}
