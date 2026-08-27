"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    title: "Architectural Precision",
    text: "We don't just build; we engineer. Every pixel, every animation curve, and every line of code is mathematically calculated for optimal performance."
  },
  {
    title: "Obsessive Polish",
    text: "Good is never enough. We obsess over the micro-interactions, the native-like physics, and the sub-pixel details that elevate a product from standard to luxury."
  },
  {
    title: "Relentless Innovation",
    text: "We refuse to stagnate. We are constantly pushing the boundaries of what is possible in the browser, bringing desktop-class experiences to the web."
  },
  {
    title: "Cinematic Experience",
    text: "The web is a stage, and every product we launch is a performance. We believe in storytelling through motion, deep contrast, and atmospheric design."
  },
  {
    title: "Radical Transparency",
    text: "Clear, concise, and confident communication is our baseline. We foster open dialogues to build strong relationships and align expectations precisely."
  },
  {
    title: "Absolute Ownership",
    text: "We take full responsibility for our architectural decisions. Taking ownership of our code and our client's success is something we take to heart."
  }
];

export default function CoreValues() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Fade in the main heading
    gsap.fromTo(".values-heading", 
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );

    // Stagger the horizontal lines and text of each row
    const rows = gsap.utils.toArray('.value-row');
    rows.forEach((row: any) => {
      const line = row.querySelector('.value-line');
      const content = row.querySelector('.value-content');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
        }
      });

      tl.fromTo(line, 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 1, ease: "power3.inOut", transformOrigin: "left center" }
      )
      .fromTo(content, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-transparent text-white px-6 md:px-12 lg:px-24 pt-24 md:pt-32 pb-12 md:pb-16">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* Left: Sticky Heading */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-32">
            <h2 className="values-heading font-sans text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
              Our Core Principles
            </h2>
          </div>
        </div>

        {/* Right: Editorial Rows */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {VALUES.map((value, i) => (
            <div key={i} className="value-row group cursor-default">
              
              {/* Animating Top Border */}
              <div className="value-line h-[1px] w-full bg-zinc-800 group-hover:bg-zinc-600 transition-colors duration-500" />
              
              {/* Row Content */}
              <div className="value-content flex flex-col sm:flex-row items-start sm:items-center py-12 lg:py-16 gap-6 sm:gap-12 transition-transform duration-500 group-hover:translate-x-4">
                
                {/* Title */}
                <h3 className="font-sans text-2xl md:text-3xl font-medium text-zinc-300 group-hover:text-white transition-colors duration-500 min-w-full sm:min-w-[280px]">
                  {value.title}
                </h3>
                
                {/* Description */}
                <p className="font-sans text-base text-zinc-400 font-light leading-relaxed">
                  {value.text}
                </p>
                
              </div>
            </div>
          ))}
          
          {/* Final Bottom Border */}
          <div className="value-line h-[1px] w-full bg-zinc-800" />
        </div>
        
      </div>
    </section>
  );
}
