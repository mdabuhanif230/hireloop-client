import type { ApplicationStatus } from "@/lib/seeker/types"

/** Client-safe formatting helpers — no server imports, safe to use in the
 *  dashboard pages and (where noted) in the route handlers. */

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  offered: "Offered",
}

export const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  applied: "bg-white/10 text-zinc-300",
  under_review: "bg-amber-500/15 text-amber-400",
  shortlisted: "bg-sky-500/15 text-sky-400",
  rejected: "bg-red-500/15 text-red-400",
  offered: "bg-emerald-500/15 text-emerald-400",
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY

/** "2 hours ago" / "yesterday" / "in 3 days" — the wording the designs use.
 *  Future timestamps (application deadlines) read as countdowns. */
export function formatRelativeTime(iso: string, reference = Date.now()) {
  const delta = new Date(iso).getTime() - reference
  const magnitude = Math.abs(delta)
  const future = delta > 0

  if (magnitude < MINUTE) return future ? "in a moment" : "just now"

  const amount = Math.floor(
    magnitude >= MONTH
      ? magnitude / MONTH
      : magnitude >= WEEK
        ? magnitude / WEEK
        : magnitude >= DAY
          ? magnitude / DAY
          : magnitude >= HOUR
            ? magnitude / HOUR
            : magnitude / MINUTE
  )
  const unit =
    magnitude >= MONTH
      ? "month"
      : magnitude >= WEEK
        ? "week"
        : magnitude >= DAY
          ? "day"
          : magnitude >= HOUR
            ? "hour"
            : "minute"
  const plural = amount === 1 ? "" : "s"

  if (!future && magnitude < 2 * DAY && unit === "day") return "yesterday"
  if (unit === "month" && !future) return `${amount} month${plural} ago`

  return future
    ? `in ${amount} ${unit}${plural}`
    : `${amount} ${unit}${plural} ago`
}

/** "Sep 24, 2026" */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso))
}

/** "$29.00" */
export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/** "1.2 MB" */
export function formatMegabytes(sizeMb: number) {
  return `${sizeMb.toFixed(1)} MB`
}

/** Activity messages wrap the highlighted phrase in single quotes
 *  ("…updated to 'Under Review'"). This splits the message so the page can
 *  paint those segments amber instead of styling the whole line. */
export function splitQuoted(message: string) {
  return message
    .split("'")
    .map((text, index) => ({ text, quoted: index % 2 === 1 }))
    .filter((part) => part.text.length > 0)
}
