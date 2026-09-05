import { PERSONAL_INFO } from "../data/portfolioData";

export default function About() {
  return (
    <section id="about" style={{ background: "#FFFFFF", padding: "40px 5vw" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 28,
          alignItems: "center",
        }}
        className="lg:grid-cols-2"
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "#7C3AED",
              marginBottom: 4,
            }}
          >
            07 / ABOUT
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 54px)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#141414",
              marginBottom: 14,
            }}
          >
            MORE THAN JUST CODE.
          </h2>
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(16px, 1.8vw, 20px)",
              lineHeight: 1.55,
              color: "#444",
              marginBottom: 20,
              fontStyle: "italic",
            }}
          >
            &quot;I enjoy turning complex ideas into simple, thoughtful digital experiences — from the first pixel to the final line of code.&quot;
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
            {[
              ["NAME", PERSONAL_INFO.name],
              ["ROLE", PERSONAL_INFO.role],
              ["CURRENT WORK", `${PERSONAL_INFO.currentWork} ECOSYSTEM`],
              ["LOCATION", PERSONAL_INFO.location],
              ["TIMELINE", PERSONAL_INFO.timeline],
              ["AVAILABILITY", "OPEN TO PROJECTS"],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "#bbb" }}>{label}</div>
                <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#141414", marginTop: 2 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="gradient-text"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(110px, 18vw, 200px)",
              letterSpacing: "-0.06em",
              lineHeight: 0.85,
              userSelect: "none",
              opacity: 0.2,
            }}
          >
            AR
          </div>
        </div>
      </div>
    </section>
  );
}
