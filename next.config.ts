import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // The hero's Figma line-art layer is exported as an SVG in /public.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
