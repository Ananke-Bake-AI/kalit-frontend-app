"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

function scrollToHash() {
  const id = window.location.hash.slice(1)
  if (!id) return

  let attempts = 0
  const tryScroll = () => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    attempts += 1
    if (attempts < 12) {
      window.setTimeout(tryScroll, 80)
    }
  }

  window.setTimeout(tryScroll, 0)
}

export function HashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    scrollToHash()
  }, [pathname])

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHash)
    window.addEventListener("kalit:hash-scroll", scrollToHash)

    return () => {
      window.removeEventListener("hashchange", scrollToHash)
      window.removeEventListener("kalit:hash-scroll", scrollToHash)
    }
  }, [])

  return null
}
