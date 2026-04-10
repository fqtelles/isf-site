"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "../../home.module.css";

const PRODUCT_CATEGORIES = [
  "Todos",
  "C\u00e2meras",
  "DVR / NVR",
  "Alarmes",
  "Cerca El\u00e9trica",
  "Controle de Acesso",
];
const DESKTOP_VISIBLE = 3;
const MOBILE_VISIBLE = 1;
const PRODUCT_BATCH = 12;

function chunkProducts(items, chunkSize) {
  const chunks = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

function getWindowRange(activeIndex, total) {
  let start = Math.max(0, activeIndex - 1);
  let end = Math.min(total, start + 3);
  start = Math.max(0, end - 3);

  return { start, end };
}

export default function HomeProductsSection({ products }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [carouselPage, setCarouselPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE);
  const [loadedCount, setLoadedCount] = useState(PRODUCT_BATCH);
  const [isPaused, setIsPaused] = useState(false);
  const prodTouchX = useRef(null);
  const prodTrackRef = useRef(null);
  const loadMoreRef = useRef(null);
  const trackOffsetRef = useRef(0);
  const autoPlayRef = useRef(null);

  const shuffledProducts = useMemo(() => {
    const items = [...products];

    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }

    const hasCameraFirst = items
      .slice(0, DESKTOP_VISIBLE)
      .some((product) => product.category === "C\u00e2meras");

    if (!hasCameraFirst) {
      const cameraIndex = items.findIndex((product) => product.category === "C\u00e2meras");

      if (cameraIndex !== -1) {
        const swapPosition = Math.floor(Math.random() * DESKTOP_VISIBLE);
        [items[swapPosition], items[cameraIndex]] = [items[cameraIndex], items[swapPosition]];
      }
    }

    return items;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Todos") return shuffledProducts;
    return shuffledProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory, shuffledProducts]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, loadedCount),
    [filteredProducts, loadedCount]
  );
  const productPages = useMemo(
    () => chunkProducts(visibleProducts, visibleCount),
    [visibleCount, visibleProducts]
  );
  const maxPage = Math.max(0, productPages.length - 1);
  const { start: windowStart, end: windowEnd } = getWindowRange(carouselPage, productPages.length);
  const windowPages = productPages.slice(windowStart, windowEnd);
  const windowOffset = carouselPage - windowStart;
  trackOffsetRef.current = windowOffset;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const syncVisibleCount = () => {
      setVisibleCount(mediaQuery.matches ? MOBILE_VISIBLE : DESKTOP_VISIBLE);
    };

    syncVisibleCount();
    mediaQuery.addEventListener("change", syncVisibleCount);
    return () => mediaQuery.removeEventListener("change", syncVisibleCount);
  }, []);

  useEffect(() => {
    setCarouselPage(0);
    setLoadedCount(Math.min(filteredProducts.length, PRODUCT_BATCH));
  }, [activeCategory, filteredProducts.length, visibleCount]);

  useEffect(() => {
    setCarouselPage((page) => Math.min(page, maxPage));
  }, [maxPage]);

  useEffect(() => {
    if (loadedCount >= filteredProducts.length) return;
    if (carouselPage < Math.max(0, maxPage - 1)) return;

    setLoadedCount((count) => Math.min(filteredProducts.length, count + PRODUCT_BATCH));
  }, [carouselPage, filteredProducts.length, loadedCount, maxPage]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || loadedCount >= filteredProducts.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadedCount((count) => Math.min(filteredProducts.length, count + PRODUCT_BATCH));
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredProducts.length, loadedCount]);

  const prevSlide = () => setCarouselPage((page) => (page === 0 ? maxPage : page - 1));
  const nextSlide = () => setCarouselPage((page) => (page >= maxPage ? 0 : page + 1));
  const goToPage = (page) => setCarouselPage(Math.max(0, Math.min(maxPage, page)));

  useEffect(() => {
    if (maxPage <= 0 || isPaused) return undefined;

    autoPlayRef.current = setInterval(() => {
      setCarouselPage((page) => (page >= maxPage ? 0 : page + 1));
    }, 5200);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, maxPage]);

  const handleTouchStart = (event) => {
    prodTouchX.current = event.touches[0].clientX;
    if (prodTrackRef.current) prodTrackRef.current.style.transition = "none";
  };

  const handleTouchMove = (event) => {
    if (prodTouchX.current === null) return;

    const deltaX = event.touches[0].clientX - prodTouchX.current;

    if (prodTrackRef.current) {
      prodTrackRef.current.style.transform = `translateX(calc(-${trackOffsetRef.current * 100}% + ${deltaX}px))`;
    }
  };

  const handleTouchEnd = (event) => {
    if (prodTouchX.current === null) return;

    const deltaX = event.changedTouches[0].clientX - prodTouchX.current;
    if (prodTrackRef.current) prodTrackRef.current.style.transition = "";

    if (deltaX < -30) nextSlide();
    else if (deltaX > 30) prevSlide();
    else if (prodTrackRef.current) {
      prodTrackRef.current.style.transform = `translateX(-${trackOffsetRef.current * 100}%)`;
    }

    prodTouchX.current = null;
  };

  return (
    <section id="produtos" style={{ padding: "96px 5%", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className={styles["section-label"]}>Equipamentos</div>
          <div className={styles.divider} style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: "#1a1d20", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Produtos das melhores marcas
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>
            Revenda autorizada Intelbras. Trabalhamos tamb\u00e9m com Paradox, ViaWeb, HikVision e outras refer\u00eancias do setor para garantir m\u00e1xima qualidade na sua instala\u00e7\u00e3o.
          </p>
        </div>

        <div className={styles["category-tabs"]} style={{ justifyContent: "center" }}>
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`${styles["category-tab"]}${activeCategory === category ? ` ${styles.active}` : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          className={styles["carousel-outer"]}
          style={{ padding: "0 24px" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {maxPage > 0 && (
            <button
              className={`${styles["carousel-btn"]} ${styles["carousel-btn-prev"]}`}
              onClick={prevSlide}
              aria-label="Anterior"
            >
              &#8249;
            </button>
          )}
          <div
            className={styles["carousel-overflow"]}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "pan-y" }}
          >
            <div
              ref={prodTrackRef}
              className={styles["carousel-track"]}
              style={{ transform: `translateX(-${windowOffset * 100}%)` }}
            >
              {windowPages.map((page, pageIndex) => (
                <div
                  key={`page-${windowStart + pageIndex}`}
                  className={styles["product-page"]}
                  aria-hidden={windowStart + pageIndex !== carouselPage}
                >
                  {page.map((product) => (
                    <div key={product.id} className={styles["product-card"]}>
                      <a
                        href={`/produtos/${product.slug || product.id}/`}
                        className={styles["product-card-inner"]}
                        style={{ display: "block", textDecoration: "none", color: "inherit" }}
                      >
                        <div className={styles["product-img-wrap"]} style={{ position: "relative" }}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <div className={styles["product-info"]}>
                          <span className={styles["product-brand"]}>{product.brand}</span>
                          <div className={styles["product-name"]}>{product.name}</div>
                          <div className={styles["product-cat"]}>{product.category}</div>
                          <div style={{ marginTop: 10, fontSize: "0.72rem", color: "#126798", fontWeight: 700 }}>
                            Ver detalhes &#8594;
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {maxPage > 0 && (
            <button
              className={`${styles["carousel-btn"]} ${styles["carousel-btn-next"]}`}
              onClick={nextSlide}
              aria-label="Pr\u00f3ximo"
            >
              &#8250;
            </button>
          )}
        </div>

        {maxPage > 0 && (
          <div className={styles["carousel-dots"]}>
            {Array.from({ length: maxPage + 1 }).map((_, index) => (
              <button
                key={index}
                className={`${styles["carousel-dot"]}${carouselPage === index ? ` ${styles.active}` : ""}`}
                onClick={() => goToPage(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {loadedCount < filteredProducts.length && (
          <div ref={loadMoreRef} aria-hidden="true" style={{ width: "100%", height: 1, marginTop: 12 }} />
        )}

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a
            href="/produtos/"
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
            Ver catálogo completo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
