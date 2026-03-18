"use client"

import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/all"
import { usePathname } from "next/navigation"

export const useReveal = () => {
  const pathname = usePathname()

  useGSAP(() => {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger instanceof Element && trigger.trigger.matches("[data-reveal]")) {
        trigger.kill()
      }
    })

    const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]")
    if (revealItems.length === 0) {
      return
    }

    gsap.set(revealItems, {
      autoAlpha: 0,
      y: 28
    })

    ScrollTrigger.batch(revealItems, {
      onEnter: (reveal) => {
        gsap.to(reveal, {
          autoAlpha: 1,
          y: 0,
          x: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power2.out"
        })
      },
      start: "top bottom",
      once: true
    })

    ScrollTrigger.refresh()
  }, { dependencies: [pathname] })
}
