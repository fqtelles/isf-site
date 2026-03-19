import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth";
import { slugify, uniqueSlug } from "../../../../../lib/slugify";

export async function PUT(request, { params }) {
  if (!requireAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await request.json();
    const { name, brand, category, image, images, description, video, slug: rawSlug } = body;

    // Resolve slug: if provided, slugify & ensure unique (excluding self); if not, keep existing
    let slugData = {};
    if (rawSlug !== undefined) {
      const base = slugify(rawSlug);
      const slug = await uniqueSlug(base, async (s) => {
        const found = await prisma.product.findFirst({ where: { slug: s } });
        return !!(found && found.id !== id);
      });
      slugData = { slug };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name        !== undefined && { name }),
        ...(brand       !== undefined && { brand }),
        ...(category    !== undefined && { category }),
        ...(image       !== undefined && { image }),
        ...(images      !== undefined && { images: JSON.stringify(Array.isArray(images) ? images : []) }),
        ...(description !== undefined && { description }),
        ...(video       !== undefined && { video }),
        ...slugData,
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  if (!requireAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
}
