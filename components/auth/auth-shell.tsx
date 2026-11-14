import Image from "next/image"
import type { ReactNode } from "react"

import { AuthTabs } from "@/components/auth/auth-tabs"

/** Reuse the homepage stat band's numbers so the two pages never disagree. */
const brandStats = [
  { value: "50K", label: "Active jobs" },
  { value: "12K", label: "Companies" },
  { value: "97%", label: "Satisfaction" },
] as const

/**
 * Shared chrome for /sign-in and /sign-up: one split card. The left half is
 * the brand panel — the site's own dot grid over the CTA wireframe dome, lit
 * by a violet backlight that drifts slowly (`.auth-glow-drift`, keyframed in
 * app/globals.css and disabled under prefers-reduced-motion). The right half
 * is the form column; both halves meet on a violet hairline seam.
 *
 * The root layout already renders the navbar above this, so the shell only
 * adds its own padding.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative px-4 pt-6 pb-16 sm:px-6 sm:pb-24">
      <PageGlow />

      <div className="relative mx-auto w-full max-w-[1160px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#050507] shadow-[0_40px_120px_-60px_rgba(92,83,254,0.45),0_24px_80px_rgba(0,0,0,0.7)]">
        <div className="grid lg:grid-cols-2">
          <BrandPanel />

          <section className="relative flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            {/* Seams — horizontal above the form on small screens, vertical
                between the halves from lg up. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#5c53fe]/70 to-transparent lg:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute inset-y-10 left-0 hidden w-px bg-gradient-to-b from-transparent via-[#5c53fe]/70 to-transparent lg:block"
            />

            <div className="mx-auto flex w-full max-w-[440px] flex-col">
              <AuthTabs className="mb-8" />
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function PageGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <span className="absolute top-[-200px] left-1/2 h-[480px] w-[860px] -translate-x-1/2 rounded-full bg-[#5c53fe]/20 blur-[130px]" />
      <span className="absolute right-[-140px] bottom-[-180px] h-[380px] w-[480px] rounded-full bg-[#5c53fe]/12 blur-[140px]" />
    </div>
  )
}

function BrandPanel() {
  return (
    <aside className="relative flex min-h-[300px] flex-col justify-between gap-10 overflow-hidden border-b border-white/[0.08] bg-[#010103] px-6 pt-8 pb-8 sm:px-10 lg:min-h-[680px] lg:border-r lg:border-b-0 lg:px-12 lg:pt-12 lg:pb-12">
      {/* Violet backlight, drifting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-140px] flex justify-center"
      >
        <span className="auth-glow-drift h-[280px] w-[70%] rounded-full bg-[#5c53fe]/45 blur-[80px]" />
      </div>

      {/* Wireframe dome — the homepage CTA art, anchored to the panel floor */}
      <Image
        src="/images/cta-bg.png"
        alt=""
        width={1440}
        height={964}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 w-[150%] max-w-none -translate-x-1/2 opacity-45 lg:opacity-75"
      />

      {/* Dot grid paints over the dome: the dome's lower half is 50% black and
          would otherwise cut a hard edge through the dots. */}
      <Image
        src="/images/dot-grid.png"
        alt=""
        width={816}
        height={505}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="relative flex flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 font-space-mono text-[11px] tracking-[0.18em] text-white/70 uppercase shadow-[inset_0_0_6px_6px_rgba(0,0,0,0.1)]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#5c53fe] shadow-[0_0_10px_#5c53fe]"
          />
          HireLoop / Auth
        </span>

        <h2 className="max-w-[16ch] font-manrope text-[30px] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-white sm:text-[38px]">
          Every great career runs in loops.
        </h2>

        <p className="max-w-[46ch] font-manrope text-[15px] leading-[1.65] text-white/60 sm:text-[16px]">
          Sign in to keep your saved jobs, applications, and matches in sync —
          and pick up exactly where you left off.
        </p>
      </div>

      <div className="relative hidden lg:block">
        <span
          aria-hidden="true"
          className="block h-px w-full bg-gradient-to-r from-white/25 to-transparent"
        />

        <div className="mt-5 grid grid-cols-3 gap-4">
          {brandStats.map((stat) => (
            <div key={stat.label}>
              <div className="font-manrope text-[30px] leading-none font-semibold text-white">
                {stat.value}
              </div>
              <div className="mt-2 font-space-mono text-[11px] tracking-[0.16em] text-white/45 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
