"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { Building2, CheckCircle2, Clock3, Upload } from "lucide-react"
import { useDemoStorage } from "@/hooks/use-demo-storage"
import type { RegisteredCompany } from "@/lib/companies"

const empty: RegisteredCompany[] = []
const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-border bg-[#101012] px-3 text-sm text-white outline-none focus:border-violet-500"

export function CompanyManagement() {
  const [companies, setCompanies, ready] = useDemoStorage("hireloop:companies", empty)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("Technology")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")
  const [size, setSize] = useState("1–10 employees")
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState("")
  const current = companies[0]

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    const company: RegisteredCompany = { slug, name, industry, website, location, size, description, logo, openJobs: 0, recruiterEmail: "recruiter@hireloop.demo", status: "Pending", submittedAt: new Date().toISOString() }
    setCompanies(currentCompanies => [company, ...currentCompanies.filter(item => item.slug !== slug)])
    setEditing(false)
  }

  return <main className="flex-1 p-5 sm:p-8"><div className="mb-6"><p className="text-xs text-muted-foreground">Recruiter / My Company</p><h1 className="mt-1 text-2xl font-semibold">Company profile</h1><p className="mt-1 text-sm text-muted-foreground">Register your organization to publish jobs and meet candidates.</p></div>
    {!ready ? <div className="h-52 animate-pulse rounded-xl border border-border bg-card" /> : current && !editing ? <section className="max-w-3xl rounded-2xl border border-border bg-card p-6"><div className="flex items-start gap-4"><span className="grid size-14 place-items-center rounded-xl bg-white/5 text-violet-300"><Building2 /></span><div className="flex-1"><h2 className="text-xl font-semibold">{current.name}</h2><p className="mt-1 text-sm text-muted-foreground">{current.industry} · {current.location}</p></div><Status status={current.status} /></div><p className="mt-5 text-sm leading-6 text-white/65">{current.description}</p><dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Website</dt><dd className="mt-1">{current.website || "—"}</dd></div><div><dt className="text-xs text-muted-foreground">Team size</dt><dd className="mt-1">{current.size}</dd></div><div><dt className="text-xs text-muted-foreground">Submitted</dt><dd className="mt-1">{new Date(current.submittedAt).toLocaleDateString()}</dd></div></dl><button onClick={() => { setName(current.name); setIndustry(current.industry); setWebsite(current.website); setLocation(current.location); setSize(current.size); setDescription(current.description); setLogo(current.logo ?? ""); setEditing(true) }} className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">Edit company</button></section> : <section className="max-w-3xl rounded-2xl border border-border bg-card p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet-500/15 text-violet-300"><Building2 /></span><div><h2 className="font-semibold">Register your company</h2><p className="text-sm text-muted-foreground">An admin will review the details before your company is listed publicly.</p></div></div><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Company name *<input required value={name} onChange={event => setName(event.target.value)} className={inputClass} /></label><label className="text-sm">Industry / category<select value={industry} onChange={event => setIndustry(event.target.value)} className={inputClass}><option>Technology</option><option>Fintech</option><option>Artificial Intelligence</option><option>Developer Tools</option><option>E-Commerce</option><option>Healthcare</option><option>Design</option></select></label><label className="text-sm">Website URL<input type="url" value={website} onChange={event => setWebsite(event.target.value)} placeholder="https://company.com" className={inputClass} /></label><label className="text-sm">Location<input required value={location} onChange={event => setLocation(event.target.value)} placeholder="City, Country" className={inputClass} /></label><label className="text-sm">Employee count<select value={size} onChange={event => setSize(event.target.value)} className={inputClass}><option>1–10 employees</option><option>11–50 employees</option><option>51–200 employees</option><option>201–500 employees</option><option>501–1,000 employees</option><option>1,000+ employees</option></select></label><label className="text-sm">Company logo<input type="file" accept="image/*" onChange={event => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setLogo(String(reader.result)); reader.readAsDataURL(file) }} className="mt-1.5 block w-full rounded-lg border border-border bg-[#101012] p-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white" /><span className="mt-1 block text-xs text-muted-foreground"><Upload className="mr-1 inline size-3" />PNG, JPG, SVG</span></label><label className="text-sm sm:col-span-2">Short description *<textarea required rows={4} value={description} onChange={event => setDescription(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-[#101012] px-3 py-2 text-sm outline-none focus:border-violet-500" /></label><div className="flex justify-end gap-2 border-t border-border pt-4 sm:col-span-2">{editing ? <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm">Cancel</button> : null}<button type="submit" className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium">{editing ? "Save changes" : "Submit for review"}</button></div></form></section>}
    <Link href="/companies" className="mt-6 inline-block text-sm text-violet-300 hover:underline">Browse public companies</Link>
  </main>
}

function Status({ status }: { status: RegisteredCompany["status"] }) { const Icon = status === "Approved" ? CheckCircle2 : Clock3; return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${status === "Approved" ? "bg-emerald-500/10 text-emerald-300" : status === "Rejected" ? "bg-red-500/10 text-red-300" : "bg-amber-500/10 text-amber-300"}`}><Icon className="size-3.5" />{status}</span> }
