import LandingPage from "../components/LandingPage";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

export const metadata = {
  title: "Vídeo Monitoramento com IA em Curitiba | ISF Segurança",
  description:
    "Vídeo monitoramento com Inteligência Artificial em Curitiba e RMC. Câmeras com vídeo analítico que detectam invasões, comportamentos suspeitos e alertam a central 24h. Orçamento gratuito.",
  openGraph: {
    title: "Vídeo Monitoramento com IA em Curitiba | ISF Segurança",
    description:
      "Vídeo monitoramento com Inteligência Artificial em Curitiba e RMC. Câmeras com vídeo analítico que detectam invasões, comportamentos suspeitos e alertam a central 24h. Orçamento gratuito.",
    url: "https://isf.com.br/video-monitoramento-curitiba/",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Vídeo Monitoramento Inteligente em Curitiba — ISF Segurança Eletrônica" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://isf.com.br/video-monitoramento-curitiba/" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Vídeo Monitoramento Inteligente em Curitiba",
  description: "Serviço de vídeo monitoramento com inteligência artificial e vídeo analítico para residências e empresas em Curitiba e Região Metropolitana. Câmeras atuam como sensores inteligentes e alertam a central de monitoramento 24h.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://isf.com.br/#organization",
    name: "ISF Soluções em Segurança",
  },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://isf.com.br/video-monitoramento-curitiba/",
};

const service = {
  name: "Vídeo Monitoramento",
  badge: "Vídeo Monitoramento Inteligente em Curitiba",
  h1: "Vídeo Monitoramento com Inteligência Artificial em Curitiba",
  subtitle:
    "Suas câmeras trabalham para você. Com vídeo analítico e inteligência artificial, cada câmera de segurança se torna um sensor inteligente de informações, que detecta invasões, comportamentos suspeitos e situações de risco, alertando automaticamente a central de monitoramento 24h para ação imediata.",
  formPlaceholder: "Descreva o que deseja monitorar (empresa, residência, condomínio, perímetro externo)...",
  benefits: [
    {
      icon: "film",
      title: "Vídeo analítico com IA",
      desc: "Câmeras com inteligência artificial que analisam imagens em tempo real: detecção de intrusão, cruzamento de linha virtual, permanência em área restrita e abandono de objetos.",
    },
    {
      icon: "camera",
      title: "Câmera como sensor",
      desc: "A câmera identifica o evento e envia o alerta automaticamente à central, sem depender de um operador assistindo telas. Mais precisão e velocidade na detecção.",
    },
    {
      icon: "bolt",
      title: "Redução de falsos alarmes",
      desc: "A IA diferencia pessoas de animais, veículos de sombras e movimentos irrelevantes. Menos alarmes falsos, mais eficiência na resposta a eventos reais.",
    },
    {
      icon: "link",
      title: "Integração alarme + câmera",
      desc: "O alarme aciona a câmera para verificação visual, ou a câmera dispara o alarme ao detectar movimento suspeito. Dupla confirmação para máxima segurança.",
    },
    {
      icon: "clock",
      title: "Monitoramento 24 horas",
      desc: "Central de monitoramento ativa 24h recebe os alertas com imagens e clipes do evento, permitindo tomada de decisão imediata e acionamento de resposta.",
    },
    {
      icon: "chart",
      title: "Relatórios e evidências",
      desc: "Histórico completo de eventos com imagens e vídeos. Relatórios de incidentes para análise de segurança, auditorias e uso como prova em ocorrências.",
    },
  ],
  checklist: [
    "Câmeras com vídeo analítico integrado (Intelbras, Hikvision)",
    "Detecção inteligente de intrusão e cruzamento de perímetro",
    "Alertas automáticos para a central de monitoramento 24h",
    "Verificação visual em tempo real pelo operador",
    "Integração com sistema de alarme e cerca elétrica",
    "Notificações por aplicativo com imagem do evento",
    "Gravação contínua com acesso remoto pelo celular",
    "Redução de falsos alarmes por análise inteligente",
    "Suporte técnico e manutenção preventiva inclusa",
  ],
  faqs: [
    {
      q: "O que é vídeo monitoramento com IA?",
      a: "É um serviço no qual câmeras com inteligência artificial analisam as imagens do seu patrimônio em tempo real e detectam automaticamente eventos suspeitos, como invasão de perímetro, presença em área restrita ou abandono de objetos. Quando algo é detectado, a câmera envia um alerta com imagem para a central de monitoramento, que toma as providências imediatas.",
    },
    {
      q: "Preciso trocar minhas câmeras para ter vídeo analítico?",
      a: "Depende do modelo atual. Câmeras mais recentes da Intelbras e Hikvision já possuem vídeo analítico embarcado. Em câmeras mais antigas, é possível adicionar a inteligência via software no gravador (DVR/NVR) ou por meio de um servidor de análise. Nossa equipe avalia o seu sistema e indica a melhor solução.",
    },
    {
      q: "Qual a diferença entre vídeo monitoramento e monitoramento de alarmes?",
      a: "No monitoramento de alarmes, a central recebe sinais de sensores (abertura, movimento, pânico). No vídeo monitoramento, a câmera é o próprio sensor — ela identifica o evento e envia a imagem. Isso permite verificação visual imediata e reduz falsos alarmes, pois o operador vê o que está acontecendo antes de acionar a resposta.",
    },
    {
      q: "O vídeo monitoramento funciona à noite?",
      a: "Sim. As câmeras com vídeo analítico possuem visão noturna com infravermelho ou tecnologia ColorVu para imagens coloridas mesmo no escuro. A detecção inteligente funciona 24 horas, dia e noite, independente das condições de iluminação.",
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

export default function VideoMonitoramentoPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://isf.com.br" },
        { name: "Serviços", url: "https://isf.com.br/#servicos" },
        { name: "Vídeo Monitoramento em Curitiba" },
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
