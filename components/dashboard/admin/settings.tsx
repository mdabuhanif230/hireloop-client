"use client"

import { useState } from "react"
import { AdminHeading } from "@/components/dashboard/admin/admin-ui"
import { useDemoStorage } from "@/hooks/use-demo-storage"

export function AdminSettings() {
  const [savedProfile, setSavedProfile] = useDemoStorage("hireloop:admin-profile", { name: "Alex Rivera", email: "admin@hireloop.demo", avatar: "" })
  const [profile, setProfile] = useState(savedProfile)
  const [saved, setSaved] = useState(false)
  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="Admin Settings" description="Manage your administrator profile and account preferences." /><section className="max-w-2xl rounded-xl border border-border bg-card p-6"><h2 className="font-semibold">Profile information</h2><div className="mt-5 grid gap-4"><label className="text-sm">Full name<input value={profile.name} onChange={event => setProfile(current => ({ ...current, name: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-black/20 px-3" /></label><label className="text-sm">Email<input type="email" value={profile.email} onChange={event => setProfile(current => ({ ...current, email: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-black/20 px-3" /></label><label className="text-sm">Avatar URL<input value={profile.avatar} onChange={event => setProfile(current => ({ ...current, avatar: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-black/20 px-3" /></label><button onClick={() => { setSavedProfile(profile); setSaved(true) }} className="justify-self-start rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">Save profile</button>{saved ? <p className="text-xs text-emerald-300">Profile saved in this browser.</p> : null}</div><div className="mt-6 border-t border-border pt-5"><h2 className="font-semibold">Password</h2><p className="mt-1 text-sm text-muted-foreground">Use your account password reset flow to change your password.</p><button onClick={() => setSaved(true)} className="mt-3 rounded-lg border border-border px-4 py-2 text-sm">Send password reset link</button></div></section></main>
}
