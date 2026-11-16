import Image from "next/image"

import { SectionHeading } from "@/components/section-heading/section-heading"

/**
 * Features — Figma frame 12022:10967 (1440×672, fill #151516): heading at
 * y120, then a 4×2 grid of 312×85 cells at y334 (24px column gutters, 48px
 * row gutters). Each cell is an 80×80 gradient tile (r8, 1px white/10) with a
 * 32×32 icon inset 24px, and a 208px text column 104px in.
 */
const cardGradient = "linear-gradient(180deg,#010102 12.23%,#313131 177.28%)"

const features = [
  {
    icon: "/images/icons/feat-1-smart-search.svg",
    title: "Smart Search",
    body: "Find your ideal job with advanced filters.",
  },
  {
    icon: "/images/icons/feat-2-salary.svg",
    title: "Salary Insights",
    body: "Get real salary data to negotiate confidently.",
  },
  {
    icon: "/images/icons/feat-3-companies.svg",
    title: "Top Companies",
    body: "Apply to vetted companies that are hiring.",
  },
  {
    icon: "/images/icons/feat-4-saved.svg",
    title: "Saved Jobs",
    body: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: "/images/icons/feat-5-click.svg",
    title: "One-Click Apply",
    body: "Simplify your job applications for an easier process!",
  },
  {
    icon: "/images/icons/feat-6-resume.svg",
    title: "Resume Builder",
    body: "Create professional resumes with modern templates.",
  },
  {
    icon: "/images/icons/feat-7-skill.svg",
    title: "Skill-Based Matching",
    body: "Discover jobs that match your skills and experience.",
  },
  {
    icon: "/images/icons/feat-8-growth.svg",
    title: "Career Growth Resources",
    body: "Boost your career with quick interview tips.",
  },
] as const

export function Features() {
  return (
    <section className="relative bg-[#151516]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-24 pb-24 sm:px-6 lg:px-0 lg:pt-[120px] lg:pb-[120px]">
        <SectionHeading eyebrow="features job">
          Everything you need to succeed
        </SectionHeading>

        <div className="mx-auto mt-16 w-full max-w-[1320px]">
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon, title, body }) => (
              <div key={title} className="flex gap-6">
                <div
                  style={{ backgroundImage: cardGradient }}
                  className="flex size-20 shrink-0 items-center justify-center rounded-[8px] border border-white/10"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
                  <h3 className="font-inter-tight text-[18px] leading-[1.4] font-medium text-white">
                    {title}
                  </h3>
                  <p className="font-inter-tight text-[16px] leading-[1.65] text-white/70">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
