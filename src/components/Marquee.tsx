export default function Marquee() {
  const items = ["DESIGN", "CODE", "MOTION", "AI", "PRODUCT", "DESIGN", "CODE", "MOTION", "AI", "PRODUCT"];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(20,20,20,0.08)",
        borderBottom: "1px solid rgba(20,20,20,0.08)",
        background: "#FAF9F6",
        padding: "8px 0",
      }}
    >
      <div className="marquee-track" style={{ whiteSpace: "nowrap", display: "flex" }}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 10,
              letterSpacing: "0.25em",
              fontWeight: 600,
              color: i % 5 === 2 ? "#2563EB" : "#141414",
              padding: "0 18px",
            }}
          >
            {item}
            {i % 5 !== 4 && <span style={{ marginLeft: 18, color: "#ccc" }}>×</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
