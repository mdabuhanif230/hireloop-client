import { Hero } from "@/components/hero"

export default function Page() {
  // #010103 is the fill of Figma's "Homepage" frame — the page base every
  // hero backdrop layer is composited against.
  return (
    <div className="relative bg-[#010103] text-white">
      <Hero />
    </div>
  )
}
