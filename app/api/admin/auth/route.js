import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { rateLimit, getIp } from "../../../../lib/rate-limit";

function safeCompare(a, b) {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request) {
  // Rate limit: 5 tentativas por IP a cada 15 minutos
  const ip = getIp(request);
  const { allowed, resetAt } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || !safeCompare(password, process.env.ADMIN_PASSWORD ?? "")) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const maxAge = 60 * 60 * 24; // 24 horas
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    return NextResponse.json({ ok: true }, {
      headers: {
        "Set-Cookie": `admin_token=${process.env.ADMIN_SECRET}; HttpOnly; Path=/; SameSite=Strict${secure}; Max-Age=${maxAge}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return NextResponse.json({ ok: true }, {
    headers: {
      "Set-Cookie": `admin_token=; HttpOnly; Path=/; SameSite=Strict${secure}; Max-Age=0`,
    },
  });
}
