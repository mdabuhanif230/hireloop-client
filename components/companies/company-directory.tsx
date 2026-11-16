"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Building2, MapPin, Users } from "lucide-react"
import { COMPANIES } from "@/lib/companies"
import { useDemoStorage } from "@/hooks/use-demo-storage"
import type { RegisteredCompany } from "@/lib/companies"

export function CompanyDirectory() {
  const [registered] = useDemoStorage<RegisteredCompany[]>("hireloop:companies", [])
  const [industry, setIndustry] = useState("All")
  const [query, setQuery] = useState("")
  const publicCompanies = useMemo(() => [...COMPANIES, ...registered.filter(company => company.status === "Approved")], [registered])
  const allIndustries = useMemo(() => ["All", ...new Set(publicCompanies.map(company => company.industry))], [publicCompanies])
  const companies = useMemo(() => publicCompanies.filter(company => (industry === "All" || company.industry === industry) && `${company.name} ${company.industry} ${company.location}`.toLowerCase().includes(query.toLowerCase())), [industry, query, publicCompanies])
  return <main className="mx-auto min-h-svh w-full max-w-[1200px] px-4 py-12 text-white sm:px-6"><p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">Explore employers</p><h1 className="mt-3 text-4xl font-semibold">Companies hiring on HireLoop</h1><p className="mt-3 max-w-2xl text-white/60">Discover teams, learn about their work, and find your next opportunity.</p>
    <div className="mt-8 flex flex-col gap-4"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search companies or locations..." className="h-12 max-w-lg rounded-xl border border-white/10 bg-[#151516] px-4 text-sm outline-none focus:border-violet-500" /><div className="flex flex-wrap gap-2">{allIndustries.map(value => <button key={value} onClick={() => setIndustry(value)} aria-pressed={industry === value} className={`rounded-full border px-4 py-2 text-sm ${industry === value ? "border-violet-400 bg-violet-500/15 text-white" : "border-white/10 text-white/65 hover:bg-white/5"}`}>{value}</button>)}</div></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{companies.map(company => <Link key={company.slug} href={`/companies/${company.slug}`} className="rounded-2xl border border-white/10 bg-[#111114] p-5 transition hover:-translate-y-0.5 hover:border-white/20"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-white/5 text-violet-300"><Building2 /></span><div><h2 className="font-semibold">{company.name}</h2><p className="text-xs text-violet-300">{company.industry}</p></div></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-white/60">{company.description}</p><div className="mt-5 flex flex-wrap gap-4 text-xs text-white/50"><span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{company.location}</span><span className="inline-flex items-center gap-1"><Users className="size-3.5" />{company.size}</span></div><p className="mt-5 text-sm font-medium text-white">{company.openJobs} open roles <span className="text-violet-300">→</span></p></Link>)}</div>
    {companies.length === 0 ? <p className="mt-10 text-center text-sm text-white/50">No companies match those filters.</p> : null}
  </main>
}
