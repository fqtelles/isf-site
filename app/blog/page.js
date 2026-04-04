import { prisma } from "../../lib/prisma";
import BlogGallery from "./BlogGallery";

export const revalidate = 3600; // ISR: revalida a cada 1 hora (ou quando o admin salvar um post)

export const metadata = {
  title: "Blog de Segurança Eletrônica | Dicas e Artigos — ISF",
  description:
    "Artigos sobre câmeras, alarmes, cerca elétrica e controle de acesso da equipe ISF. Dicas para proteger residências e empresas em Curitiba.",
  alternates: { canonical: "https://isf.com.br/blog/" },
  openGraph: {
    title: "Blog de Segurança Eletrônica | Dicas e Artigos — ISF",
    description:
      "Artigos sobre câmeras, alarmes, cerca elétrica e controle de acesso da equipe ISF. Dicas para proteger residências e empresas em Curitiba.",
    url: "https://isf.com.br/blog/",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Blog — ISF Segurança Eletrônica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de Segurança Eletrônica | Dicas e Artigos — ISF",
    description:
      "Artigos sobre câmeras, alarmes, cerca elétrica e controle de acesso da equipe ISF. Dicas em Curitiba.",
    images: ["https://isf.com.br/og-image.jpg"],
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { id: "desc" } });
  return <BlogGallery posts={posts} />;
}
