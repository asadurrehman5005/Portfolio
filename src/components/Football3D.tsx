import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FOOTBALL_CARDS, type FootballCard } from "../data/footballCards";

export interface Football3DProps {
  activeCardId: number;
  onSelectCard: (id: number) => void;
  className?: string;
}

// Helper to render high-res leather panel card texture
function createHexagonCardCanvas(card: FootballCard): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Leather white gradient background
  const bgGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  bgGrad.addColorStop(0, "#FFFFFF");
  bgGrad.addColorStop(0.75, "#F8FAFC");
  bgGrad.addColorStop(1, "#E2E8F0");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Outer Hexagonal colored accent border
  ctx.save();
  ctx.translate(256, 256);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = Math.cos(angle) * 238;
    const y = Math.sin(angle) * 238;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = card.accent;
  ctx.lineWidth = 14;
  ctx.stroke();

  // Inner dashed seam stitching
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = Math.cos(angle) * 220;
    const y = Math.sin(angle) * 220;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Number Badge Pill at top
  ctx.fillStyle = card.accent;
  ctx.beginPath();
  ctx.roundRect(196, 68, 120, 44, 22);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 24px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(card.num, 256, 90);

  // Category in small caps
  ctx.fillStyle = card.accent;
  ctx.font = "bold 19px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(card.category.toUpperCase(), 256, 155);

  // Main Card Title
  ctx.fillStyle = "#0F172A";
  ctx.font = "900 36px 'Instrument Sans', sans-serif";
  const words = card.title.split(" ");
  if (words.length > 1) {
    ctx.fillText(words.slice(0, Math.ceil(words.length / 2)).join(" "), 256, 220);
    ctx.fillText(words.slice(Math.ceil(words.length / 2)).join(" "), 256, 268);
  } else {
    ctx.fillText(card.title, 256, 245);
  }

  // Key Subtitle / Technology
  ctx.fillStyle = "#475569";
  ctx.font = "700 21px 'JetBrains Mono', monospace";
  ctx.fillText(card.subtitle, 256, 335);

  // Bottom Status Dot + Tag
  ctx.fillStyle = card.accent;
  ctx.beginPath();
  ctx.arc(205, 395, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 17px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("READY TO BUILD", 222, 396);

  return canvas;
}

export default function Football3D({
  activeCardId,
  onSelectCard,
}: Football3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [frontCardProjected, setFrontCardProjected] = useState<{
    card: FootballCard;
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  const hexCentersRef = useRef<THREE.Vector3[]>([]);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isInteractingRef = useRef(false);

  // Rotate ball to face active card when changed externally
  useEffect(() => {
    if (isInteractingRef.current) return;
    const center = hexCentersRef.current[activeCardId];
    if (!center) return;

    // Calculate rotation to make this panel center point towards camera (0, 0, 1)
    const norm = center.clone().normalize();
    const yaw = Math.atan2(norm.x, norm.z);
    const pitch = -Math.asin(norm.y);
    targetRotationRef.current = { x: pitch, y: -yaw };
  }, [activeCardId]);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    let width = mount.clientWidth || 550;
    let height = mount.clientHeight || 550;

    // ─── Three.js Scene, Camera, Renderer ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ─── Lighting ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa0b0ff, 1.1);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    rimLight.position.set(0, -6, -5);
    scene.add(rimLight);

    // ─── Football Root Group ───
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // ─── Inner Seam Sphere (Charcoal groove lines) ───
    const seamRadius = 2.37;
    const seamSphere = new THREE.Mesh(
      new THREE.SphereGeometry(seamRadius, 36, 36),
      new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.9,
        metalness: 0.1,
      })
    );
    ballGroup.add(seamSphere);

    // ─── Truncated Icosahedron Geometry ───
    const phi = (1 + Math.sqrt(5)) / 2;
    const icoVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map((v) => {
      const len = Math.hypot(...v);
      return new THREE.Vector3(v[0] / len, v[1] / len, v[2] / len);
    });

    const neighbors: number[][] = Array.from({ length: 12 }, () => []);
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const dist = icoVerts[i].distanceTo(icoVerts[j]);
        if (Math.abs(dist - 1.05146) < 0.12) {
          neighbors[i].push(j);
          neighbors[j].push(i);
        }
      }
    }

    const ballRadius = 2.44;

    // Black Pentagon Material (Authentic leather)
    const blackPanelMat = new THREE.MeshStandardMaterial({
      color: 0x18181e,
      roughness: 0.35,
      metalness: 0.25,
    });

    // Helper: Build spherical polygon mesh with planar UVs
    function createSphericalPolygon(
      polygonVerts: THREE.Vector3[],
      material: THREE.Material,
      withUVs = false
    ): { mesh: THREE.Mesh; center: THREE.Vector3 } {
      const center = new THREE.Vector3();
      polygonVerts.forEach((pv) => center.add(pv));
      center.divideScalar(polygonVerts.length).normalize().multiplyScalar(ballRadius * 1.018);

      const positions: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];

      const normal = center.clone().normalize();
      const arbitraryUp = Math.abs(normal.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const tangentU = new THREE.Vector3().crossVectors(arbitraryUp, normal).normalize();
      const tangentV = new THREE.Vector3().crossVectors(normal, tangentU).normalize();
      const radiusScale = 1.15;

      for (let i = 0; i < polygonVerts.length; i++) {
        const next = (i + 1) % polygonVerts.length;
        const v1 = polygonVerts[i].clone().multiplyScalar(ballRadius);
        const v2 = polygonVerts[next].clone().multiplyScalar(ballRadius);

        positions.push(center.x, center.y, center.z);
        positions.push(v1.x, v1.y, v1.z);
        positions.push(v2.x, v2.y, v2.z);

        const n1 = center.clone().normalize();
        const n2 = v1.clone().normalize();
        const n3 = v2.clone().normalize();

        normals.push(n1.x, n1.y, n1.z);
        normals.push(n2.x, n2.y, n2.z);
        normals.push(n3.x, n3.y, n3.z);

        if (withUVs) {
          uvs.push(0.5, 0.5);

          const d1 = new THREE.Vector3().subVectors(v1, center);
          const u1 = 0.5 + d1.dot(tangentU) / radiusScale;
          const v1_coord = 0.5 + d1.dot(tangentV) / radiusScale;
          uvs.push(u1, v1_coord);

          const d2 = new THREE.Vector3().subVectors(v2, center);
          const u2 = 0.5 + d2.dot(tangentU) / radiusScale;
          const v2_coord = 0.5 + d2.dot(tangentV) / radiusScale;
          uvs.push(u2, v2_coord);
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      if (withUVs) {
        geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      }

      const mesh = new THREE.Mesh(geom, material);
      return { mesh, center };
    }

    // ─── Build 12 Pentagons (Black leather patches) ───
    for (let i = 0; i < 12; i++) {
      const v = icoVerts[i];
      const nbrs = neighbors[i];
      const u = new THREE.Vector3().subVectors(icoVerts[nbrs[0]], v).normalize();
      const w = new THREE.Vector3().crossVectors(v, u).normalize();

      const sorted = [...nbrs].sort((a, b) => {
        const da = new THREE.Vector3().subVectors(icoVerts[a], v);
        const db = new THREE.Vector3().subVectors(icoVerts[b], v);
        return Math.atan2(da.dot(w), da.dot(u)) - Math.atan2(db.dot(w), db.dot(u));
      });

      const polyPoints = sorted.map((nbrIdx) => {
        return new THREE.Vector3()
          .addScaledVector(v, 2 / 3)
          .addScaledVector(icoVerts[nbrIdx], 1 / 3)
          .normalize();
      });

      const { mesh } = createSphericalPolygon(polyPoints, blackPanelMat, false);
      ballGroup.add(mesh);
    }

    // ─── Build 20 Hexagons (White blocks WITH CARD DATA PRINTED ON THEM!) ───
    const triangles: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      for (const j of neighbors[i]) {
        if (j > i) {
          for (const k of neighbors[j]) {
            if (k > j && neighbors[i].includes(k)) {
              triangles.push([i, j, k]);
            }
          }
        }
      }
    }

    const whiteMeshes: THREE.Mesh[] = [];
    const hexCenters: THREE.Vector3[] = [];

    triangles.forEach(([a, b, c], hexIdx) => {
      const va = icoVerts[a];
      const vb = icoVerts[b];
      const vc = icoVerts[c];

      const p1 = new THREE.Vector3().addScaledVector(va, 2 / 3).addScaledVector(vb, 1 / 3).normalize();
      const p2 = new THREE.Vector3().addScaledVector(vb, 2 / 3).addScaledVector(va, 1 / 3).normalize();
      const p3 = new THREE.Vector3().addScaledVector(vb, 2 / 3).addScaledVector(vc, 1 / 3).normalize();
      const p4 = new THREE.Vector3().addScaledVector(vc, 2 / 3).addScaledVector(vb, 1 / 3).normalize();
      const p5 = new THREE.Vector3().addScaledVector(vc, 2 / 3).addScaledVector(va, 1 / 3).normalize();
      const p6 = new THREE.Vector3().addScaledVector(va, 2 / 3).addScaledVector(vc, 1 / 3).normalize();

      const card = FOOTBALL_CARDS[hexIdx % FOOTBALL_CARDS.length];

      // Generate the custom canvas with the card data written on this white panel!
      const canvasTex = createHexagonCardCanvas(card);
      const texture = new THREE.CanvasTexture(canvasTex);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const hexMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.35,
        metalness: 0.1,
      });

      const { mesh, center } = createSphericalPolygon([p1, p2, p3, p4, p5, p6], hexMaterial, true);
      mesh.userData = { cardId: card.id, hexIndex: hexIdx };
      ballGroup.add(mesh);
      whiteMeshes.push(mesh);
      hexCenters.push(center);
    });

    hexCentersRef.current = hexCenters;

    // Initial alignment to active card
    const initialCenter = hexCenters[activeCardId];
    if (initialCenter) {
      const norm = initialCenter.clone().normalize();
      const yaw = Math.atan2(norm.x, norm.z);
      const pitch = -Math.asin(norm.y);
      targetRotationRef.current = { x: pitch, y: -yaw };
    }

    // Outer faint orbit ring
    const orbitRing = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 2.83, 96),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
    );
    orbitRing.rotation.x = Math.PI / 2.6;
    scene.add(orbitRing);

    // ─── Raycasting for Clicking White Blocks on the Football ───
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    // ─── Drag / Spin Physics ───
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velX = 0;
    let velY = 0;
    let currentRotationX = targetRotationRef.current.x;
    let currentRotationY = targetRotationRef.current.y;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      isInteractingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      velX = 0;
      velY = 0;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        velX = deltaX * 0.007;
        velY = deltaY * 0.007;
        targetRotationRef.current.y += velX;
        targetRotationRef.current.x += velY;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;

      // Check if this was a click/tap (barely moved)
      const dist = Math.hypot(clientX - startX, clientY - startY);
      if (dist < 8) {
        const rect = canvas.getBoundingClientRect();
        mouseCoord.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoord.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseCoord, camera);
        const intersects = raycaster.intersectObjects(whiteMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const hitCardId = hit.userData.cardId;
          if (hitCardId !== undefined) {
            onSelectCard(hitCardId);
            isInteractingRef.current = false;
          }
        }
      }

      setTimeout(() => {
        isInteractingRef.current = false;
      }, 800);
    };

    canvas.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // ─── Animation Loop ───
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) * 0.001, 0.1);
      lastTime = currentTime;
      frameCount++;

      // Gentle auto-rotation when user is idle
      if (!isDragging && !isInteractingRef.current) {
        targetRotationRef.current.y += delta * 0.06;
      }

      currentRotationX += (targetRotationRef.current.x - currentRotationX) * 0.08;
      currentRotationY += (targetRotationRef.current.y - currentRotationY) * 0.08;

      ballGroup.rotation.x = currentRotationX;
      ballGroup.rotation.y = currentRotationY;

      orbitRing.rotation.z += delta * 0.15;

      // Project the front-most white card to show a floating sharp badge
      if (frameCount % 2 === 0) {
        let bestDot = -1;
        let bestIdx = 0;
        const worldCenter = new THREE.Vector3();

        hexCenters.forEach((c, idx) => {
          worldCenter.copy(c).applyMatrix4(ballGroup.matrixWorld);
          const dot = worldCenter.clone().normalize().dot(new THREE.Vector3(0, 0, 1));
          if (dot > bestDot) {
            bestDot = dot;
            bestIdx = idx;
          }
        });

        if (bestDot > 0.8) {
          const frontCard = FOOTBALL_CARDS[bestIdx % FOOTBALL_CARDS.length];
          worldCenter.copy(hexCenters[bestIdx]).applyMatrix4(ballGroup.matrixWorld);
          worldCenter.project(camera);

          const screenX = (worldCenter.x * 0.5 + 0.5) * width;
          const screenY = (-(worldCenter.y * 0.5) + 0.5) * height;

          setFrontCardProjected({
            card: frontCard,
            x: screenX,
            y: screenY,
            visible: true,
          });
        } else {
          setFrontCardProjected(null);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || 550;
      height = mount.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 480,
        overflow: "hidden",
        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "grab",
        }}
      />

      {/* Floating 3D Badge on the front-facing white block */}
      {frontCardProjected && frontCardProjected.visible && (
        <div
          onClick={() => onSelectCard(frontCardProjected.card.id)}
          style={{
            position: "absolute",
            left: `${frontCardProjected.x}px`,
            top: `${frontCardProjected.y - 32}px`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            cursor: "pointer",
            zIndex: 25,
            transition: "transform 0.15s ease",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              padding: "5px 14px",
              borderRadius: 100,
              boxShadow: `0 4px 20px ${frontCardProjected.card.accent}36, 0 1px 4px rgba(0,0,0,0.1)`,
              border: `1.5px solid ${frontCardProjected.card.accent}`,
              display: "flex",
              alignItems: "center",
              gap: 7,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: frontCardProjected.card.accent,
                boxShadow: `0 0 8px ${frontCardProjected.card.accent}`,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "0.05em",
              }}
            >
              {frontCardProjected.card.num} {frontCardProjected.card.title}
            </span>
          </div>
        </div>
      )}

      {/* Drag & Tap Hint */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          padding: "6px 16px",
          borderRadius: 100,
          border: "1px solid rgba(20, 20, 20, 0.08)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 13 }}>⚽</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#334155",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          CLICK WHITE BLOCK OR DRAG BALL TO ROTATE
        </span>
      </div>
    </div>
  );
}
