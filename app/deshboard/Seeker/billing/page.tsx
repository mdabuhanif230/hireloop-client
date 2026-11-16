"use client"

import Link from "next/link"
import {
  CheckCircle2Icon,
  CreditCardIcon,
  DownloadIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { useApi } from "@/hooks/use-api"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { formatDate, formatMoney } from "@/lib/seeker/format"
import type { BillingInvoice, BillingResponse } from "@/lib/seeker/types"
import type { PaymentMethod } from "@/lib/seeker/types"
import { PaymentMethodForm } from "@/components/dashboard/seeker/payment-method-form"
import { useDemoStorage } from "@/hooks/use-demo-storage"

import { PageHeader } from "../_components/page-header"
import { Panel } from "../_components/panel"
import { ErrorState, RowsSkeleton } from "../_components/states"
import { NotificationActions, Topbar } from "../_components/topbar"

const PRIMARY_BUTTON_CLASS =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 outline-none"

const SECONDARY_BUTTON_CLASS =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/5 px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 outline-none"

const CHIP_LABEL_CLASS =
  "inline-flex items-center rounded-md border border-border bg-white/5 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"

const HEADERS = ["Date", "Plan", "Amount", "Transaction ID", "Status"] as const

/** /deshboard/seeker/billing — plan, card on file and invoice history from
 *  GET /api/seeker/billing; the search box filters the invoice table by plan
 *  name or transaction id. */
export default function BillingPage() {
  const [query, setQuery] = useState("")
  const [savedMethod, setSavedMethod] = useState<PaymentMethod | null>(null)
  const [planId] = useDemoStorage("hireloop:seeker-plan", "Pro")
  const [localPayments] = useDemoStorage<BillingInvoice[]>("hireloop:seeker-payments", [])
  const debouncedQuery = useDebouncedValue(query)

  const path = useMemo(() => {
    const params = new URLSearchParams()
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim())
    return `/api/seeker/billing?${params.toString()}`
  }, [debouncedQuery])

  const { data, loading, error, refetch } = useApi<BillingResponse>(path)

  const year = new Date().getFullYear()
  const paymentMethod = savedMethod ?? data?.paymentMethod ?? null
  const tier = planId === "Premium" ? { name: "Premium", price: 39, limit: null } : planId === "Free" ? { name: "Free", price: 0, limit: 3 } : { name: "Pro", price: 19, limit: 30 }
  const history = [...localPayments, ...(data?.history ?? [])].filter(invoice => !query.trim() || `${invoice.plan} ${invoice.transactionId}`.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <>
      <Topbar
        placeholder="Search invoices or plans..."
        value={query}
        onValueChange={setQuery}
        actions={<NotificationActions />}
      />

      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Subscription & Billing"
          description="Manage your professional tier features, recurring payments, and billing history."
        />

        {loading && !data ? (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <RowsSkeleton rows={1} height={300} />
              <RowsSkeleton rows={1} height={300} />
            </div>
            <RowsSkeleton rows={4} height={56} />
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data ? (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Current plan */}
              <Panel className="flex flex-col gap-5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <span className={CHIP_LABEL_CLASS}>Current Plan</span>
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.01em]">
                        {tier.name}
                      </h2>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        {data.plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="whitespace-nowrap">
                      <span className="text-3xl font-semibold tracking-[-0.02em]">
                        ${tier.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tier.limit === 3 ? "/forever" : "/mo"}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Next billing date: {formatDate(data.plan.nextBillingDate)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-black/20 p-3"><div className="flex justify-between text-xs"><span className="text-muted-foreground">Applications used this month</span><span>{data.applicationsUsed} / {tier.limit ?? "Unlimited"}</span></div>{tier.limit ? <div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(100, data.applicationsUsed / tier.limit * 100)}%` }} /></div> : null}</div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {data.plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-zinc-200"
                    >
                      <CheckCircle2Icon
                        className="size-4 shrink-0 text-emerald-400"
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-3 pt-1">
                  <Link href="/pricing" className={PRIMARY_BUTTON_CLASS}>
                    Upgrade Plan
                  </Link>
                  <Link href="/pricing" className={SECONDARY_BUTTON_CLASS}>
                    Manage Plan
                  </Link>
                </div>
              </Panel>

              {/* Payment method */}
              <Panel className="flex flex-col gap-5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold tracking-[-0.01em]">
                    Payment Method
                  </h2>
                  <span className={CHIP_LABEL_CLASS}>Secure by Stripe</span>
                </div>

                {paymentMethod ? (
                  <div className="relative overflow-hidden rounded-2xl bg-[radial-gradient(120%_120%_at_10%_10%,#4c1d95_0%,#7c3aed_40%,#db2777_100%)] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-white/20 blur-2xl"
                    />
                    <div className="relative flex items-start justify-between">
                      <span
                        aria-hidden
                        className="flex h-8 w-11 items-center justify-center rounded-md bg-gradient-to-br from-amber-200 to-amber-500"
                      >
                        <CreditCardIcon className="size-4 text-amber-900/70" />
                      </span>
                      <span className="text-sm font-bold tracking-[0.18em] italic">
                        {paymentMethod.brand}
                      </span>
                    </div>

                    <p className="relative mt-7 font-mono text-lg tracking-[0.22em] tabular-nums">
                      •••• •••• •••• {paymentMethod.last4}
                    </p>

                    <div className="relative mt-5 flex items-end justify-between gap-4 text-[10px] tracking-[0.14em] uppercase">
                      <span>
                        Card Holder
                        <span className="mt-1 block text-xs font-semibold tracking-[0.1em]">
                          {paymentMethod.holder}
                        </span>
                      </span>
                      <span className="text-right">
                        Expires
                        <span className="mt-1 block text-xs font-semibold tracking-[0.1em]">
                          {paymentMethod.expires}
                        </span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    No payment method on file yet.
                  </p>
                )}

                <PaymentMethodForm onSave={setSavedMethod} />
              </Panel>
            </div>

            {/* Invoice history */}
            <section
              aria-label="Billing history"
              className="flex flex-col gap-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-[-0.01em]">
                  Billing History
                </h2>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors outline-none hover:bg-white/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
                >
                  <DownloadIcon className="size-4" />
                  Export PDF
                </button>
              </div>

              <Panel className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        {HEADERS.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-5 py-3.5 font-medium"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((invoice) => (
                        <InvoiceRow key={invoice.id} invoice={invoice} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {history.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No invoices match “{query.trim()}”.
                  </p>
                ) : null}
              </Panel>
            </section>

            {/* Support */}
            <Panel className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.01em]">
                  Need help with your invoice?
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                  Our support team is available 24/7 to help you resolve any
                  payment issues or clarify billing details.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="mailto:support@hireloop.com"
                  className={SECONDARY_BUTTON_CLASS}
                >
                  Contact Support
                </a>
                <Link
                  href="/terms"
                  className="rounded-md text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
                >
                  Read Refund Policy
                </Link>
              </div>
            </Panel>

            <footer className="flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>© {year} HireLoop Inc. All rights reserved.</p>
              <div className="flex gap-5">
                <Link
                  href="/terms"
                  className="transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </div>
            </footer>
          </>
        ) : null}
      </div>
    </>
  )
}

function InvoiceRow({ invoice }: { invoice: BillingInvoice }) {
  return (
    <tr className="border-b border-border/60 transition-colors last:border-0 hover:bg-white/[0.02]">
      <td className="px-5 py-4 whitespace-nowrap text-zinc-200">
        {formatDate(invoice.date)}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-zinc-300">
        {invoice.plan}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-zinc-200 tabular-nums">
        {formatMoney(invoice.amount)}
      </td>
      <td className="px-5 py-4 font-mono text-xs whitespace-nowrap text-muted-foreground">
        {invoice.transactionId}
      </td>
      <td className="px-5 py-4">
        <Badge
          variant="ghost"
          className="bg-emerald-500/15 text-emerald-400 capitalize"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
          {invoice.status}
        </Badge>
      </td>
    </tr>
  )
}
