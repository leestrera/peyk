import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TemplateArchitecture3DProps {
  activeTheme: string;
}

// A single floating UI wireframe (Template)
function HolographicTemplate({ position, rotation, scale, color, type }: any) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create geometry based on template type
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 0.05);
    return new THREE.EdgesGeometry(geo);
  }, []);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: 0.4,
      blending: THREE.AdditiveBlending 
    });
  }, [color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow, elegant floating rotation
    groupRef.current.rotation.y += 0.001;
    groupRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 0.5) * 0.0005;
    groupRef.current.position.y += Math.cos(state.clock.elapsedTime * 0.5) * 0.002;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <lineSegments geometry={geometry} material={material} />
      
      {/* Inner UI Elements (Wireframe) */}
      {type === 'hero' && (
        <group position={[0, 0, 0.05]}>
          {/* Header */}
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.1, 0.01))} material={material} position={[0, 0.4, 0]} />
          {/* Main Image */}
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.4, 0.01))} material={material} position={[0, 0.1, 0]} />
          {/* Text blocks */}
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, 0.05, 0.01))} material={material} position={[-0.15, -0.2, 0]} />
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.4, 0.05, 0.01))} material={material} position={[-0.25, -0.3, 0]} />
        </group>
      )}

      {type === 'bento' && (
        <group position={[0, 0, 0.05]}>
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.4, 0.01))} material={material} position={[0, 0.25, 0]} />
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.425, 0.4, 0.01))} material={material} position={[-0.2375, -0.25, 0]} />
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.425, 0.4, 0.01))} material={material} position={[0.2375, -0.25, 0]} />
        </group>
      )}

      {type === 'sidebar' && (
        <group position={[0, 0, 0.05]}>
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.25, 0.9, 0.01))} material={material} position={[-0.325, 0, 0]} />
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, 0.9, 0.01))} material={material} position={[0.15, 0, 0]} />
        </group>
      )}
    </group>
  );
}

function HologramScene({ activeTheme }: { activeTheme: string }) {
  const themeColor = useMemo(() => {
    switch (activeTheme) {
      case "cafe": return new THREE.Color("#f59e0b");   // Amber
      case "resort": return new THREE.Color("#0ea5e9"); // Sky
      case "vet": return new THREE.Color("#10b981");    // Emerald
      case "title":
      default: return new THREE.Color("#f4f4f5");       // White/Zinc
    }
  }, [activeTheme]);

  // Generate a fixed set of floating templates
  const templates = useMemo(() => {
    return [
      { id: 1, pos: [-4, 1, -5], rot: [0, Math.PI / 6, 0], scale: 3, type: 'hero' },
      { id: 2, pos: [4, -1, -8], rot: [0, -Math.PI / 4, 0], scale: 4, type: 'bento' },
      { id: 3, pos: [0, -3, -12], rot: [Math.PI / 8, 0, 0], scale: 5, type: 'sidebar' },
      { id: 4, pos: [-6, -4, -15], rot: [0, Math.PI / 3, 0], scale: 6, type: 'hero' },
      { id: 5, pos: [6, 3, -10], rot: [0, -Math.PI / 6, 0], scale: 3.5, type: 'sidebar' },
    ];
  }, []);

  useFrame((state) => {
    // Parallax camera movement based on mouse
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseX * 5, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseY * 5, 0.02);
    state.camera.lookAt(0, 0, -10);
  });

  return (
    <>
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 5, 25]} />
      
      {templates.map((t) => (
        <HolographicTemplate 
          key={t.id} 
          position={t.pos} 
          rotation={t.rot} 
          scale={t.scale} 
          color={themeColor} 
          type={t.type} 
        />
      ))}

      {/* Subtle floor grid for architectural grounding */}
      <gridHelper args={[50, 50, themeColor, themeColor]} position={[0, -5, -10]} />
    </>
  );
}

export default function TemplateArchitecture3D({ activeTheme }: TemplateArchitecture3DProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#050507]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <HologramScene activeTheme={activeTheme} />
      </Canvas>
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{
        background: 'radial-gradient(circle at center, transparent 0%, rgba(5, 5, 7, 0.7) 60%, #050507 100%)'
      }} />
    </div>
  );
}
