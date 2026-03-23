"use client";
import { useState } from "react";
import SiteShell from "./SiteShell";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-inter), 'Helvetica Neue', Arial, sans-serif; color: #1a1d20; background: #fff; }
  .lp-btn { background: #126798; color: #fff; border: none; padding: 13px 28px; border-radius: 9999px; font-family: inherit; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.25s; text-decoration: none; display: inline-block; letter-spacing: 0.01em; }
  .lp-btn:hover { background: #0d5280; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(18,103,152,0.35); }
  .lp-btn-wa { background: #25d366; color: #fff; display: inline-flex; align-items: center; gap: 8px; }
  .lp-btn-wa:hover { background: #1fba58; box-shadow: 0 4px 20px rgba(37,211,102,0.4); transform: translateY(-1px); }
  .lp-btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.7); }
  .lp-btn-outline:hover { background: rgba(255,255,255,0.15); box-shadow: none; }
  .lp-btn-white { background: #fff; color: #126798; }
  .lp-btn-white:hover { background: #f0f7fc; box-shadow: 0 4px 20px rgba(18,103,152,0.2); }
  .lp-input { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 13px 16px; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
  .lp-input:focus { border-color: #126798; box-shadow: 0 0 0 3px rgba(18,103,152,0.08); }
  .lp-input::placeholder { color: #9ca3af; }
  .check-item { display: flex; align-items: flex-start; gap: 12px; padding: 16px 0; border-bottom: 1px solid #f3f4f6; }
  .lp-icon-box { width: 48px; height: 48px; background: #f3f4f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; flex-shrink: 0; }
  .faq-btn { width: 100%; background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 18px 0; text-align: left; gap: 16px; border-bottom: 1px solid #e5e7eb; font-family: inherit; }
  @media (max-width: 768px) {
    .lp-hero-grid { grid-template-columns: 1fr !important; }
    .lp-features-grid { grid-template-columns: 1fr !important; }
    .lp-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" style={{ display: "block", flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

const LP_ICONS = {
  bell:         "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  phone:        "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  shield:       "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  badge:        "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  bolt:         "M13 10V3L4 14h7v7l9-11h-7z",
  pin:          "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
  camera:       "M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  moon:         "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
  database:     "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
  building:     "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  wrench:       "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  clock:        "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  link:         "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  chart:        "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  coin:         "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  finger:       "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
  card:         "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  face:         "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  barrier:      "M3 7h18M3 12h18M3 17h18",
  film:         "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
  users:        "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  lock:         "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  clipboard:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  home:         "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
};

function LpIcon({ name }) {
  const d = LP_ICONS[name];
  if (!d) return null;
  return (
    <div className="lp-icon-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="#32373c" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d={d} />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e" style={{ flexShrink: 0, marginTop: 1 }}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="faq-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span style={{ fontSize: "0.97rem", fontWeight: 700, color: "#1a1d20", lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: "1.2rem", color: "#6b7280", flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>+</span>
      </button>
      {open && <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.72, paddingBottom: 18 }}>{a}</p>}
    </div>
  );
}

export default function LandingPage({ service }) {
  const [formData, setFormData] = useState({ nome: "", telefone: "", mensagem: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");

  const waHref = `https://api.whatsapp.com/send?phone=554133787933&text=Olá%2C%20quero%20um%20orçamento%20de%20${encodeURIComponent(service.name)}!`;

  const handleSubmit = async (e) => {
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
  };

  return (
    <SiteShell>
      <style>{css}</style>

      {/* Back link */}
      <div style={{ background: "#f9fafb", padding: "20px 5% 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#6b7280", textDecoration: "none", fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Voltar
          </a>
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: "#f9fafb", padding: "32px 5% 64px" }}>
        <div className="lp-hero-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", background: "#e8f3f9", color: "#126798", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 9999, marginBottom: 20 }}>
              {service.badge}
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#111827", marginBottom: 20 }}>
              {service.h1}
            </h1>
            <p style={{ fontSize: "1.05rem", color: "#6b7280", lineHeight: 1.75, marginBottom: 32, maxWidth: 520 }}>
              {service.subtitle}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#orcamento" className="lp-btn">Solicitar orçamento grátis</a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-wa"><WaIcon />WhatsApp</a>
            </div>
            <div style={{ marginTop: 28, display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["✔ Orçamento gratuito", "✔ Atende Curitiba e RMC", "✔ 35+ anos de experiência"].map(b => (
                <span key={b} style={{ fontSize: "0.82rem", color: "#6b7280" }}>{b}</span>
              ))}
            </div>
          </div>

          {/* FORM inline */}
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
                  <input className="lp-input" placeholder="Seu nome completo" required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} />
                  <input className="lp-input" placeholder="Telefone / WhatsApp" required value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} />
                  <textarea className="lp-input" placeholder={service.formPlaceholder} rows={3} style={{ resize: "none" }} value={formData.mensagem} onChange={e => setFormData({ ...formData, mensagem: e.target.value })} />
                  <button type="submit" className="lp-btn" disabled={sending} style={{ width: "100%", textAlign: "center", borderRadius: 8, opacity: sending ? 0.7 : 1 }}>
                    {sending ? "Enviando…" : "Solicitar Orçamento"}
                  </button>
                  {formError && <p style={{ fontSize: "0.82rem", color: "#dc2626", margin: 0 }}>{formError}</p>}
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section style={{ padding: "72px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#111827", marginBottom: 40, textAlign: "center", letterSpacing: "-0.02em" }}>
            Por que escolher a ISF para {service.name.toLowerCase()}?
          </h2>
          <div className="lp-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {service.benefits.map(b => (
              <div key={b.title} style={{ padding: "28px 24px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12 }}>
                <LpIcon name={b.icon} />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: "0.87rem", color: "#6b7280", lineHeight: 1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS ISF */}
      <section style={{ padding: "64px 5%", background: "#32373c" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}>
            ISF Soluções em Segurança — desde 1988
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.97rem", marginBottom: 40 }}>
            Mais de 35 anos protegendo Curitiba e Região Metropolitana.
          </p>
          <div className="lp-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderTop: "1px solid rgba(255,255,255,0.1)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            {[
              { n: "35+",     l: "Anos de mercado" },
              { n: "30.000+", l: "Atendimentos realizados" },
              { n: "5.000+",  l: "Clientes ativos" },
              { n: "24/7",    l: "Monitoramento" },
            ].map(s => (
              <div key={s.l} style={{ padding: "24px 16px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>{s.n}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section style={{ padding: "72px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>
            O que está incluso no serviço
          </h2>
          {service.checklist.map(item => (
            <div key={item} className="check-item">
              <CheckIcon />
              <span style={{ fontSize: "0.95rem", color: "#374151", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "72px 5%", background: "#f9fafb" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#111827", marginBottom: 40, textAlign: "center", letterSpacing: "-0.02em" }}>
            Perguntas frequentes
          </h2>
          {service.faqs.map(faq => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "80px 5%", background: "#126798" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Pronto para proteger o seu patrimônio?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", marginBottom: 36 }}>
            Orçamento gratuito e sem compromisso. Atendemos Curitiba e toda a Região Metropolitana.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#orcamento" className="lp-btn lp-btn-white">Solicitar Orçamento</a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-wa"><WaIcon />WhatsApp</a>
          </div>
        </div>
      </section>

    </SiteShell>
  );
}
