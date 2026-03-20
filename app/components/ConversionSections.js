"use client";
import { useState } from "react";

const WA_HREF =
  "https://api.whatsapp.com/send?phone=5541999919191&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!";

// ── Icon helpers ──────────────────────────────────────────────────────────────

const PATHS = {
  badge:      "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  wrench:     "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  pin:        "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
  shield:     "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  coin:       "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  users:      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  alarm:      "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  camera:     "M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  bolt:       "M13 10V3L4 14h7v7l9-11h-7z",
  lock:       "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  smartphone: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
};

function Icon({ name, size = 22, stroke = "#126798" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d={PATHS[name]} />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"
      style={{ display: "block", flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "35+",     label: "Anos no mercado" },
  { value: "30.000+", label: "Atendimentos realizados" },
  { value: "5.000+",  label: "Clientes ativos" },
  { value: "24/7",    label: "Monitoramento disponível" },
];

const ISF_BENEFITS = [
  { icon: "badge",  title: "Revendedor Autorizado Intelbras",    desc: "Produtos originais com garantia de fábrica e suporte técnico especializado." },
  { icon: "wrench", title: "Instalação Profissional",            desc: "Equipe técnica certificada realiza a instalação e configuração completa no local." },
  { icon: "pin",    title: "Curitiba e Região Metropolitana",    desc: "35+ anos atendendo toda a RMC: São José dos Pinhais, Colombo, Pinhais e mais." },
  { icon: "shield", title: "Suporte Pós-Venda",                 desc: "Assistência técnica disponível e contratos de manutenção preventiva." },
  { icon: "coin",   title: "Orçamento 100% Gratuito",           desc: "Visita técnica ao local, sem compromisso. Respondemos em até 2 horas." },
  { icon: "users",  title: "5.000+ Clientes Ativos",            desc: "Empresa sólida com histórico comprovado de qualidade e confiança desde 1988." },
];

const CATEGORY_FAQS = {
  "Câmeras": [
    { q: "Câmera IP ou analógica: qual escolher?",           a: "Câmeras IP oferecem maior resolução, acesso remoto facilitado e flexibilidade de cabeamento. Câmeras analógicas (HDCVI/AHD) são mais econômicas e ideais para projetos com cabeamento existente. Nossa equipe avalia o cenário e recomenda a melhor tecnologia para cada caso." },
    { q: "As câmeras funcionam à noite?",                    a: "Sim. As câmeras modernas contam com infravermelho (IR) para imagens em preto e branco no escuro, e tecnologias como Dual Light ou Color Night Vision para imagens coloridas mesmo sem iluminação. A indicação depende do ambiente." },
    { q: "Consigo acessar as câmeras pelo celular?",         a: "Sim. Todos os sistemas instalados pela ISF permitem visualização ao vivo e acesso às gravações pelo smartphone, de qualquer lugar com internet. Configuramos o acesso remoto como parte da instalação." },
    { q: "Preciso de internet para as câmeras funcionarem?", a: "Não. As câmeras e o gravador funcionam em rede local independentemente da internet. A conexão à internet é necessária apenas para acesso remoto pelo celular ou por computador externo." },
  ],
  "DVR / NVR": [
    { q: "Qual a diferença entre DVR e NVR?",             a: "DVR é usado com câmeras analógicas (HDCVI, AHD, TVI). NVR é usado com câmeras IP. A ISF trabalha com ambas as tecnologias e indica a mais adequada para cada projeto." },
    { q: "Quantos dias de gravação ficam armazenados?",   a: "Depende da capacidade do HD, do número de câmeras e da resolução configurada. Em geral, projetos residenciais armazenam de 15 a 30 dias. Sistemas comerciais com mais câmeras usam HDs de maior capacidade ou gravação em nuvem." },
    { q: "Posso expandir o armazenamento depois?",        a: "Sim. A maioria dos gravadores suporta substituição do HD por um de maior capacidade, ou adição de HDs extras conforme o modelo. A ISF orienta sobre a melhor opção para cada equipamento." },
    { q: "O gravador funciona se a internet cair?",       a: "Sim. O gravador continua operando normalmente em rede local — as câmeras continuam gravando. A internet é necessária apenas para acesso remoto pelo celular." },
  ],
  "Alarmes": [
    { q: "Qual a diferença entre alarme com e sem monitoramento?",  a: "Um alarme sem monitoramento dispara a sirene e notifica você pelo celular, mas depende de ação própria. Com monitoramento profissional, uma central 24h recebe o alerta, verifica a situação e aciona as autoridades — muito mais eficaz." },
    { q: "O alarme dispara com animais domésticos?",                a: "Com sensores de dupla tecnologia (PIR + micro-ondas) ou configuração de imunidade a pets, o sistema evita falsos disparos por animais de pequeno e médio porte. A ISF especifica o sensor adequado para cada ambiente." },
    { q: "O que acontece quando o alarme dispara de madrugada?",    a: "Além da sirene no local, o sistema envia alertas pelo app para o responsável. Com monitoramento, a central 24h é acionada automaticamente e toma as medidas necessárias conforme o protocolo contratado." },
    { q: "Preciso de linha telefônica para o alarme funcionar?",    a: "Não. Os sistemas modernos usam comunicação por IP (internet) ou GSM (rede celular) como backup, eliminando a dependência de linha telefônica fixa." },
  ],
  "Cerca Elétrica": [
    { q: "Cerca elétrica é perigosa para crianças e animais?",      a: "Quando instalada corretamente e dentro da ABNT NBR IEC 60335-2-76, o pulso elétrico é de alta tensão porém baixíssima corrente. O efeito é um choque doloroso e temporário — não letal. A instalação em altura mínima de 2,5 m do solo também protege crianças e animais." },
    { q: "É legal instalar cerca elétrica em Curitiba?",            a: "Sim, é completamente legal quando instalada por empresa habilitada, em conformidade com as normas técnicas e a legislação municipal. A ISF realiza toda a instalação dentro das normas e emite a documentação necessária." },
    { q: "A cerca funciona normalmente na chuva e na umidade?",     a: "Sim. Os equipamentos e isoladores são projetados para todas as condições climáticas. A eletrônica de controle é protegida contra umidade e variações de temperatura. A manutenção periódica garante o desempenho contínuo." },
    { q: "Com que frequência a cerca precisa de manutenção?",       a: "Recomendamos manutenção semestral ou anual conforme o ambiente. A ISF oferece contratos de manutenção preventiva que garantem o funcionamento contínuo e prolongam a vida útil dos equipamentos." },
  ],
  "Controle de Acesso": [
    { q: "Qual a diferença entre leitor biométrico e reconhecimento facial?", a: "O leitor biométrico identifica pela impressão digital — rápido e confiável. O reconhecimento facial usa câmera e IA para identificação sem contato físico, ideal para alto fluxo ou ambientes onde higiene é prioritária. A ISF trabalha com ambas as tecnologias." },
    { q: "O sistema de controle de acesso funciona sem internet?",             a: "Sim. Leitores e controladoras operam em rede local (LAN) independentemente da internet. A conexão externa é necessária apenas para acesso remoto ao painel de gerenciamento." },
    { q: "É possível integrar controle de acesso com câmeras e alarmes?",      a: "Sim. A integração é justamente o que diferencia um sistema profissional: câmeras registram automaticamente quem passou pelo ponto de acesso, e o alarme pode ser acionado por tentativas de acesso não autorizado." },
    { q: "Consigo monitorar e liberar acesso pelo celular?",                   a: "Sim. Sistemas modernos permitem visualizar logs, liberar ou bloquear usuários e abrir portas remotamente pelo smartphone — com registro completo de todas as movimentações." },
  ],
};

const GENERAL_FAQS = [
  { q: "O orçamento da ISF é realmente gratuito?",              a: "Sim, 100% gratuito e sem compromisso. Nossa equipe realiza uma visita técnica ao local para avaliar as necessidades e apresentar a solução mais adequada para o seu perfil e orçamento." },
  { q: "Quais regiões a ISF atende?",                           a: "Atendemos Curitiba e toda a Região Metropolitana, incluindo São José dos Pinhais, Colombo, Pinhais, Araucária, Campo Largo, Almirante Tamandaré e demais municípios da RMC." },
  { q: "Qual o prazo para instalação após a contratação?",      a: "Em geral, conseguimos agendar a instalação em até 5 dias úteis após a aprovação do orçamento. Projetos mais complexos (indústrias, condomínios) têm prazo específico definido na proposta." },
  { q: "A ISF oferece manutenção após a instalação?",           a: "Sim. Oferecemos contratos de manutenção preventiva para câmeras, alarmes, cercas elétricas e controle de acesso. A manutenção periódica garante o funcionamento contínuo e prolonga a vida útil dos equipamentos." },
  { q: "A ISF é uma empresa autorizada e certificada?",         a: "Sim. Somos revendedor autorizado Intelbras, associados à ABERC desde 1993 e membros da ABESE. Nossa equipe técnica é certificada e constantemente atualizada com as últimas tecnologias do setor." },
];

const SERVICES = [
  { icon: "alarm",      title: "Alarmes",           desc: "Proteção 24h, com e sem fio, para residências e comércios.",        href: "/alarmes-curitiba" },
  { icon: "camera",     title: "Câmeras CFTV",       desc: "Câmeras HD, visão noturna e acesso remoto pelo celular.",           href: "/cameras-seguranca-curitiba" },
  { icon: "bolt",       title: "Cerca Elétrica",     desc: "Proteção perimetral com choque e alarme sonoro integrado.",         href: "/cerca-eletrica-curitiba" },
  { icon: "lock",       title: "Controle de Acesso", desc: "Biometria, reconhecimento facial e cartão.",                       href: "/controle-de-acesso-curitiba" },
  { icon: "shield",     title: "Monitoramento",      desc: "Central de monitoramento 24h com protocolo de resposta imediata.", href: "/monitoramento-curitiba" },
  { icon: "smartphone", title: "App de Segurança",   desc: "Acesse câmeras e alarmes de qualquer lugar pelo smartphone.",       href: "/app-de-seguranca" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 0", textAlign: "left", gap: 16, fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: "0.97rem", fontWeight: 700, color: "#1a1d20", lineHeight: 1.4 }}>{q}</span>
        <span style={{
          fontSize: "1.3rem", color: "#6b7280", flexShrink: 0,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.2s", display: "inline-block",
        }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.75, paddingBottom: 18, margin: 0 }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ── Exported section components ───────────────────────────────────────────────

/** Dark strip with company stats */
export function StatsStrip({ headline }) {
  return (
    <section style={{ background: "#32373c", padding: "56px 5%" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {headline && (
          <p style={{ textAlign: "center", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 36 }}>
            {headline}
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderTop: "1px solid rgba(255,255,255,0.1)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ padding: "28px 20px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 3-col benefits grid — "Por que adquirir com a ISF?" */
export function WhyISF({ title }) {
  return (
    <section style={{ padding: "72px 5%", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#126798", marginBottom: 10 }}>
            Por que escolher a ISF
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {title || "Vantagens de comprar e instalar com a ISF"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {ISF_BENEFITS.map((b) => (
            <div key={b.title} style={{ padding: "28px 24px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12 }}>
              <div style={{ width: 48, height: 48, background: "#e8f3f9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={b.icon} />
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1d20", marginBottom: 8 }}>{b.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Category-specific FAQ for product pages */
export function CategoryFaq({ category }) {
  const faqs = CATEGORY_FAQS[category] || GENERAL_FAQS;
  return (
    <section style={{ padding: "72px 5%", background: "#f9fafb" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#126798", marginBottom: 10 }}>
            Dúvidas frequentes
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>
            Perguntas sobre {category}
          </h2>
        </div>
        {faqs.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>
  );
}

/** General FAQ for blog pages */
export function BlogFaq() {
  return (
    <section style={{ padding: "72px 5%", background: "#f9fafb" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#126798", marginBottom: 10 }}>
            Dúvidas frequentes
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>
            Perguntas sobre contratar a ISF
          </h2>
        </div>
        {GENERAL_FAQS.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>
  );
}

/** 3×2 service cards grid for blog pages */
export function ServiceLinks() {
  return (
    <section style={{ padding: "72px 5%", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#126798", marginBottom: 10 }}>
            Nossos serviços
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>
            Segurança eletrônica completa em Curitiba
          </h2>
          <p style={{ fontSize: "0.97rem", color: "#6b7280", marginTop: 12, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Desde 1988 a ISF oferece soluções integradas de proteção para residências, comércios e indústrias.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {SERVICES.map((s) => (
            <a
              key={s.href}
              href={s.href}
              style={{
                display: "block", padding: "28px 24px",
                background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12,
                textDecoration: "none", transition: "all 0.25s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c5ddef"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(18,103,152,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 48, height: 48, background: "#e8f3f9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={s.icon} />
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1d20", marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: "0.83rem", color: "#6b7280", lineHeight: 1.6, margin: "0 0 14px" }}>{s.desc}</p>
              <span style={{ fontSize: "0.78rem", color: "#126798", fontWeight: 700 }}>Saiba mais →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Final blue CTA section */
export function FinalCta({ context }) {
  const waText = context
    ? `Ol%C3%A1%2C%20li%20sobre%20${encodeURIComponent(context)}%20e%20gostaria%20de%20um%20or%C3%A7amento!`
    : "Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento!";
  const waHref = `https://api.whatsapp.com/send?phone=5541999919191&text=${waText}`;

  return (
    <section style={{ padding: "80px 5%", background: "#126798" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Pronto para proteger o seu patrimônio?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", marginBottom: 36, lineHeight: 1.65 }}>
          Orçamento gratuito e sem compromisso. Atendemos Curitiba e toda a Região Metropolitana há mais de 35 anos.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/#contato"
            style={{
              background: "#fff", color: "#126798", padding: "13px 28px",
              borderRadius: 9999, fontWeight: 700, fontSize: "0.9rem",
              textDecoration: "none", transition: "all 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f7fc"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
          >
            Solicitar Orçamento
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#25d366", color: "#fff", padding: "13px 28px",
              borderRadius: 9999, fontWeight: 700, fontSize: "0.9rem",
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1fba58"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#25d366"; }}
          >
            <WaIcon /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/** Responsive CSS reset for grid breakpoints */
export function ConversionStyles() {
  return (
    <style>{`
      @media (max-width: 900px) {
        .cs-why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .cs-srv-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .cs-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 600px) {
        .cs-why-grid { grid-template-columns: 1fr !important; }
        .cs-srv-grid { grid-template-columns: 1fr !important; }
        .cs-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
    `}</style>
  );
}
