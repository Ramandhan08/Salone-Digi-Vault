"use client"

export function AnimatedPhoneImage({
  src = "/iphone.png",
  fallback = "/placeholder.jpg",
  className = "w-full h-auto",
}: {
  src?: string
  fallback?: string
  className?: string
}) {
  const imageSrc = src
  return (
    <div className={className} style={{ perspective: "800px" }}>
      <style>
        {`
          @keyframes phoneFly {
            0%   { transform: rotateY(0deg) rotateZ(0deg) translateY(0) scale(1); }
            25%  { transform: rotateY(20deg) rotateZ(2deg) translateY(-6px) scale(1.04); }
            50%  { transform: rotateY(0deg) rotateZ(0deg) translateY(0) scale(1.06); }
            75%  { transform: rotateY(-18deg) rotateZ(-2deg) translateY(6px) scale(1.04); }
            100% { transform: rotateY(0deg) rotateZ(0deg) translateY(0) scale(1); }
          }
          .phone-fx {
            animation: phoneFly 9s ease-in-out infinite;
            transform-origin: center;
            will-change: transform;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.25));
          }
        `}
      </style>
      <img
        src={imageSrc}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallback
        }}
        alt="Mobile phone"
        className={`phone-fx ${className}`}
      />
    </div>
  )
}
