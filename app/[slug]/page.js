import { notFound, permanentRedirect } from "next/navigation";
import { findFirstBlogPost } from "../../lib/blog-posts";

export default async function RootSlugPage({ params }) {
  const { slug } = await params;
  const post = await findFirstBlogPost({ where: { slug }, select: { id: true, slug: true } });
  if (post?.slug) permanentRedirect(`/blog/${post.slug}/`);
  notFound();
}
