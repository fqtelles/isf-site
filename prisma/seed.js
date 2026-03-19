const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const products = [
  // Câmeras
  { name: "Câmera Bullet VHL 1220 B",         brand: "Intelbras", category: "Câmeras",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2025-04/vhl_1220_b-persp_esq_0.png" },
  { name: "Câmera Dome VHL 1220 D",           brand: "Intelbras", category: "Câmeras",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2025-04/vhl_1220_d-frontal_1.png" },
  { name: "Speed Dome VHD 5220 SD",           brand: "Intelbras", category: "Câmeras",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2021-10/vhd-5220-sd-front.png" },
  { name: "Câmera Bullet VHD 3230 B Slim",    brand: "Intelbras", category: "Câmeras",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2022-09/vhd-3230-b-sl-articulada_0.png" },
  { name: "Câmera Dome VHD 3230 D Slim",      brand: "Intelbras", category: "Câmeras",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2022-09/vhd-3230-d-sl-frontal.png" },
  { name: "Câmera Dual Color VHD 5240",       brand: "Intelbras", category: "Câmeras",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2024-04/vhd-5240-dual-color-%2B-persp-esq-2.png" },
  // DVR / NVR
  { name: "DVR HDCVI 3008",                   brand: "Intelbras", category: "DVR / NVR",          image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2019-01/hdcvi_3008_frente.png?itok=0d7DbK9f" },
  { name: "Gravador XBP 400 HD",              brand: "Intelbras", category: "DVR / NVR",          image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/integration/xbp_400_hd_persp_esq.png?itok=Fc9fd2EI" },
  { name: "NVR XPE 3200 Plus IP",             brand: "Intelbras", category: "DVR / NVR",          image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2025-09/xpe-3200-plus-ip_0.png?itok=J-kFoCQV" },
  // Alarmes
  { name: "Sensor Ativo Barreira 30m",        brand: "Dtech",     category: "Alarmes",            image: "https://isf.com.br/wp-content/uploads/2020/10/SENSOR-BARREIRA-ATIVO-DUPLO-FEIXE-30MTS-PB-30HD-AJUSTE-A-LASER-DETECTOR-IMP-.jpg" },
  { name: "Sensor IVP 8000",                  brand: "Intelbras", category: "Alarmes",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2023-01/ivp_8000_front%201000px.png?itok=lquTZN5z" },
  { name: "Teclado de Alarme XAT 4000 LCD",  brand: "Intelbras", category: "Alarmes",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2019-01/xat_4000_lcd_front.png?itok=dago6Tg_" },
  { name: "Sirene BLA 2200",                  brand: "Intelbras", category: "Alarmes",            image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/integration/bla_2200_front_aceso.png?itok=vVKeowmH" },
  { name: "Sensor Infravermelho IVA 7100 Hexa", brand: "Intelbras", category: "Alarmes",          image: "https://isf.com.br/wp-content/uploads/2020/10/SENSOR-ATIVO-IVA-7100-HEXA.jpg" },
  // Cerca Elétrica
  { name: "Central de Cerca Elétrica",        brand: "ISF",       category: "Cerca Elétrica",     image: "https://isf.com.br/wp-content/uploads/2020/10/Central-de-cerca-eletrica.jpg" },
  { name: "Módulo de Choque",                 brand: "ISF",       category: "Cerca Elétrica",     image: "https://isf.com.br/wp-content/uploads/2020/10/Modulo-de-choque.jpg" },
  { name: "Haste Industrial Alumínio 25x25",  brand: "Confiseg",  category: "Cerca Elétrica",     image: "https://isf.com.br/wp-content/uploads/2020/10/HASTE-INDUSTRIAL-ALUMINIO-25X25-1.00-MT-6-ISOL-%E2%80%93-CONFISEG.jpg" },
  { name: "Cabo de Aço Galvanizado 100m",     brand: "Vonder",    category: "Cerca Elétrica",     image: "https://isf.com.br/wp-content/uploads/2020/10/CABO-DE-ACO-AF-ALMA-DE-FIBRA-GALVANIZADO-1-16-6X7-100MTS-.jpg" },
  // Controle de Acesso
  { name: "Leitor Facial FR 330 EXT",         brand: "Intelbras", category: "Controle de Acesso", image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/integration/fr_330_ext_front_led.png?itok=eymWt2dR" },
  { name: "Leitor Biométrico SS 420 MF",      brand: "Intelbras", category: "Controle de Acesso", image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2019-01/ss_420_mf_front_03.png?itok=XRtJvua4" },
  { name: "Leitor Facial SS 3540 MF Face EX", brand: "Intelbras", category: "Controle de Acesso", image: "https://backend.intelbras.com/sites/default/files/styles/medium/public/2022-03/ss-3540-mf-face-ex-frontal.png?itok=patXGbfM" },
  { name: "Controle Remoto XAC 4000",         brand: "Intelbras", category: "Controle de Acesso", image: "https://isf.com.br/wp-content/uploads/2020/10/Controle-remoto-XAC-4000-Smart-control.jpg" },
];

const blogPosts = [
  {
    date: "Mar 2025",
    title: "5 sinais de que sua câmera de segurança está desatualizada",
    excerpt: "Tecnologia avança rápido. Descubra se o seu sistema ainda oferece proteção real.",
    readTime: "4 min",
    content: `A segurança do seu imóvel depende diretamente da qualidade e atualidade do sistema de monitoramento instalado. Câmeras antigas podem criar uma falsa sensação de proteção — e é justamente aí que mora o perigo.

Neste artigo, listamos cinco sinais concretos de que chegou a hora de atualizar o seu sistema de câmeras.

1. Resolução de imagem baixa

Se as imagens gravadas são pixeladas ou embaçadas, o sistema não é capaz de identificar rostos, placas de veículos ou detalhes importantes em caso de incidente. Sistemas modernos oferecem resolução Full HD ou 4K, com nitidez suficiente para uso como prova em processos judiciais.

2. Ausência de visão noturna ou visão noturna colorida

Câmeras antigas só oferecem infravermelho monocromático com alcance limitado. As novas gerações contam com tecnologias como Dual Light e Color Night Vision, que entregam imagens coloridas mesmo em ambientes com pouca luz.

3. Armazenamento local sem backup em nuvem

Se o seu DVR ou NVR fica fisicamente no local monitorado, um ladrão experiente pode simplesmente levá-lo junto. Sistemas atuais permitem backup automático em nuvem ou armazenamento remoto, garantindo que as imagens estejam protegidas independentemente do que aconteça no local.

4. Sem acesso remoto pelo celular

Não consegue acompanhar as câmeras em tempo real pelo smartphone? Isso é um sinal claro de obsolescência. Hoje, qualquer sistema de entrada já permite visualização ao vivo, receber alertas de movimento e acessar gravações de qualquer lugar do mundo.

5. Falta de integração com alarmes e controle de acesso

Um sistema de segurança eficiente é integrado: câmeras, alarmes, cercas elétricas e controle de acesso funcionam em conjunto. Se o seu sistema trabalha de forma isolada, você está perdendo eficiência e capacidade de resposta.

Se você identificou um ou mais desses sinais no seu sistema atual, entre em contato com a ISF para uma avaliação técnica gratuita. Nossa equipe pode recomendar as melhores soluções para o seu perfil de imóvel e orçamento.`,
  },
  {
    date: "Fev 2025",
    title: "Cerca elétrica: mitos e verdades que todo proprietário deve saber",
    excerpt: "Esclareça as dúvidas mais comuns antes de instalar sua cerca elétrica.",
    readTime: "5 min",
    content: `A cerca elétrica é um dos sistemas de segurança perimetral mais eficazes disponíveis no mercado. Mesmo assim, ainda existe muita desinformação sobre seu funcionamento, segurança e legalidade. Vamos esclarecer os principais pontos.

MITO: Cerca elétrica mata pessoas e animais.

VERDADE: Sistemas instalados adequadamente por empresas certificadas, como a ISF, utilizam pulsos elétricos de alta tensão, mas baixíssima corrente (amperes). O efeito é um choque doloroso e temporariamente incapacitante — não letal. As normas brasileiras (ABNT NBR 15791) regulamentam os limites de corrente exatamente para garantir a segurança de pessoas e animais.

MITO: Cerca elétrica é ilegal no Brasil.

VERDADE: É completamente legal quando instalada em conformidade com as normas técnicas e as legislações municipais. A maioria das cidades regulamenta a altura mínima de instalação (geralmente acima de 2,5 metros do nível do solo) e exige sinalização de advertência.

MITO: Chuva e umidade tornam o sistema perigoso para quem passar perto.

VERDADE: Sistemas corretamente instalados são projetados para operar em todas as condições climáticas. Os isoladores e a eletrônica de controle são preparados para suportar chuva, umidade e variações de temperatura.

VERDADE: Manutenção periódica é indispensável.

Cercas elétricas expostas ao tempo, vegetação em crescimento e pequenos animais demandam inspeções regulares. A ISF oferece contratos de manutenção preventiva que garantem o funcionamento contínuo e a vida útil prolongada do equipamento.

VERDADE: A cerca elétrica é mais eficaz quando integrada a outros sistemas.

O potencial máximo da cerca elétrica é atingido quando ela está integrada a alarmes, câmeras e monitoramento 24 horas. Um toque na cerca pode acionar automaticamente câmeras na região afetada e notificar a central de monitoramento — tudo em milissegundos.

Tem dúvidas sobre a instalação de cerca elétrica no seu imóvel? Fale com nossos especialistas.`,
  },
  {
    date: "Jan 2025",
    title: "Como escolher o sistema de alarme ideal para seu imóvel",
    excerpt: "Residencial, comercial ou industrial — cada espaço pede uma solução diferente.",
    readTime: "6 min",
    content: `Escolher o sistema de alarme certo para o seu imóvel não é simplesmente comprar o modelo mais caro ou o mais barato disponível. É entender as características do espaço, os riscos específicos e os recursos necessários para uma proteção eficaz.

Neste guia, apresentamos os principais critérios de escolha para cada tipo de imóvel.

IMÓVEIS RESIDENCIAIS

Para casas e apartamentos, a prioridade é o equilíbrio entre proteção e praticidade. Os moradores precisam conseguir armar e desarmar o sistema facilmente, sem disparos falsos frequentes.

Recomendamos sistemas com:
- Sensores infravermelhos de dupla tecnologia (evitam falsos alarmes por pets ou variações de temperatura)
- Teclado LCD ou por aplicativo no celular
- Sirene externa audível
- Comunicação com central de monitoramento via IP ou linha telefônica (com backup)

IMÓVEIS COMERCIAIS

Lojas, escritórios e pequenos comércios têm necessidades específicas: grande circulação de pessoas durante o dia e total segurança no período fechado.

Pontos essenciais:
- Zonas de alarme separadas por área (loja, depósito, escritório)
- Sensores de abertura em portas e janelas, além de sensores de movimento
- Integração com câmeras para verificação remota de disparos
- Controle de acesso nas entradas principais

IMÓVEIS INDUSTRIAIS E GALPÕES

Galpões e indústrias apresentam desafios únicos: grandes áreas abertas, pé-direito alto e presença de máquinas que podem gerar interferência nos sensores.

Soluções recomendadas:
- Sensores de barreira ativa (feixe infravermelho) para perímetros externos
- Câmeras com análise de vídeo inteligente (detecção de intrusão por IA)
- Central de alarme de alta capacidade com múltiplas zonas
- Monitoramento 24 horas com protocolo de resposta definido

O PAPEL DO MONITORAMENTO REMOTO

Independentemente do tipo de imóvel, conectar o alarme a uma central de monitoramento profissional multiplica a eficácia do sistema. Em caso de disparo, a central verifica a situação, contata o responsável e aciona as autoridades se necessário — tudo de forma rápida e estruturada.

A ISF realiza avaliações técnicas gratuitas para ajudá-lo a escolher a solução ideal. Entre em contato e agende uma visita.`,
  },
];

async function main() {
  console.log("Iniciando seed...");

  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.createMany({ data: products });
    console.log(`✓ ${products.length} produtos inseridos`);
  } else {
    console.log(`! Produtos já existem (${existingProducts}), pulando seed de produtos`);
  }

  const existingPosts = await prisma.blogPost.count();
  if (existingPosts === 0) {
    await prisma.blogPost.createMany({ data: blogPosts });
    console.log(`✓ ${blogPosts.length} artigos inseridos`);
  } else {
    console.log(`! Artigos já existem (${existingPosts}), pulando seed de blog`);
  }

  console.log("Seed concluído!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
