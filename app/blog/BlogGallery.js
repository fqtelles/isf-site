"use client";
import { useState } from "react";
import Image from "next/image";
import SiteShell from "../components/SiteShell";
import { StatsStrip, BlogFaq, FinalCta, ConversionStyles } from "../components/ConversionSections";
import LazyQuoteModal from "../components/LazyQuoteModal";

const galleryCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .blog-hero {
    background: linear-gradient(135deg, #0d1b2a 0%, #126798 60%, #1a8bbf 100%);
    padding: 36px 5% 40px;
    position: relative;
    overflow: hidden;
  }
  .blog-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .blog-search {
    width: 100%;
    max-width: 440px;
    padding: 11px 18px 11px 42px;
    border-radius: 9999px;
    border: 1.5px solid #e5e7eb;
    font-family: inherit;
    font-size: 0.88rem;
    color: #1a1d20;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .blog-search:focus { border-color: #126798; box-shadow: 0 0 0 3px rgba(18,103,152,0.12); }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  .blog-card {
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
  .blog-card:hover {
    border-color: #126798;
    box-shadow: 0 10px 40px rgba(18,103,152,0.13);
    transform: translateY(-4px);
  }
  .blog-card-img {
    width: 100%;
    height: 210px;
    overflow: hidden;
    flex-shrink: 0;
    background: #f0f4f8;
  }
  .blog-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s;
  }
  .blog-card:hover .blog-card-img img { transform: scale(1.04); }
  .blog-card-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e8f3f9, #c5ddef);
  }
  .blog-card-body {
    padding: 22px 24px 26px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .blog-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .blog-card-date {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #126798;
  }
  .blog-card-read {
    font-size: 0.75rem;
    color: #4b5563;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .blog-card-title {
    font-size: 1rem;
    font-weight: 800;
    color: #1a1d20;
    line-height: 1.4;
    margin-bottom: 10px;
  }
  .blog-card-excerpt {
    font-size: 0.84rem;
    color: #6b7280;
    line-height: 1.65;
    flex: 1;
    margin-bottom: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .blog-card-cta {
    font-size: 0.78rem;
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
    white-space: nowrap;
  }

  @media (max-width: 1024px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) {
    .blog-grid { grid-template-columns: 1fr; gap: 16px; }
    .blog-card-img { height: 180px; }
    .blog-search { max-width: 100%; }
  }
`;

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" style={{ display: "block", flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function BlogGallery({ posts }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  return (
    <SiteShell>
      <style>{galleryCss}</style>
      <ConversionStyles />

      {/* ── HERO ── */}
      <div className="blog-hero">
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "rgba(255,255,255,0.82)", marginBottom: 18 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.92)", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <span style={{ color: "#fff" }}>Blog</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)", marginBottom: 8 }}>
                Dicas & Conteúdo
              </div>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 10 }}>
                Blog de Segurança Eletrônica
              </h1>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.72)", maxWidth: 480, lineHeight: 1.65 }}>
                Artigos, dicas e novidades sobre câmeras, alarmes, cercas elétricas e controle de acesso da equipe técnica da ISF.
              </p>
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 220 }}>
              <LazyQuoteModal
                label="Solicitar Orçamento Grátis"
                context="Blog ISF"
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
                href="https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20blog%20da%20ISF%20e%20gostaria%20de%20um%20or%C3%A7amento!"
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

      {/* ── POSTS GRID ── */}
      <section style={{ padding: "56px 5% 96px", background: "#f9fafb", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Search + count bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
            <div style={{ position: "relative" }}>
              <SearchIcon />
              <input
                className="blog-search"
                type="text"
                placeholder="Buscar artigos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span className="count-badge">
              {filtered.length} artigo{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>
              Nenhum artigo encontrado para "{search}".
            </div>
          ) : (
            <div className="blog-grid">
              {filtered.map(post => (
                <a key={post.id} href={`/blog/${post.slug || post.id}/`} className="blog-card">
                  <div className="blog-card-img" style={{ position: "relative" }}>
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="blog-card-img-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#93c5e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span className="blog-card-date">{post.date}</span>
                      <span className="blog-card-read"><ClockIcon />{post.readTime}</span>
                    </div>
                    <div className="blog-card-title">{post.title}</div>
                    <div className="blog-card-excerpt">{post.excerpt}</div>
                    <div className="blog-card-cta">
                      Ler artigo
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
                Ficou com alguma dúvida?
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#6b7280", lineHeight: 1.6 }}>
                Nossa equipe técnica está pronta para ajudar. Fale conosco e receba um orçamento gratuito.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0 }}>
              <LazyQuoteModal
                label="Solicitar Orçamento"
                context="Blog ISF"
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
                href="https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20li%20um%20artigo%20no%20blog%20da%20ISF%20e%20gostaria%20de%20tirar%20d%C3%BAvidas!"
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

      <StatsStrip headline="ISF Soluções em Segurança — 35+ anos protegendo famílias e empresas em Curitiba" />
      <BlogFaq />
      <FinalCta context="Blog ISF" />
    </SiteShell>
  );
}
