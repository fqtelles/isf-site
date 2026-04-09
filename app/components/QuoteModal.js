"use client";
import { useState } from "react";

/**
 * QuoteModal — botão que abre um modal com formulário de orçamento.
 *
 * Props:
 *  - label        : texto do botão  (default: "Solicitar Orçamento")
 *  - context      : campo `pagina` enviado à API (default: "Site")
 *  - buttonStyle  : estilos inline extras para o botão
 *  - buttonClass  : className extra para o botão
 */
export default function QuoteModal({
  label = "Solicitar Orçamento",
  context = "Site",
  buttonStyle = {},
  buttonClass = "",
  hideTrigger = false,
  startOpen = false,
  onAfterClose,
}) {
  const [open, setOpen] = useState(startOpen);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", mensagem: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pagina: context }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao enviar");
      }
      setSent(true);
    } catch (err) {
      setError(err.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    setOpen(false);
    // reset após fechar para reutilização
    setTimeout(() => {
      setSent(false);
      setError("");
      setForm({ nome: "", telefone: "", email: "", mensagem: "" });
      onAfterClose?.();
    }, 300);
  }

  return (
    <>
      {!hideTrigger && (
        <button
          onClick={() => setOpen(true)}
          className={buttonClass}
          style={{
            display: "inline-block",
            background: "#126798",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 9999,
            fontWeight: 600,
            fontSize: "0.88rem",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            ...buttonStyle,
          }}
        >
          {label}
        </button>
      )}

      {open && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ background: "#126798", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Solicitar Orçamento Gratuito</p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", margin: "4px 0 0" }}>ISF Segurança Eletrônica</p>
              </div>
              <button
                onClick={handleClose}
                style={{ background: "none", border: "none", color: "#fff", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1, padding: "4px 8px", opacity: 0.8 }}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✅</div>
                  <p style={{ fontWeight: 700, color: "#1a1d20", fontSize: "1.05rem", marginBottom: 8 }}>Mensagem enviada!</p>
                  <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 24 }}>Nossa equipe entrará em contato em breve.</p>
                  <button
                    onClick={handleClose}
                    style={{ background: "#126798", color: "#fff", border: "none", borderRadius: 9999, padding: "10px 28px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                      Nome <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      required
                      placeholder="Seu nome completo"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                      Telefone / WhatsApp <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      required
                      placeholder="(41) 9 9999-9999"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                      E-mail <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                      Mensagem <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span>
                    </label>
                    <textarea
                      name="mensagem"
                      value={form.mensagem}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Conte um pouco sobre o que você precisa..."
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  {error && (
                    <p style={{ color: "#dc2626", fontSize: "0.82rem", margin: 0 }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      background: sending ? "#93c5da" : "#126798",
                      color: "#fff",
                      border: "none",
                      borderRadius: 9999,
                      padding: "13px",
                      fontWeight: 700,
                      fontSize: "0.93rem",
                      cursor: sending ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.2s",
                    }}
                  >
                    {sending ? "Enviando…" : "Enviar solicitação"}
                  </button>

                  <p style={{ fontSize: "0.74rem", color: "#9ca3af", textAlign: "center", margin: 0 }}>
                    Seus dados estão seguros. Nunca enviamos spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #d1d5db",
  borderRadius: 9,
  fontSize: "0.9rem",
  fontFamily: "inherit",
  color: "#1a1d20",
  background: "#fafafa",
  boxSizing: "border-box",
  outline: "none",
};
