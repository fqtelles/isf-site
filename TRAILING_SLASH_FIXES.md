# Trailing Slash Standardization

Todos os links internos e URLs do sitemap foram padronizados para usar barra final (`/`).
A opção `trailingSlash: true` foi ativada no Next.js — qualquer URL sem barra recebe redirect 301 automático para a versão com barra.

## Regra global

`next.config.mjs` — `trailingSlash: true`

O Next.js passa a servir `/foo/` como canônico e redirecionar `/foo` → `/foo/` automaticamente para qualquer rota, incluindo rotas dinâmicas futuras.

## Arquivos modificados (6)

### next.config.mjs
- Adicionado `trailingSlash: true`
- Destinos de redirects atualizados para usar barra final:
  - `/controle-de-acesso-curitiba` → `/controle-de-acesso-curitiba/`
  - `/produtos` → `/produtos/` (2 ocorrências)
- Removido redirect `/produtos/` → `/produtos` (conflitava com trailingSlash)

### app/sitemap.js
- 9 URLs estáticas atualizadas para terminar com `/`:
  - `/alarmes-curitiba/`
  - `/cameras-seguranca-curitiba/`
  - `/cerca-eletrica-curitiba/`
  - `/controle-de-acesso-curitiba/`
  - `/monitoramento-curitiba/`
  - `/video-monitoramento-curitiba/`
  - `/app-de-seguranca/`
  - `/produtos/`
  - `/blog/`
- 2 templates dinâmicos atualizados:
  - `` /blog/${post.slug || post.id}/ ``
  - `` /produtos/${product.slug || product.id}/ ``

### app/HomeClient.js
- Array SERVICES: 7 hrefs atualizados (serviços de segurança)
- Link dinâmico de produto: `` /produtos/${p.slug || p.id}/ ``
- Link estático `/produtos` → `/produtos/`
- Link dinâmico de blog: `` /blog/${post.slug || post.id}/ ``
- Link estático `/blog` → `/blog/`

### app/produtos/ProductsGallery.js
- Link dinâmico: `` /produtos/${p.slug || p.id}/ ``

### app/blog/BlogGallery.js
- Link dinâmico: `` /blog/${post.slug || post.id}/ ``

### app/produtos/[id]/ProductDetail.js
- Produtos relacionados: `` /produtos/${p.slug || p.id}/ ``

## Verificação após deploy

```bash
# Deve retornar 301 → /produtos/
curl -sI https://isf.com.br/produtos | grep -E "HTTP|Location"

# Deve retornar 200
curl -sI https://isf.com.br/produtos/ | grep "HTTP"

# Testar rota de serviço
curl -sI https://isf.com.br/alarmes-curitiba | grep -E "HTTP|Location"

# Verificar sitemap
curl -s https://isf.com.br/sitemap.xml | grep "<loc>" | head -15
```
