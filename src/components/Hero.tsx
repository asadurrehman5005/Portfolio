import { useState, useEffect } from "react";
import HeroBlueprint3D from "./HeroBlueprint3D";
import { PERSONAL_INFO } from "../data/portfolioData";

interface HeroProps {
  onOpenPage: (page: string) => void;
}

export default function Hero({ onOpenPage }: HeroProps) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isMobile = windowWidth < 640;

  return (
    <section
      id="hero"
      style={{
        background: "#FAF9F6",
        padding: isMobile ? "126px 5vw 24px" : isDesktop ? "86px 5vw 32px" : "112px 5vw 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1.1fr 1fr" : "1fr",
          gap: isDesktop ? 28 : 20,
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left: Typography */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* TopSection HUD Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10.5px",
                letterSpacing: "0.22em",
                color: "#2563EB",
                fontWeight: 700,
              }}
            >
              // ARCHITECTURAL IDENTITY
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9.5px",
                letterSpacing: "0.14em",
                color: "#999",
                borderLeft: "1px solid rgba(20, 20, 20, 0.15)",
                paddingLeft: "10px",
              }}
            >
              SEC 01 // TOP
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <img
              src="/profile.jpg"
              alt="Asad Ur Rehman"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center top",
                border: "2px solid #2563EB",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "#2563EB",
                fontWeight: 600,
              }}
            >
              {PERSONAL_INFO.role}
            </span>
            <span style={{ width: 20, height: 1, background: "#2563EB", display: "block" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "#999",
              }}
            >
              {PERSONAL_INFO.secondaryRole}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontSize: "clamp(44px, 8vw, 92px)",
              margin: 0,
            }}
          >
            <div
              style={{
                color: "#bbb",
                fontSize: "0.45em",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                marginBottom: "0.08em",
                lineHeight: 1,
              }}
            >
              HELLO, I&apos;M
            </div>
            <div className="gradient-text">ASAD UR</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.05em" }}>
              <span className="gradient-text">REHMAN</span>
              <span style={{ color: "#F97316", fontSize: "1.1em", lineHeight: 1 }}>.</span>
            </div>
          </h1>

          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(14px, 1.5vw, 16px)",
              lineHeight: 1.55,
              color: "#666",
              maxWidth: 440,
              marginTop: 14,
              marginBottom: 20,
            }}
          >
            I turn ideas into digital experiences that are beautiful, useful and built to perform.
          </p>

          {/* Direct second-page buttons! */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => onOpenPage("work-page")}
              className="btn-primary"
              style={{ borderRadius: 0, fontSize: 11, padding: "10px 22px" }}
            >
              EXPLORE MY WORK →
            </button>
            <button
              onClick={() => onOpenPage("contact-page")}
              className="btn-outline"
              style={{ borderRadius: 0, fontSize: 11, padding: "10px 22px" }}
            >
              LET&apos;S CONNECT ↗
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 20,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "#aaa",
              flexWrap: "wrap",
            }}
          >
            <span>BASED IN {PERSONAL_INFO.location}</span>
            <span style={{ color: "#ddd" }}>·</span>
            <span>WORKING WORLDWIDE</span>
            <span style={{ color: "#ddd" }}>·</span>
            <span style={{ color: "#2563EB", fontWeight: 600 }}>BUILDING {PERSONAL_INFO.currentWork}</span>
          </div>

          {/* Futuristic Coordinates Tag from TopSection */}
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 12px",
                borderRadius: "999px",
                background: "rgba(37, 99, 235, 0.05)",
                border: "1px solid rgba(37, 99, 235, 0.15)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#2563EB",
                  boxShadow: "0 0 8px #2563EB",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9.5px",
                  letterSpacing: "0.14em",
                  color: "#2563EB",
                  fontWeight: 600,
                }}
              >
                LAT 31.5204° N // LON 74.3587° E [PAKISTAN]
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3D Architectural Blueprint Wireframe Model (TopSection Model) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: isMobile ? 360 : 490,
            height: isMobile ? 380 : 490,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: isDesktop ? 0 : 12,
          }}
        >
          <HeroBlueprint3D />
        </div>
      </div>
    </section>
  );
}
