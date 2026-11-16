import Image from "next/image"

/**
 * Stats band directly under the hero — Figma "Frame 2147234448" (1440×550,
 * page y 955): a centred statement over the hero backdrop, then the 4 metric
 * cards.
 *
 * The band has no backdrop of its own; it sits on top of "Group 1", which
 * `HeroBackdrop` renders. Cards are 312×254 with the shared Figma linear
 * gradient (#010102 → #313131): the gradient transform maps the box's top edge
 * to 12.23% and runs past the bottom (177.28%), so the card never reaches the
 * lighter stop — the bottom lands on ~#1a1a1b.
 */
const cardGradient = "linear-gradient(180deg,#010102 12.23%,#313131 177.28%)"

const stats = [
  {
    icon: "/images/icons/stats-1-job-search.svg",
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: "/images/icons/stats-2-ranking.svg",
    value: "12K",
    label: "Companies",
  },
  {
    icon: "/images/icons/stats-3-job-search-man.svg",
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: "/images/icons/stats-4-star.svg",
    value: "97%",
    label: "Satisfaction Rate",
  },
] as const

export function StatsSection() {
  return (
    <section className="relative">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 pt-16 pb-16 sm:px-6 lg:px-0 lg:pt-[72px] lg:pb-[72px]">
        {/* Statement — Instrument Sans Medium 40/1.3, tracking −1px, white 70%,
            600px wide (centred in the 1320 container → page x 420). */}
        <h2 className="w-full max-w-[600px] text-center font-instrument-sans text-[26px] leading-[1.3] font-medium tracking-[-1px] text-white/70 sm:text-[32px] lg:text-[40px]">
          Assisting over 15,000 job seekers find their dream positions.
        </h2>

        {/* Metrics — 4× 312×254 with a 24px gutter (page x 60 → 1380). */}
        <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {stats.map(({ icon, value, label }) => (
            <div
              key={label}
              style={{ backgroundImage: cardGradient }}
              className="flex flex-col rounded-[16px] border border-white/10 px-6 pt-6 pb-6 lg:h-[254px]"
            >
              <Image
                src={icon}
                alt=""
                width={24}
                height={24}
                className="size-6"
              />

              {/* Value block starts at card y 120; label 16px under the value. */}
              <div className="mt-[72px]">
                <div className="font-plus-jakarta-sans text-[40px] leading-[1.15] font-semibold tracking-[-0.02em] text-white lg:text-[56px]">
                  {value}
                </div>
                <div className="mt-4 font-inter-tight text-[18px] leading-[1.65] font-normal text-white">
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
