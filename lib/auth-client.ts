import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

/**
 * Exactly one client for the whole app. better-auth builds a fresh session
 * atom on every `createAuthClient()` call, so a second instance would never
 * learn about a sign-in performed through this one — `useSession` and the
 * `signIn`/`signUp`/`signOut` actions have to share this instance or the
 * navbar stays stuck on "Sign In" after logging in.
 */
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  // Type-only bridge to lib/auth.ts: teaches `signUp.email` (and the session
  // user) about the extra `role` field. `import type` is erased at build
  // time, so the Mongo client and server config behind it never reach the
  // browser bundle.
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, useSession } = authClient;
