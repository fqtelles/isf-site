import { prisma } from "../../../lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import ProductDetail from "./ProductDetail";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";

export async function generateMetadata({ params }) {
  const { id: slugOrId } = await params;
  const product = await findProduct(slugOrId);
  if (!product) return {};
  const desc = product.description ||
    `${product.name} da ${product.brand}. Adquira com a ISF, revenda autorizada em Curitiba.`;
  const url = `https://isf.com.br/produtos/${product.slug || product.id}/`;
  return {
    title: `${product.name} — ISF Segurança Eletrônica`,
    description: desc,
    alternates: product.slug ? { canonical: url } : undefined,
    openGraph: {
      title: `${product.name} — ISF Segurança Eletrônica`,
      description: desc,
      url,
      siteName: "ISF Segurança Eletrônica",
      locale: "pt_BR",
      type: "website",
      images: product.image
        ? [{ url: product.image, width: 600, height: 600, alt: product.name }]
        : [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ISF Segurança Eletrônica`,
      description: desc,
      images: [product.image || "https://isf.com.br/og-image.jpg"],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id: slugOrId } = await params;

  // Numeric ID → permanent redirect to slug URL (301, keeps SEO juice)
  if (/^\d+$/.test(slugOrId)) {
    const product = await prisma.product.findUnique({ where: { id: parseInt(slugOrId, 10) } });
    if (!product) notFound();
    if (product.slug) permanentRedirect(`/produtos/${product.slug}`);
    // fallback: no slug yet, serve by ID
    return renderProduct(product);
  }

  // Slug lookup
  const product = await prisma.product.findFirst({ where: { slug: slugOrId } });
  if (!product) notFound();
  return renderProduct(product);
}

async function findProduct(slugOrId) {
  if (/^\d+$/.test(slugOrId)) {
    return prisma.product.findUnique({ where: { id: parseInt(slugOrId, 10) } });
  }
  return prisma.product.findFirst({ where: { slug: slugOrId } });
}

async function renderProduct(product) {
  const related = await prisma.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    take: 4,
    orderBy: { id: "asc" },
  });

  const serialized = {
    ...product,
    images: (() => { try { return JSON.parse(product.images); } catch { return []; } })(),
  };

  const relatedSerialized = related.map((p) => ({
    ...p,
    images: (() => { try { return JSON.parse(p.images); } catch { return []; } })(),
  }));

  const productUrl = `https://isf.com.br/produtos/${product.slug || product.id}/`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} — ${product.brand}`,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    manufacturer: {
      "@type": "Organization",
      name: product.brand,
    },
    category: product.category,
    image: product.image,
    url: productUrl,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "BRL",
      price: "0",
      seller: {
        "@type": "Organization",
        name: "ISF Segurança Eletrônica",
        url: "https://isf.com.br",
      },
    },
  };

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://isf.com.br" },
        { name: "Produtos", url: "https://isf.com.br/produtos" },
        { name: product.name },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetail product={serialized} related={relatedSerialized} />
    </>
  );
}
