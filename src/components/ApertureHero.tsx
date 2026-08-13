"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ApertureHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const dot = dotRef.current;
    const leftCurtain = leftCurtainRef.current;
    const rightCurtain = rightCurtainRef.current;

    if (!container || !text || !dot || !leftCurtain || !rightCurtain) return;

    // Reset properties to prevent SSR mismatch or hot-reload glitches
    gsap.set(dot, { scale: 1, x: 0, y: 0 });
    gsap.set(text, { opacity: 1, scale: 1, y: 0 });
    gsap.set(".glow-overlay", { opacity: 0 });
    gsap.set([leftCurtain, rightCurtain], { xPercent: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=2000", // 2000px of scrolling for the whole cinematic sequence
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 1. Text fades slightly while dot detaches and scales exponentially
    tl.to(text, { scale: 1.1, opacity: 0, duration: 2, ease: "power2.inOut" }, 0)
      .to(
        dot,
        {
          scale: 150, // Massive scale to fill viewport
          duration: 3,
          ease: "expo.in",
        },
        0
      )
      // 2. The glow fully consumes the screen
      .to(".glow-overlay", { opacity: 1, duration: 1, ease: "power1.inOut" }, 1.5)
      // 3. The physical split (curtains open to reveal the dark universe below)
      .to(leftCurtain, { xPercent: -100, duration: 2, ease: "power3.inOut" }, 3)
      .to(rightCurtain, { xPercent: 100, duration: 2, ease: "power3.inOut" }, 3);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-white text-black">
      
      {/* 
        The Split Curtains 
        These sit above the dark content but below the text initially.
        They hold the glow color and physically split apart.
      */}
      <div
        ref={leftCurtainRef}
        className="pointer-events-none absolute left-0 top-0 z-20 h-full w-1/2 origin-left bg-white will-change-transform"
      >
        <div className="glow-overlay absolute inset-0 bg-peyk-amber/10 opacity-0 mix-blend-multiply" />
      </div>
      <div
        ref={rightCurtainRef}
        className="pointer-events-none absolute right-0 top-0 z-20 h-full w-1/2 origin-right bg-white will-change-transform"
      >
        <div className="glow-overlay absolute inset-0 bg-peyk-amber/10 opacity-0 mix-blend-multiply" />
      </div>

      {/* The Text Layer */}
      <div className="relative z-30 flex h-full w-full items-center justify-center">
        <h1
          ref={textRef}
          className="font-heading text-[12vw] font-black uppercase tracking-tighter will-change-transform"
        >
          PEYK
          <span
            ref={dotRef}
            className="inline-block origin-center text-peyk-amber will-change-transform"
          >
            .
          </span>
        </h1>
      </div>
      
    </section>
  );
}
