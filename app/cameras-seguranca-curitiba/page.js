import LandingPage from "../components/LandingPage";

export const metadata = {
  title: "Câmeras de Segurança em Curitiba — CFTV e IP | ISF Segurança Eletrônica",
  description:
    "Instalação de câmeras de segurança CFTV e IP em Curitiba e Região Metropolitana. HD, Full HD, visão noturna, acesso remoto pelo celular. Orçamento gratuito.",
  openGraph: {
    title: "Câmeras de Segurança em Curitiba | ISF Segurança",
    description: "Instalação de câmeras CFTV em Curitiba. Full HD, visão noturna. Orçamento gratuito.",
    url: "https://isf.com.br/cameras-seguranca-curitiba",
    type: "website",
    images: [{ url: "https://isf.com.br/home-1dobra-m.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://isf.com.br/cameras-seguranca-curitiba" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Instalação de Câmeras de Segurança em Curitiba",
  description: "Instalação de câmeras de segurança CFTV e IP em residências, empresas e condomínios em Curitiba e Região Metropolitana.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://isf.com.br/#organization",
    name: "ISF Segurança Eletrônica",
  },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://isf.com.br/cameras-seguranca-curitiba",
};

const service = {
  name: "Câmeras de Segurança",
  badge: "Câmeras CFTV e IP em Curitiba",
  h1: "Câmeras de Segurança em Curitiba — CFTV, Full HD e Acesso Remoto",
  subtitle:
    "Monitore sua residência, empresa ou condomínio em tempo real pelo celular. Câmeras Full HD, visão noturna, zoom e gravação em nuvem. Instalação profissional por equipe certificada.",
  formPlaceholder: "Informe quantas câmeras deseja, o tipo de imóvel e os ambientes a monitorar...",
  benefits: [
    {
      icon: "camera",
      title: "Full HD e 4K",
      desc: "Câmeras com resolução Full HD e 4K para imagens nítidas, dia e noite. Identificação facial e de placas mesmo em baixa luminosidade.",
    },
    {
      icon: "moon",
      title: "Visão noturna",
      desc: "Tecnologia infravermelho com alcance de até 200 metros. Gravação colorida mesmo no escuro com câmeras ColorVu Intelbras.",
    },
    {
      icon: "phone",
      title: "Acesso pelo celular",
      desc: "Acesse todas as câmeras ao vivo pelo smartphone, de qualquer lugar do mundo. Notificações automáticas ao detectar movimento.",
    },
    {
      icon: "database",
      title: "Gravação contínua",
      desc: "DVR e NVR com gravação 24h. Armazenamento local em HD ou em nuvem. Acesso ao histórico de gravações quando precisar.",
    },
    {
      icon: "building",
      title: "Câmeras para todo uso",
      desc: "Câmeras dome, bullet, speed dome, fisheye e PTZ para qualquer aplicação — residencial, comercial, industrial ou condomínio.",
    },
    {
      icon: "wrench",
      title: "Manutenção e suporte",
      desc: "Suporte técnico pós-instalação e planos de manutenção preventiva. Equipe disponível para atendimento em Curitiba e RMC.",
    },
  ],
  checklist: [
    "Visita técnica gratuita e projeto de CFTV personalizado",
    "Câmeras HD, Full HD ou 4K conforme necessidade",
    "DVR ou NVR com HD para gravação contínua",
    "Cabeamento estruturado ou sistema IP sem fio",
    "Configuração de acesso remoto pelo celular",
    "Detecção inteligente de movimento com notificações",
    "Instalação de fontes, fontes de backup (nobreak) e proteção contra raios",
    "Treinamento de uso do sistema",
    "Garantia de equipamentos e instalação",
  ],
  faqs: [
    {
      q: "Quantas câmeras preciso para a minha casa?",
      a: "Para uma residência padrão, recomendamos câmeras nas entradas (portão, porta frontal e fundos) e no perímetro. Em média, 4 a 8 câmeras cobrem bem uma residência. Nossa equipe faz a visita técnica e apresenta um projeto personalizado.",
    },
    {
      q: "Posso ver as câmeras pelo celular?",
      a: "Sim. Todos os sistemas que instalamos permitem acesso remoto pelo celular via app Intelbras iMHDX ou similar. Basta ter internet. Você acompanha ao vivo e acessa gravações de onde estiver.",
    },
    {
      q: "As câmeras funcionam à noite?",
      a: "Sim. Instalamos câmeras com infravermelho que gravam em preto e branco no escuro, ou câmeras ColorVu que gravam em cores mesmo sem iluminação. O alcance varia de 20 a 200 metros conforme o modelo.",
    },
    {
      q: "Por quanto tempo as gravações ficam armazenadas?",
      a: "Depende do HD e do número de câmeras. Com HD de 1TB e 4 câmeras Full HD em gravação contínua, a média é de 15 a 30 dias. Podemos calcular o armazenamento ideal para o seu caso.",
    },
  ],
};

export default function CamerasPage() {
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
