"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollRestoration() {
  useEffect(() => {
    // Prevent the browser from restoring scroll position on reload
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Force scroll to top
    window.scrollTo(0, 0);

    // FIX FOR NEXT.JS DYNAMIC IMPORTS:
    // When dynamic components mount out-of-order, their ScrollTriggers are created out-of-order.
    // If a lower component creates a trigger, and then a higher component mounts and adds pinning,
    // the lower component's trigger will have incorrect start/end values.
    // Sorting them before every refresh guarantees they are calculated top-to-bottom.
    const sortTriggers = () => ScrollTrigger.sort();
    ScrollTrigger.addEventListener("refreshInit", sortTriggers);

    // FIX: Next.js dynamic components often change the body height silently after mount.
    // We must use a ResizeObserver on the document body to force GSAP to recalculate 
    // all trigger positions whenever the physical DOM height changes.
    let refreshTimeout: NodeJS.Timeout;
    let lastHeight = document.body.offsetHeight;
    
    const bodyObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;
        // Ignore small height changes (like iOS Safari address bar collapsing ~50-100px)
        if (Math.abs(newHeight - lastHeight) > 150) {
          lastHeight = newHeight;
          clearTimeout(refreshTimeout);
          refreshTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100); // 100ms debounce
        }
      }
    });
    bodyObserver.observe(document.body);

    // FIX: Chrome DevTools Mobile Emulation and heavy dynamic imports (next/dynamic)
    // can cause the DOM to shift significantly AFTER the initial mount.
    // By cascading refreshes during the first 2 seconds, we guarantee GSAP locks into the correct layout.
    const loadTimeouts = [100, 500, 1000, 2000].map(time => 
      setTimeout(() => ScrollTrigger.refresh(), time)
    );

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", sortTriggers);
      bodyObserver.disconnect();
      clearTimeout(refreshTimeout);
      loadTimeouts.forEach(clearTimeout);
    };
  }, []);

  return null;
}
