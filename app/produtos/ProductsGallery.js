"use client";
import { useState } from "react";
import SiteShell from "../components/SiteShell";
import { StatsStrip, WhyISF, FinalCta, ConversionStyles } from "../components/ConversionSections";
import QuoteModal from "../components/QuoteModal";

const CATEGORIES = ["Todos", "Câmeras", "DVR / NVR", "Alarmes", "Cerca Elétrica", "Controle de Acesso"];

const galleryCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .gallery-hero {
    background: linear-gradient(135deg, #0d1b2a 0%, #126798 60%, #1a8bbf 100%);
    padding: 36px 5% 40px;
    position: relative;
    overflow: hidden;
  }
  .gallery-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .cat-tab {
    padding: 10px 22px;
    border-radius: 9999px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    font-family: inherit;
    font-size: 0.84rem;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .cat-tab:hover { border-color: #126798; color: #126798; background: #eff6ff; }
  .cat-tab.active { background: #126798; color: #fff; border-color: #126798; box-shadow: 0 4px 14px rgba(18,103,152,0.28); }

  .prod-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
  .prod-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    transition: all 0.28s;
  }
  .prod-card:hover {
    border-color: #126798;
    box-shadow: 0 10px 40px rgba(18,103,152,0.14);
    transform: translateY(-4px);
  }
  .prod-card-img {
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 190px;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }
  .prod-card-img img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
  }
  .prod-card:hover .prod-card-img img { transform: scale(1.06); }
  .prod-card-body {
    padding: 16px 18px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .prod-brand {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
    background: #32373c;
    display: inline-block;
    padding: 3px 10px;
    border-radius: 9999px;
    margin-bottom: 10px;
  }
  .prod-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: #1a1d20;
    line-height: 1.4;
    margin-bottom: 6px;
    flex: 1;
  }
  .prod-cat {
    font-size: 0.7rem;
    color: #6b7280;
    margin-bottom: 12px;
  }
  .prod-cta {
    font-size: 0.73rem;
    color: #126798;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .count-badge {
    background: #eff6ff;
    color: #126798;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 9999px;
    border: 1px solid #c5ddef;
  }

  @media (max-width: 1200px) { .prod-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 900px)  { .prod-grid { grid-template-columns: repeat(3, 1fr); } .prod-card-img { height: 160px; } }
  @media (max-width: 600px)  {
    .prod-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .prod-card-img { height: 130px; padding: 14px; }
    .cat-tabs-wrap { flex-wrap: wrap; }
  }
`;

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" style={{ display: "block", flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function ProductsGallery({ products }) {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = activeCategory === "Todos"
    ? products
    : products.filter(p => p.category === activeCategory);

  const countByCategory = (cat) =>
    cat === "Todos" ? products.length : products.filter(p => p.category === cat).length;

  return (
    <SiteShell>
      <style>{galleryCss}</style>
      <ConversionStyles />

      {/* ── HERO ── */}
      <div className="gallery-hero">
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginBottom: 18 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <span style={{ color: "#fff" }}>Produtos</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
                Catálogo Completo
              </div>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 10 }}>
                Produtos de Segurança Eletrônica
              </h1>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.72)", maxWidth: 520, lineHeight: 1.65 }}>
                Revenda autorizada Intelbras. Câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso com instalação profissional em Curitiba e região.
              </p>
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 220 }}>
              <QuoteModal
                label="Solicitar Orçamento Grátis"
                context="Catálogo de Produtos"
                buttonStyle={{
                  background: "#fff",
                  color: "#126798",
                  padding: "13px 28px",
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  width: "100%",
                  textAlign: "center",
                }}
              />
              <a
                href="https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20cat%C3%A1logo%20de%20produtos%20e%20gostaria%20de%20um%20or%C3%A7amento!"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#25d366",
                  color: "#fff",
                  padding: "13px 28px",
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <WaIcon /> WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── GALLERY ── */}
      <section style={{ padding: "56px 5% 96px", background: "#f9fafb", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>

          {/* Category tabs + count */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
            <div className="cat-tabs-wrap" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-tab${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  {" "}
                  <span style={{ opacity: 0.65, fontWeight: 500 }}>({countByCategory(cat)})</span>
                </button>
              ))}
            </div>
            <span className="count-badge">
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>
              Nenhum produto encontrado nesta categoria.
            </div>
          ) : (
            <div className="prod-grid">
              {filtered.map(p => (
                <a key={p.id} href={`/produtos/${p.slug || p.id}`} className="prod-card">
                  <div className="prod-card-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </div>
                  <div className="prod-card-body">
                    <span className="prod-brand">{p.brand}</span>
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-cat">{p.category}</div>
                    <div className="prod-cta">
                      Ver detalhes
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Bottom CTA strip */}
          <div style={{
            marginTop: 64,
            background: "#fff",
            border: "1.5px solid #c5ddef",
            borderRadius: 18,
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1a1d20", marginBottom: 6 }}>
                Não encontrou o produto que procura?
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#6b7280", lineHeight: 1.6 }}>
                Trabalhamos com diversos produtos e marcas além dos listados aqui. Fale com nosso time e encontramos a solução ideal para você.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0 }}>
              <QuoteModal
                label="Solicitar Orçamento"
                context="Catálogo de Produtos"
                buttonStyle={{
                  background: "#126798",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              />
              <a
                href="https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20n%C3%A3o%20encontrei%20o%20produto%20que%20preciso%20no%20cat%C3%A1logo%2C%20pode%20me%20ajudar%3F"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#25d366",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <WaIcon /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <StatsStrip headline="ISF Segurança Eletrônica — números que comprovam a confiança" />
      <WhyISF title="Por que adquirir com a ISF?" />
      <FinalCta context="Catálogo de Produtos" />
    </SiteShell>
  );
}
