import LandingPage from "../components/LandingPage";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

export const metadata = {
  title: "Cerca Elétrica em Curitiba — Instalação e Manutenção | ISF Segurança",
  description:
    "Instalação e manutenção de cerca elétrica em Curitiba e Região Metropolitana. Conforme norma técnica ABNT. Residencial, comercial e condomínios. Orçamento gratuito.",
  openGraph: {
    title: "Cerca Elétrica em Curitiba — Instalação e Manutenção | ISF Segurança",
    description:
      "Instalação e manutenção de cerca elétrica em Curitiba e Região Metropolitana. Conforme norma técnica ABNT. Residencial, comercial e condomínios. Orçamento gratuito.",
    url: "https://isf.com.br/cerca-eletrica-curitiba/",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Cerca Elétrica em Curitiba — ISF Segurança Eletrônica" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://isf.com.br/cerca-eletrica-curitiba/" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Instalação de Cerca Elétrica em Curitiba",
  description: "Instalação e manutenção de cerca elétrica em residências, empresas e condomínios em Curitiba e Região Metropolitana, conforme ABNT NBR IEC 60335-2-76.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://isf.com.br/#organization",
    name: "ISF Soluções em Segurança",
  },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://isf.com.br/cerca-eletrica-curitiba/",
};

const service = {
  name: "Cerca Elétrica",
  badge: "Cerca Elétrica em Curitiba",
  h1: "Cerca Elétrica em Curitiba — Instalação dentro da Norma ABNT",
  subtitle:
    "Proteção perimetral com choque e alarme sonoro integrado. Instalação por empresa habilitada, em conformidade com a ABNT NBR IEC 60335-2-76. Atendemos residências, empresas e condomínios em Curitiba e RMC.",
  formPlaceholder: "Informe o tipo de imóvel (casa, empresa, condomínio) e o perímetro aproximado em metros...",
  benefits: [
    {
      icon: "bolt",
      title: "Choque + alarme sonoro",
      desc: "Dupla proteção: o choque inibe a invasão e a sirene integrada alerta vizinhos e equipe de monitoramento imediatamente.",
    },
    {
      icon: "clipboard",
      title: "Conforme ABNT NBR IEC 60335-2-76",
      desc: "Instalação por empresa habilitada em conformidade com a norma brasileira. Laudo técnico entregue após a instalação.",
    },
    {
      icon: "home",
      title: "Residencial e condomínios",
      desc: "Solução ideal para muros de casas, condomínios horizontais, empresas e áreas industriais. Projeto sob medida para cada perímetro.",
    },
    {
      icon: "phone",
      title: "Integração com alarme",
      desc: "A cerca pode ser integrada ao seu sistema de alarme existente, expandindo a proteção sem custo adicional de central.",
    },
    {
      icon: "lock",
      title: "Aterramentos e proteções",
      desc: "Instalação com aterramento correto, proteção contra raios e isoladores de alta qualidade para máxima durabilidade.",
    },
    {
      icon: "wrench",
      title: "Manutenção preventiva",
      desc: "Planos de manutenção periódica para garantir o funcionamento contínuo do sistema e prevenir falhas.",
    },
  ],
  relatedLinks: [
    { label: "Alarmes Residenciais e Comerciais em Curitiba", href: "/alarmes-curitiba/" },
    { label: "Monitoramento de Alarmes 24h",                  href: "/monitoramento-curitiba/" },
    { label: "Catálogo de Produtos de Segurança Perimetral",  href: "/produtos/" },
  ],
  checklist: [
    "Visita técnica e medição do perímetro gratuitamente",
    "Projeto personalizado conforme norma ABNT NBR IEC 60335-2-76",
    "Módulo eletrificador de alta qualidade (Genno, Pulsart ou similar)",
    "Instalação de fios, esticadores e isoladores",
    "Aterramento elétrico e proteção contra raios",
    "Sirene de alarme integrada",
    "Plaquetas de sinalização (obrigatórias por norma)",
    "Laudo técnico de instalação",
    "Teste e comissionamento do sistema",
    "Garantia de equipamentos e mão de obra",
  ],
  faqs: [
    {
      q: "Cerca elétrica é permitida em Curitiba?",
      a: "Sim, é permitida mediante instalação por empresa habilitada e em conformidade com a ABNT NBR IEC 60335-2-76. A norma exige sinalização obrigatória, aterramento correto e choque dentro de limites seguros. A ISF entrega laudo técnico após cada instalação.",
    },
    {
      q: "Cerca elétrica faz mal à saúde?",
      a: "Não, quando instalada corretamente. A corrente é de alta tensão mas baixíssima amperagem — suficiente para causar dor e inibir a invasão, mas não perigosa para adultos saudáveis. A ABNT NBR IEC 60335-2-76 regula exatamente esses limites.",
    },
    {
      q: "Quanto metros de cerca posso instalar?",
      a: "Um único módulo eletrificador suporta de 150 a 600 metros de fio, dependendo do modelo. Para perímetros maiores, usamos múltiplos módulos. Nossa equipe dimensiona corretamente na visita técnica.",
    },
    {
      q: "A chuva afeta o funcionamento da cerca elétrica?",
      a: "Uma cerca bem instalada funciona normalmente na chuva. Os isoladores e o aterramento correto evitam disparos falsos. Realizamos a instalação com materiais resistentes a intempéries.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: service.faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function CercaEletricaPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://isf.com.br" },
        { name: "Serviços", url: "https://isf.com.br/#servicos" },
        { name: "Cerca Elétrica em Curitiba" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingPage service={service} />
    </>
  );
}
