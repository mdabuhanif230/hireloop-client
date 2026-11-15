"use client"

import {
  BadgeDollarSign,
  Bookmark,
  BriefcaseBusiness,
  Building,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import type { Role } from "@/lib/roles"
import { useSyncExternalStore } from "react"

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
      name: "Overview",
      url: "/deshboard/Seeker",
      icon: LayoutDashboard,
    },
    {
      id: "seeker-jobs",
      name: "Browse Jobs",
      url: "/deshboard/Seeker/jobs",
      icon: Search,
    },
    {
      id: "seeker-saved-jobs",
      name: "Saved Jobs",
      url: "/deshboard/Seeker/saved",
      icon: Bookmark,
    },
    {
      id: "seeker-applications",
      name: "My Applications",
      url: "/deshboard/Seeker/applications",
      icon: FileText,
    },
    {
      id: "seeker-billing",
      name: "Subscription & Billing",
      url: "/deshboard/Seeker/billing",
      icon: CreditCard,
    },
    {
      id: "seeker-settings",
      name: "Settings",
      url: "/deshboard/Seeker/settings",
      icon: Settings,
    },
  ],
  recruiter: [
    {
      id: "recruiter-overview",
      name: "Overview",
      url: "/deshboard/Recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "recruiter-company",
      name: "My Company",
      url: "/deshboard/Recruiter/company",
      icon: Building2,
    },
    {
      id: "recruiter-jobs",
      name: "Manage Jobs",
      url: "/deshboard/Recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      id: "recruiter-post-job",
      name: "Post a Job",
      url: "/deshboard/Recruiter/jobs/new",
      icon: Plus,
    },
    {
      id: "recruiter-billing",
      name: "Subscription & Billing",
      url: "/deshboard/Recruiter/billing",
      icon: CreditCard,
    },
    {
      id: "recruiter-settings",
      name: "Settings",
      url: "/deshboard/Recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/deshboard/Admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Manage Users",
      url: "/deshboard/Admin/users",
      icon: Users,
    },
    {
      id: "admin-companies",
      name: "Manage Companies",
      url: "/deshboard/Admin/companies",
      icon: Building,
    },
    {
      id: "admin-jobs",
      name: "Manage Jobs",
      url: "/deshboard/Admin/jobs",
      icon: BriefcaseBusiness,
    },
    {
      id: "admin-payments",
      name: "Payments & Subscriptions",
      url: "/deshboard/Admin/payments",
      icon: BadgeDollarSign,
    },
    {
      id: "admin-settings",
      name: "Settings",
      url: "/deshboard/Admin/settings",
      icon: Settings,
    },
  ],
}

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const role = session?.user?.role || "seeker"
  const hasMounted = useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot
  )

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent aria-busy={isPending}>
        <SidebarGroup>
          <SidebarMenu>
            {hasMounted && !isPending
              ? menuItemsByRole[role].map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton render={<a href={item.url} />}>
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              : null}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
