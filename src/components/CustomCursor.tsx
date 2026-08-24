"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;
    
    // Disable custom cursor tracking entirely on mobile/touch devices
    if (typeof window !== 'undefined' && (window.matchMedia('(hover: none)').matches || window.innerWidth < 768)) return;

    // Quick setters for performance
    const setInnerX = gsap.quickSetter(inner, "x", "px");
    const setInnerY = gsap.quickSetter(inner, "y", "px");
    const setOuterX = gsap.quickSetter(outer, "x", "px");
    const setOuterY = gsap.quickSetter(outer, "y", "px");

    // Bulletproof centering
    gsap.set([inner, outer], { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e: MouseEvent) => {
      // Inner dot follows instantly
      setInnerX(e.clientX);
      setInnerY(e.clientY);

      // Outer halo follows with a slight magnetic lag
      gsap.to(outer, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Magnetic hover detection for interactive elements (links, buttons, etc.)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [data-magnetic]");
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div className="custom-cursor hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Halo */}
      <div
        ref={outerRef}
        className={`absolute top-0 left-0 rounded-full border border-peyk-glass transition-all 
          ${isHovering ? "h-[70px] w-[70px] bg-peyk-silver/10" : "h-[48px] w-[48px]"}
        `}
        style={{
          transitionDuration: "400ms",
          transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      />
      {/* Inner Dot */}
      <div
        ref={innerRef}
        className={`absolute top-0 left-0 h-[26px] w-[26px] rounded-full transition-colors 
          ${isHovering ? "bg-peyk-silver shadow-[0_0_20px_rgba(245,158,11,0.6)]" : "bg-white"}
        `}
      />
    </div>
  );
}
