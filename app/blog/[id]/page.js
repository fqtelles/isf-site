import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import SiteShell from "../../components/SiteShell";
import { StatsStrip, ServiceLinks, BlogFaq, FinalCta, ConversionStyles } from "../../components/ConversionSections";

export async function generateMetadata({ params }) {
  const slugOrId = params.id;
  const post = await findPost(slugOrId);
  if (!post) return {};
  return {
    title: `${post.title} | ISF Segurança Eletrônica`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | ISF Segurança Eletrônica`,
      description: post.excerpt,
      url: `https://isf.com.br/blog/${post.slug || post.id}`,
      siteName: "ISF Segurança Eletrônica",
      locale: "pt_BR",
      type: "article",
      images: [
        {
          url: post.coverImage || "https://isf.com.br/wp-content/uploads/2020/10/home-1dobra-m.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: post.slug
      ? { canonical: `https://isf.com.br/blog/${post.slug}` }
      : { canonical: `https://isf.com.br/blog/${post.id}` },
  };
}

export default async function BlogPostPage({ params }) {
  const slugOrId = params.id;

  // Numeric ID → permanent redirect to slug URL (SEO 301)
  if (/^\d+$/.test(slugOrId)) {
    const post = await prisma.blogPost.findUnique({ where: { id: parseInt(slugOrId, 10) } });
    if (!post) notFound();
    if (post.slug) permanentRedirect(`/blog/${post.slug}`);
    // fallback if slug not yet set
    return renderPost(post);
  }

  // Slug lookup
  const post = await prisma.blogPost.findFirst({ where: { slug: slugOrId } });
  if (!post) notFound();
  return renderPost(post);
}

async function findPost(slugOrId) {
  if (/^\d+$/.test(slugOrId)) {
    return prisma.blogPost.findUnique({ where: { id: parseInt(slugOrId, 10) } });
  }
  return prisma.blogPost.findFirst({ where: { slug: slugOrId } });
}

/** Convert content to HTML — handles both legacy plain-text and new rich HTML */
function contentToHtml(content) {
  if (!content || !content.trim()) return "";
  // New content from TipTap already contains HTML tags
  if (/<[a-z][\s\S]*?>/i.test(content)) return content;
  // Legacy plain text: wrap each double-newline block in <p>
  return content.split(/\n\n+/).filter(Boolean)
    .map((p) => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function renderPost(post) {
  const bodyHtml = contentToHtml(post.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: {
      "@type": "Organization",
      name: "ISF Segurança Eletrônica",
      url: "https://isf.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "ISF Segurança Eletrônica",
      logo: {
        "@type": "ImageObject",
        url: "https://isf.com.br/wp-content/uploads/2020/09/ISF_SolucoesEmSeguranca_Logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://isf.com.br/blog/${post.slug || post.id}`,
    },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main style={{ background: "#f9fafb", minHeight: "60vh" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 5% 80px" }}>

          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 32,
              fontSize: "0.8rem",
              color: "#6b7280",
              flexWrap: "wrap",
            }}
          >
            <a href="/" style={{ color: "#126798" }}>Home</a>
            <span>›</span>
            <a href="/#blog" style={{ color: "#126798" }}>Blog</a>
            <span>›</span>
            <span style={{ color: "#1a1d20", fontWeight: 600 }}>{post.title}</span>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280" }}>
              {post.date}
            </span>
            <span style={{ color: "#d1d5db" }}>·</span>
            <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {post.readTime} de leitura
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, lineHeight: 1.25, margin: "0 0 20px", color: "#111827" }}>
            {post.title}
          </h1>

          {/* Cover Image */}
          {post.coverImage && (
            <div style={{ margin: "0 0 36px", borderRadius: 12, overflow: "hidden", lineHeight: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          {/* Excerpt */}
          <p style={{ fontSize: "1.08rem", lineHeight: 1.65, color: "#374151", fontWeight: 400, margin: "0 0 36px", paddingBottom: 32, borderBottom: "1px solid #e5e7eb" }}>
            {post.excerpt}
          </p>

          {/* Body */}
          {bodyHtml ? (
            <>
              <style>{`
                .blog-content { font-size: 1rem; line-height: 1.85; color: #374151; }
                .blog-content p { margin: 0 0 22px; }
                .blog-content h2 { font-size: 1.5rem; font-weight: 800; color: #111827; margin: 40px 0 16px; line-height: 1.3; }
                .blog-content h3 { font-size: 1.15rem; font-weight: 700; color: #1a1d20; margin: 32px 0 12px; }
                .blog-content h4 { font-size: 1rem; font-weight: 700; color: #32373c; margin: 24px 0 8px; }
                .blog-content strong { font-weight: 700; color: #1a1d20; }
                .blog-content em { font-style: italic; }
                .blog-content s { text-decoration: line-through; }
                .blog-content u { text-decoration: underline; }
                .blog-content a { color: #126798; text-decoration: underline; }
                .blog-content a:hover { color: #0d5280; }
                .blog-content ul, .blog-content ol { padding-left: 26px; margin: 0 0 22px; }
                .blog-content li { margin-bottom: 8px; }
                .blog-content blockquote { border-left: 4px solid #126798; padding: 12px 20px; background: #f0f7fc; border-radius: 0 8px 8px 0; color: #374151; font-style: italic; margin: 28px 0; }
                .blog-content blockquote p { margin: 0; }
                .blog-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.88em; color: #1a1d20; }
                .blog-content pre { background: #1a1d20; color: #f9fafb; padding: 18px 20px; border-radius: 10px; overflow-x: auto; margin: 0 0 22px; }
                .blog-content pre code { background: none; padding: 0; color: inherit; font-size: 0.88rem; }
                .blog-content [style*="text-align: center"] { text-align: center; }
                .blog-content [style*="text-align: right"] { text-align: right; }
                .blog-content [style*="text-align: justify"] { text-align: justify; }
              `}</style>
              <article
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </>
          ) : (
            <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.9rem" }}>
              Conteúdo completo em breve.
            </p>
          )}

          {/* CTA */}
          <div style={{ marginTop: 56, padding: "32px", background: "#f0f7fc", border: "1px solid #c5ddef", borderRadius: 12 }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1d20", marginBottom: 8 }}>
              Precisa de segurança eletrônica em Curitiba?
            </p>
            <p style={{ fontSize: "0.88rem", color: "#6b7280", lineHeight: 1.65, marginBottom: 20 }}>
              A ISF Segurança Eletrônica atende Curitiba e Região Metropolitana há mais de 35 anos. Solicite um orçamento gratuito.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="https://api.whatsapp.com/send?phone=5541999919191&text=Ol%C3%A1%2C%20li%20um%20artigo%20no%20blog%20e%20gostaria%20de%20um%20or%C3%A7amento!"
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25d366", color: "#fff", padding: "11px 24px", borderRadius: 9999, fontWeight: 600, fontSize: "0.88rem" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" style={{ display: "block", flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
              <a href="/#contato" style={{ display: "inline-block", background: "#126798", color: "#fff", padding: "11px 24px", borderRadius: 9999, fontWeight: 600, fontSize: "0.88rem" }}>
                Solicitar orçamento grátis →
              </a>
            </div>
          </div>
        </div>
      </main>

      <ConversionStyles />
      <StatsStrip headline="ISF Soluções em Segurança — 35+ anos protegendo famílias e empresas em Curitiba" />
      <ServiceLinks />
      <BlogFaq />
      <FinalCta context={post.title} />
    </SiteShell>
  );
}
