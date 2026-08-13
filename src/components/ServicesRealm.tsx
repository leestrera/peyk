"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ServicesRealm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic magnetic text reveal effect
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      gsap.to(container.querySelector(".services-title"), {
        letterSpacing: "0.2em",
        duration: 0.8,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container.querySelector(".services-title"), {
        letterSpacing: "0em",
        duration: 0.8,
        ease: "power2.out",
      });
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/assets/videos/services_bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen transition-opacity duration-700 group-hover:opacity-60"
      />

      {/* Grid Overlay for Architectural feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h3 className="services-title font-heading text-5xl font-black uppercase tracking-normal text-white transition-all md:text-6xl">
          Automations
        </h3>
        <p className="mt-4 font-mono text-sm tracking-widest text-peyk-amber/80">
          ENGINEERED SOLUTIONS
        </p>
      </div>
    </div>
  );
}
