"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import {
  BadgeDollarSign,
  Bookmark,
  BriefcaseBusiness,
  Building,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authClient, useSession } from "@/lib/auth-client"
import { DEFAULT_ROLE, isRole, type Role } from "@/lib/roles"
import { cn } from "cn"

const subscribeToMount = () => () => {}
const getClientMountSnapshot = () => true
const getServerMountSnapshot = () => false

type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    {
      id: "seeker-overview",
      name: "Dashboard",
      url: "/deshboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: "seeker-jobs",
      name: "Jobs",
      url: "/jobs",
      icon: Search,
    },
    {
      id: "seeker-saved-jobs",
      name: "Saved Jobs",
      url: "/deshboard/seeker/saved",
      icon: Bookmark,
    },
    {
      id: "seeker-applications",
      name: "Applications",
      url: "/deshboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "seeker-billing",
      name: "Billing",
      url: "/deshboard/seeker/billing",
      icon: CreditCard,
    },
    {
      id: "seeker-settings",
      name: "Settings",
      url: "/deshboard/seeker/settings",
      icon: Settings,
    },
  ],
  recruiter: [
    {
      id: "recruiter-overview",
      name: "Overview",
      url: "/deshboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "recruiter-company",
      name: "My Company",
      url: "/deshboard/recruiter/company",
      icon: Building2,
    },
    {
      id: "recruiter-jobs",
      name: "Manage Jobs",
      url: "/deshboard/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      id: "recruiter-post-job",
      name: "Post a Job",
      url: "/deshboard/recruiter/jobs/new",
      icon: Plus,
    },
    {
      id: "recruiter-billing",
      name: "Subscription & Billing",
      url: "/deshboard/recruiter/billing",
      icon: CreditCard,
    },
    {
      id: "recruiter-settings",
      name: "Settings",
      url: "/deshboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/deshboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Manage Users",
      url: "/deshboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-companies",
      name: "Manage Companies",
      url: "/deshboard/admin/companies",
      icon: Building,
    },
    {
      id: "admin-jobs",
      name: "Manage Jobs",
      url: "/deshboard/admin/jobs",
      icon: BriefcaseBusiness,
    },
    {
      id: "admin-payments",
      name: "Payments & Subscriptions",
      url: "/deshboard/admin/payments",
      icon: BadgeDollarSign,
    },
    {
      id: "admin-settings",
      name: "Settings",
      url: "/deshboard/admin/settings",
      icon: Settings,
    },
  ],
}

/** The white call-to-action pinned above Logout — "Post Resume" on the
 *  designs. Each role gets the screen that button should land on. */
const primaryActionByRole: Record<Role, { label: string; url: string }> = {
  seeker: { label: "Post Resume", url: "/deshboard/seeker/settings" },
  recruiter: { label: "Post a Job", url: "/deshboard/recruiter/jobs/new" },
  admin: { label: "Manage Users", url: "/deshboard/admin/users" },
}

const ROLE_LABEL: Record<Role, string> = {
  seeker: "Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

/** Exact match, except the role's root which also owns its child routes
 *  (/deshboard/seeker must stay lit on /deshboard/seeker/saved). */
function isCurrent(pathname: string, url: string) {
  if (pathname === url) return true
  if (
    url.endsWith("/seeker") ||
    url.endsWith("/recruiter") ||
    url.endsWith("/admin")
  ) {
    return false
  }
  return pathname.startsWith(`${url}/`)
}

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = React.useState(false)

  // The workspace URL names its role (/deshboard/admin/... → admin), so each
  // dashboard shows ITS OWN sidebar even before a session resolves — signed
  // out, /deshboard/admin and /deshboard/recruiter used to both fall back to
  // the seeker list. URLs without a role segment (/deshboard root, unknown
  // paths) fall back to the signed-in role, then lib/roles.ts' DEFAULT_ROLE.
  const urlRole = pathname.split("/")[2]
  const sessionRole = session?.user?.role
  const role = isRole(urlRole)
    ? urlRole
    : isRole(sessionRole)
      ? sessionRole
      : DEFAULT_ROLE
  const hasMounted = React.useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot
  )

  // Auth state may differ between the server render and the browser's first
  // render. Keep user-specific sidebar content stable until hydration ends.
  const identity = hasMounted
    ? session?.user?.name || session?.user?.email || ""
    : ""
  const displayName =
    identity || (hasMounted ? `${ROLE_LABEL[role]} Portal` : "HireLoop")
  const avatarUrl = hasMounted ? session?.user?.image || null : null
  const initials =
    displayName
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "HL"

  async function onSignOut() {
    setSigningOut(true)
    try {
      await authClient.signOut()
    } finally {
      setSigningOut(false)
      router.push("/")
      router.refresh()
    }
  }

  const primaryAction = primaryActionByRole[role]
  const menuItems = menuItemsByRole[role]

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="gap-3 px-3 pt-4 pb-1">
        <Link
          href="/"
          aria-label="HireLoop home"
          className="w-fit rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
        >
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={154}
            height={44}
            className="h-7 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] px-3 py-2.5">
          <Avatar className="size-[38px] ring-1 ring-white/10">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-[#26262b] text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Professional Tier
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent aria-busy={isPending}>
        <SidebarGroup>
          <SidebarMenu>
            {hasMounted && !isPending
              ? menuItems.map((item) => {
                  const active = isCurrent(pathname, item.url)

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={active}
                        className={cn(
                          "h-10 rounded-lg px-3",
                          active && "shadow-[inset_3px_0_0_0_#5c53fe]"
                        )}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              : null}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-border px-3 py-4">
        <Link
          href={primaryAction.url}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-black transition-colors outline-none hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
        >
          {primaryAction.label}
        </Link>

        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
          className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors outline-none hover:bg-white/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <LogOut className="size-4" />
          {signingOut ? "Signing out…" : "Logout"}
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
