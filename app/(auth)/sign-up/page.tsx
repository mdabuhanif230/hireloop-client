import type { Metadata } from "next"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create Account — HireLoop",
  description:
    "Create a HireLoop account to track applications, save jobs, and get matched to new roles.",
}

export default function SignUpPage() {
  return <SignUpForm />
}
