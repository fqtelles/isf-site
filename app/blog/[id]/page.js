import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import SiteShell from "../../components/SiteShell";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import { StatsStrip, ServiceLinks, BlogFaq, FinalCta, ConversionStyles } from "../../components/ConversionSections";
import BlogCta from "./BlogCta";
import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS = {
  allowedTags: [
    "p", "br",
    "h2", "h3", "h4",
    "strong", "b", "em", "i", "u", "s",
    "a",
    "ul", "ol", "li",
    "blockquote",
    "pre", "code",
  ],
  allowedAttributes: {
    "a": ["href", "target", "rel"],
    "p": ["style"],
    "h2": ["style"],
    "h3": ["style"],
    "h4": ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|center|right|justify)$/],
    },
  },
  // Força rel="noopener noreferrer" em links externos
  transformTags: {
    "a": (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
        ...(attribs.target === "_blank" ? { target: "_blank" } : {}),
      },
    }),
  },
};

export async function generateMetadata({ params }) {
  const { id: slugOrId } = await params;
  const post = await findPost(slugOrId);
  if (!post) return {};
  return {
    title: `${post.title} | ISF Segurança`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | ISF Segurança`,
      description: post.excerpt,
      url: `https://isf.com.br/blog/${post.slug || post.id}/`,
      siteName: "ISF Segurança Eletrônica",
      locale: "pt_BR",
      type: "article",
      images: [
        {
          url: post.coverImage || "https://isf.com.br/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: post.slug
      ? { canonical: `https://isf.com.br/blog/${post.slug}/` }
      : { canonical: `https://isf.com.br/blog/${post.id}/` },
  };
}

export default async function BlogPostPage({ params }) {
  const { id: slugOrId } = await params;

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

  let html;
  if (/<[a-z][\s\S]*?>/i.test(content)) {
    html = content;
  } else {
    // Legacy plain text: wrap each double-newline block in <p>
    html = content.split(/\n\n+/).filter(Boolean)
      .map((p) => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  return sanitizeHtml(html, SANITIZE_OPTIONS);
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
      name: "ISF Soluções em Segurança",
      url: "https://isf.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "ISF Soluções em Segurança",
      logo: {
        "@type": "ImageObject",
        url: "https://isf.com.br/og-image.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://isf.com.br/blog/${post.slug || post.id}`,
    },
  };

  return (
    <SiteShell>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://isf.com.br" },
        { name: "Blog", url: "https://isf.com.br/blog" },
        { name: post.title },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main style={{ background: "#f9fafb", minHeight: "60vh" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 5% 80px" }}>

          {/* Back + Breadcrumb */}
          <a href="/#blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#6b7280", textDecoration: "none", fontWeight: 500, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Voltar
          </a>

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
          <BlogCta postTitle={post.title} />
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
