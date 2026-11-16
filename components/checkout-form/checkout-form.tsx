"use client"

import * as React from "react"

import {
  CheckIcon,
  ChevronDownIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LockIcon,
} from "lucide-react"

import { postJson } from "@/hooks/use-api"
import type { CheckoutCurrency } from "@/lib/checkout/plan"
import type { CheckoutInput } from "@/lib/checkout/store"

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "India",
  "Canada",
  "Germany",
  "Australia",
  "Singapore",
  "Japan",
  "United Arab Emirates",
]

/** The card saved to the sandbox "Link" shortcut above the form. */
const SAVED_CARD = {
  number: "4242 4242 4242 4242",
  expiry: "12/34",
  cvc: "123",
  name: "Link Shopper",
}

function groupCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim()
}

function groupExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[11px] font-medium tracking-[0.1em] text-white/45 uppercase">
      {children}
    </span>
  )
}

/** Right column of /checkout — the Stripe-style payment form.
 *
 *  Validation lives in the API (lib/checkout/store.ts) so the rules can't
 *  drift from what a real processor would accept; this form just shows the
 *  message the endpoint returns and calls `onPaid` with the new session. */
export function CheckoutForm({
  currency,
  planId,
  audience,
  onPaid,
}: {
  currency: CheckoutCurrency
  planId: string
  audience: "seekers" | "recruiters"
  onPaid: (sessionId: string) => void
}) {
  const [email, setEmail] = React.useState("")
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const [cvc, setCvc] = React.useState("")
  const [cardName, setCardName] = React.useState("")
  const [country, setCountry] = React.useState("Bangladesh")
  const [saveInfo, setSaveInfo] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function submit(card: {
    number: string
    expiry: string
    cvc: string
    name: string
  }) {
    setSubmitting(true)
    setError(null)

    const payload: CheckoutInput = {
      plan: planId,
      audience,
      currency,
      email: email.trim(),
      card: { ...card, country },
    }

    try {
      const { session } = await postJson<{ session: { id: string } }>(
        "/api/checkout",
        payload
      )
      onPaid(session.id)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment failed.")
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit({ number: cardNumber, expiry, cvc, name: cardName })
      }}
      className="flex flex-col gap-6"
    >
      {/* Link express shortcut — pays with the saved sandbox card. */}
      <button
        type="button"
        disabled={submitting}
        onClick={() =>
          void submit({
            number: SAVED_CARD.number,
            expiry: SAVED_CARD.expiry,
            cvc: SAVED_CARD.cvc,
            name: SAVED_CARD.name,
          })
        }
        className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-[8px] bg-[#00d66f] font-inter text-sm font-semibold text-[#04291a] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LockIcon aria-hidden="true" className="size-4" />
        <span>Link</span>
        <span aria-hidden="true" className="h-5 w-px bg-black/25" />
        <span className="rounded-[3px] bg-[#1a1f71] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white italic">
          VISA
        </span>
        <span className="tabular-nums">1242</span>
      </button>

      <p className="text-center text-sm text-white/40">or</p>

      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-inter text-sm font-semibold text-white">
            Contact Information
          </h2>
          <label className="mt-3 block">
            <FieldLabel>Email</FieldLabel>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
              className="h-11 w-full rounded-[8px] border border-white/15 bg-[#101014] px-3.5 font-inter text-sm text-white transition-colors outline-none placeholder:text-white/35 focus:border-[#5c53fe]"
            />
          </label>
        </div>

        <div>
          <h2 className="font-inter text-sm font-semibold text-white">
            Payment method
          </h2>

          <div className="mt-3 flex items-center gap-3 rounded-[8px] border border-white/15 bg-[#101014] px-3.5 py-3">
            <span className="grid size-4 place-items-center rounded-full border-[5px] border-[#5c53fe]" />
            <CreditCardIcon
              aria-hidden="true"
              className="size-4 text-white/70"
            />
            <span className="font-inter text-sm text-white">Card</span>
          </div>

          <div className="mt-4">
            <FieldLabel>Card information</FieldLabel>
            <div className="overflow-hidden rounded-[8px] border border-white/15 bg-[#101014] transition-colors focus-within:border-[#5c53fe]">
              <div className="flex items-center gap-3 px-3.5 py-3">
                <input
                  value={cardNumber}
                  onChange={(event) =>
                    setCardNumber(groupCardNumber(event.target.value))
                  }
                  inputMode="numeric"
                  placeholder="1234 1234 1234 1234"
                  aria-label="Card number"
                  autoComplete="cc-number"
                  className="min-w-0 flex-1 bg-transparent font-inter text-sm text-white outline-none placeholder:text-white/35"
                />
                <span
                  aria-hidden="true"
                  className="flex shrink-0 items-center gap-1.5"
                >
                  <span className="rounded-[3px] bg-[#1a1f71] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white italic">
                    VISA
                  </span>
                  <span className="flex">
                    <span className="size-3.5 rounded-full bg-[#eb001b]/85" />
                    <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b]/85" />
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-2 border-t border-white/12">
                <input
                  value={expiry}
                  onChange={(event) =>
                    setExpiry(groupExpiry(event.target.value))
                  }
                  inputMode="numeric"
                  placeholder="MM / YY"
                  aria-label="Expiry date"
                  autoComplete="cc-exp"
                  className="border-r border-white/12 bg-transparent px-3.5 py-3 font-inter text-sm text-white outline-none placeholder:text-white/35 focus:bg-white/[0.03]"
                />
                <div className="flex items-center gap-2 px-3.5 py-3">
                  <input
                    value={cvc}
                    onChange={(event) =>
                      setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    inputMode="numeric"
                    placeholder="CVC"
                    aria-label="Security code"
                    autoComplete="cc-csc"
                    className="min-w-0 flex-1 bg-transparent font-inter text-sm text-white outline-none placeholder:text-white/35"
                  />
                  <HelpCircleIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-white/35"
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="mt-4 block">
            <FieldLabel>Cardholder name</FieldLabel>
            <input
              value={cardName}
              onChange={(event) => setCardName(event.target.value)}
              placeholder="Full name on card"
              autoComplete="cc-name"
              className="h-11 w-full rounded-[8px] border border-white/15 bg-[#101014] px-3.5 font-inter text-sm text-white transition-colors outline-none placeholder:text-white/35 focus:border-[#5c53fe]"
            />
          </label>

          <label className="mt-4 block">
            <FieldLabel>Country or region</FieldLabel>
            <span className="relative block">
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="h-11 w-full cursor-pointer appearance-none rounded-[8px] border border-white/15 bg-[#101014] px-3.5 pr-9 font-inter text-sm text-white transition-colors outline-none focus:border-[#5c53fe]"
              >
                {COUNTRIES.map((name) => (
                  <option
                    key={name}
                    value={name}
                    className="bg-[#101014] text-white"
                  >
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50"
              />
            </span>
          </label>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={(event) => setSaveInfo(event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[4px] border border-white/25 transition-colors peer-checked:border-[#5c53fe] peer-checked:bg-[#5c53fe] peer-focus-visible:ring-2 peer-focus-visible:ring-[#5c53fe]/70"
          >
            {saveInfo && (
              <CheckIcon className="size-3 text-white" strokeWidth={4} />
            )}
          </span>
          <span className="font-inter text-sm text-white/70">
            Save my information for faster checkout
            <span className="mt-0.5 block text-xs text-white/40">
              Pay securely with this site and everywhere Link is accepted.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="font-inter text-sm text-[#ff7b7b]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="h-12 w-full cursor-pointer rounded-[8px] bg-[#0d6efd] font-inter text-[15px] font-semibold text-white transition-colors hover:bg-[#0b5ed7] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Processing…" : "Pay"}
      </button>
    </form>
  )
}
