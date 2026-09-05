import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { SERVICES } from "../data/portfolioData";

interface ServicesProps {
  onOpenContact?: () => void;
}

interface ServiceDetail {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  accent: string;
  timeline: string;
  deliverables: string[];
  techStack: string[];
  metrics: { label: string; value: string };
}

const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 0,
    number: "01",
    title: SERVICES[0]?.title || "WEB APPLICATIONS",
    subtitle: "Full-stack scalable web platforms built with precision architecture, ultra-fast render cycles, and uncompromising UX.",
    category: "ENGINEERING",
    accent: "#2563EB",
    timeline: "2 — 6 WEEKS",
    deliverables: [
      "Sub-second SSR & dynamic Edge rendering",
      "Robust TypeScript end-to-end type safety",
      "Scalable multi-tenant microservices & databases",
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Node.js", "PostgreSQL"],
    metrics: { label: "PAGE SPEED", value: "99/100" },
  },
  {
    id: 1,
    number: "02",
    title: SERVICES[1]?.title || "MOBILE APPS",
    subtitle: "Fluid, high-performance cross-platform iOS & Android mobile applications engineered with native gestures and offline-first reliability.",
    category: "MOBILE NATIVE",
    accent: "#F43F5E",
    timeline: "3 — 8 WEEKS",
    deliverables: [
      "Smooth 60fps gesture-driven animations",
      "Offline cache synchronization & push alerts",
      "Seamless App Store & Google Play distribution",
    ],
    techStack: ["React Native", "Expo SDK", "iOS", "Android", "Tailwind"],
    metrics: { label: "FRAME RATE", value: "60 FPS" },
  },
  {
    id: 2,
    number: "03",
    title: SERVICES[2]?.title || "AI PRODUCTS",
    subtitle: "Custom generative AI tools, autonomous agent workflows, and intelligent semantic search engines tailored for high-impact automation.",
    category: "INTELLIGENCE",
    accent: "#10B981",
    timeline: "2 — 5 WEEKS",
    deliverables: [
      "Custom LLM prompts, RAG & vector embeddings",
      "Ultra-low latency token streaming interfaces",
      "Automated task orchestration & agent pipelines",
    ],
    techStack: ["OpenAI", "LangChain", "FastAPI", "Python", "Pinecone"],
    metrics: { label: "ACCURACY", value: "99.4%" },
  },
  {
    id: 3,
    number: "04",
    title: SERVICES[3]?.title || "E-COMMERCE",
    subtitle: "Conversion-optimized digital commerce destinations engineered for seamless checkout journeys, instant search, and high retention.",
    category: "COMMERCE",
    accent: "#F97316",
    timeline: "3 — 7 WEEKS",
    deliverables: [
      "Frictionless 1-click checkout workflows",
      "Dynamic catalog search with instant filtering",
      "Stripe, PayPal, and regional payment gateways",
    ],
    techStack: ["Next.js", "Shopify API", "Stripe", "Prisma", "Tailwind"],
    metrics: { label: "CONVERSION", value: "+38% CVR" },
  },
  {
    id: 4,
    number: "05",
    title: SERVICES[4]?.title || "DESIGN SYSTEMS",
    subtitle: "Scalable, accessible design tokens and component libraries that empower development teams to ship cohesive interfaces faster.",
    category: "UI / UX CRAFT",
    accent: "#7C3AED",
    timeline: "2 — 4 WEEKS",
    deliverables: [
      "WCAG 2.1 AA accessible component tokens",
      "Figma-to-code automated synchronizations",
      "Multi-brand theme switching & interactive docs",
    ],
    techStack: ["Figma Tokens", "Radix UI", "Tailwind CSS", "Storybook"],
    metrics: { label: "REUSABILITY", value: "100%" },
  },
  {
    id: 5,
    number: "06",
    title: SERVICES[5]?.title || "INTERACTIVE WEBSITES",
    subtitle: "Award-caliber interactive digital experiences featuring immersive 3D WebGL environments, inertia physics, and cinematic storytelling.",
    category: "CREATIVE TECH",
    accent: "#06B6D4",
    timeline: "3 — 6 WEEKS",
    deliverables: [
      "Interactive 3D WebGL geometry & shader effects",
      "Inertial smooth scroll with spatial depth",
      "Mobile-optimized GPU resource management",
    ],
    techStack: ["Three.js", "WebGL", "GSAP", "GLSL Shaders", "Canvas"],
    metrics: { label: "GPU PERFORMANCE", value: "OPTIMIZED" },
  },
  {
    id: 6,
    number: "07",
    title: SERVICES[6]?.title || "FULL-STACK SYSTEMS",
    subtitle: "End-to-end digital infrastructure architected for enterprise durability, elastic cloud autoscaling, and zero-downtime deployments.",
    category: "ARCHITECTURE",
    accent: "#3B82F6",
    timeline: "4 — 10 WEEKS",
    deliverables: [
      "Containerized Docker & Kubernetes architectures",
      "Automated CI/CD testing and rollout pipelines",
      "Multi-region caching with Redis and CDN edge",
    ],
    techStack: ["NestJS", "PostgreSQL", "Docker", "Redis", "AWS / GCP"],
    metrics: { label: "AVAILABILITY", value: "99.99%" },
  },
];

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE MINI WIDGETS FOR EACH SERVICE
   ───────────────────────────────────────────────────────────── */

// 1. Web Apps Widget: Interactive Live Code Terminal
function WebAppWidget({ accent }: { accent: string }) {
  const [activeTab, setActiveTab] = useState<"app" | "metrics">("app");

  return (
    <div
      style={{
        background: "#12141C",
        borderRadius: 16,
        padding: "16px 18px",
        color: "#FAF9F6",
        fontFamily: "'JetBrains Mono', monospace",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ fontSize: 9.5, color: "#888", marginLeft: 8 }}>v15.1.0-edge</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setActiveTab("app")}
            style={{
              background: activeTab === "app" ? "rgba(255,255,255,0.12)" : "transparent",
              border: "none",
              color: activeTab === "app" ? "#fff" : "#777",
              fontSize: 9,
              padding: "2px 8px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Server.tsx
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            style={{
              background: activeTab === "metrics" ? "rgba(255,255,255,0.12)" : "transparent",
              border: "none",
              color: activeTab === "metrics" ? "#fff" : "#777",
              fontSize: 9,
              padding: "2px 8px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Telemetry
          </button>
        </div>
      </div>

      {activeTab === "app" ? (
        <div style={{ fontSize: 11, lineHeight: 1.6, color: "#94A3B8" }}>
          <div><span style={{ color: "#F43F5E" }}>export default async function</span> <span style={{ color: "#60A5FA" }}>Platform</span>() {"{"}</div>
          <div style={{ paddingLeft: 12 }}>
            <span style={{ color: "#A78BFA" }}>const</span> data = <span style={{ color: "#F43F5E" }}>await</span> fetchCore({"{"}
          </div>
          <div style={{ paddingLeft: 24, color: "#34D399" }}>
            ssr: <span style={{ color: "#FBBF24" }}>true</span>, latency: <span style={{ color: "#FBBF24" }}>\"12ms\"</span>, cache: <span style={{ color: "#FBBF24" }}>\"edge\"</span>
          </div>
          <div style={{ paddingLeft: 12 }}>{"});"}</div>
          <div style={{ paddingLeft: 12 }}>
            <span style={{ color: "#F43F5E" }}>return</span> &lt;<span style={{ color: "#60A5FA" }}>RealtimeStream</span> metrics=&#123;data&#125; /&gt;;
          </div>
          <div>{"}"}</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "8px 0" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "8px 10px", borderRadius: 8 }}>
            <div style={{ fontSize: 8.5, color: "#888" }}>EDGE LATENCY</div>
            <div style={{ fontSize: 16, color: "#10B981", fontWeight: 700 }}>12 ms</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "8px 10px", borderRadius: 8 }}>
            <div style={{ fontSize: 8.5, color: "#888" }}>LIGHTHOUSE SCORE</div>
            <div style={{ fontSize: 16, color: "#60A5FA", fontWeight: 700 }}>99 / 100</div>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 9.5,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span style={{ color: "#CBD5E1" }}>Pipeline: Active</span>
        </div>
        <span style={{ color: accent, fontWeight: 700 }}>ZERO DOWNTIME</span>
      </div>
    </div>
  );
}

// 2. Mobile Apps Widget: Interactive Smartphone Mockup
function MobileAppWidget({ accent }: { accent: string }) {
  const [activeScreen, setActiveScreen] = useState<"feed" | "stats">("feed");

  return (
    <div
      style={{
        background: "#0F1117",
        borderRadius: 28,
        padding: "14px 14px 16px",
        border: "3px solid #2D3748",
        boxShadow: "0 20px 45px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 240,
        margin: "0 auto",
        color: "#fff",
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      {/* Top phone notch & status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px", fontSize: 9 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>9:41</span>
        <div style={{ width: 50, height: 12, background: "#1F2937", borderRadius: 100 }} />
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <span>5G</span>
          <span style={{ fontSize: 10 }}>●</span>
        </div>
      </div>

      {/* Screen Content */}
      <div style={{ background: "#1A202C", borderRadius: 18, padding: 12, minHeight: 140 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>Mobile Native UI</div>
          <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 100, background: `${accent}25`, color: accent, fontWeight: 700 }}>
            60 FPS
          </span>
        </div>

        {activeScreen === "feed" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: "7px 8px", borderRadius: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>⚡</span>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 600 }}>Instant Haptics</div>
                <div style={{ fontSize: 8, color: "#A0AEC0" }}>Native Gestures Active</div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: "7px 8px", borderRadius: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 600 }}>Offline Sync</div>
                <div style={{ fontSize: 8, color: "#A0AEC0" }}>Local SQLite Cache</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>0.01s</div>
            <div style={{ fontSize: 9, color: "#CBD5E1" }}>Gesture Response Latency</div>
          </div>
        )}
      </div>

      {/* Screen Toggle Pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        <button
          onClick={() => setActiveScreen("feed")}
          style={{
            background: activeScreen === "feed" ? accent : "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            borderRadius: 100,
            padding: "3px 10px",
            fontSize: 8.5,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          App Feed
        </button>
        <button
          onClick={() => setActiveScreen("stats")}
          style={{
            background: activeScreen === "stats" ? accent : "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            borderRadius: 100,
            padding: "3px 10px",
            fontSize: 8.5,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Speed
        </button>
      </div>
    </div>
  );
}

// 3. AI Products Widget: Interactive AI Agent Simulator
function AIProductWidget({ accent }: { accent: string }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const prompts = [
    { q: "Synthesize client data pipeline", a: "Constructed RAG vector chain with 99.4% precision and real-time streaming." },
    { q: "Automate user support workflows", a: "Autonomous agent deployed with multi-turn memory and instant handoff." },
    { q: "Optimize inference response time", a: "Achieved sub-180ms time-to-first-token using speculative decoding." },
  ];

  const current = prompts[promptIdx];

  return (
    <div
      style={{
        background: "#0B1317",
        borderRadius: 16,
        padding: "16px 18px",
        color: "#FAF9F6",
        border: "1px solid rgba(16,185,129,0.25)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: accent }}>AI AGENT // ACTIVE</span>
        </div>
        <span style={{ fontSize: 9, color: "#888", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>
          GPT-4o &amp; Claude 3.5
        </span>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: "#888", marginBottom: 3 }}>USER PROMPT:</div>
        <div style={{ fontSize: 11, color: "#E2E8F0" }}>&ldquo;{current.q}&rdquo;</div>
      </div>

      <div style={{ background: `${accent}10`, borderRadius: 10, padding: "10px 12px", border: `1px solid ${accent}30` }}>
        <div style={{ fontSize: 9, color: accent, marginBottom: 3, fontWeight: 700 }}>AGENT OUTPUT (STREAMING):</div>
        <div style={{ fontSize: 11, color: "#A7F3D0", lineHeight: 1.45 }}>{current.a}</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        {prompts.map((p, i) => (
          <button
            key={p.q}
            onClick={() => setPromptIdx(i)}
            style={{
              background: i === promptIdx ? accent : "rgba(255,255,255,0.06)",
              color: i === promptIdx ? "#000" : "#94A3B8",
              border: "none",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 8.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Prompt 0{i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// 4. E-Commerce Widget: Interactive Live Commerce Metric Dashboard
function EcomWidget({ accent }: { accent: string }) {
  const [units, setUnits] = useState(1);
  const pricePerUnit = 480;

  return (
    <div
      style={{
        background: "#181410",
        borderRadius: 16,
        padding: "16px 18px",
        color: "#FAF9F6",
        border: "1px solid rgba(249,115,22,0.25)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: "#999", fontFamily: "'JetBrains Mono', monospace" }}>CHECKOUT ORCHESTRATION</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Suntronic Inverter 5kW</div>
        </div>
        <div style={{ background: `${accent}20`, border: `1px solid ${accent}`, color: accent, padding: "2px 8px", borderRadius: 100, fontSize: 9.5, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
          +38% CVR
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, color: "#888" }}>DYNAMIC CART TOTAL</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
            ${(pricePerUnit * units).toLocaleString()} <span style={{ fontSize: 10, color: "#aaa" }}>USD</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setUnits(Math.max(1, units - 1))}
            style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            -
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{units}</span>
          <button
            onClick={() => setUnits(units + 1)}
            style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 9.5, fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", padding: "6px 8px", borderRadius: 6, color: "#10B981" }}>
          ✓ 1-Click Apple Pay
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", padding: "6px 8px", borderRadius: 6, color: "#60A5FA" }}>
          ✓ Sub-second Search
        </div>
      </div>
    </div>
  );
}

// 5. Design Systems Widget: Interactive Tokens Palette
function DesignSystemWidget({ accent }: { accent: string }) {
  const [selectedRadius, setSelectedRadius] = useState<number>(12);
  const [themeColor, setThemeColor] = useState<string>(accent);

  return (
    <div
      style={{
        background: "#141118",
        borderRadius: 16,
        padding: "16px 18px",
        color: "#FAF9F6",
        border: `1px solid ${themeColor}35`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: themeColor }}>DESIGN TOKENS // INTERACTIVE</span>
        <span style={{ fontSize: 8.5, color: "#888" }}>WCAG AA 100%</span>
      </div>

      {/* Dynamic Button Preview */}
      <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px", borderRadius: 12, textAlign: "center", marginBottom: 12 }}>
        <button
          style={{
            background: themeColor,
            color: "#fff",
            border: "none",
            borderRadius: selectedRadius,
            padding: "8px 20px",
            fontSize: 10.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 6px 18px ${themeColor}55`,
            transition: "all 0.25s ease",
          }}
        >
          Dynamic Component Token
        </button>
      </div>

      {/* Token Selectors */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 8.5, color: "#888" }}>COLOR:</span>
          {["#7C3AED", "#2563EB", "#F97316", "#10B981"].map((c) => (
            <button
              key={c}
              onClick={() => setThemeColor(c)}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: c,
                border: themeColor === c ? "2px solid #fff" : "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 8.5, color: "#888" }}>RADIUS:</span>
          {[4, 12, 100].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRadius(r)}
              style={{
                background: selectedRadius === r ? themeColor : "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 8.5,
                cursor: "pointer",
              }}
            >
              {r === 100 ? "pill" : `${r}px`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 6. Interactive 3D Canvas Widget: WebGL Rotating Core
function ThreeDWidget({ accent }: { accent: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 280;
    const height = 150;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Geometry: Octahedron with wireframe
    const geometry = new THREE.IcosahedronGeometry(1.3, 1);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accent),
      wireframe: true,
      emissive: new THREE.Color(accent),
      emissiveIntensity: 0.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Inner glowing sphere
    const innerGeom = new THREE.SphereGeometry(0.75, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    scene.add(innerMesh);

    // Ambient and Point light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(new THREE.Color(accent), 3, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.007;
      mesh.rotation.y += 0.012;
      innerMesh.rotation.x -= 0.005;
      innerMesh.rotation.y -= 0.008;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, [accent]);

  return (
    <div
      style={{
        background: "#081318",
        borderRadius: 16,
        padding: "14px 16px",
        color: "#FAF9F6",
        border: "1px solid rgba(6,182,212,0.3)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: accent, fontWeight: 700 }}>
          WEBGL 3D SHADER ENGINE
        </span>
        <span style={{ fontSize: 9, color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>60 FPS SHADER</span>
      </div>

      <div ref={mountRef} style={{ width: "100%", height: 150, display: "flex", alignItems: "center", justifyContent: "center" }} />

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94A3B8", marginTop: 4 }}>
        Interactive 3D Geometry · Smooth Inertial Motion
      </div>
    </div>
  );
}

// 7. Full-Stack Systems Widget: Microservices Architecture Pipeline
function FullStackWidget({ accent }: { accent: string }) {
  return (
    <div
      style={{
        background: "#0E1524",
        borderRadius: 16,
        padding: "16px 18px",
        color: "#FAF9F6",
        border: "1px solid rgba(59,130,246,0.3)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 9.5, color: accent, fontWeight: 700 }}>ARCHITECTURE // DISTRIBUTED</span>
        <span style={{ fontSize: 8.5, color: "#10B981" }}>● 99.99% HEALTH</span>
      </div>

      {/* Nodes visualizer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px", position: "relative" }}>
        <div style={{ textAlign: "center", zIndex: 2 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
            🌐
          </div>
          <div style={{ fontSize: 8, marginTop: 4, color: "#94A3B8" }}>Edge CDN</div>
        </div>

        <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, ${accent}, #10B981)`, position: "relative", margin: "0 6px" }}>
          <span style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse-dot 1.4s infinite" }} />
        </div>

        <div style={{ textAlign: "center", zIndex: 2 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `${accent}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: `1px solid ${accent}` }}>
            ⚙️
          </div>
          <div style={{ fontSize: 8, marginTop: 4, color: "#94A3B8" }}>API Gateway</div>
        </div>

        <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, #10B981, ${accent})`, position: "relative", margin: "0 6px" }}>
          <span style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse-dot 1.4s infinite" }} />
        </div>

        <div style={{ textAlign: "center", zIndex: 2 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
            🗄️
          </div>
          <div style={{ fontSize: 8, marginTop: 4, color: "#94A3B8" }}>Postgres/Redis</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 8.5, color: "#94A3B8" }}>
        <span>Throughput: 85k req/sec</span>
        <span style={{ color: "#10B981", fontWeight: 700 }}>Auto-healing Active</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT: REDESIGNED ATTRACTIVE SERVICES SHOWCASE
   ───────────────────────────────────────────────────────────── */
export default function Services({ onOpenContact }: ServicesProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"showcase" | "grid">("showcase");
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const active = SERVICE_DETAILS[activeIdx] || SERVICE_DETAILS[0];

  const go = useCallback((dir: 1 | -1) => {
    setActiveIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return SERVICE_DETAILS.length - 1;
      if (next >= SERVICE_DETAILS.length) return 0;
      return next;
    });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 40) {
      go(diffX > 0 ? 1 : -1);
    }
  };

  const renderWidget = (id: number, accent: string) => {
    switch (id) {
      case 0:
        return <WebAppWidget accent={accent} />;
      case 1:
        return <MobileAppWidget accent={accent} />;
      case 2:
        return <AIProductWidget accent={accent} />;
      case 3:
        return <EcomWidget accent={accent} />;
      case 4:
        return <DesignSystemWidget accent={accent} />;
      case 5:
        return <ThreeDWidget accent={accent} />;
      case 6:
        return <FullStackWidget accent={accent} />;
      default:
        return <WebAppWidget accent={accent} />;
    }
  };

  return (
    <section
      id="services"
      style={{
        background: "#FAF9F6",
        padding: "54px 0 68px",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(20,20,20,0.06)",
        borderBottom: "1px solid rgba(20,20,20,0.06)",
      }}
    >
      {/* Editorial ambient light glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${active.accent}12 0%, transparent 65%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          transition: "background 0.5s ease",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5vw", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 22, height: 1.5, background: active.accent }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.22em",
                  color: active.accent,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                08 // SERVICES &amp; CAPABILITIES
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(30px, 4.4vw, 52px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "#141414",
                margin: 0,
              }}
            >
              WHAT I CAN BUILD FOR YOU.
            </h2>
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.8vw, 20px)",
                color: "#666",
                margin: "4px 0 0",
              }}
            >
              Transforming complex engineering challenges into high-converting digital products.
            </p>
          </div>

          {/* Mode Switcher (Showcase vs Grid) */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(20, 20, 20, 0.05)",
              borderRadius: 100,
              padding: 3,
              border: "1px solid rgba(20, 20, 20, 0.08)",
            }}
          >
            <button
              onClick={() => setViewMode("showcase")}
              style={{
                border: "none",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
                background: viewMode === "showcase" ? "#141414" : "transparent",
                color: viewMode === "showcase" ? "#FAF9F6" : "#666",
                transition: "all 0.2s ease",
              }}
            >
              INTERACTIVE SHOWCASE
            </button>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                border: "none",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
                background: viewMode === "grid" ? "#141414" : "transparent",
                color: viewMode === "grid" ? "#FAF9F6" : "#666",
                transition: "all 0.2s ease",
              }}
            >
              ALL SERVICES GRID
            </button>
          </div>
        </div>

        {/* ─── HORIZONTAL CATEGORY SELECTOR STRIP (CLEAN & TOUCH-FRIENDLY) ─── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 12,
            marginBottom: 16,
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {SERVICE_DETAILS.map((s, idx) => {
            const isCurrent = idx === activeIdx;
            return (
              <button
                key={s.number}
                onClick={() => {
                  setActiveIdx(idx);
                  if (viewMode !== "showcase") setViewMode("showcase");
                }}
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 100,
                  background: isCurrent ? s.accent : "#FFFFFF",
                  color: isCurrent ? "#FFFFFF" : "#444444",
                  border: isCurrent ? `1px solid ${s.accent}` : "1px solid rgba(20,20,20,0.08)",
                  boxShadow: isCurrent ? `0 4px 14px ${s.accent}40` : "0 2px 6px rgba(0,0,0,0.02)",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  fontWeight: isCurrent ? 700 : 500,
                  transition: "all 0.25s ease",
                }}
              >
                <span style={{ opacity: isCurrent ? 0.9 : 0.5 }}>{s.number}</span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* ─── VIEW 1: INTERACTIVE SHOWCASE DECK (HERO CARD WITH LIVE WIDGET) ─── */}
        {viewMode === "showcase" ? (
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: "pan-y",
              position: "relative",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 22,
                border: "1px solid rgba(20, 20, 20, 0.08)",
                boxShadow: "0 18px 50px -15px rgba(0,0,0,0.06), 0 4px 16px -2px rgba(0,0,0,0.02)",
                padding: "clamp(18px, 3.2vw, 32px)",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 24,
                alignItems: "center",
                transition: "all 0.35s ease",
              }}
              className="lg:grid-cols-[1.1fr_1fr]"
            >
              {/* Left Column: Editorial Service Narrative */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: active.accent,
                      background: `${active.accent}14`,
                      border: `1px solid ${active.accent}30`,
                      padding: "3px 9px",
                      borderRadius: 100,
                    }}
                  >
                    {active.number} // {active.category}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: "#666",
                      background: "rgba(20,20,20,0.04)",
                      padding: "3px 9px",
                      borderRadius: 100,
                    }}
                  >
                    TIMELINE: {active.timeline}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: "#10B981",
                      background: "rgba(16,185,129,0.1)",
                      padding: "3px 9px",
                      borderRadius: 100,
                      fontWeight: 600,
                    }}
                  >
                    ● PRODUCTION READY
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(22px, 3vw, 34px)",
                    color: "#141414",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    margin: "0 0 8px",
                  }}
                >
                  {active.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "clamp(13px, 1.3vw, 15px)",
                    lineHeight: 1.5,
                    color: "#555",
                    margin: "0 0 16px",
                  }}
                >
                  {active.subtitle}
                </p>

                {/* Key Deliverables Bullet Points */}
                <div style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      color: "#888",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    WHAT YOU GET // DELIVERABLES
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {active.deliverables.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 12,
                          color: "#222",
                          fontFamily: "'Instrument Sans', sans-serif",
                        }}
                      >
                        <span style={{ color: active.accent, fontWeight: 800, fontSize: 13 }}>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Badges */}
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 20 }}>
                  {active.techStack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9.5,
                        padding: "2.5px 8px",
                        borderRadius: 5,
                        background: "#FAF9F6",
                        border: "1px solid rgba(20,20,20,0.08)",
                        color: "#444",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Call to Action Buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={onOpenContact}
                    style={{
                      background: "#141414",
                      color: "#FAF9F6",
                      border: "none",
                      borderRadius: 100,
                      padding: "9px 20px",
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: 10.5,
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 6px 18px rgba(20,20,20,0.12)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = active.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#141414")}
                  >
                    <span>DISCUSS {active.title}</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => go(1)}
                    style={{
                      background: "transparent",
                      color: "#666",
                      border: "1px solid rgba(20,20,20,0.12)",
                      borderRadius: 100,
                      padding: "9px 16px",
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: 10.5,
                      letterSpacing: "0.05em",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#141414";
                      e.currentTarget.style.borderColor = "#141414";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#666";
                      e.currentTarget.style.borderColor = "rgba(20,20,20,0.12)";
                    }}
                  >
                    <span>NEXT</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Bespoke Interactive Micro-Experience */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                {renderWidget(active.id, active.accent)}
              </div>
            </div>

            {/* Bottom Navigation & Indicator Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
                padding: "0 6px",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#888", letterSpacing: "0.15em" }}>
                0{activeIdx + 1} / 0{SERVICE_DETAILS.length} · {active.category}
              </div>

              {/* Dots Progress */}
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {SERVICE_DETAILS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Jump to service 0${i + 1}`}
                    style={{
                      width: i === activeIdx ? 22 : 6,
                      height: 5,
                      borderRadius: 100,
                      background: i === activeIdx ? active.accent : "rgba(20,20,20,0.15)",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                ))}
              </div>

              {/* Arrow Steppers */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous capability"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    border: "1px solid rgba(20, 20, 20, 0.1)",
                    color: "#141414",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    fontSize: 12,
                    transition: "all 0.2s ease",
                  }}
                >
                  ←
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next capability"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    border: "1px solid rgba(20, 20, 20, 0.1)",
                    color: "#141414",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    fontSize: 12,
                    transition: "all 0.2s ease",
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ─── VIEW 2: ALL CAPABILITIES BENTO GRID ─── */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: 16,
            }}
          >
            {SERVICE_DETAILS.map((s, idx) => (
              <div
                key={s.number}
                onClick={() => {
                  setActiveIdx(idx);
                  setViewMode("showcase");
                }}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  border: "1px solid rgba(20, 20, 20, 0.08)",
                  padding: "20px 20px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                className="hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, color: s.accent, background: `${s.accent}14`, padding: "2px 8px", borderRadius: 100 }}>
                      {s.number} // {s.category}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "#888" }}>
                      {s.timeline}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "#141414", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12.5, color: "#666", lineHeight: 1.45, margin: "0 0 14px" }}>
                    {s.subtitle}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                    {s.techStack.slice(0, 3).map((t) => (
                      <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, padding: "2px 6px", borderRadius: 4, background: "#FAF9F6", border: "1px solid rgba(20,20,20,0.06)", color: "#555" }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid rgba(20,20,20,0.06)" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: s.accent, fontWeight: 700 }}>
                      {s.metrics.label}: {s.metrics.value}
                    </span>
                    <span style={{ fontSize: 11, color: "#141414", fontWeight: 700 }}>
                      EXPLORE →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
