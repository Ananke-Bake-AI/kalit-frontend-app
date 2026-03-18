"use client"

import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { useEffect, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollTriggerConfig() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.clearScrollMemory("manual")
  }, [])

  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => ScrollTrigger.refresh(), [lenis])

  // Refresh ScrollTrigger on route changes so animations re-trigger
  useEffect(() => {
    // Kill all existing ScrollTriggers and let components re-create them
    ScrollTrigger.getAll().forEach((st) => st.kill())
    ScrollTrigger.refresh()
  }, [pathname])

  return null
}
