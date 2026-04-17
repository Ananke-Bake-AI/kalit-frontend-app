"use client"

import type { LenisOptions } from "lenis"
import "lenis/dist/lenis.css"
import type { LenisRef, LenisProps as ReactLenisProps } from "lenis/react"
import { ReactLenis } from "lenis/react"
import { useEffect, useRef, useState } from "react"
import { useTempus } from "tempus/react"

interface LenisProps extends Omit<ReactLenisProps, "ref"> {
  root: boolean
  options: LenisOptions
}

export function Lenis({ root, options }: LenisProps) {
  const lenisRef = useRef<LenisRef>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => {
      setIsReducedMotion(mediaQuery.matches)
    }

    handleChange()
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  useTempus((time: number) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time)
    }
  })

  if (isReducedMotion) {
    return null
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root={root}
      options={{
        duration: 0.8,
        lerp: options?.lerp ?? 0.1,
        smoothWheel: true,
        autoRaf: false,
        anchors: true,
        ...options
      }}
    />
  )
}
