"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.3)",
        color: "rgba(255,255,255,0.85)",
        padding: "7px 18px",
        borderRadius: 9999,
        fontFamily: "inherit",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: loading ? "default" : "pointer",
        transition: "all 0.2s",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "var(--font-inter), 'Helvetica Neue', Arial, sans-serif" }}>
      {!isLogin && (
        <nav style={{
          background: "#1a1d20",
          borderBottom: "1px solid #2d3137",
          padding: "0 5%",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://isf.com.br/ISF_SolucoesEmSeguranca_Logo.png"
              alt="ISF"
              style={{ height: 28, filter: "brightness(0) invert(1)", objectFit: "contain" }}
            />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.05em" }}>
              Painel Admin
            </span>
          </div>
          <LogoutButton />
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}
