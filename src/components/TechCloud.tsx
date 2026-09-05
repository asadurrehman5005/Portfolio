import { TECH } from "../data/portfolioData";

export default function TechCloud() {
  return (
    <section style={{ background: "#F7F4EE", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "#F97316",
              marginBottom: 4,
            }}
          >
            04 / TOOLS I SPEAK
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(26px, 3.5vw, 48px)",
              letterSpacing: "-0.04em",
              color: "#141414",
              lineHeight: 0.95,
            }}
          >
            TOOLS I SPEAK.
          </h2>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {TECH.map((t, i) => (
            <div
              key={i}
              className="tech-item"
              style={{
                fontSize: t.size,
                color: t.accent ?? "#141414",
                borderColor: t.accent ? `${t.accent}30` : "rgba(20, 20, 20, 0.08)",
                padding: "8px 18px",
              }}
            >
              {t.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
