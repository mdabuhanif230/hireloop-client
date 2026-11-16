import Image from "next/image"
import Link from "next/link"

/**
 * Footer — Figma frame 12022:10750 (1320×385, page x60/y5081, fill #010103,
 * r16). In Figma the CTA group paints *above* the footer and overlaps its
 * whole band (CTA y4502–5466, footer y5081–5466), which veils the footer with
 * the CTA's baked 50% black gradient + wireframe — `cta.tsx` is z-above this
 * component and `lg:-mt-[385px]` pulls it into that band, so the composite
 * matches the canvas. On its own the footer is: 40px top padding, a 193px
 * content row (logo+blurb 288 wide, three 163px link columns right-aligned in
 * a 632px block), a 72px gap, then the 40px social/copyright line.
 */
const columns = [
  {
    heading: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/worker-ai" },
      { label: "Companies", href: "/companies" },
      { label: "Salary data", href: "/salary" },
    ],
  },
  {
    heading: "Navigations",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Career library", href: "/career-library" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },
] as const

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "/images/icons/facebook-02.svg",
    highlighted: false,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: "/images/icons/pinterest.svg",
    highlighted: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "/images/icons/linkedin-02.svg",
    highlighted: false,
  },
] as const

export function Footer() {
  return (
    <footer className="relative z-0 lg:-mt-[385px]">
      <div className="mx-auto w-full max-w-[1320px] rounded-[16px] bg-[#010103] px-4 pt-10 pb-10 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-10 lg:h-[193px] lg:flex-row lg:justify-between">
          {/* Logo + blurb — 288 wide, body 24px under the 154×44 logo */}
          <div className="w-full max-w-[288px]">
            <Link
              href="/"
              className="inline-block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60"
              aria-label="HireLoop home"
            >
              <Image
                src="/images/logo.png"
                alt="HireLoop"
                width={154}
                height={44}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-6 font-manrope text-[16px] leading-[1.9] text-white/50">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          {/* Three 163px columns, 72px apart, right-aligned in 632px */}
          <div className="flex flex-wrap gap-x-[72px] gap-y-10 lg:w-[632px] lg:shrink-0">
            {columns.map((column) => (
              <nav
                key={column.heading}
                aria-label={column.heading}
                className="w-full max-w-[163px] sm:w-[163px]"
              >
                <h3 className="font-inter-tight text-[18px] leading-[1.4] font-medium text-[#5c53fe]">
                  {column.heading}
                </h3>
                <ul className="mt-6 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-manrope text-[16px] leading-[1.9] text-[#d0d5dd]/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Social line — 3× 40×40 r8 buttons (8px gaps) + copyright block */}
        <div className="mt-[72px] flex flex-col items-center gap-6 sm:flex-row sm:justify-between lg:h-10 lg:gap-6">
          <div className="flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={[
                  "flex size-10 items-center justify-center rounded-[8px] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none",
                  social.highlighted ? "bg-[#5c53fe]" : "bg-white/5",
                ].join(" ")}
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 font-manrope text-[16px] leading-[1.9]">
            <span className="text-[#acabb2]/70">
              Copyright 2024 —Programming Hero
            </span>
            <Link
              href="/terms"
              className="text-[#acabb2] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
            >
              Terms &amp; Policy - Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
