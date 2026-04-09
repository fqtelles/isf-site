"use client";
import { useState } from "react";
import styles from "./LandingPage.module.css";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className={styles["faq-btn"]} onClick={() => setOpen((prev) => !prev)} aria-expanded={open}>
        <span style={{ fontSize: "0.97rem", fontWeight: 700, color: "#1a1d20", lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: "1.2rem", color: "#6b7280", flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>+</span>
      </button>
      {open && <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.72, paddingBottom: 18 }}>{a}</p>}
    </div>
  );
}

export default function LandingPageFaq({ faqs }) {
  return (
    <section style={{ padding: "72px 5%", background: "#f9fafb" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#111827", marginBottom: 40, textAlign: "center", letterSpacing: "-0.02em" }}>
          Perguntas frequentes
        </h2>
        {faqs.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>
  );
}
