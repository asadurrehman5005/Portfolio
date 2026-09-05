import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface WaterAquarium3DProps {
  className?: string;
  onSplash?: () => void;
}

interface Ripple {
  x: number;
  z: number;
  time: number;
  strength: number;
}

export default function WaterAquarium3D({ className, onSplash }: WaterAquarium3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fpsLabel, setFpsLabel] = useState("60 FPS");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    let width = mount.clientWidth || 580;
    let height = mount.clientHeight || 500;

    // ─── Scene, Camera & Renderer ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.8);
    camera.lookAt(0, -0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // ─── Lighting Setup (Underwater Ambience) ───
    const ambientLight = new THREE.AmbientLight(0x0ea5e9, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 3.2);
    sunLight.position.set(1.5, 6, 2);
    scene.add(sunLight);

    const waterGlow = new THREE.PointLight(0x0284c7, 3.5, 9);
    waterGlow.position.set(0, 0, 1.2);
    scene.add(waterGlow);

    const rimLight = new THREE.PointLight(0xf97316, 1.8, 8);
    rimLight.position.set(-2.5, -1, 1.5);
    scene.add(rimLight);

    // ─── Aquarium Tank Dimensions ───
    const tankW = 4.3;
    const tankH = 3.2;
    const tankD = 2.6;
    const waterLevel = 0.95;
    const tankBottom = -tankH / 2;

    const tankGroup = new THREE.Group();
    scene.add(tankGroup);

    // ─── Glass Tank Materials ───
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      metalness: 0.02,
      transmission: 0.82,
      ior: 1.333,
      reflectivity: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const edgeGlowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });

    // Outer Glass Container
    const glassBoxGeo = new THREE.BoxGeometry(tankW, tankH, tankD);
    const glassMesh = new THREE.Mesh(glassBoxGeo, glassMat);
    tankGroup.add(glassMesh);

    // Minimalist High-Tech Tank Edge Wire
    const edgeBoxGeo = new THREE.BoxGeometry(tankW * 1.002, tankH * 1.002, tankD * 1.002);
    const edgeMesh = new THREE.Mesh(edgeBoxGeo, edgeGlowMat);
    tankGroup.add(edgeMesh);

    // Sleek Pedestals / Tank Bases
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
    });
    const baseGeo = new THREE.BoxGeometry(tankW + 0.14, 0.12, tankD + 0.14);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = tankBottom - 0.06;
    tankGroup.add(baseMesh);

    const topRimGeo = new THREE.BoxGeometry(tankW + 0.08, 0.08, tankD + 0.08);
    const topRimMesh = new THREE.Mesh(topRimGeo, baseMat);
    topRimMesh.position.y = tankH / 2 + 0.04;
    tankGroup.add(topRimMesh);

    // ─── Deep Water Volume Gradient Mesh ───
    const waterVolumeGeo = new THREE.BoxGeometry(tankW * 0.98, tankH * 0.86, tankD * 0.98);
    const waterVolumeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0369a1,
      transparent: true,
      opacity: 0.28,
      roughness: 0.15,
      transmission: 0.6,
      ior: 1.33,
      depthWrite: false,
    });
    const waterVolume = new THREE.Mesh(waterVolumeGeo, waterVolumeMat);
    waterVolume.position.y = -0.15;
    tankGroup.add(waterVolume);

    // ─── Interactive Water Surface with Wave & Ripple Displacement ───
    const surfaceSegW = 44;
    const surfaceSegD = 32;
    const waterSurfaceGeo = new THREE.PlaneGeometry(
      tankW * 0.98,
      tankD * 0.98,
      surfaceSegW,
      surfaceSegD
    );
    waterSurfaceGeo.rotateX(-Math.PI / 2);

    const initialSurfacePositions = Float32Array.from(
      waterSurfaceGeo.attributes.position.array
    );

    const waterSurfaceMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.82,
      roughness: 0.08,
      transmission: 0.45,
      ior: 1.333,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide,
    });

    const waterSurfaceMesh = new THREE.Mesh(waterSurfaceGeo, waterSurfaceMat);
    waterSurfaceMesh.position.y = waterLevel;
    tankGroup.add(waterSurfaceMesh);

    // ─── Procedural Caustic Bottom Floor Shader ───
    const causticsPlaneGeo = new THREE.PlaneGeometry(tankW * 0.96, tankD * 0.96, 32, 32);
    causticsPlaneGeo.rotateX(-Math.PI / 2);

    const causticsShader = {
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x0284c7) },
        uColor2: { value: new THREE.Color(0x38bdf8) },
        uColor3: { value: new THREE.Color(0xbae6fd) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        float causticPattern(vec2 p, float t) {
          vec2 p1 = p * 4.5 + vec2(t * 0.4, t * 0.3);
          vec2 p2 = p * 5.5 - vec2(t * 0.35, t * 0.45);
          float c1 = sin(p1.x + sin(p1.y * 1.5)) * 0.5 + 0.5;
          float c2 = cos(p2.x * 1.2 + cos(p2.y * 1.6)) * 0.5 + 0.5;
          float pattern = pow(c1 * c2, 1.6) * 2.2;
          return pattern;
        }

        void main() {
          float t = uTime * 1.1;
          float c1 = causticPattern(vUv, t);
          float c2 = causticPattern(vUv * 1.4 + 0.3, t * 1.25);
          float causticTotal = clamp(c1 * 0.6 + c2 * 0.7, 0.0, 1.8);

          vec3 baseSand = mix(vec3(0.02, 0.12, 0.22), uColor1 * 0.5, vUv.y * 0.5 + 0.5);
          vec3 causticColor = mix(uColor2, uColor3, causticTotal * 0.65);
          vec3 finalColor = baseSand + causticColor * causticTotal * 0.68;

          float edgeFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) *
                           smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);

          gl_FragColor = vec4(finalColor, 0.88 * edgeFade);
        }
      `,
    };

    const causticsMat = new THREE.ShaderMaterial({
      uniforms: causticsShader.uniforms,
      vertexShader: causticsShader.vertexShader,
      fragmentShader: causticsShader.fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const causticsMesh = new THREE.Mesh(causticsPlaneGeo, causticsMat);
    causticsMesh.position.y = tankBottom + 0.08;
    tankGroup.add(causticsMesh);

    // ─── Volumetric Light Shafts (Sunbeams / Godrays) ───
    const rayGroup = new THREE.Group();
    tankGroup.add(rayGroup);

    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    for (let i = 0; i < 5; i++) {
      const rayGeo = new THREE.ConeGeometry(0.35 + i * 0.08, tankH * 0.92, 16, 1, true);
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(-1.2 + i * 0.65, 0.1, -0.4 + (i % 2) * 0.4);
      ray.rotation.x = Math.PI * 0.08;
      ray.rotation.z = -0.15 + i * 0.06;
      rayGroup.add(ray);
    }

    // ─── Rising Bubble Physics System ───
    const bubbleCount = 75;
    const bubbleGeo = new THREE.SphereGeometry(1, 12, 12);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transmission: 0.95,
      opacity: 0.75,
      roughness: 0.02,
      ior: 1.15,
      clearcoat: 1.0,
      transparent: true,
      depthWrite: false,
    });

    const bubbleInstanced = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    bubbleInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    tankGroup.add(bubbleInstanced);

    interface BubbleState {
      x: number;
      y: number;
      z: number;
      scale: number;
      speedY: number;
      wobbleSpeed: number;
      wobbleAmp: number;
      phase: number;
    }

    const bubbles: BubbleState[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: (Math.random() - 0.5) * (tankW * 0.86),
        y: tankBottom + Math.random() * (tankH * 0.85),
        z: (Math.random() - 0.5) * (tankD * 0.8),
        scale: 0.022 + Math.random() * 0.045,
        speedY: 0.012 + Math.random() * 0.024,
        wobbleSpeed: 2.0 + Math.random() * 3.5,
        wobbleAmp: 0.015 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const dummy = new THREE.Object3D();

    // ─── Swimming 3D Fish Builder ───
    interface FishAgent {
      group: THREE.Group;
      bodyMesh: THREE.Mesh;
      tailFin: THREE.Mesh;
      leftFin: THREE.Mesh;
      rightFin: THREE.Mesh;
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      target: THREE.Vector3;
      speed: number;
      wobbleFreq: number;
      size: number;
      color: number;
    }

    const fishes: FishAgent[] = [];

    function createFish(colorHex: number, accentHex: number, scale: number): FishAgent {
      const fishGroup = new THREE.Group();

      const bodyGeo = new THREE.ConeGeometry(0.24 * scale, 1.1 * scale, 16, 6);
      bodyGeo.rotateX(Math.PI / 2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.25,
        metalness: 0.4,
        emissive: colorHex,
        emissiveIntensity: 0.25,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      fishGroup.add(bodyMesh);

      const finMat = new THREE.MeshPhysicalMaterial({
        color: accentHex,
        transparent: true,
        opacity: 0.72,
        roughness: 0.1,
        transmission: 0.8,
        side: THREE.DoubleSide,
      });

      const dorsalGeo = new THREE.PlaneGeometry(0.45 * scale, 0.2 * scale);
      dorsalGeo.rotateY(Math.PI / 2);
      const dorsalMesh = new THREE.Mesh(dorsalGeo, finMat);
      dorsalMesh.position.set(0, 0.16 * scale, -0.1 * scale);
      fishGroup.add(dorsalMesh);

      const tailGeo = new THREE.PlaneGeometry(0.55 * scale, 0.42 * scale);
      tailGeo.rotateY(Math.PI / 2);
      const tailFin = new THREE.Mesh(tailGeo, finMat);
      tailFin.position.set(0, 0, -0.65 * scale);
      fishGroup.add(tailFin);

      const pectoralGeo = new THREE.PlaneGeometry(0.3 * scale, 0.18 * scale);
      const leftFin = new THREE.Mesh(pectoralGeo, finMat);
      leftFin.position.set(0.18 * scale, -0.04 * scale, 0.12 * scale);
      leftFin.rotation.set(0.4, 0.6, -0.3);
      fishGroup.add(leftFin);

      const rightFin = new THREE.Mesh(pectoralGeo, finMat);
      rightFin.position.set(-0.18 * scale, -0.04 * scale, 0.12 * scale);
      rightFin.rotation.set(0.4, -0.6, 0.3);
      fishGroup.add(rightFin);

      const eyeGeo = new THREE.SphereGeometry(0.04 * scale, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });

      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(0.14 * scale, 0.08 * scale, 0.32 * scale);
      const pupilL = new THREE.Mesh(eyeGeo, pupilMat);
      pupilL.scale.set(0.6, 0.6, 0.6);
      pupilL.position.set(0.16 * scale, 0.08 * scale, 0.35 * scale);
      fishGroup.add(eyeL, pupilL);

      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(-0.14 * scale, 0.08 * scale, 0.32 * scale);
      const pupilR = new THREE.Mesh(eyeGeo, pupilMat);
      pupilR.scale.set(0.6, 0.6, 0.6);
      pupilR.position.set(-0.16 * scale, 0.08 * scale, 0.35 * scale);
      fishGroup.add(eyeR, pupilR);

      tankGroup.add(fishGroup);

      return {
        group: fishGroup,
        bodyMesh,
        tailFin,
        leftFin,
        rightFin,
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 2.5,
          -0.5 + Math.random() * 1.1,
          (Math.random() - 0.5) * 1.4
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        target: new THREE.Vector3(0, 0, 0),
        speed: 0.024 + Math.random() * 0.016,
        wobbleFreq: 5.2 + Math.random() * 2.0,
        size: scale,
        color: colorHex,
      };
    }

    fishes.push(createFish(0xf97316, 0xfde047, 0.95));
    fishes.push(createFish(0x0284c7, 0x38bdf8, 0.85));
    fishes.push(createFish(0xec4899, 0xf472b6, 0.72));

    // ─── Interaction: Mouse / Touch Raycasting on Water Surface ───
    const ripples: Ripple[] = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    function addRipple(worldX: number, worldZ: number, strength = 1.0) {
      ripples.push({
        x: worldX,
        z: worldZ,
        time: 0,
        strength,
      });
      if (ripples.length > 14) ripples.shift();
      if (onSplash) onSplash();
    }

    function handlePointerMove(e: MouseEvent | Touch) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(waterSurfaceMesh);

      if (intersects.length > 0) {
        const p = intersects[0].point;
        const localPoint = tankGroup.worldToLocal(p.clone());
        addRipple(localPoint.x, localPoint.z, 0.8);

        fishes.forEach((fish) => {
          const dist = fish.position.distanceTo(localPoint);
          if (dist < 1.3) {
            const away = fish.position.clone().sub(localPoint).normalize().multiplyScalar(0.06);
            fish.velocity.add(away);
          }
        });
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e);
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      tankGroup.rotation.y = nx * 0.22;
      tankGroup.rotation.x = -ny * 0.12;
    };

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(waterSurfaceMesh);
      if (intersects.length > 0) {
        const localPoint = tankGroup.worldToLocal(intersects[0].point.clone());
        addRipple(localPoint.x, localPoint.z, 1.8);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0]);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -(((t.clientY - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(waterSurfaceMesh);
        if (intersects.length > 0) {
          const localPoint = tankGroup.worldToLocal(intersects[0].point.clone());
          addRipple(localPoint.x, localPoint.z, 1.8);
        }
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });

    // ─── Resize Handler ───
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || 580;
      height = mount.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // ─── Main Animation Loop ───
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      frameCount++;
      if (performance.now() - lastFpsTime >= 1000) {
        setFpsLabel(`${frameCount} FPS`);
        frameCount = 0;
        lastFpsTime = performance.now();
      }

      causticsShader.uniforms.uTime.value = time;

      const posAttr = waterSurfaceGeo.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let r = ripples.length - 1; r >= 0; r--) {
        ripples[r].time += delta * 3.5;
        if (ripples[r].time > 4.5) {
          ripples.splice(r, 1);
        }
      }

      const vertexCount = posAttr.count;
      for (let i = 0; i < vertexCount; i++) {
        const initX = initialSurfacePositions[i * 3];
        const initZ = initialSurfacePositions[i * 3 + 2];

        let waveY =
          Math.sin(initX * 2.8 + time * 3.0) * 0.045 +
          Math.cos(initZ * 3.2 + time * 2.4) * 0.038 +
          Math.sin((initX + initZ) * 4.5 + time * 3.8) * 0.022;

        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const dist = Math.hypot(initX - rip.x, initZ - rip.z);
          const rippleRadius = rip.time * 0.75;
          const distFromWave = Math.abs(dist - rippleRadius);

          if (distFromWave < 0.8) {
            const decay = Math.exp(-rip.time * 1.2) * Math.exp(-dist * 0.8);
            const wave = Math.sin((dist - rip.time * 2.8) * 12.0) * decay * rip.strength * 0.09;
            waveY += wave;
          }
        }

        posArray[i * 3 + 1] = waveY;
      }
      posAttr.needsUpdate = true;
      waterSurfaceGeo.computeVertexNormals();

      for (let i = 0; i < bubbleCount; i++) {
        const b = bubbles[i];
        b.y += b.speedY;
        b.phase += b.wobbleSpeed * delta;

        const wobbleX = Math.sin(b.phase) * b.wobbleAmp;
        const wobbleZ = Math.cos(b.phase) * b.wobbleAmp;

        if (b.y >= waterLevel) {
          b.y = tankBottom + 0.1;
          b.x = (Math.random() - 0.5) * (tankW * 0.86);
          b.z = (Math.random() - 0.5) * (tankD * 0.8);
          if (Math.random() > 0.85) {
            addRipple(b.x, b.z, 0.4);
          }
        }

        dummy.position.set(b.x + wobbleX, b.y, b.z + wobbleZ);
        dummy.scale.setScalar(b.scale);
        dummy.updateMatrix();
        bubbleInstanced.setMatrixAt(i, dummy.matrix);
      }
      bubbleInstanced.instanceMatrix.needsUpdate = true;

      fishes.forEach((fish, fIdx) => {
        if (fish.position.distanceTo(fish.target) < 0.6) {
          fish.target.set(
            (Math.random() - 0.5) * (tankW * 0.72),
            tankBottom + 0.5 + Math.random() * (tankH * 0.55),
            (Math.random() - 0.5) * (tankD * 0.65)
          );
        }

        const desired = fish.target.clone().sub(fish.position).normalize().multiplyScalar(fish.speed);
        fish.velocity.lerp(desired, 0.035);
        fish.position.add(fish.velocity);

        const xLimit = (tankW * 0.82) / 2;
        const zLimit = (tankD * 0.75) / 2;
        if (Math.abs(fish.position.x) > xLimit) fish.velocity.x *= -0.8;
        if (Math.abs(fish.position.z) > zLimit) fish.velocity.z *= -0.8;
        if (fish.position.y > waterLevel - 0.25) fish.velocity.y *= -0.8;
        if (fish.position.y < tankBottom + 0.3) fish.velocity.y *= -0.8;

        fish.group.position.copy(fish.position);

        if (fish.velocity.lengthSq() > 0.00001) {
          const lookTarget = fish.position.clone().add(fish.velocity);
          fish.group.lookAt(lookTarget);
        }

        const wiggle = Math.sin(time * fish.wobbleFreq + fIdx * 2.0);
        fish.tailFin.rotation.y = wiggle * 0.55;
        fish.group.rotation.z = wiggle * 0.08;
        fish.leftFin.rotation.z = -0.3 + Math.sin(time * 4.0 + fIdx) * 0.25;
        fish.rightFin.rotation.z = 0.3 - Math.sin(time * 4.0 + fIdx) * 0.25;
      });

      rayGroup.rotation.y = Math.sin(time * 0.4) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      renderer.dispose();
    };
  }, [onSplash]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 460,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: isHovered ? "grab" : "default",
          touchAction: "none",
        }}
      />

      {/* Minimalist HUD Pill */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(15, 23, 42, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            padding: "4px 10px",
            borderRadius: 100,
            boxShadow: "0 4px 16px rgba(0, 180, 216, 0.15)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 8px #38bdf8",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5,
              letterSpacing: "0.14em",
              color: "#e0f2fe",
              fontWeight: 600,
            }}
          >
            3D WATER SIMULATION
          </span>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "4px 8px",
            borderRadius: 100,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#94a3b8",
            letterSpacing: "0.1em",
          }}
        >
          {fpsLabel}
        </div>
      </div>

      {/* Interaction Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "5px 12px",
          borderRadius: 100,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 11 }}>🌊</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "#cbd5e1",
            fontWeight: 500,
          }}
        >
          DRAG OR TAP TO CREATE RIPPLES
        </span>
      </div>
    </div>
  );
}
