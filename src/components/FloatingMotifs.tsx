import React from 'react';

// Pure CSS, 60fps hardware-accelerated floating animations.
// No WebGL, no heavy SVG filters, zero lag.

export function FloatingCafe() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[5]">
      <style>{`
        @keyframes float-1 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-40px) rotate(10deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0) rotate(0deg) scale(1); } 50% { transform: translateY(-60px) rotate(-15deg) scale(1.05); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
        
        .m-bean-1 { animation: float-1 8s ease-in-out infinite; }
        .m-bean-2 { animation: float-2 12s ease-in-out infinite 1s; }
        .m-bean-3 { animation: float-3 9s ease-in-out infinite 2s; }
        .m-cup { animation: float-2 15s ease-in-out infinite; }
      `}</style>
      
      {/* Massive Graphic Element (Backdrop) */}
      <div className="absolute -left-[10%] top-[10%] opacity-5 m-cup">
        <svg width="800" height="800" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 30 50 Q 50 20 70 50" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 40 70 Q 50 40 60 70" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Floating Bean 1 */}
      <div className="absolute left-[15%] top-[60%] opacity-20 m-bean-1 text-[#f59e0b]">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <path d="M 50 20 C 75 20 85 45 85 60 C 85 85 60 90 40 90 C 15 90 10 65 10 50 C 10 25 30 20 50 20 Z" fill="currentColor" />
          <path d="M 30 45 C 50 45 50 65 70 65" fill="none" stroke="#fef3c7" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating Bean 2 */}
      <div className="absolute left-[75%] top-[20%] opacity-15 m-bean-2 text-[#d97706]">
        <svg width="250" height="250" viewBox="0 0 100 100">
          <path d="M 50 20 C 75 20 85 45 85 60 C 85 85 60 90 40 90 C 15 90 10 65 10 50 C 10 25 30 20 50 20 Z" fill="currentColor" />
          <path d="M 30 45 C 50 45 50 65 70 65" fill="none" stroke="#fef3c7" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating Bean 3 */}
      <div className="absolute left-[80%] top-[70%] opacity-10 m-bean-3 text-[#f59e0b]">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M 50 20 C 75 20 85 45 85 60 C 85 85 60 90 40 90 C 15 90 10 65 10 50 C 10 25 30 20 50 20 Z" fill="currentColor" />
          <path d="M 30 45 C 50 45 50 65 70 65" fill="none" stroke="#fef3c7" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export function FloatingResort() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[5]">
      <style>{`
        @keyframes sway-1 { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(-40px) rotate(2deg); } }
        @keyframes sway-2 { 0%, 100% { transform: translateX(0) rotate(0deg) scale(1); } 50% { transform: translateX(-60px) rotate(-2deg) scale(1.05); } }
        @keyframes pulse-sun { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.1); opacity: 0.2; } }
        
        .m-wave-1 { animation: sway-1 12s ease-in-out infinite; }
        .m-wave-2 { animation: sway-2 15s ease-in-out infinite 1s reverse; }
        .m-sun { animation: pulse-sun 8s ease-in-out infinite; }
      `}</style>
      
      {/* Massive Graphic Element (Sun) */}
      <div className="absolute left-[70%] top-[10%] m-sun text-[#0ea5e9]">
        <svg width="600" height="600" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
      </div>

      {/* Floating Wave 1 */}
      <div className="absolute -left-[5%] top-[50%] opacity-20 m-wave-1 text-[#0284c7]">
        <svg width="120vw" height="300" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 50 Q 25 20 50 50 T 100 50 L 100 100 L 0 100 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Floating Wave 2 */}
      <div className="absolute -left-[5%] top-[65%] opacity-15 m-wave-2 text-[#0ea5e9]">
        <svg width="120vw" height="300" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 50 Q 30 80 60 50 T 100 50 L 100 100 L 0 100 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function FloatingVet() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[5]">
      <style>{`
        @keyframes float-paw { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-40px) rotate(15deg); } }
        @keyframes float-bone { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-60px) rotate(-25deg); } }
        
        .m-paw { animation: float-paw 10s ease-in-out infinite; }
        .m-paw-2 { animation: float-paw 12s ease-in-out infinite 2s reverse; }
        .m-bone { animation: float-bone 15s ease-in-out infinite; }
      `}</style>
      
      {/* Massive Graphic Element (Paw) */}
      <div className="absolute left-[65%] top-[15%] opacity-10 m-paw text-[#10b981]">
        <svg width="400" height="400" viewBox="0 0 100 100">
          <path d="M 50 50 C 65 50 70 65 70 75 C 70 85 60 90 50 90 C 40 90 30 85 30 75 C 30 65 35 50 50 50 Z" fill="currentColor" />
          <circle cx="28" cy="45" r="10" fill="currentColor" />
          <circle cx="42" cy="32" r="12" fill="currentColor" />
          <circle cx="58" cy="32" r="12" fill="currentColor" />
          <circle cx="72" cy="45" r="10" fill="currentColor" />
        </svg>
      </div>

      {/* Floating Paw 2 */}
      <div className="absolute left-[15%] top-[60%] opacity-20 m-paw-2 text-[#059669]">
        <svg width="200" height="200" viewBox="0 0 100 100">
          <path d="M 50 50 C 65 50 70 65 70 75 C 70 85 60 90 50 90 C 40 90 30 85 30 75 C 30 65 35 50 50 50 Z" fill="currentColor" />
          <circle cx="28" cy="45" r="8" fill="currentColor" />
          <circle cx="42" cy="32" r="10" fill="currentColor" />
          <circle cx="58" cy="32" r="10" fill="currentColor" />
          <circle cx="72" cy="45" r="8" fill="currentColor" />
        </svg>
      </div>

      {/* Floating Bone */}
      <div className="absolute left-[70%] top-[70%] opacity-15 m-bone text-[#10b981]">
        <svg width="250" height="250" viewBox="0 0 100 100">
          <path d="M 25 45 C 15 45 15 30 25 30 C 30 30 35 35 40 40 L 60 40 C 65 35 70 30 75 30 C 85 30 85 45 75 45 C 70 45 65 40 60 40 L 40 40 C 35 40 30 45 25 45 Z" fill="currentColor" transform="rotate(-30 50 50)" />
        </svg>
      </div>
    </div>
  );
}
