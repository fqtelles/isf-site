"use client";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Empresa",  href: "/#empresa" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Produtos", href: "/#produtos" },
  { label: "Blog",     href: "/#blog" },
  { label: "Contato",  href: "/#contato" },
];

const FOOTER_NAV = [
  { label: "Home",     href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Produtos", href: "/#produtos" },
  { label: "Empresa",  href: "/#empresa" },
  { label: "Blog",     href: "/#blog" },
  { label: "Contato",  href: "/#contato" },
];

const WA_HREF =
  "https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!";

const shellCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-inter), 'Helvetica Neue', Arial, sans-serif; color: #1a1d20; background: #fff; }
  a { text-decoration: none; }

  /* ── Navbar ── */
  .shell-nav-link { font-size: 0.88rem; color: #6b7280; font-weight: 500; transition: color 0.2s; }
  .shell-nav-link:hover { color: #126798; }
  .shell-social { color: #b0b7c3; display: flex; align-items: center; transition: color 0.2s; }
  .shell-social:hover { color: #126798; }
  .shell-desktop-nav { display: flex; gap: 28px; align-items: center; }
  .shell-mobile-btn { display: none; background: none; border: none; cursor: pointer; font-size: 1.5rem; color: #32373c; padding: 4px; }
  .shell-btn-primary { background: #126798; color: #fff; border: none; padding: 10px 22px; border-radius: 9999px; font-family: inherit; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.25s; display: inline-block; }
  .shell-btn-primary:hover { background: #0d5280; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(18,103,152,0.35); }

  /* ── WhatsApp FAB ── */
  @keyframes shellWaPulse {
    0%   { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.55); }
    70%  { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 14px rgba(37,211,102,0); }
    100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0); }
  }
  .shell-wa-fab { position: fixed; bottom: 28px; right: 28px; z-index: 999; width: 60px; height: 60px; background: #25d366; border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: shellWaPulse 2.2s infinite; transition: transform 0.25s; }
  .shell-wa-fab:hover { animation: none; transform: scale(1.1) !important; box-shadow: 0 8px 32px rgba(37,211,102,0.5) !important; }

  /* ── Footer ── */
  .shell-footer-link { font-size: 0.85rem; color: rgba(255,255,255,0.55); transition: color 0.2s; }
  .shell-footer-link:hover { color: #fff; }
  .shell-footer-social { color: rgba(255,255,255,0.35); display: flex; transition: color 0.2s; }
  .shell-footer-social:hover { color: rgba(255,255,255,0.8); }

  @media (max-width: 768px) {
    .shell-desktop-nav { display: none !important; }
    .shell-mobile-btn { display: block !important; }
    .shell-footer-cols { flex-direction: column !important; gap: 28px !important; }
  }
`;

export default function SiteShell({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{shellCss}</style>

      {/* ── WhatsApp FAB ── */}
      <a
        href={WA_HREF}
        className="shell-wa-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "0 5%",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
          transition: "box-shadow 0.3s",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://isf.com.br/ISF_SolucoesEmSeguranca_Logo.png"
            alt="ISF Segurança Eletrônica"
            style={{ height: 58, width: "auto", objectFit: "contain" }}
          />
        </a>

        {/* Desktop nav */}
        <div className="shell-desktop-nav">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="shell-nav-link">
              {l.label}
            </a>
          ))}

          {/* Social icons */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: -8 }}>
            <a
              href="https://www.facebook.com/isfsegurancaeletronica"
              target="_blank"
              rel="noopener noreferrer"
              className="shell-social"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/isfsolucoesemseguranca/"
              target="_blank"
              rel="noopener noreferrer"
              className="shell-social"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>

          <a href="/#contato" className="shell-btn-primary">
            Orçamento Grátis
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="shell-mobile-btn"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 72,
            left: 0,
            right: 0,
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            zIndex: 99,
            padding: "16px 5%",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="shell-nav-link"
              onClick={() => setMobileOpen(false)}
              style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#contato"
            className="shell-btn-primary"
            style={{ textAlign: "center", marginTop: 8 }}
            onClick={() => setMobileOpen(false)}
          >
            Orçamento Grátis
          </a>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      {children}

      {/* ── FOOTER ── */}
      <footer style={{ padding: "48px 5% 32px", background: "#1a1d20", borderTop: "1px solid #2d3137" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            className="shell-footer-cols"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 40,
              marginBottom: 36,
            }}
          >
            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://isf.com.br/ISF_SolucoesEmSeguranca_Logo.png"
                alt="ISF Segurança Eletrônica"
                style={{
                  height: 36,
                  width: "auto",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                  marginBottom: 14,
                }}
              />
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                Segurança eletrônica em Curitiba e Região Metropolitana há mais de 35 anos.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 14,
                }}
              >
                Navegação
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FOOTER_NAV.map((l) => (
                  <a key={l.label} href={l.href} className="shell-footer-link">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 14,
                }}
              >
                Contato
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="tel:4133787933" className="shell-footer-link">
                  (41) 3378-7933
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=554133787933"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shell-footer-link"
                >
                  WhatsApp (41) 99991-9191
                </a>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                  Seg–Sex: 8h30–18h00
                </span>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                  R. Omar Dutra, 52 — Curitiba, PR
                </span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid #2d3137",
              paddingTop: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} ISF Soluções em Segurança · Todos os direitos reservados
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                CNPJ registrado · Curitiba, PR
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a
                  href="https://www.facebook.com/isfsegurancaeletronica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shell-footer-social"
                  aria-label="Facebook ISF"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/isfsolucoesemseguranca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shell-footer-social"
                  aria-label="Instagram ISF"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
