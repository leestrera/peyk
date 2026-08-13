"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

function useScrambleText(text: string) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
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
          output += `<span class="text-peyk-amber/50">${queue[i].char}</span>`;
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
  };

  return { displayText, scramble };
}

export default function Manifesto() {
  const containerRef = useRef<HTMLElement>(null);
  const targetText = "We don't just build for clients. We build for the world.";
  const { displayText, scramble } = useScrambleText(targetText);
  const hasTriggered = useRef(false);

  useEffect(() => {
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
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [scramble]);

  return (
    <section 
      ref={containerRef} 
      id="purpose" 
      className="relative flex min-h-[70vh] w-full flex-col items-center justify-center bg-background px-6 py-24 text-center z-10"
    >
      <div className="max-w-4xl space-y-8">
        <h2 className="font-heading text-4xl font-bold uppercase tracking-widest text-white md:text-6xl">
          The Messenger<span className="text-peyk-amber">.</span>
        </h2>
        
        <p 
          className="font-cursive text-3xl text-white/90 md:text-5xl leading-relaxed"
          dangerouslySetInnerHTML={{ __html: displayText === targetText ? targetText : displayText }}
        />
      </div>
    </section>
  );
}
