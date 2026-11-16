import Image from "next/image"
import Link from "next/link"

/**
 * Closing CTA — Figma "Group 2" (12022:10785, 1440×964, page y 4502).
 *
 * Layer order inside the group (bottom → top):
 *   1. The page-level violet radial (Figma "Gradient" 12022:10749) — an
 *      ellipse 1498×1037 at page (−29, 4503). Its gradient transform puts the
 *      radial centre at the ellipse's top-centre (page x 720) with a
 *      640×443px radius, stops #5c53fe a1 → a0.6@29% → a0.5@52% → a0@100%,
 *      clipped to the ellipse shape. It is z-below the footer, but the ellipse
 *      only reaches y 4946 with visible alpha, well above the footer (5081).
 *   2. "BG Grid" at 50% opacity — cta-bg.png (1440×964) is that group already
 *      rendered *with* its 50% opacity and transparency baked in (its bottom
 *      pixels are A=128 black = Rectangle 2's black gradient × group 0.5), so
 *      it is composited at full opacity. It also spills over the footer band
 *      (the group paints above the footer in Figma), veiling it exactly like
 *      the design.
 *   3. Content frame (792×308 at y153): Rethink Sans headline with a hard
 *      break, Manrope sub at 70% white, two buttons.
 */
export function Cta() {
  return (
    <section className="relative z-10 lg:mt-[18px]">
      <div className="relative mx-auto w-full max-w-[1440px] lg:h-[964px]">
        {/* Violet radial — Figma gradient ellipse (centred on the section,
            1498px wide → left edge −29px at 1440). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-px left-1/2 hidden h-[1037px] w-[1498px] -translate-x-1/2 lg:block"
          style={{
            clipPath: "ellipse(50% 50% at 50% 50%)",
            background:
              "radial-gradient(640px 443px at 50% 0%, rgba(92,83,254,1) 0%, rgba(92,83,254,0.6) 29%, rgba(92,83,254,0.5) 52%, rgba(92,83,254,0) 100%)",
          }}
        />

        {/* BG Grid render (opacity already baked into the PNG). */}
        <Image
          src="/images/cta-bg.png"
          alt=""
          width={1440}
          height={964}
          priority={false}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* Content — 792px wide, centred, starting 153px down. */}
        <div className="relative mx-auto flex w-full max-w-[792px] flex-col items-center px-4 pt-24 pb-24 text-center lg:pt-[153px] lg:pb-0">
          <h2 className="font-rethink-sans text-[36px] leading-[1.2] font-medium tracking-[-1.5px] text-white sm:text-[48px] lg:text-[64px]">
            Your next role is
            <br />
            already looking for you
          </h2>

          <p className="mt-4 font-manrope text-[16px] leading-[1.6] text-white/70 sm:text-[18px] lg:text-[20px]">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>

          <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/sign-up"
              className="flex h-[58px] w-full items-center justify-center rounded-[12px] border border-[#090a15]/10 bg-white px-6 font-manrope text-[16px] leading-[1.45] font-semibold text-[#0b0b14] transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none sm:w-[234px] lg:text-[18px]"
            >
              Create a free account
            </Link>
            <Link
              href="#pricing"
              className="flex h-[58px] w-full items-center justify-center rounded-[12px] border border-[#d7d7d7]/30 bg-[#0e0b16] px-6 font-manrope text-[16px] leading-[1.45] font-medium text-white transition-colors hover:bg-[#17141f] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none sm:w-[150px] lg:text-[18px]"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
