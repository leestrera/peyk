"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [isLightBg, setIsLightBg] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const checkBackground = () => {
      // Use elementsFromPoint to get the entire visual stack from front to back
      const els = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight - 30);
      let isLight = false;
      
      for (const el of els) {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
          
          // Only consider backgrounds that are somewhat opaque
          if (a > 0.1) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);
            // Calculate luminance
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            isLight = luma > 128; // If > 128, it's a light background
            break; // Stop at the first solid background we see!
          }
        }
      }
      
      setIsLightBg(isLight);
    };

    const handleScroll = () => {
      // Hide immediately on scroll
      setIsVisible(false);
      clearTimeout(scrollTimeout);

      // Check if at bottom or near bottom (85%+ of page).
      // We check 85% because the ContactTerminal has a GSAP pinned section that
      // freezes physical scrolling while scrubbing through the animation.
      // Without this, the indicator reappears during the pin's idle period.
      const scrollProgress = window.scrollY / (document.body.offsetHeight - window.innerHeight);
      const scrolledToBottom = scrollProgress >= 0.85 || 
        (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50);
      setIsAtBottom(scrolledToBottom);

      // If not at bottom and preloading is done, set timeout to show indicator
      if (!scrolledToBottom && !document.body.classList.contains('is-preloading')) {
        scrollTimeout = setTimeout(() => {
          checkBackground();
          setIsVisible(true);
        }, 800); // 0.8 seconds of inactivity
      }
    };

    // Observer to detect when preloader finishes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const hasPreload = document.body.classList.contains("is-preloading");
          setIsPreloading(hasPreload);
          
          if (!hasPreload) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              if (window.scrollY < document.body.offsetHeight - window.innerHeight - 50) {
                checkBackground();
                setIsVisible(true);
              }
            }, 800);
          } else {
            setIsVisible(false);
          }
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    // Initial check just in case preloader is already gone
    if (!document.body.classList.contains('is-preloading')) {
      setIsPreloading(false);
      scrollTimeout = setTimeout(() => {
        checkBackground();
        setIsVisible(true);
      }, 800);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, []);

  if (isPreloading) return null;

  // Dynamic colors based on sampled DOM background
  const textColor = isLightBg ? "text-zinc-900" : "text-white";
  const lineBg = isLightBg ? "bg-zinc-900/20" : "bg-white/30";
  const movingLineBg = isLightBg ? "bg-zinc-900" : "bg-white";

  return (
    <div 
      className={`fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isVisible && !isAtBottom ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span className={`font-mono text-[9px] uppercase tracking-[0.4em] transition-colors duration-300 ${textColor}`}>
        Scroll
      </span>
      <div className={`w-[1px] h-10 relative overflow-hidden transition-colors duration-300 ${lineBg}`}>
        <div 
          className={`absolute top-0 left-0 w-full h-[50%] transition-colors duration-300 ${movingLineBg}`}
          style={{ animation: "scrollIndicator 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite" }} 
        />
      </div>
    </div>
  );
}
