"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoneyDrip from "./HoneyDrip";

// Helper component to render a true 3D CSS Cube with baked vector lighting
const CSSCube = ({ size = "10vw" }: { size?: string }) => (
  <div className="absolute inset-0 w-full h-full [transform-style:preserve-3d]">
    {/* Front - Mid Dark */}
    <div className="absolute inset-0 bg-[#121215] border border-white/10" style={{ transform: `translateZ(calc(${size} / 2))` }} />
    {/* Back */}
    <div className="absolute inset-0 bg-black" style={{ transform: `translateZ(calc(-${size} / 2)) rotateY(180deg)` }} />
    {/* Left - Mid Light */}
    <div className="absolute top-0 bottom-0 bg-[#18181b] border-y border-white/5" style={{ width: size, left: `calc(50% - (${size} / 2))`, transform: `rotateY(-90deg) translateZ(calc(${size} / 2))` }} />
    {/* Right - Dark */}
    <div className="absolute top-0 bottom-0 bg-[#09090b] border-y border-white/5" style={{ width: size, left: `calc(50% - (${size} / 2))`, transform: `rotateY(90deg) translateZ(calc(${size} / 2))` }} />
    {/* Top - Lightest */}
    <div className="absolute left-0 right-0 bg-[#27272a] border-x border-t border-white/20" style={{ height: size, top: `calc(50% - (${size} / 2))`, transform: `rotateX(90deg) translateZ(calc(${size} / 2))` }} />
    {/* Bottom */}
    <div className="absolute left-0 right-0 bg-black" style={{ height: size, top: `calc(50% - (${size} / 2))`, transform: `rotateX(-90deg) translateZ(calc(${size} / 2))` }} />
  </div>
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function KadaSplit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const kadaRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<HTMLHeadingElement>(null);
  const phone1Ref = useRef<HTMLDivElement>(null);
  const phone2Ref = useRef<HTMLDivElement>(null);
  const phonesSlideWrapperRef = useRef<HTMLDivElement>(null);
  
  const marqueeRef = useRef<HTMLDivElement>(null);
  const ghost1Ref = useRef<HTMLDivElement>(null);
  const ghost2Ref = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);

  // True CSS 3D Blocks with Independent Rotations
  const BLOCKS = [
    { top: "5%", left: "10%", size: "12vw", rotX: 15, rotY: 25, rotZ: 5, depth: 300 },
    { top: "40%", left: "5%", size: "20vw", rotX: -20, rotY: 45, rotZ: -10, depth: 500 },
    { top: "15%", left: "75%", size: "15vw", rotX: 30, rotY: -35, rotZ: 15, depth: 200 },
    { top: "65%", left: "80%", size: "14vw", rotX: -15, rotY: -20, rotZ: 5, depth: 400 },
    { top: "35%", left: "45%", size: "22vw", rotX: 25, rotY: 15, rotZ: -5, depth: 700 },
    { top: "80%", left: "30%", size: "10vw", rotX: -10, rotY: 30, rotZ: 10, depth: 150 },
    { top: "10%", left: "40%", size: "8vw", rotX: 45, rotY: -15, rotZ: 0, depth: 250 },
  ];

  // Frosted Glass Panes
  const GLASS_PANES = [
    { top: "25%", left: "15%", w: "20vw", h: "30vw", depth: 400 },
    { top: "45%", left: "65%", w: "25vw", h: "35vw", depth: 600 },
    { top: "15%", left: "60%", w: "15vw", h: "25vw", depth: 300 },
    { top: "70%", left: "40%", w: "28vw", h: "15vw", depth: 450 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, () => {
        // 1. Reset all animated containers to pure CSS state to measure exact distances accurately
        gsap.set([phone1Ref.current, phone2Ref.current, marqueeRef.current, phonesSlideWrapperRef.current, textWrapperRef.current, marqueeWrapperRef.current], { clearProps: "all" });

        // 2. Measure natural drop distances
        const p1 = phone1Ref.current!.getBoundingClientRect();
        const g1 = ghost1Ref.current!.getBoundingClientRect();
        const p2 = phone2Ref.current!.getBoundingClientRect();
        const g2 = ghost2Ref.current!.getBoundingClientRect();

        const dropX1 = g1.left - p1.left;
        const dropY1 = g1.top - p1.top;
        
        const dropX2 = g2.left - p2.left;
        const dropY2 = g2.top - p2.top;

        // 3. Initial States
        gsap.set(kadaRef.current, { x: "-50vw", opacity: 0 });
        gsap.set(splitRef.current, { x: "50vw", opacity: 0 });
        
        gsap.set(phone1Ref.current, { x: 0, y: 0, z: -50, opacity: 0.7, rotationY: 0 }); 
        gsap.set(phone2Ref.current, { x: 0, y: 0, z: 0, opacity: 1, rotationY: 0 }); 
        
        gsap.set(slicesRef.current, { opacity: 0 });
        gsap.set(marqueeWrapperRef.current, { y: "150vh" }); // Hide Marquee way below screen!

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 3}`, 
            scrub: 1.5, 
          },
        });

        // Background elements stay perfectly locked during scroll.
        // Instead of scrolling, we give them an organic zero-gravity ambient float.
        const blockScrollWrappers = gsap.utils.toArray(".bg-block-scroll");
        const glassScrollWrappers = gsap.utils.toArray(".bg-glass-scroll");

        // Ambient Floating Animation
        blockScrollWrappers.forEach((wrapper: any, i) => {
          gsap.to(wrapper, {
            y: (i % 2 === 0 ? 1 : -1) * (Math.random() * 15 + 15), // Float up/down 15-30px
            rotationX: Math.random() * 4 - 2, // Tiny wobble
            rotationY: Math.random() * 4 - 2,
            duration: Math.random() * 3 + 4, // Very slow (4-7 seconds)
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: Math.random() * -5, // Start at random points in the cycle
          });
        });

        glassScrollWrappers.forEach((wrapper: any, i) => {
          gsap.to(wrapper, {
            y: (i % 2 === 0 ? -1 : 1) * (Math.random() * 20 + 20),
            rotationX: Math.random() * 2 - 1,
            duration: Math.random() * 4 + 5, // Even slower for heavy glass (5-9 seconds)
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: Math.random() * -7,
          });
        });

        // Interactive Mouse Parallax (Optimized with quickTo)
        const blockMouseElements = gsap.utils.toArray(".bg-block-mouse");
        const glassMouseElements = gsap.utils.toArray(".bg-glass-mouse");

        // Create highly optimized setter functions for X and Y
        const blockXSetters = blockMouseElements.map((el: any) => gsap.quickTo(el, "x", { duration: 1, ease: "power2.out" }));
        const blockYSetters = blockMouseElements.map((el: any) => gsap.quickTo(el, "y", { duration: 1, ease: "power2.out" }));
        
        const glassXSetters = glassMouseElements.map((el: any) => gsap.quickTo(el, "x", { duration: 1.5, ease: "power2.out" }));
        const glassYSetters = glassMouseElements.map((el: any) => gsap.quickTo(el, "y", { duration: 1.5, ease: "power2.out" }));

        // Zero-layout-thrashing magnetic repel math
        const calculateRepel = (clientX: number, clientY: number, leftStr: string, topStr: string, widthStr: string, heightStr: string, scrollWrapper: Element) => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          
          const leftPx = (parseFloat(leftStr) / 100) * vw;
          const topPx = (parseFloat(topStr) / 100) * vh;
          // Extract purely numeric value assuming vw
          const widthPx = (parseFloat(widthStr) / 100) * vw;
          const heightPx = (parseFloat(heightStr) / 100) * vw;

          const centerX = leftPx + widthPx / 2;
          const scrollY = gsap.getProperty(scrollWrapper, "y") as number || 0;
          const centerY = topPx + heightPx / 2 + scrollY;

          const dx = clientX - centerX;
          const dy = clientY - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const repelRadius = vw * 0.20; // 20vw repel radius
          if (dist < repelRadius && dist > 0) {
            // Exponential falloff for smooth easing
            const force = Math.pow((repelRadius - dist) / repelRadius, 2);
            return {
              rx: -(dx / dist) * force * (vw * 0.1), // Max push 10vw
              ry: -(dy / dist) * force * (vw * 0.1)
            };
          }
          return { rx: 0, ry: 0 };
        };

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const xPos = (clientX / window.innerWidth) - 0.5;
          const yPos = (clientY / window.innerHeight) - 0.5;

          blockMouseElements.forEach((_, i) => {
            // 1. Global Ambient Parallax
            const depth = BLOCKS[i].depth * 0.1;
            let targetX = xPos * depth;
            let targetY = yPos * depth;

            // 2. Magnetic Dodge / Repel
            const repel = calculateRepel(clientX, clientY, BLOCKS[i].left, BLOCKS[i].top, BLOCKS[i].size, BLOCKS[i].size, blockScrollWrappers[i] as Element);
            targetX += repel.rx;
            targetY += repel.ry;

            blockXSetters[i](targetX);
            blockYSetters[i](targetY);
          });

          glassMouseElements.forEach((_, i) => {
            const depth = GLASS_PANES[i].depth * 0.15;
            let targetX = xPos * depth;
            let targetY = yPos * depth;

            // Glass is heavier, push it away half as much
            const repel = calculateRepel(clientX, clientY, GLASS_PANES[i].left, GLASS_PANES[i].top, GLASS_PANES[i].w, GLASS_PANES[i].h, glassScrollWrappers[i] as Element);
            targetX += repel.rx * 0.5;
            targetY += repel.ry * 0.5;

            glassXSetters[i](targetX);
            glassYSetters[i](targetY);
          });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // 4. Setup: "KADA" slides in
        tl.to(kadaRef.current, { x: 0, opacity: 1, duration: 2, ease: "power2.out" }, 0);
        
        // 5. Tension: Phones drift apart in 3D space
        tl.to(phone1Ref.current, { x: -40, y: -20, rotationY: -15, z: -80, opacity: 0.9, duration: 3, ease: "none" }, 1);
        tl.to(phone2Ref.current, { x: 40, y: 20, rotationY: 15, z: 20, duration: 3, ease: "none" }, 1);

        // 6. Impact: "SPLIT" strikes
        tl.to(splitRef.current, { x: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, 4);

        // Phones start dropping immediately when SPLIT starts (t=4)
        // We use power2.out so they instantly react with high velocity the moment the scroll hits t=4
        tl.to(phone1Ref.current, { x: dropX1, y: dropY1, z: 0, rotationY: 0, opacity: 1, duration: 4, ease: "power2.out" }, 4);
        tl.to(phone2Ref.current, { x: dropX2, y: dropY2, z: 0, rotationY: 0, duration: 4, ease: "power2.out" }, 4);

        // 7. Explosion & Marquee Arrival
        // Text flies up and Marquee rises slightly after the phones have already started dropping
        tl.addLabel("explode", 5);

        // Text wrapper flies UP and EXITS the screen completely (simulating scroll up)
        tl.to(textWrapperRef.current, { y: "-150vh", duration: 3, ease: "power3.inOut" }, "explode");
        
        // Marquee wrapper rises UP from bottom to perfectly center on screen
        tl.to(marqueeWrapperRef.current, { y: "0vh", duration: 3, ease: "power3.inOut" }, "explode");
        
        // Other slices materialize alongside them (staggered wave)
        tl.to(slicesRef.current, { opacity: 1, duration: 1.5, stagger: 0.05, ease: "power1.inOut" }, "explode+=1");
        
        // 8. Massive Horizontal Slide (Increased to -250vw for longer continuous scroll)
        tl.addLabel("slide", "explode+=2");
        tl.to(marqueeRef.current, { x: "-250vw", duration: 5, ease: "none" }, "slide");
        tl.to(phonesSlideWrapperRef.current, { x: "-250vw", duration: 5, ease: "none" }, "slide");
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-[530vh] w-full bg-[#050505] pt-[30vh]">
      
      {/* Shared SVG filter for HoneyDrip (Defined once for performance) */}
      <svg className="hidden">
        <filter id="gooey-honey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 18 -7" 
            result="goo" 
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      {/* Cinematic Spacer & Seamless Transition Gradient */}
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-[#09090b] via-[#060608] to-[#050505] pointer-events-none z-30 flex items-center justify-center">
        {/* Optional: subtle line or indicator can go here, but empty space is best */}
      </div>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* TRUE CSS 3D SCENE BACKGROUND */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden [perspective:1200px]"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
          }}
        >
          {/* 3D Scene Wrapper */}
          <div className="absolute inset-0 w-full h-full [transform-style:preserve-3d]">
            
            {/* Render True CSS 3D Cubes */}
            {BLOCKS.map((block, i) => (
              <div 
                key={`block-${i}`}
                className="bg-block-scroll absolute z-10 will-change-transform [transform-style:preserve-3d]"
                style={{
                  top: block.top,
                  left: block.left,
                  // @ts-ignore
                  "--w": block.size,
                  "--h": block.size,
                }}
              >
                <div 
                  className="bg-block-mouse w-full h-full will-change-transform [transform-style:preserve-3d]"
                  style={{
                    width: block.size,
                    height: block.size,
                    transform: `translateZ(${100 - (block.depth / 5)}px) rotateX(${block.rotX}deg) rotateY(${block.rotY}deg) rotateZ(${block.rotZ}deg)`,
                  }}
                >
                  <CSSCube size={block.size} />
                </div>
              </div>
            ))}

            {/* Render Frosted Glass Panes */}
            {GLASS_PANES.map((glass, i) => (
              <div 
                key={`glass-${i}`}
                className="bg-glass-scroll absolute z-20 will-change-transform"
                style={{
                  top: glass.top,
                  left: glass.left,
                }}
              >
                <div
                  className="bg-glass-mouse w-full h-full will-change-transform"
                  style={{
                    width: glass.w,
                    height: glass.h,
                    transform: `translateZ(${150 - (glass.depth / 5)}px) rotateX(5deg) rotateY(-10deg)`,
                  }}
                >
                  {/* Premium Glass Body - Using backdrop-blur-lg instead of 2xl to massively boost performance over 3D layers */}
                  <div className="w-full h-full backdrop-blur-lg bg-white/[0.02] shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 rounded-sm overflow-hidden">
                    <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-1/2 -skew-x-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Subtle vignette to preserve center text readability */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,5,0.9)_100%)] pointer-events-none z-30" />
        </div>

        {/* TEXT WRAPPER - Centered vertically and positioned absolute so it can fly away */}
        <div ref={textWrapperRef} className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-20 will-change-transform">
          <span className="font-mono text-xs tracking-widest text-peyk-silver uppercase mb-4">Proprietary Product</span>
          <div className="flex flex-col">
            <h2 ref={kadaRef} className="font-heading text-7xl md:text-9xl lg:text-[10vw] font-black uppercase tracking-tighter text-white leading-[0.85]">
              KADA
            </h2>
            <h2 ref={splitRef} className="font-heading text-7xl md:text-9xl lg:text-[10vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-peyk-silver/40 leading-[0.85]">
              SPLIT
            </h2>
          </div>
        </div>

        {/* PHONES (Right) - Wrapper for dropping */}
        <div ref={phonesSlideWrapperRef} className="absolute inset-0 w-full h-full pointer-events-none z-30 will-change-transform">
          {/* Phone 1 */}
          <div ref={phone1Ref} className="absolute right-[10%] md:right-[20%] top-[25%] md:top-[28%] h-[45vh] lg:h-[55vh] z-10 will-change-transform">
            <img src="/assets/images/kadasplit_slices/Slice 1.png" alt="KadaSplit 1" className="h-full w-auto object-contain" />
            <HoneyDrip />
          </div>
          
          {/* Phone 2 (Slice 7) */}
          <div ref={phone2Ref} className="absolute right-[5%] md:right-[10%] top-[20%] md:top-[22%] h-[45vh] lg:h-[55vh] z-20 will-change-transform">
            <img src="/assets/images/kadasplit_slices/Slice 7.png" alt="KadaSplit 7" className="h-full w-auto object-contain" />
          </div>
        </div>

        {/* MARQUEE WRAPPER - Centered exactly in the middle of the screen! */}
        {/* Placed at its final destination on mount so getBoundingClientRect perfectly measures the slots. */}
        <div ref={marqueeWrapperRef} className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-10 flex items-center pl-8 md:pl-24 will-change-transform">
          <div ref={marqueeRef} className="flex gap-0 [perspective:1200px] [transform-style:preserve-3d] will-change-transform">
            
            {/* Slot 1: Ghost 1 (Slice 1) */}
            <div ref={ghost1Ref} className="h-[45vh] lg:h-[55vh] shrink-0 pointer-events-none relative">
              <img src="/assets/images/kadasplit_slices/Slice 1.png" className="h-full w-auto opacity-0" />
            </div>
            
            {/* Slot 2-6: Slices 2-6 */}
            {[2, 3, 4, 5, 6].map((sliceNum, i) => (
              <div 
                key={sliceNum} 
                ref={(el) => { slicesRef.current[i] = el; }}
                className="relative h-[45vh] lg:h-[55vh] shrink-0"
              >
                <img src={`/assets/images/kadasplit_slices/Slice ${sliceNum}.png`} alt={`KadaSplit ${sliceNum}`} className="h-full w-auto object-contain" />
                {[1, 5, 6, 8, 9, 10].includes(sliceNum) && <HoneyDrip />}
              </div>
            ))}

            {/* Slot 7: Ghost 2 (Slice 7) */}
            <div ref={ghost2Ref} className="h-[45vh] lg:h-[55vh] shrink-0 pointer-events-none">
              <img src="/assets/images/kadasplit_slices/Slice 7.png" className="h-full w-auto opacity-0" />
            </div>

            {/* Slot 8-10: Slices 8-10 */}
            {[8, 9, 10].map((sliceNum, i) => (
              <div 
                key={sliceNum} 
                ref={(el) => { slicesRef.current[i + 5] = el; }}
                className="relative h-[45vh] lg:h-[55vh] shrink-0"
              >
                <img src={`/assets/images/kadasplit_slices/Slice ${sliceNum}.png`} alt={`KadaSplit ${sliceNum}`} className="h-full w-auto object-contain" />
                {[1, 5, 6, 8, 9, 10].includes(sliceNum) && <HoneyDrip />}
              </div>
            ))}

            {/* DUPLICATE SET 1 FOR CONTINUOUS SCROLL */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sliceNum, i) => (
              <div 
                key={`dup1-${sliceNum}`} 
                ref={(el) => { slicesRef.current[i + 8] = el; }}
                className="relative h-[45vh] lg:h-[55vh] shrink-0"
              >
                <img src={`/assets/images/kadasplit_slices/Slice ${sliceNum}.png`} alt={`KadaSplit ${sliceNum}`} className="h-full w-auto object-contain" />
                {[1, 5, 6, 8, 9, 10].includes(sliceNum) && <HoneyDrip />}
              </div>
            ))}

            {/* DUPLICATE SET 2 FOR CONTINUOUS SCROLL */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sliceNum, i) => (
              <div 
                key={`dup2-${sliceNum}`} 
                ref={(el) => { slicesRef.current[i + 18] = el; }}
                className="relative h-[45vh] lg:h-[55vh] shrink-0"
              >
                <img src={`/assets/images/kadasplit_slices/Slice ${sliceNum}.png`} alt={`KadaSplit ${sliceNum}`} className="h-full w-auto object-contain" />
                {[1, 5, 6, 8, 9, 10].includes(sliceNum) && <HoneyDrip />}
              </div>
            ))}
            
          </div>
        </div>

      </div>
    </div>
  );
}
