import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth";
import { slugify, uniqueSlug } from "../../../../../lib/slugify";

export async function PUT(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await request.json();
    const { date, title, excerpt, readTime, content, coverImage, slug: rawSlug, publishedAt } = body;

    let slugData = {};
    if (rawSlug !== undefined) {
      const base = slugify(rawSlug).slice(0, 70).replace(/-+$/, "");
      const slug = await uniqueSlug(base, async (s) => {
        const found = await prisma.blogPost.findFirst({ where: { slug: s } });
        return !!(found && found.id !== id);
      });
      slugData = { slug };
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(date    !== undefined && { date }),
        ...(title   !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(readTime !== undefined && { readTime }),
        ...(content    !== undefined && { content }),
        ...(coverImage  !== undefined && { coverImage }),
        ...(publishedAt !== undefined && publishedAt !== "" && { publishedAt: new Date(publishedAt) }),
        ...slugData,
      },
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
  }
}
