import { useState, useRef, useCallback, useEffect } from "react";
import { PROJECTS } from "../data/portfolioData";
import type { Project } from "../types";

interface WorkProps {
  onSelectProject: (p: Project) => void;
}

export default function Work({ onSelectProject }: WorkProps) {
  const [active, setActive] = useState(0); // 0 is EVRIDOR (Current stage)
  const [locked, setLocked] = useState(false);
  const [viewMode, setViewMode] = useState<"stage" | "grid">("stage");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const wheelAccum = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;

  // Compact architectural card dimensions proportional to the rest of the website
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
      setTimeout(() => setLocked(false), 450);
    },
    [locked]
  );

  // Horizontal wheel / trackpad scroll for carousel without blocking page scroll
  useEffect(() => {
    const el = stageRef.current;
    if (!el || viewMode !== "stage") return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.3 && Math.abs(e.deltaX) > 15) {
        e.preventDefault();
        wheelAccum.current += e.deltaX;
        if (Math.abs(wheelAccum.current) > 45) {
          go(wheelAccum.current > 0 ? 1 : -1);
          wheelAccum.current = 0;
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go, viewMode]);

  // Keyboard arrows
  useEffect(() => {
    if (viewMode !== "stage") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, viewMode]);

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
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      go(diffX > 0 ? 1 : -1);
    }
  };

  const activeProject = PROJECTS[active] || PROJECTS[0];

  return (
    <section
      id="work"
      style={{
        background: "#FFFFFF",
        padding: "56px 0 70px",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(20, 20, 20, 0.06)",
        borderBottom: "1px solid rgba(20, 20, 20, 0.06)",
      }}
    >
      {/* Editorial ambient lights */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeProject.accent}12 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
          transition: "background 0.6s ease",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
          filter: "blur(75px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 5vw", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
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
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 26,
                  height: 1.5,
                  background: `linear-gradient(90deg, transparent, ${activeProject.accent})`,
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.25em",
                  color: activeProject.accent,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                02 // SELECTED WORK
              </span>
              <span
                style={{
                  display: "block",
                  width: 26,
                  height: 1.5,
                  background: `linear-gradient(90deg, ${activeProject.accent}, transparent)`,
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 4.4vw, 54px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                color: "#141414",
                margin: 0,
              }}
            >
              SELECTED WORK
            </h2>
          </div>

          {/* Controls: View Switch & Timeline */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#888888",
                letterSpacing: "0.15em",
              }}
            >
              0{active + 1} / 0{PROJECTS.length}
            </div>

            <div
              style={{
                display: "flex",
                background: "#FAF9F6",
                borderRadius: 100,
                padding: "3px",
                border: "1px solid rgba(20,20,20,0.08)",
              }}
            >
              <button
                onClick={() => setViewMode("stage")}
                style={{
                  border: "none",
                  borderRadius: 100,
                  padding: "5px 14px",
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
                  padding: "5px 14px",
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
      </div>

      {/* ─── VIEW 1: 3D STAGE CAROUSEL WITH DISTINCT SHAPED CARDS ─── */}
      {viewMode === "stage" ? (
        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          {/* Edge fade masks */}
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
                perspective: "1400px",
                perspectiveOrigin: "50% 50%",
                position: "relative",
                width: "100%",
                height: `${cardH + 28}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                touchAction: "pan-y",
              }}
            >
              {PROJECTS.map((p, i) => {
                const offset = i - active;
                const { tx, tz, ry, scale, opacity, zIndex } = cardTransform(offset);
                const isCenter = offset === 0;

                if (Math.abs(offset) > 3) return null;

                return (
                  <div
                    key={p.number || p.title}
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
                      cursor: "pointer",
                      transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      transition:
                        "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.65s ease, box-shadow 0.65s ease",
                      // Compact Architectural Geometric Shape:
                      borderRadius: "22px 6px 22px 6px",
                      overflow: "hidden",
                      background: "#141414",
                      boxShadow: isCenter
                        ? p.isCurrent
                          ? "0 20px 50px -10px rgba(37, 99, 235, 0.35), 0 8px 24px -4px rgba(20, 20, 20, 0.18), 0 0 0 2px #2563EB"
                          : "0 20px 50px -10px rgba(20, 20, 20, 0.28), 0 8px 24px -4px rgba(124, 58, 237, 0.2), 0 0 0 2px rgba(20, 20, 20, 0.2)"
                        : "0 8px 25px -6px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(20, 20, 20, 0.08)",
                    }}
                    title={isCenter ? `Click to open ${p.title} details` : `Go to ${p.title}`}
                  >
                    {/* Background Project Image with Viewport Depth */}
                    <img
                      src={p.image}
                      alt={`${p.title} — ${p.subtitle}`}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: isCenter ? "brightness(0.96) saturate(1.08)" : "brightness(0.45) saturate(0.8)",
                        transition: "filter 0.65s ease, transform 0.65s ease",
                        transform: isCenter ? "scale(1.02)" : "scale(1)",
                      }}
                    />

                    {/* Corner Technical Crosshairs [+] */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 12,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9.5,
                        color: isCenter ? p.accent : "rgba(255,255,255,0.4)",
                        zIndex: 10,
                        pointerEvents: "none",
                        fontWeight: 700,
                      }}
                    >
                      + {p.number}
                    </div>

                    {/* Top Status Notch / Pill */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 12,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {p.isCurrent ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 9px",
                            borderRadius: 100,
                            background: "rgba(37, 99, 235, 0.8)",
                            border: "1px solid #60A5FA",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "#93C5FA",
                              boxShadow: "0 0 6px #93C5FA",
                              animation: "pulse-dot 1.6s ease-in-out infinite",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 8,
                              letterSpacing: "0.12em",
                              fontWeight: 700,
                              color: "#FFFFFF",
                            }}
                          >
                            CURRENT STAGE
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "3px 8px",
                            borderRadius: 100,
                            background: "rgba(20, 20, 20, 0.65)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(8px)",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 8.5,
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          {p.year}
                        </div>
                      )}
                    </div>

                    {/* Ambient Glow Accent on Top Edge */}
                    {isCenter && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "12%",
                          right: "12%",
                          height: "2px",
                          background: `linear-gradient(90deg, transparent, ${p.accent} 40%, ${p.accent} 60%, transparent)`,
                          pointerEvents: "none",
                          zIndex: 6,
                        }}
                      />
                    )}

                    {/* Bottom Floating Information Overlay */}
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
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.accent, fontWeight: 700 }}>
                            {p.number}
                          </span>
                          <span style={{ width: 10, height: 1, background: "rgba(255,255,255,0.35)" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>
                            {p.year}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                background: p.accent,
                                border: `1px solid ${p.accent}`,
                                color: "#FFFFFF",
                                borderRadius: 100,
                                padding: "3px 10px",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 8.5,
                                fontWeight: 700,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                                boxShadow: `0 2px 8px ${p.accent}55`,
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
                              background: "rgba(255,255,255,0.15)",
                              border: "1px solid rgba(255,255,255,0.3)",
                              color: "#FFFFFF",
                              borderRadius: 100,
                              padding: "3px 10px",
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 8.5,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              backdropFilter: "blur(6px)",
                            }}
                          >
                            <span>DETAILS</span>
                            <span>↗</span>
                          </button>
                        </div>
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Instrument Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: isMobile ? 16 : 19,
                          color: "#FFFFFF",
                          margin: "0 0 2px",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Instrument Sans', sans-serif",
                          fontSize: isMobile ? 10.5 : 11.5,
                          color: "rgba(255,255,255,0.72)",
                          margin: "0 0 6px",
                          maxWidth: 360,
                          lineHeight: 1.35,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.subtitle}
                      </p>

                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {p.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={`${p.number}-${tag}-${tIdx}`}
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 8.5,
                              padding: "1.5px 6px",
                              borderRadius: 4,
                              background: "rgba(255,255,255,0.12)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "#FAF9F6",
                            }}
                          >
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

          {/* Navigation Arrows */}
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
            <button
              onClick={() => go(-1)}
              disabled={active === 0}
              aria-label="Previous project"
              style={{
                pointerEvents: active === 0 ? "none" : "auto",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(20, 20, 20, 0.12)",
                color: "#141414",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: active === 0 ? "default" : "pointer",
                opacity: active === 0 ? 0.3 : 1,
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease",
                fontSize: 13,
              }}
            >
              ←
            </button>

            <button
              onClick={() => go(1)}
              disabled={active === PROJECTS.length - 1}
              aria-label="Next project"
              style={{
                pointerEvents: active === PROJECTS.length - 1 ? "none" : "auto",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(20, 20, 20, 0.12)",
                color: "#141414",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: active === PROJECTS.length - 1 ? "default" : "pointer",
                opacity: active === PROJECTS.length - 1 ? 0.3 : 1,
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease",
                fontSize: 13,
              }}
            >
              →
            </button>
          </div>

          {/* Dots Indicator */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
            }}
          >
            {PROJECTS.map((p, idx) => (
              <button
                key={p.number || p.title}
                onClick={() => setActive(idx)}
                aria-label={`Jump to project ${p.title}`}
                style={{
                  width: idx === active ? 22 : 6,
                  height: 5,
                  borderRadius: 100,
                  background: idx === active ? p.accent : "rgba(20, 20, 20, 0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        /* ─── VIEW 2: EDITORIAL COMPACT GRID ─── */
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 5vw" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
              gap: 18,
            }}
          >
            {PROJECTS.map((p) => (
              <div
                key={p.number || p.title}
                onClick={() => onSelectProject(p)}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "22px 6px 22px 6px",
                  border: "1px solid rgba(20, 20, 20, 0.08)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                className="hover:-translate-y-1 hover:shadow-xl"
              >
                <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
                  <img
                    src={p.image}
                    alt={`${p.title} — ${p.subtitle}`}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {p.isCurrent && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 12,
                        background: "#2563EB",
                        color: "#FFFFFF",
                        padding: "3px 9px",
                        borderRadius: 100,
                        fontSize: 8.5,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                      }}
                    >
                      ● CURRENT STAGE
                    </div>
                  )}
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: p.accent, fontWeight: 700 }}>
                      {p.number}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#888" }}>
                      {p.year}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 22, color: "#141414", margin: "0 0 6px" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 13.5, color: "#666", margin: "0 0 14px", lineHeight: 1.5 }}>
                    {p.subtitle}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(20,20,20,0.06)", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.tags.map((t, idx) => (
                        <span
                          key={`${p.number}-grid-${t}-${idx}`}
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9.5,
                            background: "#FAF9F6",
                            border: "1px solid rgba(20,20,20,0.06)",
                            padding: "3px 8px",
                            borderRadius: 6,
                            color: "#444",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 100,
                            background: p.accent,
                            color: "#FFFFFF",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9.5,
                            fontWeight: 700,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span>LIVE</span>
                          <span>↗</span>
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(p);
                        }}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 100,
                          background: "rgba(20,20,20,0.06)",
                          border: "none",
                          color: "#141414",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
