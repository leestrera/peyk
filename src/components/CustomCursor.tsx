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

    // Quick setters for performance
    const setInnerX = gsap.quickSetter(inner, "x", "px");
    const setInnerY = gsap.quickSetter(inner, "y", "px");
    const setOuterX = gsap.quickSetter(outer, "x", "px");
    const setOuterY = gsap.quickSetter(outer, "y", "px");

    const handleMouseMove = (e: MouseEvent) => {
      // Inner dot follows instantly
      setInnerX(e.clientX - 13); // 26px / 2 = 13
      setInnerY(e.clientY - 13);

      // Outer halo follows with a slight magnetic lag
      gsap.to(outer, {
        x: e.clientX - 24, // 48px / 2 = 24
        y: e.clientY - 24,
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
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Halo */}
      <div
        ref={outerRef}
        className={`absolute top-0 left-0 rounded-full border border-peyk-glass transition-all will-change-transform
          ${isHovering ? "h-[70px] w-[70px] -translate-x-[35px] -translate-y-[35px] bg-peyk-amber/10" : "h-[48px] w-[48px] -translate-x-[24px] -translate-y-[24px]"}
        `}
        style={{
          transitionDuration: "400ms",
          transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      />
      {/* Inner Dot */}
      <div
        ref={innerRef}
        className={`absolute top-0 left-0 h-[26px] w-[26px] -translate-x-[13px] -translate-y-[13px] rounded-full transition-colors will-change-transform
          ${isHovering ? "bg-peyk-amber shadow-[0_0_20px_rgba(245,158,11,0.6)]" : "bg-white"}
        `}
      />
    </div>
  );
}
