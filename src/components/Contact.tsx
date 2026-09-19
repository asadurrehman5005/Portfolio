import { useState } from "react";
import { PERSONAL_INFO } from "../data/portfolioData";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", type: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Anti-bot honeypot check: if hidden field is filled, silently reject
    if (honeypot.trim().length > 0) {
      console.warn("Spam detected.");
      return;
    }

    const subject = encodeURIComponent(`Project Inquiry: ${formData.type || "New Project"}`);
    const body = encodeURIComponent(
      `Hi Asad,\n\nName: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.type}\n\nMessage:\n${formData.message}\n`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" style={{ background: "#FFF4EF", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28 }} className="lg:grid-cols-[1fr_420px]">
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.25em", color: "#F97316", marginBottom: 8 }}>
              10 / CONTACT
            </div>
            <h2
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(38px, 6vw, 76px)",
                letterSpacing: "-0.05em",
                lineHeight: 0.88,
                color: "#141414",
                marginBottom: 6,
              }}
            >
              LET&apos;S <span className="gradient-text">TALK.</span>
            </h2>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(18px, 2.2vw, 26px)", color: "#F97316", marginBottom: 20 }}>
              Have an idea? Let&apos;s build something great together.
            </p>

            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="contact-glass"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                marginBottom: 16,
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F9731615", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                ✉
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "#999" }}>DIRECT EMAIL</div>
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
                {/* Honeypot field - hidden from genuine users, traps automated spam bots */}
                <input
                  type="text"
                  name="_hp_security_check"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: "none", position: "absolute", opacity: 0, pointerEvents: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
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
    </section>
  );
}
