import Image from "next/image"

interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-7 w-7 shrink-0">
        <Image
          src="/logo.png"
          alt="Lance Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="font-sans font-semibold text-[15px] tracking-wide">
        LANCE
      </span>
    </div>
  )
}
