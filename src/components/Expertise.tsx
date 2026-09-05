import ScrollReveal from "./ScrollReveal";
import { EXPERTISE } from "../data/portfolioData";

export default function Expertise() {
  return (
    <section id="expertise" style={{ background: "#F0F4FF", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "#7C3AED",
              marginBottom: 4,
            }}
          >
            03 / WHAT I DO
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 52px)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#141414",
            }}
          >
            WHAT I BRING TO THE TABLE.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 12,
          }}
        >
          {EXPERTISE.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.05} direction="scale">
              <div className="glass-card" style={{ padding: "20px 18px 16px", cursor: "default" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${item.accent}15`,
                      border: `1px solid ${item.accent}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      color: item.accent,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        color: item.accent,
                      }}
                    >
                      {item.n}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#141414",
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {item.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        padding: "3px 8px",
                        background: `${item.accent}0A`,
                        color: item.accent,
                        borderRadius: 100,
                        border: `1px solid ${item.accent}20`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
