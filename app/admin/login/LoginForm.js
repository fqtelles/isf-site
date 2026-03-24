"use client";
import { useState } from "react";
import Image from "next/image";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok) {
        window.location.replace("/admin");
      } else {
        setError(data.error || "Senha incorreta");
        setLoading(false);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
      padding: "24px",
      fontFamily: "var(--font-inter), 'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Image
            src="https://isf.com.br/ISF_SolucoesEmSeguranca_Logo.png"
            alt="ISF Segurança"
            width={140}
            height={40}
            style={{ height: 40, width: "auto", objectFit: "contain" }}
          />
          <p style={{ color: "#6b7280", fontSize: "0.82rem", marginTop: 10 }}>Acesso restrito — somente administradores</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#32373c", marginBottom: 6, letterSpacing: "0.05em" }}>
              SENHA
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a senha de acesso"
              required
              autoFocus
              style={{
                width: "100%",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "12px 14px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                color: "#32373c",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#dc2626",
              fontSize: "0.83rem",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#9ca3af" : "#126798",
              color: "#fff",
              border: "none",
              borderRadius: 9999,
              padding: "13px",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              transition: "background 0.2s",
              marginTop: 4,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
