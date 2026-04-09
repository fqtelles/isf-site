"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import styles from "../../home.module.css";

const BLOG_VISIBLE = 3;

export default function HomeBlogSection({ blogPosts }) {
  const [blogCarouselIndex, setBlogCarouselIndex] = useState(0);
  const blogMaxIndex = Math.max(0, Math.ceil(blogPosts.length / BLOG_VISIBLE) - 1);
  const blogTouchX = useRef(null);
  const blogTrackRef = useRef(null);
  const blogIndexRef = useRef(blogCarouselIndex);
  blogIndexRef.current = blogCarouselIndex;

  const prevSlide = () => setBlogCarouselIndex((index) => Math.max(0, index - 1));
  const nextSlide = () => setBlogCarouselIndex((index) => Math.min(blogMaxIndex, index + 1));

  const handleTouchStart = (e) => {
    blogTouchX.current = e.touches[0].clientX;
    if (blogTrackRef.current) blogTrackRef.current.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (blogTouchX.current === null) return;
    const dx = e.touches[0].clientX - blogTouchX.current;
    if (blogTrackRef.current) {
      blogTrackRef.current.style.transform = `translateX(calc(-${blogIndexRef.current * 100}% + ${dx}px))`;
    }
  };

  const handleTouchEnd = (e) => {
    if (blogTouchX.current === null) return;
    const dx = e.changedTouches[0].clientX - blogTouchX.current;
    if (blogTrackRef.current) blogTrackRef.current.style.transition = "";

    if (dx < -30) nextSlide();
    else if (dx > 30) prevSlide();
    else if (blogTrackRef.current) {
      blogTrackRef.current.style.transform = `translateX(-${blogIndexRef.current * 100}%)`;
    }

    blogTouchX.current = null;
  };

  return (
    <section id="blog" style={{ padding: "96px 5%", background: "#f9fafb", backgroundImage: "radial-gradient(rgba(18,103,152,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div className={styles["section-label"]}>Blog & Conteúdo</div>
          <div className={styles["divider"]} />
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#1a1d20", letterSpacing: "-0.02em" }}>Dicas de segurança</h2>
        </div>

        <div className={styles["carousel-outer"]} style={{ padding: "0 24px" }}>
          <button className={`${styles["carousel-btn"]} ${styles["carousel-btn-prev"]}`} onClick={prevSlide} disabled={blogCarouselIndex === 0} aria-label="Anterior">‹</button>
          <div className={styles["carousel-overflow"]} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ touchAction: "pan-y" }}>
            <div
              ref={blogTrackRef}
              className={styles["carousel-track"]}
              style={{ transform: `translateX(-${blogCarouselIndex * 100}%)` }}
            >
              {blogPosts.map((post) => (
                <div key={post.id} className={styles["blog-card-slide"]}>
                  <a href={`/blog/${post.slug || post.id}/`} className={styles["blog-card"]} style={{ padding: 0, overflow: "hidden" }}>
                    {post.coverImage && (
                      <div style={{ width: "100%", height: 160, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                        <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: "20px 22px 22px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                        <span style={{ fontSize: "0.75rem", color: "#32373c", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{post.date}</span>
                        <span style={{ fontSize: "0.75rem", color: "#4b5563", fontWeight: 600 }}>⏱ {post.readTime}</span>
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1d20", lineHeight: 1.45, marginBottom: 10 }}>{post.title}</h3>
                      <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.62, marginBottom: 18 }}>{post.excerpt}</p>
                      <span style={{ fontSize: "0.82rem", color: "#126798", fontWeight: 600 }}>Ler artigo →</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <button className={`${styles["carousel-btn"]} ${styles["carousel-btn-next"]}`} onClick={nextSlide} disabled={blogCarouselIndex >= blogMaxIndex} aria-label="Próximo">›</button>
        </div>

        <div className={styles["carousel-dots"]}>
          {Array.from({ length: blogMaxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`${styles["carousel-dot"]}${blogCarouselIndex === index ? ` ${styles.active}` : ""}`}
              onClick={() => setBlogCarouselIndex(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a
            href="/blog/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#126798",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: 9999,
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: "0.92rem",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(18,103,152,0.28)",
            }}
          >
            Ver todos os artigos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
