import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, CloudRain, Sun, Eye, Zap, Droplet, Sprout, Wind } from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

interface FarmScene3DProps {
  interactive?: boolean;
  initialPreset?: 'overview' | 'fieldA' | 'irrigation' | 'drone';
  className?: string;
  onSelectField?: (fieldName: string) => void;
}

export const FarmScene3D: React.FC<FarmScene3DProps> = ({
  interactive = true,
  initialPreset = 'overview',
  className = 'w-full h-[450px]',
  onSelectField,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { soilMoistureOverride, rainProbabilityOverride, activeFarm } = useFarm();

  const [selectedHotspot, setSelectedHotspot] = useState<{
    id: string;
    title: string;
    crop: string;
    moisture: number;
    health: string;
    ndvi: number;
  } | null>(null);

  const [isRaining, setIsRaining] = useState<boolean>(rainProbabilityOverride > 60);
  const [cameraView, setCameraView] = useState<'overview' | 'fieldA' | 'fieldB' | 'drone'>('overview');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [hasWebGlError, setHasWebGlError] = useState<boolean>(false);

  // Sync rain state with context
  useEffect(() => {
    setIsRaining(rainProbabilityOverride > 60);
  }, [rainProbabilityOverride]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 450;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06150f);
    scene.fog = new THREE.FogExp2(0x06150f, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(28, 22, 28);
    camera.lookAt(0, 2, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } catch (err) {
      console.warn('WebGL is not supported or failed in this environment, using telemetry map view:', err);
      setHasWebGlError(true);
      return;
    }

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    sunLight.position.set(30, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    const d = 30;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const cyanRim = new THREE.DirectionalLight(0x38bdf8, 0.4);
    cyanRim.position.set(-20, 15, -20);
    scene.add(cyanRim);

    // ROOT FARM GROUP
    const farmGroup = new THREE.Group();
    scene.add(farmGroup);

    // TERRAIN BASE (SOIL & GRASS)
    const baseGeo = new THREE.BoxGeometry(44, 1.5, 36);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f3b2b,
      roughness: 0.9,
      metalness: 0.1,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.75;
    baseMesh.receiveShadow = true;
    farmGroup.add(baseMesh);

    // FIELD A (Tomato Plots - Rich dark soil rows with green plants & red fruits)
    const fieldAGeo = new THREE.BoxGeometry(16, 0.3, 13);
    const soilMatA = new THREE.MeshStandardMaterial({
      color: 0x3b2314, // rich fertile loam
      roughness: 0.95,
    });
    const fieldAMesh = new THREE.Mesh(fieldAGeo, soilMatA);
    fieldAMesh.position.set(-10, 0.15, -6);
    fieldAMesh.receiveShadow = true;
    farmGroup.add(fieldAMesh);

    // Tomato crop rows
    const plantGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
    const tomatoGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });

    for (let r = -5; r <= 5; r += 1.8) {
      for (let c = -6; c <= 6; c += 1.2) {
        const plant = new THREE.Mesh(plantGeo, plantMat);
        plant.position.set(-10 + c, 0.45 + Math.random() * 0.1, -6 + r);
        plant.scale.set(1 + Math.random() * 0.2, 1 + Math.random() * 0.3, 1 + Math.random() * 0.2);
        plant.castShadow = true;
        farmGroup.add(plant);

        // Add tomato fruit
        if (Math.random() > 0.4) {
          const tom = new THREE.Mesh(tomatoGeo, tomatoMat);
          tom.position.set(-10 + c + 0.18, 0.55, -6 + r + 0.15);
          farmGroup.add(tom);
        }
      }
    }

    // FIELD B (Sweet Corn Plots - Golden stalks & green leaves)
    const fieldBGeo = new THREE.BoxGeometry(16, 0.3, 13);
    const soilMatB = new THREE.MeshStandardMaterial({
      color: 0x4a2e1b,
      roughness: 0.95,
    });
    const fieldBMesh = new THREE.Mesh(fieldBGeo, soilMatB);
    fieldBMesh.position.set(10, 0.15, -6);
    fieldBMesh.receiveShadow = true;
    farmGroup.add(fieldBMesh);

    const cornStalkGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.4, 6);
    const cornStalkMat = new THREE.MeshStandardMaterial({ color: 0x65a30d });
    const cornTasselGeo = new THREE.ConeGeometry(0.2, 0.4, 5);
    const cornTasselMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });

    for (let r = -5; r <= 5; r += 1.8) {
      for (let c = -6; c <= 6; c += 1.3) {
        const stalk = new THREE.Mesh(cornStalkGeo, cornStalkMat);
        stalk.position.set(10 + c, 0.85, -6 + r);
        stalk.castShadow = true;
        farmGroup.add(stalk);

        const tassel = new THREE.Mesh(cornTasselGeo, cornTasselMat);
        tassel.position.set(10 + c, 1.65, -6 + r);
        farmGroup.add(tassel);
      }
    }

    // FIELD C (Orchard Trees & Terraces)
    const fieldCGeo = new THREE.BoxGeometry(22, 0.3, 11);
    const soilMatC = new THREE.MeshStandardMaterial({ color: 0x2e1d11, roughness: 0.9 });
    const fieldCMesh = new THREE.Mesh(fieldCGeo, soilMatC);
    fieldCMesh.position.set(8, 0.15, 8);
    fieldCMesh.receiveShadow = true;
    farmGroup.add(fieldCMesh);

    // Orchard Trees
    const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.2, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.9 });
    const foliageGeo = new THREE.SphereGeometry(1.0, 8, 8);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.8 });

    for (let x = 0; x <= 16; x += 4.5) {
      for (let z = 5; z <= 11; z += 4) {
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x, 0.8, z);
        trunk.castShadow = true;
        farmGroup.add(trunk);

        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.set(x, 2.0, z);
        foliage.scale.set(1, 0.9, 1);
        foliage.castShadow = true;
        farmGroup.add(foliage);
      }
    }

    // WATER IRRIGATION CANAL (Flowing blue stream between fields)
    const canalGeo = new THREE.BoxGeometry(2.4, 0.2, 34);
    const canalMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const canalMesh = new THREE.Mesh(canalGeo, canalMat);
    canalMesh.position.set(0, 0.12, 0);
    farmGroup.add(canalMesh);

    // CENTRAL SMART FARM BARN & SILO
    const barnGeo = new THREE.BoxGeometry(5.5, 3.2, 6.5);
    const barnMat = new THREE.MeshStandardMaterial({ color: 0x0f3824, roughness: 0.5 });
    const barn = new THREE.Mesh(barnGeo, barnMat);
    barn.position.set(-13, 1.6, 9);
    barn.castShadow = true;
    barn.receiveShadow = true;
    farmGroup.add(barn);

    // Barn Sloped Roof
    const roofGeo = new THREE.ConeGeometry(4.8, 1.8, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(-13, 4.0, 9);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    farmGroup.add(roof);

    // Solar Panel on Barn
    const solarGeo = new THREE.BoxGeometry(2.8, 0.1, 4.2);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.8, roughness: 0.2 });
    const solar = new THREE.Mesh(solarGeo, solarMat);
    solar.position.set(-13, 3.8, 9);
    solar.rotation.x = -0.3;
    farmGroup.add(solar);

    // Grain Silo (Metallic cylinder)
    const siloGeo = new THREE.CylinderGeometry(1.4, 1.4, 5.5, 16);
    const siloMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
    const silo = new THREE.Mesh(siloGeo, siloMat);
    silo.position.set(-8.5, 2.75, 10);
    silo.castShadow = true;
    farmGroup.add(silo);

    const siloDomeGeo = new THREE.SphereGeometry(1.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const siloDome = new THREE.Mesh(siloDomeGeo, siloMat);
    siloDome.position.set(-8.5, 5.5, 10);
    farmGroup.add(siloDome);

    // TRACTOR MODEL
    const tractorGroup = new THREE.Group();
    const chassisGeo = new THREE.BoxGeometry(1.8, 1.0, 2.8);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4, metalness: 0.3 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.8;
    chassis.castShadow = true;
    tractorGroup.add(chassis);

    // Cab
    const cabGeo = new THREE.BoxGeometry(1.5, 1.2, 1.4);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.2, metalness: 0.1 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 1.8, 0.4);
    tractorGroup.add(cab);

    // Wheels
    const bigWheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.45, 14);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const wR1 = new THREE.Mesh(bigWheelGeo, wheelMat);
    wR1.rotation.z = Math.PI / 2;
    wR1.position.set(1.0, 0.8, 0.6);
    tractorGroup.add(wR1);

    const wR2 = new THREE.Mesh(bigWheelGeo, wheelMat);
    wR2.rotation.z = Math.PI / 2;
    wR2.position.set(-1.0, 0.8, 0.6);
    tractorGroup.add(wR2);

    const smWheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 14);
    const wF1 = new THREE.Mesh(smWheelGeo, wheelMat);
    wF1.rotation.z = Math.PI / 2;
    wF1.position.set(0.9, 0.5, -0.9);
    tractorGroup.add(wF1);

    const wF2 = new THREE.Mesh(smWheelGeo, wheelMat);
    wF2.rotation.z = Math.PI / 2;
    wF2.position.set(-0.9, 0.5, -0.9);
    tractorGroup.add(wF2);

    tractorGroup.position.set(-1, 0, 4);
    tractorGroup.rotation.y = 0.4;
    farmGroup.add(tractorGroup);

    // WIND TURBINE
    const turbineGroup = new THREE.Group();
    const mastGeo = new THREE.CylinderGeometry(0.2, 0.4, 9, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.3 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.y = 4.5;
    mast.castShadow = true;
    turbineGroup.add(mast);

    const nacelleGeo = new THREE.BoxGeometry(0.6, 0.6, 1.2);
    const nacelle = new THREE.Mesh(nacelleGeo, mastMat);
    nacelle.position.set(0, 9, 0);
    turbineGroup.add(nacelle);

    const bladeGroup = new THREE.Group();
    bladeGroup.position.set(0, 9, 0.65);
    const bladeGeo = new THREE.ConeGeometry(0.25, 4.2, 4);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (b * Math.PI * 2) / 3;
      blade.position.y = 1.8 * Math.cos((b * Math.PI * 2) / 3);
      blade.position.x = -1.8 * Math.sin((b * Math.PI * 2) / 3);
      bladeGroup.add(blade);
    }
    turbineGroup.add(bladeGroup);
    turbineGroup.position.set(-18, 0, -12);
    farmGroup.add(turbineGroup);

    // IOT TELEMETRY POLE & SENSOR
    const iotPoleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.5, 6);
    const iotPoleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 });
    const iotPole = new THREE.Mesh(iotPoleGeo, iotPoleMat);
    iotPole.position.set(0, 1.75, -12);
    farmGroup.add(iotPole);

    const iotDishGeo = new THREE.CylinderGeometry(0.4, 0.1, 0.3, 10);
    const iotDishMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.4 });
    const iotDish = new THREE.Mesh(iotDishGeo, iotDishMat);
    iotDish.position.set(0, 3.6, -12);
    farmGroup.add(iotDish);

    // SENSOR PULSE RING
    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const pulseRing = new THREE.Mesh(ringGeo, ringMat);
    pulseRing.rotation.x = Math.PI / 2;
    pulseRing.position.set(0, 3.8, -12);
    farmGroup.add(pulseRing);

    // INTERACTIVE HOTSPOT PINS (Field A, Field B, IoT Center)
    const hotspots: { mesh: THREE.Group; id: string; data: any }[] = [];

    const createPin = (x: number, y: number, z: number, color: number, id: string, data: any) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(x, y, z);

      const pinHeadGeo = new THREE.SphereGeometry(0.45, 12, 12);
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHead.position.y = 1.0;
      pinGroup.add(pinHead);

      const pinStemGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 6);
      const pinStemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pinStem = new THREE.Mesh(pinStemGeo, pinStemMat);
      pinStem.position.y = 0.5;
      pinGroup.add(pinStem);

      farmGroup.add(pinGroup);
      hotspots.push({ mesh: pinGroup, id, data });
    };

    createPin(-10, 1.2, -6, 0x10b981, 'field-a', {
      title: 'Field A — North Plateau',
      crop: 'Tomato (Abhinav F1)',
      moisture: soilMoistureOverride,
      health: 'Optimal (94%)',
      ndvi: 0.84,
    });

    createPin(10, 1.2, -6, 0xf59e0b, 'field-b', {
      title: 'Field B — Canal Furrow',
      crop: 'Sweet Corn (Sugar 75)',
      moisture: 48,
      health: 'Moisture Deficit (72%)',
      ndvi: 0.72,
    });

    createPin(8, 1.2, 8, 0x0284c7, 'field-c', {
      title: 'Field C — Orchard Terraces',
      crop: 'Pomegranate (Bhagwa)',
      moisture: 71,
      health: 'Thriving (96%)',
      ndvi: 0.89,
    });

    // RAIN PARTICLES SYSTEM
    const rainCount = 1200;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPositions[i] = (Math.random() - 0.5) * 45;
      rainPositions[i + 1] = Math.random() * 30;
      rainPositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.25,
      transparent: true,
      opacity: 0.7,
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    rainSystem.visible = isRaining;
    scene.add(rainSystem);

    // FLOATING CLOUDS
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: isRaining ? 0x475569 : 0xffffff,
      roughness: 1.0,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < 6; i++) {
      const c = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5, 1), cloudMat);
      c.position.set((i - 2.5) * 8 + (Math.random() * 4 - 2), 16 + Math.random() * 3, -10 + i * 4);
      c.scale.set(1.4, 0.7, 1.0);
      cloudGroup.add(c);
    }
    scene.add(cloudGroup);

    // MOUSE INTERACTION & DRAG ROTATION
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.006;
      targetRotationX += deltaY * 0.003;
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // RAYCASTING FOR CLICKING PINS
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        hotspots.map((h) => h.mesh),
        true
      );

      if (intersects.length > 0) {
        const hit = intersects[0];
        // find which hotspot
        const found = hotspots.find((h) => {
          let p: THREE.Object3D | null = hit.object;
          while (p) {
            if (p === h.mesh) return true;
            p = p.parent;
          }
          return false;
        });

        if (found) {
          setSelectedHotspot(found.data);
          if (onSelectField) onSelectField(found.data.title);
        }
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onClick);

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Spin wind turbine
      bladeGroup.rotation.z += delta * 3.5;

      // Pulse ring at IoT dish
      const pulseScale = 1 + Math.sin(time * 3) * 0.35;
      pulseRing.scale.set(pulseScale, pulseScale, 1);

      // Float clouds
      cloudGroup.children.forEach((cloud, idx) => {
        cloud.position.x += delta * 0.4;
        if (cloud.position.x > 25) cloud.position.x = -25;
      });

      // Animate hotspots bobbing
      hotspots.forEach((h, idx) => {
        h.mesh.position.y = 1.2 + Math.sin(time * 2.5 + idx) * 0.2;
      });

      // Animate Rain
      if (rainSystem.visible) {
        const pos = rainGeo.attributes.position.array as Float32Array;
        for (let i = 1; i < rainCount * 3; i += 3) {
          pos[i] -= delta * 24;
          if (pos[i] < 0) {
            pos[i] = 25 + Math.random() * 5;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // Smooth auto-rotation or user drag
      if (!isDragging && isRotating) {
        targetRotationY += delta * 0.15;
      }

      farmGroup.rotation.y += (targetRotationY - farmGroup.rotation.y) * 0.08;
      farmGroup.rotation.x += (targetRotationX - farmGroup.rotation.x) * 0.08;

      // Water canal shimmer
      canalMat.opacity = 0.75 + Math.sin(time * 2) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, [soilMoistureOverride, isRaining, isRotating, interactive, onSelectField]);

  if (hasWebGlError) {
    return (
      <div ref={containerRef} className={`relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#0a2318] p-6 shadow-2xl flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-sm text-white">Live Farm Telemetry Map</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">2D Sensor Radar</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
              Rain: {rainProbabilityOverride}%
            </span>
            <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              Moisture: {soilMoistureOverride}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Plot Alpha — High Yield Block</span>
              <span className="text-emerald-400 font-semibold">NDVI 0.84</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Volumetric Moisture</span>
              <strong className="text-white">{soilMoistureOverride}%</strong>
            </div>
            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${soilMoistureOverride}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Plot Beta — Perimeter Furrow</span>
              <span className="text-sky-400 font-semibold">NDVI 0.79</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Volumetric Moisture</span>
              <strong className="text-white">{Math.max(20, soilMoistureOverride - 12)}%</strong>
            </div>
            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full transition-all" style={{ width: `${Math.max(20, soilMoistureOverride - 12)}%` }} />
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 border-t border-emerald-500/10 pt-3 flex items-center justify-between">
          <span>📡 Telemetry active • IoT solenoid valves synced with agronomic rule engine</span>
          <span className="text-emerald-400 font-medium">Auto-Irrigation Ready</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#06150f] shadow-2xl ${className}`}>
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Floating Header Badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>3D Digital Twin Farm Telemetry</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 text-xs">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>IoT Live Feed</span>
        </div>
      </div>

      {/* Controls Overlay (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRaining(!isRaining)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition backdrop-blur-md border ${
            isRaining
              ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sky-500/20 shadow-lg'
              : 'bg-black/60 border-white/10 text-slate-300 hover:bg-black/80'
          }`}
          title="Toggle Rain Simulation"
        >
          {isRaining ? <CloudRain className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          <span className="hidden sm:inline">{isRaining ? 'Rain Sim Active' : 'Clear Sky'}</span>
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-slate-300 transition"
          title={isRotating ? 'Pause Orbit' : 'Resume Orbit'}
        >
          {isRotating ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Selected Hotspot Holographic Card (Bottom Left) */}
      {selectedHotspot && (
        <div className="absolute bottom-3 left-3 z-10 max-w-xs w-full p-3.5 rounded-xl bg-[#0d2e20]/95 backdrop-blur-md border border-emerald-500/40 text-slate-100 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-2.5">
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">{selectedHotspot.title}</h4>
              <p className="text-[11px] text-emerald-400 font-medium">{selectedHotspot.crop}</p>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Moisture</span>
              <span className={`font-bold ${selectedHotspot.moisture < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {selectedHotspot.moisture}%
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block">NDVI</span>
              <span className="font-bold text-sky-400">{selectedHotspot.ndvi}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Status</span>
              <span className="font-semibold text-[11px] text-emerald-300 truncate block">
                {selectedHotspot.health ? selectedHotspot.health.split(' ')[0] : 'Active'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3D Interaction Hint (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 pointer-events-none">
        <span className="text-[11px] text-slate-400 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/5">
          🖱️ Click & Drag to Orbit • Click Markers for Telemetry
        </span>
      </div>
    </div>
  );
};
