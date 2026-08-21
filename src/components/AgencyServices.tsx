"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { id: "01", titles: ["UI UX CX Design", "UX Design", "Prototyping", "Wireframing", "Usability Testing"] },
  { id: "02", titles: ["Website Development", "Front-End", "Back-End", "Full-Stack", "E-Commerce"] },
  { id: "03", titles: ["Mobile App Development", "iOS Native", "Android Native", "React Native", "Flutter"] },
  { id: "04", titles: ["Digital Marketing", "SEO Strategy", "PPC Campaigns", "Social Media", "Content"] },
  { id: "05", titles: ["Cloud Solutions", "AWS Cloud", "Azure Infrastructure", "Cloud Migration", "DevOps"] },
  { id: "06", titles: ["AI & Machine Learning", "Generative AI", "Predictive Models", "NLP", "Computer Vision"] },
  { id: "07", titles: ["Blockchain", "Smart Contracts", "Web3", "DeFi Solutions", "dApps"] },
];

function LoopingTitle({ titles }: { titles: string[] }) {
  const [index, setIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!textRef.current) return;
      gsap.to(textRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          setIndex((prev) => (prev + 1) % titles.length);
          if (textRef.current) {
            gsap.fromTo(textRef.current, 
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
          }
        }
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [titles]);

  return (
    <h2 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-tight flex-1 flex items-center justify-center text-center px-4">
       <span ref={textRef} className="block">{titles[index]}</span>
    </h2>
  );
}

export default function AgencyServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameCount = 240;
    const currentFrame = (index: number) => 
      `/assets/frames/agency/${String(index + 1).padStart(4, "0")}.jpg`;

    // Preload images
    const images: HTMLImageElement[] = [];
    const imageSeq = { frame: 0 };
    
    // Create an initial image to trigger the first render
    const initialImg = new Image();
    initialImg.src = currentFrame(0);
    
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const img = images[imageSeq.frame];
      if (!img || !img.complete) return;

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 to balance quality and performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Ensure high quality scaling when drawing the frames
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      
      render();
    };

    window.addEventListener("resize", resizeCanvas);
    initialImg.onload = resizeCanvas; // Render first frame when loaded

    // 1. Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      }
    });

    // Timing Constants
    const durationAppear = 1.0;
    const durationHold = 1.5; // Hold in center longer
    const durationExit = 1.0;
    const totalCardTime = durationAppear + durationHold + durationExit; // 3.5
    // Stagger so the next card starts appearing AFTER the current card begins its exit.
    // Exit begins at 2.5 (1.0 + 1.5). We start the next card at 2.7.
    const stagger = 2.7; 
    const totalTimelineDuration = (SERVICES.length - 1) * stagger + totalCardTime;

    // 2. Scrub Canvas Frames over the master timeline
    tl.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: totalTimelineDuration,
      onUpdate: render,
    }, 0);

    // 3. Animate Cards (Stacked in center, scaling up and zooming out)
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      
      const isOdd = i % 2 !== 0; 
      const exitX = isOdd ? "-100vw" : "100vw";
      const content = card.querySelector(".card-content");

      // Initial state: hidden by being infinitely small (scale: 0) and completely solid
      gsap.set(content, { opacity: 1, scale: 0, x: 0, rotation: 0 });

      const startTime = i * stagger;

      // Phase 1: Grow from a solid dot to full size
      tl.to(content, {
        scale: 1,
        duration: durationAppear,
        ease: "power2.out"
      }, startTime);
      
      // Phase 2: Hold but keep slowly zooming ("get closer and closer")
      tl.to(content, {
        scale: 1.05,
        duration: durationHold,
        ease: "none"
      }, startTime + durationAppear);

      // Phase 3: Exit left/right while zooming more
      tl.to(content, {
        x: exitX,
        opacity: 0,
        rotation: isOdd ? -15 : 15,
        scale: 1.15,
        duration: durationExit,
        ease: "power2.in"
      }, startTime + durationAppear + durationHold);
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-background z-10 h-[800vh] -mt-[100vh]">
      
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0">
        
        {/* Unified masked container for the video and vignette */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
          }}
        >
          {/* Canvas Background */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Extremely subtle vignette to preserve text readability without darkening the center */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
        </div>
        
        {/* Cards Stacked in the exact center */}
        {SERVICES.map((service, i) => (
          <div 
            key={service.id} 
            ref={el => { cardsRef.current[i] = el; }} 
            className="absolute inset-0 w-full h-full flex items-center justify-center px-4 pointer-events-none z-20"
          >
            <div className="card-content pointer-events-auto w-[75vw] max-w-[320px] aspect-square backdrop-blur-lg bg-black/30 border border-white/10 rounded-none p-6 md:p-8 flex flex-col items-center opacity-0 scale-50">
              
              {/* Static Identifier */}
              <div className="w-full text-center border-b border-white/5 pb-4 mb-2">
                <span className="font-mono text-[10px] md:text-xs tracking-widest text-peyk-amber uppercase">
                  {service.titles[0]}
                </span>
              </div>
              
              {/* Looping Subtitles */}
              <div className="flex-1 flex items-center justify-center w-full">
                <LoopingTitle titles={service.titles.slice(1)} />
              </div>
              
            </div>
          </div>
        ))}
        
      </div>
      
    </section>
  );
}
