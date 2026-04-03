import { NextResponse } from "next/server";

export function proxy(request) {
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";

  // Redireciona www e http para https://isf.com.br (301 permanente)
  // Só aplica quando o host é o domínio real (não localhost/dev)
  const isRealDomain = host.includes("isf.com.br");
  if (isRealDomain && (host.startsWith("www.") || proto === "http")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "isf.com.br";
    return NextResponse.redirect(url, { status: 301 });
  }

  // Autenticação do painel admin
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const token = request.cookies.get("admin_token")?.value;
    if (!token || token !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
