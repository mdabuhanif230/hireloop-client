"use client"

import Image from "next/image"
import * as React from "react"

import {
  CheckIcon,
  CircleAlertIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Field chrome shared by both auth forms: the hero search bar's inset dark
 * fill, a violet caret, and a violet focus ring. `aria-invalid:` styles are
 * driven by the input's own attribute so error borders never need a class
 * passed in from the form.
 */
const inputClassName =
  "h-[52px] w-full rounded-[12px] border border-white/10 bg-[#101012] px-4 font-satoshi text-[15px] leading-[1.7] text-white caret-[#5c53fe] shadow-[inset_0_2px_8px_rgba(0,0,0,0.45)] outline-none transition-colors placeholder:text-white/35 hover:border-white/20 focus-visible:border-[#5c53fe]/70 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/25 aria-invalid:border-[#ff5c7a]/70 aria-invalid:focus-visible:border-[#ff5c7a]/70 aria-invalid:focus-visible:ring-[#ff5c7a]/25"

const labelClassName =
  "font-manrope text-[14px] leading-[1.4] font-semibold text-white/80"

const errorClassName = "font-manrope text-[13px] leading-[1.4] text-[#ff9db1]"

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className={errorClassName}>
      {message}
    </p>
  )
}

type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  id: string
  label: string
  /** Leading glyph inside the field, e.g. a mail or lock icon. */
  icon?: React.ReactNode
  error?: string
}

export function TextField({
  id,
  label,
  icon,
  error,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <div className="relative">
        {icon ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40"
          >
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClassName, icon && "pl-11", className)}
          {...inputProps}
        />
      </div>

      {error ? <FieldError id={`${id}-error`} message={error} /> : null}
    </div>
  )
}

type PasswordFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  id: string
  label: string
  error?: string
}

/** Text field with a show/hide toggle — the reveal button sits inside the
 *  field's right padding so it never shifts the input's layout. */
export function PasswordField({
  id,
  label,
  error,
  className,
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40"
        >
          <LockIcon className="size-4" />
        </span>

        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClassName, "pr-12 pl-11", className)}
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-[10px] text-white/45 transition-colors hover:text-white focus-visible:ring-3 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"
        >
          {visible ? (
            <EyeOffIcon aria-hidden="true" className="size-4" />
          ) : (
            <EyeIcon aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>

      {error ? <FieldError id={`${id}-error`} message={error} /> : null}
    </div>
  )
}

/** Native checkbox kept in the DOM (sr-only) for a11y, with a custom box that
 *  is painted by the component so it tracks the controlled `checked` value. */
export function CheckboxField({
  id,
  checked,
  onCheckedChange,
  children,
  error,
  className,
}: {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children: React.ReactNode
  error?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="group flex cursor-pointer items-start gap-3 font-manrope text-[14px] leading-[1.5] text-white/65 transition-colors hover:text-white/90"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
        />

        <span
          aria-hidden="true"
          className={cn(
            "mt-px grid size-[18px] shrink-0 place-items-center rounded-[6px] border transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-[#5c53fe]/45 peer-focus-visible:outline-none",
            checked
              ? "border-[#5c53fe] bg-[#5c53fe]"
              : "border-white/25 bg-[#101012] group-hover:border-white/50"
          )}
        >
          <CheckIcon
            className={cn(
              "size-3 text-white transition-opacity",
              checked ? "opacity-100" : "opacity-0"
            )}
          />
        </span>

        <span>{children}</span>
      </label>

      {error ? <FieldError id={`${id}-error`} message={error} /> : null}
    </div>
  )
}

export function GoogleSignInButton({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[12px] border border-white/12 bg-white/[0.04] font-manrope text-[15px] font-semibold text-white shadow-[inset_0_2px_8px_rgba(255,255,255,0.04)] transition-colors hover:border-white/25 hover:bg-white/[0.08] focus-visible:ring-3 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Image
        src="/logos/google.png"
        alt=""
        aria-hidden="true"
        width={18}
        height={18}
        className="size-[18px]"
      />
      Continue with Google
    </button>
  )
}

/** Space Mono caps label between the OAuth button and the email form. */
export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-white/10" />
      <span className="font-space-mono text-[11px] tracking-[0.16em] text-white/40 uppercase">
        {children}
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <p
      role="alert"
      className="flex items-start gap-2.5 rounded-[12px] border border-[#ff5c7a]/35 bg-[#ff5c7a]/10 px-3.5 py-3 font-manrope text-[14px] leading-[1.5] text-[#ffb9c7]"
    >
      <CircleAlertIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  )
}

/** Submit button wearing the navbar's violet fill + inset highlight. */
export function AuthSubmitButton({
  pending,
  children,
}: {
  pending: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[12px] bg-[#5c53fe] font-instrument-sans text-[16px] font-medium text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#6a61ff] focus-visible:ring-3 focus-visible:ring-[#6a61ff]/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <LoaderCircleIcon aria-hidden="true" className="size-4 animate-spin" />
      ) : null}
      {pending ? "Working…" : children}
    </button>
  )
}
