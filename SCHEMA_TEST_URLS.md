# Schema Test URLs — Produto (Product)

Valide cada URL no **Google Rich Results Test**:
https://search.google.com/test/rich-results

## Como obter as URLs para testar

1. Acesse o painel admin: https://isf.com.br/admin/
2. Liste os produtos e copie os slugs
3. Monte a URL: `https://isf.com.br/produtos/{slug}/`

## Template de URL

```
https://isf.com.br/produtos/{slug}/
```

## O que verificar no Rich Results Test

- ✅ Tipo detectado: **Product**
- ✅ Campos presentes: `name`, `brand`, `description`, `image`, `offers`
- ✅ `offers.availability` = InStock
- ✅ Nenhum erro vermelho
- ✅ Nenhum aviso sobre `aggregateRating` ausente (não é campo obrigatório)

## Schema implementado (referência)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Nome do produto]",
  "description": "[Descrição técnica]",
  "brand": { "@type": "Brand", "name": "[Marca]" },
  "manufacturer": { "@type": "Organization", "name": "[Marca/Fabricante]" },
  "category": "[Categoria]",
  "image": "[URL da imagem]",
  "url": "https://isf.com.br/produtos/[slug]/",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "BRL",
    "price": "0",
    "seller": {
      "@type": "Organization",
      "name": "ISF Segurança Eletrônica",
      "url": "https://isf.com.br"
    }
  }
}
```

## Notas

- `price: "0"` é tecnicamente válido para catálogos onde o preço é obtido por contato
- `aggregateRating` não é obrigatório — sua ausência não gera erro, apenas impede rich snippet de estrelas
- O campo `seller` está dentro de `offers` (era o erro anterior: estava fora)
- `manufacturer` é o mesmo que `brand` enquanto não houver distinção no cadastro
