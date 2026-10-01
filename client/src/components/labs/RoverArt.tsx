/** Original animated rover illustration (replaces the missing /manus-storage kit photo). Pure SVG + CSS. */
export default function RoverArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 400" className={className} role="img" aria-label="Illustration of a sensor-equipped educational rover scanning its surroundings">
      <defs>
        <linearGradient id="ra-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b241f" /><stop offset="1" stopColor="#0c110e" /></linearGradient>
        <radialGradient id="ra-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#d8fa32" stopOpacity=".28" /><stop offset="1" stopColor="#d8fa32" stopOpacity="0" /></radialGradient>
        <linearGradient id="ra-scan" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#5ef0ff" stopOpacity=".45" /><stop offset="1" stopColor="#5ef0ff" stopOpacity="0" /></linearGradient>
      </defs>
      <ellipse cx="220" cy="320" rx="190" ry="60" fill="url(#ra-glow)" />
      <g stroke="rgba(243,240,233,.12)" fill="none">
        <ellipse cx="220" cy="320" rx="120" ry="30" /><ellipse cx="220" cy="320" rx="170" ry="44" /><ellipse cx="220" cy="320" rx="200" ry="54" strokeDasharray="4 8" style={{ animation: "dash 2s linear infinite" }} />
      </g>
      {/* scan wedge */}
      <g style={{ transformOrigin: "220px 190px", animation: "sweep 4.5s ease-in-out infinite" }}>
        <path d="M220 190 L120 30 A190 190 0 0 1 320 30 Z" fill="url(#ra-scan)" />
      </g>
      {/* antenna */}
      <line x1="220" y1="150" x2="220" y2="98" stroke="#a3aca6" strokeWidth="3" />
      <circle cx="220" cy="92" r="7" fill="#d8fa32" style={{ animation: "blink 1.3s ease-in-out infinite" }} />
      <circle cx="220" cy="92" r="14" fill="none" stroke="#d8fa32" strokeOpacity=".4" style={{ animation: "ring 2.6s ease-out infinite", transformOrigin: "220px 92px" }} />
      <g style={{ animation: "floaty 5s ease-in-out infinite" }}>
        {/* wheels */}
        {[[92, 250], [92, 306], [348, 250], [348, 306]].map(([x, y], i) => (
          <g key={i}><rect x={x - 26} y={y - 26} width="52" height="46" rx="14" fill="#0a0d0b" stroke="rgba(243,240,233,.25)" /><g stroke="rgba(216,250,50,.5)" strokeWidth="2">{[-14, -5, 4, 13].map((dx) => <line key={dx} x1={x + dx} y1={y - 20} x2={x + dx} y2={y + 14} strokeDasharray="4 5" style={{ animation: "dash 1.2s linear infinite" }} />)}</g></g>
        ))}
        {/* body */}
        <rect x="100" y="150" width="240" height="170" rx="30" fill="url(#ra-body)" stroke="rgba(216,250,50,.6)" strokeWidth="1.5" />
        <path d="M130 300 H190 L204 282 H276 L290 300 H320" stroke="rgba(216,250,50,.45)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M130 176 H168 L180 190 H220" stroke="rgba(94,240,255,.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="130" cy="176" r="3" fill="#5ef0ff" /><circle cx="320" cy="300" r="3" fill="#d8fa32" />
        {/* eyes */}
        {[164, 276].map((x) => (
          <g key={x}><circle cx={x} cy="222" r="30" fill="#050706" stroke="rgba(243,240,233,.3)" strokeWidth="2" /><circle cx={x} cy="222" r="19" fill="#0e1d1e" stroke="#5ef0ff" strokeWidth="1.5" /><circle cx={x} cy="222" r="8" fill="#5ef0ff" style={{ animation: "blink 2.2s ease-in-out infinite" }} /><circle cx={x} cy="222" r="30" fill="none" stroke="#5ef0ff" strokeOpacity=".45" style={{ animation: "ring 2.8s ease-out infinite", transformOrigin: `${x}px 222px` }} /></g>
        ))}
        <rect x="186" y="262" width="68" height="10" rx="5" fill="#0a0d0b" stroke="rgba(243,240,233,.2)" />
        <rect x="190" y="265" width="26" height="4" rx="2" fill="#d8fa32" style={{ animation: "blink 1.8s ease-in-out infinite" }} />
      </g>
    </svg>
  );
}
