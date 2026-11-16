import type { ReactNode } from "react"

export function AdminHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-1 text-xs text-muted-foreground">Admin Console / {title}</p><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>{action}</div>
}

export function MetricCard({ label, value, change, icon }: { label: string; value: string; change?: string; icon: ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-4"><div className="mb-4 grid size-9 place-items-center rounded-lg bg-white/[0.06] text-white/80">{icon}</div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>{change ? <p className="mt-2 text-xs text-emerald-400">{change}</p> : null}</div>
}

export function TableFrame({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[680px] text-left text-sm">{children}</table></div>
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-white/[0.035] text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">{children}</thead>
}

export function TableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`border-t border-border px-4 py-3.5 ${className}`}>{children}</td>
}

export function StatusPill({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "yellow" | "red" | "blue" | "gray" }) {
  const tones = { green: "bg-emerald-500/10 text-emerald-400", yellow: "bg-amber-500/10 text-amber-400", red: "bg-red-500/10 text-red-400", blue: "bg-blue-500/10 text-blue-400", gray: "bg-white/[0.08] text-white/70" }
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${tones[tone]}`}><span className="size-1.5 rounded-full bg-current" />{children}</span>
}
