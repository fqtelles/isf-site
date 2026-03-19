/**
 * Migration script — populates `slug` for all existing Products and BlogPosts.
 * Run once after adding the slug column:
 *   docker exec isf-site node prisma/add-slugs.js
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Find a unique slug, appending -2, -3, ... as needed.
 * `lookupFn` should return null when the slug is free.
 */
async function makeUnique(base, lookupFn) {
  let slug = base.slice(0, 80).replace(/-+$/, ""); // cap length
  let i = 2;
  while (await lookupFn(slug)) {
    slug = `${base.slice(0, 75)}-${i++}`;
  }
  return slug;
}

async function main() {
  console.log("Gerando slugs...\n");

  // ── Products ────────────────────────────────────
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  let prodCount = 0;

  for (const p of products) {
    if (p.slug) {
      console.log(`  [skip] produto #${p.id} já tem slug: ${p.slug}`);
      continue;
    }
    const base = slugify(p.name);
    const slug = await makeUnique(base, async (s) => {
      const found = await prisma.product.findFirst({ where: { slug: s } });
      return found && found.id !== p.id;
    });
    await prisma.product.update({ where: { id: p.id }, data: { slug } });
    console.log(`  produto #${p.id}: "${p.name}" → /produtos/${slug}`);
    prodCount++;
  }

  console.log(`\n✓ ${prodCount} slugs de produtos gerados\n`);

  // ── Blog Posts ───────────────────────────────────
  const posts = await prisma.blogPost.findMany({ orderBy: { id: "asc" } });
  let postCount = 0;

  for (const post of posts) {
    if (post.slug) {
      console.log(`  [skip] post #${post.id} já tem slug: ${post.slug}`);
      continue;
    }
    const base = slugify(post.title);
    const slug = await makeUnique(base, async (s) => {
      const found = await prisma.blogPost.findFirst({ where: { slug: s } });
      return found && found.id !== post.id;
    });
    await prisma.blogPost.update({ where: { id: post.id }, data: { slug } });
    console.log(`  post #${post.id}: "${post.title.slice(0, 50)}" → /blog/${slug}`);
    postCount++;
  }

  console.log(`\n✓ ${postCount} slugs de posts gerados`);
  console.log("\nMigração concluída!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
