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

// Mirrors broker defaultPricing × profitRatio (billing.go). Kept in sync by
// hand — if broker pricing changes, this changes too. The broker is still
// authoritative for the quota meter (UsageRecord); this estimate exists so
// users can see which *service* is eating their credits, which UsageRecord
// (single lump-sum row per session) can't show.
const PRICING = {
  inputPer1M: 0.5 * 2, // USD × profitRatio
  outputPer1M: 1.5 * 2,
}

function estimateCredits(tokensIn: number, tokensOut: number): number {
  return (
    (tokensIn / 1_000_000) * PRICING.inputPer1M +
    (tokensOut / 1_000_000) * PRICING.outputPer1M
  )
}

// Human label for the broker `service` tag. Keys match what
// kalit-usage reporters send (see broker/internal/broker/usage_report.go).
const SERVICE_LABELS: Record<string, string> = {
  findasset: "Asset search",
  taskforce: "Project build",
  agent: "Chat agent",
  "broker-flow": "Chat agent",
}

type SessionBucket = {
  sessionId: string
  title: string
  services: Map<string, { tokensIn: number; tokensOut: number; events: number }>
  events: number
  tokensIn: number
  tokensOut: number
  credits: number
  lastActivity: Date
}

function aggregateBySession(events: UsageEvent[]): SessionBucket[] {
  const map = new Map<string, SessionBucket>()
  for (const e of events) {
    const at = new Date(e.receivedAt)
    let cur = map.get(e.sessionId)
    if (!cur) {
      cur = {
        sessionId: e.sessionId,
        title: e.sessionTitle?.trim() || `Session ${e.sessionId.slice(0, 8)}`,
        services: new Map(),
        events: 0,
        tokensIn: 0,
        tokensOut: 0,
        credits: 0,
        lastActivity: at,
      }
      map.set(e.sessionId, cur)
    }
    cur.events += 1
    cur.tokensIn += e.tokensIn
    cur.tokensOut += e.tokensOut
    cur.credits += estimateCredits(e.tokensIn, e.tokensOut)
    if (at > cur.lastActivity) cur.lastActivity = at
    const svcKey = e.service || "unknown"
    const svc = cur.services.get(svcKey) ?? { tokensIn: 0, tokensOut: 0, events: 0 }
    svc.tokensIn += e.tokensIn
    svc.tokensOut += e.tokensOut
    svc.events += 1
    cur.services.set(svcKey, svc)
    if (e.sessionTitle && cur.title.startsWith("Session ")) cur.title = e.sessionTitle.trim()
  }
  return [...map.values()].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
}

type ServiceTotal = { service: string; label: string; credits: number; tokensIn: number; tokensOut: number }

function aggregateByService(events: UsageEvent[]): ServiceTotal[] {
  const map = new Map<string, ServiceTotal>()
  for (const e of events) {
    const key = e.service || "unknown"
    const cur = map.get(key) ?? {
      service: key,
      label: SERVICE_LABELS[key] ?? key,
      credits: 0,
      tokensIn: 0,
      tokensOut: 0,
    }
    cur.credits += estimateCredits(e.tokensIn, e.tokensOut)
    cur.tokensIn += e.tokensIn
    cur.tokensOut += e.tokensOut
    map.set(key, cur)
  }
  return [...map.values()].sort((a, b) => b.credits - a.credits)
}

const fmtNumber = new Intl.NumberFormat("en-US")
const fmtCredits = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 })
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

  const usage = await brokerFetchAs<UsageListResponse>("/api/usage/events?limit=500")
  const events = usage?.events ?? []
  const sessions = aggregateBySession(events)
  const byService = aggregateByService(events)
  const totalEstimatedCredits = byService.reduce((sum, s) => sum + s.credits, 0)

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

      {byService.length > 0 ? (
        <SurfacePanel
          title={t("settingsPages.byService")}
          subtitle={t("settingsPages.byServiceDesc")}
        >
          <div className={s.serviceList}>
            {byService.map((svc) => {
              const pct = totalEstimatedCredits > 0
                ? Math.round((svc.credits / totalEstimatedCredits) * 100)
                : 0
              return (
                <div key={svc.service} className={s.serviceRow}>
                  <div className={s.serviceHead}>
                    <span className={s.serviceLabel}>{svc.label}</span>
                    <span className={s.servicePct}>{pct}%</span>
                  </div>
                  <div className={s.serviceBar}>
                    <div
                      className={s.serviceFill}
                      style={{ "--usage-fill-pct": `${pct}%` } as CSSProperties}
                    />
                  </div>
                  <div className={s.serviceMeta}>
                    <span>~{fmtCredits.format(svc.credits)} {t("settingsPages.creditsShort")}</span>
                    <span>{fmtNumber.format(svc.tokensIn + svc.tokensOut)} tokens</span>
                  </div>
                </div>
              )
            })}
          </div>
          <p className={s.footnote}>{t("settingsPages.creditsEstimateNote")}</p>
        </SurfacePanel>
      ) : null}

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
                    {[...row.services.keys()].map((svc) => (
                      <span key={svc} className={s.service}>{SERVICE_LABELS[svc] ?? svc}</span>
                    ))}
                  </div>
                  <div className={s.eventSubtitle}>
                    {fmtDate.format(row.lastActivity)} · {row.events} event{row.events > 1 ? "s" : ""}
                  </div>
                </div>
                <div className={s.eventMeta}>
                  <span className={s.credits}>~{fmtCredits.format(row.credits)} {t("settingsPages.creditsShort")}</span>
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
