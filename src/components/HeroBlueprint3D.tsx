import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface HeroBlueprint3DProps {
  className?: string;
}

export default function HeroBlueprint3D({ className }: HeroBlueprint3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    let width = mount.clientWidth || 500;
    let height = mount.clientHeight || 460;

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // ─── WebGL Renderer ───
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ─── Main Blueprint 3D Group ───
    const blueprintGroup = new THREE.Group();
    scene.add(blueprintGroup);

    // Dynamic responsive scale based on container width and aspect ratio
    const updateScale = (w: number, h: number) => {
      const aspect = w / Math.max(h, 1);
      if (aspect < 0.85 || w < 420) {
        blueprintGroup.scale.setScalar(0.70);
        camera.position.z = 9.2;
      } else if (w < 640) {
        blueprintGroup.scale.setScalar(0.80);
        camera.position.z = 8.5;
      } else if (w < 1024) {
        blueprintGroup.scale.setScalar(0.90);
        camera.position.z = 8.2;
      } else {
        blueprintGroup.scale.setScalar(1.02);
        camera.position.z = 7.9;
      }
    };
    updateScale(width, height);

    // ─── 1. Concentric Drafting Circles ───
    const makeRing = (radius: number, color: string, opacity: number, segments = 80) => {
      const ringGeo = new THREE.BufferGeometry();
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      ringGeo.setFromPoints(pts);
      return new THREE.LineLoop(
        ringGeo,
        new THREE.LineBasicMaterial({ color, transparent: true, opacity })
      );
    };

    blueprintGroup.add(makeRing(3.2, "#2563EB", 0.35));
    blueprintGroup.add(makeRing(2.6, "#7C3AED", 0.28));
    blueprintGroup.add(makeRing(1.8, "#F97316", 0.35));
    blueprintGroup.add(makeRing(1.1, "#2563EB", 0.45));

    // ─── 2. Crosshairs & Drafting Axes ───
    const axisMat = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.22,
    });
    const makeLine = (p1: [number, number, number], p2: [number, number, number]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...p1),
        new THREE.Vector3(...p2),
      ]);
      return new THREE.Line(geo, axisMat);
    };

    blueprintGroup.add(makeLine([-3.8, 0, 0], [3.8, 0, 0]));
    blueprintGroup.add(makeLine([0, -3.8, 0], [0, 3.8, 0]));
    blueprintGroup.add(makeLine([-2.7, -2.7, 0], [2.7, 2.7, 0]));
    blueprintGroup.add(makeLine([-2.7, 2.7, 0], [2.7, -2.7, 0]));

    // Perimeter tick markers at 0, 90, 180, 270 degrees
    const tickLen = 0.18;
    const ticks = [
      makeLine([3.2 - tickLen, 0, 0], [3.2 + tickLen, 0, 0]),
      makeLine([-3.2 - tickLen, 0, 0], [-3.2 + tickLen, 0, 0]),
      makeLine([0, 3.2 - tickLen, 0], [0, 3.2 + tickLen, 0]),
      makeLine([0, -3.2 - tickLen, 0], [0, -3.2 + tickLen, 0]),
    ];
    ticks.forEach((t) => blueprintGroup.add(t));

    // ─── 3. Geometric "AR" Monogram Wireframe ───
    const arGlyphGroup = new THREE.Group();
    blueprintGroup.add(arGlyphGroup);

    const glyphMatDark = new THREE.LineBasicMaterial({
      color: "#141414",
      transparent: true,
      opacity: 0.75,
    });
    const glyphMatBlue = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.85,
    });
    const glyphMatOrange = new THREE.LineBasicMaterial({
      color: "#F97316",
      transparent: true,
      opacity: 0.85,
    });
    const glyphMatPurple = new THREE.LineBasicMaterial({
      color: "#7C3AED",
      transparent: true,
      opacity: 0.7,
    });

    // Letter 'A' wireframe geometry
    const aOutline = [
      new THREE.Vector3(-1.4, -1.3, 0),
      new THREE.Vector3(-0.6, 1.3, 0),
      new THREE.Vector3(0.2, -1.3, 0),
      new THREE.Vector3(-0.15, -1.3, 0),
      new THREE.Vector3(-0.6, -0.3, 0),
      new THREE.Vector3(-1.05, -1.3, 0),
      new THREE.Vector3(-1.4, -1.3, 0),
    ];
    const aCrossbar = [
      new THREE.Vector3(-0.95, -0.4, 0),
      new THREE.Vector3(-0.25, -0.4, 0),
    ];

    // Letter 'R' wireframe geometry
    const rStem = [new THREE.Vector3(0.1, -1.3, 0), new THREE.Vector3(0.1, 1.3, 0)];
    const rLoop = [
      new THREE.Vector3(0.1, 1.3, 0),
      new THREE.Vector3(0.9, 1.3, 0),
      new THREE.Vector3(1.3, 0.9, 0),
      new THREE.Vector3(1.3, 0.4, 0),
      new THREE.Vector3(0.9, 0.0, 0),
      new THREE.Vector3(0.1, 0.0, 0),
    ];
    const rLeg = [new THREE.Vector3(0.8, 0.1, 0), new THREE.Vector3(1.4, -1.3, 0)];

    const addWireframe = (pts: THREE.Vector3[], mat: THREE.LineBasicMaterial, offsetZ = 0) => {
      const geo = new THREE.BufferGeometry().setFromPoints(
        pts.map((p) => new THREE.Vector3(p.x, p.y, p.z + offsetZ))
      );
      return new THREE.Line(geo, mat);
    };

    // Dark core wireframe
    arGlyphGroup.add(addWireframe(aOutline, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(aCrossbar, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(rStem, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(rLeg, glyphMatDark, 0));

    // Chromatic dispersion offset layers (Blue & Orange & Purple)
    arGlyphGroup.add(addWireframe(aOutline, glyphMatBlue, 0.04));
    arGlyphGroup.add(addWireframe(aCrossbar, glyphMatBlue, 0.04));
    arGlyphGroup.add(addWireframe(rStem, glyphMatBlue, 0.04));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatBlue, 0.04));
    arGlyphGroup.add(addWireframe(rLeg, glyphMatBlue, 0.04));

    arGlyphGroup.add(addWireframe(aOutline, glyphMatOrange, -0.04));
    arGlyphGroup.add(addWireframe(aCrossbar, glyphMatOrange, -0.04));
    arGlyphGroup.add(addWireframe(rStem, glyphMatOrange, -0.04));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatOrange, -0.04));
    arGlyphGroup.add(addWireframe(rLeg, glyphMatOrange, -0.04));

    arGlyphGroup.add(addWireframe(aOutline, glyphMatPurple, 0.08));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatPurple, 0.08));

    // ─── 4. Vertex Joint Nodes (Glowing Architectural Points) ───
    const nodeDotGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeDotMatBlue = new THREE.MeshBasicMaterial({ color: "#2563EB" });
    const nodeDotMatOrange = new THREE.MeshBasicMaterial({ color: "#F97316" });

    const keyNodes = [
      [-1.4, -1.3, 0],
      [-0.6, 1.3, 0],
      [0.2, -1.3, 0],
      [-0.6, -0.3, 0],
      [0.1, -1.3, 0],
      [0.1, 1.3, 0],
      [1.3, 0.9, 0],
      [1.3, 0.4, 0],
      [1.4, -1.3, 0],
    ];

    keyNodes.forEach((pos, idx) => {
      const dot = new THREE.Mesh(nodeDotGeo, idx % 2 === 0 ? nodeDotMatBlue : nodeDotMatOrange);
      dot.position.set(pos[0], pos[1], pos[2]);
      blueprintGroup.add(dot);
    });

    // ─── 5. Ambient Spatial Particles ───
    const particleCount = 50;
    const pPos = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const palette = [new THREE.Color("#2563EB"), new THREE.Color("#7C3AED"), new THREE.Color("#F97316")];

    for (let i = 0; i < particleCount; i++) {
      const r = 1.0 + Math.random() * 2.8;
      const th = Math.random() * Math.PI * 2;
      pPos[i * 3] = Math.cos(th) * r;
      pPos[i * 3 + 1] = Math.sin(th) * r;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      const col = palette[Math.floor(Math.random() * palette.length)];
      pColors[i * 3] = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    blueprintGroup.add(dustPoints);

    // ─── Interactive Drag & Touch Rotation ───
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevPointerX = clientX;
        prevPointerY = clientY;
      } else {
        // Gentle mouse parallax when not dragging
        const rect = mount.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = normX * 0.35;
        targetRotX = -normY * 0.35;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const mountEl = mount;
    mountEl.addEventListener("mousedown", onPointerDown);
    mountEl.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    mountEl.addEventListener("touchstart", onPointerDown, { passive: true });
    mountEl.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // ─── Animation Loop ───
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth lerp rotation
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;

      // Continuous slow architectural rotation on Z
      blueprintGroup.rotation.z = t * 0.09;
      blueprintGroup.rotation.y = rotY;
      blueprintGroup.rotation.x = rotX;

      // Gentle floating dust
      dustPoints.rotation.z = -t * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Responsive Resize Observer ───
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rw = entry.contentRect.width;
        const rh = entry.contentRect.height;
        if (rw > 0 && rh > 0) {
          width = rw;
          height = rh;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, true);
          updateScale(width, height);
        }
      }
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      mountEl.removeEventListener("mousedown", onPointerDown);
      mountEl.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      mountEl.removeEventListener("touchstart", onPointerDown);
      mountEl.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 340,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isInteracting ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Top HUD Tag */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 6,
          border: "1px solid rgba(20, 20, 20, 0.08)",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#2563EB",
            boxShadow: "0 0 6px #2563EB",
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "#141414",
            fontWeight: 700,
          }}
        >
          AR // 3D BLUEPRINT
        </span>
      </div>

      {/* Bottom Drag Hint */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 12px",
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(8px)",
          borderRadius: 999,
          border: "1px solid rgba(20, 20, 20, 0.06)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 8.5,
            letterSpacing: "0.12em",
            color: "#666",
            fontWeight: 600,
          }}
        >
          INTERACTIVE 3D WIREFRAME · DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
}
