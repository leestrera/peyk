"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutNarrative() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray('.narrative-fade');
    
    elements.forEach((el: any) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-transparent text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 relative z-20">
      <div className="max-w-[1400px] mx-auto flex flex-col relative z-10">
        
        {/* Top Left-Aligned Statement */}
        <div className="w-full max-w-5xl mb-24 md:mb-32 narrative-fade">
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] font-medium tracking-tighter leading-[1.05] text-white">
            Elevating digital experiences through uncompromising engineering.
          </h2>
        </div>

        {/* 50/50 split for Vision & Mission */}
        <div className="flex flex-col md:flex-row w-full gap-16 md:gap-24">
          
          {/* Vision */}
          <div className="narrative-fade flex-1 flex flex-col items-start space-y-8">
            <h3 className="font-cursive text-5xl md:text-6xl lg:text-7xl text-white">Our Vision</h3>
            <p className="font-sans text-base md:text-lg text-zinc-400 font-light leading-relaxed max-w-lg">
              We envision a digital landscape where absolute performance and uncompromising aesthetics coexist flawlessly, pushing the boundaries of what is possible in the browser.
            </p>
          </div>

          {/* Mission */}
          <div className="narrative-fade flex-1 flex flex-col items-start space-y-8">
            <h3 className="font-cursive text-5xl md:text-6xl lg:text-7xl text-white">Our Mission</h3>
            <p className="font-sans text-base md:text-lg text-zinc-400 font-light leading-relaxed max-w-lg">
              To engineer uncompromising digital products. We deliver systems that drive exceptional business outcomes while providing a frictionless, cinematic experience for users.
            </p>
          </div>
          
        </div>

      </div>
    </section>
  );
}
