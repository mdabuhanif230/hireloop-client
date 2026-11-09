import {
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Manrope,
  Space_Mono,
} from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Hero + navbar typefaces from the Figma spec (Sign In = Manrope SemiBold,
// Get Started = Instrument Sans Medium, H1 = Manrope Bold, badge = Space Mono).
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
