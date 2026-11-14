"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { MailIcon } from "lucide-react"

import {
  AuthDivider,
  AuthError,
  AuthSubmitButton,
  CheckboxField,
  GoogleSignInButton,
  PasswordField,
  TextField,
} from "@/components/auth/form-fields"
import { authClient } from "@/lib/auth-client"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = { email?: string; password?: string }

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const { data: session, isPending: sessionPending } = authClient.useSession()

  // Already signed in (here, or by the submit below) — bounce off the form.
  React.useEffect(() => {
    if (sessionPending || !session) return
    router.replace("/")
  }, [sessionPending, session, router])

  async function signInWithGoogle() {
    setFormError(null)
    setPending(true)
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })
    setPending(false)
    if (error) {
      setFormError(error.message ?? "Google sign-in failed. Please try again.")
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const trimmedEmail = email.trim()
    const nextErrors: FieldErrors = {}
    if (!trimmedEmail) {
      nextErrors.email = "Enter your email address."
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "That doesn't look like a valid email."
    }
    if (!password) {
      nextErrors.password = "Enter your password."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    const { error } = await authClient.signIn.email({
      email: trimmedEmail,
      password,
      rememberMe: remember,
    })
    setPending(false)

    if (error) {
      setFormError(error.message ?? "We couldn't sign you in. Try again.")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="font-space-mono text-[12px] tracking-[0.18em] text-[#9d97ff] uppercase">
          Welcome back
        </span>

        <div className="flex flex-col gap-2">
          <h1 className="font-manrope text-[30px] leading-[1.2] font-bold tracking-[-0.02em] text-white sm:text-[34px]">
            Sign in to HireLoop
          </h1>
          <p className="font-manrope text-[15px] leading-[1.6] text-white/55">
            No account yet?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#9d97ff] underline-offset-4 transition-colors hover:underline"
            >
              Create one in seconds
            </Link>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <GoogleSignInButton onClick={signInWithGoogle} disabled={pending} />
        <AuthDivider>or continue with email</AuthDivider>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <AuthError message={formError} />

        <div className="flex flex-col gap-4">
          <TextField
            id="sign-in-email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            icon={<MailIcon aria-hidden="true" className="size-4" />}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (errors.email)
                setErrors((current) => ({ ...current, email: undefined }))
            }}
            error={errors.email}
          />

          <PasswordField
            id="sign-in-password"
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (errors.password) {
                setErrors((current) => ({ ...current, password: undefined }))
              }
            }}
            error={errors.password}
          />
        </div>

        <CheckboxField
          id="sign-in-remember"
          checked={remember}
          onCheckedChange={setRemember}
        >
          Keep me signed in on this device
        </CheckboxField>

        <AuthSubmitButton pending={pending}>Sign in</AuthSubmitButton>
      </form>
    </div>
  )
}
