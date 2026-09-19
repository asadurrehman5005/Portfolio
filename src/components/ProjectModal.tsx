import { useEffect } from "react";
import type { Project } from "../types";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onContact: () => void;
}

export default function ProjectModal({ project, onClose, onContact }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(15, 15, 15, 0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FAF9F6",
          borderRadius: 20,
          maxWidth: 640,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "28px",
          position: "relative",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(20, 20, 20, 0.08)",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: project.accent, fontWeight: 700 }}>
            {project.number}
          </span>
          <span style={{ width: 14, height: 1, background: "#ccc" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#888" }}>
            {project.year}
          </span>
          {project.isCurrent && (
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", background: "rgba(37,99,235,0.15)", border: "1px solid #2563EB", color: "#2563EB", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>
              ● CURRENT WORKING STAGE
            </span>
          )}
        </div>

        <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 32, color: "#141414", marginBottom: 8 }}>
          {project.title}
        </h2>

        <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 16, color: "#555", lineHeight: 1.55, marginBottom: 16 }}>
          {project.description}
        </p>

        <div style={{ width: "100%", height: 240, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
          <img src={project.image} alt={`${project.title} — ${project.subtitle}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#888", marginBottom: 6 }}>TECH STACK</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {project.tags.map((t) => (
              <span key={t} className="tag-pill-dark">
                {t}
              </span>
            ))}
          </div>
        </div>

        {project.liveUrl && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#888", marginBottom: 6 }}>
              LIVE WEBSITE
            </div>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 16px",
                borderRadius: 100,
                background: `${project.accent}14`,
                border: `1px solid ${project.accent}40`,
                color: project.accent,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>{project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
              <span>↗</span>
            </a>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", alignItems: "center" }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 10,
                padding: "8px 18px",
                borderRadius: 100,
                background: project.accent,
                color: "#FFFFFF",
                textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                letterSpacing: "0.08em",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: `0 4px 14px ${project.accent}40`,
              }}
            >
              <span>VISIT LIVE SITE</span>
              <span>↗</span>
            </a>
          )}
          <button onClick={onClose} className="btn-outline" style={{ fontSize: 10, padding: "8px 18px", borderRadius: 100 }}>
            CLOSE
          </button>
          <button
            onClick={() => {
              onClose();
              onContact();
            }}
            className="btn-primary"
            style={{ fontSize: 10, padding: "8px 18px", borderRadius: 100 }}
          >
            DISCUSS THIS PROJECT →
          </button>
        </div>
      </div>
    </div>
  );
}
