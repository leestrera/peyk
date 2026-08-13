"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function PurposeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    gsap.fromTo(
      text.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative flex min-h-[60vh] w-full flex-col items-center justify-center bg-background px-6 py-24 text-center z-10"
    >
      <div ref={textRef} className="max-w-3xl space-y-10">
        <h2 className="font-heading text-lg font-bold uppercase tracking-[0.3em] text-peyk-amber/80">
          Our Purpose
        </h2>
        
        <p className="font-cursive text-4xl text-white md:text-5xl lg:text-6xl leading-tight">
          "So whether you eat or drink or whatever you do, do it all for the glory of God."
        </p>

        <p className="font-mono text-sm tracking-widest text-white/50">
          — 1 Corinthians 10:31
        </p>

        <p className="mx-auto max-w-2xl pt-6 font-sans text-base leading-relaxed text-white/70">
          Every line of code, every interface, and every architecture decision is executed with an uncompromising standard of excellence. Not for our own prestige, but as a reflection of the Creator we serve.
        </p>
      </div>
    </section>
  );
}
