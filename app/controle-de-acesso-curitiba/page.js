import LandingPage from "../components/LandingPage";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

export const metadata = {
  title: "Controle de Acesso em Curitiba — Biometria e Cartão | ISF Segurança",
  description:
    "Instalação de controle de acesso em Curitiba: catracas, biometria, cartão de proximidade e reconhecimento facial. Ideal para condomínios e empresas. Orçamento gratuito.",
  openGraph: {
    title: "Controle de Acesso em Curitiba — Biometria e Cartão | ISF Segurança",
    description:
      "Instalação de controle de acesso em Curitiba: catracas, biometria, cartão de proximidade e reconhecimento facial. Ideal para condomínios e empresas. Orçamento gratuito.",
    url: "https://isf.com.br/controle-de-acesso-curitiba/",
    siteName: "ISF Segurança Eletrônica",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://isf.com.br/og-image.jpg", width: 1200, height: 630, alt: "Controle de Acesso em Curitiba — ISF Segurança Eletrônica" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://isf.com.br/controle-de-acesso-curitiba/" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Controle de Acesso em Curitiba",
  description: "Instalação de sistemas de controle de acesso em condomínios, empresas e áreas restritas em Curitiba e Região Metropolitana.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://isf.com.br/#organization",
    name: "ISF Soluções em Segurança",
  },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://isf.com.br/controle-de-acesso-curitiba/",
};

const service = {
  name: "Controle de Acesso",
  badge: "Controle de Acesso em Curitiba",
  h1: "Controle de Acesso em Curitiba — Biometria, Cartão e Reconhecimento Facial",
  subtitle:
    "Gerencie com precisão quem entra e sai do seu imóvel. A ISF instala leitores biométricos, cartão de proximidade e reconhecimento facial para condomínios, empresas e áreas de acesso restrito em Curitiba e RMC.",
  formPlaceholder: "Descreva o local (condomínio, empresa, portaria) e quantos pontos de acesso deseja controlar...",
  benefits: [
    {
      icon: "finger",
      title: "Leitores biométricos",
      desc: "Acesso por impressão digital sem necessidade de chaves ou cartões. Alta precisão e velocidade de leitura, ideal para ambientes com grande fluxo.",
    },
    {
      icon: "card",
      title: "Cartão de proximidade",
      desc: "Controle fácil por cartão ou tag RFID. Emissão e bloqueio instantâneo de credenciais, sem necessidade de troca de fechaduras.",
    },
    {
      icon: "face",
      title: "Reconhecimento facial",
      desc: "Tecnologia de ponta para identificação por rosto. Acesso rápido, sem contato e com alto nível de segurança.",
    },
    {
      icon: "chart",
      title: "Registro e relatórios",
      desc: "Histórico completo de entradas e saídas com data, hora e usuário. Relatórios detalhados para auditoria e controle de ponto.",
    },
    {
      icon: "phone",
      title: "Gerenciamento remoto",
      desc: "Cadastre usuários, conceda ou bloqueie acessos pelo computador ou smartphone, de qualquer lugar.",
    },
  ],
  checklist: [
    "Visita técnica gratuita e projeto personalizado",
    "Leitores biométricos, de cartão ou facial conforme necessidade",
    "Software de gerenciamento com interface intuitiva",
"Integração com sistema de alarme e câmeras existentes",
    "Fechaduras eletromagnéticas e eletromecânicas",
    "Cadastro inicial de usuários e treinamento da equipe",
    "Relatórios de acesso e controle de ponto",
    "Suporte técnico pós-venda e garantia de 1 ano",
  ],
  faqs: [
    {
      q: "Controle de acesso funciona para condomínio residencial?",
      a: "Sim, é uma das aplicações mais comuns. Instalamos portões com leitura biométrica ou de cartão para moradores, com registro de todos os acessos. Também é possível integrar com intercomunicadores e câmeras existentes.",
    },
    {
      q: "É possível bloquear o acesso de um funcionário demitido imediatamente?",
      a: "Sim. O bloqueio é feito em segundos pelo software de gerenciamento, sem necessidade de recolher chaves ou trocar fechaduras. Basta desativar a credencial do usuário no sistema.",
    },
    {
      q: "O sistema registra os horários de entrada e saída?",
      a: "Sim. Todos os eventos são registrados com data, hora e usuário. O relatório pode ser exportado e serve como base para controle de ponto ou auditoria de segurança.",
    },
    {
      q: "O controle de acesso funciona sem energia elétrica?",
      a: "Com um nobreak instalado, o sistema continua funcionando durante quedas de energia. Podemos dimensionar a autonomia conforme a necessidade do local.",
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

export default function ControleAcessoPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://isf.com.br" },
        { name: "Serviços", url: "https://isf.com.br/#servicos" },
        { name: "Controle de Acesso em Curitiba" },
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
