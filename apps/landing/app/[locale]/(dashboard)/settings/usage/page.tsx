import { Badge } from "@/components/badge"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { auth } from "@/lib/auth"
import { brokerFetchAs } from "@/lib/broker-server"
import { getRemainingCredits, resolveEntitlements } from "@/lib/entitlements"
import { getServerTranslation, localeHref } from "@/lib/i18n-server"
import { redirect } from "next/navigation"
import type { CSSProperties } from "react"
import { SurfacePanel } from "@/components/surface-panel"
import s from "./usage.module.scss"

type UsageEvent = {
  eventId: string
  sessionId: string
  sessionTitle?: string
  service: string
  model: string
  tokensIn: number
  tokensOut: number
  cacheRead: number
  cacheWrite: number
  originTs: string
  receivedAt: string
}

type UsageListResponse = { events: UsageEvent[] }

type SessionBucket = {
  sessionId: string
  title: string
  services: string[]
  events: number
  tokensIn: number
  tokensOut: number
  lastActivity: Date
}

function aggregateBySession(events: UsageEvent[]): SessionBucket[] {
  const map = new Map<string, SessionBucket>()
  for (const e of events) {
    const at = new Date(e.receivedAt)
    const cur = map.get(e.sessionId)
    if (!cur) {
      map.set(e.sessionId, {
        sessionId: e.sessionId,
        title: e.sessionTitle?.trim() || `Session ${e.sessionId.slice(0, 8)}`,
        services: e.service ? [e.service] : [],
        events: 1,
        tokensIn: e.tokensIn,
        tokensOut: e.tokensOut,
        lastActivity: at,
      })
      continue
    }
    cur.events += 1
    cur.tokensIn += e.tokensIn
    cur.tokensOut += e.tokensOut
    if (at > cur.lastActivity) cur.lastActivity = at
    if (e.service && !cur.services.includes(e.service)) cur.services.push(e.service)
    if (!cur.title.startsWith("Session ") && !e.sessionTitle) continue
    if (e.sessionTitle && cur.title.startsWith("Session ")) cur.title = e.sessionTitle.trim()
  }
  return [...map.values()].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
}

const fmtNumber = new Intl.NumberFormat("en-US")
const fmtDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export default async function UsagePage() {
  const session = await auth()
  if (!session?.user?.orgId) redirect(await localeHref("/login"))
  const { t } = await getServerTranslation()

  const orgId = session.user.orgId
  const entitlements = await resolveEntitlements(orgId)
  const remaining = await getRemainingCredits(orgId)
  const used = entitlements.creditsPerMonth - remaining
  const percentage = entitlements.creditsPerMonth > 0
    ? Math.round((used / entitlements.creditsPerMonth) * 100)
    : 0

  const usage = await brokerFetchAs<UsageListResponse>("/api/usage/events?limit=200")
  const events = usage?.events ?? []
  const sessions = aggregateBySession(events)

  return (
    <>
      <SurfacePanel
        title={t("settingsPages.monthlyPool")}
        subtitle={t("settingsPages.monthlyPoolDesc")}
        headerAside={<Badge>{t("settingsPages.remaining", { count: remaining })}</Badge>}
      >
        <div className={s.meta}>
          <span>{t("settingsPages.creditsUsedMonth", { count: Math.max(used, 0) })}</span>
          <span>{t("settingsPages.creditsTotalAllowance", { count: entitlements.creditsPerMonth })}</span>
        </div>
        <div className={s.bar}>
          <div
            className={s.fill}
            style={
              { "--usage-fill-pct": `${Math.min(percentage, 100)}%` } as CSSProperties
            }
          />
        </div>
      </SurfacePanel>

      <SurfacePanel title={t("settingsPages.recentUsage")} subtitle={t("settingsPages.recentUsageDesc")}>
        {sessions.length === 0 ? (
          <EmptyPlaceholder
            title={t("settingsPages.noUsage")}
            description={t("settingsPages.noUsageDesc")}
          />
        ) : (
          <div className={s.history}>
            {sessions.map((row) => (
              <div key={row.sessionId} className={s.eventRow}>
                <div className={s.eventMain}>
                  <div className={s.eventTitle}>
                    <span>{row.title}</span>
                    {row.services.map((svc) => (
                      <span key={svc} className={s.service}>{svc}</span>
                    ))}
                  </div>
                  <div className={s.eventSubtitle}>
                    {fmtDate.format(row.lastActivity)} · {row.events} event{row.events > 1 ? "s" : ""}
                  </div>
                </div>
                <div className={s.eventMeta}>
                  <span className={s.tokensIn}>{fmtNumber.format(row.tokensIn)} in</span>
                  <span className={s.tokensOut}>{fmtNumber.format(row.tokensOut)} out</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SurfacePanel>
    </>
  )
}
