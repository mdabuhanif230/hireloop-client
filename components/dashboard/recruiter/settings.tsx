"use client"

import Link from "next/link"
import { useState } from "react"
import { AdminHeading } from "@/components/dashboard/admin/admin-ui"
import { useDemoStorage } from "@/hooks/use-demo-storage"

export function RecruiterSettings() {
  const [profile, setProfile] = useDemoStorage("hireloop:recruiter-profile", { name: "Alex Sterling", email: "alex@hireloop.demo", avatar: "" })
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)
  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="Recruiter Settings" description="Update your personal account information and linked company." /><section className="max-w-2xl rounded-xl border border-border bg-card p-6"><h2 className="font-semibold">Personal information</h2><div className="mt-5 grid gap-4"><label className="text-sm">Full name<input value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-black/20 px-3" /></label><label className="text-sm">Email<input type="email" value={draft.email} onChange={event => setDraft(current => ({ ...current, email: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-black/20 px-3" /></label><label className="text-sm">Avatar URL<input value={draft.avatar} onChange={event => setDraft(current => ({ ...current, avatar: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-black/20 px-3" /></label><button onClick={() => { setProfile(draft); setSaved(true) }} className="justify-self-start rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">Save changes</button>{saved ? <p className="text-xs text-emerald-300">Settings saved in this browser.</p> : null}</div><div className="mt-7 border-t border-border pt-5"><h2 className="font-semibold">Linked company</h2><p className="mt-1 text-sm text-muted-foreground">Update your company profile or check its approval status.</p><Link href="/deshboard/recruiter/company" className="mt-3 inline-block text-sm text-violet-300">Manage company →</Link></div></section></main>
}
