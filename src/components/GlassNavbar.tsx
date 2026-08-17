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

      if (!swayLocked.current) {
        gsap.set(pullStringRef.current, {
          rotation: pendulumAngle.current * (180 / Math.PI),
          overwrite: "auto"
        });
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
        className={`pointer-events-auto relative flex items-center justify-between rounded-full px-6 py-3 transition-all duration-700 ease-out will-change-transform 
          ${!isScrolled 
            ? "-translate-y-[150%] opacity-0" 
            : isMenuOpen 
              ? "translate-y-6 opacity-100 bg-black/40 backdrop-blur-xl shadow-lg border border-white/10" 
              : "-translate-y-[100%] opacity-100"
          }
        `}
      >
        
        {/* === THE ROPE (Hangs off the bottom of the navbar) === */}
        <div 
          className={`absolute top-[100%] right-12 transition-opacity duration-500 ease-in-out ${isScrolled ? "opacity-100" : "opacity-0"}`}
        >
          <div ref={pullStringRef} className="nav-pull-string" onClick={handleRopeClick}>
            <div ref={threadRef} className="lanyard-thread"></div>
            <div className="lanyard-clip"></div>
            <div className="aperture-ring"></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/assets/logos/text_logo.png"
            alt="Peyk Logo"
            width={120}
            height={40}
            className="h-6 w-auto object-contain invert"
            priority
          />
        </div>

        <ul className="ml-10 hidden items-center gap-2 md:flex p-1 rounded-full bg-white/5 border border-white/5">
          <li>
            <a
              href="#purpose"
              className={`block px-4 py-1.5 font-sans text-sm font-medium transition-all duration-300 rounded-full ${
                activeSection === "purpose" ? "bg-white/15 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              data-magnetic
            >
              Purpose
            </a>
          </li>
          <li>
            <a
              href="#showcase"
              className={`block px-4 py-1.5 font-sans text-sm font-medium transition-all duration-300 rounded-full ${
                activeSection === "showcase" ? "bg-white/15 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              data-magnetic
            >
              Showcase
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={`block px-4 py-1.5 font-sans text-sm font-medium transition-all duration-300 rounded-full ${
                activeSection === "contact" ? "bg-white/15 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              data-magnetic
            >
              Terminal
            </a>
          </li>
        </ul>

        <div className="ml-10 hidden md:block">
          <button
            className="rounded-full px-5 py-2 font-sans text-sm font-semibold transition-all hover:scale-105 hover:bg-peyk-silver bg-white text-background"
            data-magnetic
          >
            Connect
          </button>
        </div>
      </nav>
    </header>
  );
}
