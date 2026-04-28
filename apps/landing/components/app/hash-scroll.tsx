"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

function getScrollOffset() {
  const header = document.querySelector("header")
  const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 0
  return Math.max(96, Math.ceil(headerHeight + 24))
}

function scrollToHash(behavior: ScrollBehavior = "smooth") {
  const id = window.location.hash.slice(1)
  if (!id) return

  let attempts = 0
  const tryScroll = () => {
    const target = document.getElementById(id)
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset()
      window.scrollTo({ top: Math.max(0, top), behavior })
      return
    }
    attempts += 1
    if (attempts < 12) {
      window.setTimeout(tryScroll, 80)
    }
  }

  window.setTimeout(tryScroll, 0)
}

function scheduleHashScroll() {
  window.setTimeout(() => scrollToHash("smooth"), 140)
  window.setTimeout(() => scrollToHash("auto"), 420)
}

export function HashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    scheduleHashScroll()
  }, [pathname])

  useEffect(() => {
    window.addEventListener("hashchange", scheduleHashScroll)
    window.addEventListener("kalit:hash-scroll", scheduleHashScroll)

    return () => {
      window.removeEventListener("hashchange", scheduleHashScroll)
      window.removeEventListener("kalit:hash-scroll", scheduleHashScroll)
    }
  }, [])

  return null
}
