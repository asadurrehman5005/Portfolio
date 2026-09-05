import Tech3DNetwork from "./Tech3DNetwork";
import { PERSONAL_INFO } from "../data/portfolioData";

interface HeroProps {
  onOpenPage: (page: string) => void;
}

export default function Hero({ onOpenPage }: HeroProps) {
  return (
    <section
      id="hero"
      style={{
        background: "#FAF9F6",
        padding: "68px 5vw 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 28,
        }}
        className="lg:grid-cols-[1.1fr_1fr]"
      >
        {/* Left: Typography */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
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

          <div
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontSize: "clamp(44px, 8vw, 92px)",
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
          </div>

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
        </div>

        {/* Right: 3D Interactive Tech Network (Attached 3D Model) */}
        <div
          style={{
            position: "relative",
            minHeight: 460,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tech3DNetwork coreLabel="AR" accentColor="#2563EB" />
        </div>
      </div>
    </section>
  );
}
