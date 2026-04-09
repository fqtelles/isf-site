"use client";
import { useState } from "react";
import styles from "./LandingPage.module.css";

export default function LandingPageLeadForm({ service }) {
  const [formData, setFormData] = useState({ nome: "", telefone: "", mensagem: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setFormError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, servico: service.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");
      setSent(true);
    } catch (err) {
      setFormError(err.message || "Erro ao enviar. Tente pelo WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div id="orcamento" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: "2.4rem", marginBottom: 14 }}>✅</div>
          <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#111827", marginBottom: 8 }}>Mensagem enviada!</h3>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Nossa equipe entrará em contato em breve.</p>
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827", marginBottom: 6 }}>Orçamento gratuito</h2>
          <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 22 }}>Sem compromisso. Respondemos em até 2h.</p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label htmlFor="lp-nome" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Seu nome completo</label>
            <input id="lp-nome" className={styles["lp-input"]} placeholder="Seu nome completo" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            <label htmlFor="lp-telefone" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Telefone / WhatsApp</label>
            <input id="lp-telefone" className={styles["lp-input"]} placeholder="Telefone / WhatsApp" required value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
            <label htmlFor="lp-mensagem" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Mensagem</label>
            <textarea id="lp-mensagem" className={styles["lp-input"]} placeholder={service.formPlaceholder} rows={3} style={{ resize: "none" }} value={formData.mensagem} onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })} />
            <button type="submit" className={styles["lp-btn"]} disabled={sending} style={{ width: "100%", textAlign: "center", borderRadius: 8, opacity: sending ? 0.7 : 1 }}>
              {sending ? "Enviando…" : "Solicitar Orçamento"}
            </button>
            {formError && <p style={{ fontSize: "0.82rem", color: "#dc2626", margin: 0 }}>{formError}</p>}
          </form>
        </>
      )}
    </div>
  );
}
