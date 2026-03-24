"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import SiteShell from "../../components/SiteShell";
import { StatsStrip, WhyISF, CategoryFaq, FinalCta, ConversionStyles } from "../../components/ConversionSections";
import QuoteModal from "../../components/QuoteModal";

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" style={{ display: "block", flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function getYoutubeEmbed(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

const C = {
  dark:   "#1a1d20",
  gray:   "#32373c",
  muted:  "#6b7280",
  border: "#e5e7eb",
  bg:     "#f9fafb",
  blue:   "#126798",
  white:  "#ffffff",
};

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: "2rem", cursor: "pointer", lineHeight: 1 }}
        aria-label="Fechar"
      >×</button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev(); }}
          style={{ position: "absolute", left: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "1.8rem", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Anterior"
        >‹</button>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 8px 48px rgba(0,0,0,0.6)" }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext(); }}
          style={{ position: "absolute", right: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "1.8rem", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Próxima"
        >›</button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

const productCss = `
  .btn-primary { background: #126798; color: #fff; border: none; padding: 14px 32px; border-radius: 9999px; font-family: inherit; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.25s; display: inline-block; }
  .btn-primary:hover { background: #0d5280; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(18,103,152,0.35); }
  .thumb { border: 2px solid transparent; border-radius: 8px; cursor: pointer; overflow: hidden; transition: border-color 0.2s; background: #f9fafb; }
  .thumb.active { border-color: #126798; }
  .thumb:hover { border-color: #c5ddef; }
  .related-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: all 0.3s; }
  .related-card:hover { box-shadow: 0 8px 32px rgba(18,103,152,0.12); transform: translateY(-3px); border-color: #c5ddef; }
  @media (max-width: 768px) {
    .product-grid { grid-template-columns: 1fr !important; }
    .thumbs-row { flex-direction: row !important; overflow-x: auto; }
    .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .breadcrumb-row { flex-wrap: wrap; }
  }
`;

export default function ProductDetail({ product, related }) {
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const embedUrl = getYoutubeEmbed(product.video);

  const lbPrev = useCallback(() => setActive(i => (i - 1 + allImages.length) % allImages.length), [allImages.length]);
  const lbNext = useCallback(() => setActive(i => (i + 1) % allImages.length), [allImages.length]);

  return (
    <SiteShell>
      <style>{productCss}</style>
      {lightbox && (
        <Lightbox
          images={allImages}
          index={active}
          onClose={() => setLightbox(false)}
          onPrev={lbPrev}
          onNext={lbNext}
        />
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 5% 80px" }}>

        {/* Back + Breadcrumb */}
        <div style={{ marginBottom: 32 }}>
          <a href="/#produtos" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#6b7280", textDecoration: "none", fontWeight: 500, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Voltar
          </a>
          <div className="breadcrumb-row" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: C.muted }}>
            <a href="/" style={{ color: C.blue }}>Home</a>
            <span>›</span>
            <a href="/#produtos" style={{ color: C.blue }}>Produtos</a>
            <span>›</span>
            <span style={{ color: C.muted }}>{product.category}</span>
            <span>›</span>
            <span style={{ color: C.dark, fontWeight: 600 }}>{product.name}</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start", marginBottom: 64 }}>

          {/* Left — gallery */}
          <div>
            {/* Main image */}
            <div
              onClick={() => setLightbox(true)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", height: 560, marginBottom: 16, position: "relative", overflow: "hidden", cursor: "zoom-in" }}
              title="Clique para ampliar"
            >
              <Image
                src={allImages[active]}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "contain", transition: "opacity 0.2s" }}
                priority
              />
              {allImages.length > 1 && (
                <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: 9999 }}>
                  {active + 1}/{allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="thumbs-row" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {allImages.map((src, i) => (
                  <div key={i} className={`thumb${active === i ? " active" : ""}`} onClick={() => setActive(i)} style={{ width: 90, height: 90, flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — info */}
          <div style={{ paddingTop: 8 }}>
            {/* Brand badge */}
            <span style={{ display: "inline-block", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.white, background: C.gray, padding: "4px 12px", borderRadius: 9999, marginBottom: 14 }}>
              {product.brand}
            </span>

            {/* Category */}
            <div style={{ fontSize: "0.75rem", color: C.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              {product.category}
            </div>

            {/* Name */}
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: C.dark, lineHeight: 1.2, marginBottom: 24 }}>
              {product.name}
            </h1>

            {/* Divider */}
            <div style={{ width: 48, height: 3, background: C.blue, borderRadius: 2, marginBottom: 24 }} />

            {/* Description */}
            {product.description ? (
              <div style={{ marginBottom: 32 }}>
                {product.description.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i} style={{ fontSize: "0.97rem", lineHeight: 1.78, color: "#4b5563", marginBottom: 12 }}>{para}</p>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.97rem", color: C.muted, marginBottom: 32, lineHeight: 1.78 }}>
                Entre em contato para obter mais informações sobre este produto.
              </p>
            )}

            {/* CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, background: "#f0f7fc", border: "1px solid #c5ddef", borderRadius: 14, padding: 24 }}>
              <p style={{ fontSize: "0.88rem", color: C.gray, fontWeight: 600 }}>
                Quer um orçamento ou mais detalhes deste produto?
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href={`https://api.whatsapp.com/send?phone=554133787933&text=Olá%2C%20tenho%20interesse%20no%20produto%20*${encodeURIComponent(product.name)}*%20e%20gostaria%20de%20um%20orçamento!`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: "#25d366", color: "#fff", fontSize: "0.85rem", padding: "12px 24px", borderRadius: 9999, fontFamily: "inherit", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.25s" }}
                >
                  <WaIcon /> WhatsApp
                </a>
                <QuoteModal
                  label="Solicitar Orçamento"
                  context={`Produto: ${product.name}`}
                  buttonClass="btn-primary"
                  buttonStyle={{ fontSize: "0.85rem", padding: "12px 24px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Video section */}
        {embedUrl && (
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: C.dark, marginBottom: 20 }}>Vídeo do Produto</h2>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <iframe
                src={embedUrl}
                title={`Vídeo — ${product.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: C.dark, marginBottom: 8 }}>Produtos Relacionados</h2>
            <p style={{ fontSize: "0.88rem", color: C.muted, marginBottom: 28 }}>Outros produtos da categoria {product.category}</p>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {related.map(p => (
                <a key={p.id} href={`/produtos/${p.slug || p.id}`} className="related-card">
                  <div style={{ background: C.bg, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", height: 160, borderBottom: `1px solid ${C.border}`, position: "relative" }}>
                    <Image src={p.image} alt={p.name} fill sizes="25vw" style={{ objectFit: "contain", padding: 20 }} />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.white, background: C.gray, padding: "2px 8px", borderRadius: 9999, marginBottom: 8, display: "inline-block" }}>{p.brand}</span>
                    <p style={{ fontSize: "0.83rem", fontWeight: 700, color: C.dark, lineHeight: 1.4 }}>{p.name}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <ConversionStyles />
      <StatsStrip headline="ISF Segurança Eletrônica — números que comprovam a confiança" />
      <WhyISF title={`Por que adquirir ${product.category} com a ISF?`} />
      <CategoryFaq category={product.category} />
      <FinalCta context={product.name} />
    </SiteShell>
  );
}
