import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { slugify, uniqueSlug } from "../../../../lib/slugify";

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(products);
}

export async function POST(request) {
  if (!requireAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, brand, category, image, images, description, video, slug: rawSlug } = body;

    if (!name || !brand || !category || !image) {
      return NextResponse.json({ error: "Nome, marca, categoria e imagem são obrigatórios" }, { status: 400 });
    }

    const base = rawSlug ? slugify(rawSlug) : slugify(name);
    const slug = await uniqueSlug(base, async (s) => !!(await prisma.product.findFirst({ where: { slug: s } })));

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        category,
        image,
        images: JSON.stringify(Array.isArray(images) ? images : []),
        description: description || "",
        video: video || "",
        slug,
      },
    });
    revalidatePath("/");
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
