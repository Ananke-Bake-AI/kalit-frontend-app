"use client"

import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect } from "react"

export function ScrollTriggerConfig() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.clearScrollMemory("manual")
  }, [])

  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => ScrollTrigger.refresh(), [lenis])

  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}
