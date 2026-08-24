"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Airplane3D({ isForward }: { isForward: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/airplane.glb');
  const [scale, setScale] = useState(1);
  
  // 0 points right, Math.PI points left (we will adjust if the model's base rotation is different)
  const targetRotationY = isForward ? 0.001 : Math.PI;

  useEffect(() => {
    // Automatically calculate the model's bounding box and scale it to fit nicely!
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Target size ~3 units to fit our camera view
    if (maxDim > 0) {
      setScale(3 / maxDim);
    }

    // Apply the Obsidian Luxury material to all meshes in the downloaded model
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#09090b",
          roughness: 0.15,
          metalness: 0.9,
        });
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smooth turn (detached from scroll speed, so no backflips!)
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      6,
      delta
    );
    
    // Aerodynamic Banking: Roll the plane on its X axis based on turning velocity
    let diff = targetRotationY - groupRef.current.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      diff * 0.8, // Roll intensity
      6,
      delta
    );
  });

  return (
    <group ref={groupRef} scale={scale} position={[0, -0.5, 0]}>
      <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* The GLB points UP (-Z) by default. Rotate it -90deg so it points RIGHT (+X) */}
        <group rotation={[0, -Math.PI / 2, 0]}>
          <primitive object={scene} />
        </group>
      </Float>
    </group>
  );
}
useGLTF.preload('/airplane.glb');

export default function CloudTransition() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textCoverRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const planeIconRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [isForward, setIsForward] = useState(true);
  const isForwardRef = useRef(true);
  const [canvasVisible, setCanvasVisible] = useState(false);

  // Pause the Three.js render loop when the canvas is off-screen
  useEffect(() => {
    const el = canvasWrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasVisible(entry.isIntersecting),
      { rootMargin: '200px' } // Start rendering slightly before it enters view
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!spacerRef.current || !wrapperRef.current || !textCoverRef.current || !planeRef.current || !planeIconRef.current) return;

    // Master Scroll-tied Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerRef.current,
        start: "top top", // Trigger exactly when overlapping the sticky section
        end: "bottom top",   
        scrub: true,
        onUpdate: (self) => {
          if (!planeIconRef.current) return;
          // Determine flight direction based on scroll direction (1 = down/forward, -1 = up/backward)
          const currentForward = self.direction === 1;
          
          // Only trigger a React state update if the direction actually changes
          if (currentForward !== isForwardRef.current) {
            isForwardRef.current = currentForward;
            setIsForward(currentForward);
          }
          
          // Smooth shift for the DOM anchor so the physical tail glides into place without teleporting
          gsap.to(planeIconRef.current, {
            xPercent: currentForward ? 0 : -100,
            duration: 0.5,
            ease: "power2.out"
          });
        }
      }
    });

    // We build the timeline with an arbitrary total duration of "10" 
    // to easily do the math for the 3 distinct phases.

    // 0. INITIALIZE ALL STATES 
    // Using .set instead of overlapping .fromTo prevents GSAP scrub lockups!
    gsap.set(wrapperRef.current, { x: "120vw" });
    gsap.set(planeRef.current, { opacity: 0, left: "0%" });
    gsap.set(textCoverRef.current, { width: "calc(100% + 15vw)", xPercent: 0 });

    // ---------------------------------------------------------
    // PHASE 1: CLOUD SWEEPS IN (Time 0 to 3)
    // ---------------------------------------------------------
    tl.to(wrapperRef.current, { x: "-100vw", ease: "none", duration: 3 }, 0);

    // ---------------------------------------------------------
    // PHASE 2: THE "STICKY" HOLD & SKYWRITE (Time 3 to 7)
    // ---------------------------------------------------------
    // Hold the cloud perfectly still in the center of the screen
    tl.to(wrapperRef.current, { x: "-100vw", ease: "none", duration: 4 }, 3);

    // Plane fades in exactly as the cloud stops moving
    tl.to(planeRef.current, { opacity: 1, ease: "none", duration: 0.5 }, 3);

    // Phase 2: Skywriting (Text reveal locked to scroll)
    tl.add("skywriting", 3.5);
    tl.to(planeRef.current, { left: "100%", ease: "none", duration: 3 }, "skywriting");
    // Restored width animation for the soft mask wipe, lag is prevented by will-change-transform
    tl.to(textCoverRef.current, { width: "15vw", ease: "none", duration: 3 }, "skywriting");

    // Plane accelerates slightly off the text and fades out (time 6.5 to 7)
    // The exhaust mask finishes dissipating, revealing the last letter fully
    tl.to(planeRef.current, { opacity: 0, left: "120%", ease: "none", duration: 0.5 }, 6.5);
    tl.to(textCoverRef.current, { width: "0%", ease: "none", duration: 0.5 }, 6.5);

    // ---------------------------------------------------------
    // PHASE 3: CLOUD EXITS (Time 7 to 10)
    // ---------------------------------------------------------
    tl.to(wrapperRef.current, { x: "-320vw", ease: "none", duration: 3 }, 7);

    // Hide completely after sweep off to prevent any edge bleeding or white box artifacts
    tl.set(wrapperRef.current, { autoAlpha: 0 }, 10);
  }, []);

  return (
    <>
      
      {/* 
        This empty spacer creates the scroll distance (300vh). 
        The negative margin (-200vh) pulls it UP so it overlaps the last 200vh of the previous ShowcaseDeck section.
        This allows the cloud to sweep OVER the phones while they are perfectly still and sticky on screen!
      */}
      <div ref={spacerRef} className="w-full h-[300vh] relative pointer-events-none z-0 -mt-[200vh]" />

      {/* The Wrapper containing both the fog and the crisp overlay */}
      <div 
        ref={wrapperRef}
        className="fixed -top-[25vh] h-[150vh] pointer-events-none z-[100] flex items-center justify-center will-change-transform"
        style={{
          width: "300vw",
          
        }}
      >
        {/* The Solid Fog Background (High-performance gradient instead of GPU-crashing blur filter) */}
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ background: "linear-gradient(to right, transparent 0%, white 15%, white 85%, transparent 100%)" }} 
        />

        {/* The Content Overlay (Crisp, unblurred) */}
        <div className="relative z-10 flex items-center">
          
          <div className="relative inline-block">
            {/* The Actual Text */}
            <h2 
              className="text-[#09090b] font-black text-[12vw] tracking-[0.2em] uppercase whitespace-nowrap opacity-90"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              SERVICES
            </h2>
            
            {/* The Text Cover (Solid White Box that shrinks to reveal, softened by a mask trail) */}
            <div 
              ref={textCoverRef}
              className="absolute top-0 right-0 h-full bg-white z-10 will-change-transform"
              style={{ 
                width: "calc(100% + 15vw)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15vw)",
                maskImage: "linear-gradient(to right, transparent 0%, black 15vw)"
              }}
            />

            {/* The Airplane Wrapper */}
            <div 
              ref={planeRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 z-20"
            >
              {/* This inner div flips the plane horizontally based on scroll direction */}
              <div ref={(node) => { planeIconRef.current = node; canvasWrapperRef.current = node; }} className="w-[15vw] h-[15vw] relative">
                <Canvas
                  camera={{ position: [0, 5, 0], fov: 40 }}
                  gl={{ alpha: true }}
                  frameloop={canvasVisible ? 'always' : 'never'}
                  dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
                >
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[5, 10, 5]} intensity={3} />
                  <directionalLight position={[-5, 5, -5]} intensity={2} />
                  <pointLight position={[0, 10, 0]} intensity={2} />
                  {/* Removed expensive WebGL ContactShadows to fix shadow-reversal bug and GPU lag */}
                  <Suspense fallback={null}>
                    <Airplane3D isForward={isForward} />
                  </Suspense>
                </Canvas>
                
                {/* Flawless zero-cost CSS shadow dropped exactly onto the HTML text! Never lags and has no turning bugs */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-[15%] bg-black/30 blur-[8px] rounded-[100%] pointer-events-none" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
