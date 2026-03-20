import { prisma } from "../../lib/prisma";
import BlogGallery from "./BlogGallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Dicas de Segurança Eletrônica | ISF Segurança Eletrônica",
  description:
    "Artigos e dicas sobre câmeras de segurança, alarmes, cerca elétrica e controle de acesso. Conteúdo especializado da ISF — 35 anos protegendo Curitiba.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { id: "desc" } });
  return <BlogGallery posts={posts} />;
}
