# Canonical & Noindex Audit

**Data:** 2026-04-03

## Problema identificado

Com a ativação de `trailingSlash: true` (commit 73dec96), o Next.js passou a servir todas as URLs com barra final (`/alarmes-curitiba/`). Porém, as tags canonical permaneceram sem barra (`/alarmes-curitiba`), criando uma discrepância: o Google acessa a versão com barra mas a canonical aponta para a versão sem barra — exatamente as "8 páginas com canonical apontando para URL errada" no Search Console.

## Canonicals corrigidas

Todas as URLs foram atualizadas de `/slug` para `/slug/` em dois lugares por arquivo: `alternates.canonical` e `openGraph.url`.

| Arquivo | Antes | Depois |
|---------|-------|--------|
| `app/alarmes-curitiba/page.js` | `.../alarmes-curitiba` | `.../alarmes-curitiba/` |
| `app/cameras-seguranca-curitiba/page.js` | `.../cameras-seguranca-curitiba` | `.../cameras-seguranca-curitiba/` |
| `app/cerca-eletrica-curitiba/page.js` | `.../cerca-eletrica-curitiba` | `.../cerca-eletrica-curitiba/` |
| `app/controle-de-acesso-curitiba/page.js` | `.../controle-de-acesso-curitiba` | `.../controle-de-acesso-curitiba/` |
| `app/monitoramento-curitiba/page.js` | `.../monitoramento-curitiba` | `.../monitoramento-curitiba/` |
| `app/video-monitoramento-curitiba/page.js` | `.../video-monitoramento-curitiba` | `.../video-monitoramento-curitiba/` |
| `app/app-de-seguranca/page.js` | `.../app-de-seguranca` | `.../app-de-seguranca/` |
| `app/blog/page.js` | `.../blog` | `.../blog/` |
| `app/produtos/page.js` | `.../produtos` | `.../produtos/` |
| `app/blog/[id]/page.js` | `.../blog/${slug}` | `.../blog/${slug}/` |
| `app/produtos/[id]/page.js` | `.../produtos/${slug}` | `.../produtos/${slug}/` |

**Não alterado:** `app/layout.js` — canonical da homepage `https://isf.com.br` fica sem barra (raiz é tratada diferente).

## Auditoria de noindex

**Resultado: nenhuma página de conteúdo tem noindex.**

| Local | Configuração | Classificação |
|-------|-------------|---------------|
| `app/layout.js` | `robots: { index: true, follow: true }` | Correto — indexação global ativa |
| `app/robots.js` | `disallow: ["/admin", "/api/"]` | Intencional — admin e API bloqueados |
| Páginas de serviço | Sem robots → herda layout | Correto |
| `app/blog/[id]/page.js` | Sem robots → herda layout | Correto |
| `app/produtos/[id]/page.js` | Sem robots → herda layout | Correto |

Nenhum noindex acidental encontrado. As 4 páginas "Excluídas pela tag noindex" no Search Console provavelmente são rotas `/admin/*` ou `/api/*` — bloqueios intencionais.

## Estado atual das canonicals

- Todas as páginas públicas têm `alternates.canonical` self-referencing com trailing slash
- Geração é automática nas páginas dinâmicas (blog, produtos) via template literal
- Novas páginas de serviço devem seguir o padrão: `alternates: { canonical: "https://isf.com.br/[slug]/" }`
