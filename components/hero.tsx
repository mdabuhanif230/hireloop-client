"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Briefcase, MapPin, Search } from "lucide-react"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
] as const

/**
 * Figma "Group 1" (1840×1952, placed at page x −200 / y −70). Every coordinate
 * below is the group's own, so the layers keep their exact relative placement.
 *
 * The group is centred horizontally (its contents are all centred on x = 720 in
 * the 1440 frame) so the glows stay pinned to the middle of the viewport at any
 * width, and the layer is clipped to the hero the same way the "Homepage" frame
 * clips it in Figma. `top: -168px` puts the group at page y −70, since the hero
 * starts 98px down (navbar margin 24 + bar 74).
 *
 * The haze's LUMINOSITY blend is baked into its fill (see the comment on the
 * Exclude path below), so the backdrop never needs to be a blend group.
 */
function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[-168px] bottom-0 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 ml-[-920px] h-[1952px] w-[1840px]">
        {/* image 15 — dot grid, layer blur 2, FILL */}
        <div className="absolute top-[608px] left-[330px] h-[731px] w-[1180px] blur-[2px]">
          <Image
            src="/images/dot-grid.png"
            alt=""
            width={1180}
            height={731}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Exclude — Figma boolean of a rect minus the arch, layer blur 244.
            The layer is #dc02ce at 50% with a LUMINOSITY blend against the
            #010103 frame fill, which is a no-op on hue: the result takes the
            source's luminosity (0.3·220 + 0.59·2 + 0.11·206 ≈ 90) over the
            backdrop's near-zero chroma, i.e. flat grey rgb(90,90,92) — then
            the 50% layer opacity scales it. Baking that into the fill keeps
            the output pixel-identical while dropping `mix-blend-mode`, which
            Chromium silently skips for this layer in some compositing
            contexts (it rendered magenta inside an iframe), leaving the raw
            #dc02ce bleeding through. */}
        <svg
          viewBox="0 0 1840 851.194"
          fill="none"
          className="absolute top-0 left-0 h-[851.194px] w-[1840px] opacity-50 blur-[244px]"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#5a5a5c"
            d="M0 0H1840V851.194H0ZM1840 851.195C1840 646.337 1743.072 541.87 1570.538 397.014C1398.005 252.158 1163.999 170.778 920 170.778C676.001 170.778 441.995 252.158 269.462 397.014C96.928 541.87 0 646.337 0 851.195L920 851.195L1840 851.195Z"
          />
        </svg>

        {/* Violet halo — solid ellipse, layer blur 148 */}
        <div className="absolute top-[891px] left-[302px] h-[1037px] w-[1236px] rounded-full bg-[#5c53fe] blur-[148px]" />

        {/* Dark base ellipse — masks the halo's core */}
        <div className="absolute top-[915px] left-[316px] h-[1037px] w-[1208px] rounded-full bg-[#010103]" />

        {/* Violet radial — centre sits on the ellipse's top edge (page 720,845) */}
        <div
          className="absolute top-[915px] left-[316px] h-[1037px] w-[1208px] rounded-full"
          style={{
            background:
              "radial-gradient(42.72% 42.72% at 50% 0%, rgb(92 83 254 / 1) 0%, rgb(92 83 254 / 0.6) 29%, rgb(92 83 254 / 0.5) 52%, rgb(92 83 254 / 0) 100%)",
          }}
        />

        {/* 19787698_61 1 — white vector line art, layer blur 36 */}
        <div className="absolute top-[682px] left-[39px] h-[741px] w-[1744px] blur-[36px]">
          <Image
            src="/images/line-art.svg"
            alt=""
            width={1744}
            height={741}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}

/** Shared placeholder styling — Satoshi 16 / 1.7, white @ 80%. */
const fieldClassName =
  "w-full min-w-0 appearance-none bg-transparent font-satoshi text-[16px] leading-[1.7] text-white caret-[#5c53fe] outline-none placeholder:text-white/80"

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [location, setLocation] = React.useState("")

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("query", query.trim())
    if (location.trim()) params.set("location", location.trim())
    const search = params.toString()
    router.push(search ? `/jobs?${search}` : "/jobs")
  }

  return (
    <section className="relative min-h-[calc(100svh-98px)]">
      <HeroBackdrop />

      <div className="relative mx-auto flex w-full max-w-[784px] flex-col gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-0 lg:pb-[286px] lg:pt-[176px]">
        {/* Badge + headline — Figma "Frame 2147234455", gap 32, centred */}
        <div className="flex flex-col items-center gap-8">
          {/* Badge row — 64px rules flanking a 48px pill, Figma "Frame 2147234462".
              The frame carries a 1px inset on every side (row 549×50, pill at
              y=1, rules on the row's centre line at y=25), hence p-px. */}
          <div className="relative flex items-center p-px">
            {/* Gradient paint for the badge icon (lucide maps `color` → stroke). */}
            <svg
              aria-hidden="true"
              focusable="false"
              width="0"
              height="0"
              className="absolute top-0 left-0 size-0 overflow-hidden"
            >
              <defs>
                <linearGradient id="hero-badge-icon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e6eeff" />
                  <stop offset="1" stopColor="#bac8fa" />
                </linearGradient>
              </defs>
            </svg>

            <span
              aria-hidden="true"
              className="hidden h-px w-16 bg-[linear-gradient(90deg,#010123_0%,#a8a8a8_100%)] opacity-70 md:block"
            />

            <span
              className="flex items-center gap-4 rounded-[24px] px-3 py-2 shadow-[inset_0_0_6px_6px_rgba(0,0,0,0.1)] sm:px-4 sm:py-2.5 lg:px-6 lg:py-3"
              style={{
                backgroundImage: "linear-gradient(180deg,#1b1b1c 0%,#010102 100%)",
              }}
            >
              <Briefcase
                aria-hidden="true"
                color="url(#hero-badge-icon)"
                className="size-5 shrink-0 sm:size-6"
              />

              <span className="font-space-mono text-[13px] leading-[1.2] whitespace-nowrap text-white sm:text-[16px] lg:text-[20px]">
                50,000+ new jobs this month
              </span>
            </span>

            <span
              aria-hidden="true"
              className="hidden h-px w-16 bg-[linear-gradient(90deg,#a8a8a8_0%,#010123_100%)] opacity-70 md:block"
            />
          </div>

          {/* Headline — Manrope Bold 56/1.15, tracking −2%; sub 20/1.6 @ 70% */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-center font-manrope text-[32px] leading-[1.15] font-bold tracking-[-0.02em] text-white sm:text-[44px] lg:text-[56px]">
              Find Your Dream Job Today
            </h1>
            <p className="text-center font-manrope text-[16px] leading-[1.6] font-normal text-white/70 sm:text-[18px] lg:text-[20px]">
              HireLoop connects top talent with world-class companies. Browse
              thousands of curated opportunities and land your next role —
              faster.
            </p>
          </div>
        </div>

        {/* Search + trending — Figma "Frame 2147234454", gap 24 */}
        <div className="flex flex-col items-center gap-6">
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col gap-3 rounded-[16px] bg-[#101010] p-4 md:flex-row md:items-center md:gap-6 md:py-2 md:pr-2 md:pl-6"
          >
            <label className="flex min-w-0 flex-1 items-center gap-2">
              <Search aria-hidden="true" className="size-6 shrink-0 text-white" />
              <input
                type="search"
                name="query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Job title, skill or company"
                aria-label="Job title, skill or company"
                className={fieldClassName}
              />
            </label>

            <span
              aria-hidden="true"
              className="h-px w-full bg-white/20 md:h-[23px] md:w-px"
            />

            <label className="flex min-w-0 flex-1 items-center gap-2">
              <MapPin aria-hidden="true" className="size-6 shrink-0 text-white" />
              <input
                type="search"
                name="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location or Remote"
                aria-label="Location or Remote"
                className={fieldClassName}
              />
            </label>

            <button
              type="submit"
              aria-label="Search jobs"
              className="flex h-12 w-full shrink-0 items-center justify-center rounded-[12px] bg-[#5c53fe] transition-colors hover:bg-[#6a61ff] focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none md:w-12"
            >
              <Search aria-hidden="true" className="size-6 text-white" />
            </button>
          </form>

          {/* Trending — label + chips, Figma "Frame 2147234453" */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="font-manrope text-[16px] leading-[1.3] font-normal text-white/70">
              Trending Position
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {trendingPositions.map((position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() => setQuery(position)}
                  className="rounded-[24px] bg-[#1a1a1b] px-3 py-1.5 font-manrope text-[14px] leading-[1.5] font-normal text-white transition-colors hover:bg-[#262629] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
