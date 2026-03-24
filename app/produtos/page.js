import { prisma } from "../../lib/prisma";
import ProductsGallery from "./ProductsGallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo de Produtos | ISF Segurança Eletrônica",
  description:
    "Catálogo completo de produtos de segurança eletrônica: câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. Revenda autorizada Intelbras em Curitiba.",
};

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return <ProductsGallery products={products} />;
}
