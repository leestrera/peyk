"use client";

import { useState, useRef } from "react";
import { Terminal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MechanicalSpider from "./MechanicalSpider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ContactTerminal() {
  const [isPatrolling, setIsPatrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const avoidRef = useRef<HTMLDivElement>(null);
  const textAvoidRef = useRef<HTMLDivElement>(null);
  const bugRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)"
    }, (context) => {
      let { isDesktop } = context.conditions as any;

      if (!isDesktop) {
        // MOBILE: Pin for intro sequence, then unpin and scroll naturally
        
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top", // Trigger right at the top to match the black transition
            end: "+=1000",    // Pin duration
            scrub: 1,
            pin: true,        // Pin it so the intro stays on screen
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress >= 0.99) setIsPatrolling(true);
              else setIsPatrolling(false);
            },
          }
        });

        mobileTl
          // 1. Void Text fades in and out
          .to(".void-word-1", { opacity: 1, y: 0, duration: 0.15 }, 0)
          .to(".void-word-2", { opacity: 1, y: 0, duration: 0.15 }, 0.15)
          .to(".void-word-3", { opacity: 1, y: 0, duration: 0.15 }, 0.3)
          .to(".dark-void-text", { opacity: 0, duration: 0.2 }, 0.6)
          
          // 2. Spider iris reveal & Black overlay fade out
          .fromTo(".contact-black-overlay", 
            { opacity: 1 },
            { opacity: 0, duration: 0.3, ease: "power2.inOut" }, 
            0.7
          )
          .fromTo(bugRef.current,
            { scale: 400 },
            { scale: 1, duration: 0.3, ease: "power2.inOut", force3D: false },
            0.7
          )
          
          // 3. Form and title fade in together
          .to(".contact-reveal", {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out"
          }, 0.7);
        
        return;
      }

      // DESKTOP: Full cinematic pinned sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=1000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.99) {
              setIsPatrolling(true);
            } else {
              setIsPatrolling(false);
            }
          },
          invalidateOnRefresh: true,
        }
      });

      // 1. Dark Void Typography Sequence
      tl.to(".void-word-1", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(".void-word-2", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2)
        .to(".void-word-3", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.4)
        
        // Fade void text out
        .to(".dark-void-text", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 1.2)

        // 2. Spider iris reveal
        .fromTo(".contact-black-overlay", 
          { opacity: 1 },
          { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 
          1.7
        )
        .fromTo(bugRef.current,
          { scale: 400 },
          { scale: 1, duration: 0.8, ease: "power2.inOut", force3D: false },
          1.7
        )
        
        // 3. Reveal contact content
        .to(".contact-reveal", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        }, 1.7);
    });

  }, { scope: containerRef });

  return (
    <section id="contact" className="relative w-full bg-[#fbfbfb] z-20">
      
      {/* The Cinematic Terminal Sequence */}
      <div ref={containerRef} className="relative w-full min-h-screen lg:h-[100vh] px-4 md:px-6 flex flex-col pt-24 pb-12 lg:py-0 lg:justify-center overflow-x-hidden lg:overflow-hidden">
        
        {/* Full screen overlay to cover extreme corners during the scale reveal */}
        <div className="contact-black-overlay absolute top-0 left-0 w-full h-[100vh] lg:h-full lg:inset-0 z-[40] bg-[#09090b] pointer-events-none" />

        {/* The Dark Void Typography Sequence */}
        <div className="dark-void-text absolute top-0 left-0 w-full h-[100vh] lg:h-full lg:inset-0 z-[60] flex flex-col items-center justify-center pointer-events-none px-6">
          <div className="flex flex-col items-start gap-8 md:gap-12 w-full max-w-5xl">
            <div className="void-word void-word-1 flex flex-col opacity-0 translate-y-[50px]">
              <span className="font-cursive text-2xl sm:text-4xl md:text-6xl text-white -mb-4 md:-mb-6 ml-2 md:ml-4 drop-shadow-md">from</span>
              <span className="font-heading text-3xl sm:text-5xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-white leading-none drop-shadow-xl">Concept</span>
            </div>
            
            <div className="void-word void-word-2 flex flex-col ml-8 md:ml-24 opacity-0 translate-y-[50px]">
              <span className="font-cursive text-2xl sm:text-4xl md:text-6xl text-white -mb-4 md:-mb-6 ml-2 md:ml-4 drop-shadow-md">through</span>
              <span className="font-heading text-3xl sm:text-5xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-white leading-none drop-shadow-xl">Architecture</span>
            </div>
            
            <div className="void-word void-word-3 flex flex-col ml-16 md:ml-48 opacity-0 translate-y-[50px]">
              <span className="font-cursive text-2xl sm:text-4xl md:text-6xl text-white -mb-4 md:-mb-6 ml-2 md:ml-4 drop-shadow-md">into</span>
              <span className="font-heading text-3xl sm:text-5xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-white leading-none drop-shadow-xl">Legacy</span>
            </div>
          </div>
        </div>

        {/* Subtle Background Elements */}
        <div className="contact-reveal absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-100 to-transparent opacity-0 pointer-events-none z-10" />

        <div className="mx-auto max-w-7xl relative z-20 w-full flex-1 flex flex-col lg:min-h-0 lg:justify-center">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-24 h-full lg:h-auto lg:items-center">
            
            {/* Left Side: Architectural Typography */}
            <div ref={textAvoidRef} className="relative flex flex-col justify-center shrink-0">
              <div className="contact-reveal absolute -left-6 md:-left-12 top-0 h-full w-[1px] bg-zinc-200 hidden md:block opacity-0" />
              
              <p className="contact-reveal font-mono text-xs tracking-[0.4em] text-zinc-400 mb-8 uppercase opacity-0 translate-y-[20px]">
                Secure Communication Channel
              </p>
              <h3 className="font-heading text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.85] flex flex-wrap items-end relative z-30">
                {/* The heading text is hidden, but NOT the spider's dot container */}
                <span className="contact-reveal opacity-0 translate-y-[20px]">Bring us<br />a problem</span>
                <span 
                  ref={dotRef} 
                  className="inline-block h-[12px] w-[12px] md:h-[20px] md:w-[20px] origin-center ml-2 mb-[10px] md:mb-[16px] relative z-[45]" 
                >
                  <MechanicalSpider 
                    ref={bugRef}
                    id="contact" 
                    isPatrolling={isPatrolling} 
                    originRef={dotRef} 
                    avoidRefs={[avoidRef, textAvoidRef]}
                  />
                </span>
              </h3>
              <p className="contact-reveal mt-10 font-sans text-lg text-zinc-500 max-w-md leading-relaxed opacity-0 translate-y-[20px]">
                We don't just build software. We architect solutions. Initialize the secure protocol to begin the transmission.
              </p>

              {/* Decorative scanning line */}
              <div className="contact-reveal mt-12 h-[1px] w-full max-w-xs bg-zinc-200 relative overflow-hidden opacity-0">
                <div className="absolute inset-0 w-1/4 bg-zinc-900 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ animation: 'scan 2s linear infinite' }} />
            </div>
          </div>

            {/* Right Side: The Terminal */}
            <div ref={avoidRef} className="contact-reveal relative z-20 opacity-0 translate-y-[20px] flex-1 h-auto mt-12 lg:mt-0">
              {/* Ambient Glow */}
              <div className="absolute -inset-10 bg-zinc-200/50 rounded-[3rem] blur-3xl -z-10 hidden lg:block" />
              
              <div className="group relative h-auto overflow-hidden lg:overflow-y-auto no-scrollbar lg:max-h-[85vh] bg-[#09090b] p-5 sm:p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.15)] transition-all duration-500 rounded-3xl border border-white/5">
                <div className="mb-8 mt-2">
                  <h4 className="font-heading text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter">Initialize Project</h4>
                  <p className="font-mono text-[9px] text-zinc-500 tracking-[0.2em] mt-1.5 uppercase">Secure intake protocol</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {/* 2-Column: Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative">
                      <label className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Name*</label>
                      <input type="text" required className="w-full border-b border-zinc-800 bg-transparent py-1.5 font-sans text-sm text-white outline-none transition-colors focus:border-white placeholder:text-zinc-700" placeholder="Full name" />
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Email*</label>
                      <input type="email" required className="w-full border-b border-zinc-800 bg-transparent py-1.5 font-sans text-sm text-white outline-none transition-colors focus:border-white placeholder:text-zinc-700" placeholder="Email address" />
                    </div>
                  </div>

                  {/* 2-Column: Phone & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative">
                      <label className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Phone number*</label>
                      <input type="tel" required className="w-full border-b border-zinc-800 bg-transparent py-1.5 font-sans text-sm text-white outline-none transition-colors focus:border-white placeholder:text-zinc-700" placeholder="Include area code" />
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Company name*</label>
                      <input type="text" required className="w-full border-b border-zinc-800 bg-transparent py-1.5 font-sans text-sm text-white outline-none transition-colors focus:border-white placeholder:text-zinc-700" placeholder="Organization name" />
                    </div>
                  </div>

                  {/* Full Width: Budget Dropdown */}
                  <div className="space-y-1.5 relative group/select">
                    <label className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Budget*</label>
                    <select required defaultValue="" className="w-full border-b border-zinc-800 bg-transparent py-1.5 font-sans text-sm text-white outline-none transition-colors focus:border-white appearance-none cursor-pointer">
                      <option value="" disabled className="text-zinc-500 bg-zinc-900">Select estimated budget...</option>
                      <option value="5k-10k" className="bg-zinc-900 text-white">$5,000 - $10,000</option>
                      <option value="10k-25k" className="bg-zinc-900 text-white">$10,000 - $25,000</option>
                      <option value="25k-50k" className="bg-zinc-900 text-white">$25,000 - $50,000</option>
                      <option value="50k+" className="bg-zinc-900 text-white">$50,000+</option>
                    </select>
                    <div className="absolute right-0 top-6 pointer-events-none text-zinc-600 group-hover/select:text-white transition-colors text-[10px]">
                      ▼
                    </div>
                  </div>

                  {/* Full Width: Services Checkboxes */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase block">Services*</label>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      {["Web Development", "Mobile App Development", "SEO Services", "Digital Marketing", "UI/UX Design", "Other"].map((service) => (
                        <label key={service} className="flex items-center gap-3 cursor-pointer group/checkbox">
                          <div className="relative flex items-center justify-center w-4 h-4 border border-zinc-700 rounded-sm group-hover/checkbox:border-white transition-colors shrink-0">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="absolute inset-0 bg-white scale-0 peer-checked:scale-100 transition-transform origin-center rounded-sm flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <span className="font-sans text-xs text-zinc-400 group-hover/checkbox:text-zinc-200 peer-checked:text-white transition-colors select-none">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Full Width: Message Textarea */}
                  <div className="space-y-1.5 relative pt-1">
                    <label className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Message</label>
                    <textarea className="w-full border-b border-zinc-800 bg-transparent py-1.5 font-sans text-sm text-white outline-none transition-colors focus:border-white min-h-[60px] resize-none placeholder:text-zinc-700" placeholder="Project details here..." />
                  </div>

                  <button type="submit" className="mt-6 flex w-full items-center justify-center gap-3 bg-white px-6 py-3.5 font-sans text-xs font-bold tracking-[0.2em] text-black transition-all hover:bg-zinc-200" data-magnetic>
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Extended Footer Section (Flows naturally below) */}
      <footer className="w-full bg-[#fbfbfb] px-6 py-16 border-t border-zinc-200 relative z-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
            
            {/* Col 1: Brand & Headquarters (Span 4) */}
            <div className="lg:col-span-4 flex flex-col justify-start text-left">
              <span className="font-heading text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-6">
                PEYK ARCHITECTURE
              </span>
              <p className="font-sans text-sm text-zinc-500 leading-relaxed mb-6 max-w-sm">
                Engineering digital monoliths. We design and build hyper-premium software architectures for brands that demand perfection.
              </p>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest space-y-1.5">
                <p>Global Remote Operations</p>
                <p>SYS.LOC: 37.7749° N, 122.4194° W</p>
              </div>
            </div>

            {/* Col 2: Navigation Index (Span 3) */}
            <div className="lg:col-span-3 lg:col-start-6 flex flex-col text-left">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-6 font-semibold">
                Index
              </span>
              <ul className="space-y-4 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                <li>
                  <a 
                    href="#hero" 
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-zinc-900 transition-colors duration-200 flex items-center gap-4 group"
                  >
                    <span>Home</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300">↑</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-zinc-900 transition-colors duration-200 flex items-center gap-4 group cursor-not-allowed"
                  >
                    <span>About Us</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300">→</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-zinc-900 transition-colors duration-200 flex items-center gap-4 group cursor-not-allowed"
                  >
                    <span>Contact Us</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300">→</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Social & Connect (Span 4) */}
            <div className="lg:col-span-4 flex flex-col text-left">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-6 font-semibold">
                Network
              </span>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                <a href="#" className="hover:text-zinc-900 transition-colors duration-200">Instagram</a>
                <a href="#" className="hover:text-zinc-900 transition-colors duration-200">Twitter / X</a>
                <a href="#" className="hover:text-zinc-900 transition-colors duration-200">LinkedIn</a>
                <a href="#" className="hover:text-zinc-900 transition-colors duration-200">GitHub</a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-zinc-200 pt-8 font-mono text-[10px] tracking-widest text-zinc-400 uppercase relative z-20">
            <p>© {new Date().getFullYear()} PEYK ARCHITECTURE.</p>
            <p className="mt-4 md:mt-0 font-medium text-zinc-300">SYS.VER.01.2026</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </section>
  );
}
