import { useState, useRef, useEffect } from "react";
import { SERVICES } from "../data/portfolioData";

interface ServicesProps {
  onOpenContact?: () => void;
}

interface ServiceCardData {
  id: number;
  title: string;
  desc: string;
  category: string;
  accent: string;
  image: string;
  tags: string[];
}

const SERVICE_CARDS: ServiceCardData[] = [
  {
    id: 0,
    title: SERVICES[0]?.title || "WEB APPLICATIONS",
    desc: SERVICES[0]?.desc || "Full-stack web apps built to scale and perform at any load.",
    category: "ENGINEERING",
    accent: "#2563EB",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=560&fit=crop&auto=format",
    tags: ["React", "Next.js", "TypeScript", "Node.js"],
  },
  {
    id: 1,
    title: SERVICES[1]?.title || "MOBILE APPS",
    desc: SERVICES[1]?.desc || "Cross-platform React Native applications for iOS and Android.",
    category: "MOBILE",
    accent: "#F43F5E",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=560&fit=crop&auto=format",
    tags: ["React Native", "Expo", "iOS", "Android"],
  },
  {
    id: 2,
    title: SERVICES[2]?.title || "AI PRODUCTS",
    desc: SERVICES[2]?.desc || "Intelligent tools powered by modern AI and automation.",
    category: "INTELLIGENCE",
    accent: "#10B981",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=560&fit=crop&auto=format",
    tags: ["OpenAI", "LangChain", "FastAPI", "Python"],
  },
  {
    id: 3,
    title: SERVICES[3]?.title || "E-COMMERCE",
    desc: SERVICES[3]?.desc || "Commerce experiences engineered for conversion and trust.",
    category: "COMMERCE",
    accent: "#F97316",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=560&fit=crop&auto=format",
    tags: ["Next.js", "Stripe", "Prisma", "High UX"],
  },
  {
    id: 4,
    title: SERVICES[4]?.title || "DESIGN SYSTEMS",
    desc: SERVICES[4]?.desc || "Scalable component libraries that design teams love.",
    category: "UI / UX",
    accent: "#7C3AED",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=560&fit=crop&auto=format",
    tags: ["Figma", "Tailwind", "Radix UI", "Tokens"],
  },
  {
    id: 5,
    title: SERVICES[5]?.title || "INTERACTIVE WEBSITES",
    desc: SERVICES[5]?.desc || "Motion-rich, award-level experiences that capture attention.",
    category: "CREATIVE TECH",
    accent: "#06B6D4",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=560&fit=crop&auto=format",
    tags: ["Three.js", "WebGL", "GSAP", "Shaders"],
  },
  {
    id: 6,
    title: SERVICES[6]?.title || "FULL-STACK SYSTEMS",
    desc: SERVICES[6]?.desc || "End-to-end digital product development from idea to launch.",
    category: "ARCHITECTURE",
    accent: "#3B82F6",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=560&fit=crop&auto=format",
    tags: ["PostgreSQL", "NestJS", "Docker", "Cloud"],
  },
];

type SlotConfig = {
  top: string;
  left: string;
  width: number;
  height: number;
  rx: number;
  ry: number;
  rz: number;
  translateZ: number;
  scale: number;
  zIndex: number;
  floatClass: string;
  floatDelay: string;
};

// Desktop positions (Width 1180, Height 560)
// Slot 0 is ALWAYS the zoomed Center Hero Spotlight!
const DESKTOP_SLOTS: SlotConfig[] = [
  { top: "50%", left: "50%", width: 440, height: 300, rx: 0, ry: 0, rz: 0, translateZ: 85, scale: 1.1, zIndex: 45, floatClass: "float-a", floatDelay: "0s" }, // 0: Center Zoomed
  { top: "19%", left: "19%", width: 250, height: 170, rx: 12, ry: 16, rz: 3, translateZ: -15, scale: 0.95, zIndex: 12, floatClass: "float-b", floatDelay: "0.6s" }, // 1: Upper Left
  { top: "18%", left: "81%", width: 250, height: 170, rx: 10, ry: -18, rz: -3, translateZ: -15, scale: 0.95, zIndex: 12, floatClass: "float-c", floatDelay: "1.1s" }, // 2: Upper Right
  { top: "50%", left: "13%", width: 245, height: 165, rx: 4, ry: 20, rz: 4, translateZ: -10, scale: 0.95, zIndex: 14, floatClass: "float-a", floatDelay: "0.8s" }, // 3: Mid Left
  { top: "50%", left: "87%", width: 245, height: 165, rx: 4, ry: -20, rz: -4, translateZ: -10, scale: 0.95, zIndex: 14, floatClass: "float-b", floatDelay: "1.5s" }, // 4: Mid Right
  { top: "82%", left: "25%", width: 240, height: 160, rx: -8, ry: 15, rz: 4, translateZ: 0, scale: 0.95, zIndex: 16, floatClass: "float-c", floatDelay: "0.9s" }, // 5: Lower Left
  { top: "82%", left: "75%", width: 240, height: 160, rx: -8, ry: -15, rz: -4, translateZ: 0, scale: 0.95, zIndex: 16, floatClass: "float-a", floatDelay: "1.8s" }, // 6: Lower Right
];

// Mobile positions (Width 390, Height 530)
// Slot 0 is the zoomed Center Hero Spotlight with ample breathing room for surrounding cards
const MOBILE_SLOTS: SlotConfig[] = [
  { top: "44%", left: "50%", width: 248, height: 172, rx: 0, ry: 0, rz: 0, translateZ: 65, scale: 1.05, zIndex: 45, floatClass: "float-a", floatDelay: "0s" }, // 0: Darmayan Zoomed Hero
  { top: "14%", left: "19%", width: 116, height: 80, rx: 8, ry: 14, rz: 3, translateZ: -15, scale: 0.9, zIndex: 12, floatClass: "float-b", floatDelay: "0.5s" }, // 1: Upper Left
  { top: "13%", left: "81%", width: 116, height: 80, rx: 8, ry: -14, rz: -3, translateZ: -15, scale: 0.9, zIndex: 12, floatClass: "float-c", floatDelay: "1.1s" }, // 2: Upper Right
  { top: "46%", left: "9%", width: 110, height: 76, rx: 4, ry: 20, rz: 4, translateZ: -5, scale: 0.9, zIndex: 14, floatClass: "float-a", floatDelay: "0.8s" }, // 3: Mid Left
  { top: "47%", left: "91%", width: 110, height: 76, rx: 4, ry: -20, rz: -4, translateZ: -5, scale: 0.9, zIndex: 14, floatClass: "float-b", floatDelay: "1.5s" }, // 4: Mid Right
  { top: "79%", left: "21%", width: 120, height: 82, rx: -6, ry: 12, rz: 4, translateZ: 5, scale: 0.9, zIndex: 16, floatClass: "float-c", floatDelay: "0.9s" }, // 5: Lower Left
  { top: "80%", left: "79%", width: 120, height: 82, rx: -6, ry: -12, rz: -4, translateZ: 5, scale: 0.9, zIndex: 16, floatClass: "float-a", floatDelay: "1.8s" }, // 6: Lower Right
];

export default function Services({ onOpenContact }: ServicesProps) {
  const [activeId, setActiveId] = useState(0);
  const [viewMode, setViewMode] = useState<"stage" | "list">("stage");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const currentSlots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;

  // Responsive stage scaling
  const desktopScale = Math.min(1, Math.max(0.6, (windowWidth - 32) / 1180));
  const mobileScale = Math.min(1, Math.max(0.75, (windowWidth - 20) / 390));
  const currentScale = isMobile ? mobileScale : desktopScale;

  const stageBaseW = isMobile ? 390 : 1180;
  const stageBaseH = isMobile ? 520 : 560;

  // Desktop Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Mobile Touch Swipe: swipe left/right to zoom next/prev card to center
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
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX > 0) {
        setActiveId((prev) => (prev + 1) % SERVICE_CARDS.length);
      } else {
        setActiveId((prev) => (prev - 1 + SERVICE_CARDS.length) % SERVICE_CARDS.length);
      }
    }
  };

  const activeService = SERVICE_CARDS[activeId];

  return (
    <section
      id="services"
      style={{
        background: "#FFFFFF",
        padding: isMobile ? "40px 0 52px" : "52px 0 68px",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(20, 20, 20, 0.06)",
      }}
    >
      {/* Editorial warm ambient glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          left: "8%",
          width: isMobile ? 220 : 450,
          height: isMobile ? 220 : 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeService.accent}14 0%, transparent 70%)`,
          filter: "blur(65px)",
          transition: "background 0.6s ease",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: isMobile ? 240 : 480,
          height: isMobile ? 240 : 480,
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
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 14,
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
                  width: 24,
                  height: 1.5,
                  background: "linear-gradient(90deg, transparent, #F97316)",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.25em",
                  color: "#F97316",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                08 // SERVICES
              </span>
              <span
                style={{
                  display: "block",
                  width: 24,
                  height: 1.5,
                  background: "linear-gradient(90deg, #F97316, transparent)",
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 4.2vw, 52px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                color: "#141414",
                margin: 0,
              }}
            >
              WHAT I CAN BUILD FOR YOU.
            </h2>
          </div>

          {/* View toggle pills */}
          <div
            style={{
              display: "flex",
              background: "#FAF9F6",
              borderRadius: 100,
              padding: "3px",
              border: "1px solid rgba(20,20,20,0.08)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <button
              onClick={() => setViewMode("stage")}
              style={{
                border: "none",
                borderRadius: 100,
                padding: "5px 13px",
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
              onClick={() => setViewMode("list")}
              style={{
                border: "none",
                borderRadius: 100,
                padding: "5px 13px",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.1em",
                fontWeight: 600,
                cursor: "pointer",
                background: viewMode === "list" ? "#141414" : "transparent",
                color: viewMode === "list" ? "#FAF9F6" : "#666666",
                transition: "all 0.2s ease",
              }}
            >
              SERVICES LIST
            </button>
          </div>
        </div>

        {/* Interactive Quick-Selector Pills */}
        {viewMode === "stage" && (
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 10,
              marginBottom: 14,
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {SERVICE_CARDS.map((srv) => {
              const isActive = activeId === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => setActiveId(srv.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "5px 12px" : "6px 14px",
                    borderRadius: 100,
                    fontSize: isMobile ? 9.5 : 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    border: isActive ? `1.5px solid ${srv.accent}` : "1px solid rgba(20,20,20,0.08)",
                    background: isActive ? srv.accent : "#FAF9F6",
                    color: isActive ? "#FFFFFF" : "#555555",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: isActive ? `0 4px 14px ${srv.accent}44` : "none",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    outline: "none",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.6 }}>0{srv.id + 1}</span>
                  <span>{srv.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Interactive Hint Pill */}
        {viewMode === "stage" && (
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "#FAF9F6",
                border: "1px solid rgba(20, 20, 20, 0.08)",
                padding: isMobile ? "5px 14px" : "6px 18px",
                borderRadius: 100,
                fontSize: isMobile ? 10 : 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                color: "#2563EB",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <span>✨</span>
              <span>
                {isMobile
                  ? "Kisi bhi card par tap karein — wo darmayan mein zoom ho jaye ga"
                  : "Click any service card to zoom it into the center"}
              </span>
            </div>
          </div>
        )}

        {/* ── VIEW 1: 3D ZOOM-TO-CENTER STAGE (DESKTOP + MOBILE) ── */}
        {viewMode === "stage" ? (
          <div>
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: "relative",
                width: "100%",
                height: `${stageBaseH * currentScale}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "pan-y",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: `${stageBaseW}px`,
                  height: `${stageBaseH}px`,
                  perspective: isMobile ? "1050px" : "1350px",
                  perspectiveOrigin: "50% 45%",
                  transform: isMobile
                    ? `scale(${mobileScale})`
                    : `rotateX(${mouseOffset.y * -6}deg) rotateY(${mouseOffset.x * 7}deg) scale(${desktopScale})`,
                  transformOrigin: "center center",
                  transition: isMobile ? "none" : "transform 0.25s ease-out",
                  flexShrink: 0,
                }}
              >
                {SERVICE_CARDS.map((srv) => {
                  // The active card is ALWAYS mapped to slot 0 (Dead Center / Zoomed in darmayan)!
                  const slotIdx = (srv.id - activeId + SERVICE_CARDS.length) % SERVICE_CARDS.length;
                  const slot = currentSlots[slotIdx];
                  const isCenter = slotIdx === 0;

                  return (
                    <div
                      key={srv.id}
                      onClick={() => setActiveId(srv.id)}
                      style={{
                        position: "absolute",
                        top: slot.top,
                        left: slot.left,
                        width: `${slot.width}px`,
                        height: `${slot.height}px`,
                        transform: `translate(-50%, -50%) perspective(1200px) rotateX(${slot.rx}deg) rotateY(${slot.ry}deg) rotateZ(${slot.rz}deg) translateZ(${slot.translateZ}px) scale(${slot.scale})`,
                        zIndex: isCenter ? 50 : slot.zIndex,
                        borderRadius: isMobile ? (isCenter ? "20px" : "16px") : (isCenter ? "24px" : "18px"),
                        overflow: "hidden",
                        cursor: isCenter ? "default" : "pointer",
                        background: "#141414",
                        boxShadow: isCenter
                          ? `0 32px 80px -12px rgba(20,20,40,0.35), 0 12px 30px -6px ${srv.accent}44, 0 0 0 2.5px ${srv.accent}`
                          : `0 10px 28px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(20,20,20,0.08)`,
                        opacity: isCenter ? 1 : 0.72,
                        transition:
                          "top 0.65s cubic-bezier(0.16, 1, 0.3, 1), left 0.65s cubic-bezier(0.16, 1, 0.3, 1), width 0.65s cubic-bezier(0.16, 1, 0.3, 1), height 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, opacity 0.45s ease",
                        touchAction: "manipulation",
                        WebkitTapHighlightColor: "transparent",
                      }}
                      title={isCenter ? srv.title : `Tap to zoom ${srv.title} to center`}
                    >
                      <div
                        className={`w-full h-full relative ${slot.floatClass}`}
                        style={{
                          animationDelay: slot.floatDelay,
                          borderRadius: "inherit",
                          overflow: "hidden",
                        }}
                      >
                        {/* Tap indicator on surrounding cards */}
                        {!isCenter && (
                          <div
                            style={{
                              position: "absolute",
                              top: isMobile ? 6 : 8,
                              right: isMobile ? 6 : 8,
                              zIndex: 6,
                              background: "rgba(0,0,0,0.55)",
                              backdropFilter: "blur(4px)",
                              color: "#ffffff",
                              borderRadius: "50%",
                              width: isMobile ? 18 : 22,
                              height: isMobile ? 18 : 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: isMobile ? 9 : 11,
                              pointerEvents: "none",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                            }}
                          >
                            ↗
                          </div>
                        )}

                        {/* Photo */}
                        <img
                        src={srv.image}
                        alt={srv.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          filter: isCenter
                            ? "brightness(0.92) saturate(1.08)"
                            : "brightness(0.48) saturate(0.8)",
                          transition: "filter 0.5s ease",
                        }}
                      />

                      {/* Top subtle glass reflection */}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "35%",
                          background: "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 100%)",
                          borderRadius: isCenter ? "20px 20px 0 0" : "16px 16px 0 0",
                          pointerEvents: "none",
                          zIndex: 2,
                        }}
                      />

                      {/* Top ambient glowing bar on zoomed center card */}
                      {isCenter && (
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            top: 0,
                            left: "8%",
                            right: "8%",
                            height: "3px",
                            background: `linear-gradient(90deg, transparent, ${srv.accent} 35%, #FFFFFF 65%, transparent)`,
                            zIndex: 5,
                            pointerEvents: "none",
                          }}
                        />
                      )}

                      {/* Card bottom caption */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background:
                            "linear-gradient(to top, rgba(12, 16, 24, 0.96) 0%, rgba(12, 16, 24, 0.84) 55%, rgba(12, 16, 24, 0.15) 85%, transparent 100%)",
                          padding: isCenter
                            ? isMobile
                              ? "18px 16px 14px"
                              : "26px 22px 18px"
                            : isMobile
                            ? "10px 10px 8px"
                            : "14px 14px 12px",
                          zIndex: 3,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          transition: "padding 0.5s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: isCenter ? (isMobile ? 10 : 10.5) : 8,
                              color: srv.accent,
                              fontWeight: 700,
                            }}
                          >
                            0{srv.id + 1}
                          </span>
                          <span style={{ width: 8, height: 1, background: "rgba(255,255,255,0.35)" }} />
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: isCenter ? (isMobile ? 9 : 9.5) : 7.5,
                              letterSpacing: "0.14em",
                              color: "rgba(255,255,255,0.75)",
                            }}
                          >
                            {srv.category}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: isCenter ? (isMobile ? 18 : 22) : isMobile ? 10.5 : 14,
                            color: "#FFFFFF",
                            margin: "0 0 3px",
                            lineHeight: 1.15,
                            whiteSpace: isCenter ? "normal" : "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            transition: "font-size 0.5s ease",
                          }}
                        >
                          {srv.title}
                        </h3>

                        {isCenter && (
                          <p
                            style={{
                              fontFamily: "'Instrument Sans', sans-serif",
                              fontSize: isMobile ? 11.5 : 13,
                              color: "rgba(255,255,255,0.76)",
                              margin: isMobile ? "0 0 8px" : "0 0 10px",
                              lineHeight: 1.35,
                              maxWidth: 360,
                            }}
                          >
                            {srv.desc}
                          </p>
                        )}

                        {isCenter && (
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {srv.tags.map((t) => (
                              <span
                                key={t}
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: isMobile ? 8.5 : 9,
                                  padding: isMobile ? "2px 7px" : "2px 7px",
                                  borderRadius: 4,
                                  background: "rgba(255,255,255,0.12)",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  color: "#FFFFFF",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>

            {/* Spotlight Details Card below */}
            <div
              style={{
                marginTop: 16,
                background: "#FAF9F6",
                border: "1px solid rgba(20, 20, 20, 0.08)",
                borderRadius: 18,
                padding: isMobile ? "18px 20px" : "22px 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 14,
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    color: activeService.accent,
                    letterSpacing: "0.2em",
                    marginBottom: 4,
                    fontWeight: 700,
                  }}
                >
                  0{activeService.id + 1} // {activeService.category}
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 19 : "clamp(20px, 2.5vw, 24px)",
                    color: "#141414",
                    marginBottom: 4,
                  }}
                >
                  {activeService.title}
                </div>
                <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: isMobile ? 13 : 14, color: "#666666", maxWidth: 580 }}>
                  {activeService.desc}
                </div>
              </div>

              {onOpenContact && (
                <button
                  onClick={onOpenContact}
                  className="btn-primary"
                  style={{
                    background: activeService.accent,
                    color: "#FFFFFF",
                    borderRadius: 100,
                    padding: isMobile ? "9px 20px" : "11px 24px",
                    fontSize: isMobile ? 10 : 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  DISCUSS THIS SERVICE →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── VIEW 2: SERVICES LIST (Clean Editorial View) ── */
          <div>
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                style={{
                  borderTop: "1px solid rgba(20,20,20,0.08)",
                  padding: "16px 0",
                  display: "grid",
                  gridTemplateColumns: "36px 1fr auto",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    color: SERVICE_CARDS[i % SERVICE_CARDS.length].accent,
                    fontWeight: 700,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(16px, 2vw, 22px)",
                      color: "#141414",
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    {s.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9.5,
                      color: "#888",
                    }}
                  >
                    {SERVICE_CARDS[i % SERVICE_CARDS.length].category}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: 13.5,
                    color: "#666",
                    maxWidth: 320,
                    textAlign: "right",
                  }}
                >
                  {s.desc}
                </span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(20,20,20,0.08)" }} />
          </div>
        )}
      </div>
    </section>
  );
}
