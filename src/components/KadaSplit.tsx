"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function KadaSplit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phone1Ref = useRef<HTMLImageElement>(null);
  const phone2Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const p1 = phone1Ref.current;
    const p2 = phone2Ref.current;
    if (!container || !p1 || !p2) return;

    // Subtle 3D parallax on mouse move (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(p1, {
        x: x * -40,
        y: y * -40,
        rotationY: x * 10,
        rotationX: y * -10,
        duration: 1,
        ease: "power2.out",
      });

      gsap.to(p2, {
        x: x * 60,
        y: y * 60,
        rotationY: x * 15,
        rotationX: y * -15,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to([p1, p2], {
        x: 0,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: "power2.out",
      });
    };

    // Only apply on desktop where hover is supported
    if (window.matchMedia("(hover: hover)").matches) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background [perspective:1000px]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-20">
        <h3 className="font-heading text-6xl font-black uppercase tracking-widest text-white">KadaSplit</h3>
        <p className="font-mono text-sm tracking-widest text-peyk-amber">PROPRIETARY INFRASTRUCTURE</p>
      </div>

      <div className="relative flex h-[70%] w-full max-w-xl items-center justify-center mt-12">
        <Image
          ref={phone1Ref}
          src="/assets/images/kadasplit_slices/Slice 1.png"
          alt="KadaSplit App Interface"
          width={500}
          height={1000}
          className="absolute z-10 w-[55%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] will-change-transform"
          style={{ transformOrigin: "center" }}
        />
        <Image
          ref={phone2Ref}
          src="/assets/images/kadasplit_slices/Slice 2.png"
          alt="KadaSplit Analytics Interface"
          width={500}
          height={1000}
          className="absolute left-[50%] top-10 z-0 w-[45%] object-contain opacity-60 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] will-change-transform"
          style={{ transformOrigin: "center" }}
        />
      </div>
    </div>
  );
}
