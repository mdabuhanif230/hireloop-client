"use client"

import type { LucideIcon } from "lucide-react"
import { AlertTriangleIcon, InboxIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "cn"

import { Panel } from "./panel"

/** Loading + error + empty states shared by the seeker screens, so a failed
 *  or empty request looks deliberate instead of collapsing the layout. */

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-[116px] rounded-2xl bg-white/5" />
      ))}
    </div>
  )
}

export function RowsSkeleton({
  rows = 5,
  height = 76,
  className,
}: {
  rows?: number
  height?: number
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          style={{ height }}
          className="w-full rounded-2xl bg-white/5"
        />
      ))}
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <Panel
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      <AlertTriangleIcon className="size-6 text-amber-400" aria-hidden />
      <p className="text-sm text-muted-foreground">
        {message || "Something went wrong while loading this section."}
      </p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Panel>
  )
}

export function EmptyState({
  title,
  description,
  icon: Icon = InboxIcon,
  children,
  className,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Panel
      className={cn(
        "flex flex-col items-center gap-2 px-6 py-14 text-center",
        className
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-white/5">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <p className="mt-2 text-sm font-medium">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </Panel>
  )
}
