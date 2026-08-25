 "use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LOGO_WHITE_B64 } from "../logoBase64";
import MechanicalSpider from "./MechanicalSpider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ApertureHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLImageElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isPatrolling, setIsPatrolling] = useState(true);
  const isPatrollingRef = useRef(true);

  useGSAP(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const dot = dotRef.current;
    const leftCurtain = leftCurtainRef.current;
    const rightCurtain = rightCurtainRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!container || !text || !dot || !leftCurtain || !rightCurtain) return;

    // Reset properties
    gsap.set(dot, { scale: 1, opacity: 1, x: 0, y: 0 });
    gsap.set(text, { opacity: 1, scale: 1, y: 0 });
    gsap.set(".glow-overlay", { opacity: 0 });
    gsap.set([leftCurtain, rightCurtain], { xPercent: 0 });
    
    let startSx = 0;
    let startSy = 0;
    let initialRect: DOMRect | null = null;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 1,
        onUpdate: (self) => {
          // Capture the dot's initial rect the first time if needed
          if (!initialRect) {
            initialRect = dot.getBoundingClientRect();
          }
          
          // If we scroll down even 1%, stop the spider from roaming so the scale effect takes over
          const shouldPatrol = self.progress <= 0.01;
          if (shouldPatrol !== isPatrollingRef.current) {
            isPatrollingRef.current = shouldPatrol;
            setIsPatrolling(shouldPatrol);
            
            if (!shouldPatrol) {
              const bugWrapper = dot.querySelector('.bug-wrapper');
              if (bugWrapper) {
                // Freeze the spider in its exact current frame
                gsap.killTweensOf(bugWrapper);
                const style = window.getComputedStyle(bugWrapper);
                const matrix = new DOMMatrix(style.transform);
                startSx = matrix.m41;
                startSy = matrix.m42;
              }
            }
          }
        }
      },
    });

    // 1. Text fades out, dot scales up massively and moves to the center. Scroll indicator fades out immediately.
    const proxy = { p: 0 };
    tl.to(scrollIndicator, { opacity: 0, duration: 0.5, ease: "power2.out" }, 0)
      .to(text, { scale: 1.1, opacity: 0, duration: 2, ease: "power2.inOut" }, 0)
      .to(proxy, {
        p: 1,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          const currentScale = 1 + (149 * proxy.p);
          if (initialRect) {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            
            const spiderScreenX = initialRect.left + initialRect.width / 2 + startSx;
            const spiderScreenY = initialRect.top + initialRect.height / 2 + startSy;
            
            const moveX = (cx - spiderScreenX) * proxy.p;
            const moveY = (cy - spiderScreenY) * proxy.p;
            
            const counterX = startSx * (1 - currentScale);
            const counterY = startSy * (1 - currentScale);
            
            gsap.set(dot, {
              scale: currentScale,
              x: moveX + counterX,
              y: moveY + counterY
            });
          }
        }
      }, 0)
      
      // 2. The Seamless Handover: Smoothly crossfade the background to black
      // As the spider explodes in size, we slowly fade the curtains to black so it blends naturally
      // without a harsh snap when the spider is deleted.
      .to(".glow-overlay", { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 1.3)
      // Exactly as the split starts, we delete the physical dot so the curtains can open.
      .set(dot, { opacity: 0 }, 2.5)

      // 3. The screen literally cracks and splits perfectly down the middle
      .to(leftCurtain, { xPercent: -100, duration: 2, ease: "power3.inOut" }, 2.5)
      .to(rightCurtain, { xPercent: 100, duration: 2, ease: "power3.inOut" }, 2.5);

  }, { scope: containerRef });

  return (
    <div className="relative w-full z-20">
      <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-transparent text-black">
        
        {/* 
        The Split Curtains 
        These are the actual white background of the hero section.
      */}
      <div
        ref={leftCurtainRef}
        className="pointer-events-none absolute left-0 top-0 z-20 h-full w-1/2 origin-left bg-white "
      >
        <div className="glow-overlay absolute inset-0 bg-background opacity-0" />
      </div>
      <div
        ref={rightCurtainRef}
        className="pointer-events-none absolute right-0 top-0 z-20 h-full w-1/2 origin-right bg-white "
      >
        <div className="glow-overlay absolute inset-0 bg-background opacity-0" />
      </div>

      {/* The Text Layer */}
      <div className="relative z-30 flex h-full w-full items-center justify-center pointer-events-none !p-0">
        <h1 className="font-heading text-[12vw] font-black uppercase tracking-tighter flex items-center justify-center !p-0 m-0">
          <span className="inline-flex  items-center justify-center !p-0 m-0">
            <img 
              ref={textRef}
              src={LOGO_WHITE_B64}
              alt="PEYK"
              className="w-[45vw] md:w-[35vw] max-w-[600px] h-auto object-contain !m-0 !p-0 block"
            />
          </span>
          <div
            ref={dotRef}
            className="relative inline-flex items-center justify-center h-[1.5vw] w-[1.5vw] min-h-[6px] min-w-[6px] mt-[3vw] -ml-[0.5vw] origin-center"
          >
            {/* The roaming bug that becomes the aperture transition! */}
            <MechanicalSpider 
              id="hero-spider"
              isPatrolling={isPatrolling} 
              initialScale={1}
              originRef={dotRef}
              avoidRef={textRef}
            />
          </div>
        </h1>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center justify-center gap-3 pointer-events-none"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-black/40 uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-black/10 overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 w-full h-1/2 bg-black/80" 
            style={{ 
              animation: "scrollLine 2s cubic-bezier(0.77, 0, 0.175, 1) infinite" 
            }} 
          />
        </div>
      </div>
      <style jsx>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
        
      </section>
    </div>
  );
}
