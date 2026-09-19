import { useState, useEffect } from "react";
import { PERSONAL_INFO } from "../data/portfolioData";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        if (c >= 100) {
          clearInterval(t);
          setFading(true);
          setTimeout(onComplete, 220);
          return 100;
        }
        return c + 5;
      });
    }, 8);
    return () => clearInterval(t);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#FAF9F6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.25s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="gradient-text"
          style={{
            fontSize: "clamp(80px, 14vw, 130px)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.88,
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          AR
        </div>
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.35em",
            color: "#aaa",
            marginTop: 12,
            fontWeight: 500,
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          {PERSONAL_INFO.name}
        </div>
        <div
          style={{
            marginTop: 20,
            width: 140,
            height: 2,
            background: "rgba(20, 20, 20, 0.08)",
            borderRadius: 4,
            overflow: "hidden",
            margin: "20px auto 0",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${count}%`,
              background: "linear-gradient(90deg, #2563EB, #7C3AED, #F97316)",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}
