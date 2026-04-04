# Redirects 301 Implementados

**Data:** 2026-04-03

## Problema

8 URLs reportadas com erro 404 no Google Search Console precisavam de redirecionamentos permanentes (301) para preservar o equity de SEO e eliminar os erros de rastreamento.

## Mapeamento De → Para

| URL de origem (sem barra / com barra) | Destino | Motivo |
|---------------------------------------|---------|--------|
| `/produtos/camaera-im7-full-360` `/produtos/camaera-im7-full-360/` | `/cameras-seguranca-curitiba/` | Câmera descontinuada — redirecionada para a página de categoria CFTV mais próxima |
| `/produtos/gravador-xbp-400-hd` `/produtos/gravador-xbp-400-hd/` | `/cameras-seguranca-curitiba/` | Gravador de vídeo (DVR/NVR) — pertence à categoria câmeras/CFTV |
| `/produtos/central-de-cerca-eletrica` `/produtos/central-de-cerca-eletrica/` | `/cerca-eletrica-curitiba/` | Produto de cerca elétrica — página de serviço correspondente |
| `/produtos/sensor-ativo-barreira-30m` `/produtos/sensor-ativo-barreira-30m/` | `/alarmes-curitiba/` | Sensor de barreira ativa — pertence à categoria alarmes |
| `/produtos/3` `/produtos/3/` | `/produtos/` | ID numérico inválido sem produto correspondente no novo site |
| `/produtos/c-2` `/produtos/c-2/` | `/produtos/` | Slug inválido sem produto correspondente no novo site |

## URLs cobertas por catch-alls existentes (sem nova regra necessária)

| URL | Regra catch-all que cobre | Destino |
|-----|--------------------------|---------|
| `/produtos/cerca-eletrica/modulo-de-choque/` | `/produtos/:cat/:slug+` | `/produtos/` |
| `/produtos/alarmes/central-vw16z-ip-kit-star/amp/` | `/produtos/:cat/:slug+/amp/` | `/` |

## Implementação

Todas as regras foram adicionadas em `next.config.mjs` dentro da função `redirects()`, **antes** dos catch-alls genéricos de produtos aninhados para garantir precedência correta.

Cada URL recebeu dois registros: sem barra final e com barra final (ex: `/slug` e `/slug/`), para garantir que ambas as variantes sejam redirecionadas independentemente do formato que o Google rastreou.

## Verificação pós-deploy

```bash
curl -I https://isf.com.br/produtos/camaera-im7-full-360/
curl -I https://isf.com.br/produtos/gravador-xbp-400-hd/
curl -I https://isf.com.br/produtos/central-de-cerca-eletrica/
curl -I https://isf.com.br/produtos/sensor-ativo-barreira-30m/
curl -I https://isf.com.br/produtos/3/
curl -I https://isf.com.br/produtos/c-2/
```

Cada URL deve retornar `HTTP/2 301` com `location:` apontando para o destino correto.
