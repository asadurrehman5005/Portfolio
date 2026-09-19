import { useState, useRef, useCallback, useEffect } from "react";
import { PROJECTS } from "../data/portfolioData";
import type { Project } from "../types";

interface DedicatedWorkPageProps {
  onBack: () => void;
  onOpenContact: () => void;
  onSelectProject: (p: Project) => void;
}

export default function DedicatedWorkPage({
  onBack,
  onOpenContact,
  onSelectProject,
}: DedicatedWorkPageProps) {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
  const [viewMode, setViewMode] = useState<"stage" | "grid">("stage");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const wheelAccum = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;
  const cardW = isMobile ? Math.min(windowWidth - 48, 285) : isTablet ? 340 : 385;
  const cardH = isMobile ? 245 : 275;
  const stepX = isMobile ? cardW * 0.65 : isTablet ? 175 : 205;
  const stepZ = isMobile ? 85 : 120;

  function cardTransform(offset: number) {
    const abs = Math.abs(offset);
    const tx = offset * stepX;
    const tz = -abs * stepZ;
    const ry = offset * -14;
    const scale = 1 - abs * 0.12;
    const opacity = 1 - abs * 0.32;
    return { tx, tz, ry, scale, opacity, zIndex: 10 - abs };
  }

  const go = useCallback(
    (dir: 1 | -1) => {
      if (locked) return;
      setActive((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= PROJECTS.length) return prev;
        return next;
      });
      setLocked(true);
      setTimeout(() => setLocked(false), 500);
    },
    [locked]
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el || viewMode !== "stage") return;

    const onWheel = (e: WheelEvent) => {
      // ONLY intercept deliberate horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.3 && Math.abs(e.deltaX) > 15) {
        e.preventDefault();
        wheelAccum.current += e.deltaX;
        if (Math.abs(wheelAccum.current) > 45) {
          go(wheelAccum.current > 0 ? 1 : -1);
          wheelAccum.current = 0;
        }
      }
      // Never block normal vertical page scroll!
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go, viewMode]);

  useEffect(() => {
    if (viewMode !== "stage") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, viewMode]);

  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      go(diffX > 0 ? 1 : -1);
    }
  };

  const canPrev = active > 0;
  const canNext = active < PROJECTS.length - 1;

  return (
    <div
      style={{
        background: "#FAF9F6",
        minHeight: "100vh",
        padding: "40px 0 64px",
        color: "#141414",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 50% at 18% 30%, rgba(37,99,235,0.05) 0%, transparent 65%), " +
            "radial-gradient(ellipse 60% 45% at 82% 65%, rgba(124,58,237,0.05) 0%, transparent 60%)",
        }}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 5vw", position: "relative", zIndex: 2 }}>
        {/* Back navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(20,20,20,0.08)",
            paddingBottom: 14,
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <button
            onClick={onBack}
            className="btn-outline"
            style={{
              borderRadius: 100,
              fontSize: 10.5,
              padding: "7px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <span>←</span>
            <span>BACK TO MAIN PORTFOLIO</span>
          </button>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#888888", letterSpacing: "0.15em" }}>
            PAGE 2 // ALL SELECTED WORK
          </div>
        </div>

        {/* Page Heading & View Mode */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(32px, 5vw, 60px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                color: "#141414",
                margin: "0 0 10px",
              }}
            >
              ALL SELECTED WORK <span className="gradient-text">(2024 — PRESENT)</span>
            </h1>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 14.5, color: "#666666", maxWidth: 560, margin: 0 }}>
              Inspect full architecture, tech stack, and details. EVRIDOR is currently in active development.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              background: "#FFFFFF",
              borderRadius: 100,
              padding: "3px",
              border: "1px solid rgba(20,20,20,0.08)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <button
              onClick={() => setViewMode("stage")}
              style={{
                border: "none",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.1em",
                fontWeight: 600,
                cursor: "pointer",
                background: viewMode === "stage" ? "#141414" : "transparent",
                color: viewMode === "stage" ? "#FAF9F6" : "#666666",
                transition: "all 0.2s ease",
              }}
            >
              3D STAGE
            </button>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                border: "none",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.1em",
                fontWeight: 600,
                cursor: "pointer",
                background: viewMode === "grid" ? "#141414" : "transparent",
                color: viewMode === "grid" ? "#FAF9F6" : "#666666",
                transition: "all 0.2s ease",
              }}
            >
              GRID VIEW
            </button>
          </div>
        </div>
      </div>

      {/* 3D Stage Carousel */}
      {viewMode === "stage" ? (
        <div style={{ position: "relative", width: "100%" }}>
          <div
            style={{
              width: "100%",
              position: "relative",
              maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div
              ref={stageRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                perspective: "1350px",
                perspectiveOrigin: "50% 50%",
                position: "relative",
                width: "100%",
                height: `${cardH + 28}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "pan-y",
              }}
            >
              {PROJECTS.map((p, i) => {
                const offset = i - active;
                const abs = Math.abs(offset);
                if (abs > 2) return null;
                const { tx, tz, ry, scale, opacity, zIndex } = cardTransform(offset);
                const isCenter = offset === 0;

                return (
                  <div
                    key={p.number}
                    onClick={() => {
                      if (!isCenter) {
                        setActive(i);
                      } else {
                        onSelectProject(p);
                      }
                    }}
                    style={{
                      position: "absolute",
                      width: `${cardW}px`,
                      height: `${cardH}px`,
                      borderRadius: "22px 6px 22px 6px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      transition:
                        "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.65s ease, box-shadow 0.65s ease",
                      boxShadow: isCenter
                        ? p.isCurrent
                          ? "0 20px 50px -10px rgba(37, 99, 235, 0.28), 0 8px 24px -4px rgba(20, 20, 20, 0.16), 0 0 0 2px #2563EB"
                          : "0 20px 50px -10px rgba(20, 20, 20, 0.22), 0 8px 24px -4px rgba(124, 58, 237, 0.16), 0 0 0 1.5px rgba(20, 20, 20, 0.2)"
                        : "0 8px 25px -6px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(20, 20, 20, 0.08)",
                      background: "#141414",
                    }}
                    title={isCenter ? `Click to open ${p.title} details` : `Go to ${p.title}`}
                  >
                    <img
                      src={p.image}
                      alt={`${p.title} — ${p.subtitle}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: isCenter ? "brightness(1) saturate(1.05)" : "brightness(0.48) saturate(0.8)",
                        transition: "filter 0.65s ease",
                      }}
                    />

                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "22px 6px 22px 6px",
                        background: isCenter
                          ? "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 45%, transparent 100%)"
                          : "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 70%)",
                        pointerEvents: "none",
                      }}
                    />

                    {isCenter && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "8%",
                          right: "8%",
                          height: "2px",
                          background: p.isCurrent
                            ? "linear-gradient(90deg, transparent, #2563EB 35%, #60A5FA 65%, transparent)"
                            : "linear-gradient(90deg, transparent, #7C3AED 35%, #F97316 65%, transparent)",
                          pointerEvents: "none",
                          zIndex: 6,
                        }}
                      />
                    )}

                    {isCenter && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 12,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          zIndex: 8,
                        }}
                      >
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              background: p.accent,
                              border: `1px solid ${p.accent}`,
                              color: "#FFFFFF",
                              borderRadius: 100,
                              padding: "3px 10px",
                              fontSize: 8.5,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontWeight: 700,
                              textDecoration: "none",
                              cursor: "pointer",
                              boxShadow: `0 2px 8px ${p.accent}55`,
                              transition: "all 0.2s ease",
                            }}
                          >
                            <span>LIVE SITE</span>
                            <span>↗</span>
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(p);
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            background: "rgba(20, 20, 20, 0.75)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            color: "#fff",
                            borderRadius: 100,
                            padding: "3px 10px",
                            fontSize: 8.5,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <span>DETAILS</span>
                          <span>↗</span>
                        </button>
                      </div>
                    )}

                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(14, 16, 24, 0.98) 0%, rgba(14, 16, 24, 0.88) 55%, rgba(14, 16, 24, 0.25) 85%, transparent 100%)",
                        padding: isMobile ? "12px 14px 10px" : "14px 18px 12px",
                        opacity: isCenter ? 1 : 0,
                        transform: isCenter ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s",
                        zIndex: 4,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.accent, fontWeight: 700 }}>
                          {p.number}
                        </span>
                        <span style={{ width: 10, height: 1, background: "rgba(255,255,255,0.35)" }} />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.8)" }}>
                          {p.year}
                        </span>
                        {p.isCurrent && (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "2px 7px",
                              borderRadius: 100,
                              background: "rgba(37, 99, 235, 0.6)",
                              border: "1px solid #60A5FA",
                              backdropFilter: "blur(6px)",
                            }}
                          >
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#93C5FA", display: "inline-block", animation: "pulse-dot 1.6s ease-in-out infinite" }} />
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.1em", fontWeight: 700, color: "#FFFFFF" }}>
                              CURRENT STAGE
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: isMobile ? 16 : 19, color: "#fff", margin: "0 0 2px" }}>
                        {p.title}
                      </h3>
                      <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: isMobile ? 10.5 : 11.5, color: "rgba(255,255,255,0.72)", margin: "0 0 6px", maxWidth: 360, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.subtitle}
                      </p>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {p.tags.slice(0, 3).map((tag) => (
                          <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, padding: "1.5px 6px", borderRadius: 4, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#FAF9F6" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation arrows */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              transform: "translateY(-50%)",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 clamp(16px, 4vw, 64px)",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            {[
              { dir: -1 as const, can: canPrev },
              { dir: 1 as const, can: canNext },
            ].map(({ dir, can }, idx) => (
              <button
                key={idx}
                onClick={() => go(dir)}
                disabled={!can}
                aria-label={dir === -1 ? "Previous project" : "Next project"}
                style={{
                  pointerEvents: "auto",
                  width: isMobile ? 42 : 50,
                  height: isMobile ? 42 : 50,
                  borderRadius: "50%",
                  border: can ? "1px solid rgba(20, 20, 20, 0.12)" : "1px solid rgba(20, 20, 20, 0.05)",
                  background: can ? "#FFFFFF" : "#F4F2EE",
                  color: can ? "#141414" : "#AAAAAA",
                  cursor: can ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: can ? "0 8px 24px rgba(0, 0, 0, 0.08)" : "none",
                  transition: "all 0.25s ease",
                  outline: "none",
                }}
              >
                <svg width={isMobile ? 16 : 18} height={isMobile ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  {dir === -1 ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
                </svg>
              </button>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: "flex", gap: 8, marginTop: 28, justifyContent: "center", alignItems: "center" }}>
            {PROJECTS.map((p, i) => (
              <button
                key={p.number}
                onClick={() => setActive(i)}
                aria-label={`Go to ${p.title}`}
                style={{
                  width: i === active ? 34 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === active ? "linear-gradient(90deg, #2563EB, #7C3AED)" : "rgba(20, 20, 20, 0.16)",
                  transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease",
                }}
              />
            ))}
          </div>
          <p style={{ marginTop: 12, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#888888" }}>
            SCROLL · ARROW KEYS · CLICK TO EXPLORE
          </p>
        </div>
      ) : (
        /* Grid view */
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 5vw" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 16 }}>
            {PROJECTS.map((p) => (
              <div
                key={p.number}
                className="project-card"
                style={{ height: 260, borderRadius: "22px 6px 22px 6px", border: p.isCurrent ? "2px solid #2563EB" : "1px solid rgba(20, 20, 20, 0.08)" }}
                onClick={() => onSelectProject(p)}
              >
                <img src={p.image} alt={`${p.title} — ${p.subtitle}`} />
                <div className="project-overlay" style={{ padding: "18px 20px" }}>
                  <div className="project-arrow">↗</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.accent, fontWeight: 700 }}>
                      {p.number}
                    </span>
                    <span style={{ width: 12, height: 1, background: "rgba(255,255,255,0.3)" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255,255,255,0.8)" }}>
                      {p.year}
                    </span>
                    {p.isCurrent && (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 100, background: "rgba(37, 99, 235, 0.6)", border: "1px solid #60A5FA" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#93C5FD" }} />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#FFFFFF", fontWeight: 700 }}>
                          CURRENT STAGE
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", margin: "0 0 3px" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11.5, color: "rgba(255,255,255,0.7)", margin: "0 0 8px", maxWidth: 360, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.subtitle}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, flexWrap: "wrap", gap: 8 }}>
                    <div className="project-tags">
                      {p.tags.map((t) => (
                        <span key={t} className="tag-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 12px",
                          borderRadius: 100,
                          background: p.accent,
                          color: "#FFFFFF",
                          fontSize: 9.5,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          textDecoration: "none",
                          boxShadow: `0 2px 10px ${p.accent}66`,
                          zIndex: 5,
                        }}
                      >
                        <span>LIVE</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA to contact */}
      <div style={{ maxWidth: 1240, margin: "48px auto 0", padding: "0 5vw", position: "relative", zIndex: 2 }}>
        <div
          style={{
            padding: "32px",
            background: "#141414",
            borderRadius: 18,
            color: "#FAF9F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.12)",
          }}
        >
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#F97316", letterSpacing: "0.2em", marginBottom: 6 }}>
              READY TO BUILD SOMETHING EXTRAORDINARY?
            </div>
            <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: "clamp(20px, 2.5vw, 26px)", color: "#FFFFFF" }}>
              Let&apos;s create high-impact software together.
            </div>
          </div>
          <button
            onClick={onOpenContact}
            className="btn-primary"
            style={{
              background: "#2563EB",
              color: "#FAF9F6",
              borderRadius: 100,
              padding: "12px 26px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              border: "none",
              cursor: "pointer",
            }}
          >
            LET&apos;S TALK →
          </button>
        </div>
      </div>
    </div>
  );
}
