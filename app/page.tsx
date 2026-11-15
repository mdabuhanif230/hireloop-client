import { Cta } from "@/components/cta"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { JobDiscovery } from "@/components/job-discovery"
import { Pricing } from "@/components/pricing"
import { StatsSection } from "@/components/stats-section"

export default function Page() {
  // #010103 is the fill of Figma's "Homepage" frame — the page base every
  // backdrop layer is composited against. overflow-hidden clips the hero
  // backdrop group and the CTA's violet radial at the page edge (both are
  // wider than the 1440 frame in Figma too).
  return (
    <div className="relative overflow-hidden bg-[#010103] text-white">
      <Hero />
      <StatsSection />
      <JobDiscovery />
      <Features />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  )
}
