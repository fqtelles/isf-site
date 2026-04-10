"use client";
import { useState } from "react";
import styles from "../../home.module.css";

const WA_HREF = "https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!";

const ICONS = {
  chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  clock: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
};

function Icon({ d, size = 18, color = "#6b7280" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: "block", flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

export default function HomeContactSection() {
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", servico: "", mensagem: "" });
  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setFormSending(true);
    setFormError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, pagina: "Homepage" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");
      setFormSent(true);
    } catch (err) {
      setFormError(err.message || "Erro ao enviar. Tente pelo WhatsApp.");
    } finally {
      setFormSending(false);
    }
  }

  return (
    <section id="contato" style={{ padding: "96px 5%", background: "#f9fafb", backgroundImage: "radial-gradient(rgba(18,103,152,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className={styles["section-label"]}>Fale Conosco</div>
          <div className={styles["divider"]} style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em", marginBottom: 10 }}>Solicite seu orçamento grátis</h2>
          <p style={{ color: "#6b7280", fontSize: "0.97rem" }}>Atendemos Curitiba e Região Metropolitana. Entre em contato e receba um orçamento sem compromisso.</p>
        </div>

        <div className={styles["contact-grid"]} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "chat", label: "Telefone / WhatsApp", val: "(41) 3378-7933", href: WA_HREF },
              { icon: "pin", label: "Endereço", val: "R. Omar Dutra, 52 — São Lourenço, Curitiba-PR" },
              { icon: "clock", label: "Horário de atendimento", val: "Segunda a sexta: 8h30 – 18h00" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}><Icon d={ICONS[item.icon]} /></div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ color: "#1a1d20", fontSize: "0.9rem", fontWeight: 500 }}>
                    {item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: "#1a1d20", textDecoration: "none" }}>{item.val}</a> : item.val}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 36 }}>
            {formSent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "2.8rem", marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#1a1d20", fontWeight: 800, fontSize: "1.3rem", marginBottom: 8 }}>Mensagem enviada!</h3>
                <p style={{ color: "#6b7280" }}>Entraremos em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <label htmlFor="contact-nome" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Nome completo</label>
                  <input id="contact-nome" className={styles["form-input"]} placeholder="Nome completo" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                  <label htmlFor="contact-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>E-mail</label>
                  <input id="contact-email" className={styles["form-input"]} placeholder="E-mail" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <label htmlFor="contact-telefone" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Telefone / WhatsApp</label>
                <input id="contact-telefone" className={styles["form-input"]} placeholder="Telefone / WhatsApp" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
                <label htmlFor="contact-servico" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Serviço de interesse</label>
                <select id="contact-servico" className={styles["form-input"]} value={formData.servico} onChange={(e) => setFormData({ ...formData, servico: e.target.value })}>
                  <option value="">Serviço de interesse</option>
                  <option>Alarmes</option>
                  <option>Câmeras CFTV</option>
                  <option>Monitoramento</option>
                  <option>Cerca Elétrica</option>
                  <option>Controle de Acesso</option>
                  <option>Outros</option>
                </select>
                <label htmlFor="contact-mensagem" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Mensagem</label>
                <textarea id="contact-mensagem" className={styles["form-input"]} placeholder="Descreva brevemente sua necessidade..." rows={4} style={{ resize: "none" }} value={formData.mensagem} onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })} />
                <button type="submit" className={styles["btn-primary"]} disabled={formSending} style={{ width: "100%", textAlign: "center", borderRadius: 8, opacity: formSending ? 0.7 : 1 }}>
                  {formSending ? "Enviando..." : "Enviar Mensagem"}
                </button>
                {formError && <p style={{ fontSize: "0.82rem", color: "#dc2626", textAlign: "center", margin: 0 }}>{formError}</p>}
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>Seus dados estão seguros. Nunca enviamos spam.</p>
              </form>
            )}
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 12 }}>Como chegar</div>
          <div style={{ border: "2px solid #c5ddef", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(18,103,152,0.10)" }}>
            <iframe
              src="https://maps.google.com/maps?q=ISF+Seguran%C3%A7a+Eletr%C3%B4nica,+Curitiba,+PR&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="340"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização ISF Segurança Eletrônica — R. Omar Dutra, 52, Curitiba-PR"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
