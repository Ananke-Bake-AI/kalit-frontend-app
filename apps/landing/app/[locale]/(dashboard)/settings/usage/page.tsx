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

  const usage = await brokerFetchAs<UsageListResponse>("/api/usage/events?limit=100")
  const events = usage?.events ?? []

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
        {events.length === 0 ? (
          <EmptyPlaceholder
            title={t("settingsPages.noUsage")}
            description={t("settingsPages.noUsageDesc")}
          />
        ) : (
          <div className={s.history}>
            {events.map((e) => (
              <div key={e.eventId} className={s.eventRow}>
                <div className={s.eventMain}>
                  <div className={s.eventTitle}>
                    <span>{e.model || "unknown model"}</span>
                    <span className={s.service}>{e.service}</span>
                  </div>
                  <div className={s.eventSubtitle}>
                    {fmtDate.format(new Date(e.receivedAt))} · session {e.sessionId.slice(0, 8)}
                  </div>
                </div>
                <div className={s.eventMeta}>
                  <span className={s.tokensIn}>{fmtNumber.format(e.tokensIn)} in</span>
                  <span className={s.tokensOut}>{fmtNumber.format(e.tokensOut)} out</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SurfacePanel>
    </>
  )
}
