import { useState, useEffect } from "react";
import { PERSONAL_INFO } from "../data/portfolioData";

export default function About() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;

  return (
    <section id="about" style={{ background: "#FFFFFF", padding: "40px 5vw" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap: isDesktop ? 48 : 32,
          alignItems: "center",
        }}
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

        {/* Right: Asad Ur Rehman Profile Portrait Card */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 380,
              aspectRatio: "4/5",
              borderRadius: "28px 8px 28px 8px",
              overflow: "hidden",
              boxShadow: "0 24px 60px -15px rgba(20, 20, 40, 0.18), 0 0 0 1px rgba(20, 20, 20, 0.08)",
              background: "#141414",
            }}
          >
            <img
              src="/profile.jpg"
              alt="Asad Ur Rehman — Creative Developer &amp; Full-Stack Engineer"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                filter: "brightness(0.98) contrast(1.02)",
                transition: "transform 0.5s ease",
              }}
              className="hover:scale-105"
            />

            {/* Bottom editorial badge */}
            <div
              style={{
                position: "absolute",
                bottom: 14,
                left: 14,
                right: 14,
                padding: "10px 14px",
                background: "rgba(18, 18, 18, 0.82)",
                backdropFilter: "blur(12px)",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#93C5FD",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  ASAD UR REHMAN
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.75)",
                    marginTop: 1,
                  }}
                >
                  Creative Dev &amp; Full-Stack
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 8px",
                  borderRadius: 100,
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.35)",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#22C55E",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: "#86EFAC",
                    fontWeight: 600,
                  }}
                >
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
