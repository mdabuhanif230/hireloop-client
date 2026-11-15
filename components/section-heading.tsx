import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Centred eyebrow + headline shared by Smart Job Discovery, Features and
 * Pricing (Figma frames 2147234465 / 466 / 467): a Space Mono 20px label at
 * 80% white flanked by two 8×8 `#5c53fe` squares (16px gaps, eyebrow → headline
 * also 16px), then a Manrope SemiBold 48/1.15/-2% headline capped at 488px.
 */
export function SectionHeading({
  eyebrow,
  children,
  className,
}: {
  eyebrow: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="size-2 shrink-0 bg-[#5c53fe]" />
        <span className="font-space-mono text-[20px] leading-[1.2] whitespace-nowrap text-white/80">
          {eyebrow}
        </span>
        <span aria-hidden="true" className="size-2 shrink-0 bg-[#5c53fe]" />
      </div>

      <h2 className="max-w-[488px] text-center font-manrope text-[48px] leading-[1.15] font-semibold tracking-[-0.02em] text-white">
        {children}
      </h2>
    </div>
  )
}
