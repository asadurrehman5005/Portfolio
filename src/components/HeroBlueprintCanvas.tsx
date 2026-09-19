import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroBlueprintCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const baseCameraZ = 7.8;
    camera.position.set(0, 0, baseCameraZ);

    // ─── WebGL Renderer ───
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // ─── 3D Floor Perspective Blueprint Grid ───
    const gridHelper = new THREE.GridHelper(60, 40, "#2563EB", "#D0D7E2");
    gridHelper.position.y = -3.8;
    // Set subtle opacity on grid
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.18;
      });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.18;
    }
    scene.add(gridHelper);

    // ─── 3D Hero Blueprint Group ───
    const heroBlueprintGroup = new THREE.Group();
    scene.add(heroBlueprintGroup);

    // Responsive position and base scale
    let baseScale = 1.0;
    const updateLayout = (w: number, h: number) => {
      const isDesktop = w >= 1024;
      const isTablet = w >= 640 && w < 1024;

      if (isDesktop) {
        heroBlueprintGroup.position.set(1.45, 0.05, 0);
        baseScale = 1.05;
      } else if (isTablet) {
        heroBlueprintGroup.position.set(0.6, 0.1, 0);
        baseScale = 0.9;
      } else {
        heroBlueprintGroup.position.set(0, 0.15, 0);
        baseScale = 0.76;
      }
      heroBlueprintGroup.scale.setScalar(baseScale);
    };
    updateLayout(width, height);

    // ─── Concentric Architectural Drafting Circles ───
    const makeRing = (radius: number, color: string, opacity: number, segments = 90) => {
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

    heroBlueprintGroup.add(makeRing(4.5, "#2563EB", 0.12));
    heroBlueprintGroup.add(makeRing(3.2, "#2563EB", 0.28));
    heroBlueprintGroup.add(makeRing(2.6, "#7C3AED", 0.22));
    heroBlueprintGroup.add(makeRing(1.8, "#F97316", 0.3));
    heroBlueprintGroup.add(makeRing(1.1, "#2563EB", 0.42));

    // ─── Crosshairs & Diagonal Drafting Axes ───
    const axisMat = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.16,
    });
    const makeLine = (p1: [number, number, number], p2: [number, number, number]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...p1),
        new THREE.Vector3(...p2),
      ]);
      return new THREE.Line(geo, axisMat);
    };

    heroBlueprintGroup.add(makeLine([-6, 0, 0], [6, 0, 0]));
    heroBlueprintGroup.add(makeLine([0, -6, 0], [0, 6, 0]));
    heroBlueprintGroup.add(makeLine([-4, -4, 0], [4, 4, 0]));
    heroBlueprintGroup.add(makeLine([-4, 4, 0], [4, -4, 0]));

    // Perimeter tick markers
    const tickMat = new THREE.LineBasicMaterial({ color: "#2563EB", transparent: true, opacity: 0.4 });
    const tickLen = 0.25;
    const ticks = [
      makeLine([3.2 - tickLen, 0, 0], [3.2 + tickLen, 0, 0]),
      makeLine([-3.2 - tickLen, 0, 0], [-3.2 + tickLen, 0, 0]),
      makeLine([0, 3.2 - tickLen, 0], [0, 3.2 + tickLen, 0]),
      makeLine([0, -3.2 - tickLen, 0], [0, -3.2 + tickLen, 0]),
    ];
    ticks.forEach((t) => heroBlueprintGroup.add(t));

    // ─── Geometric "AR" Monogram Wireframe ───
    const arGlyphGroup = new THREE.Group();
    heroBlueprintGroup.add(arGlyphGroup);

    const glyphMatDark = new THREE.LineBasicMaterial({
      color: "#141414",
      transparent: true,
      opacity: 0.7,
    });
    const glyphMatBlue = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.8,
    });
    const glyphMatOrange = new THREE.LineBasicMaterial({
      color: "#F97316",
      transparent: true,
      opacity: 0.8,
    });
    const glyphMatPurple = new THREE.LineBasicMaterial({
      color: "#7C3AED",
      transparent: true,
      opacity: 0.65,
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

    // Glowing Vertex Joint Nodes
    const nodeDotGeo = new THREE.SphereGeometry(0.045, 10, 10);
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
      heroBlueprintGroup.add(dot);
    });

    // ─── Ambient Spatial Dust Particles ───
    const particleCount = 70;
    const pPos = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const palette = [new THREE.Color("#2563EB"), new THREE.Color("#7C3AED"), new THREE.Color("#F97316")];

    for (let i = 0; i < particleCount; i++) {
      const r = 1.0 + Math.random() * 4.2;
      const th = Math.random() * Math.PI * 2;
      pPos[i * 3] = Math.cos(th) * r;
      pPos[i * 3 + 1] = Math.sin(th) * r;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;

      const col = palette[Math.floor(Math.random() * palette.length)];
      pColors[i * 3] = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.048,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    heroBlueprintGroup.add(dustPoints);

    // ─── Scroll Kinematics & Mouse Tracking with IntersectionObserver ───
    let isVisible = true;
    let scrollProgress = 0;
    let smoothScroll = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let ticking = false;

    const onScroll = () => {
      if (!isVisible) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          const heroEl = mount.parentElement;
          const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
          const sY = window.scrollY;
          // Normalizes scroll progress from 0 to 1 over the hero section
          scrollProgress = Math.max(0, Math.min(1.2, sY / (heroHeight * 0.85)));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ─── Animation Loop with Zoom Kinematics ───
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Inertial scroll lerp
      smoothScroll += (scrollProgress - smoothScroll) * 0.08;
      const sp = smoothScroll;

      // Mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // ─── ZOOM ON SCROLL KINEMATICS (matching Cinematic 3D Projects Section) ───
      // Scale expands as you scroll
      const currentScale = baseScale * (1 + sp * 2.4);
      heroBlueprintGroup.scale.set(currentScale, currentScale, currentScale);

      // Smoothly drift towards center as it zooms forward
      const targetPosX = (width >= 1024 ? 1.4 : width >= 640 ? 0.5 : 0) * Math.max(0, 1 - sp * 0.4);
      heroBlueprintGroup.position.x = targetPosX;

      // Camera flies forward into the 3D model
      const camZ = baseCameraZ - sp * 4.8;
      camera.position.set(mouseX * 0.35, mouseY * 0.25, camZ);
      camera.lookAt(targetPosX * 0.2, 0, 0);

      // Rotation accelerates subtly with scroll
      heroBlueprintGroup.rotation.z = t * 0.09 + sp * 0.95;
      heroBlueprintGroup.rotation.x = mouseY * 0.22;
      heroBlueprintGroup.rotation.y = mouseX * 0.22;

      // Subtle dust drift
      dustPoints.rotation.z = -t * 0.03;

      // Graceful fade as user scrolls out of Hero into Section 2
      if (mount) {
        const exitFade = sp > 0.8 ? Math.max(0, 1 - (sp - 0.8) * 3.3) : 1;
        mount.style.opacity = String(exitFade);
      }

      renderer.render(scene, camera);
    };
    animate();

    // ─── Visibility Observer (Pauses 3D rendering when scrolled out of view) ───
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          clock.start();
          animate();
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      },
      { threshold: 0.02 }
    );
    io.observe(mount);

    // ─── Resize Observer ───
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
          updateLayout(width, height);
        }
      }
    });
    ro.observe(mount);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
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
