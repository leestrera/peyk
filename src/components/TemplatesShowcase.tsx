"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CircuitTraces from "./CircuitTraces";
import TemplateCircuits from "./TemplateCircuits";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const TEMPLATES = [
  {
    id: "title",
    isTitle: true,
    title: "TEMPLATES",
  },
  {
    id: "cafe",
    title: "Your Cafe",
    desc: "A sleek, modern coffee shop ordering experience.",
    desktopImage: "/assets/images/your_cafe/your_cafe_desktop.png",
    mobileImage: "/assets/images/your_cafe/your_cafe_mobile.png",
    features: ["UI/UX Design", "Web Development", "Deployment", "Payment Integration", "Staff Training", "SEO Optimization"],
    url: "https://yourcafe-peyk.vercel.app/"
  },
  {
    id: "resort",
    title: "Your Resort",
    desc: "A luxury hotel booking and itinerary interface.",
    desktopImage: "/assets/images/your_resort/your_resort_desktop.png",
    mobileImage: "/assets/images/your_resort/your_resort_mobile.png",
    features: ["Brand Identity", "Booking Engine", "Interactive Maps", "SEO Optimization", "Web Development", "Copywriting"],
    url: "https://yourresort-peyk.vercel.app/"
  },
  {
    id: "vet",
    title: "Your Vet Clinic",
    desc: "A compassionate and clean veterinary portal.",
    desktopImage: "/assets/images/your_vet_clinic/your_vet_clinic_desktop.png",
    mobileImage: "/assets/images/your_vet_clinic/your_vet_clinic_mobile.png",
    features: ["Patient Portal", "Scheduling System", "UI/UX Design", "Secure Database", "Deployment", "Compliance"],
    url: "https://yourvet-peyk.vercel.app/"
  },
];

const BACKGROUND_WORDS = [
  "UI UX CX Design", "UX Design", "Prototyping", "Wireframing", "Usability Testing",
  "Website Development", "Front-End", "Back-End", "Full-Stack", "E-Commerce",
  "Mobile App Development", "iOS Native", "Android Native", "React Native", "Flutter",
  "Digital Marketing", "SEO Strategy", "PPC Campaigns", "Social Media", "Content",
  "Cloud Solutions", "AWS Cloud", "Azure Infrastructure", "Cloud Migration", "DevOps",
  "AI & Machine Learning", "Generative AI", "Predictive Models", "NLP", "Computer Vision",
  "Blockchain", "Smart Contracts", "Web3", "DeFi Solutions", "dApps"
];

export default function TemplatesShowcase() {
  const [activeTheme, setActiveTheme] = useState('title');
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]); // For the content layers
  const wallRefs = useRef<(HTMLDivElement | null)[]>([]);  // For the background layers
  const parallaxInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleTextRef = useRef<HTMLDivElement>(null);
  const bgWordsRef = useRef<HTMLDivElement>(null);
  const abyssRef = useRef<HTMLDivElement>(null);

  const titleLetters = "TEMPLATES".split("");

  const mousePos = useRef({ x: -1000, y: -1000 });
  const holeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let rafId: number;

    const updateHoles = () => {
      wallRefs.current.forEach(wallEl => {
        if (!wallEl) return;
        const rect = wallEl.getBoundingClientRect();
        const localX = mousePos.current.x - rect.left;
        const localY = mousePos.current.y - rect.top;
        wallEl.style.setProperty('--mouse-x', `${localX}px`);
        wallEl.style.setProperty('--mouse-y', `${localY}px`);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHoles);

      // Open hole
      wallRefs.current.forEach(wallEl => {
        if (wallEl) gsap.to(wallEl, { '--hole-radius': '80px', duration: 0.3, ease: 'power2.out' });
      });

      // Close hole after 0.5 seconds of inactivity
      if (holeTimeoutRef.current) clearTimeout(holeTimeoutRef.current);
      holeTimeoutRef.current = setTimeout(() => {
        wallRefs.current.forEach(wallEl => {
          if (wallEl) gsap.to(wallEl, { '--hole-radius': '0px', duration: 0.6, ease: 'power2.inOut' });
        });
      }, 500);
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHoles);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (holeTimeoutRef.current) clearTimeout(holeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const hideOverlappingWords = () => {
      if (!titleTextRef.current || !bgWordsRef.current) return;

      const titleBox = titleTextRef.current.getBoundingClientRect();
      const padding = 10;

      const words = bgWordsRef.current.querySelectorAll('.bg-word');

      words.forEach((word) => {
        const wordBox = word.getBoundingClientRect();
        const isOverlapping = !(
          wordBox.right < titleBox.left - padding ||
          wordBox.left > titleBox.right + padding ||
          wordBox.bottom < titleBox.top - padding ||
          wordBox.top > titleBox.bottom + padding
        );

        if (isOverlapping) {
          (word as HTMLElement).style.visibility = 'hidden';
        } else {
          (word as HTMLElement).style.visibility = 'visible';
        }
      });
    };

    setTimeout(hideOverlappingWords, 100);
    window.addEventListener('resize', hideOverlappingWords);

    const glitchInterval = setInterval(() => {
      if (!bgWordsRef.current) return;
      const words = bgWordsRef.current.querySelectorAll('.bg-word');
      if (words.length === 0) return;

      const numGlitches = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numGlitches; i++) {
        const randomIdx = Math.floor(Math.random() * words.length);
        const wordEl = words[randomIdx] as HTMLElement;

        if (wordEl.classList.contains('glitch-active') || wordEl.style.visibility === 'hidden') continue;

        wordEl.classList.add('glitch-active');

        setTimeout(() => {
          if (!wordEl.isConnected) return;
          const randomNewWord = BACKGROUND_WORDS[Math.floor(Math.random() * BACKGROUND_WORDS.length)];
          wordEl.textContent = randomNewWord;
          hideOverlappingWords();
        }, 150);

        setTimeout(() => {
          if (wordEl.isConnected) {
            wordEl.classList.remove('glitch-active');
          }
        }, 300);
      }
    }, 400);

    return () => {
      window.removeEventListener('resize', hideOverlappingWords);
      clearInterval(glitchInterval);
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    gsap.set(cloudRefs.current[0], { x: "-100vw" });
    gsap.set(cloudRefs.current[1], { x: "100vw" });
    gsap.set(cloudRefs.current[2], { x: "100vw" });
    gsap.set(cloudRefs.current[3], { x: "100vw" });
    gsap.set(wallRefs.current[0], { x: "-100vw" });
    gsap.set(wallRefs.current[1], { x: "100vw" });
    gsap.set(wallRefs.current[2], { x: "100vw" });
    gsap.set(wallRefs.current[3], { x: "100vw" });
    gsap.set(abyssRef.current, { opacity: 0 });

    const scatterPos = [
      { x: "-150vw", y: "-150vh", rotation: -45, scale: 5 },
      { x: "100vw", y: "-200vh", rotation: 90, scale: 3 },
      { x: "-50vw", y: "150vh", rotation: 180, scale: 6 },
      { x: "150vw", y: "100vh", rotation: -120, scale: 4 },
      { x: "0vw", y: "-150vh", rotation: 45, scale: 5 },
      { x: "-150vw", y: "0vh", rotation: -90, scale: 3 },
      { x: "100vw", y: "150vh", rotation: 135, scale: 6 },
      { x: "-100vw", y: "-100vh", rotation: -180, scale: 4 },
      { x: "150vw", y: "0vh", rotation: 90, scale: 5 },
    ];

    const letters = document.querySelectorAll('.template-letter');
    letters.forEach((letter, i) => {
      gsap.set(letter, {
        x: scatterPos[i]?.x || "0vw",
        y: scatterPos[i]?.y || "0vh",
        rotation: scatterPos[i]?.rotation || 0,
        scale: scatterPos[i]?.scale || 1,
        opacity: 0
      });
    });

    tl.to(abyssRef.current, { opacity: 1, ease: "power1.inOut", duration: 3 }, 3.0);
    tl.to(wallRefs.current[0], { x: "0vw", ease: "power1.inOut", duration: 3 }, 0);
    tl.to(cloudRefs.current[0], { x: "0vw", ease: "power1.inOut", duration: 3 }, 0);
    tl.to(letters, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 2.0, stagger: 0.1, ease: "power2.out" }, 2.0);
    tl.to(bgWordsRef.current, { opacity: 1, duration: 2.0 }, 4.5);
    tl.to({}, { duration: 2.0 }, 6.5);

    // Cloud 1 Enters, Cloud 0 Exits
    tl.to(wallRefs.current[1], { x: "0vw", ease: "power1.inOut", duration: 3 }, 8.0);
    tl.to(wallRefs.current[0], { x: "-100vw", ease: "power1.inOut", duration: 3 }, 8.0); // BGs push each other
    tl.to(cloudRefs.current[1], { x: "0vw", ease: "power1.inOut", duration: 3, onStart: () => setActiveTheme('cafe'), onReverseComplete: () => setActiveTheme('title') }, 8.0);
    tl.to(cloudRefs.current[0], { autoAlpha: 0, duration: 2 }, 8.0); // Content stays stacked but fades out

    tl.to(titleTextRef.current, { autoAlpha: 0, duration: 1.5 }, 8.5);
    tl.to({}, { duration: 3 }, 11.0);

    // Cloud 2 Enters, Cloud 1 Exits
    tl.to(wallRefs.current[2], { x: "0vw", ease: "power1.inOut", duration: 3 }, 14.0);
    tl.to(wallRefs.current[1], { x: "-100vw", ease: "power1.inOut", duration: 3 }, 14.0); // BGs push each other
    tl.to(cloudRefs.current[2], { x: "0vw", ease: "power1.inOut", duration: 3, onStart: () => setActiveTheme('resort'), onReverseComplete: () => setActiveTheme('cafe') }, 14.0);
    tl.to(cloudRefs.current[1], { autoAlpha: 0, duration: 2 }, 14.0); // Content stays stacked but fades out

    tl.to(parallaxInnersRef.current[1], { autoAlpha: 0, duration: 1.5 }, 14.5);
    tl.to({}, { duration: 3 }, 17.0);

    // Cloud 3 Enters, Cloud 2 Exits
    tl.to(wallRefs.current[3], { x: "0vw", ease: "power1.inOut", duration: 3 }, 20.0);
    tl.to(wallRefs.current[2], { x: "-100vw", ease: "power1.inOut", duration: 3 }, 20.0); // BGs push each other
    tl.to(cloudRefs.current[3], { x: "0vw", ease: "power1.inOut", duration: 3, onStart: () => setActiveTheme('vet'), onReverseComplete: () => setActiveTheme('resort') }, 20.0);
    tl.to(cloudRefs.current[2], { autoAlpha: 0, duration: 2 }, 20.0); // Content stays stacked but fades out

    tl.to(parallaxInnersRef.current[2], { autoAlpha: 0, duration: 1.5 }, 20.5);
    tl.to({}, { duration: 3 }, 23.0);
  }, { scope: containerRef });

  return (
    <section id="templates" ref={containerRef} className="relative w-full h-[800vh] bg-transparent z-20 -mt-[150vh]">
      <style>{`
        @keyframes templateMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes text-glitch-swap {
          0% { transform: skew(0deg); text-shadow: none; opacity: 1; filter: blur(0px); }
          20% { transform: skew(-10deg) translate(-2px, 1px); text-shadow: 2px 0px #f59e0b, -2px 0px #00e5ff; opacity: 0.8; filter: blur(1px); }
          40% { transform: skew(10deg) translate(2px, -1px); text-shadow: -2px 0px #f59e0b, 2px 0px #00e5ff; opacity: 1; filter: blur(0px); }
          60% { transform: skew(-5deg) translate(-1px, -2px); text-shadow: 2px 0px #f59e0b, -2px 0px #00e5ff; opacity: 0.5; filter: blur(1px); }
          80% { transform: skew(5deg) translate(1px, 2px); text-shadow: -2px 0px #f59e0b, 2px 0px #00e5ff; opacity: 1; filter: blur(0px); }
          100% { transform: skew(0deg); text-shadow: none; opacity: 1; filter: blur(0px); }
        }
        .glitch-active {
          animation: text-glitch-swap 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          position: relative;
          z-index: 10;
        }
      `}</style>

      {/* The sticky container is transparent and pointer-events-none so clicks pass through to AgencyServices initially */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-transparent pointer-events-none">

        {/* GLOBAL ABYSS AND CIRCUIT TRACES */}
        {/* Rendered exactly once, sits fixed in the background behind all sliding clouds */}
        <div ref={abyssRef} className="absolute inset-0 w-full h-full pointer-events-none z-[5] bg-[#09090b]">
          <div className="absolute inset-0 opacity-10 mix-blend-screen">
            <TemplateCircuits color="#f59e0b" glow={true} />
          </div>
        </div>

        {TEMPLATES.map((template, i) => (
          <div
            key={template.id}
            className="absolute -top-[25vh] w-screen h-[150vh] pointer-events-none z-[20] flex items-center justify-center"
          >
            {/* BACKGROUND LAYER (Slides left on exit) */}
            <div
              ref={el => { wallRefs.current[i] = el; }}
              className="absolute inset-0 w-full h-full pointer-events-none z-[10]"
              style={{
                willChange: "transform",
                background: template.isTitle ? "transparent" : "radial-gradient(circle var(--hole-radius, 0px) at var(--mouse-x, -1000px) var(--mouse-y, -1000px), transparent 0%, transparent 80%, #f4f4f5 100%)",
              }}
            >
              {template.isTitle && (
                <div className="absolute inset-0 w-full h-full" style={{ filter: "blur(60px)", transform: "scale(1.2)" }}>
                  <div
                    className="w-full h-full bg-[#050507]"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 93% 50%, 100% 100%, 0% 100%)" }}
                  />
                </div>
              )}
            </div>

            {/* CONTENT LAYER (Stays fixed on exit, gets swallowed) */}
            <div
              ref={el => { cloudRefs.current[i] = el; }}
              className="relative z-20 flex items-center justify-center w-full h-full"
              style={{ willChange: "transform" }}
            >
              {template.isTitle ? (
                <div className="relative flex items-center justify-center w-[100vw] h-full">
                  <div ref={bgWordsRef} className="absolute inset-0 z-0 flex flex-wrap content-start justify-between gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-5 opacity-0 pointer-events-none p-4 md:p-8 overflow-hidden">
                    {[...Array(10)].flatMap(() => BACKGROUND_WORDS).map((word, idx) => (
                      <span key={idx} className="bg-word font-heading text-xs md:text-sm lg:text-lg font-black uppercase text-white tracking-[0.2em] select-none whitespace-nowrap text-center">
                        {word}
                      </span>
                    ))}
                  </div>

                  <div ref={titleTextRef} className="relative pointer-events-auto z-20 flex items-center justify-center overflow-visible">
                    <h1 className="font-heading text-5xl sm:text-6xl md:text-[150px] lg:text-[180px] font-black uppercase tracking-tighter text-white leading-none select-none flex">
                      {titleLetters.map((char, index) => (
                        <span key={index} className="template-letter inline-block origin-center will-change-transform">
                          {char}
                        </span>
                      ))}
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="relative w-[100vw] h-full flex items-center justify-center">
                  <div ref={el => { parallaxInnersRef.current[i] = el; }} className="relative w-[95vw] md:w-[85vw] max-w-[1400px] pointer-events-auto z-20 flex flex-col md:flex-row items-center justify-between p-4 md:p-12 gap-12 lg:gap-24">
                    <div className="w-full md:w-1/3 flex flex-col items-start justify-center text-left">
                      <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#09090b]/50 uppercase mb-4">Template Architecture</p>
                      <h3 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-[#09090b] uppercase tracking-tighter mb-6 leading-[0.9]">{template.title}</h3>
                      <p className="text-zinc-600 font-medium text-base md:text-lg lg:text-xl max-w-[400px] leading-relaxed mb-8">{template.desc}</p>
                      {template.features && (
                        <div className="w-full max-w-[400px] overflow-hidden flex items-center border-y border-[#09090b]/10 py-4 relative" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
                          <div className="flex w-max" style={{ animation: "templateMarquee 20s linear infinite" }}>
                            {[...template.features, ...template.features].map((feat, idx) => (
                              <div key={idx} className="flex items-center">
                                <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#09090b]/70 uppercase whitespace-nowrap">{feat}</span>
                                <span className="w-1.5 h-1.5 bg-[#09090b]/30 rounded-full mx-6" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {template.url && (
                        <div className="mt-8">
                          <a href={template.url} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#09090b] text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                            <span className="relative z-10 flex items-center gap-3">Visit Live Site <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" /></svg></span>
                            <div className="absolute inset-0 bg-black/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="relative w-full md:w-2/3 flex items-center justify-center group">
                      <div className="relative w-[90%] md:w-full max-w-[800px] aspect-[16/10] bg-zinc-900 rounded-xl md:rounded-3xl border-[4px] md:border-[8px] border-zinc-800 shadow-[0_32px_80px_rgba(0,0,0,0.4)] flex flex-col z-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[0.98] group-hover:opacity-60 group-hover:blur-sm">
                        <div className="w-full h-4 md:h-6 bg-zinc-900 rounded-t-xl md:rounded-t-2xl flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                        </div>
                        <div className="w-full flex-1 bg-white overflow-hidden relative">
                          <img src={template.desktopImage} className="absolute inset-0 w-full h-full object-cover object-top" alt={`${template.title} Desktop`} />
                        </div>
                        <div className="w-full h-4 md:h-8 bg-zinc-900 rounded-b-xl md:rounded-b-2xl shrink-0 border-t border-white/5" />
                        <div className="absolute -bottom-6 md:-bottom-12 left-1/2 -translate-x-1/2 w-24 md:w-40 h-6 md:h-12 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-b-lg -z-10" />
                        <div className="absolute -bottom-8 md:-bottom-14 left-1/2 -translate-x-1/2 w-32 md:w-56 h-2 md:h-3 bg-zinc-800 rounded-full shadow-2xl -z-10" />
                      </div>

                      <div className="absolute -right-2 md:-right-8 -bottom-8 md:-bottom-16 w-[35%] max-w-[220px] aspect-[9/19] bg-zinc-950 rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[8px] border-zinc-800 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-20 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] scale-100 translate-x-0 translate-y-0 group-hover:right-1/2 group-hover:bottom-1/2 group-hover:translate-x-1/2 group-hover:translate-y-1/2 group-hover:scale-[1.3] md:group-hover:scale-[1.6] group-hover:shadow-[0_60px_120px_rgba(0,0,0,0.8)]">
                        <div className="w-full h-full bg-white relative">
                          <img src={template.mobileImage} className="absolute inset-0 w-full h-full object-cover object-center" alt={`${template.title} Mobile`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
