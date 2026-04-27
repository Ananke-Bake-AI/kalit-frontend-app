"use client"

import { useEffect, useRef, useState } from "react"
import s from "./session-usage-badge.module.scss"

type UsageEvent = {
  eventId: string
  tokensIn: number
  tokensOut: number
  receivedAt: string
}

const fmt = new Intl.NumberFormat("en-US")
// Compact form for the topbar pill on phone widths: 1,239,548 → 1.2M.
// Uses Intl's "compact" notation so locale-appropriate suffixes are used
// (en: K/M/B, fr: k/M/Md). Without this the pill content grew past the
// pill boundary on long sessions and overlapped the model selector.
const fmtCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const POLL_MS = 3000

export function SessionUsageBadge({ sessionId }: { sessionId: string | null }) {
  const [tokensIn, setTokensIn] = useState(0)
  const [tokensOut, setTokensOut] = useState(0)
  const [flash, setFlash] = useState(false)
  const seenIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    seenIds.current = new Set()
    setTokensIn(0)
    setTokensOut(0)
    if (!sessionId) return
    let cancelled = false

    const tick = async () => {
      try {
        const res = await fetch(`/api/usage/session?sessionId=${encodeURIComponent(sessionId)}&limit=200`, { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { events: UsageEvent[] }
        if (cancelled) return
        let addedIn = 0
        let addedOut = 0
        let fresh = false
        for (const e of data.events) {
          if (seenIds.current.has(e.eventId)) continue
          seenIds.current.add(e.eventId)
          addedIn += e.tokensIn
          addedOut += e.tokensOut
          fresh = true
        }
        if (fresh) {
          setTokensIn((v) => v + addedIn)
          setTokensOut((v) => v + addedOut)
          setFlash(true)
          setTimeout(() => !cancelled && setFlash(false), 900)
        }
      } catch {}
    }

    tick()
    const id = setInterval(tick, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [sessionId])

  if (!sessionId) return null
  const total = tokensIn + tokensOut

  // Render full numbers in the title (hover) so the user can still see
  // exact counts; the visible pill uses compact notation to fit the
  // topbar width-budget on phone and avoid overlapping siblings.
  const titleText = `Tokens consumed this session — in: ${fmt.format(tokensIn)} | out: ${fmt.format(tokensOut)} (broker usage events)`

  return (
    <div className={s.badge} data-flash={flash ? "1" : undefined} title={titleText}>
      <span className={s.dot} />
      <span className={s.value}>
        <span className={s.tokensIn}>{fmtCompact.format(tokensIn)}</span>
        <span className={s.sep}>/</span>
        <span className={s.tokensOut}>{fmtCompact.format(tokensOut)}</span>
      </span>
      <span className={s.label}>tok{total === 1 ? "" : "s"}</span>
    </div>
  )
}
