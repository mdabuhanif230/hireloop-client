import { Hero } from "@/components/hero"
import { StatsSection } from "@/components/stats-section"

export default function Page() {
  // #010103 is the fill of Figma's "Homepage" frame — the page base every
  // hero backdrop layer is composited against. overflow-hidden clips the globe
  // layer's bottom at the page edge (it intentionally runs past the stats
  // band's own box).
  return (
    <div className="relative overflow-hidden bg-[#010103] text-white">
      <Hero />
      <StatsSection />
    </div>
  )
}
