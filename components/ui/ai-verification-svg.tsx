export function AIVerificationSVG({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="scan-line" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <filter id="ai-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Document being scanned */}
      <g transform="translate(100, 80)">
        <rect width="300" height="240" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2" />

        {/* Document content lines */}
        <rect x="30" y="30" width="120" height="12" rx="4" fill="#E5E7EB" />
        <rect x="30" y="55" width="240" height="8" rx="4" fill="#F3F4F6" />
        <rect x="30" y="70" width="220" height="8" rx="4" fill="#F3F4F6" />
        <rect x="30" y="85" width="200" height="8" rx="4" fill="#F3F4F6" />

        {/* Photo placeholder */}
        <rect x="30" y="110" width="80" height="100" rx="6" fill="#E5E7EB" />
        <circle cx="70" cy="145" r="15" fill="#9CA3AF" />
        <path d="M55 170 Q70 155 85 170 L85 195 L55 195 Z" fill="#9CA3AF" />

        {/* More document lines */}
        <rect x="125" y="120" width="140" height="8" rx="4" fill="#F3F4F6" />
        <rect x="125" y="140" width="120" height="8" rx="4" fill="#F3F4F6" />
        <rect x="125" y="160" width="130" height="8" rx="4" fill="#F3F4F6" />
        <rect x="125" y="180" width="110" height="8" rx="4" fill="#F3F4F6" />

        {/* Scanning line animation */}
        <rect x="0" y="0" width="300" height="4" fill="url(#scan-line)" filter="url(#ai-glow)">
          <animate attributeName="y" from="0" to="240" dur="3s" repeatCount="indefinite" />
        </rect>

        {/* Scan frame corners */}
        <path d="M0 0 L30 0 M0 0 L0 30" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <path d="M300 0 L270 0 M300 0 L300 30" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 240 L30 240 M0 240 L0 210" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <path d="M300 240 L270 240 M300 240 L300 210" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* AI brain visualization */}
      <g transform="translate(50, 180)">
        {/* Neural network nodes */}
        <g opacity="0.7">
          <circle cx="0" cy="0" r="6" fill="#8B5CF6" filter="url(#ai-glow)">
            <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="-20" r="5" fill="#EC4899" filter="url(#ai-glow)">
            <animate attributeName="r" values="5;7;5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="20" r="5" fill="#EC4899" filter="url(#ai-glow)">
            <animate attributeName="r" values="5;7;5" dur="2.2s" repeatCount="indefinite" />
          </circle>

          {/* Connections */}
          <line x1="0" y1="0" x2="30" y2="-20" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" />
          <line x1="0" y1="0" x2="30" y2="20" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" />
        </g>
      </g>

      {/* Verification checkmarks */}
      <g transform="translate(420, 100)">
        <circle cx="0" cy="0" r="25" fill="#10B981" opacity="0.2" />
        <circle cx="0" cy="0" r="20" fill="#10B981" filter="url(#ai-glow)" />
        <path
          d="M-8 0 L-3 6 L8 -6"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <text x="0" y="45" fontSize="11" fill="#10B981" textAnchor="middle" fontWeight="600">
          Verified
        </text>
      </g>

      {/* Data extraction indicators */}
      <g opacity="0.8">
        <g transform="translate(410, 180)">
          <rect x="0" y="0" width="70" height="20" rx="4" fill="#8B5CF6" opacity="0.1" />
          <text x="35" y="14" fontSize="10" fill="#8B5CF6" textAnchor="middle" fontWeight="600">
            OCR Active
          </text>
        </g>
        <g transform="translate(410, 210)">
          <rect x="0" y="0" width="70" height="20" rx="4" fill="#EC4899" opacity="0.1" />
          <text x="35" y="14" fontSize="10" fill="#EC4899" textAnchor="middle" fontWeight="600">
            Face Match
          </text>
        </g>
        <g transform="translate(410, 240)">
          <rect x="0" y="0" width="70" height="20" rx="4" fill="#10B981" opacity="0.1" />
          <text x="35" y="14" fontSize="10" fill="#10B981" textAnchor="middle" fontWeight="600">
            Tamper Check
          </text>
        </g>
      </g>

      {/* Processing particles */}
      <g opacity="0.3">
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} r="2" fill={i % 3 === 0 ? "#8B5CF6" : i % 3 === 1 ? "#EC4899" : "#10B981"}>
            <animateMotion
              path={`M ${100 + i * 15} 80 Q ${250} ${200 + (i % 2) * 40} ${420} ${100 + (i % 3) * 50}`}
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  )
}
