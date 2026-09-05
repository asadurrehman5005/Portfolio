export default function Sculpture() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 300 }}>
      {/* Primary orb */}
      <div
        className="float-a"
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          background: "radial-gradient(circle at 38% 35%, #93C5FD, #4F46E5 55%, #7C3AED)",
          borderRadius: "62% 38% 46% 54% / 60% 44% 56% 40%",
          top: "4%",
          left: "8%",
          filter: "blur(1px)",
          opacity: 0.92,
        }}
      />
      {/* Orange accent orb */}
      <div
        className="float-b"
        style={{
          position: "absolute",
          width: 140,
          height: 140,
          background: "radial-gradient(circle at 42% 38%, #FED7AA, #F97316 60%)",
          borderRadius: "40% 60% 65% 35% / 45% 35% 65% 55%",
          bottom: "10%",
          right: "12%",
          opacity: 0.88,
        }}
      />
      {/* Lime accent orb */}
      <div
        className="float-c"
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          background: "radial-gradient(circle at 50% 50%, #D9F99D, #84CC16)",
          borderRadius: "50%",
          bottom: "22%",
          left: "12%",
          opacity: 0.75,
        }}
      />
      {/* Outer spinning ring */}
      <div
        className="spin-ring"
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          border: "1.5px solid rgba(37, 99, 235, 0.2)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          pointerEvents: "none",
        }}
      />
      {/* Inner reverse spinning ring */}
      <div
        className="spin-ring-rev"
        style={{
          position: "absolute",
          width: 190,
          height: 190,
          border: "1px solid rgba(124, 58, 237, 0.18)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
