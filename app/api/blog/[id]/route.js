import { NextResponse } from "next/server";
import { findUniqueBlogPost } from "../../../../lib/blog-posts";

export async function GET(request, { params }) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const post = await findUniqueBlogPost({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
  }

  return NextResponse.json(post);
}
