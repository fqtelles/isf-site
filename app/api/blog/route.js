import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: 200,
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json({ error: "Erro ao buscar artigos" }, { status: 500 });
  }
}
