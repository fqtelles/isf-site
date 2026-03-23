"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import GoogleReviewsWidget from "./components/GoogleReviewsWidget";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Empresa", href: "#empresa" },
  { label: "Serviços", href: "#servicos" },
  { label: "Produtos", href: "#produtos" },
  { label: "Blog", href: "#blog" },
  { label: "Contato", href: "#contato" },
];

const SERVICES = [
  { icon: "alarm",      title: "Alarmes",           desc: "Garanta proteção 24 horas para o seu patrimônio, uma medida de segurança que traz tranquilidade. Oferecemos soluções com e sem fio.",                                          tag: "Mais popular", href: "/alarmes-curitiba" },
  { icon: "camera",     title: "Câmeras CFTV",       desc: "Instalação de câmeras HD, zoom, infravermelho, auto-íris ou imagem noturna. Trabalhamos com várias marcas para atender a sua necessidade.",                                    tag: null,           href: "/cameras-seguranca-curitiba" },
  { icon: "bolt",       title: "Cerca Elétrica",     desc: "Proteção perimetral com choque e alarme sonoro integrado. Solução de alto impacto para imóveis residenciais e comerciais.",                                                    tag: null,           href: "/cerca-eletrica-curitiba" },
  { icon: "lock",       title: "Controle de Acesso", desc: "Leitores biométricos, cartão de proximidade e reconhecimento facial. Ideal para condomínios e áreas restritas.",                                                         tag: null,           href: "/controle-de-acesso-curitiba" },
  { icon: "shield",     title: "Monitoramento",      desc: "Conte com uma equipe 24 horas dedicada ao monitoramento do seu patrimônio. A ISF trabalha em parceria com as melhores empresas do ramo.",                                      tag: null,           href: "/monitoramento-curitiba" },
  { icon: "smartphone", title: "App de Segurança",   desc: "Em um clique acesse pelo seu smartphone todas as câmeras do seu patrimônio, não importa onde estiver, basta estar conectado à internet.",                                      tag: "Comodidade",   href: "/app-de-seguranca" },
];

const STATS = [
  { value: "35",    suffix: "+", label: "Anos no mercado" },
  { value: "30000", suffix: "+", label: "Atendimentos realizados" },
  { value: "5000",  suffix: "+", label: "Clientes ativos" },
  { value: "300",   suffix: "+", label: "Produtos no catálogo" },
];

const PRODUCT_CATEGORIES = ["Todos", "Câmeras", "DVR / NVR", "Alarmes", "Cerca Elétrica", "Controle de Acesso"];
const VISIBLE = 3;
const BLOG_VISIBLE = 3;

const FAQS = [
  {
    q: "Quanto custa instalar câmeras de segurança em Curitiba?",
    a: "O valor varia conforme o número de câmeras, tipo de equipamento e área de cobertura. A ISF oferece orçamento gratuito e sem compromisso — entre em contato pelo WhatsApp ou formulário e nossa equipe visita o local para apresentar a melhor solução.",
  },
  {
    q: "A ISF faz monitoramento 24 horas?",
    a: "Sim. A ISF oferece serviço de monitoramento 24 horas em parceria com as melhores centrais do setor. Ao menor sinal de alarme, nossa equipe aciona os procedimentos de segurança imediatamente.",
  },
  {
    q: "Cerca elétrica é permitida em Curitiba?",
    a: "Sim, a cerca elétrica é permitida em Curitiba mediante instalação por empresa habilitada e seguindo as normas da ABNT NBR IEC 60335-2-76. A ISF realiza toda a instalação em conformidade com a legislação vigente.",
  },
  {
    q: "Quais bairros e cidades a ISF atende?",
    a: "Atendemos Curitiba e toda a Região Metropolitana, incluindo São José dos Pinhais, Colombo, Pinhais, Araucária, Campo Largo, Almirante Tamandaré e demais municípios da RMC.",
  },
  {
    q: "A ISF é revendedora autorizada Intelbras?",
    a: "Sim, somos revenda autorizada Intelbras e trabalhamos com produtos originais com garantia de fábrica. Também trabalhamos com outras marcas referência como Dtech, Vonder e Confiseg.",
  },
];

const WA_HREF = "https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!";

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" style={{ display: "block", flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const ICONS = {
  alarm: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  camera: "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z",
  bolt: "M7 2v11h3v9l7-12h-4l4-8z",
  lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  shield: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  smartphone: "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z",
  phone: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
  map: "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z",
  clock: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  trophy: "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zm-2 3.1V7h2v1c0 1.3-.84 2.4-2 2.82V8.1zM5 8V7h2v2.82C5.84 9.4 5 8.3 5 8z",
  handshake: "M11 14H9C9 9.03 13.03 5 18 5v2c-3.87 0-7 3.13-7 7zm8-7v2c-2.76 0-5 2.24-5 5h-2c0-3.87 3.13-7 7-7zM7 4c0-1.11-.89-2-2-2S3 2.89 3 4s.89 2 2 2 2-.89 2-2zm4.45.5h-2C9.21 5.92 8.28 7 7 7H3c-1.1 0-2 .9-2 2v3h6V9.43C8.86 8.96 10.67 7.39 11.45 4.5zM19 8c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm-3.45 6.5C16.79 18.08 15.86 19 14.58 19H11v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 1.1.9 2 2 2h4c1.93 0 3.5-1.57 3.5-3.5V17h2v-1.5c0-.83-.67-1.5-1.5-1.5h-3.45z",
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  monitor: "M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z",
  chevron: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
};

function Icon({ d, size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: "block", flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

function Counter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  const num = parseInt(value);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const step = Math.ceil(num / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, num);
          setCount(current);
          if (current >= num) clearInterval(timer);
        }, 25);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [num]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 0", textAlign: "left", gap: 16,
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: "0.97rem", fontWeight: 700, color: "#1a1d20", lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <Icon d={ICONS.chevron} size={20} color="#6b7280" />
        </span>
      </button>
      {open && (
        <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.72, paddingBottom: 20, margin: 0 }}>{a}</p>
      )}
    </div>
  );
}


const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --dark: #32373c;
    --darker: #1a1d20;
    --gray: #6b7280;
    --light-gray: #f5f5f5;
    --border: #e5e7eb;
    --white: #ffffff;
    --text: #32373c;
    --muted: #6b7280;
    --accent: #32373c;
    --blue: #126798;
    --blue-dark: #0d5280;
    --blue-light: #e8f3f9;
  }
  html { scroll-behavior: smooth; }
  body { background: #ffffff; color: #32373c; font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; }
  .nav-link { color: #32373c; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
  .nav-link:hover { color: #126798; }
  .nav-social-icon:hover { color: #32373c !important; }
  .btn-primary { background: #126798; color: #fff; border: none; padding: 13px 28px; border-radius: 9999px; font-family: inherit; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.25s; text-decoration: none; display: inline-block; letter-spacing: 0.01em; }
  .btn-primary:hover { background: #0d5280; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(18,103,152,0.35); }
  .btn-outline { background: transparent; color: #126798; border: 2px solid #126798; padding: 11px 28px; border-radius: 9999px; font-family: inherit; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.25s; text-decoration: none; display: inline-block; }
  .btn-outline:hover { background: #126798; color: #fff; transform: translateY(-1px); }
  .btn-outline-white { background: transparent; color: #fff; border: 2px solid #fff; padding: 11px 28px; border-radius: 9999px; font-family: inherit; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.25s; text-decoration: none; display: inline-block; }
  .btn-outline-white:hover { background: #fff; color: #126798; }
  .btn-whatsapp { background: #25d366; color: #fff; border: none; padding: 13px 24px; border-radius: 9999px; font-family: inherit; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.25s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; letter-spacing: 0.01em; }
  .btn-whatsapp:hover { background: #1fba58; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
  .hero-btns { flex-wrap: nowrap !important; }
  .hero-btns .btn-primary, .hero-btns .btn-whatsapp, .hero-btns .btn-outline { padding: 11px 20px; font-size: 0.82rem; }
  .service-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 32px 28px; transition: all 0.3s; display: block; text-decoration: none; color: inherit; cursor: pointer; }
  .service-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-4px); border-color: #126798; }
  .service-card-arrow { font-size: 0.82rem; color: #126798; font-weight: 600; margin-top: 16px; display: block; }
  .blog-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 28px; transition: all 0.3s; display: block; text-decoration: none; color: inherit; cursor: pointer; height: 100%; box-sizing: border-box; }
  .blog-card:hover { box-shadow: 0 8px 24px rgba(18,103,152,0.1); transform: translateY(-3px); }
  .blog-card-slide { flex: 0 0 calc(100% / 3); padding: 0 10px; box-sizing: border-box; }
  .tag { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; background: #32373c; color: #fff; display: inline-block; margin-bottom: 14px; }
  .section-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #6b7280; margin-bottom: 12px; }
  .form-input { width: 100%; background: #f9fafb; border: 1px solid var(--border); border-radius: 8px; padding: 13px 16px; color: var(--text); font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: #126798; background: #fff; box-shadow: 0 0 0 3px rgba(18,103,152,0.08); }
  .form-input::placeholder { color: #9ca3af; }
  select.form-input option { background: #fff; }
  .divider { width: 48px; height: 3px; background: #126798; border-radius: 2px; margin-bottom: 20px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.15s; }
  .fade-up-3 { animation-delay: 0.28s; }
  .fade-up-4 { animation-delay: 0.42s; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  @keyframes spinRev { 100% { transform: rotate(-360deg); } }
  @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-16px); } 100% { transform: translateY(0); } }
  .animate-float { animation: float 7s ease-in-out infinite; }
  .animate-spin-slow { animation: spin 50s linear infinite; }
  .animate-spin-rev { animation: spinRev 40s linear infinite; }
  @keyframes waPulse {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.55), 0 4px 20px rgba(37,211,102,0.35); }
    70%  { box-shadow: 0 0 0 16px rgba(37,211,102,0), 0 4px 20px rgba(37,211,102,0.35); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0), 0 4px 20px rgba(37,211,102,0.35); }
  }
  .whatsapp-fab { position: fixed; bottom: 28px; right: 28px; width: 60px; height: 60px; border-radius: 50%; background: #25d366; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; box-shadow: 0 4px 20px rgba(37,211,102,0.35); text-decoration: none; animation: waPulse 2.2s ease-out infinite; transition: transform 0.25s; }
  .whatsapp-fab:hover { animation: none; transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.55); }
  .whatsapp-fab-label { position: fixed; bottom: 44px; right: 100px; background: #1a1d20; color: #fff; font-size: 0.78rem; font-weight: 600; padding: 6px 12px; border-radius: 8px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 998; }
  .whatsapp-fab-label::after { content: ""; position: absolute; right: -6px; top: 50%; transform: translateY(-50%); border: 6px solid transparent; border-left-color: #1a1d20; border-right: none; }
  .whatsapp-fab:hover ~ .whatsapp-fab-label { opacity: 1; }
  .icon-box { width: 52px; height: 52px; border-radius: 10px; background: #f3f4f6; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
  .hero-badge {}
  .category-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px; }
  .category-tab { background: #fff; border: 1.5px solid #e5e7eb; color: #6b7280; padding: 8px 20px; border-radius: 9999px; font-family: inherit; font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .category-tab:hover { border-color: #126798; color: #126798; }
  .category-tab.active { background: #126798; border-color: #126798; color: #fff; }
  .carousel-outer { position: relative; }
  .carousel-overflow { overflow: hidden; border-radius: 12px; }
  .carousel-track { display: flex; transition: transform 0.45s cubic-bezier(0.4,0,0.2,1); }
  .product-card { flex: 0 0 calc(100% / 3); padding: 0 10px; }
  .product-card-inner { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: all 0.3s; height: 100%; }
  .product-card-inner:hover { box-shadow: 0 8px 32px rgba(18,103,152,0.12); transform: translateY(-4px); border-color: #c5ddef; }
  .product-img-wrap { background: #f9fafb; padding: 20px; display: flex; align-items: center; justify-content: center; height: 300px; border-bottom: 1px solid #f3f4f6; }
  .product-img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .product-info { padding: 18px 20px; }
  .product-brand { display: inline-block; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; background: #32373c; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px; }
  .product-name { font-size: 0.88rem; font-weight: 700; color: #1a1d20; line-height: 1.4; }
  .product-cat { font-size: 0.75rem; color: #9ca3af; margin-top: 4px; }
  .carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: #fff; border: 1.5px solid #e5e7eb; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; font-size: 1rem; color: #126798; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .carousel-btn:hover { background: #126798; color: #fff; border-color: #126798; }
  .carousel-btn:disabled { opacity: 0.3; cursor: default; }
  .carousel-btn-prev { left: -20px; }
  .carousel-btn-next { right: -20px; }
  .carousel-dots { display: flex; justify-content: center; gap: 7px; margin-top: 28px; }
  .carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; border: none; cursor: pointer; padding: 0; transition: all 0.2s; }
  .carousel-dot.active { background: #126798; width: 24px; border-radius: 9999px; }
  @media (max-width: 768px) {
    .services-grid { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
.contact-grid { grid-template-columns: 1fr !important; }
    .about-grid { grid-template-columns: 1fr !important; }
    .desktop-nav { display: none !important; }
    .hero-btns { flex-direction: column !important; align-items: flex-start !important; }
    .hero-visual { display: none !important; }
    .product-card { flex: 0 0 100%; }
    .blog-card-slide { flex: 0 0 100%; }
    .carousel-btn-prev { left: -12px; }
    .carousel-btn-next { right: -12px; }
  }
`;

export default function HomeClient({ initialProducts, initialBlogPosts }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", servico: "", mensagem: "" });
  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [products, setProducts] = useState(initialProducts);
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);

  const shuffledProducts = useMemo(() => {
    const arr = [...products];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Ensure at least one camera is visible in the first VISIBLE slots
    const hasCameraFirst = arr.slice(0, VISIBLE).some(p => p.category === "Câmeras");
    if (!hasCameraFirst) {
      const cameraIdx = arr.findIndex(p => p.category === "Câmeras");
      if (cameraIdx !== -1) {
        const swapPos = Math.floor(Math.random() * VISIBLE);
        [arr[swapPos], arr[cameraIdx]] = [arr[cameraIdx], arr[swapPos]];
      }
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = activeCategory === "Todos"
    ? shuffledProducts
    : products.filter(p => p.category === activeCategory);
  const maxIndex = Math.max(0, filteredProducts.length - VISIBLE);

  const [carouselPaused, setCarouselPaused] = useState(false);
  const prodTouchX = useRef(null);
  const prodTrackRef = useRef(null);
  const prodIndexRef = useRef(carouselIndex);
  prodIndexRef.current = carouselIndex;

  const prevSlide = () => setCarouselIndex(i => Math.max(0, i - 1));
  const nextSlide = () => setCarouselIndex(i => Math.min(maxIndex, i + 1));

  const prodTouchStart = e => {
    prodTouchX.current = e.touches[0].clientX;
    setCarouselPaused(true);
    if (prodTrackRef.current) prodTrackRef.current.style.transition = "none";
  };
  const prodTouchMove = e => {
    if (prodTouchX.current === null) return;
    const dx = e.touches[0].clientX - prodTouchX.current;
    if (prodTrackRef.current) {
      prodTrackRef.current.style.transform =
        `translateX(calc(-${prodIndexRef.current * (100 / VISIBLE)}% + ${dx}px))`;
    }
  };
  const prodTouchEnd = e => {
    if (prodTouchX.current === null) return;
    const dx = e.changedTouches[0].clientX - prodTouchX.current;
    if (prodTrackRef.current) prodTrackRef.current.style.transition = "";
    if (dx < -30) nextSlide();
    else if (dx > 30) prevSlide();
    else if (prodTrackRef.current) {
      prodTrackRef.current.style.transform =
        `translateX(-${prodIndexRef.current * (100 / VISIBLE)}%)`;
    }
    prodTouchX.current = null;
    setCarouselPaused(false);
  };

  // Blog carousel
  const [blogCarouselIndex, setBlogCarouselIndex] = useState(0);
  const [blogCarouselPaused, setBlogCarouselPaused] = useState(false);
  const blogMaxIndex = Math.max(0, Math.ceil(blogPosts.length / BLOG_VISIBLE) - 1);
  const blogPrevSlide = () => setBlogCarouselIndex(i => Math.max(0, i - 1));
  const blogNextSlide = () => setBlogCarouselIndex(i => Math.min(blogMaxIndex, i + 1));
  const blogTouchX = useRef(null);
  const blogTrackRef = useRef(null);
  const blogIndexRef = useRef(blogCarouselIndex);
  blogIndexRef.current = blogCarouselIndex;

  const blogTouchStart = e => {
    blogTouchX.current = e.touches[0].clientX;
    setBlogCarouselPaused(true);
    if (blogTrackRef.current) blogTrackRef.current.style.transition = "none";
  };
  const blogTouchMove = e => {
    if (blogTouchX.current === null) return;
    const dx = e.touches[0].clientX - blogTouchX.current;
    if (blogTrackRef.current) {
      blogTrackRef.current.style.transform =
        `translateX(calc(-${blogIndexRef.current * 100}% + ${dx}px))`;
    }
  };
  const blogTouchEnd = e => {
    if (blogTouchX.current === null) return;
    const dx = e.changedTouches[0].clientX - blogTouchX.current;
    if (blogTrackRef.current) blogTrackRef.current.style.transition = "";
    if (dx < -30) blogNextSlide();
    else if (dx > 30) blogPrevSlide();
    else if (blogTrackRef.current) {
      blogTrackRef.current.style.transform =
        `translateX(-${blogIndexRef.current * 100}%)`;
    }
    blogTouchX.current = null;
    setBlogCarouselPaused(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCarouselIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    if (carouselPaused) return;
    const timer = setInterval(() => {
      setCarouselIndex(i => (i >= maxIndex ? 0 : i + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [maxIndex, carouselPaused]);

  useEffect(() => {
    if (blogCarouselPaused) return;
    const timer = setInterval(() => {
      setBlogCarouselIndex(i => (i >= blogMaxIndex ? 0 : i + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [blogMaxIndex, blogCarouselPaused]);

  const handleSubmit = async (e) => {
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
  };

  return (
    <>
      <style>{css}</style>

      {/* WhatsApp FAB */}
      <a href="https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!" className="whatsapp-fab" target="_blank" rel="noopener noreferrer" aria-label="Fale conosco pelo WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
      <span className="whatsapp-fab-label">Fale conosco</span>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        transition: "box-shadow 0.3s"
      }}>
        <a href="#home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ISF_SolucoesEmSeguranca_Logo.png"
            alt="ISF Segurança Eletrônica"
            style={{ height: 58, width: "auto", objectFit: "contain" }}
          />
        </a>

        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(l => <a key={l.label} href={l.href} className="nav-link">{l.label}</a>)}
          {/* Social icons */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: -8 }}>
            <a href="https://www.facebook.com/isfsegurancaeletronica" target="_blank" rel="noopener noreferrer" className="nav-social-icon" aria-label="Facebook" style={{ color: "#b0b7c3", display: "flex", alignItems: "center", transition: "color 0.2s" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/isfsolucoesemseguranca/" target="_blank" rel="noopener noreferrer" className="nav-social-icon" aria-label="Instagram" style={{ color: "#b0b7c3", display: "flex", alignItems: "center", transition: "color 0.2s" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <a href="#contato" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.82rem" }}>Orçamento Grátis</a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#32373c", padding: 4 }}
          className="mobile-menu-btn"
          aria-label="Menu"
        >☰</button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, background: "#fff", borderBottom: "1px solid #e5e7eb", zIndex: 99, padding: "16px 5%", display: "flex", flexDirection: "column", gap: 16 }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link" onClick={() => setMobileOpen(false)} style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>{l.label}</a>
          ))}
          <a href="#contato" className="btn-primary" style={{ textAlign: "center", marginTop: 8 }} onClick={() => setMobileOpen(false)}>Orçamento Grátis</a>
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 5% 80px", background: "#fff", position: "relative", overflow: "hidden" }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "45%", background: "#f5f5f5", clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />

        {/* Text Col container */}
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 580, flex: 1, zIndex: 2 }}>
            <div className="section-label fade-up fade-up-1">Desde 1988 · Curitiba e Região Metropolitana</div>
            <h1 className="fade-up fade-up-2" style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#1a1d20", marginBottom: 20 }}>
               Há mais de 35 anos<br />
              <span style={{ color: "#32373c" }}>garantindo a sua</span>{" "}
              <span style={{ borderBottom: "4px solid #126798", paddingBottom: 2 }}>segurança</span>
            </h1>
            <p className="fade-up fade-up-3" style={{ fontSize: "1.05rem", lineHeight: 1.72, color: "#6b7280", marginBottom: 36, maxWidth: 480 }}>
              A necessidade de segurança sempre existiu. É o que move a ISF Soluções em Segurança todos os dias para entregar a melhor proteção ao seu imóvel, família, funcionários e patrimônio.
            </p>
            <div className="fade-up fade-up-4 hero-btns" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contato" className="btn-primary">Solicitar orçamento grátis</a>
              <a href={WA_HREF} className="btn-whatsapp" target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
              <a href="#servicos" className="btn-outline">Conheça os serviços</a>
            </div>
            <div className="fade-up fade-up-4" style={{ marginTop: 40, display: "flex", gap: 28, flexWrap: "wrap" }}>
              {["✔ 35+ anos de experiência", "✔ Revenda autorizada Intelbras", "✔ Monitoramento 24/7"].map(b => (
                <span key={b} style={{ fontSize: "0.82rem", color: "#6b7280" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Animated Composition */}
        <div className="hero-visual fade-up fade-up-3" style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "45%", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }}>

          {/* Animated rings background */}
          <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7, zIndex: 1 }}>
             <div style={{ position: "absolute", width: "clamp(400px, 50vw, 650px)", height: "clamp(400px, 50vw, 650px)", background: "radial-gradient(circle, rgba(18,103,152,0.12) 0%, rgba(18,103,152,0) 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
             <div className="animate-spin-slow" style={{ position: "absolute", width: "clamp(362px, 48.3vw, 665px)", height: "clamp(362px, 48.3vw, 665px)", border: "1px dashed rgba(18,103,152,0.25)", borderRadius: "50%" }} />
             <div className="animate-spin-rev" style={{ position: "absolute", width: "clamp(302px, 36.2vw, 507px)", height: "clamp(302px, 36.2vw, 507px)", border: "1px solid rgba(18,103,152,0.15)", borderRadius: "50%" }} />
             <div className="animate-spin-slow" style={{ position: "absolute", width: "clamp(217px, 26.6vw, 362px)", height: "clamp(217px, 26.6vw, 362px)", border: "1.5px solid rgba(18,103,152,0.2)", borderRadius: "50%", animationDuration: "30s" }} />
          </div>

          {/* Main Camera Image */}
          <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transform: "translateX(5%)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/camera-bullet.png"
              alt="Câmera Bullet Intelbras HDCVI"
              className="animate-float"
              style={{
                width: "clamp(350px, 40vw, 600px)", height: "clamp(350px, 40vw, 600px)",
                objectFit: "contain",
                filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.25)) drop-shadow(0 12px 24px rgba(0,0,0,0.15))",
                animationDuration: "9s"
              }}
            />
          </div>

          {/* Floating Glassmorphism Logo Card (Overlapping Composition) */}
          <div style={{
            position: "absolute", background: "rgba(255, 255, 255, 0.85)", WebkitBackdropFilter: "blur(24px)", backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.9)", padding: "36px 32px", borderRadius: 20,
            boxShadow: "0 24px 60px rgba(18,103,152,0.08), 0 8px 24px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.5)",
            display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3,
            width: "clamp(220px, 20vw, 280px)",
            top: "12%", left: "15%" /* Pushed visibly more to the right over the grey wrapper */
          }}>
            {/* Top border accent line */}
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 3, background: "linear-gradient(90deg, transparent, #126798, transparent)", opacity: 0.8 }} />
            
            {/* Tag */}
            <div style={{ position: "absolute", top: -12, right: -12, background: "#126798", color: "#fff", padding: "4px 14px", borderRadius: 9999, fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.05em", boxShadow: "0 8px 20px rgba(18,103,152,0.3)" }}>
              DESDE 1988
            </div>

            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ISF_SolucoesEmSeguranca_Logo.png"
              alt="ISF Segurança Eletrônica"
              style={{ width: "100%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 10px rgba(18,103,152,0.1))" }}
            />
            
            {/* Bottom details */}
            <div style={{ width: 30, height: 2, background: "#126798", marginTop: 24, borderRadius: 2 }} />
            <div style={{ marginTop: 14, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: "#6b7280", textTransform: "uppercase", textAlign: "center" }}>
              A sua escolha ideal
            </div>
            
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "56px 5%", background: "#32373c" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, maxWidth: 1000, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ textAlign: "center", padding: "20px 16px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
              <div style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 800, color: "#fff" }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: 4, letterSpacing: "0.03em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" style={{ padding: "96px 5%", background: "#f9fafb", backgroundImage: "radial-gradient(rgba(18,103,152,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">Nossos Serviços e Produtos</div>
            <div className="divider" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: "#1a1d20", marginBottom: 12, letterSpacing: "-0.02em" }}>O que a ISF oferece</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>Tecnologia de ponta para todos os perfis de imóvel — do residencial ao corporativo. Atendemos Curitiba e toda a Região Metropolitana.</p>
          </div>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {SERVICES.map(s => (
              <a key={s.title} href={s.href} className="service-card">
                {s.tag && <div className="tag">{s.tag}</div>}
                {!s.tag && <div style={{ height: 32, marginBottom: 0 }} />}
                <div className="icon-box"><Icon d={ICONS[s.icon]} size={22} color="#32373c" /></div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a1d20", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#6b7280", lineHeight: 1.65 }}>{s.desc}</p>
                <span className="service-card-arrow">Saiba mais →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="produtos" style={{ padding: "96px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label">Equipamentos</div>
            <div className="divider" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: "#1a1d20", marginBottom: 12, letterSpacing: "-0.02em" }}>Produtos das melhores marcas</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>Revenda autorizada Intelbras. Trabalhamos também com Paradox, ViaWeb, HikVision e outras referências do setor para garantir máxima qualidade na sua instalação.</p>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs" style={{ justifyContent: "center" }}>
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-tab${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >{cat}</button>
            ))}
          </div>

          {/* Carousel */}
          <div
            className="carousel-outer"
            style={{ padding: "0 24px" }}
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
          >
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide} onMouseDown={() => setCarouselPaused(true)} onMouseUp={() => setCarouselPaused(false)} disabled={carouselIndex === 0} aria-label="Anterior">‹</button>
            <div className="carousel-overflow" onTouchStart={prodTouchStart} onTouchMove={prodTouchMove} onTouchEnd={prodTouchEnd} style={{ touchAction: "pan-y" }}>
              <div
                ref={prodTrackRef}
                className="carousel-track"
                style={{ transform: `translateX(-${carouselIndex * (100 / VISIBLE)}%)` }}
              >
                {filteredProducts.map(p => (
                  <div key={p.id} className="product-card">
                    <a href={`/produtos/${p.slug || p.id}`} className="product-card-inner" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                      <div className="product-img-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} loading="lazy" />
                      </div>
                      <div className="product-info">
                        <span className="product-brand">{p.brand}</span>
                        <div className="product-name">{p.name}</div>
                        <div className="product-cat">{p.category}</div>
                        <div style={{ marginTop: 10, fontSize: "0.72rem", color: "#126798", fontWeight: 700 }}>Ver detalhes →</div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide} onMouseDown={() => setCarouselPaused(true)} onMouseUp={() => setCarouselPaused(false)} disabled={carouselIndex >= maxIndex} aria-label="Próximo">›</button>
          </div>

          {/* Dots */}
          <div className="carousel-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${carouselIndex === i ? " active" : ""}`}
                onClick={() => setCarouselIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Ver todos */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a
              href="/produtos"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#126798", color: "#fff",
                padding: "14px 36px", borderRadius: 9999,
                fontFamily: "inherit", fontWeight: 700, fontSize: "0.92rem",
                textDecoration: "none", transition: "all 0.25s",
                boxShadow: "0 4px 20px rgba(18,103,152,0.28)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0d5280"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#126798"; e.currentTarget.style.transform = "none"; }}
            >
              Ver catálogo completo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="empresa" style={{ padding: "96px 5%", background: "#fff" }}>
        <div className="about-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div className="section-label">Sobre a ISF Segurança</div>
            <div className="divider" />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", marginBottom: 20, lineHeight: 1.2, letterSpacing: "-0.02em" }}>A melhor proteção com quem tem 35 anos de mercado</h2>
            <p style={{ color: "#6b7280", lineHeight: 1.78, marginBottom: 16, fontSize: "0.97rem" }}>A ISF atua no mercado de segurança eletrônica há mais de 35 anos, atendendo Curitiba e Região Metropolitana. Membro da ABESE, a empresa é referência em qualidade e confiabilidade.</p>
            <p style={{ color: "#6b7280", lineHeight: 1.78, marginBottom: 36, fontSize: "0.97rem" }}>Somos revenda autorizada Intelbras e trabalhamos com as principais marcas do setor, com uma equipe técnica certificada e sempre atualizada para oferecer o que há de mais moderno em segurança eletrônica.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contato" className="btn-primary">Fale com um especialista</a>
              <a href={WA_HREF} className="btn-whatsapp" target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "trophy", title: "35+ anos de mercado", desc: "Empresa sólida e experiente, referência em segurança eletrônica em Curitiba desde 1988." },
              { icon: "handshake", title: "Membro da ABESE", desc: "Associação Brasileira das Empresas de Sistemas Eletrônicos de Segurança." },
              { icon: "check", title: "Revenda autorizada Intelbras", desc: "Respeito ao cliente e produtos originais com garantia de fábrica." },
              { icon: "pin", title: "Curitiba e Região Metropolitana", desc: "Atendimento local com rapidez e equipe técnica própria treinada." },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 20px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}><Icon d={ICONS[item.icon]} size={20} color="#126798" /></div>
                <div>
                  <div style={{ fontWeight: 700, color: "#1a1d20", fontSize: "0.9rem", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: "0.83rem", color: "#6b7280", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE APP HIGHLIGHT */}
      <section style={{ padding: "80px 5%", background: "#f9fafb", borderTop: "1px solid #e5e7eb", backgroundImage: "radial-gradient(rgba(18,103,152,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><Icon d={ICONS.smartphone} size={44} color="#126798" /></div>
          <div className="section-label" style={{ textAlign: "center" }}>Controle na palma da mão</div>
          <div className="divider" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "#1a1d20", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Já imaginou ligar seu alarme do seu celular?
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75, maxWidth: 600, margin: "0 auto 32px" }}>
            Em um clique você pode acessar pelo seu smartphone todas as câmeras do seu patrimônio, armar e desarmar seu alarme e receber notificações em tempo real — não importa onde estiver, basta estar conectado à internet.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "bell", label: "Notificações em tempo real" },
              { icon: "monitor", label: "Câmeras ao vivo" },
              { icon: "lock", label: "Arme e desarme remotamente" },
              { icon: "smartphone", label: "Acesso de qualquer lugar" },
            ].map(f => (
              <span key={f.label} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.82rem", color: "#32373c", fontWeight: 600, background: "#fff", border: "1px solid #e5e7eb", padding: "8px 16px", borderRadius: 9999 }}>
                <Icon d={ICONS[f.icon]} size={14} color="#6b7280" />{f.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "72px 5%", background: "#32373c" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>A melhor proteção e segurança com quem tem 35 anos de mercado.</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", marginBottom: 32 }}>Entre em contato e receba um orçamento personalizado sem compromisso. Atendemos Curitiba e Região Metropolitana.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contato" className="btn-primary" style={{ background: "#fff", color: "#126798" }}>Solicitar Orçamento</a>
            <a href={WA_HREF} className="btn-whatsapp" target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
            <a href="tel:4133787933" className="btn-outline-white">(41) 3378-7933</a>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" style={{ padding: "96px 5%", background: "#f9fafb", backgroundImage: "radial-gradient(rgba(18,103,152,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div className="section-label">Blog & Conteúdo</div>
            <div className="divider" />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>Dicas de segurança</h2>
          </div>
          {/* Blog Carousel */}
          <div
            className="carousel-outer"
            style={{ padding: "0 24px" }}
            onMouseEnter={() => setBlogCarouselPaused(true)}
            onMouseLeave={() => setBlogCarouselPaused(false)}
          >
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={blogPrevSlide}
              onMouseDown={() => setBlogCarouselPaused(true)}
              onMouseUp={() => setBlogCarouselPaused(false)}
              disabled={blogCarouselIndex === 0}
              aria-label="Anterior"
            >‹</button>
            <div className="carousel-overflow" onTouchStart={blogTouchStart} onTouchMove={blogTouchMove} onTouchEnd={blogTouchEnd} style={{ touchAction: "pan-y" }}>
              <div
                ref={blogTrackRef}
                className="carousel-track"
                style={{ transform: `translateX(-${blogCarouselIndex * 100}%)` }}
              >
                {blogPosts.map(post => (
                  <div key={post.id} className="blog-card-slide">
                    <a href={`/blog/${post.slug || post.id}`} className="blog-card" style={{ padding: 0, overflow: "hidden" }}>
                      {post.coverImage && (
                        <div style={{ width: "100%", height: 160, overflow: "hidden", flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.coverImage} alt={post.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          />
                        </div>
                      )}
                      <div style={{ padding: "20px 22px 22px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                          <span style={{ fontSize: "0.72rem", color: "#32373c", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{post.date}</span>
                          <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>⏱ {post.readTime}</span>
                        </div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1d20", lineHeight: 1.45, marginBottom: 10 }}>{post.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.62, marginBottom: 18 }}>{post.excerpt}</p>
                        <span style={{ fontSize: "0.82rem", color: "#126798", fontWeight: 600 }}>Ler artigo →</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="carousel-btn carousel-btn-next"
              onClick={blogNextSlide}
              onMouseDown={() => setBlogCarouselPaused(true)}
              onMouseUp={() => setBlogCarouselPaused(false)}
              disabled={blogCarouselIndex >= blogMaxIndex}
              aria-label="Próximo"
            >›</button>
          </div>
          {/* Dots */}
          <div className="carousel-dots">
            {Array.from({ length: blogMaxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${blogCarouselIndex === i ? " active" : ""}`}
                onClick={() => setBlogCarouselIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Ver todos os posts */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a
              href="/blog"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#126798", color: "#fff",
                padding: "14px 36px", borderRadius: 9999,
                fontFamily: "inherit", fontWeight: 700, fontSize: "0.92rem",
                textDecoration: "none", transition: "all 0.25s",
                boxShadow: "0 4px 20px rgba(18,103,152,0.28)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0d5280"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#126798"; e.currentTarget.style.transform = "none"; }}
            >
              Ver todos os artigos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "96px 5% 0", background: "#fff", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label">O que dizem sobre nós</div>
            <div className="divider" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>Avaliações de Clientes</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 520, margin: "12px auto 0" }}>A satisfação e proteção de nossos clientes são a nossa maior prioridade.</p>
          </div>
          <div style={{ width: "100%", overflow: "hidden", paddingTop: 16 }}>
            <GoogleReviewsWidget />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "80px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label">Dúvidas Frequentes</div>
            <div className="divider" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>Perguntas frequentes</h2>
          </div>
          <div>
            {FAQS.map(faq => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 16 }}>Ainda tem dúvidas? Fale diretamente com nossa equipe.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#contato" className="btn-primary">Solicitar orçamento grátis</a>
              <a href={WA_HREF} className="btn-whatsapp" target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contato" style={{ padding: "96px 5%", background: "#f9fafb", backgroundImage: "radial-gradient(rgba(18,103,152,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">Fale Conosco</div>
            <div className="divider" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em", marginBottom: 10 }}>Solicite seu orçamento grátis</h2>
            <p style={{ color: "#6b7280", fontSize: "0.97rem" }}>Atendemos Curitiba e Região Metropolitana. Entre em contato e receba um orçamento sem compromisso.</p>
          </div>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "phone", label: "Telefone", val: "(41) 3378-7933" },
                { icon: "chat", label: "WhatsApp", val: "(41) 99991-9191" },
                { icon: "pin", label: "Endereço", val: "R. Omar Dutra, 52 — São Lourenço, Curitiba-PR" },
                { icon: "clock", label: "Horário de atendimento", val: "Segunda a sexta: 8h30 – 18h00" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}><Icon d={ICONS[item.icon]} size={18} color="#6b7280" /></div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ color: "#1a1d20", fontSize: "0.9rem", fontWeight: 500 }}>{item.val}</div>
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
                    <input className="form-input" placeholder="Nome completo" required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} />
                    <input className="form-input" placeholder="E-mail" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <input className="form-input" placeholder="Telefone / WhatsApp" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} />
                  <select className="form-input" value={formData.servico} onChange={e => setFormData({ ...formData, servico: e.target.value })}>
                    <option value="">Serviço de interesse</option>
                    <option>Alarmes</option>
                    <option>Câmeras CFTV</option>
                    <option>Monitoramento</option>
                    <option>Cerca Elétrica</option>
                    <option>Controle de Acesso</option>
                    <option>Outros</option>
                  </select>
                  <textarea className="form-input" placeholder="Descreva brevemente sua necessidade..." rows={4} style={{ resize: "none" }} value={formData.mensagem} onChange={e => setFormData({ ...formData, mensagem: e.target.value })} />
                  <button type="submit" className="btn-primary" disabled={formSending} style={{ width: "100%", textAlign: "center", borderRadius: 8, opacity: formSending ? 0.7 : 1 }}>
                    {formSending ? "Enviando…" : "Enviar Mensagem"}
                  </button>
                  {formError && <p style={{ fontSize: "0.82rem", color: "#dc2626", textAlign: "center", margin: 0 }}>{formError}</p>}
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>Seus dados estão seguros. Nunca enviamos spam.</p>
                </form>
              )}
            </div>
          </div>

          {/* MAPA */}
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

      {/* FOOTER */}
      <footer style={{ padding: "48px 5% 32px", background: "#1a1d20", borderTop: "1px solid #2d3137" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 36 }}>
            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ISF_SolucoesEmSeguranca_Logo.png"
                alt="ISF Segurança Eletrônica"
                style={{ height: 36, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 14 }}
              />
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                Segurança eletrônica em Curitiba e Região Metropolitana há mais de 35 anos.
              </p>
            </div>
            {/* Links */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Navegação</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[{ label: "Home", href: "#home" }, { label: "Serviços", href: "#servicos" }, { label: "Produtos", href: "#produtos" }, { label: "Empresa", href: "#empresa" }, { label: "Blog", href: "#blog" }, { label: "Contato", href: "#contato" }].map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
                  >{l.label}</a>
                ))}
              </div>
            </div>
            {/* Contact */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Contato</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="tel:4133787933" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>(41) 3378-7933</a>
                <a href="https://api.whatsapp.com/send?phone=554133787933" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>WhatsApp (41) 99991-9191</a>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>Seg–Sex: 8h30–18h00</span>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>R. Omar Dutra, 52 — Curitiba, PR</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #2d3137", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>© 2025 ISF Soluções em Segurança · Todos os direitos reservados</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>CNPJ registrado · Curitiba, PR</div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://www.facebook.com/isfsegurancaeletronica" target="_blank" rel="noopener noreferrer" aria-label="Facebook ISF" style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s", display: "flex" }}
                  onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.75)"}
                  onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.35)"}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/isfsolucoesemseguranca/" target="_blank" rel="noopener noreferrer" aria-label="Instagram ISF" style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s", display: "flex" }}
                  onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.75)"}
                  onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.35)"}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
