"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between rounded-full border border-peyk-glass px-6 py-3 transition-all duration-500 will-change-[background-color,backdrop-filter] 
          ${isScrolled ? "bg-black/40 backdrop-blur-xl shadow-lg" : "bg-transparent"}
        `}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/assets/logos/logo_and_text_logo.png"
            alt="Peyk Logo"
            width={120}
            height={40}
            className="h-6 w-auto object-contain"
            priority
          />
        </div>

        <ul className="ml-10 hidden items-center gap-8 md:flex">
          <li>
            <a
              href="#purpose"
              className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
              data-magnetic
            >
              Purpose
            </a>
          </li>
          <li>
            <a
              href="#showcase"
              className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
              data-magnetic
            >
              Showcase
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
              data-magnetic
            >
              Terminal
            </a>
          </li>
        </ul>

        <div className="ml-10 hidden md:block">
          <button
            className="rounded-full bg-white px-5 py-2 font-sans text-sm font-semibold text-background transition-all hover:scale-105 hover:bg-peyk-amber"
            data-magnetic
          >
            Connect
          </button>
        </div>
      </nav>
    </header>
  );
}
