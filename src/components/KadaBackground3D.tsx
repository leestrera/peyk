"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function BackgroundScene() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  // Generate random stable blocks
  const blocks = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      return {
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20 - 10, // Push into background
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        scale: Math.random() * 2 + 1,
        speed: (Math.random() - 0.5) * 0.01,
      };
    });
  }, []);

  // Generate frosted glass panels
  const glasses = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      return {
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 10 - 5,
        ] as [number, number, number],
        rotation: [
          (Math.random() - 0.5) * 0.2, // mostly upright
          (Math.random() - 0.5) * 0.2,
          0,
        ] as [number, number, number],
        width: Math.random() * 4 + 4,
        height: Math.random() * 6 + 4,
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Very slow ambient rotation for the whole group
      groupRef.current.rotation.y += delta * 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      
      // Tie group Y position to window scroll for parallax effect
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      
      // Target position incorporates both scroll and mouse hover!
      const targetX = mouse.current.x * 2;
      const targetY = (scrollY * 0.005) + (mouse.current.y * 2); 
      
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.05
      );
      
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Blocks */}
      {blocks.map((b, i) => (
        <Float key={`block-${i}`} speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={b.position} rotation={b.rotation} scale={b.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial 
              color="#0d0d10" 
              roughness={0.2} 
              metalness={0.8}
              clearcoat={0.5}
              clearcoatRoughness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Frosted Glass Panels */}
      {glasses.map((g, i) => (
        <Float key={`glass-${i}`} speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={g.position} rotation={g.rotation}>
            <boxGeometry args={[g.width, g.height, 0.1]} />
            <MeshTransmissionMaterial 
              samples={4}
              resolution={256}
              transmission={1} 
              roughness={0.2}
              thickness={0.5}
              ior={1.5}
              chromaticAberration={0.03}
              color="#ffffff"
            />
          </mesh>
        </Float>
      ))}
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
      
      {/* Warm Golden/Amber Accents */}
      <spotLight position={[-10, 0, 10]} intensity={50} color="#f59e0b" distance={30} angle={0.5} penumbra={1} />
      <pointLight position={[0, -10, -5]} intensity={20} color="#f59e0b" distance={30} />
    </group>
  );
}

export default function KadaBackground3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[#09090b]">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#09090b']} />
        
        {/* Adds realistic reflections to the metal and glass */}
        <Environment preset="studio" /> 
        
        <BackgroundScene />
      </Canvas>
    </div>
  );
}
