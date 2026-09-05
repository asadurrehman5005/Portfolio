import { PERSONAL_INFO } from "../data/portfolioData";

interface TrustProps {
  onOpenPage: (page: string) => void;
}

export default function Trust({ onOpenPage }: TrustProps) {
  return (
    <section style={{ background: "#F4F2EE", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 840 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "#999",
              marginBottom: 8,
            }}
          >
            09 / PHILOSOPHY
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              color: "#141414",
              marginBottom: 16,
            }}
          >
            BUILT WITH PURPOSE.
          </h2>
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(18px, 2.4vw, 26px)",
              lineHeight: 1.45,
              color: "#444",
              fontStyle: "italic",
              marginBottom: 24,
            }}
          >
            &quot;{PERSONAL_INFO.philosophy}&quot;
          </p>

          {/* 3 clean minimal metric badges */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ borderLeft: "2px solid #2563EB", paddingLeft: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: "#141414" }}>
                2024 — NOW
              </div>
              <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, color: "#777", marginTop: 2 }}>
                Full-Stack & Creative Engineering
              </div>
            </div>

            <div style={{ borderLeft: "2px solid #7C3AED", paddingLeft: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: "#141414" }}>
                {PERSONAL_INFO.currentWork}
              </div>
              <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, color: "#777", marginTop: 2 }}>
                Current Active Ecosystem
              </div>
            </div>

            <div style={{ borderLeft: "2px solid #F97316", paddingLeft: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: "#141414" }}>
                100%
              </div>
              <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, color: "#777", marginTop: 2 }}>
                Clean Architecture & Performance
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenPage("contact-page")}
            className="btn-primary"
            style={{ borderRadius: 0, fontSize: 10, padding: "10px 22px" }}
          >
            WORK WITH ME →
          </button>
        </div>
      </div>
    </section>
  );
}
