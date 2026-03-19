import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const maxAge = 60 * 60 * 24; // 24 horas
    return NextResponse.json({ ok: true }, {
      headers: {
        "Set-Cookie": `admin_token=${process.env.ADMIN_SECRET}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json({ ok: true }, {
    headers: {
      "Set-Cookie": "admin_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0",
    },
  });
}
