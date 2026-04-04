import { cookies } from "next/headers";
import { prisma } from "../../lib/prisma";
import AdminDashboard from "./AdminDashboard";
import LoginForm from "./login/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_SECRET) {
    return <LoginForm />;
  }

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
