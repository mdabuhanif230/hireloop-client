import type { LucideIcon } from "lucide-react"

import { cn } from "cn"

import { Panel } from "./panel"

const TONE_CLASS = {
  neutral: "text-muted-foreground",
  amber: "text-amber-400",
  green: "text-emerald-400",
} as const

/** KPI tile from the dashboard/applications rows: label + icon on top,
 *  the number underneath. `value` stays a string so callers can pass "12%". */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  className,
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  tone?: keyof typeof TONE_CLASS
  className?: string
}) {
  return (
    <Panel
      className={cn(
        "flex min-w-0 flex-col justify-between gap-6 px-5 py-5 sm:flex-row sm:items-start",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-6">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-3xl font-semibold tracking-[-0.02em] tabular-nums">
          {value}
        </span>
      </div>
      {Icon ? (
        <Icon className={cn("size-5 shrink-0", TONE_CLASS[tone])} aria-hidden />
      ) : null}
    </Panel>
  )
}

/** Four-up KPI row — keeps the responsive breakpoints in one place. */
export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  )
}

/** Smaller KPI that sits inside a page header (Total Saved / Closing Soon). */
export function MiniStat({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: keyof typeof TONE_CLASS
}) {
  return (
    <Panel className="flex min-w-[148px] items-start justify-between gap-3 px-4 py-4">
      <div className="flex flex-col gap-4">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold tracking-[-0.02em] tabular-nums">
          {value}
        </span>
      </div>
      <Icon className={cn("size-4 shrink-0", TONE_CLASS[tone])} aria-hidden />
    </Panel>
  )
}
