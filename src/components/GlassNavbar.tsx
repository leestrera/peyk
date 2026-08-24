"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const pullStringRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  
  // Physics State
  const swayLocked = useRef(false);
  const pendulumAngle = useRef(0);
  const pendulumVelocity = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // 300px perfectly matches the ApertureHero GSAP pin duration
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Intersection Observer for Scroll Spy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" } // Trigger when section is in the middle of the screen
    );

    const sections = ["purpose", "showcase", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Pendulum Physics loop
  useEffect(() => {
    let animationFrameId: number;
    const pendulumGravity = 0.02;
    const pendulumDamping = 0.94;
    
    lastScrollY.current = window.scrollY;
    
    // Disable physics loop entirely on touch devices / mobile to save battery and GPU
    if (typeof window !== 'undefined' && (window.matchMedia('(hover: none)').matches || window.innerWidth < 768)) return;

    const updatePendulum = () => {
      if (!pullStringRef.current) {
         animationFrameId = requestAnimationFrame(updatePendulum);
         return;
      }

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      const boundedDelta = Math.max(Math.min(scrollDelta, 80), -80);
      const acceleration = (boundedDelta * 0.00015) - (Math.sin(pendulumAngle.current) * pendulumGravity);

      pendulumVelocity.current += acceleration;
      pendulumVelocity.current *= pendulumDamping;
      pendulumAngle.current += pendulumVelocity.current;

      const maxAngle = Math.PI / 2.5;
      if (pendulumAngle.current > maxAngle) {
        pendulumAngle.current = maxAngle;
        pendulumVelocity.current *= -0.5;
      } else if (pendulumAngle.current < -maxAngle) {
        pendulumAngle.current = -maxAngle;
        pendulumVelocity.current *= -0.5;
      }

      // PERFORMANCE OPTIMIZATION: Put physics to sleep when perfectly still 
      // (prevents 60fps layout thrashing when user is not scrolling)
      if (Math.abs(scrollDelta) < 0.5 && Math.abs(pendulumVelocity.current) < 0.001 && Math.abs(pendulumAngle.current) < 0.001) {
        pendulumAngle.current = 0;
        pendulumVelocity.current = 0;
        // Optional: snap to 0 once, but avoid doing it every frame
      } else {
        if (!swayLocked.current && pullStringRef.current) {
          gsap.set(pullStringRef.current, {
            rotation: pendulumAngle.current * (180 / Math.PI),
            overwrite: "auto"
          });
        }
      }

      animationFrameId = requestAnimationFrame(updatePendulum);
    };

    animationFrameId = requestAnimationFrame(updatePendulum);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleRopeClick = () => {
    if (!threadRef.current || !pullStringRef.current) return;
    
    setIsMenuOpen(prev => !prev);
    swayLocked.current = true;
    
    gsap.to(threadRef.current, {
      height: 100,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(threadRef.current, { height: 40, duration: 0.6, ease: "elastic.out(1, 0.5)" });
        
        gsap.to(pullStringRef.current, {
          keyframes: [
            { rotation: 6, duration: 0.15, ease: "power2.out" },
            { rotation: -5, duration: 0.3, ease: "power1.inOut" },
            { rotation: 4, duration: 0.3, ease: "power1.inOut" },
            { rotation: -2.5, duration: 0.3, ease: "power1.inOut" },
            { rotation: 1, duration: 0.25, ease: "power1.inOut" },
            { rotation: 0, duration: 0.2, ease: "power1.out" },
          ],
          onComplete: () => {
            pendulumAngle.current = 0;
            pendulumVelocity.current = 0;
            swayLocked.current = false;
          }
        });
      }
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto relative flex flex-col md:flex-row items-center justify-between rounded-3xl md:rounded-full px-6 py-8 md:py-2 gap-6 md:gap-0 transition-all duration-700 ease-out w-[90vw] md:w-auto mx-auto
          ${!isScrolled 
            ? "-translate-y-[150%] opacity-0" 
            : isMenuOpen 
              ? "translate-y-6 opacity-100 bg-[#09090b]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10" 
              : "-translate-y-[100%] opacity-100"
          }
        `}
      >
        
        {/* === THE ROPE (Hangs off the bottom of the navbar) === */}
        <div 
          className={`absolute top-[100%] right-6 md:right-12 transition-opacity duration-500 ease-in-out ${isScrolled ? "opacity-100" : "opacity-0"}`}
        >
          <div ref={pullStringRef} className="nav-pull-string" onClick={handleRopeClick}>
            <div ref={threadRef} className="lanyard-thread"></div>
            <div className="lanyard-clip"></div>
            <div className="aperture-ring"></div>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center justify-center md:justify-start pb-4 md:pb-0 border-b border-white/5 md:border-none">
          <Image
            src="/assets/logos/text_logo.png"
            alt="Peyk Logo"
            width={120}
            height={40}
            className="h-5 md:h-5 w-auto object-contain invert opacity-90"
            priority
          />
        </div>

        <ul className="md:ml-12 flex flex-col md:flex-row items-center gap-2 md:gap-1 p-1 w-full md:w-auto">
          <li className="w-full md:w-auto">
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`block w-full text-center px-4 md:px-5 py-3 md:py-2 font-mono text-[11px] md:text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 rounded-full ${
                activeSection === "hero" ? "text-peyk-amber bg-peyk-amber/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "text-white/40 hover:text-peyk-amber hover:bg-peyk-amber/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              }`}
              data-magnetic
            >
              Home
            </a>
          </li>
          <li className="w-full md:w-auto">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`block w-full text-center px-4 md:px-5 py-3 md:py-2 font-mono text-[11px] md:text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 rounded-full text-white/40 hover:text-peyk-amber hover:bg-peyk-amber/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-not-allowed`}
              data-magnetic
            >
              About Us
            </a>
          </li>
          <li className="w-full md:w-auto">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`block w-full text-center px-4 md:px-5 py-3 md:py-2 font-mono text-[11px] md:text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 rounded-full text-white/40 hover:text-peyk-amber hover:bg-peyk-amber/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-not-allowed`}
              data-magnetic
            >
              Contact Us
            </a>
          </li>
        </ul>

        <div className="md:ml-12 w-full md:w-auto block pt-2 md:pt-0 border-t border-white/5 md:border-none">
          <button
            className="w-full md:w-auto rounded-full px-6 py-4 md:py-2.5 font-mono text-[11px] md:text-[10px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 border border-white/10 bg-[#09090b] text-white/70 hover:text-peyk-amber hover:border-peyk-amber/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            data-magnetic
          >
            Connect
          </button>
        </div>
      </nav>
    </header>
  );
}
