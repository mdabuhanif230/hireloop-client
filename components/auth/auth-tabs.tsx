"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const tabs = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
] as const

/**
 * Segmented switch between the two auth routes. The violet thumb is a second
 * two-column grid behind the links, so `translate-x-full` always lands exactly
 * on the neighbouring segment (the nav deliberately carries no gap — the
 * links' own text is centred, so nothing else needs the 4px).
 */
export function AuthTabs({ className }: { className?: string }) {
  const pathname = usePathname()
  const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href))

  return (
    <nav
      aria-label="Account"
      className={cn(
        "relative grid grid-cols-2 rounded-[14px] border border-white/10 bg-[#0f0f11] p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <span aria-hidden="true" className="absolute inset-1 grid grid-cols-2">
        <span
          className={cn(
            "rounded-[10px] bg-[#5c53fe] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-transform duration-300 ease-out motion-reduce:transition-none",
            activeIndex === 1 && "translate-x-full"
          )}
        />
      </span>

      {tabs.map((tab, index) => {
        const active = index === activeIndex

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative z-10 flex h-10 items-center justify-center rounded-[10px] font-manrope text-[15px] font-semibold transition-colors",
              active ? "text-white" : "text-white/55 hover:text-white/90"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
