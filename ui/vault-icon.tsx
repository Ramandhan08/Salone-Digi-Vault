export function VaultIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Vault door outer circle */}
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Vault handle/wheel */}
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />

      {/* Spokes */}
      <line x1="100" y1="70" x2="100" y2="90" stroke="currentColor" strokeWidth="3" />
      <line x1="100" y1="110" x2="100" y2="130" stroke="currentColor" strokeWidth="3" />
      <line x1="70" y1="100" x2="90" y2="100" stroke="currentColor" strokeWidth="3" />
      <line x1="110" y1="100" x2="130" y2="100" stroke="currentColor" strokeWidth="3" />

      {/* Diagonal spokes */}
      <line x1="79" y1="79" x2="91" y2="91" stroke="currentColor" strokeWidth="2.5" />
      <line x1="121" y1="121" x2="109" y2="109" stroke="currentColor" strokeWidth="2.5" />
      <line x1="121" y1="79" x2="109" y2="91" stroke="currentColor" strokeWidth="2.5" />
      <line x1="79" y1="121" x2="91" y2="109" stroke="currentColor" strokeWidth="2.5" />

      {/* Locking bolts - corners */}
      <rect x="170" y="95" width="15" height="10" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="15" y="95" width="15" height="10" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="95" y="170" width="10" height="15" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="95" y="15" width="10" height="15" rx="2" fill="currentColor" opacity="0.8" />

      {/* Center pin */}
      <circle cx="100" cy="100" r="8" fill="currentColor" />
      <circle cx="100" cy="100" r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}
