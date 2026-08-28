"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined
    const consent = localStorage.getItem("peyk_cookie_consent");
    if (!consent) {
      // Delay showing the popup to let cinematic intros play first
      const timer = setTimeout(() => {
        setShow(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("peyk_cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("peyk_cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[999] animate-in slide-in-from-bottom-8 fade-in duration-1000 ease-out">
      <div className="flex flex-col gap-4 p-5 md:p-6 bg-[#09090b]/80 backdrop-blur-xl border border-white/10 shadow-2xl max-w-sm rounded-sm">
        
        <div className="flex flex-col gap-2">
          <h4 className="font-sans text-white font-medium tracking-tight">Cookie Protocol</h4>
          <p className="font-sans text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            We use cookies to ensure optimal system performance and analyze network traffic. Read our{" "}
            <Link href="/privacy" className="text-white underline underline-offset-2 hover:text-[#f59e0b] transition-colors">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={handleAccept}
            className="flex-1 bg-white text-black py-2.5 px-4 font-sans text-xs md:text-sm font-medium hover:bg-zinc-200 transition-colors rounded-sm"
          >
            Accept All
          </button>
          <button 
            onClick={handleDecline}
            className="flex-1 bg-transparent border border-white/20 text-white py-2.5 px-4 font-sans text-xs md:text-sm font-medium hover:border-white/40 transition-colors rounded-sm"
          >
            Decline
          </button>
        </div>
        
      </div>
    </div>
  );
}
