"use client";

import { useState, useTransition } from "react";
import { submitContactProtocol } from "@/actions/contact";

export default function ContactFormMinimal() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await submitContactProtocol(formData);
      setStatus(result);
    });
  };

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 mb-24 md:mb-48 z-20">
      <div className="w-full h-[1px] bg-white/10 mb-12 md:mb-24" />

      {status?.success ? (
        <div className="flex flex-col items-start py-12 animate-in fade-in duration-500">
          <h3 className="font-sans text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tighter mb-6">
            Transmission <span className="text-zinc-500">Successful.</span>
          </h3>
          <p className="font-sans text-lg md:text-xl text-zinc-400 max-w-lg font-light leading-relaxed">
            {status.message} We will review your architecture requirements and establish contact shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 md:gap-12 lg:gap-16 w-full animate-in fade-in duration-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-24">
            {/* Left Column */}
            <div className="flex flex-col gap-10 md:gap-12">
              <div className="group relative">
                <input 
                  type="text" 
                  name="name"
                  required 
                  disabled={isPending}
                  className="peer w-full bg-transparent border-b border-white/20 py-3 md:py-4 font-sans text-xl sm:text-2xl md:text-3xl text-white outline-none transition-all focus:border-white placeholder-transparent disabled:opacity-50" 
                  placeholder="Name" 
                  id="name-input"
                />
                <label 
                  htmlFor="name-input" 
                  className="absolute left-0 top-3 md:top-4 font-sans text-xl sm:text-2xl md:text-3xl text-zinc-600 transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-sm peer-valid:text-zinc-400 cursor-text"
                >
                  Name*
                </label>
              </div>

              <div className="group relative">
                <input 
                  type="email" 
                  name="email"
                  required 
                  disabled={isPending}
                  className="peer w-full bg-transparent border-b border-white/20 py-3 md:py-4 font-sans text-xl sm:text-2xl md:text-3xl text-white outline-none transition-all focus:border-white placeholder-transparent disabled:opacity-50" 
                  placeholder="Email" 
                  id="email-input"
                />
                <label 
                  htmlFor="email-input" 
                  className="absolute left-0 top-3 md:top-4 font-sans text-xl sm:text-2xl md:text-3xl text-zinc-600 transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-sm peer-valid:text-zinc-400 cursor-text"
                >
                  Email Address*
                </label>
              </div>

              <div className="group relative">
                <input 
                  type="tel" 
                  name="phone"
                  required 
                  disabled={isPending}
                  className="peer w-full bg-transparent border-b border-white/20 py-3 md:py-4 font-sans text-xl sm:text-2xl md:text-3xl text-white outline-none transition-all focus:border-white placeholder-transparent disabled:opacity-50" 
                  placeholder="Phone" 
                  id="phone-input"
                />
                <label 
                  htmlFor="phone-input" 
                  className="absolute left-0 top-3 md:top-4 font-sans text-xl sm:text-2xl md:text-3xl text-zinc-600 transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-sm peer-valid:text-zinc-400 cursor-text"
                >
                  Phone Number*
                </label>
              </div>

              <div className="group relative">
                <input 
                  type="text" 
                  name="company"
                  required 
                  disabled={isPending}
                  className="peer w-full bg-transparent border-b border-white/20 py-3 md:py-4 font-sans text-xl sm:text-2xl md:text-3xl text-white outline-none transition-all focus:border-white placeholder-transparent disabled:opacity-50" 
                  placeholder="Company" 
                  id="company-input"
                />
                <label 
                  htmlFor="company-input" 
                  className="absolute left-0 top-3 md:top-4 font-sans text-xl sm:text-2xl md:text-3xl text-zinc-600 transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-sm peer-valid:text-zinc-400 cursor-text"
                >
                  Company Name*
                </label>
              </div>
              
              <div className="group relative mt-2 md:mt-0">
                <div className="relative">
                  <select 
                    name="budget"
                    required 
                    disabled={isPending}
                    defaultValue="" 
                    className="peer w-full bg-transparent border-b border-white/20 py-3 md:py-4 font-sans text-xl sm:text-2xl md:text-3xl text-white outline-none transition-all focus:border-white appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled className="text-zinc-500 bg-zinc-900 hidden">Budget*</option>
                    <option value="5k-10k" className="bg-zinc-900 text-white">$5,000 - $10,000</option>
                    <option value="10k-25k" className="bg-zinc-900 text-white">$10,000 - $25,000</option>
                    <option value="25k-50k" className="bg-zinc-900 text-white">$25,000 - $50,000</option>
                    <option value="50k+" className="bg-zinc-900 text-white">$50,000+</option>
                  </select>
                  <label className="absolute left-0 -top-2 md:-top-3 font-sans text-xs md:text-sm text-zinc-400 transition-all cursor-default pointer-events-none">
                    Estimated Budget*
                  </label>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-hover:text-white transition-colors text-lg md:text-xl">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-10 md:gap-12 h-full">
              
              <div className="flex flex-col gap-6 md:gap-8 pt-1">
                <span className="font-sans text-xs md:text-sm text-zinc-400">Services*</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4">
                  {["Web Development", "Mobile App Development", "SEO Services", "Digital Marketing", "UI/UX Design", "Other"].map((service) => (
                    <label key={service} className="flex items-center gap-3 md:gap-4 cursor-pointer group/checkbox">
                      <div className="relative flex items-center justify-center w-5 h-5 md:w-6 md:h-6 border border-white/20 rounded-none transition-colors shrink-0 group-hover/checkbox:border-white">
                        <input type="checkbox" name="services" value={service} disabled={isPending} className="peer sr-only" />
                        <div className="absolute inset-0 bg-white scale-0 peer-checked:scale-100 transition-transform origin-center flex items-center justify-center">
                          <svg className="w-3 h-3 md:w-4 md:h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="font-sans text-base md:text-xl text-zinc-500 group-hover/checkbox:text-zinc-300 peer-checked:text-white transition-colors select-none">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="group relative flex-1 flex flex-col mt-2 md:mt-4">
                <textarea 
                  name="message"
                  required
                  disabled={isPending}
                  className="peer w-full h-full min-h-[120px] md:min-h-[150px] bg-transparent border-b border-white/20 py-3 md:py-4 font-sans text-lg md:text-2xl text-white outline-none transition-all focus:border-white placeholder-transparent disabled:opacity-50 resize-none" 
                  placeholder="Message"
                  id="message-input"
                />
                <label 
                  htmlFor="message-input" 
                  className="absolute left-0 top-3 md:top-4 font-sans text-xl sm:text-2xl md:text-3xl text-zinc-600 transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-sm peer-valid:text-zinc-400 cursor-text"
                >
                  Project Details
                </label>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-8 pt-4 md:pt-8">

            {status && !status.success ? (
              <p className="text-red-400 font-sans text-sm">{status.message}</p>
            ) : (
              <div /> // Spacer
            )}
            
            <button 
              type="submit" 
              disabled={isPending}
              className="group relative flex items-center gap-4 bg-transparent px-0 py-4 font-sans text-xl md:text-2xl font-light text-white transition-all hover:text-zinc-300 disabled:opacity-50 overflow-hidden"
              data-magnetic
            >
              <span className="relative z-10 flex items-center gap-4">
                {isPending ? "Processing..." : "Submit Inquiry"}
                <svg 
                  className="w-6 h-6 md:w-8 md:h-8 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>

        </form>
      )}
    </section>
  );
}
