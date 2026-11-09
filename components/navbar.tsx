"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { MenuIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
] as const

/** Buttons — Manrope SemiBold (Sign In) / Instrument Sans Medium (Get Started), 18px, radius 12. */
const signInClassName =
  "h-[54px] rounded-[12px] bg-transparent px-6 font-manrope text-[18px] font-semibold leading-[1.45] text-[#5c53fe] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] [text-shadow:0_2px_4px_rgba(0,0,0,0.03)] hover:bg-white/5 hover:text-[#5c53fe] focus-visible:ring-[#5c53fe]/40"

const getStartedClassName =
  "h-[54px] rounded-[12px] bg-[#5c53fe] px-6 font-instrument-sans text-[18px] font-medium leading-[1.45] text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] [text-shadow:0_2px_4px_rgba(0,0,0,0.03)] hover:bg-[#6a61ff] hover:text-white focus-visible:ring-[#6a61ff]/50"

function isCurrentPage(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  pathname,
  href,
  label,
  className,
}: {
  pathname: string
  href: string
  label: string
  className?: string
}) {
  const active = isCurrentPage(pathname, href)

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(className, active && "font-bold")}
    >
      {label}
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <header className="mt-6 px-4 sm:px-6 xl:px-[60px]">
      <div className="mx-auto flex h-[74px] w-full max-w-[1320px] items-center justify-between gap-4 rounded-[16px] bg-[#222222] px-6">
        <Link
          href="/"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
          aria-label="HireLoop home"
        >
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={154}
            height={44}
            loading="eager"
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        {/* Desktop — Figma "nav-bar" frame: bg #222, radius 16, padding 32/8,
            Frame-3 gap 24, links gap 40, 24px divider. Tightens below xl. */}
        <nav
          aria-label="Main"
          className="hidden h-full items-center gap-6 rounded-[16px] bg-[#222222] px-6 py-2 lg:flex xl:px-8"
        >
          <ul className="flex items-center gap-5 xl:gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  pathname={pathname}
                  href={link.href}
                  label={link.label}
                  className="text-base leading-[1.8] font-normal tracking-[-0.2px] whitespace-nowrap text-white transition-colors hover:text-white/70"
                />
              </li>
            ))}
          </ul>

          <span
            aria-hidden="true"
            className="h-6 w-px shrink-0 bg-[#a8a8a8]/40"
          />

          <div className="flex shrink-0 items-center gap-4">
            <Button variant="default" className={signInClassName}>
              Sign In
            </Button>
            <Button variant="default" className={getStartedClassName}>
              Get Started
            </Button>
          </div>
        </nav>

        {/* Mobile — Sheet menu styled after the Figma "HL/Menu" symbol */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="flex size-11 shrink-0 items-center justify-center rounded-[12px] text-white transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 lg:hidden"
          >
            <MenuIcon className="size-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            showCloseButton={false}
            className="gap-0 rounded-l-[12px] border-l-0 bg-[#1e1e21] p-1.5 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          >
            <SheetHeader className="flex-row items-center justify-between gap-2 p-2.5">
              <SheetTitle className="text-base font-semibold text-white">
                Menu
              </SheetTitle>
              <SheetClose
                aria-label="Close navigation menu"
                className="flex size-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
              >
                <XIcon className="size-4" />
              </SheetClose>
            </SheetHeader>

            <SheetDescription className="sr-only">
              HireLoop navigation links
            </SheetDescription>

            <nav aria-label="Mobile" className="flex flex-col gap-0.5 px-0.5">
              {navLinks.map((link) => {
                const active = isCurrentPage(pathname, link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex h-9 items-center rounded-md px-2.5 text-sm transition-colors",
                      active
                        ? "bg-white/10 font-medium text-white"
                        : "font-normal text-white/80 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-1 flex flex-col gap-2 border-t border-white/10 p-2.5 pt-3">
              <Button
                variant="default"
                className={cn(signInClassName, "h-11 w-full")}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                className={cn(getStartedClassName, "h-11 w-full")}
              >
                Get Started
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
