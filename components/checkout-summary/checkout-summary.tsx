"use client"

import Image from "next/image"

import { formatAmount, type CheckoutCurrency } from "@/lib/checkout/plan"
import { cn } from "@/lib/utils"

const CURRENCIES: { code: CheckoutCurrency; flag: string; label: string }[] = [
  { code: "bdt", flag: "/images/flags/bd.svg", label: "BDT" },
  { code: "usd", flag: "/images/flags/us.svg", label: "USD" },
]

/** Left column of /checkout: currency picker, the printed FX note and the
 *  plan being bought. Amounts come from lib/checkout/plan.ts so the summary
 *  and the session the API creates can never disagree. */
export function CheckoutSummary({
  plan,
  currency,
  onCurrencyChange,
}: {
  plan: { name: string; description: string; usd: number }
  currency: CheckoutCurrency
  onCurrencyChange: (currency: CheckoutCurrency) => void
}) {
  return (
    <section>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
        Choose a currency:
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {CURRENCIES.map(({ code, flag, label }) => {
          const active = currency === code

          return (
            <button
              key={code}
              type="button"
              aria-pressed={active}
              onClick={() => onCurrencyChange(code)}
              className={cn(
                "flex items-center gap-3 rounded-[10px] border bg-[#111114] px-4 py-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none",
                active
                  ? "border-[#5c53fe] shadow-[0_0_0_1px_#5c53fe]"
                  : "border-white/12 hover:border-white/30"
              )}
            >
              <Image
                src={flag}
                alt={`${label} flag`}
                width={26}
                height={18}
                className="h-[18px] w-[26px] shrink-0 rounded-[2px] object-cover"
              />
              <span className="font-inter text-[15px] font-semibold text-white">
                {formatAmount(code, plan.usd)}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-2.5 text-xs text-white/40">1 USD = 127.67 BDT</p>

      <div className="mt-10 flex items-start justify-between gap-6">
        <div>
          <h2 className="font-manrope text-lg font-semibold text-white">
            {plan.name}
          </h2>
          <p className="mt-1 text-sm text-white/50">{plan.description}</p>
        </div>
        <p className="font-manrope text-lg font-semibold whitespace-nowrap text-white">
          {formatAmount(currency, plan.usd)}
        </p>
      </div>
    </section>
  )
}
