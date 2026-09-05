import { NAV_ITEMS, PERSONAL_INFO } from "../data/portfolioData";

interface FooterProps {
  onOpenPage: (page: string) => void;
}

export default function Footer({ onOpenPage }: FooterProps) {
  return (
    <footer style={{ background: "#141414", padding: "32px 5vw 20px", color: "#FAF9F6" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 20 }} className="lg:grid-cols-[1fr_auto_auto]">
          <div>
            <div
              className="gradient-text"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(26px, 3.5vw, 40px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                marginBottom: 6,
              }}
            >
              {PERSONAL_INFO.name}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#666" }}>
              {PERSONAL_INFO.role} · {PERSONAL_INFO.secondaryRole} ({PERSONAL_INFO.timeline})
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "work") onOpenPage("work-page");
                  else if (item.id === "contact") onOpenPage("contact-page");
                  else {
                    onOpenPage("home");
                    setTimeout(() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }), 50);
                  }
                }}
                style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: "#888" }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {PERSONAL_INFO.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#999",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
              >
                {s.name} ↗
              </a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(250,249,246,0.08)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#555" }}>
          <div>© {new Date().getFullYear()} {PERSONAL_INFO.name}</div>
          <div>CURRENT STAGE: {PERSONAL_INFO.currentWork}</div>
          <div>BUILT WITH REACT & TAILWIND</div>
        </div>
      </div>
    </footer>
  );
}
