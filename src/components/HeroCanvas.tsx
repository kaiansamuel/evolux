import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

interface HeroCanvasProps {
  onCoreClick?: () => void;
  onMouseMove?: (x: number, y: number) => void;
}

const HeroCanvas = ({ onCoreClick, onMouseMove }: HeroCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = {
      colors: {
        bg: 0x000000,
        primary: 0xa3e635,
        secondary: 0xd9f99d,
      }
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.colors.bg);
    scene.fog = new THREE.FogExp2(config.colors.bg, 0.035);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Core
    const geometryCore = new THREE.IcosahedronGeometry(2, 10);
    const materialCore = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0.8,
      roughness: 0.2,
      transmission: 0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: config.colors.primary,
      emissiveIntensity: 0.1
    });
    const sphereCore = new THREE.Mesh(geometryCore, materialCore);
    mainGroup.add(sphereCore);

    // Wireframe
    const geometryWire = new THREE.IcosahedronGeometry(2.2, 2);
    const materialWire = new THREE.MeshBasicMaterial({
      color: config.colors.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const sphereWire = new THREE.Mesh(geometryWire, materialWire);
    mainGroup.add(sphereWire);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: config.colors.primary,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Explosion system
    const explosionCount = 5000;
    const explosionGeo = new THREE.BufferGeometry();
    const initialPos = new Float32Array(explosionCount * 3);
    const targetPos = new Float32Array(explosionCount * 3);
    const currentPos = new Float32Array(explosionCount * 3);

    for (let i = 0; i < explosionCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / explosionCount);
      const theta = Math.sqrt(explosionCount * Math.PI) * phi;
      const r = 2.0;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      initialPos[i * 3] = x;
      initialPos[i * 3 + 1] = y;
      initialPos[i * 3 + 2] = z;
      currentPos[i * 3] = x;
      currentPos[i * 3 + 1] = y;
      currentPos[i * 3 + 2] = z;

      const dir = new THREE.Vector3(x, y, z).normalize();
      const dist = 2.0 + Math.random() * 6.0;
      targetPos[i * 3] = dir.x * dist;
      targetPos[i * 3 + 1] = dir.y * dist;
      targetPos[i * 3 + 2] = dir.z * dist;
    }

    explosionGeo.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
    const explosionMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: config.colors.primary,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const explosionSystem = new THREE.Points(explosionGeo, explosionMaterial);
    explosionSystem.visible = false;
    mainGroup.add(explosionSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const light1 = new THREE.PointLight(config.colors.primary, 400);
    light1.position.set(4, 2, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(config.colors.secondary, 400);
    light2.position.set(-4, -2, 2);
    scene.add(light2);

    // Post processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.strength = 1.0;
    bloomPass.radius = 0.5;
    bloomPass.threshold = 0.1;
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Interactions
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isHovered = false;
    let isAnimating = false;
    const animState = { progress: 0 };

    function updateExplosion() {
      const positions = explosionGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < explosionCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;
        positions[ix] = initialPos[ix] + (targetPos[ix] - initialPos[ix]) * animState.progress;
        positions[iy] = initialPos[iy] + (targetPos[iy] - initialPos[iy]) * animState.progress;
        positions[iz] = initialPos[iz] + (targetPos[iz] - initialPos[iz]) * animState.progress;
        if (animState.progress > 0.01) {
          const angle = animState.progress * 0.5;
          const x = positions[ix];
          const z = positions[iz];
          positions[ix] = x * Math.cos(angle) - z * Math.sin(angle);
          positions[iz] = x * Math.sin(angle) + z * Math.cos(angle);
        }
      }
      explosionGeo.attributes.position.needsUpdate = true;
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;

      const xVal = (event.clientX / window.innerWidth).toFixed(2);
      const yVal = (event.clientY / window.innerHeight).toFixed(2);
      onMouseMove?.(parseFloat(xVal), parseFloat(yVal));

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(sphereCore);

      if (intersects.length > 0) {
        if (!isHovered) {
          document.body.style.cursor = 'pointer';
          gsap.to(sphereWire.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.5 });
          gsap.to(sphereCore.material, { emissiveIntensity: 0.2, duration: 0.3 });
          isHovered = true;
        }
      } else {
        if (isHovered) {
          document.body.style.cursor = 'default';
          gsap.to(sphereWire.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
          gsap.to(sphereCore.material, { emissiveIntensity: 0.1, duration: 0.3 });
          isHovered = false;
        }
      }
    };

    const handleClick = () => {
      if (isHovered && !isAnimating) {
        isAnimating = true;
        onCoreClick?.();

        gsap.to([sphereCore.material, sphereWire.material], {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            sphereCore.visible = false;
            sphereWire.visible = false;
          }
        });

        explosionSystem.visible = true;
        gsap.to(explosionMaterial, { opacity: 1, duration: 0.1 });

        gsap.to(animState, {
          progress: 1,
          duration: 1.5,
          ease: "power4.out",
          onUpdate: updateExplosion,
          onComplete: () => {
            gsap.to(animState, {
              progress: 0,
              duration: 2,
              delay: 0.2,
              ease: "elastic.out(1, 0.5)",
              onUpdate: updateExplosion,
              onComplete: () => {
                sphereCore.visible = true;
                sphereWire.visible = true;
                gsap.to(explosionMaterial, { opacity: 0, duration: 0.3 });
                gsap.to([sphereCore.material, sphereWire.material], { opacity: 1, duration: 0.5 });
                sphereWire.material.opacity = 0.15;
                explosionSystem.visible = false;
                isAnimating = false;
              }
            });
          }
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const clock = new THREE.Clock();
    let animFrameId: number;

    function animate() {
      const elapsedTime = clock.getElapsedTime();
      const targetX = mouseX * 0.001;
      const targetY = mouseY * 0.001;

      if (!isAnimating || animState.progress < 0.5) {
        mainGroup.rotation.y += 0.002;
        mainGroup.rotation.x += 0.001;
      }
      mainGroup.rotation.y += 0.05 * (targetX - mainGroup.rotation.y);
      mainGroup.rotation.x += 0.05 * (targetY - mainGroup.rotation.x);

      if (!isAnimating) {
        const scale = 1 + Math.sin(elapsedTime * 2) * 0.02;
        sphereWire.scale.set(scale, scale, scale);
      }

      light1.position.x = Math.sin(elapsedTime * 0.7) * 4;
      light1.position.y = Math.cos(elapsedTime * 0.5) * 4;
      light2.position.x = Math.cos(elapsedTime * 0.3) * 5;
      light2.position.z = Math.sin(elapsedTime * 0.5) * 5;

      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = -mouseY * 0.0002;

      composer.render();
      animFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Entry animation
    const tl = gsap.timeline();
    tl.from(sphereCore.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "elastic.out(1, 0.7)" })
      .from(sphereWire.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "elastic.out(1, 0.7)" }, "<");

    animate();

    cleanupRef.current = () => {
      cancelAnimationFrame(animFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full outline-none cursor-grab active:cursor-grabbing"
    />
  );
};

export default HeroCanvas;
