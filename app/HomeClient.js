"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "./home-critical.module.css";

const GoogleReviewsWidget = dynamic(() => import("./components/GoogleReviewsWidget"), { ssr: false });
const HomeProductsSection = dynamic(() => import("./components/home/HomeProductsSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="produtos" minHeight={720} />,
});
const HomeBlogSection = dynamic(() => import("./components/home/HomeBlogSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="blog" minHeight={640} background="#f9fafb" />,
});
const HomeFaqSection = dynamic(() => import("./components/home/HomeFaqSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="faq" minHeight={520} />,
});
const HomeContactSection = dynamic(() => import("./components/home/HomeContactSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="contato" minHeight={840} background="#f9fafb" />,
});

function LazySection({ children, id, minHeight, background = "#fff" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}>
      {visible ? children : <SectionPlaceholder id={id} minHeight={minHeight} background={background} />}
    </div>
  );
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Empresa", href: "#empresa" },
  { label: "Serviços", href: "#servicos" },
  { label: "Produtos", href: "#produtos" },
  { label: "Blog", href: "#blog" },
  { label: "Contato", href: "#contato" },
];

const SERVICES = [
  { icon: "alarm",      title: "Alarmes",           desc: "Garanta proteção 24 horas para o seu patrimônio, uma medida de segurança que traz tranquilidade. Oferecemos soluções com e sem fio.",                                          tag: "Mais popular", href: "/alarmes-curitiba/" },
  { icon: "camera",     title: "Câmeras CFTV",       desc: "Instalação de câmeras HD, zoom, infravermelho, auto-íris ou imagem noturna. Trabalhamos com várias marcas para atender a sua necessidade.",                                    tag: null,           href: "/cameras-seguranca-curitiba/" },
  { icon: "bolt",       title: "Cerca Elétrica",     desc: "Proteção perimetral com choque e alarme sonoro integrado. Solução de alto impacto para imóveis residenciais e comerciais.",                                                    tag: null,           href: "/cerca-eletrica-curitiba/" },
  { icon: "lock",       title: "Controle de Acesso", desc: "Leitores biométricos, cartão de proximidade e reconhecimento facial. Ideal para condomínios e áreas restritas.",                                                         tag: null,           href: "/controle-de-acesso-curitiba/" },
  { icon: "shield",     title: "Monitoramento",      desc: "Conte com uma equipe 24 horas dedicada ao monitoramento do seu patrimônio. A ISF trabalha em parceria com as melhores empresas do ramo.",                                      tag: null,           href: "/monitoramento-curitiba/" },
  { icon: "monitor",    title: "Vídeo Monitoramento", desc: "Câmeras com inteligência artificial que detectam invasões e comportamentos suspeitos, alertando automaticamente a central de monitoramento 24h.",                              tag: "Tecnologia",   href: "/video-monitoramento-curitiba/" },
  { icon: "smartphone", title: "App de Segurança",   desc: "Em um clique acesse pelo seu smartphone todas as câmeras do seu patrimônio, não importa onde estiver, basta estar conectado à internet.",                                      tag: "Comodidade",   href: "/app-de-seguranca/" },
];

const STATS = [
  { value: "35",    suffix: "+", label: "Anos no mercado" },
  { value: "30000", suffix: "+", label: "Atendimentos realizados" },
  { value: "5000",  suffix: "+", label: "Clientes ativos" },
  { value: "300",   suffix: "+", label: "Produtos no catálogo" },
];

const CLIENT_LOGOS_ROW1 = [
  { src: "/logos-clientes/Polícia Federal do Paraná.png", alt: "Polícia Federal do Paraná", w: 120, h: 58 },
  { src: "/logos-clientes/UFPR.jpg", alt: "Universidade Federal do Paraná (UFPR)", w: 80, h: 48 },
  { src: "/logos-clientes/Paraná Banco.png", alt: "Paraná Banco", w: 120, h: 58 },
  { src: "/logos-clientes/Glomb Advogados.png", alt: "Glomb & Advogados Associados", w: 140, h: 56, borderRadius: 14 },
  { src: "/logos-clientes/Hospital Pietà.png", alt: "Hospital Pietà", w: 140, h: 48 },
  { src: "/logos-clientes/Baggio-Pizzaria-e-Focacceria.webp", alt: "Baggio Pizzaria e Focacceria", w: 120, h: 48 },
  { src: "/logos-clientes/ICAB.jpg", alt: "ICAB Chocolates", w: 100, h: 64 },
  { src: "/logos-clientes/Escola Lápis de Cor.png", alt: "Escola Lápis de Cor", w: 120, h: 48 },
  { src: "/logos-clientes/sempr.jpg", alt: "SEMPR", w: 100, h: 64, borderRadius: 14 },
];
const CLIENT_LOGOS_ROW2 = [
  { src: "/logos-clientes/Ruth Graf.png", alt: "Dra. Ruth Graf Cirurgia Plástica", w: 120, h: 68, padding: 6, borderRadius: 14 },
  { src: "/logos-clientes/Aquecebem.png", alt: "Aquecebem", w: 140, h: 48 },
  { src: "/logos-clientes/Dermo Ervas.png", alt: "Dermo Ervas", w: 140, h: 48 },
  { src: "/logos-clientes/Icaro.jpg", alt: "Condomínio Ícaro Jardins do Graciosa", w: 100, h: 48 },
  { src: "/logos-clientes/Daniele Pace.png", alt: "Daniele Pace", w: 140, h: 48 },
  { src: "/logos-clientes/Piegel Pàes.png", alt: "Piegel Pães", w: 120, h: 68, padding: 6, borderRadius: 14 },
  { src: "/logos-clientes/Paulo Baggio.avif", alt: "Consultório Dr. Paulo Baggio", w: 140, h: 60 },
  { src: "/logos-clientes/Rose Petenucci.png", alt: "Rose Petenucci", w: 140, h: 48 },
];

const PRODUCT_CATEGORIES = ["Todos", "Câmeras", "DVR / NVR", "Alarmes", "Cerca Elétrica", "Controle de Acesso"];
const VISIBLE = 3;
const BLOG_VISIBLE = 3;

const HERO_SLIDES = [
  {
    src: "/hero-slide-1-v2.png",
    mobileSrc: "/mobile-slide-1.png",
    alt: "Técnico Autorizado ISF realizando instalação de sistema de segurança",
    caption: "Instalação profissional por técnicos autorizados",
    objectPosition: "50% 5%",
  },
  {
    src: "/hero-slide-2.png",
    mobileSrc: "/mobile-slide-2.png",
    alt: "Monitore seu imóvel de qualquer lugar pelo tablet",
    caption: "Acesse suas câmeras de onde estiver",
    objectPosition: "center",
  },
  {
    src: "/hero-slide-3.png",
    mobileSrc: "/mobile-slide-3.png",
    alt: "App de alarme residencial Intelbras no celular",
    caption: "Controle total na palma da mão",
    objectPosition: "center",
  },
  {
    src: "/hero-slide-4-v3.png",
    mobileSrc: "/mobile-slide-4.png",
    alt: "Sistema de câmeras de segurança ISF em ambiente residencial",
    caption: "Proteção completa para sua residência",
    objectPosition: "right center",
  },
  {
    src: "/hero-slide-5-v5.png",
    mobileSrc: "/mobile-slide-5.png",
    alt: "Central de monitoramento ISF com múltiplas câmeras",
    caption: "Monitoramento 24 horas com tecnologia de ponta",
    objectPosition: "right center",
  },
  {
    src: "/hero-slide-6.jpg",
    mobileSrc: "/mobile-slide-6.jpg",
    alt: "Equipe técnica ISF em atendimento ao cliente",
    caption: "Atendimento especializado em Curitiba e região",
    objectPosition: "center",
  },
];

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
    a: "Sim, somos revenda autorizada Intelbras e trabalhamos com produtos originais com garantia de fábrica. Também trabalhamos com outras marcas referência como Hikvision, Paradox, Viaweb, JFL e outras.",
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

function heroImgUrl(src, width) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

function HeroSlider() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const touchX = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(p => (p + 1) % HERO_SLIDES.length);
    }, 8000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (i) => {
    setActive(i);
    startTimer();
  };

  const handleTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -50) go((active + 1) % HERO_SLIDES.length);
    else if (dx > 50) go((active - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    touchX.current = null;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {HERO_SLIDES.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          inset: 0,
          opacity: i === active ? 1 : 0,
          transition: "opacity 0.9s ease",
          zIndex: i === active ? 1 : 0,
        }}>
          <picture style={{ display: "block", width: "100%", height: "100%" }}>
            {s.mobileSrc && (
              <source
                media="(max-width: 768px)"
                srcSet={`${heroImgUrl(s.mobileSrc, 828)} 828w, ${heroImgUrl(s.mobileSrc, 1080)} 1080w`}
                sizes="100vw"
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImgUrl(s.src, 1920)}
              srcSet={`${heroImgUrl(s.src, 1200)} 1200w, ${heroImgUrl(s.src, 1920)} 1920w`}
              sizes="100vw"
              alt={s.alt}
              className={styles['hero-slide-img']}
              fetchPriority={i === 0 ? "high" : undefined}
              decoding={i === 0 ? "auto" : "async"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: s.objectPosition || "center",
              }}
            />
          </picture>
        </div>
      ))}
      <div className={styles['hero-dots-mobile']} style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 3,
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? "#fff" : "rgba(255,255,255,0.45)",
              border: "none",
              cursor: "pointer",
              padding: "10px 0",
              boxSizing: "content-box",
              backgroundClip: "content-box",
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SectionPlaceholder({ id, minHeight, background = "#fff" }) {
  return <section id={id} style={{ minHeight, background }} />;
}



export default function HomeClient({ initialProducts, initialBlogPosts }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      <main>
      {/* WhatsApp FAB */}
      <a href="https://api.whatsapp.com/send?phone=554133787933&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!" className={styles['whatsapp-fab']} target="_blank" rel="noopener noreferrer" aria-label="Fale conosco pelo WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
      <span className={styles['whatsapp-fab-label']}>Fale conosco</span>

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
            src="https://isf.com.br/ISF_SolucoesEmSeguranca_Logo.png"
            alt="ISF Segurança Eletrônica"
            width={180}
            height={58}
            fetchPriority="high"
            style={{ height: 58, width: "auto", objectFit: "contain" }}
          />
        </a>

        <div className={styles['desktop-nav']} style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(l => <a key={l.label} href={l.href} className={styles['nav-link']}>{l.label}</a>)}
          {/* Social icons */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: -8 }}>
            <a href="https://www.facebook.com/isfsegurancaeletronica" target="_blank" rel="noopener noreferrer" className={styles['nav-social-icon']} aria-label="Facebook" style={{ color: "#b0b7c3", display: "flex", alignItems: "center", transition: "color 0.2s" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/isfsolucoesemseguranca/" target="_blank" rel="noopener noreferrer" className={styles['nav-social-icon']} aria-label="Instagram" style={{ color: "#b0b7c3", display: "flex", alignItems: "center", transition: "color 0.2s" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <a href="#contato" className={styles['btn-primary']} style={{ padding: "10px 22px", fontSize: "0.82rem" }}>Orçamento Grátis</a>
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
            <a key={l.label} href={l.href} className={styles['nav-link']} onClick={() => setMobileOpen(false)} style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>{l.label}</a>
          ))}
          <a href="#contato" className={styles['btn-primary']} style={{ textAlign: "center", marginTop: 8 }} onClick={() => setMobileOpen(false)}>Orçamento Grátis</a>
        </div>
      )}

      {/* HERO */}
      <section id="home" className={styles['hero-section']}>
        {/* Slider + overlay wrapper */}
        <div className={styles['hero-slider-wrap']}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <HeroSlider />
          </div>
          <div className={styles['hero-overlay']} />
          {/* Mobile-only: título sobreposto no topo da imagem */}
          <div className={styles['hero-title-wrap']} aria-hidden="true">
            <div className={styles['hero-supertitle']} style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", marginBottom: 8 }}>Desde 1988 · Curitiba e Região Metropolitana</div>
            <div className={styles['hero-title']} style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#fff" }}>
              Há mais de 35 anos<br />
              garantindo a sua{" "}
              <span style={{ borderBottom: "4px solid #126798", paddingBottom: 2 }}>segurança</span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className={styles['hero-content']}>
          <div style={{ maxWidth: 620 }}>
            <div className={`${styles['fade-up']} ${styles['fade-up-1']} ${styles['hero-supertitle']} ${styles['hero-desktop-only']}`} style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", marginBottom: 16 }}>Desde 1988 · Curitiba e Região Metropolitana</div>
            <h1 className={`${styles['fade-up']} ${styles['fade-up-2']} ${styles['hero-title']} ${styles['hero-desktop-only']}`} style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#fff", marginBottom: 24 }}>
              Há mais de 35 anos<br />
              garantindo a sua{" "}
              <span style={{ borderBottom: "4px solid #126798", paddingBottom: 2 }}>segurança</span>
            </h1>
            <p className={`${styles['fade-up']} ${styles['fade-up-3']} ${styles['hero-desc']}`} style={{ fontSize: "1.12rem", lineHeight: 1.78, color: "rgba(255,255,255,0.82)", marginBottom: 40, maxWidth: 540 }}>
              A necessidade de segurança sempre existiu. É o que move a ISF Soluções em Segurança todos os dias para entregar a melhor proteção ao seu imóvel, família, funcionários e patrimônio.
            </p>
            <div className={`${styles['fade-up']} ${styles['fade-up-4']} ${styles['hero-btns']}`} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contato" className={styles['btn-primary']}>Solicitar orçamento grátis</a>
              <a href={WA_HREF} className={styles['btn-whatsapp']} target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
              <a href="#servicos" className={styles['btn-outline-white']}>Conheça os serviços</a>
            </div>
            <div className={`${styles['fade-up']} ${styles['fade-up-4']}`} style={{ marginTop: 40, display: "flex", gap: 28, flexWrap: "wrap" }}>
              {["✔ 35+ anos de experiência", "✔ Revenda autorizada Intelbras", "✔ Monitoramento 24/7"].map(b => (
                <span key={b} className={styles['hero-badge-text']} style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "56px 5%", background: "#32373c" }}>
        <div className={styles['stats-grid']} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, maxWidth: 1000, margin: "0 auto" }}>
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

      {/* REVIEWS */}
      <section style={{ padding: "80px 5% 24px", background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className={styles['section-label']}>O que dizem sobre nós</div>
            <div className={styles['divider']} style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>Avaliações de Clientes</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 520, margin: "12px auto 0" }}>A satisfação e proteção de nossos clientes são a nossa maior prioridade.</p>
          </div>
          <LazySection id="reviews-lazy" minHeight={200} background="#f9fafb">
            <div style={{ width: "100%", overflow: "hidden", paddingTop: 16 }}>
              <GoogleReviewsWidget />
            </div>
          </LazySection>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" style={{ padding: "96px 5%", background: "#f9fafb", backgroundImage: "radial-gradient(rgba(18,103,152,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className={styles['section-label']}>Nossos Serviços e Produtos</div>
            <div className={styles['divider']} style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: "#1a1d20", marginBottom: 12, letterSpacing: "-0.02em" }}>O que a ISF oferece</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>Tecnologia de ponta para todos os perfis de imóvel — do residencial ao corporativo. Atendemos Curitiba e toda a Região Metropolitana.</p>
          </div>
          <div className={styles['services-grid']} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {SERVICES.map(s => (
              <a key={s.title} href={s.href} className={styles['service-card']}>
                {s.tag && <div className={styles['tag']}>{s.tag}</div>}
                {!s.tag && <div style={{ height: 32, marginBottom: 0 }} />}
                <div className={styles['icon-box']}><Icon d={ICONS[s.icon]} size={22} color="#32373c" /></div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a1d20", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#6b7280", lineHeight: 1.65 }}>{s.desc}</p>
                <span className={styles['service-card-arrow']}>Saiba mais →</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* PRODUCTS */}
      <LazySection id="produtos" minHeight={720}>
        <HomeProductsSection products={initialProducts} />
      </LazySection>

      {/* ABOUT */}
      <section id="empresa" style={{ padding: "96px 5%", background: "#fff" }}>
        <div className={styles['about-grid']} style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div className={styles['section-label']}>Sobre a ISF Segurança</div>
            <div className={styles['divider']} />
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", marginBottom: 20, lineHeight: 1.2, letterSpacing: "-0.02em" }}>A melhor proteção com quem tem 35 anos de mercado</h2>
            <p style={{ color: "#6b7280", lineHeight: 1.78, marginBottom: 16, fontSize: "0.97rem" }}>A ISF atua no mercado de segurança eletrônica há mais de 35 anos, atendendo Curitiba e Região Metropolitana. Membro da ABESE, a empresa é referência em qualidade e confiabilidade.</p>
            <p style={{ color: "#6b7280", lineHeight: 1.78, marginBottom: 36, fontSize: "0.97rem" }}>Somos revenda autorizada Intelbras e trabalhamos com as principais marcas do setor, com uma equipe técnica certificada e sempre atualizada para oferecer o que há de mais moderno em segurança eletrônica.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contato" className={styles['btn-primary']}>Fale com um especialista</a>
              <a href={WA_HREF} className={styles['btn-whatsapp']} target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
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
          <div className={styles['section-label']} style={{ textAlign: "center" }}>Controle na palma da mão</div>
          <div className={styles['divider']} style={{ margin: "0 auto 20px" }} />
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
            <a href="#contato" className={styles['btn-primary']} style={{ background: "#fff", color: "#126798" }}>Solicitar Orçamento</a>
            <a href={WA_HREF} className={styles['btn-whatsapp']} target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
            <a href="tel:4133787933" className={styles['btn-outline-white']}>(41) 3378-7933</a>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{ padding: "80px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", marginBottom: 48 }}>
          <div className={styles['section-label']}>Nossos Clientes</div>
          <div className={styles['divider']} />
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>Empresas que confiam na ISF</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className={styles['marquee-container']}>
            <div className={styles['marquee-track']}>
              {[...CLIENT_LOGOS_ROW1, ...CLIENT_LOGOS_ROW1].map((logo, i) => (
                <div key={i} className={styles['marquee-item']}>
                  {logo.borderRadius ? (
                    <span style={{ display: "inline-block", borderRadius: logo.borderRadius, overflow: "hidden", lineHeight: 0, ...(logo.padding && { padding: logo.padding, background: "#fff" }) }}>
                      <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className={styles['marquee-logo']} style={{ height: logo.h, width: logo.w, objectFit: "contain" }} />
                    </span>
                  ) : (
                    <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className={styles['marquee-logo']} style={{ height: logo.h, width: logo.w, objectFit: "contain", ...(logo.padding && { padding: logo.padding }) }} />
                  )}
                  <span className={styles['marquee-name']}>{logo.alt}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles['marquee-container']}>
            <div className={`${styles['marquee-track']} ${styles['marquee-track-reverse']}`}>
              {[...CLIENT_LOGOS_ROW2, ...CLIENT_LOGOS_ROW2].map((logo, i) => (
                <div key={i} className={styles['marquee-item']}>
                  {logo.borderRadius ? (
                    <span style={{ display: "inline-block", borderRadius: logo.borderRadius, overflow: "hidden", lineHeight: 0, ...(logo.padding && { padding: logo.padding, background: "#fff" }) }}>
                      <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className={styles['marquee-logo']} style={{ height: logo.h, width: logo.w, objectFit: "contain" }} />
                    </span>
                  ) : (
                    <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className={styles['marquee-logo']} style={{ height: logo.h, width: logo.w, objectFit: "contain", ...(logo.padding && { padding: logo.padding }) }} />
                  )}
                  <span className={styles['marquee-name']}>{logo.alt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* BLOG */}
      <LazySection id="blog" minHeight={640} background="#f9fafb">
        <HomeBlogSection blogPosts={initialBlogPosts} />
      </LazySection>
      {/* FAQ */}
      <LazySection id="faq" minHeight={520}>
        <HomeFaqSection faqs={FAQS} />
      </LazySection>
      {/* CONTACT */}
      <LazySection id="contato" minHeight={840} background="#f9fafb">
        <HomeContactSection />
      </LazySection>

      {/* FOOTER */}
      <footer style={{ padding: "48px 5% 32px", background: "#1a1d20", borderTop: "1px solid #2d3137" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 36 }}>
            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://isf.com.br/ISF_SolucoesEmSeguranca_Logo.png"
                alt="ISF Segurança Eletrônica"
                width={112}
                height={36}
                style={{ height: 36, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 14 }}
              />
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.65 }}>
                Segurança eletrônica em Curitiba e Região Metropolitana há mais de 35 anos.
              </p>
            </div>
            {/* Links */}
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>Navegação</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[{ label: "Home", href: "#home" }, { label: "Serviços", href: "#servicos" }, { label: "Produtos", href: "#produtos" }, { label: "Empresa", href: "#empresa" }, { label: "Blog", href: "#blog" }, { label: "Contato", href: "#contato" }].map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.72)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.72)"}
                  >{l.label}</a>
                ))}
              </div>
            </div>
            {/* Contact */}
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>Contato</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="tel:4133787933" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>(41) 3378-7933</a>
                <a href="https://api.whatsapp.com/send?phone=554133787933" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>WhatsApp (41) 99991-9191</a>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>Seg–Sex: 8h30–18h00</span>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>R. Omar Dutra, 52 — Curitiba, PR</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #2d3137", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.68)" }}>© 2025 ISF Soluções em Segurança · Todos os direitos reservados</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.68)" }}>CNPJ registrado · Curitiba, PR</div>
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
      </main>
    </>
  );
}

