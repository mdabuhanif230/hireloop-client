import { cn } from "cn"

/** Page title + supporting copy, with an optional action cluster on the
 *  right (toggles, export buttons) that wraps under the title on mobile. */
export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-6 gap-y-4",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      ) : null}
    </div>
  )
}
