import { JOURNEY } from "../data/portfolioData";

export default function Journey() {
  return (
    <section id="journey" style={{ background: "#F4F2EE", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "#999",
              marginBottom: 4,
            }}
          >
            06 / THE JOURNEY
          </div>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontStyle: "italic",
              color: "#141414",
              lineHeight: 1,
            }}
          >
            The Journey (2024 — PRESENT)
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 14 }}>
          {JOURNEY.map((item) => (
            <div key={item.year} className="journey-card" style={{ padding: "18px" }}>
              <div
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: "-0.04em",
                  color: `${item.accent}20`,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {item.year}
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  color: item.accent,
                  marginBottom: 6,
                }}
              >
                {item.word}
              </div>
              <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, lineHeight: 1.5, color: "#888" }}>
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
