"use client"

import * as React from "react"
import Link from "next/link"
import { BellIcon, MailIcon, SearchIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { cn } from "cn"

const subscribeToMount = () => () => {}
const getClientMountSnapshot = () => true
const getServerMountSnapshot = () => false

/** Sticky app bar above every seeker screen: sidebar toggle, page search and
 *  whatever actions the screen needs on the right. Search is optional — pass
 *  `value`/`onValueChange` to make it drive a query, otherwise it's local. */
export function Topbar({
  placeholder,
  value,
  onValueChange,
  actions,
  className,
}: {
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:gap-3 sm:px-6",
        className
      )}
    >
      <SidebarTrigger className="shrink-0 text-muted-foreground hover:text-foreground" />

      {placeholder ? (
        <label className="relative flex min-w-0 flex-1 items-center sm:max-w-sm">
          <span className="sr-only">{placeholder}</span>
          <SearchIcon
            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={value}
            onChange={(event) => onValueChange?.(event.target.value)}
            placeholder={placeholder}
            className="h-10 w-full rounded-xl border-border bg-white/[0.03] pr-3 pl-9 focus-visible:border-[#5c53fe]/50 focus-visible:ring-[#5c53fe]/40"
          />
        </label>
      ) : null}

      {actions ? (
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

/** Icon button in the app bar. `dot` renders the unread marker from the
 *  designs (messages = red, notifications = green). */
export function TopbarIconButton({
  label,
  dot,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  label: string
  dot?: "red" | "green"
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className={cn(
        "relative size-9 text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {dot ? (
        <span
          aria-hidden
          className={cn(
            "absolute top-1.5 right-1.5 size-2 rounded-full ring-2 ring-background",
            dot === "red" ? "bg-red-500" : "bg-emerald-500"
          )}
        />
      ) : null}
    </Button>
  )
}

/** Messages + notifications + the signed-in avatar, in the order the designs
 *  use. The avatar links to Settings, where the picture is managed. */
export function NotificationActions() {
  return (
    <>
      <TopbarIconButton label="Messages" dot="red">
        <MailIcon />
      </TopbarIconButton>
      <TopbarIconButton label="Notifications" dot="green">
        <BellIcon />
      </TopbarIconButton>
      <TopbarAvatar />
    </>
  )
}

export function TopbarAvatar() {
  const { data: session } = useSession()
  const hasMounted = React.useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot
  )

  const identity = hasMounted
    ? session?.user?.name || session?.user?.email || ""
    : ""
  const initials =
    identity
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "HL"

  return (
    <Link
      href="/deshboard/seeker/settings"
      aria-label="Open settings"
      className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
    >
      <Avatar className="ring-1 ring-white/15">
        <AvatarFallback className="bg-[#26262b] text-xs font-medium text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  )
}
