export function BlockchainIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Center node */}
      <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.2" />
      <circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Connecting nodes - top */}
      <circle cx="100" cy="30" r="12" fill="currentColor" opacity="0.15" />
      <circle cx="100" cy="30" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line
        x1="100"
        y1="42"
        x2="100"
        y2="85"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Connecting nodes - bottom */}
      <circle cx="100" cy="170" r="12" fill="currentColor" opacity="0.15" />
      <circle cx="100" cy="170" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line
        x1="100"
        y1="115"
        x2="100"
        y2="158"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Connecting nodes - left */}
      <circle cx="30" cy="100" r="12" fill="currentColor" opacity="0.15" />
      <circle cx="30" cy="100" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line
        x1="42"
        y1="100"
        x2="85"
        y2="100"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Connecting nodes - right */}
      <circle cx="170" cy="100" r="12" fill="currentColor" opacity="0.15" />
      <circle cx="170" cy="100" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line
        x1="115"
        y1="100"
        x2="158"
        y2="100"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Diagonal nodes - top-right */}
      <circle cx="150" cy="50" r="10" fill="currentColor" opacity="0.1" />
      <circle cx="150" cy="50" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line
        x1="114"
        y1="86"
        x2="144"
        y2="56"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.4"
      />

      {/* Diagonal nodes - top-left */}
      <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.1" />
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line
        x1="86"
        y1="86"
        x2="56"
        y2="56"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.4"
      />

      {/* Diagonal nodes - bottom-right */}
      <circle cx="150" cy="150" r="10" fill="currentColor" opacity="0.1" />
      <circle cx="150" cy="150" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line
        x1="114"
        y1="114"
        x2="144"
        y2="144"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.4"
      />

      {/* Diagonal nodes - bottom-left */}
      <circle cx="50" cy="150" r="10" fill="currentColor" opacity="0.1" />
      <circle cx="50" cy="150" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line
        x1="86"
        y1="114"
        x2="56"
        y2="144"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.4"
      />
    </svg>
  )
}
