"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KadaSplit from "./KadaSplit";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PRODUCTS = [
  {
    id: "kadasplit",
    component: <KadaSplit />,
    title: "KadaSplit",
  },
  // Future products can be added here
];

export default function ShowcaseDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length < 2) return; // No stacking effect needed for 1 card

    // For each card (except the last one), create a timeline that shrinks it
    // when the NEXT card scrolls over it.
    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;

      const nextCard = cards[index + 1];
      
      gsap.to(card, {
        scale: 0.95,
        yPercent: -5,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: nextCard,
          start: "top bottom", // When next card enters viewport
          end: "top top",      // When next card reaches the top
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="showcase" ref={containerRef} className="relative w-full bg-transparent">
      {PRODUCTS.map((product, index) => (
        <div
          key={product.id}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
          className="relative w-full shadow-2xl"
          style={{ zIndex: index + 10 }}
        >
          {product.component}
        </div>
      ))}
    </section>
  );
}
