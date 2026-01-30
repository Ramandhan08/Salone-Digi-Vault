import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { image: 32, text: "text-lg" },
    md: { image: 40, text: "text-xl" },
    lg: { image: 48, text: "text-2xl" },
  }

  const { image, text } = sizes[size]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image src="/logo.png" alt="Salone-Digi0-Vault Logo" width={image} height={image} className="object-contain" />
      {showText && (
        <div>
          <h1 className={`${text} font-bold text-foreground leading-tight`}>Salone-Digi0-Vault</h1>
          <p className="text-xs text-muted-foreground">Secure Digital Identity System</p>
        </div>
      )}
    </div>
  )
}
