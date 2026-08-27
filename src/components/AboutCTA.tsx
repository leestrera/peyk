"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutCTA() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".cta-glow", 
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 0.1, 
        duration: 2, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-transparent text-white px-6 md:px-12 lg:px-24 pt-24 pb-16 z-20">
      
      <div className="cta-glow absolute top-[30%] left-[20%] w-full aspect-square md:w-[60vw] md:h-[60vw] -translate-x-1/2 -translate-y-1/2 bg-[#f59e0b] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto mb-24 md:mb-48">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16">
          <div className="w-full lg:w-2/3">
            <h2 className="font-sans text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[7rem] font-medium tracking-tighter leading-[1.05] text-white mb-12">
              Let's build <br/>
              <span className="text-white/50">something</span> <br/>
              <span className="text-[#f59e0b]">extraordinary.</span>
            </h2>
            <p className="font-sans text-lg md:text-xl text-zinc-400 font-light max-w-lg">
              Tell us about your digital challenges. Our elite engineering team is ready to architect the perfect solution.
            </p>
          </div>

          <div className="w-full lg:w-1/3 flex justify-start lg:justify-end">
            <Link 
              href="/contact"
              className="group relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full border border-white/20 hover:border-[#f59e0b] transition-colors duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#f59e0b]/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-full" />
              <span className="relative z-10 font-sans text-sm tracking-widest uppercase font-medium text-white group-hover:text-[#f59e0b] transition-colors duration-500">
                Get in Touch
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
