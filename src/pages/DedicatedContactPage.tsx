import { useState } from "react";
import { PERSONAL_INFO } from "../data/portfolioData";

interface DedicatedContactPageProps {
  onBack: () => void;
}

export default function DedicatedContactPage({ onBack }: DedicatedContactPageProps) {
  const [formData, setFormData] = useState({ name: "", email: "", type: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: "#FFF4EF", minHeight: "90vh", padding: "72px 5vw 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(20,20,20,0.08)",
            paddingBottom: 12,
            marginBottom: 24,
          }}
        >
          <button
            onClick={onBack}
            className="btn-outline"
            style={{
              borderRadius: 100,
              fontSize: 10,
              padding: "6px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>←</span>
            <span>BACK TO MAIN PORTFOLIO</span>
          </button>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#888" }}>
            PAGE 3 // CONTACT
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="lg:grid-cols-[1fr_420px]">
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#F97316", marginBottom: 8 }}>
              DIRECT REACH
            </div>
            <h1
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(38px, 6vw, 76px)",
                letterSpacing: "-0.05em",
                lineHeight: 0.88,
                color: "#141414",
                marginBottom: 8,
              }}
            >
              LET&apos;S <span className="gradient-text">TALK.</span>
            </h1>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(18px, 2.2vw, 26px)", color: "#F97316", marginBottom: 24 }}>
              Have an idea? Let&apos;s build something great together.
            </p>

            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="contact-glass"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", marginBottom: 16 }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F9731615", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                ✉
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#999" }}>DIRECT EMAIL</div>
                <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600, fontSize: 14, color: "#141414" }}>
                  {PERSONAL_INFO.email} ↗
                </div>
              </div>
            </a>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PERSONAL_INFO.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-glass"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#555",
                    padding: "8px 14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span>{s.name}</span>
                  <span>↗</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            {sent ? (
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 14, padding: "36px 20px", textAlign: "center" }}>
                <div className="gradient-text" style={{ fontSize: 40, fontWeight: 700 }}>✓</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>Message Sent</div>
                <p style={{ color: "#777", fontSize: 13, marginTop: 4 }}>Thank you! I will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(16px)",
                  borderRadius: 14,
                  padding: "24px 20px",
                }}
              >
                <input className="underline-input" placeholder="YOUR NAME" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input className="underline-input" placeholder="EMAIL ADDRESS" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <input className="underline-input" placeholder="PROJECT TYPE" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                <textarea className="underline-input" placeholder="TELL ME ABOUT IT" rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ resize: "none" }} required />
                <button type="submit" className="btn-primary" style={{ marginTop: 4, borderRadius: 0, alignSelf: "flex-start", padding: "10px 20px" }}>
                  SEND MESSAGE →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
