"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from 'lenis/react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const lenis = useLenis();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string) => {
    if (pathname === targetPath) {
      // If we're already on this page, prevent Next.js from routing.
      // This stops the abrupt jump and instead lets us scroll smoothly to the top,
      // which allows GSAP ScrollTrigger to naturally reverse its animations (like shrinking the spider).
      e.preventDefault();
      
      if (lenis) {
        lenis.scrollTo(0, { immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // If navigating to a DIFFERENT page, force scroll to top instantly
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);

    // Force GSAP to sync with the jump
    setTimeout(() => {
      ScrollTrigger.update();
      ScrollTrigger.refresh();
    }, 50);
  };

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
      { rootMargin: "-40% 0px -40% 0px" }
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

      if (Math.abs(scrollDelta) < 0.5 && Math.abs(pendulumVelocity.current) < 0.001 && Math.abs(pendulumAngle.current) < 0.001) {
        pendulumAngle.current = 0;
        pendulumVelocity.current = 0;
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
        className={`pointer-events-auto relative flex flex-col md:flex-row items-center p-1.5 transition-all duration-700 ease-out w-[90vw] md:w-auto mx-auto
          ${!isScrolled 
            ? "-translate-y-[150%] opacity-0" 
            : isMenuOpen 
              ? "translate-y-6 opacity-100 bg-[#09090b]/70 backdrop-blur-2xl rounded-3xl md:rounded-full border border-white/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_8px_32px_rgba(0,0,0,0.4)]" 
              : "-translate-y-[100%] opacity-100 bg-[#09090b]/70 backdrop-blur-2xl rounded-3xl md:rounded-full border border-white/[0.08]"
          }
        `}
      >
        
        {/* === THE ROPE (Hangs off the bottom of the navbar) === */}
        <div 
          className={`absolute top-[100%] right-8 md:right-16 transition-opacity duration-500 ease-in-out ${isScrolled ? "opacity-100" : "opacity-0"}`}
        >
          <div ref={pullStringRef} className="nav-pull-string" onClick={handleRopeClick}>
            <div ref={threadRef} className="lanyard-thread"></div>
            <div className="lanyard-clip"></div>
            <div className="aperture-ring"></div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex items-center pl-4 pr-6 py-3 md:py-0 md:h-10 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-auto justify-center md:justify-start">
          <Image
            src="/assets/logos/text_logo.png"
            alt="Peyk Logo"
            width={80}
            height={20}
            className="h-4 md:h-4 w-auto object-contain invert opacity-90"
            priority
          />
        </div>

        {/* Links Section */}
        <ul className="flex flex-col md:flex-row items-center gap-1 px-2 md:px-6 py-4 md:py-0 w-full md:w-auto">
          <li className="w-full md:w-auto">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/")}
              className={`block w-full text-center px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 rounded-full ${
                pathname === "/" ? "text-white bg-white/10" : "text-white/40 hover:text-white"
              }`}
              data-magnetic
            >
              Home
            </Link>
          </li>
          <li className="w-full md:w-auto">
            <Link
              href="/about"
              onClick={(e) => handleNavClick(e, "/about")}
              className={`block w-full text-center px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 rounded-full ${
                pathname === "/about" ? "text-white bg-white/10" : "text-white/40 hover:text-white"
              }`}
              data-magnetic
            >
              About Us
            </Link>
          </li>

        </ul>

        {/* Action Button Section */}
        <div className="pl-2 pr-1 pb-1.5 md:pb-0 w-full md:w-auto block border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
          <Link
            href="/contact"
            className="block w-full md:w-auto text-center rounded-full px-6 py-3 md:py-2.5 font-mono text-[10px] tracking-[0.25em] uppercase font-bold transition-transform duration-300 bg-white text-black hover:scale-105 active:scale-95"
            data-magnetic
          >
            Connect
          </Link>
        </div>
      </nav>
    </header>
  );
}
