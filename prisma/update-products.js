const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updates = [
  // ─── CÂMERAS ────────────────────────────────────────────────────────────────
  {
    name: "Câmera Bullet VHL 1220 B",
    description:
      "Câmera bullet HDCVI Full HD 1080p da linha VHL, ideal para monitoramento externo com alcance de infravermelho de até 20 metros. Design compacto e resistente a intempéries (IP66), suportando chuva, poeira e variações de temperatura.\n" +
      "Lente fixa de 2,8mm com amplo ângulo de visão. Compatível com DVRs HDCVI da Intelbras, permite transmissão de vídeo, áudio e controle via cabo coaxial sem infraestrutura adicional.\n" +
      "Ideal para fachadas, estacionamentos, garagens e perímetros externos de imóveis residenciais e comerciais.",
    video: "https://www.youtube.com/watch?v=nfWmC1LE4Vs",
    images: JSON.stringify([]),
  },
  {
    name: "Câmera Dome VHL 1220 D",
    description:
      "Câmera dome HDCVI Full HD 1080p com design discreto e compacto, perfeita para instalação em ambientes internos. Visão noturna infravermelha de até 20 metros garante imagens nítidas mesmo sem iluminação.\n" +
      "Lente fixa de 2,8mm com ângulo de visão de aproximadamente 95°. Certificação IP66 garante proteção contra poeira e jatos d'água, permitindo uso em áreas externas protegidas.\n" +
      "Compatível com gravadores HDCVI, AHD e analógicos da Intelbras. Indicada para corredores, recepções, lojas e ambientes comerciais.",
    video: "https://www.youtube.com/watch?v=nfWmC1LE4Vs",
    images: JSON.stringify([]),
  },
  {
    name: "Speed Dome VHD 5220 SD",
    description:
      "Câmera Speed Dome HDCVI Full HD 1080p com zoom óptico 20x e rotação horizontal de 360° contínua — ideal para monitoramento de grandes áreas como pátios, estacionamentos e perímetros industriais.\n" +
      "Controle PTZ (Pan, Tilt, Zoom) realizado diretamente via cabo coaxial HDCVI, sem necessidade de cabeamento adicional para controle. Inclinação vertical de até 90° e velocidade de posicionamento de até 80°/s.\n" +
      "Suporte a 220 pré-posições programáveis, funções de patrulha automática e zoom digital de até 16x. Resistente a intempéries (IP66) para uso em ambientes externos.",
    video: "https://www.youtube.com/watch?v=gCC0Ks1gIjU",
    images: JSON.stringify([]),
  },
  {
    name: "Câmera Bullet VHD 3230 B Slim",
    description:
      "Câmera bullet HDCVI Full HD 1080p da linha Slim com tecnologia Starlight — capaz de produzir imagens coloridas em ambientes com luminosidade mínima, sem a necessidade de iluminação adicional.\n" +
      "Alcance infravermelho de até 30 metros. Design articulado permite ajustar o ângulo de visão após a fixação, facilitando a instalação em posições difíceis. Corpo em alumínio com acabamento slim e resistência IP67.\n" +
      "Lente varifocal de 2,7 a 13,5mm para ajuste preciso do campo de visão. Compatível com DVRs HDCVI da linha Professional Intelbras.",
    video: "https://www.youtube.com/watch?v=EM0g0cSrALI",
    images: JSON.stringify([]),
  },
  {
    name: "Câmera Dome VHD 3230 D Slim",
    description:
      "Câmera dome HDCVI Full HD 1080p linha Slim com tecnologia Starlight para captação de imagens coloridas em ambientes escuros. Acabamento em alumínio com perfil ultrafino e design discreto.\n" +
      "Infravermelhos de até 30 metros. Lente varifocal 2,7 a 13,5mm permite ajuste do campo de visão sem troca de lente. Indicada para corredores, halls de entrada, lojas e ambientes que exijam estética apurada.\n" +
      "Proteção IP67 contra poeira e imersão em água. Compatível com gravadores HDCVI, AHD e analógicos da Intelbras.",
    video: "https://www.youtube.com/watch?v=EM0g0cSrALI",
    images: JSON.stringify([]),
  },
  {
    name: "Câmera Dual Color VHD 5240",
    description:
      "Câmera HDCVI Full HD 1080p com tecnologia Dual Light — combina LED infravermelho para visão noturna tradicional e LED branco para imagens noturnas coloridas, sem necessidade de iluminação externa adicional.\n" +
      "Lente varifocal 2,7 a 13,5mm com ajuste motorizado. A tecnologia Dual Color garante que, em situações de baixa luminosidade, as imagens sejam capturadas em cores reais, facilitando a identificação de pessoas, veículos e objetos.\n" +
      "Ideal para entradas, garagens, estacionamentos e qualquer área onde a identificação noturna seja crítica. Resistência IP67 para uso em ambientes externos.",
    video: "https://www.youtube.com/watch?v=gmA-gALEjhM",
    images: JSON.stringify([]),
  },

  // ─── DVR / NVR ──────────────────────────────────────────────────────────────
  {
    name: "DVR HDCVI 3008",
    description:
      "Gravador digital de vídeo 8 canais HDCVI com suporte a resolução Full HD 1080p em todos os canais simultaneamente. Compatível com câmeras HDCVI, AHD, CVBS e IP, oferecendo flexibilidade para ampliar ou modernizar sistemas existentes.\n" +
      "Interface intuitiva com acesso via browser ou app iSIC para visualização e gravação remota em tempo real. Suporte a HD de até 10TB para armazenamento de longa duração.\n" +
      "Inclui detecção inteligente de movimentos por zona, gravação programada e notificação por e-mail em caso de eventos. Saídas de vídeo VGA e HDMI para monitoramento local.",
    video: "https://www.youtube.com/watch?v=awW9ymXDsdA",
    images: JSON.stringify([]),
  },
  {
    name: "Gravador XBP 400 HD",
    description:
      "Gravador compacto de 4 canais Full HD, projetado para instalações residenciais e pequenos comércios que necessitam de uma solução simples, eficiente e de fácil uso.\n" +
      "Compatível com câmeras HDCVI, AHD, CVBS e IP. Acesso remoto via app para smartphone permite monitoramento em tempo real de qualquer lugar com conexão à internet.\n" +
      "Suporte a armazenamento em HD de até 6TB. Gravação contínua, por agendamento ou acionada por movimento. Saída HDMI para monitoramento em TV ou monitor.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "NVR XPE 3200 Plus IP",
    description:
      "Gravador de vídeo em rede (NVR) IP com suporte a câmeras de até 8 megapixels. Compatível com câmeras IP do padrão ONVIF, garantindo integração com equipamentos de diversas marcas.\n" +
      "Acesso remoto via app iSIC com visualização ao vivo, reprodução e download de gravações. Suporte a detecção inteligente de eventos como intrusão de zona, travessia de linha e detecção facial.\n" +
      "Ideal para sistemas de médio e grande porte que demandam alta resolução de imagem e integração com câmeras IP. Suporte a disco rígido de até 10TB.",
    video: "",
    images: JSON.stringify([]),
  },

  // ─── ALARMES ────────────────────────────────────────────────────────────────
  {
    name: "Sensor Ativo Barreira 30m",
    description:
      "Sensor de barreira ativa com duplo feixe infravermelho e alcance de até 30 metros entre emissor e receptor. Disparo de alarme somente quando ambos os feixes são interrompidos simultaneamente, reduzindo drasticamente falsos alarmes por pássaros, folhas ou vento.\n" +
      "Ajuste fino do alinhamento via laser, garantindo precisão na instalação mesmo em longas distâncias. Resistente a intempéries — ideal para perímetros externos, muros, portões e galpões.\n" +
      "Saída de relé compatível com qualquer central de alarme do mercado. Tensão de alimentação 12Vcc. Certificação IP65 para uso externo.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "Sensor IVP 8000",
    description:
      "Sensor de presença PIR (infravermelho passivo) da linha 8000, com cobertura de até 12 metros e ângulo de detecção de 90°. Tecnologia antimascaramento impede que criminosos cubram o sensor para anular sua função.\n" +
      "Proteção antissabotagem integrada: aciona alarme imediatamente se o sensor for removido ou danificado. Compatível com as centrais de alarme Intelbras das linhas iON, AMT e XAM.\n" +
      "Alta imunidade a interferências de luz solar, lâmpadas fluorescentes e variações de temperatura. Instalação em parede ou teto. Indicado para ambientes internos residenciais e comerciais.",
    video: "https://www.youtube.com/watch?v=8r0_wo_7mFw",
    images: JSON.stringify([]),
  },
  {
    name: "Teclado de Alarme XAT 4000 LCD",
    description:
      "Teclado de comando com display LCD retroiluminado para controle intuitivo de centrais de alarme Intelbras. Compatível com as centrais das linhas iON e AMT via barramento RS-485.\n" +
      "Exibe informações em tempo real: zonas abertas, estado do sistema (armado/desarmado), falhas e eventos registrados. Até 8 zonas de acionamento direto via teclas dedicadas.\n" +
      "Design moderno e resistente. Permite armar e desarmar o sistema, programar partições e acessar o histórico de eventos sem necessidade de notebook ou computador. Ideal para residências e pequenos comércios.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "Sirene BLA 2200",
    description:
      "Sirene de alarme de alta potência com LED de advertência incorporado para sinalização visual e sonora simultânea. Potência sonora de até 110 dB — audível a grande distância para dissuadir invasores e alertar vizinhos.\n" +
      "Bateria interna recarregável garante o funcionamento por até 30 minutos mesmo sem energia elétrica (sabotagem do circuito). Invólucro resistente com mecanismo antiabertura e antiviolação.\n" +
      "Compatível com centrais de alarme Intelbras e da maioria dos fabricantes do mercado. Tensão de alimentação 12Vcc. Indicada para instalação externa em fachadas e muros.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "Sensor Infravermelho IVA 7100 Hexa",
    description:
      "Sensor PIR com tecnologia Hexa — seis elementos piroelétricos dispostos em configuração exclusiva para detecção mais precisa e ampla cobertura. Reduz substancialmente falsos alarmes causados por animais de estimação de até 20 kg.\n" +
      "Alcance de 12 metros com ângulo de detecção de 90°. Lens segmentada proporciona detecção em múltiplas camadas, eliminando pontos cegos. Imunidade a interferências de luz solar e lâmpadas fluorescentes.\n" +
      "Compatível com centrais de alarme da Intelbras e do mercado em geral. Ideal para residências com pets e ambientes com grande variação de temperatura.",
    video: "",
    images: JSON.stringify([]),
  },

  // ─── CERCA ELÉTRICA ─────────────────────────────────────────────────────────
  {
    name: "Central de Cerca Elétrica",
    description:
      "Central de controle para sistemas de cerca elétrica residenciais e comerciais. Gera pulsos de alta tensão e baixa corrente (conforme ABNT NBR 15791) que causam choque doloroso e temporariamente incapacitante — não letal.\n" +
      "Sinalização luminosa de estado: armado, desarmado e corte de fio. Alimentação bivolt (110/220V) com proteção contra sobrecarga e curto-circuito. Saída para sirene integrada ativada automaticamente no corte do fio.\n" +
      "Compatível com teclados de controle remoto e sistemas de monitoramento. Instalação em paralelo com central de alarme para notificação imediata de eventos perimetrais.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "Módulo de Choque",
    description:
      "Módulo gerador de pulsos elétricos para expansão ou reposição em sistemas de cerca elétrica existentes. Pulsos de alta tensão e baixíssima corrente, em conformidade com a norma ABNT NBR 15791 para segurança de pessoas e animais.\n" +
      "Permite configurar múltiplas zonas de cerca em um único sistema, com monitoramento independente por setor. Integração com centrais de alarme via saída de relé seco.\n" +
      "Alimentação 12Vcc. Invólucro robusto para instalação em caixas de proteção externas. Indicado para projetos de cerca elétrica de médio e grande porte.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "Haste Industrial Alumínio 25x25",
    description:
      "Haste para cerca elétrica em alumínio anodizado de perfil quadrado 25x25mm com 1 metro de comprimento e 6 isoladores inclusos. Material nobre que oferece alta resistência à corrosão e durabilidade em ambientes externos.\n" +
      "Isoladores em polipropileno de alta resistência dielétrica para garantir a integridade do sistema. Compatível com todos os tipos de fio, cabo de aço galvanizado e fio de aço inox para cerca elétrica.\n" +
      "Fixação em muros de alvenaria, concreto ou estruturas metálicas. Ideal para perímetros industriais e comerciais que demandam robustez e resistência mecânica superior.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "Cabo de Aço Galvanizado 100m",
    description:
      "Cabo de aço com alma de fibra, galvanizado, bitola 1/16\" (1,6mm), composição 6x7 fios. Rolo com 100 metros para projetos de cerca elétrica de médio e grande porte.\n" +
      "O processo de galvanização a quente garante proteção duradoura contra oxidação mesmo em ambientes externos com alta umidade e exposição solar. Alta resistência à tração para suportar tensionamento adequado da cerca.\n" +
      "Utilizado tanto para a condução dos pulsos elétricos quanto para estruturação e delimitação perimetral. Compatível com todos os sistemas de cerca elétrica do mercado.",
    video: "",
    images: JSON.stringify([]),
  },

  // ─── CONTROLE DE ACESSO ──────────────────────────────────────────────────────
  {
    name: "Leitor Facial FR 330 EXT",
    description:
      "Leitor biométrico facial para ambientes externos com reconhecimento em menos de 1 segundo mesmo com máscara, óculos ou chapéu. Suporte a até 3.000 templates faciais armazenados localmente.\n" +
      "Tecnologia anti-spoofing (Anti-Fake) impede o uso de fotos ou vídeos para enganar o sistema. LED de status colorido e buzzer informam o resultado da autenticação em tempo real.\n" +
      "Certificação IP65 para uso em ambientes externos com chuva e poeira. Interfaces de comunicação: Wiegand 26/34, RS-485 e TCP/IP. Saída relé para acionamento de cancelas, fechaduras e portões.",
    video: "",
    images: JSON.stringify([]),
  },
  {
    name: "Leitor Biométrico SS 420 MF",
    description:
      "Controlador de acesso com leitura biométrica de impressão digital e cartão MIFARE (MF). Suporte a até 500 templates de digitais e 500 cartões de proximidade armazenados localmente.\n" +
      "Display LCD retroiluminado e teclado numérico para entrada de senha como método alternativo ou complementar de autenticação. Interface Wiegand 26 para integração com controladoras de acesso e sistemas de terceiros.\n" +
      "Alimentação 12Vcc. Saída relé para acionamento de fechaduras elétricas, catracas e portões. Ideal para controle de acesso em condomínios, escritórios e áreas restritas.",
    video: "https://www.youtube.com/watch?v=-hGzmoFOT4o",
    images: JSON.stringify([]),
  },
  {
    name: "Leitor Facial SS 3540 MF Face EX",
    description:
      "Controlador de acesso facial de alto desempenho para ambientes externos, com reconhecimento facial ultrarrápido e tecnologia Anti-Fake de terceira geração que detecta e rejeita tentativas de fraude com fotos, vídeos ou máscaras 3D.\n" +
      "Suporte a até 3.000 templates faciais e 10.000 cartões MIFARE. Múltiplos métodos de autenticação: facial, cartão, digital ou combinação de dois fatores para maior segurança.\n" +
      "Interfaces TCP/IP, RS-485 e Wiegand 26/34 para integração com os principais sistemas de controle de acesso. Certificação IP65 para uso externo. Saída relé para cancelas, fechaduras e portões automáticos.",
    video: "https://www.youtube.com/watch?v=6-ph-pdSVUs",
    images: JSON.stringify([]),
  },
  {
    name: "Controle Remoto XAC 4000",
    description:
      "Controle remoto de alta segurança para acionamento de centrais de alarme, cancelas, portões e sistemas de acesso. Tecnologia de código rotativo (rolling code) — o código de transmissão muda a cada acionamento, impedindo clonagem por captura de sinal.\n" +
      "Alcance de até 100 metros em campo aberto. Compatível com as centrais de alarme Intelbras das linhas iON e AMT, além de módulos de acionamento remoto XAM. Frequência de operação 433MHz.\n" +
      "Design ergonômico com 4 botões programáveis para diferentes funções (armar, desarmar, ativar cancela, acionar sirene). Bateria de longa duração com indicador de carga baixa.",
    video: "",
    images: JSON.stringify([]),
  },
];

async function main() {
  console.log("Iniciando atualização de produtos...");
  let updated = 0;
  let notFound = 0;

  for (const u of updates) {
    const result = await prisma.product.updateMany({
      where: { name: u.name },
      data: {
        description: u.description,
        video: u.video,
        images: u.images,
      },
    });
    if (result.count > 0) {
      updated += result.count;
      console.log(`  ✓ ${u.name}`);
    } else {
      notFound++;
      console.log(`  ✗ NÃO ENCONTRADO: ${u.name}`);
    }
  }

  console.log(`\nConcluído: ${updated} produtos atualizados, ${notFound} não encontrados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
