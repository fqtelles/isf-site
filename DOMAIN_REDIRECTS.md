# Domain Redirect Rules

All traffic is consolidated to `https://isf.com.br` (sem www, com HTTPS).

## Regras implementadas

| Origem | Destino | Status | Camada |
|--------|---------|--------|--------|
| `http://isf.com.br/*` | `https://isf.com.br/*` | 301 | Nginx |
| `http://www.isf.com.br/*` | `https://isf.com.br/*` | 301 | Nginx |
| `https://www.isf.com.br/*` | `https://isf.com.br/*` | 301 | Nginx |
| qualquer `www.*` ou `http` | `https://isf.com.br/*` | 301 | `proxy.ts` (fallback) |

## Arquivos relevantes

- **`nginx/isf-site.conf`** — blocos `server` para porta 80 (www e non-www) e 443 (www)
- **`proxy.ts`** — fallback para ambientes sem Nginx (Vercel, dev local com proxy reverso)
- **`next.config.mjs`** — redirects de path legados (WordPress); não lida com hostname

## Certificado SSL

O certbot deve cobrir ambos os domínios para que o redirect `https://www → https://` funcione sem aviso de segurança.

Verificar no servidor:
```bash
certbot certificates | grep Domains
# Esperado: isf.com.br www.isf.com.br
```

Se não cobrir www ainda:
```bash
certbot --nginx --expand -d isf.com.br -d www.isf.com.br
```

## HTTP/2

O Nginx do projeto deve anunciar HTTP/2 nos blocos HTTPS de `isf.com.br` e `www.isf.com.br`:

```nginx
listen 443 ssl http2;
```

Verificar no servidor:

```bash
nginx -t
systemctl reload nginx

curl --http2 -I https://isf.com.br
curl --http2 -I https://www.isf.com.br
```

Esperado:
- Negociação HTTP/2 no domínio canônico
- Redirect `301` de `https://www.isf.com.br` para `https://isf.com.br`
- Certificado válido para ambos os hosts

Validação externa:
- [KeyCDN HTTP/2 Test](https://tools.keycdn.com/http2-test)

## Verificação

```bash
# Todos devem retornar 301 → https://isf.com.br/
curl -sI http://isf.com.br       | grep -E "HTTP|Location"
curl -sI http://www.isf.com.br   | grep -E "HTTP|Location"
curl -sI https://www.isf.com.br  | grep -E "HTTP|Location"

# Deve retornar 200
curl -sI https://isf.com.br      | grep "HTTP"

# Verificar preservação de caminho
curl -sI http://www.isf.com.br/cameras-seguranca-curitiba | grep Location
# Esperado: Location: https://isf.com.br/cameras-seguranca-curitiba
```
