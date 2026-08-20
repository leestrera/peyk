export default function CircuitTraces({ color = "white", glow = false }: { color?: string, glow?: boolean }) {
  const paths = [
    // Left side framing - Outer 3 (Leans OUTWARD, cascading)
    "M 250 0 V 150 L 200 200 V 650 L 250 700 V 800",
    "M 270 0 V 200 L 220 250 V 600 L 270 650 V 800",
    "M 290 0 V 250 L 240 300 V 550 L 290 600 V 800",
    // Left side framing - Inner 2 (Leans INWARD, cascading)
    "M 350 0 V 200 L 400 250 V 550 L 350 600 V 800",
    "M 370 0 V 150 L 420 200 V 600 L 370 650 V 800",

    // Right side framing - Outer 3 (Leans OUTWARD, cascading)
    "M 1150 0 V 150 L 1200 200 V 650 L 1150 700 V 800",
    "M 1130 0 V 200 L 1180 250 V 600 L 1130 650 V 800",
    "M 1110 0 V 250 L 1160 300 V 550 L 1110 600 V 800",
    // Right side framing - Inner 2 (Leans INWARD, cascading)
    "M 1050 0 V 200 L 1000 250 V 550 L 1050 600 V 800",
    "M 1030 0 V 150 L 980 200 V 600 L 1030 650 V 800"
  ];

  return (
    <svg 
      className="w-full h-full absolute inset-0" 
      viewBox="0 0 1400 800" 
      preserveAspectRatio="xMidYMid slice" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {glow && (
          <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}
      </defs>
      
      <g 
        stroke={color} 
        strokeWidth={glow ? "2" : "1"} 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter={glow ? "url(#circuit-glow)" : undefined}
      >
        {/* Base Static Traces */}
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}

        {/* Traveling Data Pulses (Only on glow layer for maximum effect) */}
        {glow && paths.map((d, i) => {
          // Assign different animation speeds/delays based on index
          const styleClass = i % 3 === 0 ? 'pulse-line' : i % 2 === 0 ? 'pulse-line-2' : 'pulse-line-3';
          return (
            <path 
              key={`pulse-${i}`} 
              d={d} 
              stroke="#ffffff" // Bright white core for the pulse
              strokeWidth="2"
              className={styleClass}
            />
          );
        })}
      </g>

      <style>{`
        .pulse-line {
          stroke-dasharray: 80 1500;
          animation: dataPulse 4s linear infinite;
        }
        .pulse-line-2 {
          stroke-dasharray: 120 1800;
          animation: dataPulse 5s linear infinite;
          animation-delay: -2s;
        }
        .pulse-line-3 {
          stroke-dasharray: 60 2000;
          animation: dataPulse-reverse 6s linear infinite;
          animation-delay: -1s;
        }
        @keyframes dataPulse {
          0% { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes dataPulse-reverse {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 2000; }
        }
      `}</style>
    </svg>
  );
}
