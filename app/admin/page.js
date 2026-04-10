import { prisma } from "../../lib/prisma";
import { findManyBlogPosts } from "../../lib/blog-posts";
import { requireAdmin } from "../../lib/auth";
import AdminDashboard from "./AdminDashboard";
import LoginForm from "./login/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await requireAdmin())) {
    return <LoginForm />;
  }

  const [products, blogPosts] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "asc" } }),
    findManyBlogPosts({ orderBy: { id: "desc" } }),
  ]);

  return (
    <AdminDashboard
      initialProducts={products}
      initialBlogPosts={blogPosts}
    />
  );
}
