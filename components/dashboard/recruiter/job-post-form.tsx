"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { ArrowLeft, BriefcaseBusiness } from "lucide-react"
import { postJson } from "@/hooks/use-api"
import { useDemoStorage } from "@/hooks/use-demo-storage"
import type { RegisteredCompany } from "@/lib/companies"
import type { RecruiterJob } from "@/lib/recruiter"

const field = "mt-1.5 h-11 w-full rounded-lg border border-border bg-[#111114] px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#5c53fe]"
const label = "block text-sm font-medium text-foreground"
const PLAN_LIMITS: Record<string, number> = { Free: 3, Growth: 10, Enterprise: 50 }

export function JobPostForm() {
  const router = useRouter()
  const [companies, , companiesReady] = useDemoStorage<RegisteredCompany[]>("hireloop:companies", [])
  const [jobs, setJobs, jobsReady] = useDemoStorage<RecruiterJob[]>("hireloop:recruiter-jobs", [])
  const [plan] = useDemoStorage("hireloop:recruiter-plan", "Free")
  const company = companies.find(item => item.status === "Approved")
  const activeCount = jobs.filter(job => job.status === "Active").length
  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.Free
  const [remote, setRemote] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!company) return
    if (activeCount >= limit) { setError(`Your ${plan} plan allows ${limit} active jobs. Upgrade your plan to post more.`); return }
    const form = new FormData(event.currentTarget)
    const minSalary = Number(form.get("minSalary"))
    const maxSalary = Number(form.get("maxSalary"))
    if (maxSalary < minSalary) { setError("Maximum salary must be greater than minimum salary."); return }
    setSaving(true)
    setError("")
    try {
      const { job: created } = await postJson<{ job: { id: string; postedAt: string; salary: string } }>("/api/jobs", {
        title: form.get("title"), company: company.name, companyLogo: company.logo, website: company.website, size: company.size, industry: company.industry,
        category: form.get("category"), type: form.get("type"), mode: remote ? "Remote" : form.get("mode"), location: remote ? "Remote" : form.get("location"),
        currency: form.get("currency"), minSalary, maxSalary, experience: form.get("experience"), deadline: form.get("deadline"), description: form.get("description"), responsibilities: form.get("responsibilities"), requirements: form.get("requirements"), benefits: form.get("benefits"),
      })
      const item: RecruiterJob = {
        id: created.id, title: String(form.get("title")), category: String(form.get("category")), type: String(form.get("type")), salary: created.salary, currency: String(form.get("currency")),
        location: remote ? "Remote" : String(form.get("location")), mode: remote ? "Remote" : String(form.get("mode")), deadline: String(form.get("deadline")), responsibilities: String(form.get("responsibilities")), requirements: String(form.get("requirements")), benefits: String(form.get("benefits") ?? ""), description: String(form.get("description")), company: company.name, status: "Active", applicants: 0, postedAt: created.postedAt,
      }
      setJobs(current => [item, ...current])
      router.push("/deshboard/recruiter/jobs")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The job could not be published.")
    } finally {
      setSaving(false)
    }
  }

  return <main className="mx-auto w-full max-w-4xl flex-1 p-5 sm:p-8"><Link href="/deshboard/recruiter/jobs" className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white"><ArrowLeft className="size-4" />Back to jobs</Link><div className="mb-6"><p className="text-xs text-muted-foreground">Recruiter / Manage Jobs / New</p><h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold"><BriefcaseBusiness className="size-5 text-violet-400" />Post a new job</h1><p className="mt-1 text-sm text-muted-foreground">Create a listing for {company?.name ?? "your approved company"}.</p></div>
    {!companiesReady || !jobsReady ? <div className="h-48 animate-pulse rounded-xl border border-border bg-card" /> : !company ? <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-6"><h2 className="font-semibold">Company approval required</h2><p className="mt-2 text-sm text-muted-foreground">Register your company and wait for Admin approval before publishing job posts.</p><Link href="/deshboard/recruiter/company" className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">Register company</Link></section> : activeCount >= limit ? <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-6"><h2 className="font-semibold">Active job limit reached</h2><p className="mt-2 text-sm text-muted-foreground">You are using {activeCount} of {limit} active posts on the {plan} plan.</p><Link href="/deshboard/recruiter/billing" className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">Upgrade plan</Link></section> : <form onSubmit={submit} className="space-y-6 rounded-xl border border-border bg-card p-5 sm:p-7"><section><h2 className="mb-4 font-semibold">Job information</h2><div className="grid gap-4 sm:grid-cols-2"><label className={label}>Job title *<input name="title" required className={field} placeholder="Senior Product Designer" /></label><label className={label}>Category<select name="category" className={field}><option value="design">Design</option><option value="engineering">Engineering</option><option value="marketing">Marketing</option><option value="data">Data & Analytics</option><option value="research">Research</option></select></label><label className={label}>Job type<select name="type" className={field}><option>Full-time</option><option>Part-time</option><option>Remote</option><option>Contract</option><option>Internship</option></select></label><label className={label}>Application deadline<input name="deadline" type="date" required min={new Date().toISOString().slice(0, 10)} className={field} /></label><label className={label}>Minimum salary<input name="minSalary" type="number" min="0" required className={field} /></label><label className={label}>Maximum salary<input name="maxSalary" type="number" min="0" required className={field} /></label><label className={label}>Currency<select name="currency" className={field}><option>USD</option><option>BDT</option><option>EUR</option><option>GBP</option></select></label><label className={label}>Experience<input name="experience" placeholder="3+ years" className={field} /></label><label className="flex items-center gap-3 self-end rounded-lg border border-border p-3 text-sm"><input checked={remote} onChange={event => setRemote(event.target.checked)} type="checkbox" />Remote position</label>{!remote ? <><label className={label}>City, Country<input name="location" required className={field} /></label><label className={label}>Work arrangement<select name="mode" className={field}><option>On-site</option><option>Hybrid</option></select></label></> : null}</div><p className="mt-3 text-xs text-muted-foreground">Company: {company.name} · {activeCount}/{limit} active posts used</p></section><section className="space-y-4 border-t border-border pt-5"><h2 className="font-semibold">Job description</h2><label className={label}>Overview *<textarea name="description" required rows={4} className="mt-1.5 w-full rounded-lg border border-border bg-[#111114] px-3 py-3 text-sm outline-none focus:border-[#5c53fe]" /></label><label className={label}>Responsibilities *<textarea name="responsibilities" required rows={5} placeholder="One responsibility per line" className="mt-1.5 w-full rounded-lg border border-border bg-[#111114] px-3 py-3 text-sm outline-none focus:border-[#5c53fe]" /></label><label className={label}>Requirements *<textarea name="requirements" required rows={5} placeholder="One requirement per line" className="mt-1.5 w-full rounded-lg border border-border bg-[#111114] px-3 py-3 text-sm outline-none focus:border-[#5c53fe]" /></label><label className={label}>Benefits (optional)<textarea name="benefits" rows={3} className="mt-1.5 w-full rounded-lg border border-border bg-[#111114] px-3 py-3 text-sm outline-none focus:border-[#5c53fe]" /></label></section>{error ? <p role="alert" className="text-sm text-red-400">{error}</p> : null}<div className="flex justify-end gap-3 border-t border-border pt-5"><Link href="/deshboard/recruiter/jobs" className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground">Cancel</Link><button disabled={saving} className="rounded-lg bg-[#5c53fe] px-5 py-2.5 text-sm font-medium disabled:opacity-50">{saving ? "Publishing…" : "Publish job"}</button></div></form>}</main>
}
