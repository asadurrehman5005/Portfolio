import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface Tech3DNetworkProps {
  coreLabel?: string;
  accentColor?: string;
  onNodeClick?: (label: string) => void;
  className?: string;
  isMobile?: boolean;
}

interface NodeData {
  id: number;
  origin: THREE.Vector3;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  isInteractive: boolean;
  isYellow: boolean;
  radius: number;
  label?: string;
  labelColor?: string;
}

const TECH_LABELS = [
  { name: "REACT", color: "#2563EB" },
  { name: "NEXT.JS", color: "#0F172A" },
  { name: "NODE.JS", color: "#16A34A" },
  { name: "TYPESCRIPT", color: "#2563EB" },
  { name: "AI / ML", color: "#F59E0B" },
  { name: "API", color: "#9333EA" },
  { name: "DATABASE", color: "#F97316" },
  { name: "CLOUD", color: "#0284C7" },
];

export default function Tech3DNetwork({
  coreLabel = "EVR",
  accentColor = "#2563EB",
  onNodeClick,
  isMobile,
}: Tech3DNetworkProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [projectedLabels, setProjectedLabels] = useState<
    { id: number; name: string; color: string; x: number; y: number; visible: boolean }[]
  >([]);
  const [coreProjected, setCoreProjected] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: true,
  });

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    // ─── Dimensions with accurate container inspection ───
    const getContainerDims = () => {
      const rect = mount.getBoundingClientRect();
      const parentRect = mount.parentElement?.getBoundingClientRect();
      const w = Math.round(
        rect.width ||
          mount.clientWidth ||
          parentRect?.width ||
          (typeof window !== "undefined" ? Math.min(window.innerWidth - 32, 580) : 580)
      );
      const h = Math.round(rect.height || mount.clientHeight || (w < 640 ? 340 : 480));
      return { w: Math.max(w, 280), h: Math.max(h, 280) };
    };

    let { w: width, h: height } = getContainerDims();
    const isNarrow = width < 768;

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // ─── Lights ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x90a0ff, 0.8);
    dirLight2.position.set(-4, -3, -4);
    scene.add(dirLight2);

    const pointLight1 = new THREE.PointLight(0x6366f1, 3.5, 6);
    pointLight1.position.set(0, 0, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf97316, 2.0, 7);
    pointLight2.position.set(2, 2, 1);
    scene.add(pointLight2);

    // ─── Main Rotating Group with Responsive Scaling ───
    const mainGroup = new THREE.Group();
    mainGroup.scale.setScalar(isNarrow ? 0.92 : 1.0);
    scene.add(mainGroup);

    // ─── Nodes Generation (matching reference) ───
    const nodes: NodeData[] = [];
    const nodeCount = 28;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // 8 fixed labeled positions
    const labeledPositions = [
      new THREE.Vector3(-1.4, 1.1, 0.6),   // REACT
      new THREE.Vector3(0.2, 2.5, -0.3),   // NEXT.JS
      new THREE.Vector3(2.6, 1.6, -0.2),   // NODE.JS
      new THREE.Vector3(-2.3, -0.8, 0.4),  // TYPESCRIPT
      new THREE.Vector3(-1.2, -2.2, 0.5),  // AI/ML
      new THREE.Vector3(0.4, -2.6, 0.2),   // API
      new THREE.Vector3(2.8, 0.1, -0.3),   // DATABASE
      new THREE.Vector3(2.1, -1.4, 0.4),   // CLOUD
    ];

    labeledPositions.forEach((pos, i) => {
      const isInteractive = i < 4;
      const isYellow = i === 4 || i === 6;
      nodes.push({
        id: i,
        origin: pos.clone(),
        position: pos.clone(),
        velocity: new THREE.Vector3(),
        isInteractive,
        isYellow,
        radius: isInteractive ? 0.15 : 0.12,
        label: TECH_LABELS[i].name,
        labelColor: TECH_LABELS[i].color,
      });
    });

    // 20 outer sphere nodes
    for (let i = 8; i < nodeCount; i++) {
      const t = i / (nodeCount - 1);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = goldenAngle * i;
      const r = 1.7 + (i % 5) * 0.25;
      const pos = new THREE.Vector3(
        r * Math.sin(inclination) * Math.cos(azimuth),
        r * Math.cos(inclination),
        r * Math.sin(inclination) * Math.sin(azimuth) * 0.7
      );
      const isInteractive = i < 16;
      const isYellow = i % 3 === 0;
      nodes.push({
        id: i,
        origin: pos.clone(),
        position: pos.clone(),
        velocity: new THREE.Vector3(),
        isInteractive,
        isYellow,
        radius: isInteractive ? 0.11 : isYellow ? 0.08 : 0.16,
      });
    }

    // ─── Node Meshes ───
    const nodeMeshes: THREE.Mesh[] = [];
    const sphereGeomCache = new Map<number, THREE.SphereGeometry>();

    nodes.forEach((node) => {
      let geom = sphereGeomCache.get(node.radius);
      if (!geom) {
        geom = new THREE.SphereGeometry(node.radius, 32, 32);
        sphereGeomCache.set(node.radius, geom);
      }

      const color = node.isYellow
        ? 0xf59e0b
        : node.isInteractive
        ? 0xf97316
        : 0x2563eb;

      const emissive = node.isYellow
        ? 0xd97706
        : node.isInteractive
        ? 0xea580c
        : 0x1d4ed8;

      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: node.isInteractive || node.isYellow ? 0.55 : 0.3,
        roughness: 0.2,
        metalness: 0.5,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(node.position);
      mainGroup.add(mesh);
      nodeMeshes.push(mesh);
    });

    // ─── Dynamic Connection Lines ───
    const maxSegments = 400;
    const linePositions = new Float32Array(maxSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.35,
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    mainGroup.add(lineSegments);

    // ─── Central Core (Glow Sphere + Main Sphere + Rings) ───
    const coreGroup = new THREE.Group();
    mainGroup.add(coreGroup);

    // Outer glow
    const outerGlowGeom = new THREE.SphereGeometry(0.6, 32, 32);
    const outerGlowMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
      metalness: 0.0,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeom, outerGlowMat);
    coreGroup.add(outerGlow);

    // Main central core sphere
    const coreSphereGeom = new THREE.SphereGeometry(0.44, 48, 48);
    const coreSphereMat = new THREE.MeshStandardMaterial({
      color: 0x4338ca,
      emissive: 0x3730a3,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.35,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeom, coreSphereMat);
    coreGroup.add(coreSphere);

    // 3 Concentric Orbital Rings
    const ringGeom = (r: number) => new THREE.RingGeometry(r, r + 0.024, 96);

    const ring1 = new THREE.Mesh(
      ringGeom(0.58),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
    );
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      ringGeom(0.74),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    coreGroup.add(ring2);

    const ring3 = new THREE.Mesh(
      ringGeom(0.92),
      new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    coreGroup.add(ring3);

    // Faint outer orbital rings
    const ring4 = new THREE.Mesh(
      ringGeom(1.15),
      new THREE.MeshBasicMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    ring4.rotation.x = Math.PI / 2;
    coreGroup.add(ring4);

    const ring5 = new THREE.Mesh(
      ringGeom(1.35),
      new THREE.MeshBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
    );
    ring5.rotation.set(Math.PI / 3, 0.2, 0);
    coreGroup.add(ring5);

    // ─── Floating Star Dust Particles ───
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.cos(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x7c9fc4,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particlePoints = new THREE.Points(particleGeom, particleMat);
    mainGroup.add(particlePoints);

    // ─── Interaction & Physics ───
    const mouseWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let isHovered = false;

    // Drag / Rotation State
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const isTouch = "touches" in e;
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        if (isTouch) {
          if (Math.abs(deltaX) > Math.abs(deltaY) * 0.7) {
            targetRotationY += deltaX * 0.009;
            targetRotationX += deltaY * 0.003;
          }
        } else {
          targetRotationY += deltaX * 0.008;
          targetRotationX += deltaY * 0.008;
        }
        prevMouseX = clientX;
        prevMouseY = clientY;
      }

      // Raycast mouse into 3D world plane for node spring reaction
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);
      isHovered = true;
    };

    const handlePointerUp = () => {
      isDragging = false;
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

    const connectionDistance = 2.6;
    const interactionRadius = 1.8;
    const springStrength = 0.12;
    const damping = 0.82;
    const mouseInfluence = 0.6;

    let isVisible = true;

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) * 0.001, 0.1);
      lastTime = currentTime;
      const t = currentTime * 0.001;
      frameCount++;

      // Auto rotation + smoothed drag rotation
      if (!isDragging) {
        targetRotationY += delta * 0.14;
      }
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      mainGroup.rotation.x = currentRotationX + Math.sin(t * 0.3) * 0.06;
      mainGroup.rotation.y = currentRotationY;

      // Rotate orbital rings
      ring1.rotation.z += delta * 0.45;
      ring2.rotation.x += delta * 0.28;
      ring3.rotation.y += delta * 0.22;
      ring3.rotation.z -= delta * 0.12;

      // Pulse core sphere
      const pulse = 1 + Math.sin(t * 1.5) * 0.04;
      coreSphere.scale.setScalar(pulse);
      outerGlow.scale.setScalar(1 + Math.sin(t * 1.2 + 1) * 0.06);

      // Rotate particle cloud
      particlePoints.rotation.y += delta * 0.04;

      // ─── Spring Physics on Nodes ───
      // Invert mainGroup matrix to get mouse in local group space
      const invMat = mainGroup.matrixWorld.clone().invert();
      const localMouse = mouseWorld.clone().applyMatrix4(invMat);

      nodes.forEach((node, i) => {
        if (node.isInteractive && isHovered) {
          const dx = localMouse.x - node.position.x;
          const dy = localMouse.y - node.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactionRadius) {
            const force = (1 - dist / interactionRadius) * mouseInfluence;
            node.velocity.x += dx * force * 0.08;
            node.velocity.y += dy * force * 0.08;
          }
        }

        // Spring back to origin
        node.velocity.x += (node.origin.x - node.position.x) * springStrength;
        node.velocity.y += (node.origin.y - node.position.y) * springStrength;
        node.velocity.z += (node.origin.z - node.position.z) * springStrength;

        // Apply damping
        node.velocity.multiplyScalar(damping);
        node.position.add(node.velocity);

        // Update mesh position
        nodeMeshes[i].position.copy(node.position);
      });

      // ─── Recompute Connection Lines ───
      let segIdx = 0;
      const positions = lineSegments.geometry.attributes.position.array as Float32Array;

      // Connect neighboring nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          if (dist < connectionDistance && segIdx < maxSegments - 2) {
            positions[segIdx * 6 + 0] = nodes[i].position.x;
            positions[segIdx * 6 + 1] = nodes[i].position.y;
            positions[segIdx * 6 + 2] = nodes[i].position.z;
            positions[segIdx * 6 + 3] = nodes[j].position.x;
            positions[segIdx * 6 + 4] = nodes[j].position.y;
            positions[segIdx * 6 + 5] = nodes[j].position.z;
            segIdx++;
          }
        }
      }

      // Connect nodes to center core
      const center = new THREE.Vector3(0, 0, 0);
      for (let i = 0; i < nodes.length; i++) {
        const dist = nodes[i].position.distanceTo(center);
        if (dist < connectionDistance * 0.75 && segIdx < maxSegments - 1) {
          positions[segIdx * 6 + 0] = nodes[i].position.x;
          positions[segIdx * 6 + 1] = nodes[i].position.y;
          positions[segIdx * 6 + 2] = nodes[i].position.z;
          positions[segIdx * 6 + 3] = 0;
          positions[segIdx * 6 + 4] = 0;
          positions[segIdx * 6 + 5] = 0;
          segIdx++;
        }
      }

      // Zero out unused segments
      for (let k = segIdx * 6; k < positions.length; k++) {
        positions[k] = 0;
      }
      lineSegments.geometry.attributes.position.needsUpdate = true;
      lineSegments.geometry.setDrawRange(0, segIdx * 2);

      // ─── Project 3D Nodes to 2D Screen for HTML labels ───
      if (frameCount % 2 === 0) {
        const tempVec = new THREE.Vector3();
        const screenLabels = nodes
          .filter((n) => n.label)
          .map((n) => {
            tempVec.copy(n.position);
            tempVec.applyMatrix4(mainGroup.matrixWorld);
            tempVec.project(camera);

            const isFront = tempVec.z < 1;
            const x = (tempVec.x * 0.5 + 0.5) * width;
            const y = (-(tempVec.y * 0.5) + 0.5) * height;

            return {
              id: n.id,
              name: n.label!,
              color: n.labelColor || "#2563EB",
              x,
              y,
              visible: isFront && x >= 12 && x <= width - 12 && y >= 12 && y <= height - 12,
            };
          });
        setProjectedLabels(screenLabels);

        // Core projection
        tempVec.set(0, 0, 0);
        tempVec.applyMatrix4(mainGroup.matrixWorld);
        tempVec.project(camera);
        setCoreProjected({
          x: (tempVec.x * 0.5 + 0.5) * width,
          y: (-(tempVec.y * 0.5) + 0.5) * height,
          visible: tempVec.z < 1,
        });
      }

      renderer.render(scene, camera);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          clock.start();
          animate();
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(mount);

    animate();

    // ─── Auto-Resize with ResizeObserver & Window Resize ───
    const updateDimensions = (newW: number, newH: number) => {
      if (newW <= 0 || newH <= 0) return;
      width = newW;
      height = newH;
      const narrow = width < 768;
      camera.aspect = width / height;
      camera.position.set(0, 0, 7.2);
      mainGroup.scale.setScalar(narrow ? 0.92 : 1.0);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, true);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rw = entry.contentRect.width;
        const rh = entry.contentRect.height;
        if (rw > 0 && rh > 0) {
          updateDimensions(Math.round(rw), Math.round(rh));
        }
      }
    });
    resizeObserver.observe(mount);

    const handleResize = () => {
      const { w, h } = getContainerDims();
      updateDimensions(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: isMobile ? 380 : 460,
        overflow: "hidden",
        userSelect: "none",
        touchAction: "pan-y",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          cursor: "grab",
          touchAction: "pan-y",
        }}
      />

      {/* 3D Projected Central AR/EVR Badge */}
      {coreProjected.visible && (
        <div
          style={{
            position: "absolute",
            left: `${coreProjected.x}px`,
            top: `${coreProjected.y}px`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 15,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: isMobile ? 24 : 26,
              color: "#FFFFFF",
              letterSpacing: "0.08em",
              textShadow: `0 0 24px ${accentColor}, 0 0 8px rgba(255,255,255,0.9)`,
            }}
          >
            {coreLabel}
          </div>
        </div>
      )}

      {/* 3D Projected Floating Tech Chips */}
      {projectedLabels.map(
        (lbl) =>
          lbl.visible && (
            <div
              key={lbl.id}
              onClick={() => onNodeClick?.(lbl.name)}
              style={{
                position: "absolute",
                left: `${lbl.x}px`,
                top: `${lbl.y - (isMobile ? 12 : 18)}px`,
                transform: "translate(-50%, -50%)",
                pointerEvents: onNodeClick ? "auto" : "none",
                cursor: onNodeClick ? "pointer" : "default",
                zIndex: 20,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 6,
                  padding: isMobile ? "4px 9px" : "4px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 5 : 6,
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05)",
                  whiteSpace: "nowrap",
                  border: "1px solid rgba(20, 20, 20, 0.08)",
                }}
              >
                <span
                  style={{
                    width: isMobile ? 6 : 7,
                    height: isMobile ? 6 : 7,
                    borderRadius: "50%",
                    background: lbl.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', 'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 10 : 10.5,
                    letterSpacing: "0.08em",
                    color: "#0F172A",
                  }}
                >
                  {lbl.name}
                </span>
              </div>
            </div>
          )
      )}
    </div>
  );
}
