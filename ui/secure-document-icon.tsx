export function SecureDocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Document background */}
      <rect
        x="40"
        y="20"
        width="120"
        height="160"
        rx="8"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Document fold */}
      <path d="M 140 20 L 140 40 L 160 40 L 160 20 Z" fill="currentColor" fillOpacity="0.1" />
      <line x1="140" y1="20" x2="140" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="140" y1="40" x2="160" y2="40" stroke="currentColor" strokeWidth="2" />

      {/* Text lines */}
      <line x1="60" y1="60" x2="140" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="60" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="60" y1="100" x2="120" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.3" />

      {/* Shield overlay */}
      <path
        d="M 100 110 L 80 120 L 80 145 C 80 155 90 162 100 165 C 110 162 120 155 120 145 L 120 120 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />

      {/* Checkmark in shield */}
      <path
        d="M 92 140 L 97 145 L 108 130"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
