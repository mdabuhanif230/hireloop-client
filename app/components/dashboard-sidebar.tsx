"use client"

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
import type { ComponentType } from "react"

type MenuItem = {
  id: string
  name: string
  url: string
  icon: ComponentType<{ className?: string }>
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [],
  recruiter: [],
  admin: [],
}

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const role = session?.user?.role || "seeker"

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent aria-busy={isPending}>
        <SidebarGroup>
          <SidebarMenu>
            {
              menuItemsByRole[role].map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
