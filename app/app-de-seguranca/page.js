import LandingPage from "../components/LandingPage";

export const metadata = {
  title: "App de Segurança para Câmeras e Alarmes em Curitiba | ISF Segurança Eletrônica",
  description:
    "Acesse câmeras e alarmes pelo celular de qualquer lugar. A ISF configura o acesso remoto ao seu sistema de segurança em Curitiba. Orçamento gratuito.",
  openGraph: {
    title: "App de Segurança em Curitiba | ISF Segurança",
    description: "Monitore câmeras e controle alarmes pelo celular. Curitiba e RMC. Orçamento gratuito.",
    url: "https://isf.com.br/app-de-seguranca",
    type: "website",
    images: [{ url: "https://isf.com.br/home-1dobra-m.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://isf.com.br/app-de-seguranca" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "App de Segurança — Acesso Remoto em Curitiba",
  description: "Configuração de acesso remoto a câmeras de segurança e alarmes pelo celular em Curitiba e Região Metropolitana.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://isf.com.br/#organization",
    name: "ISF Segurança Eletrônica",
  },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://isf.com.br/app-de-seguranca",
};

const service = {
  name: "App de Segurança",
  badge: "Acesso Remoto via Smartphone",
  h1: "Monitore Câmeras e Controle Alarmes pelo Celular — De Qualquer Lugar",
  subtitle:
    "Com um toque na tela, visualize todas as câmeras ao vivo, arme ou desarme o alarme e receba notificações de movimento em tempo real. A ISF configura o acesso remoto ao seu sistema de segurança em Curitiba e RMC.",
  formPlaceholder: "Descreva seu sistema atual (câmeras, alarme, marca) ou o que deseja instalar...",
  benefits: [
    {
      icon: "phone",
      title: "Câmeras ao vivo no celular",
      desc: "Acesse todas as câmeras do seu imóvel em tempo real pelo smartphone, de qualquer lugar do mundo. Compatível com Android e iPhone.",
    },
    {
      icon: "bell",
      title: "Notificações em tempo real",
      desc: "Receba alertas instantâneos quando câmeras detectam movimento ou quando o alarme é acionado — mesmo fora de casa.",
    },
    {
      icon: "lock",
      title: "Armar e desarmar remotamente",
      desc: "Controle o alarme pelo app sem precisar estar presente. Ideal para esquecimentos ou para acionar após sair do imóvel.",
    },
    {
      icon: "film",
      title: "Acesso ao histórico de gravações",
      desc: "Consulte gravações anteriores diretamente pelo app. Verifique o que aconteceu em qualquer câmera nas últimas horas ou dias.",
    },
    {
      icon: "users",
      title: "Múltiplos usuários",
      desc: "Compartilhe o acesso com familiares ou colaboradores com diferentes níveis de permissão — visualização, controle ou administração.",
    },
    {
      icon: "wrench",
      title: "Configuração profissional",
      desc: "Nossa equipe realiza toda a configuração do app, da rede e do roteador para garantir acesso estável, seguro e sem complicações.",
    },
  ],
  checklist: [
    "Configuração de acesso remoto para câmeras (DVR/NVR)",
    "Configuração de acesso remoto para central de alarme",
    "Compatível com sistemas Intelbras, Paradox, JFL, HikVision e outros",
    "Configuração do roteador e rede local para acesso seguro",
    "Instalação do app no smartphone do cliente",
    "Cadastro de múltiplos usuários (família, funcionários)",
    "Ativação de notificações por detecção de movimento",
    "Teste completo de conectividade e qualidade de imagem",
    "Treinamento de uso do aplicativo para todos os usuários",
  ],
  faqs: [
    {
      q: "Funciona com qualquer câmera ou alarme?",
      a: "Funciona com a grande maioria dos sistemas modernos. Trabalhamos com Intelbras, HikVision, Paradox, JFL, DSC e outros. Nossa equipe avalia o seu equipamento e indica o app adequado ou, se necessário, um módulo de comunicação para habilitar o acesso remoto.",
    },
    {
      q: "Precisa de internet na casa para funcionar?",
      a: "Sim, é necessário internet no local onde estão as câmeras ou o alarme. Para o celular de acesso, basta qualquer conexão — Wi-Fi ou dados móveis. Em casos críticos, podemos instalar um chip GSM como backup.",
    },
    {
      q: "O acesso remoto é seguro? Alguém pode invadir?",
      a: "Sim, é seguro. Os sistemas que instalamos utilizam comunicação criptografada e autenticação por usuário e senha. Seguimos boas práticas de configuração de rede para evitar vulnerabilidades.",
    },
    {
      q: "Posso ver as câmeras em tempo real sem atraso?",
      a: "Com uma boa conexão de internet no local e no celular, o atraso (latência) é de apenas 1 a 3 segundos, o que é imperceptível para monitoramento cotidiano. Para visualização fluida, recomendamos internet de pelo menos 10 Mbps no local.",
    },
  ],
};

export default function AppSegurancaPage() {
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
