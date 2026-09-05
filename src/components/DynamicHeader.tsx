import { useState, useEffect } from "react";
import { NAV_ITEMS } from "../data/portfolioData";

interface DynamicHeaderProps {
  activeView: string;
  onOpenPage: (page: string) => void;
}

export default function DynamicHeader({ activeView, onOpenPage }: DynamicHeaderProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollPercent, setScrollPercent] = useState(0);
  const [timeStr, setTimeStr] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / docHeight) * 100))) : 0;
      setScrollPercent(pct);
      setScrolled(window.scrollY > 20);

      if (activeView === "home") {
        const probe = window.scrollY + window.innerHeight * 0.35;
        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
          const el = document.getElementById(NAV_ITEMS[i].id);
          if (el && el.offsetTop <= probe) {
            setActiveSection(NAV_ITEMS[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeView]);

  const currentId = activeView === "home" ? activeSection : activeView;
  const activeMeta = NAV_ITEMS.find((n) => n.id === currentId) || NAV_ITEMS[0];

  const handleItemClick = (id: string) => {
    setMobileOpen(false);
    if (id === "hero" || id === "home") {
      onOpenPage("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "work") {
      onOpenPage("work-page");
    } else if (id === "contact") {
      onOpenPage("contact-page");
    } else {
      onOpenPage("home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          width: "calc(100% - 24px)",
          maxWidth: 1200,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 12px 6px 8px",
            background: scrolled ? "rgba(250, 249, 246, 0.94)" : "rgba(250, 249, 246, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(20, 20, 20, 0.08)",
            borderRadius: 100,
            boxShadow: scrolled ? "0 8px 30px rgba(0, 0, 0, 0.07)" : "0 2px 14px rgba(0, 0, 0, 0.03)",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          {/* Bottom progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 2,
              width: `${scrollPercent}%`,
              background: `linear-gradient(90deg, #2563EB, ${activeMeta.color})`,
              transition: "width 0.1s linear",
            }}
          />

          {/* Left: Monogram + Shortened status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => handleItemClick("hero")}
              title="Home"
              style={{
                background: "#141414",
                border: "none",
                cursor: "pointer",
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FAF9F6",
                fontWeight: 700,
                fontSize: 11,
                fontFamily: "'Instrument Sans', sans-serif",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = activeMeta.color)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#141414")}
            >
              AR
            </button>

            {/* Shortened badge: e.g. 06 // CONTACT */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 100,
                background: `${activeMeta.color}12`,
                border: `1px solid ${activeMeta.color}35`,
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: activeMeta.color,
                  display: "inline-block",
                  animation: "pulse-dot 1.8s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  color: activeMeta.color,
                  whiteSpace: "nowrap",
                }}
              >
                {activeMeta.num} // {activeMeta.status}
              </span>
            </div>
          </div>

          {/* Center: Navigation pills */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden md:flex">
            {NAV_ITEMS.map((item) => {
              const isCurrent = currentId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    background: isCurrent ? "rgba(20, 20, 20, 0.08)" : "transparent",
                    color: isCurrent ? "#141414" : "#666",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px 11px",
                    borderRadius: 100,
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    fontWeight: isCurrent ? 700 : 500,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.color = "#141414";
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.color = "#666";
                  }}
                >
                  {isCurrent && (
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: item.color,
                      }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Live Clock + Reading Progress % + Action button */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 100,
                background: "rgba(20, 20, 20, 0.04)",
                border: "1px solid rgba(20, 20, 20, 0.06)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#666",
              }}
              className="hidden sm:flex"
            >
              <span>🇵🇰</span>
              <span>{timeStr || "LIVE"}</span>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                color: activeMeta.color,
                padding: "4px 8px",
                borderRadius: 100,
                background: `${activeMeta.color}10`,
                border: `1px solid ${activeMeta.color}25`,
                minWidth: 42,
                textAlign: "center",
              }}
            >
              {scrollPercent}%
            </div>

            <button
              onClick={() => onOpenPage("contact-page")}
              style={{
                background: activeView === "contact-page" ? activeMeta.color : "#141414",
                color: "#FAF9F6",
                border: "none",
                cursor: "pointer",
                padding: "7px 14px",
                borderRadius: 100,
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = activeMeta.color)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  activeView === "contact-page" ? activeMeta.color : "#141414")
              }
            >
              <span>TALK</span>
              <span>→</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: 28,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 16,
                  height: 1.5,
                  background: "#141414",
                  transform: mobileOpen ? "rotate(45deg) translateY(4px)" : "none",
                  transition: "all 0.3s ease",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 12,
                  height: 1.5,
                  background: "#141414",
                  opacity: mobileOpen ? 0 : 1,
                  transition: "all 0.3s ease",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 16,
                  height: 1.5,
                  background: "#141414",
                  transform: mobileOpen ? "rotate(-45deg) translateY(-4px)" : "none",
                  transition: "all 0.3s ease",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 55,
          background: "rgba(18, 18, 18, 0.95)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 24px 30px",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? "translateY(0)" : "translateY(-14px)",
          pointerEvents: mobileOpen ? "all" : "none",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "10px 0",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                color: currentId === item.id ? item.color : "rgba(255, 255, 255, 0.65)",
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "clamp(24px, 5.5vw, 38px)",
                fontWeight: 700,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <span>{item.label}</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: currentId === item.id ? item.color : "rgba(255, 255, 255, 0.3)",
                }}
              >
                {item.num}
              </span>
            </button>
          ))}
        </div>

        {/* Social Quick Links in Mobile Drawer */}
        <div style={{ marginTop: 28, display: "flex", gap: 16, alignItems: "center" }}>
          <a
            href="https://github.com/asadurrehman5005"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FAF9F6",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>GITHUB</span>
            <span>↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/asad-ur-rehman-089bb93a2?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FAF9F6",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>LINKEDIN</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
