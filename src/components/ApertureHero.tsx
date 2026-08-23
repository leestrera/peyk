"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MechanicalSpider from "./MechanicalSpider";
import { LOGO_WHITE_B64 } from "../logoBase64";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ApertureHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLImageElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const bugRef = useRef<HTMLDivElement>(null);
  
  // Start frozen, only move when preloader gives the signal
  const [isPatrolling, setIsPatrolling] = useState(false);
  const preloaderDoneRef = useRef(false);

  useEffect(() => {
    const handlePreloaderComplete = () => {
      preloaderDoneRef.current = true;
      setIsPatrolling(true);
    };
    window.addEventListener("preloaderComplete", handlePreloaderComplete);
    
    // Fallback just in case preloader fired early or was skipped
    const timer = setTimeout(() => {
      preloaderDoneRef.current = true;
      setIsPatrolling(true);
    }, 4500); 

    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      clearTimeout(timer);
    };
  }, []);

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
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Freeze the bug in its current position when scrolling begins
          if (self.progress > 0.02) {
            setIsPatrolling((prev) => {
              if (prev) return false;
              return prev;
            });
          } else {
            // Only unfreeze if the preloader is actually done
            if (preloaderDoneRef.current) {
              setIsPatrolling((prev) => {
                if (!prev) return true;
                return prev;
              });
            }
          }
        }
      },
    });

    // 1. Text fades out, dot scales up massively and moves to the center. Scroll indicator fades out immediately.
    tl.to(scrollIndicator, { opacity: 0, duration: 0.5, ease: "power2.out" }, 0)
      .to(text, { scale: 1.1, opacity: 0, duration: 2, ease: "power2.inOut" }, 0)
      .to(bugRef.current, { 
        scale: 150, // Massive scale to cover the screen from wherever the bug is
        duration: 2.5, 
        ease: "power2.inOut" 
      }, 0)
      
      // 2. The Seamless Handover: Eliminate the crossfade drop by using instant SET commands.
      // We turn the curtains solid amber right before the dot finishes scaling.
      // Because the dot is already massive, this happens invisibly behind it.
      .set(".glow-overlay", { opacity: 1 }, 2.4)
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
        className="pointer-events-none absolute left-0 top-0 z-20 h-full w-1/2 origin-left bg-white will-change-transform"
      >
        <div className="glow-overlay absolute inset-0 bg-background opacity-0" />
      </div>
      <div
        ref={rightCurtainRef}
        className="pointer-events-none absolute right-0 top-0 z-20 h-full w-1/2 origin-right bg-white will-change-transform"
      >
        <div className="glow-overlay absolute inset-0 bg-background opacity-0" />
      </div>

      {/* The Text Layer */}
      <div className="relative z-30 flex h-full w-full items-center justify-center pointer-events-none !p-0">
        <h1 className="font-heading text-[12vw] font-black uppercase tracking-tighter flex items-center justify-center !p-0 m-0">
          <span className="inline-flex will-change-transform items-center justify-center !p-0 m-0">
            <img 
              ref={textRef}
              src={LOGO_WHITE_B64}
              alt="PEYK"
              className="w-[45vw] md:w-[35vw] max-w-[600px] h-auto object-contain !m-0 !p-0 block"
            />
          </span>
          <div
            ref={dotRef}
            className="relative inline-flex items-center justify-center h-[1.5vw] w-[1.5vw] min-h-[6px] min-w-[6px] mt-[3vw] -ml-[0.5vw] will-change-transform origin-center"
          >
            {/* The roaming bug that becomes the aperture transition! */}
            <MechanicalSpider 
              ref={bugRef} 
              id="hero" 
              isPatrolling={isPatrolling} 
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
