import type { Metadata } from "next"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
  description:
    "Sign in to HireLoop to manage your saved jobs, applications, and matches.",
}

export default function SignInPage() {
  return <SignInForm />
}
