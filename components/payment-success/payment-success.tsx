"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { ArrowRightIcon, CheckIcon, ShieldCheckIcon } from "lucide-react"

import type { CheckoutSession } from "@/lib/checkout/plan"

/** /checkout/success card: confirms the session the API created, then hands
 *  the buyer back to their workspace. */
export function PaymentSuccess({ session }: { session: CheckoutSession }) {
  const router = useRouter()
  const planTitle = session.plan.name.replace(/ Plan$/, "")
  useEffect(() => {
    const key = session.audience === "recruiters" ? "hireloop:recruiter-plan" : "hireloop:seeker-plan"
    const value = session.planId === "pro" ? "Pro" : session.planId === "premium" ? "Premium" : session.planId === "growth" ? "Growth" : "Enterprise"
    window.localStorage.setItem(key, JSON.stringify(value))
    const paymentsKey = session.audience === "recruiters" ? "hireloop:recruiter-payments" : "hireloop:seeker-payments"
    const previous = JSON.parse(window.localStorage.getItem(paymentsKey) ?? "[]") as unknown[]
    if (!previous.some((payment: unknown) => typeof payment === "object" && payment !== null && "id" in payment && payment.id === session.id)) {
      previous.unshift({ id: session.id, date: session.createdAt, plan: session.plan.name.replace(/ Plan$/, ""), amount: session.usd, transactionId: session.id, status: "paid" })
      window.localStorage.setItem(paymentsKey, JSON.stringify(previous))
    }
  }, [session])

  return (
    <div className="relative flex min-h-[72vh] items-center justify-center px-4 py-16">
      {/* Brand bloom behind the card, as in the design. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-6 left-1/2 h-44 w-[min(560px,80%)] -translate-x-1/2 rounded-full bg-[#1d4ed8]/35 blur-[90px]"
      />

      <section className="relative w-full max-w-[440px] rounded-[20px] border border-white/10 bg-[#121216] px-8 pt-9 pb-8 text-center shadow-[0_28px_70px_rgba(0,0,0,0.55)]">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#17b26a]">
          <CheckIcon
            aria-hidden="true"
            className="size-7 text-white"
            strokeWidth={3}
          />
        </span>

        <p className="mx-auto mt-5 inline-flex rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white uppercase">
          Upgrade Successful
        </p>

        <h1 className="mt-3 font-manrope text-[26px] leading-tight font-bold text-white">
          Welcome to {planTitle}
        </h1>

        <div className="mt-4 space-y-2 font-inter text-sm leading-relaxed text-white/60">
          <p>
            Your payment of{" "}
            <strong className="font-semibold text-white">
              {session.amount}
            </strong>{" "}
            was received perfectly.
          </p>
          <p>
            All advanced premium recruiting modules are unlocked on your
            account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 cursor-pointer font-inter text-sm text-[#5eead4] underline decoration-[#5eead4]/40 underline-offset-4 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
        >
          Refresh or authenticate to see the effect
        </button>

        <div className="mt-7 flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
          <span className="flex items-center gap-2 font-inter text-sm text-white/75">
            <ShieldCheckIcon
              aria-hidden="true"
              className="size-4 text-white/55"
            />
            Session ID Verified
          </span>
          <code className="max-w-[46%] truncate rounded-[6px] border border-white/12 bg-[#0b0b0e] px-2 py-1 font-mono text-[11px] text-[#9ca3af]">
            {session.id}
          </code>
        </div>

        <Link
          href={session.audience === "recruiters" ? "/deshboard/recruiter" : "/deshboard/seeker/billing"}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-white font-manrope text-[15px] font-semibold text-[#0b0b14] transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
        >
          Go to Workspace Dashboard
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      </section>
    </div>
  )
}
