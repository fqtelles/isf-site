export const metadata = {
  title: "ISF Soluções em Segurança | Alarmes, Câmeras e Monitoramento em Curitiba",
  description:
    "Há mais de 35 anos a ISF Segurança Eletrônica protege residências, empresas e condomínios em Curitiba e região metropolitana. Alarmes, câmeras CFTV, cerca elétrica, controle de acesso e monitoramento 24h.",
  keywords:
    "ISF Soluções em Segurança, ISF Segurança Eletrônica, segurança eletrônica Curitiba, alarme residencial Curitiba, câmeras CFTV Curitiba, cerca elétrica Curitiba, monitoramento 24h Curitiba, controle de acesso Curitiba, ISF Segurança",
  openGraph: {
    title: "ISF Soluções em Segurança | Curitiba",
    description:
      "35+ anos protegendo patrimônios em Curitiba. Alarmes, câmeras, cerca elétrica e monitoramento 24h.",
    url: "https://isf.com.br",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://isf.com.br/home-1dobra-m.png",
        width: 1200,
        height: 630,
        alt: "ISF Segurança Eletrônica — Curitiba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISF Soluções em Segurança | Curitiba",
    description: "35+ anos protegendo patrimônios em Curitiba. Alarmes, câmeras, cerca elétrica e monitoramento 24h.",
    images: ["https://isf.com.br/home-1dobra-m.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://isf.com.br" },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://isf.com.br/#organization",
  name: "ISF Segurança Eletrônica",
  description:
    "Empresa especializada em segurança eletrônica em Curitiba com mais de 35 anos de mercado. Instalação de alarmes, câmeras CFTV, cerca elétrica, controle de acesso e monitoramento 24 horas.",
  url: "https://isf.com.br",
  telephone: "+554133787933",
  foundingDate: "1988",
  priceRange: "$$",
  image:
    "/ISF_SolucoesEmSeguranca_Logo.png",
  logo:
    "/ISF_SolucoesEmSeguranca_Logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Omar Dutra, 52",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    postalCode: "82200-140",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -25.4016,
    longitude: -49.2616,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "18:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Curitiba" },
    { "@type": "AdministrativeArea", name: "Região Metropolitana de Curitiba" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços de Segurança Eletrônica",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Instalação de Alarmes" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Câmeras de Segurança CFTV" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cerca Elétrica" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Monitoramento 24 horas" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Controle de Acesso" } },
    ],
  },
  sameAs: ["https://www.facebook.com/isfsegurancaeletronica"],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quanto custa instalar câmeras de segurança em Curitiba?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O valor varia conforme o número de câmeras, tipo de equipamento e área de cobertura. A ISF oferece orçamento gratuito e sem compromisso — entre em contato pelo WhatsApp ou formulário e nossa equipe visita o local para apresentar a melhor solução.",
      },
    },
    {
      "@type": "Question",
      name: "A ISF faz monitoramento 24 horas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. A ISF oferece serviço de monitoramento 24 horas em parceria com as melhores centrais do setor. Ao menor sinal de alarme, nossa equipe aciona os procedimentos de segurança imediatamente.",
      },
    },
    {
      "@type": "Question",
      name: "Cerca elétrica é permitida em Curitiba?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, a cerca elétrica é permitida em Curitiba mediante instalação por empresa habilitada e seguindo as normas da ABNT NBR IEC 60335-2-76. A ISF realiza toda a instalação em conformidade com a legislação vigente.",
      },
    },
    {
      "@type": "Question",
      name: "Quais bairros e cidades a ISF atende?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Atendemos Curitiba e toda a Região Metropolitana, incluindo São José dos Pinhais, Colombo, Pinhais, Araucária, Campo Largo, Almirante Tamandaré e demais municípios da RMC.",
      },
    },
    {
      "@type": "Question",
      name: "A ISF é revendedora autorizada Intelbras?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, somos revenda autorizada Intelbras e trabalhamos com produtos originais com garantia de fábrica. Também trabalhamos com outras marcas referência como Dtech, Vonder e Confiseg.",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {/* Termos alternativos para indexação — oculto visualmente */}
        <span aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          ISF Segurança Eletrônica, ISF Soluções em Segurança, segurança eletrônica Curitiba, alarmes Curitiba, câmeras de segurança Curitiba, monitoramento 24 horas Curitiba, cerca elétrica Curitiba, controle de acesso Curitiba
        </span>
        {children}
      </body>
    </html>
  );
}
