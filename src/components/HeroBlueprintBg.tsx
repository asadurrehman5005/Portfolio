import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroBlueprintBg() {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── 3D Geometric "AR" Wireframe Blueprint Group ──
    const heroBlueprintGroup = new THREE.Group();
    scene.add(heroBlueprintGroup);

    // Responsive position: slightly to the left behind typography on desktop
    const updatePosition = (w: number) => {
      if (w >= 1024) {
        heroBlueprintGroup.position.set(-1.45, 0.1, 0);
        heroBlueprintGroup.scale.setScalar(0.95);
      } else {
        heroBlueprintGroup.position.set(0, 0.15, 0);
        heroBlueprintGroup.scale.setScalar(0.78);
      }
    };
    updatePosition(width);

    // Outer concentric architectural drafting circles
    const makeRing = (radius: number, color: string, opacity: number, segments = 64) => {
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

    heroBlueprintGroup.add(makeRing(3.2, "#2563EB", 0.16));
    heroBlueprintGroup.add(makeRing(2.6, "#7C3AED", 0.14));
    heroBlueprintGroup.add(makeRing(1.8, "#F97316", 0.18));
    heroBlueprintGroup.add(makeRing(1.1, "#2563EB", 0.24));

    // Crosshairs & diagonal drafting lines
    const lineMat = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.14,
    });
    const makeLine = (p1: [number, number, number], p2: [number, number, number]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...p1),
        new THREE.Vector3(...p2),
      ]);
      return new THREE.Line(geo, lineMat);
    };

    heroBlueprintGroup.add(makeLine([-4, 0, 0], [4, 0, 0]));
    heroBlueprintGroup.add(makeLine([0, -4, 0], [0, 4, 0]));
    heroBlueprintGroup.add(makeLine([-3, -3, 0], [3, 3, 0]));
    heroBlueprintGroup.add(makeLine([-3, 3, 0], [3, -3, 0]));

    // The Geometric "AR" Monogram Wireframe
    const arGlyphGroup = new THREE.Group();
    heroBlueprintGroup.add(arGlyphGroup);

    // Site palette line materials
    const glyphMatDark = new THREE.LineBasicMaterial({
      color: "#141414",
      transparent: true,
      opacity: 0.38,
    });
    const glyphMatBlue = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.65,
    });
    const glyphMatOrange = new THREE.LineBasicMaterial({
      color: "#F97316",
      transparent: true,
      opacity: 0.65,
    });
    const glyphMatPurple = new THREE.LineBasicMaterial({
      color: "#7C3AED",
      transparent: true,
      opacity: 0.55,
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

    // Dark core glyph
    arGlyphGroup.add(addWireframe(aOutline, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(aCrossbar, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(rStem, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatDark, 0));
    arGlyphGroup.add(addWireframe(rLeg, glyphMatDark, 0));

    // Chromatic dispersion offset layers (Blue & Orange)
    arGlyphGroup.add(addWireframe(aOutline, glyphMatBlue, 0.035));
    arGlyphGroup.add(addWireframe(aCrossbar, glyphMatBlue, 0.035));
    arGlyphGroup.add(addWireframe(rStem, glyphMatBlue, 0.035));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatBlue, 0.035));
    arGlyphGroup.add(addWireframe(rLeg, glyphMatBlue, 0.035));

    arGlyphGroup.add(addWireframe(aOutline, glyphMatOrange, -0.035));
    arGlyphGroup.add(addWireframe(aCrossbar, glyphMatOrange, -0.035));
    arGlyphGroup.add(addWireframe(rStem, glyphMatOrange, -0.035));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatOrange, -0.035));
    arGlyphGroup.add(addWireframe(rLeg, glyphMatOrange, -0.035));

    // Outer Purple Layer
    arGlyphGroup.add(addWireframe(aOutline, glyphMatPurple, 0.06));
    arGlyphGroup.add(addWireframe(rLoop, glyphMatPurple, 0.06));

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseX = normX;
      targetMouseY = normY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      heroBlueprintGroup.rotation.z = t * 0.08;
      heroBlueprintGroup.rotation.x = mouseY * 0.16;
      heroBlueprintGroup.rotation.y = mouseX * 0.16;

      camera.position.x = mouseX * 0.25;
      camera.position.y = mouseY * 0.18;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
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
          updatePosition(width);
        }
      }
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity: 0.85,
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
    </div>
  );
}
