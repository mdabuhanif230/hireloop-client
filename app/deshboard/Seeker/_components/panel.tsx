import { cn } from "cn"

/** The dark panel used across the seeker dashboard: `bg-card`/`border-border`
 *  resolve to the design's #111114 via the `.deshboard-shell` variables in
 *  app/globals.css, so every screen picks them up automatically. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}
