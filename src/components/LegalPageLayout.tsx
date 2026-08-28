"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollRestoration from "@/components/ScrollRestoration";
import CustomCursor from "@/components/CustomCursor";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          delay: 0.2,
        }
      );

      // Content Animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          delay: 0.4,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative w-full bg-[#09090b] min-h-screen flex flex-col">
      {/* Global Cinematic Film Grain */}
      <div className="fixed inset-0 z-[9999] bg-noise pointer-events-none" />
      <ScrollRestoration />
      <CustomCursor />
      <GlassNavbar />

      <div className="flex-1 w-full max-w-[1000px] mx-auto px-6 md:px-12 pt-48 pb-32">
        {/* Header Section */}
        <div ref={headerRef} className="mb-16 md:mb-24 opacity-0">
          <h1 className="font-sans text-5xl md:text-7xl lg:text-[6rem] font-medium tracking-tighter text-white mb-6 leading-none">
            {title}<span className="text-zinc-500">.</span>
          </h1>
          <div className="flex items-center gap-4 text-zinc-400 font-mono text-xs md:text-sm uppercase tracking-widest">
            <span>Last Updated:</span>
            <span className="text-white">{lastUpdated}</span>
          </div>
          <div className="w-full h-[1px] bg-white/10 mt-12 md:mt-16" />
        </div>

        {/* Legal Content */}
        <div 
          ref={contentRef} 
          className="opacity-0 max-w-none text-zinc-400 font-sans font-light
            [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:text-white [&>h2]:font-medium [&>h2]:tracking-tight [&>h2]:mt-16 [&>h2]:mb-6
            [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:text-zinc-200 [&>h3]:font-medium [&>h3]:mt-12 [&>h3]:mb-4
            [&>p]:text-base [&>p]:md:text-lg [&>p]:leading-relaxed [&>p]:mb-8
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-3 [&>ul>li]:text-base [&>ul>li]:md:text-lg [&>ul>li]:leading-relaxed
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:mb-3 [&>ol>li]:text-base [&>ol>li]:md:text-lg [&>ol>li]:leading-relaxed
            [&>a]:text-white [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-[#f59e0b] [&>a]:transition-colors"
        >
          {children}
        </div>
      </div>

      <Footer theme="dark" />
    </main>
  );
}
