import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { DashboardSidebar } from "@/components/dashboard-sidebar/dashboard-sidebar"

/** Full-bleed app shell for every /deshboard/* route: fixed sidebar on the
 *  left, the route's own topbar + content on the right.
 *
 *  `.deshboard-shell` pins the palette (app/globals.css) and `dark` makes the
 *  `dark:` variants resolve inside the shell even for visitors whose theme is
 *  light — the designs are dark-only. The marketing <Navbar> skips these
 *  routes (see components/navbar.tsx). */
const DeshboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark deshboard-shell min-h-svh bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <div className="flex min-h-svh w-full min-w-0 flex-1 flex-col">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default DeshboardLayout
