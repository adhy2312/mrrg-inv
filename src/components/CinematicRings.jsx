import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sparkles, Lightformer, Float } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function SolidGoldRing({ ringRef }) {
  return (
    <group ref={ringRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
        <mesh>
          <torusGeometry args={[1.5, 0.25, 32, 64]} />
          <meshStandardMaterial 
            color="#d4af37" 
            metalness={1} 
            roughness={0.12} 
            envMapIntensity={2.5} 
          />
        </mesh>
      </Float>
    </group>
  );
}

function DiamondRing({ ringRef }) {
  return (
    <group ref={ringRef}>
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.2}>
        {/* Band */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.3, 0.18, 32, 64]} />
          <meshStandardMaterial 
            color="#f5e0a3" 
            metalness={1} 
            roughness={0.1} 
            envMapIntensity={3} 
          />
        </mesh>
        {/* Diamond Base (Setting) */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.3, 0.15, 0.4, 8]} />
          <meshStandardMaterial color="#f5e0a3" metalness={1} roughness={0.1} />
        </mesh>
        {/* The Diamond */}
        <mesh position={[0, 1.6, 0]}>
          <octahedronGeometry args={[0.4, 0]} />
          {/* Using standard material with high envMapIntensity to simulate diamond refraction for performance */}
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.95} 
            roughness={0} 
            envMapIntensity={6}
          />
        </mesh>
      </Float>
    </group>
  );
}

function RingsScene() {
  const groomRef = useRef();
  const brideRef = useRef();
  const glowRef = useRef();
  const sparklesRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const startX = isMobile ? 2.2 : 5.0; // Pushed further apart at the start
      const midX = isMobile ? 1.5 : 2.5;

      // Initial Setup: Lowered Y positions so they are visible immediately at the top
      gsap.set(groomRef.current.position, { x: -startX, y: 3.5, z: -2 });
      gsap.set(brideRef.current.position, { x: startX, y: 3, z: -4 });
      gsap.set(groomRef.current.rotation, { x: 0.5, y: -0.5, z: 0 });
      gsap.set(brideRef.current.rotation, { x: 1, y: 0.5, z: 0 });
      gsap.set(glowRef.current.scale, { x: 0, y: 0, z: 0 });
      gsap.set(glowRef.current.material, { opacity: 0 });
      
      if (sparklesRef.current) {
        gsap.set(sparklesRef.current, { visible: false });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // High scrub value to absorb harsh mouse-wheel ticks and create a buttery glide
        }
      });

      // Phase 1: Descending through the invitation
      tl.to(groomRef.current.position, { x: -midX, y: 0, z: 1, ease: "power1.inOut" }, 0);
      tl.to(brideRef.current.position, { x: midX, y: -1, z: 0, ease: "power1.inOut" }, 0);
      
      tl.to(groomRef.current.rotation, { x: 2, y: 1, z: 1, ease: "none" }, 0);
      tl.to(brideRef.current.rotation, { x: 2.5, y: -1, z: 0.5, ease: "none" }, 0);

      // Phase 2: Interlocking Climax (at the very bottom in the dedicated empty space)
      tl.to(groomRef.current.position, { x: -0.8, y: -4.5, z: 0, ease: "power2.inOut" }, 0.85);
      tl.to(brideRef.current.position, { x: 0.8, y: -4.5, z: 0, ease: "power2.inOut" }, 0.85);
      
      tl.to(groomRef.current.rotation, { x: 0, y: 0.5, z: 0, ease: "power2.inOut" }, 0.85);
      tl.to(brideRef.current.rotation, { x: 0.3, y: 0.5, z: 0.2, ease: "power2.inOut" }, 0.85);

      // Glow Bloom at Climax
      tl.to(glowRef.current.scale, { x: 6, y: 6, z: 6, ease: "power2.out" }, 0.95);
      tl.to(glowRef.current.material, { opacity: 0.4, ease: "power2.out" }, 0.95);
      
      // Show Sparkles
      tl.call(() => {
         if (sparklesRef.current) sparklesRef.current.visible = true;
      }, null, 0.95);
    });

    return () => ctx.revert(); // Official GSAP way to cleanly kill everything
  }, []);

  return (
    <>
      {/* Custom Environment to avoid HDR download hangs that cause Suspense to stay blank forever */}
      <Environment resolution={128} frames={1}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#fdfbf8" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
      
      <SolidGoldRing ringRef={groomRef} />
      <DiamondRing ringRef={brideRef} />

      {/* Climax Glow */}
      <mesh ref={glowRef} position={[0, -2.5, -1]}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial color="#f5e0a3" transparent opacity={0} depthWrite={false} />
      </mesh>
      
      <group ref={sparklesRef} position={[0, -2.5, 0]} visible={false}>
         <Sparkles count={50} scale={5} size={4} speed={0.4} color="#f5e0a3" opacity={0.6} />
      </group>
    </>
  );
}

export default function CinematicRings() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none', 
      zIndex: 5 // Behind bento boxes (z:10) but above background
    }}>
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <RingsScene />
          <ambientLight intensity={1.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
