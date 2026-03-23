/**
 * Generates BreadcrumbList JSON-LD schema for SEO.
 * Usage: <BreadcrumbSchema items={[{ name: "Home", url: "https://isf.com.br" }, { name: "Blog" }]} />
 * The last item should NOT have a url (current page).
 */
export default function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
