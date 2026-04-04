import { prisma } from "../../lib/prisma";
import ProductsGallery from "./ProductsGallery";

export const revalidate = 3600; // ISR: revalida a cada 1 hora (ou quando o admin salvar um produto)

export const metadata = {
  title: "Catálogo de Produtos de Segurança Eletrônica | ISF Curitiba",
  description:
    "Câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. 300+ produtos. Revenda Intelbras. Instalação em Curitiba. Consulte disponibilidade.",
  alternates: { canonical: "https://isf.com.br/produtos/" },
  openGraph: {
    title: "Catálogo de Produtos de Segurança Eletrônica | ISF Curitiba",
    description:
      "Câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. 300+ produtos. Revenda Intelbras. Instalação em Curitiba. Consulte disponibilidade.",
    url: "https://isf.com.br/produtos/",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Catálogo de Produtos — ISF Segurança Eletrônica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo de Produtos de Segurança Eletrônica | ISF Curitiba",
    description:
      "Câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. Revenda Intelbras em Curitiba.",
    images: ["https://isf.com.br/og-image.jpg"],
  },
};

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return <ProductsGallery products={products} />;
}
