import LandingPage from "../components/LandingPage";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

export const metadata = {
  title: "Alarmes Residenciais e Comerciais em Curitiba | ISF",
  description:
    "Sistemas de alarme com monitoramento 24h para residências, empresas e condomínios em Curitiba. Técnicos certificados. Orçamento grátis.",
  openGraph: {
    title: "Alarmes Residenciais e Comerciais em Curitiba | ISF",
    description:
      "Sistemas de alarme com monitoramento 24h para residências, empresas e condomínios em Curitiba. Técnicos certificados. Orçamento grátis.",
    url: "https://isf.com.br/alarmes-curitiba/",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Alarmes em Curitiba — ISF Segurança Eletrônica" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://isf.com.br/alarmes-curitiba/" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Instalação de Alarmes em Curitiba",
  description: "Instalação e manutenção de sistemas de alarme residencial e empresarial em Curitiba e Região Metropolitana.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://isf.com.br/#organization",
    name: "ISF Soluções em Segurança",
  },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://isf.com.br/alarmes-curitiba/",
};

const service = {
  name: "Alarmes",
  badge: "Instalação de Alarmes em Curitiba",
  h1: "Alarme Residencial e Empresarial em Curitiba",
  subtitle:
    "Proteja sua casa, empresa ou condomínio com sistemas de alarme de última geração. A ISF instala soluções com e sem fio, com monitoramento 24h e controle pelo celular.",
  formPlaceholder: "Descreva seu imóvel (casa, empresa, condomínio) e quantos ambientes deseja proteger...",
  benefits: [
    {
      icon: "bell",
      title: "Alarmes com e sem fio",
      desc: "Soluções para todos os perfis de imóvel — residencial, comercial ou industrial. Instalação limpa, sem quebrar paredes.",
    },
    {
      icon: "phone",
      title: "Controle pelo celular",
      desc: "Arme e desarme remotamente, receba notificações em tempo real e monitore sensores pelo smartphone, de qualquer lugar.",
    },
    {
      icon: "shield",
      title: "Monitoramento 24h",
      desc: "Equipe de monitoramento ativa 24 horas por dia, 7 dias por semana. Ao menor sinal de alarme, ação imediata.",
    },
    {
      icon: "badge",
      title: "Marcas certificadas",
      desc: "Revenda autorizada Intelbras. Equipamentos originais com garantia de fábrica e suporte técnico especializado.",
    },
    {
      icon: "bolt",
      title: "Instalação rápida",
      desc: "Equipe técnica própria treinada. Instalação ágil com o mínimo de transtorno para sua rotina.",
    },
    {
      icon: "pin",
      title: "Curitiba e RMC",
      desc: "Atendimento em toda Curitiba e Região Metropolitana: São José dos Pinhais, Colombo, Pinhais, Araucária e mais.",
    },
  ],
  checklist: [
    "Visita técnica gratuita para avaliação do imóvel",
    "Projeto personalizado conforme necessidade",
    "Instalação de sensores de presença e abertura",
    "Central de alarme com teclado e app de controle",
    "Sirene interna e externa",
    "Integração com monitoramento 24h (opcional)",
    "Treinamento de uso para todos os usuários",
    "Garantia de 1 ano em equipamentos e instalação",
    "Suporte técnico pós-venda",
  ],
  faqs: [
    {
      q: "Alarme com fio ou sem fio: qual é melhor para minha casa?",
      a: "Para imóveis em construção ou reforma, o sistema com fio é mais robusto e econômico. Para imóveis prontos, o sem fio evita obras e é igualmente confiável. Nossa equipe avalia e recomenda a melhor opção para o seu caso.",
    },
    {
      q: "Quanto tempo leva a instalação de um alarme?",
      a: "Uma residência padrão é instalada em 1 dia útil. Imóveis maiores ou comerciais podem levar 2 a 3 dias. Realizamos a visita técnica para dimensionar corretamente antes de iniciar.",
    },
    {
      q: "O alarme funciona sem internet?",
      a: "Sim. O alarme funciona de forma independente mesmo sem internet. A conexão com internet ou rede GSM é usada apenas para enviar notificações ao celular e para o monitoramento remoto.",
    },
    {
      q: "Qual a diferença entre alarme monitorado e não monitorado?",
      a: "O alarme monitorado está conectado a uma central que aciona uma equipe de resposta quando o alarme dispara. O não monitorado apenas emite a sirene. Oferecemos as duas modalidades conforme sua necessidade.",
    },
  ],
};

export default function AlarmesPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://isf.com.br" },
        { name: "Serviços", url: "https://isf.com.br/#servicos" },
        { name: "Alarmes em Curitiba" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <LandingPage service={service} />
    </>
  );
}
