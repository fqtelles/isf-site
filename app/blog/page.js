import { prisma } from "../../lib/prisma";
import BlogGallery from "./BlogGallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Dicas de Segurança Eletrônica | ISF Segurança Eletrônica",
  description:
    "Artigos e dicas sobre câmeras de segurança, alarmes, cerca elétrica e controle de acesso. Conteúdo especializado da ISF — 35 anos protegendo Curitiba.",
  alternates: { canonical: "https://isf.com.br/blog" },
  openGraph: {
    title: "Blog | ISF Segurança Eletrônica",
    description: "Dicas e artigos sobre segurança eletrônica, câmeras, alarmes e monitoramento em Curitiba.",
    url: "https://isf.com.br/blog",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Blog — ISF Segurança Eletrônica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | ISF Segurança Eletrônica",
    description: "Dicas e artigos sobre segurança eletrônica em Curitiba.",
    images: ["https://isf.com.br/og-image.jpg"],
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { id: "desc" } });
  return <BlogGallery posts={posts} />;
}
