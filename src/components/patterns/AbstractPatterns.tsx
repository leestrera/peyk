import React from 'react';

// ----------------------------------------------------------------------
// Universal Abstract Tech Pattern (Zero-Lag SVG)
// ----------------------------------------------------------------------
// Replaces literal motifs with a high-end, architectural tech grid.
// Completely performant, using crisp SVG lines and hardware-accelerated CSS.

export function AbstractTechPattern({ className = "", color = "currentColor" }: { className?: string, color?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes drift {
          0% { transform: translate(0px, 0px); }
          100% { transform: translate(-100px, -100px); }
        }
        .anim-drift {
          animation: drift 20s linear infinite;
        }
      `}</style>
      
      <defs>
        <pattern id="tech-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* Main Grid Lines */}
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.15" />
          
          {/* Sub-grid lines (very faint) */}
          <path d="M 50 0 L 50 100 M 0 50 L 100 50" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.05" />
          
          {/* Crosshairs at intersections */}
          <path d="M -5 0 L 5 0 M 0 -5 L 0 5" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 95 100 L 105 100 M 100 95 L 100 105" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
          <path d="M -5 100 L 5 100 M 0 95 L 0 105" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 95 0 L 105 0 M 100 -5 L 100 5" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
          
          {/* Small accent dots in centers */}
          <circle cx="50" cy="50" r="1.5" fill={color} fillOpacity="0.2" />
        </pattern>
      </defs>

      {/* Render an oversized rect that physically drifts to create endless movement */}
      <g className="anim-drift">
        <rect x="-200" y="-200" width="300%" height="300%" fill="url(#tech-grid)" />
      </g>
    </svg>
  );
}
