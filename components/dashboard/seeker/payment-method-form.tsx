"use client"

import { useState, type FormEvent } from "react"
import { CreditCard, Plus, X } from "lucide-react"

import type { PaymentMethod } from "@/lib/seeker/types"

const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-[#0c0c0e] px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-500"

export function PaymentMethodForm({ onSave }: { onSave: (method: PaymentMethod) => void }) {
  const [open, setOpen] = useState(false)
  const [number, setNumber] = useState("")
  const [expires, setExpires] = useState("")
  const [holder, setHolder] = useState("")

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const digits = number.replace(/\D/g, "")
    if (digits.length < 12) return
    onSave({ brand: "VISA", last4: digits.slice(-4), holder: holder.trim().toUpperCase(), expires })
    setOpen(false)
    setNumber("")
    setExpires("")
    setHolder("")
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mx-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors outline-none hover:bg-white/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50">
        <Plus className="size-4" /> Add New Payment Method
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="payment-method-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141417] p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between"><div><span className="mb-3 grid size-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300"><CreditCard className="size-5" /></span><h2 id="payment-method-title" className="text-lg font-semibold">Add payment method</h2><p className="mt-1 text-sm text-muted-foreground">Enter your card details to update your billing profile.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-white"><X className="size-4" /></button></div>
            <form onSubmit={submit} className="space-y-4">
              <label className="block text-sm">Card number<input required autoComplete="cc-number" inputMode="numeric" minLength={12} maxLength={23} value={number} onChange={event => setNumber(event.target.value.replace(/[^\d ]/g, ""))} placeholder="1234 1234 1234 1234" className={inputClass} /></label>
              <div className="grid grid-cols-2 gap-3"><label className="block text-sm">Expiry date<input required autoComplete="cc-exp" pattern="(0[1-9]|1[0-2])/[0-9]{2}" value={expires} onChange={event => setExpires(event.target.value.replace(/[^\d/]/g, "").slice(0, 5))} placeholder="MM/YY" className={inputClass} /></label><label className="block text-sm">Security code<input required autoComplete="cc-csc" inputMode="numeric" minLength={3} maxLength={4} placeholder="CVC" className={inputClass} /></label></div>
              <label className="block text-sm">Name on card<input required autoComplete="cc-name" value={holder} onChange={event => setHolder(event.target.value)} placeholder="Full name" className={inputClass} /></label>
              <p className="text-xs text-muted-foreground">Demo UI: card details stay in this form and only the last four digits are shown after saving.</p>
              <div className="flex justify-end gap-2 border-t border-white/10 pt-4"><button type="button" onClick={() => setOpen(false)} className="h-9 rounded-lg border border-white/10 px-4 text-sm text-muted-foreground hover:bg-white/5">Cancel</button><button type="submit" className="h-9 rounded-lg bg-white px-4 text-sm font-medium text-black hover:bg-white/90">Save card</button></div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  )
}
