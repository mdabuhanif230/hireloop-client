import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, BriefcaseBusiness, UserRound } from "lucide-react"
import type { OverviewResponse, SeekerProfile } from "@/lib/seeker/types"
import { Panel } from "@/app/deshboard/seeker/_components/panel"

const LABELS: Record<string, string> = { applied: "Applied", under_review: "Under Review", shortlisted: "Shortlisted", rejected: "Rejected", offered: "Offered" }

export function ProfileAnalytics({ profile, distribution }: { profile: SeekerProfile | null; distribution: OverviewResponse["statusDistribution"] }) {
  const max = Math.max(1, ...distribution.map(item => item.count))
  const initials = (profile?.name ?? "Seeker").split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()
  return <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)]"><Panel className="flex items-center gap-4 p-5"><span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-violet-500/15 text-lg font-semibold text-violet-200">{profile?.avatarUrl ? <Image src={profile.avatarUrl} alt="" width={56} height={56} unoptimized className="size-full object-cover" /> : initials || <UserRound />}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{profile?.name ?? "Your profile"}</p><p className="truncate text-sm text-muted-foreground">{profile?.email ?? "Complete your profile"}</p><p className="mt-1 truncate text-xs text-white/45">{profile?.headline ?? "Add a professional headline"}</p></div><Link href="/deshboard/seeker/settings" aria-label="Edit profile" className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-white"><ArrowUpRight className="size-4" /></Link></Panel><Panel className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Application Status</h2><p className="mt-1 text-xs text-muted-foreground">Your current application pipeline</p></div><BriefcaseBusiness className="size-4 text-violet-300" /></div><div className="mt-5 grid grid-cols-5 gap-3">{distribution.map(item => <div key={item.status} className="min-w-0"><div className="flex h-16 items-end rounded-md bg-white/[0.03] p-1"><span className="w-full rounded-sm bg-violet-500" style={{ height: `${Math.max(8, item.count / max * 100)}%` }} /></div><p className="mt-2 text-xl font-semibold tabular-nums">{item.count}</p><p className="truncate text-[10px] text-muted-foreground">{LABELS[item.status]}</p></div>)}</div></Panel></section>
}
