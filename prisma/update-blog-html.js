const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

const posts = [
  {
    id: 4,
    content: [
      "<p>A segurança do seu imóvel depende diretamente da qualidade e atualidade do sistema de monitoramento instalado. <strong>Câmeras antigas podem criar uma falsa sensação de proteção</strong> — e é justamente aí que mora o perigo.</p>",
      "<p>Neste artigo, listamos cinco sinais concretos de que chegou a hora de atualizar o seu sistema de câmeras.</p>",
      "<h2>1. Resolução de imagem baixa</h2>",
      "<p>Se as imagens gravadas são <strong>pixeladas ou embaçadas</strong>, o sistema não é capaz de identificar rostos, placas de veículos ou detalhes importantes em caso de incidente. Sistemas modernos oferecem resolução <strong>Full HD ou 4K</strong>, com nitidez suficiente para uso como prova em processos judiciais.</p>",
      "<h2>2. Ausência de visão noturna ou visão noturna colorida</h2>",
      "<p>Câmeras antigas só oferecem infravermelho monocromático com alcance limitado. As novas gerações contam com tecnologias como <strong>Dual Light</strong> e <strong>Color Night Vision</strong>, que entregam imagens coloridas mesmo em ambientes com pouca luz.</p>",
      "<h2>3. Armazenamento local sem backup em nuvem</h2>",
      "<p>Se o seu DVR ou NVR fica fisicamente no local monitorado, um invasor experiente pode simplesmente <strong>levá-lo junto</strong>. Sistemas atuais permitem backup automático em nuvem ou armazenamento remoto, garantindo que as imagens estejam protegidas independentemente do que aconteça no local.</p>",
      "<h2>4. Sem acesso remoto pelo celular</h2>",
      "<p>Não consegue acompanhar as câmeras em tempo real pelo smartphone? Isso é um sinal claro de obsolescência. Hoje, qualquer sistema de entrada já permite <strong>visualização ao vivo</strong>, receber alertas de movimento e acessar gravações de qualquer lugar do mundo.</p>",
      "<h2>5. Falta de integração com alarmes e controle de acesso</h2>",
      "<p>Um sistema de segurança eficiente é <strong>integrado</strong>: câmeras, alarmes, cercas elétricas e controle de acesso funcionam em conjunto. Se o seu sistema trabalha de forma isolada, você está perdendo eficiência e capacidade de resposta.</p>",
      "<p>Se você identificou um ou mais desses sinais no seu sistema atual, <strong>entre em contato com a ISF para uma avaliação técnica gratuita</strong>. Nossa equipe pode recomendar as melhores soluções para o seu perfil de imóvel e orçamento.</p>",
    ].join("\n"),
  },
  {
    id: 5,
    content: [
      "<p>A cerca elétrica é um dos sistemas de segurança perimetral mais eficazes disponíveis no mercado. Mesmo assim, ainda existe muita desinformação sobre seu funcionamento, segurança e legalidade. <strong>Vamos esclarecer os principais pontos.</strong></p>",
      "<h2>Mito: Cerca elétrica mata pessoas e animais</h2>",
      "<p><strong>Verdade:</strong> Sistemas instalados adequadamente por empresas certificadas utilizam pulsos elétricos de alta tensão, mas <strong>baixíssima corrente (amperes)</strong>. O efeito é um choque doloroso e temporariamente incapacitante — não letal. As normas brasileiras (<strong>ABNT NBR 15791</strong>) regulamentam os limites exatamente para garantir a segurança de pessoas e animais.</p>",
      "<h2>Mito: Cerca elétrica é ilegal no Brasil</h2>",
      "<p><strong>Verdade:</strong> É completamente legal quando instalada em conformidade com as normas técnicas e as legislações municipais. A maioria das cidades regulamenta a <strong>altura mínima de instalação</strong> (geralmente acima de 2,5 metros do nível do solo) e exige sinalização de advertência.</p>",
      "<h2>Mito: Chuva e umidade tornam o sistema perigoso</h2>",
      "<p><strong>Verdade:</strong> Sistemas corretamente instalados são projetados para operar em <strong>todas as condições climáticas</strong>. Os isoladores e a eletrônica de controle são preparados para suportar chuva, umidade e variações de temperatura sem risco algum.</p>",
      "<h2>Verdade: Manutenção periódica é indispensável</h2>",
      "<p>Cercas elétricas expostas ao tempo, vegetação em crescimento e pequenos animais demandam <strong>inspeções regulares</strong>. A ISF oferece contratos de manutenção preventiva que garantem o funcionamento contínuo e a vida útil prolongada do equipamento.</p>",
      "<h2>Verdade: A cerca elétrica é mais eficaz quando integrada</h2>",
      "<p>O potencial máximo da cerca elétrica é atingido quando ela está integrada a <strong>alarmes, câmeras e monitoramento 24 horas</strong>. Um toque na cerca pode acionar automaticamente câmeras na região afetada e notificar a central de monitoramento — tudo em milissegundos.</p>",
      "<p>Tem dúvidas sobre a instalação de cerca elétrica no seu imóvel? <strong>Fale com nossos especialistas.</strong></p>",
    ].join("\n"),
  },
  {
    id: 6,
    content: [
      "<p>Escolher o sistema de alarme certo para o seu imóvel não é simplesmente comprar o modelo mais caro ou o mais barato disponível. É <strong>entender as características do espaço, os riscos específicos e os recursos necessários</strong> para uma proteção eficaz.</p>",
      "<p>Neste guia, apresentamos os principais critérios de escolha para cada tipo de imóvel.</p>",
      "<h2>Imóveis residenciais</h2>",
      "<p>Para casas e apartamentos, a prioridade é o equilíbrio entre <strong>proteção e praticidade</strong>. Os moradores precisam conseguir armar e desarmar o sistema facilmente, sem disparos falsos frequentes.</p>",
      "<p><strong>Recomendamos sistemas com:</strong></p>",
      "<ul><li>Sensores infravermelhos de <strong>dupla tecnologia</strong> (evitam falsos alarmes por pets)</li><li>Teclado LCD ou por <strong>aplicativo no celular</strong></li><li>Sirene externa audível</li><li>Comunicação via IP com backup GSM</li></ul>",
      "<h2>Imóveis comerciais</h2>",
      "<p>Lojas, escritórios e pequenos comércios têm necessidades específicas: <strong>grande circulação de pessoas durante o dia</strong> e total segurança no período fechado.</p>",
      "<ul><li>Zonas de alarme separadas por área (loja, depósito, escritório)</li><li>Sensores de abertura em portas e janelas</li><li><strong>Integração com câmeras</strong> para verificação remota de disparos</li><li>Controle de acesso nas entradas principais</li></ul>",
      "<h2>Imóveis industriais e galpões</h2>",
      "<p>Galpões e indústrias apresentam desafios únicos: grandes áreas abertas, pé-direito alto e presença de máquinas que podem gerar interferência nos sensores.</p>",
      "<ul><li>Sensores de barreira ativa (feixe infravermelho) para perímetros externos</li><li>Câmeras com <strong>análise de vídeo inteligente</strong> por IA</li><li>Central de alarme de alta capacidade com múltiplas zonas</li><li>Monitoramento 24 horas com protocolo de resposta definido</li></ul>",
      "<h2>O papel do monitoramento remoto</h2>",
      "<p>Independentemente do tipo de imóvel, conectar o alarme a uma <strong>central de monitoramento profissional</strong> multiplica a eficácia do sistema. Em caso de disparo, a central verifica a situação, contata o responsável e aciona as autoridades — tudo de forma rápida e estruturada.</p>",
      "<p>A ISF realiza <strong>avaliações técnicas gratuitas</strong>. Entre em contato e agende uma visita.</p>",
    ].join("\n"),
  },
  {
    id: 7,
    content: [
      "<p>Muita gente instala um alarme e acredita que o imóvel está protegido. E de fato, um alarme é uma ótima barreira dissuasiva. Mas existe uma diferença fundamental entre <strong>um alarme que dispara e some no silêncio</strong> e um sistema que aciona uma resposta real.</p>",
      "<h2>O que acontece quando o alarme dispara sem monitoramento</h2>",
      "<p>A sirene toca. Vizinhos olham pela janela, talvez alguém ligue para você. Mas e se você estiver dormindo, em uma reunião, ou simplesmente não ouvir a notificação no celular?</p>",
      "<p>Pesquisas mostram que <strong>a maioria dos disparos de alarme não gera nenhuma resposta em menos de 10 minutos</strong> — tempo mais do que suficiente para um invasor concluir o que veio fazer e desaparecer.</p>",
      "<h2>O que muda com o monitoramento 24 horas</h2>",
      "<p>Com um contrato de monitoramento ativo, o sinal do alarme chega instantaneamente à central de operações, onde um operador treinado:</p>",
      "<ol><li>Verifica o tipo de evento (disparo de movimento, abertura de zona, pânico)</li><li>Tenta <strong>contato imediato</strong> com o responsável pelo imóvel</li><li>Se não houver confirmação de falso alarme, aciona <strong>Guarda Municipal, PM ou empresa de ronda</strong> — em minutos</li></ol>",
      "<p>Esse processo acontece <strong>24 horas por dia</strong>, inclusive nos feriados que você passa viajando com a família.</p>",
      "<h2>Quanto custa a diferença</h2>",
      "<p>Um alarme básico sem monitoramento pode custar entre <strong>R$ 800 e R$ 2.000</strong> instalado. O monitoramento mensal adiciona um custo acessível — e elimina o ponto cego mais perigoso do sistema: <em>a ausência de resposta</em>.</p>",
      "<blockquote><p>O alarme inibe o invasor. O monitoramento garante a resposta quando a inibição não foi suficiente.</p></blockquote>",
      "<h2>O que a ISF oferece</h2>",
      "<p>Monitoramos alarmes das principais marcas (<strong>Intelbras, JFL, DSC, Paradox</strong>) via IP com backup GSM — mesmo se a internet cair, o sinal chega à nossa central. Nossos planos são <strong>sem fidelidade</strong> e incluem instalação do módulo de comunicação.</p>",
      "<p>Está na hora de transformar seu alarme em um sistema completo. <strong>Solicite um orçamento gratuito.</strong></p>",
    ].join("\n"),
  },
  {
    id: 8,
    content: [
      "<p>A câmera de segurança virou símbolo de proteção. Todo imóvel que se preocupa com segurança tem pelo menos uma. Mas existe <strong>uma ilusão perigosa que precisa ser desmontada</strong>: câmeras, sozinhas, não impedem furtos.</p>",
      "<h2>O que a câmera faz (e o que não faz)</h2>",
      "<p>Uma câmera <strong>registra</strong> o que acontece. Ela pode ajudar a identificar um suspeito após o fato, servir como prova para a polícia e até dissuadir oportunistas menos experientes.</p>",
      "<p><strong>O que ela não faz:</strong> ela não reage. Ela não avisa ninguém em tempo real. Ela não aciona uma sirene. Ela não chama a polícia.</p>",
      "<p>Um invasor experiente sabe disso. Ele entra, age e sai antes que qualquer pessoa revise as imagens.</p>",
      "<h2>A proteção real vem da integração</h2>",
      "<p>O que realmente impede uma invasão — ou minimiza seus danos — é a combinação de <strong>barreiras físicas e sistemas que reagem em tempo real</strong>:</p>",
      "<h3>Detecção</h3>",
      "<p>Sensores de movimento, abertura de portas e janelas, e câmeras com <strong>análise inteligente de vídeo</strong> identificam o invasor no momento em que ele tenta entrar.</p>",
      "<h3>Inibição</h3>",
      "<p>Sirenes externas, cerca elétrica e iluminação automática criam barreiras que dificultam e assustam — <strong>a maioria dos invasores abandona a ação</strong> diante de resistência sonora e visual.</p>",
      "<h3>Resposta</h3>",
      "<p>Um sistema conectado a uma <strong>central de monitoramento 24h</strong> garante que a ação humana (polícia, ronda, segurança) seja acionada em minutos — e não horas depois, quando você revisa as gravações.</p>",
      "<h2>O que fazer se você já tem câmeras</h2>",
      "<ol><li>Verificar se elas têm <strong>resolução adequada</strong> (mínimo Full HD) para identificação</li><li>Garantir que há <strong>detecção de movimento</strong> configurada com notificações no celular</li><li>Integrar com um <strong>alarme</strong> e, idealmente, com <strong>monitoramento 24h</strong></li></ol>",
      "<blockquote><p>Câmeras sem alarme são evidência. Câmeras com alarme e monitoramento são proteção.</p></blockquote>",
      "<p>A ISF realiza <strong>diagnóstico gratuito</strong> do seu sistema atual e recomenda as evoluções necessárias. <strong>Fale com nossa equipe.</strong></p>",
    ].join("\n"),
  },
  {
    id: 9,
    content: [
      "<p>Condomínios residenciais e comerciais enfrentam um desafio de segurança específico e frequentemente subestimado: <strong>o problema não está sempre em quem vem de fora, mas em quem circula por dentro sem controle.</strong></p>",
      "<h2>O problema do acesso sem registro</h2>",
      "<p>Em condomínios com controle de acesso deficiente ou inexistente, é comum encontrar:</p>",
      "<ul><li>Prestadores de serviço circulando <strong>sem identificação registrada</strong></li><li>Ex-moradores ou ex-funcionários que ainda possuem cópia de chave ou código de acesso</li><li>Visitantes que entram com um morador e <strong>saem sozinhos mais tarde</strong></li><li>Ausência de registro de quem estava no condomínio em determinado horário</li></ul>",
      "<p>Em caso de furto ou incidente, <strong>a investigação começa praticamente do zero.</strong></p>",
      "<h2>Como o controle de acesso moderno resolve</h2>",
      "<h3>Credenciais individuais</h3>",
      "<p>Cada morador, funcionário e prestador cadastrado recebe uma <strong>credencial única</strong> (cartão, biometria ou facial). Não existe acesso genérico ou compartilhado.</p>",
      "<h3>Bloqueio imediato</h3>",
      "<p>Funcionário dispensado? A credencial é <strong>bloqueada em segundos</strong> pelo software, sem necessidade de trocar fechaduras ou recolher chaves físicas.</p>",
      "<h3>Registro completo</h3>",
      "<p>Cada acesso é <strong>registrado com data, hora e identidade</strong>. Em caso de incidente, o histórico está disponível em segundos.</p>",
      "<h3>Integração com câmeras</h3>",
      "<p>A câmera posicionada na catraca ou portão registra a imagem de quem passa, <strong>cruzando com o registro do controle de acesso</strong> — criando uma prova visual vinculada à identidade.</p>",
      "<h2>Resultado prático</h2>",
      "<ul><li><strong>Redução significativa</strong> de furtos internos</li><li>Eliminação de conflitos sobre quem autorizou determinado acesso</li><li>Melhora na percepção de segurança e <strong>valorização das unidades</strong></li><li>Facilidade no controle de prestadores e equipe de limpeza</li></ul>",
      "<p>A ISF projeta e instala sistemas para condomínios de todos os portes, com <strong>biometria, cartão de proximidade e reconhecimento facial</strong>. <strong>Solicite uma visita técnica gratuita.</strong></p>",
    ].join("\n"),
  },
];

async function run() {
  for (const post of posts) {
    await p.blogPost.update({ where: { id: post.id }, data: { content: post.content } });
    console.log("Updated post", post.id);
  }
  console.log("All done!");
}

run();
