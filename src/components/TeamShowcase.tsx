"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  {
    name: "Lorenz Edward Estrera",
    title: "Founder & Lead Engineer",
    bio: "He builds performant, immersive web experiences by day and produces electronic music by night. Both require a meticulous understanding of structure, tension, and release.",
    image: "/assets/images/team/lee_strera.jpeg",
  }
];

export default function TeamShowcase() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray('.team-fade');
    
    elements.forEach((el: any) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-transparent text-white px-6 md:px-12 lg:px-24 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto">

        {/* Section Label */}
        <div className="team-fade mb-20 md:mb-28">
          <h2 className="font-sans text-4xl md:text-5xl font-medium tracking-tight text-white">The mind behind the architecture</h2>
        </div>

        {/* Editorial Team Members — each gets a full-width row */}
        <div className="flex flex-col gap-32 md:gap-40">
          {TEAM.map((member, i) => (
            <div 
              key={i} 
              className={`team-fade flex flex-col gap-8 ${
                i % 2 === 0 
                  ? 'md:flex-row' 
                  : 'md:flex-row-reverse'
              } items-end`}
            >
              {/* Photo */}
              <div className="w-full max-w-[320px] mx-auto md:mx-0 md:w-2/5 md:max-w-none relative aspect-[3/4] overflow-hidden">
                <Image 
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Text Block — anchored to the bottom of the photo */}
              <div className={`w-full md:w-3/5 flex flex-col justify-end pb-4 mt-6 md:mt-0 ${
                i % 2 === 0 ? 'md:pl-4' : 'md:pr-4'
              }`}>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4 text-center md:text-left">{member.title}</span>
                <h3 className="font-sans text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 text-center md:text-left">{member.name}</h3>
                <p className="font-sans text-base text-zinc-400 leading-relaxed font-light max-w-sm mx-auto md:mx-0 text-center md:text-left">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
