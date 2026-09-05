import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";

interface ProcessStep {
  n: string;
  title: string;
  phase: string;
  desc: string;
  deliverables: string[];
}

const STEPS: ProcessStep[] = [
  {
    n: "01",
    title: "DISCOVER",
    phase: "RESEARCH & STRATEGY",
    desc: "Deep diving into the product vision, mapping user journeys, and identifying core technical constraints to build a bulletproof architecture.",
    deliverables: ["Product Architecture", "User Personas", "Technical Roadmap"],
  },
  {
    n: "02",
    title: "DESIGN",
    phase: "UI/UX & PROTOTYPING",
    desc: "Crafting modern, accessible, and high-fidelity interfaces with Figma, scalable design tokens, and fluid interactive motion principles.",
    deliverables: ["Figma Design Systems", "High-Fi Prototypes", "Micro-Interactions"],
  },
  {
    n: "03",
    title: "BUILD",
    phase: "FULL-STACK ENGINEERING",
    desc: "Writing clean, scalable, type-safe code using modern frameworks. Implementing robust state management, fast APIs, and responsive layouts.",
    deliverables: ["React / Next.js", "Clean Architecture", "API Integration"],
  },
  {
    n: "04",
    title: "REFINE",
    phase: "OPTIMIZATION & LAUNCH",
    desc: "Benchmarking lighthouse scores, optimizing Web Vitals, testing across devices, and launching with rock-solid production deployment.",
    deliverables: ["Lighthouse 95+", "SEO & Accessibility", "Production Deploy"],
  },
];

const ACCENTS = ["#2563EB", "#7C3AED", "#F97316", "#10B981"];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-progress animation across steps every 3.5s (pauses on user hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="process"
      style={{
        background: "#FFFFFF",
        padding: "48px 5vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section Header */}
        <ScrollReveal>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 28,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: ACCENTS[activeStep],
                  marginBottom: 6,
                  transition: "color 0.4s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: ACCENTS[activeStep],
                    display: "inline-block",
                    animation: "pulse-dot 1.8s ease-in-out infinite",
                  }}
                />
                05 / PROCESS FLOW
              </div>
              <h2
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 4.2vw, 52px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  color: "#141414",
                }}
              >
                FROM IDEA TO IMPACT.
              </h2>
            </div>

            {/* Quick interactive stepper pills */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {STEPS.map((step, idx) => (
                <button
                  key={step.n}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPaused(true);
                  }}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 10px",
                    borderRadius: 100,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    background: activeStep === idx ? ACCENTS[idx] : "rgba(20, 20, 20, 0.05)",
                    color: activeStep === idx ? "#FFFFFF" : "#888",
                    transition: "all 0.3s ease",
                  }}
                >
                  {step.n}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Animated Timeline */}
        <div
          style={{
            position: "relative",
            maxWidth: 720,
            margin: "0 auto",
            paddingTop: 8,
            paddingBottom: 8,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Base vertical connector line */}
          <div className="timeline-line" style={{ left: 24 }} />

          {/* Animated Laser Beam traveling down the line */}
          <div className="timeline-laser-beam" style={{ left: 24 }} />

          {/* Steps */}
          {STEPS.map((s, i) => {
            const isActive = activeStep === i;
            const accent = ACCENTS[i];

            return (
              <ScrollReveal key={s.n} delay={i * 0.08}>
                <div
                  className={`timeline-step-card ${isActive ? "active-step" : ""}`}
                  onClick={() => setActiveStep(i)}
                  style={{
                    display: "flex",
                    gap: 20,
                    marginBottom: i < STEPS.length - 1 ? 16 : 0,
                    borderColor: isActive ? `${accent}40` : "transparent",
                  }}
                >
                  {/* Step Dot Badge with animated glowing pulse */}
                  <div
                    className="timeline-dot"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: isActive ? accent : `${accent}15`,
                      border: `2px solid ${accent}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActive ? "#FFFFFF" : accent,
                      fontWeight: 700,
                      fontSize: 14,
                      boxShadow: isActive ? `0 0 20px ${accent}60` : "none",
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {s.n}
                  </div>

                  {/* Step Content */}
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <h3
                          style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: 18,
                            color: "#141414",
                          }}
                        >
                          {s.title}
                        </h3>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9,
                            letterSpacing: "0.15em",
                            color: accent,
                            fontWeight: 600,
                          }}
                        >
                          // {s.phase}
                        </span>
                      </div>

                      {isActive && (
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9,
                            color: accent,
                            fontWeight: 700,
                            background: `${accent}12`,
                            padding: "2px 8px",
                            borderRadius: 100,
                            border: `1px solid ${accent}30`,
                          }}
                        >
                          ACTIVE PHASE
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: 13.5,
                        color: isActive ? "#444" : "#777",
                        lineHeight: 1.55,
                        marginBottom: 10,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {s.desc}
                    </p>

                    {/* Deliverables tags */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {s.deliverables.map((item) => (
                        <span
                          key={item}
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9.5,
                            letterSpacing: "0.08em",
                            padding: "3px 10px",
                            borderRadius: 100,
                            background: isActive ? `${accent}14` : "rgba(20, 20, 20, 0.04)",
                            color: isActive ? accent : "#888",
                            border: `1px solid ${isActive ? `${accent}35` : "rgba(20, 20, 20, 0.08)"}`,
                            transition: "all 0.3s ease",
                          }}
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
