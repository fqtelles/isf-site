import Link from "next/link";

export const metadata = {
  title: "Página não encontrada | ISF Segurança Eletrônica",
  description: "A página que você procura não existe ou foi movida.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        fontFamily: "var(--font-inter), 'Helvetica Neue', Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div
          style={{
            fontSize: "6rem",
            fontWeight: 800,
            color: "#126798",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1a1d20",
            marginBottom: 12,
          }}
        >
          Página não encontrada
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#6b7280",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          A página que você procura não existe, foi removida ou o endereço pode
          estar incorreto.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              background: "#126798",
              color: "#fff",
              border: "none",
              padding: "13px 28px",
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Voltar ao início
          </Link>
          <Link
            href="/#contato"
            style={{
              background: "transparent",
              color: "#126798",
              border: "2px solid #126798",
              padding: "11px 28px",
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Fale conosco
          </Link>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: "#9ca3af",
              marginBottom: 16,
            }}
          >
            Páginas populares:
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Alarmes", href: "/alarmes-curitiba" },
              { label: "Câmeras", href: "/cameras-seguranca-curitiba" },
              { label: "Produtos", href: "/produtos" },
              { label: "Blog", href: "/blog" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.82rem",
                  color: "#126798",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
