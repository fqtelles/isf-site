import { prisma } from "../../lib/prisma";
import ProductsGallery from "./ProductsGallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo de Produtos | ISF Segurança Eletrônica",
  description:
    "Catálogo completo de produtos de segurança eletrônica: câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. Revenda autorizada Intelbras em Curitiba.",
  alternates: { canonical: "https://isf.com.br/produtos" },
  openGraph: {
    title: "Catálogo de Produtos | ISF Segurança Eletrônica",
    description: "Câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. Revenda autorizada Intelbras em Curitiba.",
    url: "https://isf.com.br/produtos",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Catálogo de Produtos — ISF Segurança Eletrônica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo de Produtos | ISF Segurança Eletrônica",
    description: "Produtos de segurança eletrônica — revenda autorizada Intelbras em Curitiba.",
    images: ["https://isf.com.br/og-image.jpg"],
  },
};

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return <ProductsGallery products={products} />;
}
