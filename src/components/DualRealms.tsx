"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KadaSplit from "./KadaSplit";
import ServicesRealm from "./ServicesRealm";

gsap.registerPlugin(ScrollTrigger);

export default function DualRealms() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftSlotRef = useRef<HTMLDivElement>(null);
  const rightSlotRef = useRef<HTMLDivElement>(null);
  const textCardRef = useRef<HTMLDivElement>(null);

  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const topSlot = leftSlotRef.current;
    const bottomSlot = rightSlotRef.current;
    const textCard = textCardRef.current;

    if (!container || !topSlot || !bottomSlot || !textCard) return;

    // We only apply the sliding curtain math on mobile (< 768px)
    let isMobile = window.innerWidth < 768;
    let st: ScrollTrigger | null = null;

    const setupMobileCurtain = () => {
      if (!isMobile) {
        if (st) st.kill();
        // Reset desktop styles just in case
        gsap.set([topSlot, bottomSlot], { clipPath: "none" });
        gsap.set(textCard, { y: 0, top: "auto" });
        return;
      }

      // Lock standard mobile padding and isolation to prevent sub-pixel glitches
      gsap.set([topSlot, bottomSlot], {
        isolation: "isolate",
        transform: "translateZ(0)",
      });

      st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=150vh", // Scroll distance
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const slidePercent = self.progress * 100; // 0 to 100
          const yText = (slidePercent / 100) * 68;
          const yBottom = yText + 32;

          // 1. Move text card physically
          gsap.set(textCard, { top: `${yText}%` });

          // 2. Clip top slot (0 -> 66%) from the bottom
          const topSlotClipBottom = Math.max(0, Math.min(100, ((66 - yText) / 66) * 100));
          gsap.set(topSlot, { clipPath: `inset(0 0 ${topSlotClipBottom}% 0)` });

          // 3. Clip bottom slot (34 -> 100%) from the top
          const bottomSlotClipTop = Math.max(0, Math.min(100, ((yBottom - 34) / 66) * 100));
          gsap.set(bottomSlot, { clipPath: `inset(${bottomSlotClipTop}% 0 0 0)` });
        },
      });
    };

    setupMobileCurtain();

    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        setupMobileCurtain();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (st) st.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="showcase"
      className="relative flex h-screen w-full flex-col md:flex-row overflow-hidden bg-background"
    >
      {/* Mobile Text Card (Only visible & active on Mobile) */}
      <div 
        ref={textCardRef}
        className="absolute left-0 right-0 z-30 h-[32%] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center p-6 text-center md:hidden"
      >
        <h3 className="font-heading text-2xl font-black uppercase tracking-widest text-black">
          The Two Realms
        </h3>
        <p className="mt-2 font-sans text-xs text-gray-500">
          Scroll to explore Products and Services.
        </p>
      </div>

      {/* LEFT REALM (Top Slot on Mobile) */}
      <div
        ref={leftSlotRef}
        className={`group relative h-[66%] w-full transition-opacity duration-500 md:h-full md:w-1/2
          ${hoveredSide === "right" ? "md:opacity-30" : "opacity-100"}
        `}
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <KadaSplit />
      </div>

      {/* RIGHT REALM (Bottom Slot on Mobile) */}
      <div
        ref={rightSlotRef}
        className={`group absolute bottom-0 h-[66%] w-full transition-opacity duration-500 md:static md:h-full md:w-1/2
          ${hoveredSide === "left" ? "md:opacity-30" : "opacity-100"}
        `}
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <ServicesRealm />
      </div>
    </section>
  );
}
