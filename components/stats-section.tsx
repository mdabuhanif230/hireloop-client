import Image from "next/image"

import { Briefcase, ChartColumn, Search, Star } from "lucide-react"

/**
 * Stats band directly under the hero — Figma "Assisting over 15,000 job
 * seekers" frame: globe backdrop, centred statement, 4 metric cards.
 *
 * globe.png is 1440×1882 with a magenta crown above a black gap; the layer is
 * shifted up by 46% of its width (percentage margins resolve against the
 * container width, so the crop scales with the viewport) which clips the
 * magenta away and starts the band right at the blue horizon.
 */
const stats = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: ChartColumn, value: "12K", label: "Companies" },
  { icon: Search, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

export function StatsSection() {
  return (
    // overflow stays visible: the globe layer starts 118px above the section so
    // its glow ramps across the hero/band boundary instead of being cut by it.
    // app/page.tsx clips the layer's bottom.
    <section className="relative pb-12 sm:pb-12 lg:pb-4">
      {/* Globe — decorative, full-bleed, clipped inside this wrapper */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden lg:top-[-118px]"
      >
        <Image
          src="/images/globe.png"
          alt=""
          width={1440}
          height={1882}
          className="-mt-[46%] h-auto w-full max-w-none"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-4 pt-[160px] sm:px-6 sm:pt-[180px] lg:px-[60px] lg:pt-[229px]">
        {/* Statement — Manrope, centred over the globe's upper hemisphere */}
        <h2 className="mx-auto max-w-[720px] text-center font-manrope text-[26px] leading-[1.3] font-medium text-balance text-white sm:text-[32px] lg:text-[40px]">
          Assisting over 15,000 job seekers find their dream positions.
        </h2>

        {/* Metrics — Figma card row, 4-up from lg, 2-up from sm */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-[51px] lg:grid-cols-4 lg:gap-5">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex min-h-[176px] flex-col justify-between rounded-[16px] border border-white/[0.08] bg-[#0a0a0b] p-5 lg:min-h-[238px] lg:p-6"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-white/90">
                <Icon aria-hidden="true" className="size-4" />
              </span>

              <div>
                <div className="font-manrope text-[40px] leading-none font-semibold text-white lg:text-[44px]">
                  {value}
                </div>
                <div className="mt-2 font-manrope text-[14px] leading-[1.4] text-white/60 lg:text-[16px]">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
