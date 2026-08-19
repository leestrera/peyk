"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "./ScrambleText";

gsap.registerPlugin(ScrollTrigger);

export default function PurposeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  const quote = '"We bridge the gap between ambitious vision and flawless digital execution."';
  const words = quote.split(" ");

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const quoteEl = quoteRef.current;
    if (!container || !text || !quoteEl) return;

    // Intro fade for non-quote elements
    gsap.fromTo(
      ".purpose-fade",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
        },
      }
    );

    // Scrubbing kinetic reveal for the quote words
    gsap.fromTo(
      ".quote-word",
      { opacity: 0.15, textShadow: "0px 0px 0px rgba(0,0,0,0)" },
      {
        opacity: 1,
        textShadow: "0px 4px 20px rgba(0,0,0,0.1)", // Gives words physical presence when active
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: quoteEl,
          start: "top 85%",
          end: "bottom 50%",
          scrub: 1, // Smooth scrubbing
        }
      }
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center bg-[#fbfbfb] px-6 pt-64 pb-96 text-center z-10 overflow-hidden"
    >
      {/* Seamless Transition from TemplatesShowcase */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#f4f4f5] to-transparent z-20 pointer-events-none" />

      {/* Background Architectural Grid & DOM Art */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
         {/* Vertical Guide Lines */}
         <div className="absolute top-0 bottom-0 left-[15%] md:left-[20%] w-[1px] bg-gradient-to-b from-transparent via-zinc-200 to-transparent opacity-60" />
         <div className="absolute top-0 bottom-0 right-[15%] md:right-[20%] w-[1px] bg-gradient-to-b from-transparent via-zinc-200 to-transparent opacity-60" />
         
         {/* Massive Rotating Geometric Compass */}
         <div className="absolute top-1/2 left-1/2 w-[120vw] h-[120vw] md:w-[70vw] md:h-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-zinc-200 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] opacity-30 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]" style={{ animation: 'spin-slow 45s linear infinite' }} />
      </div>

      <div ref={textRef} className="relative z-10 max-w-5xl space-y-16">
        <div className="purpose-fade">
          <ScrambleText 
            as="h2" 
            text="Our Philosophy" 
            className="font-heading text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-zinc-900/40" 
          />
        </div>
        
        <p ref={quoteRef} className="font-cursive text-5xl text-zinc-900 md:text-6xl lg:text-[5rem] leading-[1.2] flex flex-wrap justify-center gap-x-[1.2rem] gap-y-4">
          {words.map((word, i) => (
            <span key={i} className="quote-word will-change-[opacity,text-shadow]">
              {word}
            </span>
          ))}
        </p>

        <div className="purpose-fade space-y-8">
          <p className="font-mono text-xs md:text-sm tracking-[0.2em] text-zinc-900/40 uppercase">
            — The Agency Standard
          </p>

          <p className="mx-auto max-w-2xl font-sans text-sm md:text-base leading-relaxed text-zinc-500">
            Every line of code, every interface, and every architecture decision is executed with an uncompromising standard of excellence. We don't just build digital products; we engineer experiences that elevate brands and redefine what is possible.
          </p>
        </div>
      </div>

      {/* Seamless Transition into Contact Section */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-black z-20 pointer-events-none" />
    </section>
  );
}
