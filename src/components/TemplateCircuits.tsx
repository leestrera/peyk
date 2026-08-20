export default function TemplateCircuits({ color = "white", glow = false }: { color?: string, glow?: boolean }) {
  const paths = [
    // Top Left flowing Right
    "M -100 150 H 300 L 350 200 H 1500",
    "M -100 180 H 270 L 320 230 H 1500",
    "M -100 210 H 240 L 290 260 H 1500",
    
    // Bottom Right flowing Left
    "M 1500 650 H 1100 L 1050 600 H -100",
    "M 1500 680 H 1130 L 1080 630 H -100",
    "M 1500 710 H 1160 L 1110 660 H -100",
    
    // Center Tech Nodes (Complex Routing)
    "M 400 800 V 500 L 450 450 H 600 L 650 400 V -100",
    "M 1000 -100 V 300 L 950 350 H 800 L 750 400 V 800",
    
    // Accents
    "M 100 800 V 700 L 150 650 H 300",
    "M 1300 -100 V 100 L 1250 150 H 1100"
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
          <filter id="template-circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
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
        filter={glow ? "url(#template-circuit-glow)" : undefined}
      >
        {/* Base Static Traces */}
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}

        {/* Traveling Data Pulses */}
        {glow && paths.map((d, i) => {
          const styleClass = i % 3 === 0 ? 'template-pulse-1' : i % 2 === 0 ? 'template-pulse-2' : 'template-pulse-3';
          return (
            <path 
              key={`pulse-${i}`} 
              d={d} 
              stroke="#ffffff" 
              strokeWidth="2"
              className={styleClass}
            />
          );
        })}
      </g>

      <style>{`
        .template-pulse-1 {
          stroke-dasharray: 100 2000;
          animation: tmplDataPulse 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .template-pulse-2 {
          stroke-dasharray: 150 2500;
          animation: tmplDataPulse 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: -2s;
        }
        .template-pulse-3 {
          stroke-dasharray: 80 2200;
          animation: tmplDataPulse-reverse 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: -1s;
        }
        @keyframes tmplDataPulse {
          0% { stroke-dashoffset: 2500; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes tmplDataPulse-reverse {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 2500; }
        }
      `}</style>
    </svg>
  );
}
