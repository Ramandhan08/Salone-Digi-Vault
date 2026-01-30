export function DigitalVaultHeroSVG({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background gradient */}
      <defs>
        <linearGradient id="vault-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="vault-door" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="lock-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="600" fill="url(#vault-gradient)" />

      {/* Floating document particles */}
      <g opacity="0.3">
        <rect x="100" y="80" width="40" height="50" rx="4" fill="#3B82F6" />
        <rect x="650" y="120" width="35" height="45" rx="4" fill="#6366F1" />
        <rect x="720" y="400" width="30" height="40" rx="4" fill="#3B82F6" />
        <rect x="80" y="450" width="38" height="48" rx="4" fill="#6366F1" />
      </g>

      {/* Main vault structure */}
      <g transform="translate(200, 150)">
        {/* Vault body */}
        <rect x="0" y="0" width="400" height="350" rx="8" fill="url(#vault-door)" stroke="#1E3A8A" strokeWidth="3" />

        {/* Vault details - rivets */}
        <circle cx="20" cy="20" r="6" fill="#0F172A" />
        <circle cx="380" cy="20" r="6" fill="#0F172A" />
        <circle cx="20" cy="330" r="6" fill="#0F172A" />
        <circle cx="380" cy="330" r="6" fill="#0F172A" />

        {/* Vault door panel */}
        <rect x="50" y="50" width="300" height="250" rx="4" fill="#1E3A8A" stroke="#0F172A" strokeWidth="2" />

        {/* Circular lock mechanism */}
        <g transform="translate(200, 175)">
          {/* Outer ring */}
          <circle cx="0" cy="0" r="60" fill="#0F172A" stroke="url(#lock-shine)" strokeWidth="4" filter="url(#glow)" />

          {/* Middle ring */}
          <circle cx="0" cy="0" r="50" fill="#1E3A8A" />

          {/* Lock spokes */}
          <line x1="0" y1="-40" x2="0" y2="-50" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="-28" x2="43" y2="- 35" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="28" x2="43" y2="35" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="40" x2="0" y2="50" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="-35" y1="28" x2="-43" y2="35" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="-35" y1="-28" x2="-43" y2="-35" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />

          {/* Center dial */}
          <circle cx="0" cy="0" r="25" fill="url(#lock-shine)" />

          {/* Dial indicator */}
          <rect x="-3" y="-25" width="6" height="15" rx="3" fill="#1E3A8A" />
        </g>

        {/* Handle */}
        <g transform="translate(320, 175)">
          <rect x="0" y="-8" width="40" height="16" rx="8" fill="#0F172A" />
          <circle cx="40" cy="0" r="10" fill="#0F172A" stroke="#60A5FA" strokeWidth="2" />
        </g>
      </g>

      {/* Security shield badge */}
      <g transform="translate(650, 80)">
        <path
          d="M60 0 L110 25 L110 70 Q110 95 60 110 Q10 95 10 70 L10 25 Z"
          fill="#10B981"
          stroke="#059669"
          strokeWidth="3"
          filter="url(#glow)"
        />
        <text x="60" y="60" fontSize="40" fill="white" textAnchor="middle" fontWeight="bold">
          ✓
        </text>
      </g>

      {/* Blockchain connection visualization */}
      <g opacity="0.6">
        <line x1="100" y1="500" x2="250" y2="480" stroke="#6366F1" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="100" cy="500" r="8" fill="#6366F1" />
        <circle cx="250" cy="480" r="8" fill="#3B82F6" />
        <line x1="250" y1="480" x2="400" y2="490" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="400" cy="490" r="8" fill="#6366F1" />
        <line x1="400" y1="490" x2="550" y2="475" stroke="#6366F1" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="550" cy="475" r="8" fill="#3B82F6" />
        <line x1="550" y1="475" x2="700" y2="495" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="700" cy="495" r="8" fill="#6366F1" />
      </g>
    </svg>
  )
}
