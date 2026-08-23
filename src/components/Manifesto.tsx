"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CircuitTraces from "./CircuitTraces";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

function useScrambleText(text: string) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let frame = 0;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    
    for (let i = 0; i < text.length; i++) {
      const from = text[i] || "";
      const to = text[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }

    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            queue[i].char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          output += `<span class="text-peyk-silver/50">${queue[i].char}</span>`;
        } else {
          output += from;
        }
      }

      setDisplayText(output);

      if (complete === queue.length) {
        setIsScrambling(false);
      } else {
        frame++;
        requestAnimationFrame(update);
      }
    };

    update();
  }, [isScrambling, text]);

  return { displayText, scramble };
}

export default function Manifesto() {
  const containerRef = useRef<HTMLElement>(null);
  const targetText = "We don't just build for clients. We build for the world.";
  const { displayText, scramble } = useScrambleText(targetText);
  const hasTriggered = useRef(false);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    ScrollTrigger.create({
      trigger: container,
      start: "top 75%",
      onEnter: () => {
        if (!hasTriggered.current) {
          hasTriggered.current = true;
          scramble();
        }
      }
    });
  }, { scope: containerRef, dependencies: [scramble] });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Flashlight effect
      containerRef.current.style.background = `radial-gradient(circle 800px at ${x}px ${y}px, rgba(245,158,11,0.07), transparent 80%), radial-gradient(circle 400px at ${x}px ${y}px, rgba(255,255,255,0.04), transparent 80%), #09090b`;
      
      // Coordinates for the circuit trace mask
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative h-[150vh] md:h-[200vh] w-full -mt-[100vh] z-10">
      <section 
        ref={containerRef} 
        id="purpose" 
        className="bg-noise sticky top-0 flex h-screen w-full overflow-hidden flex-col items-center justify-center px-6 py-24 text-center"
        style={{
          background: "radial-gradient(circle 800px at 50% 50%, rgba(245,158,11,0.07), transparent 80%), radial-gradient(circle 400px at 50% 50%, rgba(255,255,255,0.04), transparent 80%), #09090b",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
        }}
      >

        {/* Circuit Traces: Faintly visible globally (1%), highlighted to 100% by the mouse flashlight mask. */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-90 transition-opacity duration-300"
          style={{
            maskImage: "radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.01) 100%)",
            WebkitMaskImage: "radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.01) 100%)"
          }}
        >
          <CircuitTraces color="#f59e0b" glow={true} />
        </div>

        <div className="relative z-10 max-w-4xl space-y-8">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-widest text-white">
            The Messenger<span className="text-peyk-silver">.</span>
          </h2>
          
          <p 
            className="font-cursive text-3xl sm:text-5xl md:text-7xl text-white leading-relaxed"
            dangerouslySetInnerHTML={{ __html: displayText === targetText ? targetText : displayText }}
          />
        </div>
      </section>
    </div>
  );
}
