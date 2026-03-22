import { requireAdmin } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  if (!requireAdmin()) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  const blogPosts = await prisma.blogPost.findMany({ orderBy: { id: "asc" } });

  const productsCode = products
    .map((p) => {
      const images = (() => {
        try { return JSON.parse(p.images || "[]"); } catch { return []; }
      })();
      return `  {
    name: ${JSON.stringify(p.name)},
    brand: ${JSON.stringify(p.brand)},
    category: ${JSON.stringify(p.category)},
    image: ${JSON.stringify(p.image)},
    images: ${JSON.stringify(images)},
    description: ${JSON.stringify(p.description || "")},
    video: ${JSON.stringify(p.video || "")},
    slug: ${JSON.stringify(p.slug || "")},
  }`;
    })
    .join(",\n");

  const blogPostsCode = blogPosts
    .map((b) => {
      return `  {
    date: ${JSON.stringify(b.date)},
    title: ${JSON.stringify(b.title)},
    excerpt: ${JSON.stringify(b.excerpt)},
    readTime: ${JSON.stringify(b.readTime)},
    content: ${JSON.stringify(b.content || "")},
    coverImage: ${JSON.stringify(b.coverImage || "")},
    slug: ${JSON.stringify(b.slug || "")},
  }`;
    })
    .join(",\n");

  const now = new Date().toISOString();

  const seedContent = `// seed.js gerado automaticamente em ${now}
// Para usar: node prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const products = [
${productsCode},
];

const blogPosts = [
${blogPostsCode},
];

async function main() {
  console.log("Iniciando seed...");

  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
  console.log(\`✓ \${products.length} produtos inseridos\`);

  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({ data: blogPosts });
  console.log(\`✓ \${blogPosts.length} artigos inseridos\`);

  console.log("Seed concluído!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
`;

  return new Response(seedContent, {
    status: 200,
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Content-Disposition": `attachment; filename="seed-${now.slice(0, 10)}.js"`,
    },
  });
}
