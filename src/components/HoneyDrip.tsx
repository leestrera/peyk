"use client";

import React from "react";

export default function HoneyDrip() {
  return (
    <div className="absolute left-0 bottom-0 w-full translate-y-[98%] h-24 pointer-events-none z-0">
      <style>{`
        @keyframes honey-drip {
          0% { transform: translateY(0px) scaleY(1); opacity: 1; }
          40% { transform: translateY(10px) scaleY(2.5); opacity: 1; }
          60% { transform: translateY(40px) scaleY(1.5); opacity: 1; }
          90% { transform: translateY(80px) scaleY(1); opacity: 0; }
          100% { transform: translateY(80px) scaleY(1); opacity: 0; }
        }
        .animate-honey-drip {
          animation: honey-drip var(--duration, 3s) infinite cubic-bezier(0.4, 0, 0.2, 1);
          animation-delay: var(--delay, 0s);
          transform-origin: top center;
        }
      `}</style>

      {/* The dripping container with the filter applied (hardware accelerated) */}
      <div 
        className="w-full h-full relative" 
        style={{ 
          filter: "url(#gooey-honey)",
          willChange: "filter, transform",
          transform: "translateZ(0)"
        }}
      >
        {/* Base thick honey line at the cut edge */}
        <div className="absolute top-0 left-[2%] w-[96%] h-3 bg-[#f59e0b]" />
        
        {/* Animated droplets */}
        <div className="animate-honey-drip absolute top-[2px] left-[15%] w-4 h-4 rounded-full bg-[#f59e0b]" style={{ "--delay": "0s", "--duration": "3s" } as React.CSSProperties} />
        <div className="animate-honey-drip absolute top-[2px] left-[40%] w-6 h-6 rounded-full bg-[#f59e0b]" style={{ "--delay": "1.2s", "--duration": "4s" } as React.CSSProperties} />
        <div className="animate-honey-drip absolute top-[2px] left-[65%] w-3 h-3 rounded-full bg-[#f59e0b]" style={{ "--delay": "0.5s", "--duration": "2.5s" } as React.CSSProperties} />
        <div className="animate-honey-drip absolute top-[2px] left-[85%] w-5 h-5 rounded-full bg-[#f59e0b]" style={{ "--delay": "2.1s", "--duration": "3.5s" } as React.CSSProperties} />
        <div className="animate-honey-drip absolute top-[2px] left-[25%] w-3 h-3 rounded-full bg-[#f59e0b]" style={{ "--delay": "3.3s", "--duration": "2.8s" } as React.CSSProperties} />
      </div>
    </div>
  );
}
