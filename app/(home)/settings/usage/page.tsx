import { auth } from "@/lib/auth"
import { getRemainingCredits, resolveEntitlements } from "@/lib/entitlements"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import s from "../../app.module.scss"

export default async function UsagePage() {
  const session = await auth()
  if (!session?.user?.orgId) redirect("/login")

  const orgId = session.user.orgId
  const entitlements = await resolveEntitlements(orgId)
  const remaining = await getRemainingCredits(orgId)
  const used = entitlements.creditsPerMonth - remaining
  const percentage = entitlements.creditsPerMonth > 0
    ? Math.round((used / entitlements.creditsPerMonth) * 100)
    : 0

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const recentUsage = await prisma.usageRecord.findMany({
    where: { orgId, createdAt: { gte: startOfMonth } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <>
      <div className={s.panel}>
        <div className={s.panelHeader}>
          <div>
            <h2 className={s.panelTitle}>Monthly credit pool</h2>
            <p className={s.panelSubtitle}>Credits used and remaining this month.</p>
          </div>
          <span className={s.badge}>{remaining} remaining</span>
        </div>

        <div className={s.usageMeta}>
          <span>{Math.max(used, 0)} credits used this month</span>
          <span>{entitlements.creditsPerMonth} credits total allowance</span>
        </div>
        <div className={s.usageBar}>
          <div className={s.fill} style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>

      <div className={s.panel}>
        <div className={s.panelHeader}>
          <div>
            <h2 className={s.panelTitle}>Recent usage</h2>
            <p className={s.panelSubtitle}>Recent activity for this month.</p>
          </div>
        </div>

        {recentUsage.length === 0 ? (
          <div className={s.emptyState}>
            <h3>No usage recorded yet</h3>
            <p>Usage will appear here once this workspace starts running actions.</p>
          </div>
        ) : (
          <div className={s.usageHistory}>
            {recentUsage.map((record) => (
              <div key={record.id} className={s.memberRow}>
                <div className={s.memberInfo}>
                  <div className={s.memberName}>{record.suiteId}</div>
                  <div className={s.memberEmail}>{record.action}</div>
                </div>
                <span className={s.memberRole}>{record.credits} credits</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
