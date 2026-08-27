"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Subtle initial zoom-out on the background glow
    gsap.fromTo(".about-glow", 
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 0.15, duration: 2, ease: "power2.out" }
    );

    // Fade in text with a staggered slide up
    tl.fromTo(".hero-line",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
    
    tl.fromTo(".hero-sub",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.5"
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[85vh] flex flex-col justify-center bg-transparent px-6 md:px-12 lg:px-24 pt-32 pb-16"
    >
      
      {/* Cinematic Lighting */}
      <div className="about-glow absolute top-[40%] right-[10%] w-[80vw] h-[80vw] lg:w-[50vw] lg:h-[50vw] bg-[#f59e0b] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col">
        
        {/* Massive Staggered Typography */}
        <h1 className="font-sans text-5xl sm:text-7xl md:text-[6rem] lg:text-[8rem] font-medium tracking-tighter leading-[1.05] text-white flex flex-col mb-16 md:mb-24">
          <span className="hero-line">Engineering</span>
          <span className="hero-line pl-[5vw] sm:pl-[12vw] md:pl-[15vw] text-zinc-300">the digital</span>
          <span className="hero-line pl-[10vw] sm:pl-[24vw] md:pl-[30vw]">
            frontier<span className="text-zinc-500">.</span>
          </span>
        </h1>

        {/* Offset Paragraph */}
        <div className="hero-sub mt-24 lg:mt-12 flex justify-start lg:justify-end w-full">
          <p className="font-sans text-lg md:text-xl text-zinc-400 leading-relaxed font-light max-w-md">
            Peyk is a specialized digital architecture firm. We design, engineer, and deploy high-performance web systems for brands that demand perfection. Our expertise spans advanced UI/UX, full-stack engineering, and comprehensive digital strategy.
          </p>
        </div>

      </div>
      
    </section>
  );
}
