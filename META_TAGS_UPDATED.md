# Meta Tags — Otimização de CTR

**Data:** 2026-04-03
**Objetivo:** Aumentar CTR nas buscas do Google (Search Console: 531 impressões, 29 cliques, CTR 5,5%)

---

## Páginas estáticas atualizadas

### Homepage — https://isf.com.br/

| | Antes | Depois |
|---|---|---|
| **Title** | ISF Soluções em Segurança \| Alarmes, Câmeras e Monitoramento em Curitiba *(72 chars, herdado do layout)* | ISF Soluções em Segurança \| Curitiba desde 1988 *(48 chars)* |
| **Description** | *(herdada do layout.js — genérica)* | Revenda autorizada Intelbras em Curitiba. Câmeras, alarmes, cerca elétrica, controle de acesso e monitoramento 24h. 35+ anos. Solicite orçamento grátis. *(150 chars)* |

**Observação:** `app/page.js` não tinha metadata própria. Adicionado `export const metadata` com title, description, openGraph e twitter completos.

---

### Câmeras de Segurança — https://isf.com.br/cameras-seguranca-curitiba/

| | Antes | Depois |
|---|---|---|
| **Title** | Câmeras de Segurança em Curitiba — CFTV e IP \| ISF Segurança Eletrônica *(72 chars)* | Câmeras de Segurança em Curitiba \| Full HD e 4K — ISF *(53 chars)* |
| **Description** | Instalação de câmeras de segurança CFTV e IP em Curitiba e Região Metropolitana. HD, Full HD, visão noturna, acesso remoto pelo celular. Orçamento gratuito. *(155 chars)* | Câmeras CFTV e IP Full HD e 4K com visão noturna e acesso pelo celular. Instalação em Curitiba e RMC. Revenda Intelbras. Orçamento grátis. *(137 chars)* |

---

### Alarmes — https://isf.com.br/alarmes-curitiba/

| | Antes | Depois |
|---|---|---|
| **Title** | Alarme Residencial e Empresarial em Curitiba \| ISF Segurança Eletrônica *(72 chars)* | Alarmes Residenciais e Comerciais em Curitiba \| ISF *(51 chars)* |
| **Description** | Instalação de alarmes residenciais e empresariais em Curitiba e Região Metropolitana. 35+ anos de experiência, revenda autorizada Intelbras. Orçamento gratuito. *(161 chars)* | Sistemas de alarme com monitoramento 24h para residências, empresas e condomínios em Curitiba. Técnicos certificados. Orçamento grátis. *(135 chars)* |

---

### App de Segurança — https://isf.com.br/app-de-seguranca/

| | Antes | Depois |
|---|---|---|
| **Title** | App de Segurança para Câmeras e Alarmes em Curitiba \| ISF Segurança Eletrônica *(78 chars)* | Monitore Câmeras e Alarmes pelo Celular em Curitiba \| ISF *(57 chars)* |
| **Description** | Acesse câmeras e alarmes pelo celular de qualquer lugar. A ISF configura o acesso remoto ao seu sistema de segurança em Curitiba. Orçamento gratuito. *(149 chars)* | Veja câmeras ao vivo, arme o alarme e receba alertas em tempo real pelo smartphone. A ISF configura o acesso remoto ao seu sistema em Curitiba e RMC. *(148 chars)* |

---

### Catálogo de Produtos — https://isf.com.br/produtos/

| | Antes | Depois |
|---|---|---|
| **Title** | Catálogo de Produtos \| ISF Segurança Eletrônica *(47 chars)* | Catálogo de Produtos de Segurança Eletrônica \| ISF Curitiba *(59 chars)* |
| **Description** | Catálogo completo de produtos de segurança eletrônica: câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. Revenda autorizada Intelbras em Curitiba. *(160 chars)* | Câmeras, alarmes, DVR/NVR, cerca elétrica e controle de acesso. 300+ produtos. Revenda Intelbras. Instalação em Curitiba. Consulte disponibilidade. *(147 chars)* |

---

### Blog — https://isf.com.br/blog/

| | Antes | Depois |
|---|---|---|
| **Title** | Blog — Dicas de Segurança Eletrônica \| ISF Segurança Eletrônica *(63 chars)* | Blog de Segurança Eletrônica \| Dicas e Artigos — ISF *(52 chars)* |
| **Description** | Artigos e dicas sobre câmeras de segurança, alarmes, cerca elétrica e controle de acesso. Conteúdo especializado da ISF — 35 anos protegendo Curitiba. *(151 chars)* | Artigos sobre câmeras, alarmes, cerca elétrica e controle de acesso da equipe ISF. Dicas para proteger residências e empresas em Curitiba. *(138 chars)* |

---

## Páginas não alteradas (já conformes)

| Página | Title atual | Chars |
|---|---|---|
| /cerca-eletrica-curitiba/ | Cerca Elétrica em Curitiba — Instalação e Manutenção \| ISF Segurança Eletrônica | 80 (longo, mas diferenciado) |
| /controle-de-acesso-curitiba/ | Controle de Acesso em Curitiba — Biometria e Cartão \| ISF Segurança Eletrônica | 79 (longo, mas diferenciado) |
| /monitoramento-curitiba/ | Monitoramento de Alarmes 24h em Curitiba \| ISF Segurança Eletrônica | 66 (aceitável) |
| /video-monitoramento-curitiba/ | Vídeo Monitoramento com Inteligência Artificial em Curitiba \| ISF Segurança Eletrônica | 85 (longo) |

**Nota:** Cerca, Controle de Acesso e Vídeo Monitoramento têm titles longos. Se o CTR dessas páginas também for baixo em futuras análises, podem ser otimizados na próxima rodada.

---

## Páginas de produto dinâmicas — /produtos/[slug]/

### Template anterior
- **Title:** `{nome} — ISF Segurança Eletrônica`
- **Description (fallback):** `{nome} da {marca}. Adquira com a ISF, revenda autorizada em Curitiba.`

### Template novo
- **Title:** `{nome} — {categoria} | ISF`  *(ex: "Paradox IP150 — Controle de Acesso | ISF")*
- **Description (fallback):** `{nome} {marca} disponível no catálogo ISF. Instalação profissional em Curitiba e RMC. Consulte disponibilidade.`

**Benefícios:**
- Inclui a categoria no title → mais relevante para buscas por tipo de produto
- Fallback de description mais informativo e com sinal geográfico
- Produtos com descrição própria no banco continuam usando a descrição do cadastro

---

## Open Graph

Todas as páginas já tinham OG básico. Nesta atualização:
- `og:title` e `og:description` sincronizados com o novo `<title>` e `<meta description>`
- Adicionado `siteName: "ISF Segurança Eletrônica"` e `locale: "pt_BR"` nas páginas de serviço que estavam sem (alarmes, cameras, app-de-seguranca)
- `og:type: "article"` permanece em posts de blog individuais
- Imagem OG padrão: `https://isf.com.br/og-image.jpg` (1200×630)

---

## Página inexistente mencionada

- `/a-empresa/` — redireciona 301 para `/` (regra em `next.config.mjs`). Sem página própria.

---

## Consultas do Search Console × keywords no title

| Consulta | Impressões | Page | Keyword no title? |
|---|---|---|---|
| "isf" | 33 | Homepage | ✅ "ISF" presente |
| "isf curitiba" | 8 | Homepage | ✅ "ISF" + "Curitiba" |
| "segurança eletrônica" | 4 | Homepage/Produtos | ✅ "Segurança Eletrônica" |
| "paradox ip150" | 68 | /produtos/paradox-ip150/ | ✅ Nome no title dinâmico |
| "modulo ip 150 paradox" | 4 | /produtos/paradox-ip150/ | ✅ Nome no title dinâmico |
| "sensor rokonet" | 4 | /produtos/sensor-* | ✅ Nome no title dinâmico |
| "haste de aluminio para muro" | 7 | /produtos/haste-* | ✅ Nome no title dinâmico |
| "olho mágico digital intelbras eho 201" | 11 | /produtos/eho-201-* | ✅ Nome no title dinâmico |
