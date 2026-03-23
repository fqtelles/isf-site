import LandingPage from "../components/LandingPage";

export const metadata = {
  title: "Monitoramento de Alarmes 24h em Curitiba | ISF Segurança Eletrônica",
  description:
    "Monitoramento eletrônico 24 horas em Curitiba e Região Metropolitana. Câmeras, alarmes e sensores monitorados por equipe especializada. Orçamento gratuito.",
  openGraph: {
    title: "Monitoramento 24h em Curitiba | ISF Segurança",
    description: "Monitoramento de alarmes e câmeras 24h em Curitiba. Orçamento gratuito.",
    url: "https://isf.com.br/monitoramento-curitiba",
    type: "website",
    images: [{ url: "https://isf.com.br/home-1dobra-m.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://isf.com.br/monitoramento-curitiba" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Monitoramento de Alarmes 24h em Curitiba",
  description: "Serviço de monitoramento eletrônico 24 horas de alarmes e câmeras de segurança em residências e empresas em Curitiba e Região Metropolitana.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://isf.com.br/#organization",
    name: "ISF Segurança Eletrônica",
  },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://isf.com.br/monitoramento-curitiba",
};

const service = {
  name: "Monitoramento 24h",
  badge: "Monitoramento Eletrônico em Curitiba",
  h1: "Monitoramento de Alarmes e Câmeras 24 Horas em Curitiba",
  subtitle:
    "Sua propriedade protegida mesmo quando você não está presente. A ISF monitora alarmes, câmeras e sensores 24 horas por dia, acionando resposta imediata ao menor sinal de invasão.",
  formPlaceholder: "Descreva o que deseja monitorar (alarme existente, câmeras, propriedade rural)...",
  benefits: [
    {
      icon: "clock",
      title: "24 horas, 7 dias por semana",
      desc: "Central de monitoramento ativa 24h, inclusive feriados. Nenhum alarme passa despercebido.",
    },
    {
      icon: "bolt",
      title: "Resposta imediata",
      desc: "Ao receber o sinal, nossa equipe tenta contato imediato e, se não houver resposta, aciona as autoridades competentes.",
    },
    {
      icon: "phone",
      title: "Notificação no celular",
      desc: "Você recebe alertas em tempo real no smartphone para cada evento: abertura de portas, detecção de movimento, pânico.",
    },
    {
      icon: "link",
      title: "Integração total",
      desc: "Monitoramos alarmes, câmeras, cerca elétrica e controle de acesso em um único contrato, para sua comodidade.",
    },
    {
      icon: "chart",
      title: "Relatórios de eventos",
      desc: "Histórico completo de todos os eventos registrados — armes, desarmes, disparos e aberturas de zonas.",
    },
    {
      icon: "coin",
      title: "Planos acessíveis",
      desc: "Planos a partir de um valor mensal acessível. Sem fidelidade e sem taxa de adesão para clientes ISF.",
    },
  ],
  checklist: [
    "Compatível com alarmes das principais marcas (Intelbras, JFL, DSC, Paradox)",
    "Monitoramento via IP (internet) ou GSM (linha celular)",
    "Ligação de confirmação antes de acionar autoridades",
    "Acionamento de sirene remoto pela central",
    "Notificações por aplicativo, SMS ou ligação",
    "Relatório mensal de eventos",
    "Sem fidelidade contratual",
    "Instalação do módulo de comunicação inclusa",
    "Suporte técnico 24h para falhas no sistema",
  ],
  faqs: [
    {
      q: "Meu alarme atual pode ser conectado ao monitoramento?",
      a: "Na maioria dos casos, sim. Trabalhamos com os principais protocolos de comunicação (Contact ID) usados por Intelbras, JFL, DSC, Paradox e outros. Nossa equipe avalia e, se necessário, instala um módulo de comunicação IP ou GSM.",
    },
    {
      q: "O que acontece quando o alarme dispara?",
      a: "A central recebe o sinal, o operador tenta contato com você ou seu responsável cadastrado. Se não houver confirmação de falso alarme, acionamos a Guarda Municipal, PM ou empresa de ronda conforme seu plano.",
    },
    {
      q: "Quanto custa o monitoramento mensal?",
      a: "Os valores variam conforme o tipo de imóvel e serviços inclusos. Solicite um orçamento — oferecemos planos para residências, comércios e condomínios com mensalidades competitivas.",
    },
    {
      q: "O monitoramento funciona se a internet cair?",
      a: "Sim. Trabalhamos com comunicação dupla: IP (internet) + GSM (rede celular). Se a internet cair, o sistema continua enviando eventos via GSM, garantindo proteção ininterrupta.",
    },
  ],
};

export default function MonitoramentoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <LandingPage service={service} />
    </>
  );
}
