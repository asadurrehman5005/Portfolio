import ScrollReveal from "./ScrollReveal";
import Tech3DNetwork from "./Tech3DNetwork";
import { PERSONAL_INFO } from "../data/portfolioData";

export default function Statement() {
  return (
    <section style={{ background: "#F4F2EE", padding: "48px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
            alignItems: "center",
          }}
          className="lg:grid-cols-[1.1fr_1fr]"
        >
          <div>
            <ScrollReveal>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: "#999",
                  marginBottom: 10,
                }}
              >
                01 / ABOUT THE WORK
              </div>
              <h2
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(30px, 4.2vw, 54px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "#141414",
                }}
              >
                I BUILD DIGITAL EXPERIENCES WHERE
                <br />
                <span className="gradient-text-static">DESIGN</span> MEETS{" "}
                <span style={{ color: "#F97316" }}>TECHNOLOGY.</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#666",
                  maxWidth: 520,
                  marginTop: 14,
                }}
              >
                Every product I build lives at the intersection of creative thinking and technical precision.
                Explore the live 3D tech network to see key architectural technologies and stack integrations.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 440,
                minHeight: 350,
                background: "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.04) 0%, rgba(255, 255, 255, 0.6) 100%)",
                borderRadius: 20,
                border: "1px solid rgba(20, 20, 20, 0.08)",
                boxShadow: "0 20px 48px -12px rgba(0, 0, 0, 0.06)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tech3DNetwork coreLabel="AR" />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
                  right: 14,
                  padding: "8px 14px",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 10,
                  border: "1px solid rgba(20, 20, 20, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#2563EB",
                      boxShadow: "0 0 8px #2563EB",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "#141414",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                    }}
                  >
                    INTERACTIVE TECH NETWORK
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    color: "#666",
                  }}
                >
                  DRAG TO EXPLORE
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
