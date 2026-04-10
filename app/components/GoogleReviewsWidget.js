"use client";

import { useEffect, useRef, useState } from "react";
import reviewsData from "../../lib/google-reviews.json";

function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function Stars({ count = 5, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} width={size} height={size} viewBox="0 0 20 20" fill={index < count ? "#f59e0b" : "#e5e7eb"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function VerifiedIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1a73e8">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 160;
  const isLong = review.text.length > maxChars;
  const displayText = expanded || !isLong ? review.text : `${review.text.slice(0, maxChars)}...`;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        padding: "24px 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #126798, #1a8fd1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.02em",
            }}
          >
            {review.authorInitials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1a1d20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {review.author}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>{review.relativeDate}</div>
          </div>
        </div>
        <GoogleIcon size={22} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Stars count={review.rating} size={15} />
        <span style={{ display: "inline-flex", alignItems: "center" }} title="Avaliacao verificada">
          <VerifiedIcon size={15} />
        </span>
      </div>

      <p style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.6, margin: 0 }}>
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: "none", border: "none", color: "#126798", cursor: "pointer", fontSize: "0.88rem", padding: "0 0 0 4px", fontFamily: "inherit" }}
          >
            {expanded ? " Ver menos" : " Leia mais"}
          </button>
        )}
      </p>
    </div>
  );
}

function SummaryCard() {
  const { rating, totalReviews, profileUrl } = reviewsData;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        padding: "20px 28px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 24,
        justifyContent: "center",
      }}
    >
      <svg width="72" height="24" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
        <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335" />
        <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05" />
        <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4" />
        <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853" />
        <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335" />
        <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4" />
      </svg>

      <div style={{ width: 1, height: 40, background: "#e5e7eb" }} />

      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: "2rem", fontWeight: 800, color: "#1a1d20", lineHeight: 1 }}>{rating}</span>
          <Stars count={5} size={20} />
        </div>
        <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>Baseado em {totalReviews}+ avaliacoes</div>
      </div>

      <div style={{ width: 1, height: 40, background: "#e5e7eb" }} />

      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#1a6e3c",
          color: "#fff",
          padding: "8px 18px",
          borderRadius: 9999,
          fontSize: "0.82rem",
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        Ver no Google Maps
      </a>
    </div>
  );
}

export default function GoogleReviewsWidget() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const reviews = reviewsData.reviews;
  const autoPlayRef = useRef(null);

  const reviewControlBaseStyle = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease, opacity 0.2s ease",
    willChange: "transform",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    flexShrink: 0,
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleCount = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, reviews.length - visibleCount);
  const dotWindowSize = Math.min(5, maxIndex + 1);
  const dotStart = Math.max(0, Math.min(current - Math.floor(dotWindowSize / 2), maxIndex - dotWindowSize + 1));
  const dotIndexes = Array.from({ length: dotWindowSize }, (_, index) => dotStart + index);

  const prev = () => setCurrent((value) => (value === 0 ? maxIndex : value - 1));
  const next = () => setCurrent((value) => (value === maxIndex ? 0 : value + 1));

  const visible = reviews.slice(current, current + visibleCount);

  useEffect(() => {
    if (maxIndex <= 0 || isPaused) return undefined;

    autoPlayRef.current = setInterval(() => {
      setCurrent((value) => (value === maxIndex ? 0 : value + 1));
    }, 4800);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, maxIndex]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <SummaryCard />
      </div>

      <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
            gap: 16,
            marginBottom: 24,
          }}
        >
          {visible.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {reviews.length > visibleCount && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <button onClick={prev} aria-label="Avaliacao anterior" style={reviewControlBaseStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div aria-hidden="true" style={{ minWidth: 140, height: 1 }} />

              <button onClick={next} aria-label="Proxima avaliacao" style={reviewControlBaseStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {dotStart > 0 && (
                <span style={{ fontSize: "0.82rem", color: "#9ca3af", padding: "0 4px" }}>...</span>
              )}
              {dotIndexes.map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Avaliacao ${index + 1}`}
                  style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    minHeight: 44,
                    borderRadius: 9999,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    position: "relative",
                    overflow: "visible",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      width: 20,
                      height: 8,
                      top: "50%",
                      left: "50%",
                      borderRadius: 9999,
                      background: "#126798",
                      opacity: index === current ? 1 : 0.28,
                      transform: `translate(-50%, -50%) scaleX(${index === current ? 1 : 0.4})`,
                      transformOrigin: "center",
                      transition: "transform 0.3s ease, opacity 0.3s ease",
                      willChange: "transform, opacity",
                    }}
                  />
                </button>
              ))}
              {dotStart + dotWindowSize - 1 < maxIndex && (
                <span style={{ fontSize: "0.82rem", color: "#9ca3af", padding: "0 4px" }}>...</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
