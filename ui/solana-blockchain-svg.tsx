"use client"

import { useEffect, useState } from "react"

export function SolanaBlockchainSVG({ className = "w-full h-full" }: { className?: string }) {
  const [particles, setParticles] = useState<Array<{
    cx: number
    cy: number
    from: number
    to: number
    dur: number
    fill: string
  }>>([])

  useEffect(() => {
    // Generate particles only on client side
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      cx: Math.random() * 600,
      cy: Math.random() * 400,
      from: Math.random() * 400,
      to: Math.random() * 400,
      dur: 3 + Math.random() * 4,
      fill: i % 2 === 0 ? "#14F195" : "#9945FF",
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14F195" />
          <stop offset="50%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id="block-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9945FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#14F195" stopOpacity="0.6" />
        </linearGradient>
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background grid */}
      <g opacity="0.1" stroke="#9945FF" strokeWidth="1">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="400" />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 30} x2="600" y2={i * 30} />
        ))}
      </g>

      {/* Blockchain blocks */}
      <g>
        {/* Block 1 */}
        <g transform="translate(50, 150)">
          <rect
            width="120"
            height="100"
            rx="8"
            fill="url(#block-gradient)"
            stroke="#14F195"
            strokeWidth="2"
            filter="url(#neon-glow)"
          />
          <text x="60" y="30" fontSize="12" fill="#14F195" textAnchor="middle" fontWeight="bold">
            BLOCK
          </text>
          <text x="60" y="50" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">
            #12847
          </text>
          <text x="10" y="75" fontSize="10" fill="#14F195" fontFamily="monospace">
            Hash: 7a8f...
          </text>
          <circle cx="110" cy="50" r="6" fill="#14F195" />
        </g>

        {/* Connecting line */}
        <line
          x1="170"
          y1="200"
          x2="220"
          y2="200"
          stroke="url(#solana-gradient)"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />

        {/* Block 2 */}
        <g transform="translate(220, 150)">
          <rect
            width="120"
            height="100"
            rx="8"
            fill="url(#block-gradient)"
            stroke="#14F195"
            strokeWidth="2"
            filter="url(#neon-glow)"
          />
          <text x="60" y="30" fontSize="12" fill="#14F195" textAnchor="middle" fontWeight="bold">
            BLOCK
          </text>
          <text x="60" y="50" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">
            #12848
          </text>
          <text x="10" y="75" fontSize="10" fill="#14F195" fontFamily="monospace">
            Hash: 4b2e...
          </text>
          <circle cx="110" cy="50" r="6" fill="#14F195" />
        </g>

        {/* Connecting line */}
        <line x1="340" y1="200" x2="390" y2="200" stroke="url(#solana-gradient)" strokeWidth="3" />

        {/* Block 3 - Current */}
        <g transform="translate(390, 150)">
          <rect
            width="120"
            height="100"
            rx="8"
            fill="url(#block-gradient)"
            stroke="#9945FF"
            strokeWidth="3"
            filter="url(#neon-glow)"
          />
          <text x="60" y="30" fontSize="12" fill="#9945FF" textAnchor="middle" fontWeight="bold">
            CURRENT
          </text>
          <text x="60" y="50" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">
            #12849
          </text>
          <text x="10" y="75" fontSize="10" fill="#14F195" fontFamily="monospace">
            Hash: 9c3d...
          </text>

          {/* Mining indicator */}
          <g opacity="0.8">
            <circle cx="60" cy="88" r="3" fill="#14F195">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="88" r="3" fill="#14F195">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="88" r="3" fill="#14F195">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </g>

      {/* Solana logo representation */}
      <g transform="translate(250, 50)">
        {/* Stylized S shape with gradient */}
        <path
          d="M20 10 L80 10 Q100 10 100 30 Q100 50 80 50 L40 50 Q20 50 20 70 Q20 90 40 90 L100 90"
          stroke="url(#solana-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow)"
        />
      </g>

      {/* Transaction flow indicators */}
      <g opacity="0.6">
        <g transform="translate(100, 280)">
          <circle cx="0" cy="0" r="5" fill="#14F195" />
          <text x="15" y="5" fontSize="11" fill="#9945FF" fontWeight="500">
            Transaction verified
          </text>
        </g>
        <g transform="translate(270, 310)">
          <circle cx="0" cy="0" r="5" fill="#9945FF" />
          <text x="15" y="5" fontSize="11" fill="#14F195" fontWeight="500">
            Block confirmed
          </text>
        </g>
        <g transform="translate(420, 285)">
          <circle cx="0" cy="0" r="5" fill="#14F195" />
          <text x="15" y="5" fontSize="11" fill="#9945FF" fontWeight="500">
            Immutable record
          </text>
        </g>
      </g>

      {/* Data particles - only render on client */}
      {particles.length > 0 && (
        <g opacity="0.4">
          {particles.map((particle, i) => (
            <circle
              key={i}
              cx={particle.cx}
              cy={particle.cy}
              r={2}
              fill={particle.fill}
            >
              <animate
                attributeName="cy"
                from={particle.from}
                to={particle.to}
                dur={`${particle.dur}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      )}

      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#14F195" />
        </marker>
      </defs>
    </svg>
  )
}
