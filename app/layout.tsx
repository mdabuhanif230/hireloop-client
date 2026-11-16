import {
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Inter,
  Inter_Tight,
  Manrope,
  Plus_Jakarta_Sans,
  Rethink_Sans,
  Space_Mono,
} from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider/theme-provider"
import { Navbar } from "@/components/navbar/navbar"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Hero + navbar typefaces from the Figma spec (Sign In = Manrope SemiBold,
// Get Started = Instrument Sans Medium, H1 = Manrope Bold, badge = Space Mono).
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-space-mono",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-instrument-sans",
})

// Section typefaces from the Figma spec: Plus Jakarta Sans (stats values,
// pricing titles/prices), Inter Tight (stats labels, chips, feature copy),
// Inter (job-card titles/body), Rethink Sans (CTA headline).
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plus-jakarta-sans",
})

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter-tight",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
})

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-rethink-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        manrope.variable,
        spaceMono.variable,
        instrumentSans.variable,
        plusJakartaSans.variable,
        interTight.variable,
        inter.variable,
        rethinkSans.variable
      )}
    >
      {/* suppressHydrationWarning only applies to this exact element: browser
          extensions (e.g. cz-shortcut-listen) inject attributes into <body>
          before React loads, which would otherwise trigger a hydration error. */}
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
