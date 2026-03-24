import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

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
        url: "https://isf.com.br/og-image.png",
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
    images: ["https://isf.com.br/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: { canonical: "https://isf.com.br" },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#126798",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://isf.com.br/#organization",
  name: "ISF Soluções em Segurança",
  description:
    "Empresa especializada em segurança eletrônica em Curitiba com mais de 35 anos de mercado. Instalação de alarmes, câmeras CFTV, cerca elétrica, controle de acesso e monitoramento 24 horas.",
  url: "https://isf.com.br",
  telephone: "+554133787933",
  foundingDate: "1988",
  priceRange: "$$",
  image: "https://isf.com.br/og-image.png",
  logo: "https://isf.com.br/ISF_SolucoesEmSeguranca_Logo.png",
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


export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-80H81158R9"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-80H81158R9');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
