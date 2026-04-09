"use client";
import { useState } from "react";
import styles from "../../home.module.css";

const WA_HREF = "https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
          textAlign: "left",
          gap: 16,
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: "0.97rem", fontWeight: 700, color: "#1a1d20", lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s", color: "#6b7280", fontSize: "1.1rem" }}>⌄</span>
      </button>
      {open && <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.72, paddingBottom: 20, margin: 0 }}>{a}</p>}
    </div>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" style={{ display: "block", flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function HomeFaqSection({ faqs }) {
  return (
    <section id="faq" style={{ padding: "80px 5%", background: "#fff" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className={styles["section-label"]}>Dúvidas Frequentes</div>
          <div className={styles["divider"]} style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>Perguntas frequentes</h2>
        </div>
        <div>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 16 }}>Ainda tem dúvidas? Fale diretamente com nossa equipe.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contato" className={styles["btn-primary"]}>Solicitar orçamento grátis</a>
            <a href={WA_HREF} className={styles["btn-whatsapp"]} target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
