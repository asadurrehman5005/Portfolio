import ScrollReveal from "./ScrollReveal";
import { PERSONAL_INFO } from "../data/portfolioData";

export default function Statement() {
  return (
    <section style={{ background: "#F4F2EE", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 28,
            alignItems: "center",
          }}
          className="lg:grid-cols-[1fr_260px]"
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
                  fontSize: "clamp(30px, 4.2vw, 56px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.0,
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
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  borderRadius: 14,
                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(20, 20, 20, 0.08)",
                  position: "relative",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=800&fit=crop&auto=format"
                  alt="Creative Development & Architecture"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    right: 12,
                    padding: "8px 12px",
                    background: "rgba(18, 18, 18, 0.75)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 8,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "#93C5FD",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                    }}
                  >
                    CODE × DESIGN
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    PRODUCTION READY
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
