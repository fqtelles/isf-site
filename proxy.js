import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_token";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-src 'self' https://www.youtube.com",
  "upgrade-insecure-requests",
].join("; ");

function withSecurityHeaders(response) {
  response.headers.set("Content-Security-Policy-Report-Only", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

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
    return withSecurityHeaders(NextResponse.redirect(url, { status: 301 }));
  }

  // Autenticação do painel admin
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      return withSecurityHeaders(NextResponse.next());
    }
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) {
      return withSecurityHeaders(NextResponse.redirect(new URL("/admin/login", request.url)));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
