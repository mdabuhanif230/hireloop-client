import type { ReactNode } from "react"

import { AuthShell } from "@/components/auth/auth-shell"

/** Shared split-card chrome for the two auth routes (see AuthShell). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>
}
