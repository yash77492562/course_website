'use client';

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  return (
    <svg 
      className={className}
      viewBox="0 0 1440 900" 
      fill="none" 
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Network lines with animations */}
      <g stroke="rgba(14,165,233,0.12)" strokeWidth="1">
        <line x1="200" y1="100" x2="480" y2="300">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
        </line>
        <line x1="480" y1="300" x2="800" y2="180">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="5s" repeatCount="indefinite"/>
        </line>
        <line x1="800" y1="180" x2="1100" y2="400">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.5s" repeatCount="indefinite"/>
        </line>
        <line x1="1100" y1="400" x2="1350" y2="220">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="4.5s" repeatCount="indefinite"/>
        </line>
        <line x1="480" y1="300" x2="640" y2="560">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5.5s" repeatCount="indefinite"/>
        </line>
        <line x1="640" y1="560" x2="900" y2="480">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite"/>
        </line>
        <line x1="900" y1="480" x2="1100" y2="400">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
        </line>
        <line x1="200" y1="100" x2="320" y2="420" />
        <line x1="320" y1="420" x2="640" y2="560" />
        <line x1="900" y1="480" x2="1200" y2="700" />
        <line x1="1200" y1="700" x2="1350" y2="220" />
      </g>
      
      {/* Animated nodes */}
      <g fill="rgba(14,165,233,0.4)">
        <circle cx="200" cy="100" r="3">
          <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="480" cy="300" r="4">
          <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="800" cy="180" r="3">
          <animate attributeName="r" values="3;5;3" dur="3.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1100" cy="400" r="5">
          <animate attributeName="r" values="5;7;5" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="640" cy="560" r="3">
          <animate attributeName="r" values="3;5;3" dur="4.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="900" cy="480" r="4">
          <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="320" cy="420" r="3"/>
        <circle cx="1350" cy="220" r="3"/>
        <circle cx="1200" cy="700" r="3"/>
      </g>
      
      {/* Ambient glow */}
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="1100" cy="200" r="300" fill="url(#glow1)" opacity="0.4"/>
      <circle cx="400" cy="700" r="250" fill="url(#glow2)" opacity="0.25"/>
    </svg>
  );
}