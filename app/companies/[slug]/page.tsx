"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ArrowLeft, BriefcaseBusiness, Building2, MapPin, Users } from "lucide-react"
import { COMPANIES, type Company, type RegisteredCompany } from "@/lib/companies"
import { useDemoStorage } from "@/hooks/use-demo-storage"

export default function CompanyProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const [registered, , ready] = useDemoStorage<RegisteredCompany[]>("hireloop:companies", [])
  const company: Company | undefined = COMPANIES.find(item => item.slug === slug) ?? registered.find(item => item.slug === slug && item.status === "Approved")
  return <main className="mx-auto min-h-svh w-full max-w-[1000px] px-4 py-10 text-white sm:px-6"><Link href="/companies" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"><ArrowLeft className="size-4" />All companies</Link>{!company ? <section className="mt-8 rounded-2xl border border-white/10 bg-[#121216] p-8 text-center"><h1 className="text-2xl font-semibold">{ready ? "Company not found" : "Loading company..."}</h1><p className="mt-2 text-sm text-white/55">This company may not be approved for public listing yet.</p></section> : <><section className="mt-6 rounded-2xl border border-white/10 bg-[#121216] p-6 sm:p-9"><div className="flex flex-wrap items-start gap-5"><span className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-white/5 text-violet-300">{company.logo ? <Image src={company.logo} alt="" width={64} height={64} unoptimized className="size-full object-cover" /> : <Building2 className="size-8" />}</span><div className="flex-1"><p className="text-sm text-violet-300">{company.industry}</p><h1 className="mt-1 text-3xl font-semibold">{company.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{company.description}</p></div><a href={company.website} target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5">Visit website</a></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><Info icon={<MapPin />} label="Location" value={company.location} /><Info icon={<Users />} label="Company size" value={company.size} /><Info icon={<BriefcaseBusiness />} label="Open jobs" value={String(company.openJobs)} /></div></section><section className="mt-8"><h2 className="text-xl font-semibold">Open opportunities</h2><p className="mt-2 text-sm text-white/50">Browse current roles and apply directly on HireLoop.</p><Link href={`/jobs?q=${encodeURIComponent(company.name)}`} className="mt-4 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black">View {company.openJobs} open jobs</Link></section></>}</main>
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><span className="text-violet-300">{icon}</span><p className="mt-3 text-xs text-white/45">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div> }
