"use client"

import { useRouter } from "next/navigation"
import { useState, useSyncExternalStore } from "react"

import { ArrowLeftIcon, LockIcon } from "lucide-react"

import { CheckoutForm } from "@/components/checkout-form/checkout-form"
import { CheckoutSummary } from "@/components/checkout-summary/checkout-summary"
import type { CheckoutCurrency, CheckoutPlan } from "@/lib/checkout/plan"
import { CHECKOUT_PLAN, getCheckoutPlan } from "@/lib/checkout/plan"

const subscribeToSearch = (callback: () => void) => {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}
const getSearchSnapshot = () => window.location.search
const getServerSearchSnapshot = () => ""

/** /checkout — Stripe-style payment screen (sandbox: no Stripe key in this
 *  project, the session comes from POST /api/checkout). The marketing navbar
 *  sits out this route (components/navbar/navbar.tsx), which is why the bar
 *  carries its own back button. */
export default function CheckoutPage() {
  const router = useRouter()
  const [currency, setCurrency] = useState<CheckoutCurrency>("bdt")
  const search = useSyncExternalStore(subscribeToSearch, getSearchSnapshot, getServerSearchSnapshot)
  const planParams = new URLSearchParams(search)
  const plan: CheckoutPlan = search ? getCheckoutPlan(planParams.get("plan") ?? undefined, planParams.get("audience") ?? undefined) : CHECKOUT_PLAN

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/")
  }

  return (
    <div className="min-h-svh bg-[#0b0b0d] text-white">
      <header className="relative mx-auto flex w-full max-w-[1040px] items-center justify-between px-4 pt-5 sm:px-6">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="grid size-9 cursor-pointer place-items-center rounded-[8px] text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-5" />
        </button>

        <span
          aria-hidden="true"
          className="absolute left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-[8px] bg-white/8 text-white"
        >
          <LockIcon className="size-4" />
        </span>

        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white/70">
          SANDBOX
        </span>
      </header>

      <main className="mx-auto grid w-full max-w-[1040px] gap-10 px-4 pt-10 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:pt-14">
        <CheckoutSummary
          plan={plan}
          currency={currency}
          onCurrencyChange={setCurrency}
        />

        <CheckoutForm
          planId={plan.id}
          audience={plan.audience}
          currency={currency}
          onPaid={(sessionId) =>
            router.push(
              `/checkout/success?session=${encodeURIComponent(sessionId)}`
            )
          }
        />
      </main>

      <footer className="border-t border-white/8 py-6">
        <p className="text-center font-inter text-xs text-white/40">
          Powered by Stripe
          <span className="mx-2 text-white/25" aria-hidden="true">
            ·
          </span>
          <a
            href="https://stripe.com/legal"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-white/70"
          >
            Terms
          </a>
          <span className="mx-2 text-white/25" aria-hidden="true">
            ·
          </span>
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-white/70"
          >
            Privacy
          </a>
        </p>
      </footer>
    </div>
  )
}
