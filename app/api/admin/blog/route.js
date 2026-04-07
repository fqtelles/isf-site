import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { slugify, uniqueSlug } from "../../../../lib/slugify";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const posts = await prisma.blogPost.findMany({ orderBy: [{ publishedAt: "desc" }, { id: "desc" }] });
  return NextResponse.json(posts);
}

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const { date, title, excerpt, readTime, content, coverImage, slug: rawSlug, publishedAt } = body;

    if (!date || !title || !excerpt || !readTime) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const base = rawSlug ? slugify(rawSlug) : slugify(title).slice(0, 70).replace(/-+$/, "");
    const slug = await uniqueSlug(base, async (s) => !!(await prisma.blogPost.findFirst({ where: { slug: s } })));

    const post = await prisma.blogPost.create({
      data: {
        date, title, excerpt, readTime,
        content: content ?? "",
        coverImage: coverImage ?? "",
        slug,
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    });
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar artigo" }, { status: 500 });
  }
}
