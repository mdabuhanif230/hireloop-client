import Image from "next/image"

import { SectionHeading } from "@/components/section-heading/section-heading"

/**
 * "Smart job discovery" — Figma frame 12022:10950 (1440×1302): centred
 * heading at y120, then the 3×2 grid of 424×363 job cards at y334 (24px
 * gutters) and the "View all job open" button 40px below it.
 *
 * All six cards are the same un-overridden Default instance of the
 * "Job List Card" component, so they share one set of copy.
 */
const jobCards = [0, 1, 2, 3, 4, 5] as const

const cardChips = [
  { icon: "/images/icons/location-06.svg", label: "New York, USA" },
  { icon: "/images/icons/briefcase-02.svg", label: "Hybrid" },
  { icon: "/images/icons/dollar-circle.svg", label: "€25–€40/hour" },
] as const

function JobCard() {
  return (
    <article className="flex flex-col rounded-[24px] bg-[#151516] px-6 pt-8 pb-6">
      {/* Title + body — Figma "Title+Body Text" (344×108, 12px apart) */}
      <div className="flex flex-col gap-3">
        <h3 className="font-inter text-[32px] leading-[1.3] font-medium tracking-[-0.05em] text-white">
          Frontend Developer
        </h3>
        <p className="font-inter text-[16px] leading-[1.7] tracking-[-0.02em] text-white/60">
          Showcase your commitment to diversity and inclusion by highlighting
          initiatives
        </p>
      </div>

      {/* Chips — 36px tall, #1f1f1f, 8px gutters (two rows: 155+8+95, then 151) */}
      <div className="mt-8 flex flex-wrap gap-2">
        {cardChips.map(({ icon, label }) => (
          <span
            key={label}
            className="flex h-9 items-center gap-2 rounded-[24px] bg-[#1f1f1f] pr-3 pl-3"
          >
            <Image
              src={icon}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0"
            />
            <span className="font-inter-tight text-[14px] leading-[1.7] font-medium tracking-[0.08em] whitespace-nowrap text-white">
              {label}
            </span>
          </span>
        ))}
      </div>

      {/* Apply — 154×55, #151516 on the #151516 card (the stroke-less button
          reads only by its 12px radius against the card padding) */}
      <button
        type="button"
        className="mt-8 flex h-[55px] w-[154px] items-center rounded-[12px] bg-[#151516] pr-6 pl-6 transition-colors hover:bg-[#1f1f1f] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
      >
        <span className="font-manrope text-[16px] leading-[1.7] font-semibold tracking-[-0.02em] text-white">
          Apply Now
        </span>
        <Image
          src="/images/icons/arrow-white.svg"
          alt=""
          width={24}
          height={24}
          className="ml-auto size-6"
        />
      </button>
    </article>
  )
}

export function JobDiscovery() {
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-24 pb-24 sm:px-6 lg:px-0 lg:pt-[120px] lg:pb-[120px]">
        <SectionHeading eyebrow="Smart job discovery">
          The roles you&apos;d never find by searching
        </SectionHeading>

        <div className="mx-auto mt-16 w-full max-w-[1320px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobCards.map((index) => (
              <JobCard key={index} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="h-[58px] rounded-[12px] bg-white px-6 font-instrument-sans text-[18px] leading-[1.45] font-medium text-[#0b0b14] transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
            >
              View all job open
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
