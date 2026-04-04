# Auditoria de Links Internos — isf.com.br

Data: 2026-04-04

## Problema identificado

38 páginas detectadas mas não indexadas no Search Console. Causa principal: linkagem interna insuficiente — o Google não considera essas páginas prioritárias o suficiente para indexar.

## Estado ANTES das melhorias

| Componente / Página | Links internos reais gerados (não âncoras) |
|---|---|
| SiteShell navbar | 1 (`/`) |
| SiteShell footer | 1 (`/`) — demais eram âncoras `/#servicos`, `/#blog`, etc. |
| HomeClient — seção serviços | 7 (uma por landing page) |
| HomeClient — seção produtos | dinâmico (cards de produto) |
| HomeClient — seção blog | dinâmico (cards de post) |
| Landing pages de serviço (7 páginas) | **0** links para outras páginas |
| ProductDetail | Related products por categoria (já existia) |

**Total estimado de links internos únicos (não âncoras): ~80**

## Melhorias implementadas

### 1. Footer — `app/components/SiteShell.js`

**Antes:** coluna "Navegação" com 6 itens, todos âncoras da homepage
**Depois:** coluna "Navegação" atualizada + nova coluna "Serviços" com 7 links diretos

Links adicionados ao footer (presentes em TODAS as páginas do site):

| Anchor text | URL |
|---|---|
| Produtos | `/produtos/` |
| Blog | `/blog/` |
| Alarmes Residenciais e Comerciais | `/alarmes-curitiba/` |
| Câmeras de Segurança CFTV | `/cameras-seguranca-curitiba/` |
| Cerca Elétrica | `/cerca-eletrica-curitiba/` |
| Controle de Acesso | `/controle-de-acesso-curitiba/` |
| Monitoramento 24h | `/monitoramento-curitiba/` |
| Vídeo Monitoramento com IA | `/video-monitoramento-curitiba/` |
| App de Segurança | `/app-de-seguranca/` |

**+9 links em todas as páginas** (efeito multiplicador: cada página do site agora distribui link juice para todas as landing pages de serviço)

### 2. Breadcrumb visual — `app/components/LandingPage.js`

Adicionado breadcrumb navegável no topo de cada landing page de serviço:

```
Início > Serviços > [Nome do Serviço]
```

- "Início" → `/`
- "Serviços" → `/#servicos`
- "[Nome]" → texto atual (sem link)

**+2 links por landing page × 7 páginas = 14 links adicionais**

### 3. Seção "Veja também" — `app/components/LandingPage.js` + 7 `page.js`

Adicionada seção com links contextuais entre o checklist e o FAQ em cada landing page:

| Página | Links "Veja também" |
|---|---|
| `/alarmes-curitiba/` | Câmeras de Segurança · Monitoramento 24h · Catálogo de Produtos |
| `/cameras-seguranca-curitiba/` | Vídeo Monitoramento com IA · Monitoramento 24h · Catálogo de Câmeras |
| `/cerca-eletrica-curitiba/` | Alarmes · Monitoramento 24h · Catálogo de Produtos |
| `/controle-de-acesso-curitiba/` | Câmeras de Segurança · Alarmes · Catálogo de Controle de Acesso |
| `/monitoramento-curitiba/` | Alarmes · Vídeo Monitoramento · Câmeras de Segurança |
| `/video-monitoramento-curitiba/` | Câmeras CFTV · Monitoramento 24h · Catálogo de Câmeras com IA |
| `/app-de-seguranca/` | Câmeras de Segurança · Alarmes · Monitoramento 24h |

**+3 links por landing page × 7 páginas = 21 links adicionais**

## Estado DEPOIS das melhorias

| Página | Links recebidos (estimado) |
|---|---|
| `/` | sem alteração (já bem linkada) |
| `/produtos/` | +9 (footer em todas as páginas) + 7 (relatedLinks das landing pages) |
| `/blog/` | +9 (footer em todas as páginas) |
| `/alarmes-curitiba/` | +9 (footer) + 3 (outras landing pages que linkam para ela) |
| `/cameras-seguranca-curitiba/` | +9 (footer) + 4 (outras landing pages) |
| `/cerca-eletrica-curitiba/` | +9 (footer) |
| `/controle-de-acesso-curitiba/` | +9 (footer) |
| `/monitoramento-curitiba/` | +9 (footer) + 4 (outras landing pages) |
| `/video-monitoramento-curitiba/` | +9 (footer) + 2 (outras landing pages) |
| `/app-de-seguranca/` | +9 (footer) |

**Total de links internos adicionados: ~44 (multiplicados pela quantidade de páginas)**

## O que não foi implementado nesta fase

- Links contextuais em posts do blog (requer editar conteúdo no DB da VPS)
- Links para slugs de produto específicos (slugs desconhecidos sem acesso ao DB local)
- Seção de categorias com filtro na homepage (filtros são client-side em ProductsGallery)

## Verificação pós-deploy

1. Inspecionar qualquer página → footer deve mostrar coluna "Serviços" com 7 links
2. Abrir qualquer landing page de serviço → topo deve mostrar breadcrumb "Início › Serviços › ..."
3. Rolar até após o checklist → deve aparecer seção "Veja também" com chips de link
4. Acompanhar Search Console → Coverage → "Discovered — currently not indexed" nas próximas semanas

## Referências

- Search Console → Cobertura → Descobertos — não indexados
- Google Search Console → Links → Links internos
