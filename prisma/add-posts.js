const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const newPosts = [
  {
    date: "Mar 2026",
    title: "Monitoramento 24h vs. alarme sem monitoramento: qual realmente protege?",
    excerpt: "Ter um alarme não é o mesmo que estar protegido. Entenda a diferença que pode mudar tudo.",
    readTime: "5 min",
    content: `Muita gente instala um alarme e acredita que o imóvel está protegido. E de fato, um alarme é uma ótima barreira dissuasiva. Mas existe uma diferença fundamental entre um alarme que dispara e some no silêncio e um sistema que aciona uma resposta real.

O QUE ACONTECE QUANDO O ALARME DISPARA SEM MONITORAMENTO

A sirene toca. Vizinhos olham pela janela, talvez alguém ligue para você. Mas e se você estiver dormindo, em uma reunião, ou simplesmente não ouvir a notificação no celular?

Pesquisas mostram que a maioria dos disparos de alarme não gera nenhuma resposta em menos de 10 minutos — tempo mais do que suficiente para um invasor concluir o que veio fazer e desaparecer.

O QUE MUDA COM O MONITORAMENTO 24 HORAS

Com um contrato de monitoramento ativo, o sinal do alarme chega instantaneamente à central de operações, onde um operador treinado:

1. Verifica o tipo de evento (disparo de movimento, abertura de zona, pânico)
2. Tenta contato imediato com o responsável pelo imóvel
3. Se não houver confirmação de falso alarme, aciona Guarda Municipal, PM ou empresa de ronda — em minutos

Esse processo acontece 24 horas por dia, inclusive nos feriados que você passa viajando com a família.

QUANTO CUSTA A DIFERENÇA

Um alarme básico sem monitoramento pode custar entre R$ 800 e R$ 2.000 instalado. O monitoramento mensal adiciona um custo acessível — e elimina o ponto cego mais perigoso do sistema: a ausência de resposta.

A equação é simples: o alarme inibe o invasor. O monitoramento garante a resposta quando a inibição não foi suficiente.

O QUE A ISF OFERECE

Monitoramos alarmes das principais marcas (Intelbras, JFL, DSC, Paradox) via IP com backup GSM — mesmo se a internet cair, o sinal chega à nossa central. Nossos planos são sem fidelidade e incluem instalação do módulo de comunicação.

Está na hora de transformar seu alarme em um sistema completo. Solicite um orçamento gratuito e veja como o monitoramento pode se encaixar no seu orçamento.`,
  },
  {
    date: "Fev 2026",
    title: "Por que câmeras de segurança não impedem furtos — e o que realmente impede",
    excerpt: "Câmeras registram. Sistemas integrados protegem. Veja qual é a diferença na prática.",
    readTime: "6 min",
    content: `A câmera de segurança virou símbolo de proteção. Todo imóvel que se preocupa com segurança tem pelo menos uma. Mas existe uma ilusão perigosa que precisa ser desmontada: câmeras, sozinhas, não impedem furtos.

O QUE A CÂMERA FAZ (E O QUE NÃO FAZ)

Uma câmera registra o que acontece. Ela pode ajudar a identificar um suspeito após o fato, servir como prova para a polícia e até dissuadir oportunistas menos experientes.

O que ela não faz: ela não reage. Ela não avisa ninguém em tempo real. Ela não aciona uma sirene. Ela não chama a polícia.

Um invasor experiente sabe disso. Ele entra, age e sai antes que qualquer pessoa revise as imagens.

A PROTEÇÃO REAL VEM DA INTEGRAÇÃO

O que realmente impede uma invasão ou minimiza seus danos é a combinação de barreiras físicas e sistemas que reagem em tempo real:

DETECÇÃO: Sensores de movimento, abertura de portas e janelas, e câmeras com análise inteligente de vídeo identificam o invasor no momento em que ele tenta entrar.

INIBIÇÃO: Sirenes externas, cerca elétrica e iluminação automática criam barreiras que dificultam e assustam — a maioria dos invasores abandona a ação diante de resistência sonora e visual.

RESPOSTA: Um sistema conectado a uma central de monitoramento 24h garante que a ação humana (polícia, ronda, segurança) seja acionada em minutos — e não horas depois, quando você revisa as gravações.

O QUE FAZER SE VOCÊ JÁ TEM CÂMERAS

Se você já possui câmeras instaladas, o próximo passo lógico é:

1. Verificar se elas têm resolução adequada (mínimo Full HD) para identificação
2. Garantir que há detecção de movimento configurada com notificações no celular
3. Integrar com um alarme e, idealmente, com monitoramento 24h

Câmeras sem alarme são evidência. Câmeras com alarme e monitoramento são proteção.

A ISF realiza diagnóstico gratuito do seu sistema atual e recomenda as evoluções necessárias sem empurrar produtos desnecessários. Fale com nossa equipe.`,
  },
  {
    date: "Jan 2026",
    title: "Controle de acesso em condomínios: como reduzir furtos internos e conflitos",
    excerpt: "Prestadores, ex-moradores, acesso sem registro — veja como um sistema moderno resolve isso.",
    readTime: "5 min",
    content: `Condomínios residenciais e comerciais enfrentam um desafio de segurança específico e frequentemente subestimado: o problema não está sempre em quem vem de fora, mas em quem circula por dentro sem controle.

O PROBLEMA DO ACESSO SEM REGISTRO

Em condomínios com controle de acesso deficiente ou inexistente, é comum encontrar:

- Prestadores de serviço (encanadores, eletricistas, entregadores) circulando sem identificação registrada
- Ex-moradores ou ex-funcionários que ainda possuem cópia de chave ou código de acesso
- Visitantes que entram com um morador e saem sozinhos mais tarde
- Ausência de registro de quem estava no condomínio em determinado horário

Em caso de furto ou incidente, a investigação começa praticamente do zero.

COMO O CONTROLE DE ACESSO MODERNO RESOLVE

Sistemas atuais de controle de acesso resolvem esses problemas de forma prática:

CREDENCIAIS INDIVIDUAIS: Cada morador, funcionário e prestador cadastrado recebe uma credencial única (cartão, biometria ou facial). Não existe acesso "genérico" ou compartilhado.

BLOQUEIO IMEDIATO: Um morador saiu do condomínio? Funcionário foi dispensado? A credencial é bloqueada em segundos pelo software, sem necessidade de trocar fechaduras ou recolher chaves.

REGISTRO COMPLETO: Cada acesso — entrada ou saída, de qualquer ponto do condomínio — é registrado com data, hora e identidade. Em caso de incidente, o histórico está disponível em segundos.

INTEGRAÇÃO COM CÂMERAS: A câmera posicionada na catraca ou portão registra a imagem de quem passa, cruzando com o registro do controle de acesso.

RESULTADO PRÁTICO

Condomínios que implementam controle de acesso moderno relatam:

- Redução significativa de furtos internos
- Eliminação de conflitos sobre quem autorizou determinado acesso
- Melhora na percepção de segurança e valorização das unidades
- Facilidade no controle de prestadores e equipe de limpeza

A ISF projeta e instala sistemas de controle de acesso para condomínios de todos os portes em Curitiba e Região Metropolitana, com biometria, cartão de proximidade e reconhecimento facial. Solicite uma visita técnica gratuita.`,
  },
];

async function main() {
  console.log("Inserindo novos artigos...");
  for (const post of newPosts) {
    const created = await prisma.blogPost.create({ data: post });
    console.log(`✓ Artigo criado: "${created.title}" (id: ${created.id})`);
  }
  console.log("Concluído!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
