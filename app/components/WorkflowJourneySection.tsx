"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

// Workflow stations data
const workflowStations = [
  {
    id: "01",
    phase: "Discovery",
    title: "Understanding Your World",
    description: "We map your threat landscape, interview stakeholders, and analyze your existing infrastructure to uncover what matters most.",
    detail: "Deep reconnaissance of assets, attack surfaces, and business context."
  },
  {
    id: "02",
    phase: "Architecture",
    title: "Blueprint for Security",
    description: "We design a security framework tailored to your organization—structured, scalable, and aligned with your operational reality.",
    detail: "Clear documentation, risk prioritization, and strategic roadmap."
  },
  {
    id: "03",
    phase: "Development",
    title: "Building the Shield",
    description: "Our engineers implement secure solutions with clean code, robust APIs, and hardened configurations that stand up to scrutiny.",
    detail: "Continuous integration with security baked into every commit."
  },
  {
    id: "04",
    phase: "Offensive Testing",
    title: "Stress Under Fire",
    description: "We simulate real-world attacks—chaining exploits, escalating privileges, and testing your defenses under adversarial pressure.",
    detail: "Red team operations with full proof-of-concept documentation."
  },
  {
    id: "05",
    phase: "Launch",
    title: "Go Live with Confidence",
    description: "Final verification, monitoring integration, and smooth handoff. Your system goes online with zero downtime and full visibility.",
    detail: "Deployment assurance with ongoing support readiness."
  }
];

// ============================================================================
// WebGL CIRCUIT CANVAS - The living energy layer behind the stations
// ============================================================================
function CircuitCanvas({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // === SCENE ===
    const scene = new THREE.Scene();

    // === CAMERA ===
    const aspect = width / height;
    const frustumSize = 2;
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect,
      frustumSize * aspect,
      frustumSize,
      -frustumSize,
      0.1,
      100
    );
    camera.position.z = 10;

    // === SHARED UNIFORMS ===
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 }
    };

    // === BASE TRACE (dim, always visible - etched circuit) ===
    const traceWidth = isMobile ? 6 : 7;
    const traceGeometry = new THREE.PlaneGeometry(traceWidth, isMobile ? 0.01 : 0.012, isMobile ? 100 : 200, 1);
    
    const baseTraceMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          float pulse = sin(vUv.x * 50.0 - uTime * 0.4) * 0.5 + 0.5;
          float noise = random(vUv + uTime * 0.003) * 0.1;
          
          vec3 color = vec3(0.15, 0.4, 0.55);
          float edgeFade = 1.0 - pow(abs(vUv.y - 0.5) * 2.0, 2.0);
          float alpha = (0.1 + pulse * 0.04 + noise * 0.02) * edgeFade;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const baseTrace = new THREE.Mesh(traceGeometry, baseTraceMaterial);
    baseTrace.position.y = -0.75;
    scene.add(baseTrace);

    // === ACTIVE TRACE (fills with progress - bright energy) ===
    const activeTraceMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        
        void main() {
          if (vUv.x > uProgress) discard;
          
          // Gradient cyan -> purple
          vec3 startColor = vec3(0.0, 0.85, 1.0);
          vec3 endColor = vec3(0.65, 0.15, 1.0);
          vec3 color = mix(startColor, endColor, vUv.x);
          
          // Energy wave
          float wave = sin(vUv.x * 60.0 - uTime * 4.0) * 0.25 + 0.75;
          float edgeFade = 1.0 - pow(abs(vUv.y - 0.5) * 2.0, 1.2);
          
          // Brighten leading edge
          float leadingEdge = smoothstep(uProgress - 0.04, uProgress, vUv.x);
          color = mix(color, vec3(1.0), leadingEdge * 0.7);
          
          float alpha = wave * edgeFade * 0.9 + leadingEdge * 0.5;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const activeTrace = new THREE.Mesh(traceGeometry.clone(), activeTraceMaterial);
    activeTrace.position.y = -0.75;
    activeTrace.position.z = 0.01;
    scene.add(activeTrace);

    // === GLOW LAYER (bloom behind trace) ===
    const glowGeometry = new THREE.PlaneGeometry(traceWidth, 0.18, 200, 1);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        
        void main() {
          if (vUv.x > uProgress + 0.015) discard;
          
          float centerDist = abs(vUv.y - 0.5) * 2.0;
          float bloom = exp(-centerDist * centerDist * 5.0);
          
          vec3 color = vec3(0.25, 0.55, 0.95);
          color.r += sin(vUv.x * 10.0 + uTime * 0.6) * 0.12;
          color.b += cos(vUv.x * 10.0 + uTime * 0.6) * 0.12;
          
          float alpha = bloom * 0.28 * smoothstep(0.0, 0.08, uProgress);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = -0.75;
    glow.position.z = -0.01;
    scene.add(glow);

    // === STATION NODES (5 nodes along the path) ===
    const stationCount = workflowStations.length;
    const stationMeshes: { ring: THREE.Mesh; core: THREE.Mesh; index: number }[] = [];
    
    for (let i = 0; i < stationCount; i++) {
      const xPos = -traceWidth / 2 + (i / (stationCount - 1)) * traceWidth;
      
      // Outer ring
      const ringGeo = new THREE.RingGeometry(0.035, 0.05, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2288aa,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(xPos, -0.75, 0.02);
      scene.add(ring);
      
      // Inner core
      const coreGeo = new THREE.CircleGeometry(0.022, 32);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x1a3344,
        transparent: true,
        opacity: 0.4
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(xPos, -0.75, 0.025);
      scene.add(core);
      
      stationMeshes.push({ ring, core, index: i });
    }

    // === TRAVELING SPARK ===
    const sparkGeo = new THREE.CircleGeometry(0.025, 32);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.set(-traceWidth / 2, -0.75, 0.03);
    scene.add(spark);

    // Spark halo
    const haloGeo = new THREE.CircleGeometry(0.07, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x55ddff,
      transparent: true,
      opacity: 0.35
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(-traceWidth / 2, -0.75, 0.028);
    scene.add(halo);

    // === PARTICLES (trailing sparks) ===
    // Reduce particle count on mobile for performance
    const particleCount = isMobile ? 25 : 50;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; life: number }[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = -traceWidth / 2;
      particlePositions[i * 3 + 1] = -0.75;
      particlePositions[i * 3 + 2] = 0.035;
      particleVelocities.push({ x: 0, y: 0, life: 0 });
    }
    
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMat = new THREE.PointsMaterial({
      color: 0x66ddff,
      size: 0.012,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // === DIGITAL FOG (background depth) ===
    const fogGeo = new THREE.PlaneGeometry(traceWidth * 1.5, 3.5, 1, 1);
    const fogMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 3; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 st = vUv * 2.5;
          st.x += uTime * 0.012;
          st.y += uTime * 0.006;
          
          float n = fbm(st);
          vec3 color = vec3(0.04, 0.08, 0.12);
          float alpha = n * 0.055 * uProgress;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const fog = new THREE.Mesh(fogGeo, fogMat);
    fog.position.z = -0.15;
    scene.add(fog);

    // === RESIZE HANDLER ===
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const newWidth = canvasRef.current.clientWidth || window.innerWidth;
      const newHeight = canvasRef.current.clientHeight || window.innerHeight;
      const newAspect = newWidth / newHeight;

      camera.left = -frustumSize * newAspect;
      camera.right = frustumSize * newAspect;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // === ANIMATION LOOP ===
    const animate = () => {
      timeRef.current += 0.016;
      uniforms.uTime.value = timeRef.current;
      uniforms.uProgress.value = progressRef.current;

      const currentProgress = progressRef.current;
      
      // Update spark position along the trace
      const sparkX = -traceWidth / 2 + currentProgress * traceWidth;
      spark.position.x = sparkX;
      halo.position.x = sparkX;
      
      // Pulse effect on spark
      const pulse = 1 + Math.sin(timeRef.current * 10) * 0.15;
      spark.scale.setScalar(pulse);
      halo.scale.setScalar(pulse * 1.3);
      haloMat.opacity = 0.25 + Math.sin(timeRef.current * 7) * 0.12;

      // Update particles (trail behind spark)
      const positions = particleGeo.getAttribute('position');
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        
        if (vel.life <= 0 && Math.random() < 0.12 && currentProgress > 0.01) {
          positions.setX(i, sparkX + (Math.random() - 0.5) * 0.015);
          positions.setY(i, -0.75);
          positions.setZ(i, 0.035);
          vel.x = (Math.random() - 0.5) * 0.008 - 0.004;
          vel.y = (Math.random() - 0.5) * 0.012;
          vel.life = 0.4 + Math.random() * 0.4;
        } else if (vel.life > 0) {
          positions.setX(i, positions.getX(i) + vel.x);
          positions.setY(i, positions.getY(i) + vel.y);
          vel.life -= 0.016;
          vel.y += 0.0002;
        }
      }
      positions.needsUpdate = true;

      // Update station nodes based on progress
      for (const { ring, core, index } of stationMeshes) {
        const stationProgress = index / (stationCount - 1);
        const isPowered = currentProgress >= stationProgress;
        const isActive = Math.abs(currentProgress - stationProgress) < 0.06;
        
        const ringMaterial = ring.material as THREE.MeshBasicMaterial;
        const coreMaterial = core.material as THREE.MeshBasicMaterial;
        
        if (isActive) {
          coreMaterial.color.setRGB(1, 1, 1);
          coreMaterial.opacity = 0.95;
          core.scale.setScalar(1.4 + Math.sin(timeRef.current * 6) * 0.12);
          ringMaterial.color.setRGB(0.4, 0.9, 1);
          ringMaterial.opacity = 0.7;
        } else if (isPowered) {
          coreMaterial.color.setRGB(0.25, 0.85, 1);
          coreMaterial.opacity = 0.75;
          core.scale.setScalar(1.15);
          ringMaterial.color.setRGB(0.3, 0.75, 0.95);
          ringMaterial.opacity = 0.55;
        } else {
          coreMaterial.color.setRGB(0.12, 0.25, 0.35);
          coreMaterial.opacity = 0.35;
          core.scale.setScalar(1);
          ringMaterial.color.setRGB(0.15, 0.35, 0.45);
          ringMaterial.opacity = 0.18;
        }
      }

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update progress ref for animation loop
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ============================================================================
// HUD - Minimal progress indicator
// ============================================================================
function ProgressHUD({ progress, activeStation }: { progress: number; activeStation: number }) {
  const station = workflowStations[activeStation];
  const percent = Math.round(progress * 100);

  return (
    <div className="absolute top-16 left-4 md:top-24 md:left-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 z-20">
      <div className="flex items-center gap-2">
        <span className="text-[9px] md:text-xs font-mono text-cyan-400/90 tracking-[0.2em]">
          {station?.id || "01"}
        </span>
        <div className="w-px h-2.5 bg-cyan-400/40" />
        <span className="text-[11px] md:text-sm font-light text-white/75 tracking-wide">
          {station?.phase || "Discovery"}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative w-12 md:w-20 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[9px] md:text-[10px] font-mono text-white/35 tabular-nums w-7">
          {percent}%
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// STATION COMPONENT - Individual workflow step
// ============================================================================
function Station({
  station,
  index,
  isActive,
  isPowered,
}: {
  station: typeof workflowStations[0];
  index: number;
  isActive: boolean;
  isPowered: boolean;
}) {
  return (
    <div
      className="flex-shrink-0 h-full flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24"
      style={{ zIndex: 10, width: '100vw', minWidth: '100vw' }}
    >
      <motion.div
        className="max-w-xl lg:max-w-2xl w-full"
        initial={false}
        animate={{
          opacity: isActive ? 1 : isPowered ? 0.35 : 0.12,
          scale: isActive ? 1 : 0.94,
          x: isActive ? 0 : isPowered ? -15 : 15,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Phase label */}
        <div className="flex items-center gap-2 mb-3 md:mb-5">
          <span className="text-[9px] md:text-xs font-mono tracking-[0.25em] text-cyan-400/75">
            {station.id}
          </span>
          <div className="w-4 md:w-6 h-px bg-cyan-400/45" />
          <span className="text-[9px] md:text-xs tracking-[0.12em] text-white/45 uppercase">
            {station.phase}
          </span>
          
          {/* Powered dot */}
          {isPowered && !isActive && (
            <div 
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-1.5"
              style={{ boxShadow: '0 0 6px rgba(34, 211, 238, 0.75)' }}
            />
          )}
        </div>

        {/* Title */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1] mb-3 md:mb-5 font-[family-name:var(--font-space-grotesk)]">
          {station.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/55 leading-relaxed mb-2.5 md:mb-4 max-w-lg">
          {station.description}
        </p>

        {/* Detail (visible when active) */}
        <motion.p
          className="text-xs md:text-sm text-cyan-400/65 font-light tracking-wide leading-relaxed"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.25, delay: isActive ? 0.15 : 0 }}
        >
          {station.detail}
        </motion.p>

        {/* Launch special badge */}
        {index === 4 && isActive && (
          <motion.div
            className="mt-4 md:mt-6 inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-cyan-500/10 border border-cyan-400/25 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.35 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
            </span>
            <span className="text-[9px] md:text-xs font-mono text-cyan-400 tracking-wider">
              SYSTEM ONLINE • ZERO DOWNTIME
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ============================================================================
// STATION DOTS - Bottom navigation indicator
// ============================================================================
function StationDots({ activeStation, progress }: { activeStation: number; progress: number }) {
  return (
    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-3 z-20">
      {workflowStations.map((_, index) => {
        const stationProgress = index / (workflowStations.length - 1);
        const isPowered = progress >= stationProgress;
        const isActive = activeStation === index;
        
        return (
          <div key={index} className="flex items-center gap-1.5 md:gap-3">
            <motion.div
              className="w-2 h-2 rounded-full"
              initial={false}
              animate={{
                scale: isActive ? 1.4 : 1,
                backgroundColor: isActive 
                  ? 'rgb(34, 211, 238)' 
                  : isPowered 
                    ? 'rgba(34, 211, 238, 0.45)' 
                    : 'rgba(255, 255, 255, 0.12)',
                boxShadow: isActive 
                  ? '0 0 10px rgba(34, 211, 238, 0.85)' 
                  : 'none'
              }}
              transition={{ duration: 0.25 }}
            />
            {index < workflowStations.length - 1 && (
              <div className="w-4 md:w-6 h-px bg-white/8 hidden sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT - Pinned horizontal scroll journey
// ============================================================================
export default function WorkflowJourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStation, setActiveStation] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const stationCount = workflowStations.length;

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ===========================
  // MANUAL SCROLL HANDLING
  // More reliable than sticky for complex layouts
  // ===========================
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate the scroll range for this section
      const scrollStart = sectionTop;
      const scrollEnd = sectionTop + sectionHeight - viewportHeight;
      const scrollRange = scrollEnd - scrollStart;

      // Check if we're in the pinned zone
      const inPinnedZone = scrollY >= scrollStart && scrollY <= scrollEnd;
      setIsInView(inPinnedZone);

      if (inPinnedZone && scrollRange > 0) {
        // Calculate progress (0 to 1) through the section
        const progress = Math.max(0, Math.min(1, (scrollY - scrollStart) / scrollRange));
        setProgressValue(progress);

        // Calculate horizontal translation
        const totalTranslate = (stationCount - 1) * window.innerWidth;
        setTranslateX(-progress * totalTranslate);

        // Calculate active station
        const stationIndex = Math.min(
          Math.floor(progress * stationCount + 0.1),
          stationCount - 1
        );
        setActiveStation(Math.max(0, stationIndex));
      } else if (scrollY < scrollStart) {
        // Before section
        setProgressValue(0);
        setTranslateX(0);
        setActiveStation(0);
      } else if (scrollY > scrollEnd) {
        // After section
        setProgressValue(1);
        setTranslateX(-(stationCount - 1) * window.innerWidth);
        setActiveStation(stationCount - 1);
      }
    };

    // Initial call
    handleScroll();

    // Use passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [stationCount]);

  // Calculate the fixed position offset when pinned
  const sectionTop = sectionRef.current?.offsetTop || 0;

  return (
    <section
      ref={sectionRef}
      className="relative"
      // SCROLL RUNWAY: Section height = number of stations × viewport height
      style={{ height: `${stationCount * 100}vh` }}
    >
      {/* ================================
          PINNED VIEWPORT
          Uses fixed positioning when in scroll range
          ================================ */}
      <div 
        className="w-full h-screen overflow-hidden bg-slate-950"
        style={{
          position: isInView ? 'fixed' : 'absolute',
          top: isInView ? 0 : undefined,
          bottom: !isInView && progressValue >= 1 ? 0 : undefined,
          left: 0,
          right: 0,
        }}
      >
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* ================================
            WEBGL CIRCUIT LAYER
            ================================ */}
        {!reducedMotion && (
          <CircuitCanvas progress={progressValue} />
        )}

        {/* Reduced motion fallback */}
        {reducedMotion && (
          <div 
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent"
            style={{ bottom: '25%' }}
          />
        )}

        {/* Section Title - Our Workflow */}
        <div
          className="absolute top-16 md:top-24 right-4 md:right-8 z-20 transition-opacity duration-500"
          style={{ opacity: progressValue < 0.15 ? 1 : 0 }}
        >
          <h2 className="text-lg md:text-2xl lg:text-3xl font-light text-white/90 tracking-wide font-[family-name:var(--font-space-grotesk)]">
            Our Workflow
          </h2>
        </div>

        {/* HUD Progress Indicator */}
        <ProgressHUD progress={progressValue} activeStation={activeStation} />

        {/* ================================
            HORIZONTAL TRACK
            ================================ */}
        <div
          className="absolute top-0 left-0 h-full flex flex-nowrap"
          style={{ 
            transform: `translateX(${translateX}px)`,
            width: `${stationCount * 100}vw`,
            willChange: 'transform'
          }}
        >
          {workflowStations.map((station, index) => {
            const stationProgress = index / (stationCount - 1);
            return (
              <Station
                key={station.id}
                station={station}
                index={index}
                isActive={activeStation === index}
                isPowered={progressValue >= stationProgress}
              />
            );
          })}
        </div>

        {/* Station navigation dots */}
        <StationDots activeStation={activeStation} progress={progressValue} />

        {/* Scroll hint */}
        <div
          className="absolute bottom-4 right-4 md:bottom-6 md:right-8 flex items-center gap-1 md:gap-2 text-white/25 z-20 transition-opacity duration-300"
          style={{ opacity: progressValue < 0.04 ? 1 : 0 }}
        >
          <span className="text-[9px] md:text-xs tracking-wider">Scroll to explore</span>
          <span className="text-xs md:text-sm animate-bounce">↓</span>
        </div>
      </div>
    </section>
  );
}
