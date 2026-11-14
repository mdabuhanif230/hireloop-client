"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { MailIcon, UserIcon } from "lucide-react"

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

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  terms?: string
}

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"] as const

const strengthColors = ["#ff5c7a", "#ff5c7a", "#ffb020", "#9d97ff", "#4ade80"]

/** 0–4: length first, then character variety — deliberately simple so the
 *  meter never disagrees with better-auth's own 8-character minimum. */
function passwordStrength(value: string) {
  if (!value) return 0

  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1
  return score
}

function PasswordStrength({ value }: { value: string }) {
  const score = passwordStrength(value)
  if (!value) return null

  const color = strengthColors[score]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((segment) => (
          <span
            key={segment}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                segment < score ? color : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
      <span
        className="font-space-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300"
        style={{ color }}
      >
        {score === 0 ? "8+ characters" : strengthLabels[score]}
      </span>
    </div>
  )
}

export function SignUpForm() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const { data: session, isPending: sessionPending } = authClient.useSession()

  // Already signed in (here, or by the submit below) — bounce off the form.
  React.useEffect(() => {
    if (sessionPending || !session) return
    router.replace("/")
  }, [sessionPending, session, router])

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => {
      if (!current[field]) return current
      return { ...current, [field]: undefined }
    })
  }

  async function signUpWithGoogle() {
    setFormError(null)
    setPending(true)
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })
    setPending(false)
    if (error) {
      setFormError(error.message ?? "Google sign-up failed. Please try again.")
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const nextErrors: FieldErrors = {}

    if (!trimmedName) {
      nextErrors.name = "Enter your full name."
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Your name is a little short."
    }
    if (!trimmedEmail) {
      nextErrors.email = "Enter your email address."
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "That doesn't look like a valid email."
    }
    if (!password) {
      nextErrors.password = "Choose a password."
    } else if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters."
    }
    if (!acceptedTerms) {
      nextErrors.terms = "Please accept the terms to continue."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    const { error } = await authClient.signUp.email({
      name: trimmedName,
      email: trimmedEmail,
      password,
    })
    setPending(false)

    if (error) {
      setFormError(
        error.message ?? "We couldn't create your account. Try again."
      )
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="font-space-mono text-[12px] tracking-[0.18em] text-[#9d97ff] uppercase">
          Get started
        </span>

        <div className="flex flex-col gap-2">
          <h1 className="font-manrope text-[30px] leading-[1.2] font-bold tracking-[-0.02em] text-white sm:text-[34px]">
            Create your account
          </h1>
          <p className="font-manrope text-[15px] leading-[1.6] text-white/55">
            Already part of the loop?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#9d97ff] underline-offset-4 transition-colors hover:underline"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <GoogleSignInButton onClick={signUpWithGoogle} disabled={pending} />
        <AuthDivider>or sign up with email</AuthDivider>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <AuthError message={formError} />

        <div className="flex flex-col gap-4">
          <TextField
            id="sign-up-name"
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            icon={<UserIcon aria-hidden="true" className="size-4" />}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              clearError("name")
            }}
            error={errors.name}
          />

          <TextField
            id="sign-up-email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            icon={<MailIcon aria-hidden="true" className="size-4" />}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              clearError("email")
            }}
            error={errors.email}
          />

          <div className="flex flex-col gap-3">
            <PasswordField
              id="sign-up-password"
              label="Password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearError("password")
              }}
              error={errors.password}
            />
            <PasswordStrength value={password} />
          </div>
        </div>

        <CheckboxField
          id="sign-up-terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => {
            setAcceptedTerms(checked)
            if (checked) clearError("terms")
          }}
          error={errors.terms}
        >
          I agree to HireLoop&apos;s Terms of Service and Privacy Policy
        </CheckboxField>

        <AuthSubmitButton pending={pending}>Create account</AuthSubmitButton>
      </form>
    </div>
  )
}
