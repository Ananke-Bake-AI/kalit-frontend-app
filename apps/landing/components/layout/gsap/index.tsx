"use client"

import gsap from "gsap"
import { useLayoutEffect } from "react"
import Tempus from "tempus"
import { easings } from "./easings"
import { ScrollTriggerConfig } from "./scroll-trigger"

export function GSAP({ scrollTrigger = false }) {
  useLayoutEffect(() => {
    gsap.defaults({ ease: easings.smoothOut })
    gsap.ticker.lagSmoothing(0)
    gsap.ticker.remove(gsap.updateRoot)
    Tempus?.add((time: number) => {
      gsap.updateRoot(time / 1000)
    })
  }, [])

  return scrollTrigger && <ScrollTriggerConfig />
}
