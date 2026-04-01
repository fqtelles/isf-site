# ISF Soluções em Segurança

Site institucional da **ISF Soluções em Segurança Eletrônica**, empresa fundada em 1988 em Curitiba/PR, especializada em sistemas de segurança eletrônica.

🔗 **[isf.com.br](https://isf.com.br)**

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Banco de dados | SQLite + Prisma 5 |
| Editor de texto | Tiptap 3 |
| E-mail | Resend |
| Deploy | VPS (Nginx + PM2) |

## Funcionalidades

### Páginas públicas

- **Home** — Carrossel hero, serviços, produtos em destaque, blog, estatísticas da empresa, logos de clientes, avaliações Google e FAQ
- **7 landing pages de serviços** — Alarmes, câmeras, cerca elétrica, controle de acesso, monitoramento 24h, vídeo monitoramento com IA e app de segurança
- **Catálogo de produtos** — 300+ produtos com filtro por categoria (Câmeras, DVR/NVR, Alarmes, Cerca Elétrica, Controle de Acesso)
- **Blog** — Artigos com editor rich text, imagem de capa e tempo de leitura
- **Formulário de contato** — Envio de e-mail via Resend com template HTML profissional
- **Sitemap dinâmico** e **robots.txt** — Gerados automaticamente com todos os produtos e posts

### SEO

- Meta tags OpenGraph e Twitter Card em todas as páginas
- Schema.org (LocalBusiness, FAQ, Service, Breadcrumb)
- Redirects 301 para URLs legadas do WordPress
- Preload de imagens LCP (hero desktop/mobile)
- Google Analytics 4

## Estrutura do projeto

```
app/
├── page.js                          # Home
├── layout.js                        # Layout raiz (metadata, GA4, schema)
├── alarmes-curitiba/                # Landing pages de serviços
├── cameras-seguranca-curitiba/
├── cerca-eletrica-curitiba/
├── controle-de-acesso-curitiba/
├── monitoramento-curitiba/
├── video-monitoramento-curitiba/
├── app-de-seguranca/
├── produtos/                        # Catálogo + página de produto
├── blog/                            # Listagem + página de artigo
├── admin/                           # Painel administrativo
├── components/                      # Componentes reutilizáveis
├── api/                             # Rotas de API
│   ├── admin/                       # Endpoints protegidos (CRUD, upload, export)
│   ├── contact/                     # Formulário de contato
│   ├── products/                    # Produtos (público)
│   ├── blog/                        # Blog (público)
│   └── uploads/                     # Servir arquivos enviados
├── sitemap.js
└── robots.js

prisma/
├── schema.prisma                    # Modelos: Product, BlogPost
└── seed.js                          # Dados iniciais

scripts/
├── setup-vps.sh                     # Setup inicial da VPS (Nginx, PM2, Node, SSL)
├── deploy.sh                        # Deploy automatizado (git pull → build → restart)
├── setup-backup.sh                  # Configuração do backup para Google Drive
├── backup-to-gdrive.sh             # Backup automático (banco, public/, configs)
└── restore-from-gdrive.sh          # Restauração interativa a partir do backup

nginx/
└── isf-site.conf                    # Reverse proxy com SSL e cache
```

