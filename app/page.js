import { prisma } from "../lib/prisma";
import HomeClient from "./HomeClient";

export const revalidate = 3600; // ISR: revalida a cada 1 hora

export const metadata = {
  title: "ISF Soluções em Segurança | Alarmes e Câmeras em Curitiba desde 1988",
  description:
    "Câmeras, alarmes, cerca elétrica, controle de acesso e monitoramento 24h. 35+ anos. Revenda autorizada Intelbras em Curitiba. Solicite orçamento grátis.",
  alternates: { canonical: "https://isf.com.br" },
  openGraph: {
    title: "ISF Soluções em Segurança | Alarmes e Câmeras em Curitiba desde 1988",
    description:
      "Câmeras, alarmes, cerca elétrica, controle de acesso e monitoramento 24h. 35+ anos. Revenda autorizada Intelbras em Curitiba. Solicite orçamento grátis.",
    url: "https://isf.com.br",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "ISF Soluções em Segurança — Curitiba" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISF Soluções em Segurança | Alarmes e Câmeras em Curitiba desde 1988",
    description:
      "Câmeras, alarmes, cerca elétrica, controle de acesso e monitoramento 24h. 35+ anos. Revenda autorizada Intelbras em Curitiba. Solicite orçamento grátis.",
    images: ["https://isf.com.br/og-image.jpg"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://isf.com.br/#faq",
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
        text: "Sim, somos revenda autorizada Intelbras e trabalhamos com produtos originais com garantia de fábrica. Também trabalhamos com outras marcas referência como Hikvision, Paradox, Viaweb, JFL e outras.",
      },
    },
  ],
};

export default async function HomePage() {
  let products = [];
  let blogPosts = [];

  try {
    [products, blogPosts] = await Promise.all([
      prisma.product.findMany({ orderBy: { id: "asc" } }),
      prisma.blogPost.findMany({ orderBy: { id: "asc" } }),
    ]);
  } catch (err) {
    console.error("Erro ao carregar dados da homepage:", err);
    // Renderiza a página normalmente com listas vazias — melhor que uma tela em branco
  }

  return (
    <>
      {/* Preload LCP: primeiro slide do hero — mobile e desktop */}
      <link
        rel="preload"
        as="image"
        href="/_next/image?url=%2Fmobile-slide-1.png&w=828&q=75"
        imageSrcSet="/_next/image?url=%2Fmobile-slide-1.png&w=828&q=75 828w, /_next/image?url=%2Fmobile-slide-1.png&w=1080&q=75 1080w"
        imageSizes="100vw"
        media="(max-width: 768px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/_next/image?url=%2Fhero-slide-1-v2.png&w=1920&q=75"
        imageSrcSet="/_next/image?url=%2Fhero-slide-1-v2.png&w=1200&q=75 1200w, /_next/image?url=%2Fhero-slide-1-v2.png&w=1920&q=75 1920w"
        imageSizes="100vw"
        media="(min-width: 769px)"
        fetchPriority="high"
      />
      <div
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{
          __html: `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`,
        }}
      />
      <HomeClient initialProducts={products} initialBlogPosts={blogPosts} />
    </>
  );
}
