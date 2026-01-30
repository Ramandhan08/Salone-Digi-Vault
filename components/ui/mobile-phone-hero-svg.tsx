export function MobilePhoneHeroSVG({ className = "w-full h-full" }: { className?: string }) {
  return (
    <div className={className} style={{ perspective: "800px" }}>
      <style>
        {`
          @keyframes rotateZoom {
            0%   { transform: rotateY(0deg) scale(1); }
            25%  { transform: rotateY(60deg) scale(1.08); }
            50%  { transform: rotateY(0deg) scale(1.12); }
            75%  { transform: rotateY(-60deg) scale(1.08); }
            100% { transform: rotateY(0deg) scale(1); }
          }
          .phone-anim {
            transform-origin: center;
            transform-box: fill-box;
            animation: rotateZoom 8s ease-in-out infinite;
            will-change: transform;
          }
        `}
      </style>
      <svg viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg" className="phone-anim">
        <defs>
          <linearGradient id="phone-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="phone-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
        <g transform="translate(50,20)">
          <rect x="0" y="0" rx="36" width="200" height="560" fill="url(#phone-body)" />
          <rect x="10" y="16" rx="28" width="180" height="528" fill="#0A0F1E" />
          <rect x="14" y="20" rx="24" width="172" height="520" fill="url(#phone-screen)" />
          <circle cx="100" cy="42" r="6" fill="#0F172A" />
          <rect x="80" y="32" width="40" height="6" rx="3" fill="#0F172A" />
          <rect x="90" y="520" width="20" height="8" rx="4" fill="#1F2937" />
          <rect x="196" y="180" width="6" height="40" rx="3" fill="#0F172A" />
          <rect x="-2" y="140" width="6" height="60" rx="3" fill="#0F172A" />
          <g transform="translate(30,100)">
            <rect x="0" y="0" rx="16" width="124" height="90" fill="#0B1324" />
            <rect x="8" y="10" rx="12" width="108" height="70" fill="#0E1A33" />
            <rect x="16" y="18" rx="8" width="92" height="16" fill="#14B8A6" />
            <rect x="16" y="42" rx="8" width="92" height="16" fill="#22C55E" />
            <rect x="16" y="66" rx="8" width="60" height="10" fill="#F59E0B" />
          </g>
          <g transform="translate(30,210)">
            <rect x="0" y="0" rx="16" width="124" height="90" fill="#0B1324" />
            <rect x="8" y="10" rx="12" width="108" height="70" fill="#0E1A33" />
            <rect x="16" y="18" rx="8" width="92" height="16" fill="#6366F1" />
            <rect x="16" y="42" rx="8" width="92" height="16" fill="#3B82F6" />
            <rect x="16" y="66" rx="8" width="60" height="10" fill="#10B981" />
          </g>
          <g transform="translate(30,320)">
            <rect x="0" y="0" rx="16" width="124" height="90" fill="#0B1324" />
            <rect x="8" y="10" rx="12" width="108" height="70" fill="#0E1A33" />
            <rect x="16" y="18" rx="8" width="92" height="16" fill="#A855F7" />
            <rect x="16" y="42" rx="8" width="92" height="16" fill="#EC4899" />
            <rect x="16" y="66" rx="8" width="60" height="10" fill="#F97316" />
          </g>
        </g>
      </svg>
    </div>
  )
}
