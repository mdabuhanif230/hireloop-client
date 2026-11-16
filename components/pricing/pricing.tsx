"use client"

import Image from "next/image"
import { useState } from "react"

import { SectionHeading } from "@/components/section-heading/section-heading"

/**
 * Pricing — Figma frame 12022:10634 (1440×987): centred heading at y120, then
 * the 1320px container at y334 holding the Monthly/Yearly toggle (257×59,
 * centred) and three 424×450 cards with 24px gutters.
 *
 * Card 2 (Growth) is the highlighted one: #151516 with a white/20 stroke and a
 * 0/0 blur-32 spread-8 #787878 @25% inner glow, plus the white button. The
 * other two sit on the page black (#010103) with a warm #f6efe1/20 stroke.
 */
type Audience = "seekers" | "recruiters"
type BillingCycle = "monthly" | "yearly"

const plans: Record<Audience, {
  title: string
  monthlyPrice: number
  icon: string
  featured?: boolean
  features: string[]
}[]> = {
  seekers: [
  {
    title: "Free",
    monthlyPrice: 0,
    icon: "/images/icons/price-icon-1.svg",
    featured: false,
    features: [
      "Browse and save up to 10 jobs",
      "Apply to 3 jobs per month",
      "Basic profile",
      "Email alerts",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 19,
    icon: "/images/icons/price-icon-2.svg",
    featured: true,
    features: [
      "Apply to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
  },
  {
    title: "Premium",
    monthlyPrice: 39,
    icon: "/images/icons/price-icon-3.svg",
    featured: false,
    features: [
      "Everything in Pro",
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
  },
  ],
  recruiters: [
    {
      title: "Free",
      monthlyPrice: 0,
      icon: "/images/icons/price-icon-1.svg",
      features: [
        "Up to 3 active job posts",
        "Basic applicant management",
        "Standard listing visibility",
      ],
    },
    {
      title: "Growth",
      monthlyPrice: 49,
      icon: "/images/icons/price-icon-2.svg",
      featured: true,
      features: [
        "Up to 10 active job posts",
        "Applicant tracking",
        "Basic analytics",
        "Email support",
      ],
    },
    {
      title: "Enterprise",
      monthlyPrice: 149,
      icon: "/images/icons/price-icon-3.svg",
      features: [
        "Up to 50 active job posts",
        "Advanced analytics dashboard",
        "Featured job listings",
        "Team collaboration and custom branding",
        "Priority support",
      ],
    },
  ],
}

function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle
  onChange: (value: BillingCycle) => void
}) {
  // The border and padding place the pills inside the 257×59 toggle.
  return (
    <div className="mx-auto flex h-[59px] w-[257px] items-center gap-2 rounded-[36px] border border-[#f6f6f6]/10 bg-white/15 p-[7px]">
      <button
        type="button"
        aria-pressed={value === "monthly"}
        onClick={() => onChange("monthly")}
        className={`h-[43px] w-[101px] rounded-[40px] border border-[#090a15]/10 font-inter text-[18px] leading-[1.5] font-medium tracking-[-0.02em] transition-colors ${value === "monthly" ? "bg-white text-[#010103]" : "bg-transparent text-white"}`}
      >
        Monthly
      </button>
      <button
        type="button"
        aria-pressed={value === "yearly"}
        onClick={() => onChange("yearly")}
        className={`flex h-[43px] w-[132px] items-center gap-2 rounded-[40px] border border-[#090a15]/10 pr-2 pl-3 transition-colors ${value === "yearly" ? "bg-white text-[#010103]" : "bg-[#090a15]/5 text-white"}`}
      >
        <span className={`font-inter text-[18px] leading-[1.5] font-medium tracking-[-0.02em] ${value === "yearly" ? "text-[#010103]" : "text-white"}`}>
          Yearly
        </span>
        <span className="font-geist flex h-[27px] w-[52px] items-center justify-center rounded-[24px] border border-[#7a7b8f]/10 bg-[#dc02ce] text-[16px] leading-[1.8] tracking-[-0.2px] text-white">
          25%
        </span>
      </button>
    </div>
  )
}

function PlanCard({
  title,
  monthlyPrice,
  icon,
  featured,
  features,
  billingCycle,
}: {
  title: string
  monthlyPrice: number
  icon: string
  featured?: boolean
  features: string[]
  billingCycle: BillingCycle
}) {
  const price = monthlyPrice === 0
    ? "$0"
    : `$${billingCycle === "yearly" ? (monthlyPrice * 0.75).toFixed(2).replace(/\.00$/, "") : monthlyPrice}`
  return (
    <article
      className={[
        "flex flex-col rounded-[24px] border p-6 lg:min-h-[450px]",
        featured
          ? "border-white/20 bg-[#151516] shadow-[inset_0_0_32px_8px_rgba(120,120,120,0.25)]"
          : "border-[#f6efe1]/20 bg-[#010103]",
      ].join(" ")}
    >
      {/* Header — icon + title left, price right (48px tall) */}
      <div className="flex h-12 items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-[#595959]/40">
            <Image
              src={icon}
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </span>
          <span className="font-plus-jakarta-sans text-[24px] leading-[1.4] tracking-[-0.5px] text-white">
            {title}
          </span>
        </div>

        <div className="flex items-end gap-1">
          <span className="font-plus-jakarta-sans text-[40px] leading-[1.2] font-semibold tracking-[-0.02em] text-white">
            {price}
          </span>
          <span className="mb-1 font-inter-tight text-[14px] leading-[1.7] text-white">
            {monthlyPrice === 0 ? "/forever" : "/month"}
          </span>
        </div>
      </div>

      {/* Features — title at y80 of the content box, list 12px under it */}
      <div className="mt-8">
        <h3 className="font-inter text-[18px] leading-[1.5] font-medium tracking-[-0.02em] text-white">
          Start building your insights hub:
        </h3>
        <ul className="mt-3 flex flex-col gap-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-[6px] border border-[#f6efe1]/10 bg-[#595959]/30">
                <Image
                  src="/images/icons/check.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
              </span>
              <span className="font-inter text-[16px] leading-[1.7] text-white/70">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button pinned to y371 (24px bottom padding on the 450px card) */}
      <button
        type="button"
        className={[
          "mt-auto flex h-[55px] w-full items-center rounded-[12px] px-6 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none",
          featured ? "bg-white" : "bg-[#595959]/50",
        ].join(" ")}
      >
        <span
          className={[
            "font-manrope text-[16px] leading-[1.7] font-semibold tracking-[-0.02em]",
            featured ? "text-[#010103]" : "text-white",
          ].join(" ")}
        >
          Choose This Plan
        </span>
        <Image
          src={
            featured
              ? "/images/icons/arrow-dark.svg"
              : "/images/icons/arrow-white.svg"
          }
          alt=""
          width={24}
          height={24}
          className="ml-auto size-6"
        />
      </button>
    </article>
  )
}

export function Pricing() {
  const [audience, setAudience] = useState<Audience>("seekers")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")

  return (
    // lg:mt-[18px] — the Figma Pricing frame starts 18px after Features
    // (y3497 vs the features frame ending at 3479).
    <section id="pricing" className="relative lg:mt-[18px]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-24 pb-24 sm:px-6 lg:px-0 lg:pt-[120px] lg:pb-[120px]">
        <SectionHeading eyebrow="Pricing">
          Pay for the leverage, not the listings
        </SectionHeading>

        <div className="mx-auto mt-16 w-full max-w-[1320px]">
          <div className="mb-6 flex justify-center gap-2" role="group" aria-label="Choose a pricing audience">
            {(["seekers", "recruiters"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={audience === option}
                onClick={() => setAudience(option)}
                className={`rounded-full px-5 py-3 font-inter text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#5c53fe] focus-visible:outline-none ${audience === option ? "bg-white text-[#010103]" : "border border-white/15 text-white hover:bg-white/10"}`}
              >
                {option === "seekers" ? "For Job Seekers" : "For Recruiters"}
              </button>
            ))}
          </div>

          <BillingToggle value={billingCycle} onChange={setBillingCycle} />
          {billingCycle === "yearly" && (
            <p className="mt-3 text-center font-inter text-sm text-white/60">25% off, billed annually</p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans[audience].map((plan) => (
              <PlanCard key={plan.title} {...plan} billingCycle={billingCycle} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
