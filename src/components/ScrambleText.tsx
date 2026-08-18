"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-{}[]|:;<>,.?/";

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: any;
}

export default function ScrambleText({ text, className = "", as: Component = "span" }: ScrambleTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const originalText = text;
    let iteration = 0;
    let animationFrame: number;
    let isVisible = false;

    // Scramble function
    const scramble = () => {
      if (iteration >= originalText.length) {
        el.innerText = originalText;
        return;
      }

      el.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index]; // Revealed letter
          }
          if (letter === " ") return " "; // Don't scramble spaces
          return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        })
        .join("");

      iteration += 1 / 3; // Controls speed (lower = slower)
      animationFrame = requestAnimationFrame(scramble);
    };

    // Trigger on scroll using GSAP ScrollTrigger
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%", // Trigger when slightly in view
      onEnter: () => {
        if (!isVisible) {
          isVisible = true;
          iteration = 0;
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(scramble);
        }
      },
      onLeaveBack: () => {
        // Reset when scrolled completely out of view going up
        isVisible = false;
        el.innerText = originalText
          .split("")
          .map(char => (char === " " ? " " : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]))
          .join("");
      }
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [text]);

  return (
    <Component ref={textRef} className={className}>
      {text}
    </Component>
  );
}
