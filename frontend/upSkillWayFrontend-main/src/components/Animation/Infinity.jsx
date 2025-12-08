import { useId } from "react";

export default function InfinityFlow({ className }) {
  const gid = useId().replace(/:/g, "");
  const gradId = `grad-${gid}`;
  const pathId = `path-${gid}`;
  const shineId = `shine-${gid}`;

  return (
    <div className={`w-full ${className || ''}`}>
      <svg
        viewBox="0 0 1800 1000"
        className="w-full h-auto"
        aria-label="Discover, Define, Deliver animated infinity flow"
      >
        <defs>
          {/* Gradient matching the image: Yellow -> Orange -> Peach -> Purple */}
          <linearGradient id={gradId} x1="200" x2="1400" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="15%" stopColor="#FFA500" />
            <stop offset="35%" stopColor="#FF8C69" />
            <stop offset="50%" stopColor="#FFB6C1" />
            <stop offset="70%" stopColor="#DDA0DD" />
            <stop offset="100%" stopColor="#9370DB" />
            <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 100 0; 0 0; -100 0; 0 0" dur="8s" repeatCount="indefinite" />
          </linearGradient>

          {/* Shine effect */}
          <linearGradient id={shineId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Infinity symbol path - wider Define section with more vertical space */}
          <path
            id={pathId}
            d="M 280 500 C 280 280 480 250 680 450 C 880 650 1020 650 1200 450 C 1380 250 1580 280 1580 500 C 1580 720 1380 750 1200 550 C 1020 350 880 350 680 550 C 480 750 280 720 280 500"
            fill="none"
          />
          
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="1800" height="1000" fill="white" />

        {/* Central dotted line */}
        

         {/* Top labels with connecting lines - Background */}
         {[
           { x: 430, y: 200, text: ["Goal setting and", "management"], color: "#FF8C69", connectY: 300 },
           { x: 930, y: 140, text: ["Org design and", "strategy"], color: "#FFB6C1", connectY: 390 },
           { x: 1430, y: 200, text: ["Customer journey", "mapping"], color: "#DDA0DD", connectY: 300 },
         ].map((item, idx) => (
           <g key={`top-${idx}`}>
             {/* Pin base - solid circle */}
             <circle cx={item.x} cy={item.connectY} r="4" fill={item.color} />
             {/* Pin line */}
             <line x1={item.x} y1={item.connectY} x2={item.x} y2={item.y + 40} stroke={item.color} strokeWidth="2" />
             {/* Pin tip - hollow circle */}
             <circle cx={item.x} cy={item.y + 40} r="3" fill="none" stroke={item.color} strokeWidth="2" />
             <text
               x={item.x}
               y={item.y}
               textAnchor="middle"
               fontFamily="Inter, ui-sans-serif"
               fontSize="18"
               fontWeight="500"
               fill="#374151"
             >
               {item.text.map((line, i) => (
                 <tspan key={i} x={item.x} dy={i === 0 ? 0 : 24}>
                   {line}
                 </tspan>
               ))}
             </text>
           </g>
         ))}

         {/* Bottom labels with connecting lines - Background */}
         {[
           { x: 350, y: 850, text: ["Customer insights", "and feedback"], color: "#FFD700", connectY: 690 },
           { x: 530, y: 850, text: ["Product planning", "and roadmapping"], color: "#FFA500", connectY: 670 },
           { x: 750, y: 750, text: ["Technical", "design"], color: "#FF8C69", connectY: 540 },
           { x: 930, y: 860, text: ["Prototyping"], color: "#FFB6C1", connectY: 610 },
           { x: 1120, y: 750, text: ["Sprint", "planning"], color: "#DDA0DD", connectY: 540 },
           { x: 1330, y: 850, text: ["Project", "execution"], color: "#9370DB", connectY: 670 },
         ].map((item, idx) => (
           <g key={`bottom-${idx}`}>
             {/* Pin base - solid circle */}
             <circle cx={item.x} cy={item.connectY} r="4" fill={item.color} />
             {/* Pin line */}
             <line x1={item.x} y1={item.connectY} x2={item.x} y2={item.y - 40} stroke={item.color} strokeWidth="2" />
             {/* Pin tip - hollow circle */}
             <circle cx={item.x} cy={item.y - 40} r="3" fill="none" stroke={item.color} strokeWidth="2" />
             <text
               x={item.x}
               y={item.y}
               textAnchor="middle"
               fontFamily="Inter, ui-sans-serif"
               fontSize="16"
               fontWeight="500"
               fill="#6B7280"
             >
               {Array.isArray(item.text) ? (
                 item.text.map((line, i) => (
                   <tspan key={i} x={item.x} dy={i === 0 ? 0 : 20}>
                     {line}
                   </tspan>
                 ))
               ) : (
                 item.text
               )}
             </text>
           </g>
         ))}

        {/* Infinity symbol base */}
        <use href={`#${pathId}`} stroke="#E0E0E0" strokeWidth="60" opacity="0.3" />
        
        {/* Main infinity symbol with gradient */}
        <use
          href={`#${pathId}`}
          stroke={`url(#${gradId})`}
          strokeWidth="60"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softShadow)"
        />

        {/* Animated shine effect */}
        <use
          href={`#${pathId}`}
          stroke={`url(#${shineId})`}
          strokeWidth="65"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dasharray"
            values="100 1600; 300 1400; 100 1600"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            values="0; -800; 0"
            dur="8s"
            repeatCount="indefinite"
          />
        </use>

        {/* Sparkles/Stars moving along the path */}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} opacity="0.8">
            <path
              d="M0 -8 L2.5 -2.5 L8 0 L2.5 2.5 L0 8 L-2.5 2.5 L-8 0 L-2.5 -2.5 Z"
              fill={i % 2 === 0 ? "#9370DB" : "#4169E1"}
              stroke="white"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                begin={`${i * 0.8}s`}
                repeatCount="indefinite"
              />
            </path>
            <animateMotion
              dur={`${6 + i * 0.5}s`}
              begin={`${i * 0.7}s`}
              rotate="auto"
              repeatCount="indefinite"
            >
              <mpath xlinkHref={`#${pathId}`} />
            </animateMotion>
          </g>
        ))}

        {/* Main section titles */}
        <text x="430" y="500" textAnchor="middle" fontFamily="Inter, ui-sans-serif" fontSize="48" fontWeight="700" fill="#374151">
          Discover
        </text>
        <text x="930" y="505" textAnchor="middle" fontFamily="Inter, ui-sans-serif" fontSize="48" fontWeight="700" fill="#374151">
          Define
        </text>
        <text x="1430" y="500" textAnchor="middle" fontFamily="Inter, ui-sans-serif" fontSize="48" fontWeight="700" fill="#374151">
          Deliver
        </text>
      </svg>
    </div>
  );
}