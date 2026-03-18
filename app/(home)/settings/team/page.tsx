import { auth } from "@/lib/auth"
import { resolveEntitlements } from "@/lib/entitlements"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import s from "../../app.module.scss"

function formatSeats(limit: number) {
  if (limit === -1) return "Unlimited seats"
  return `${limit} seat${limit === 1 ? "" : "s"}`
}

export default async function TeamPage() {
  const session = await auth()
  if (!session?.user?.orgId) redirect("/login")

  const [members, entitlements] = await Promise.all([
    prisma.membership.findMany({
      where: { orgId: session.user.orgId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    resolveEntitlements(session.user.orgId),
  ])

  const seatsLabel = formatSeats(entitlements.maxMembers)

  return (
    <>
      <div className={s.panel}>
        <div className={s.panelHeader}>
          <div>
            <h2 className={s.panelTitle}>Members</h2>
            <p className={s.panelSubtitle}>Members in this workspace and current seat usage.</p>
          </div>
          <span className={s.badge}>{members.length} / {seatsLabel}</span>
        </div>

        {members.length === 0 ? (
          <div className={s.emptyState}>
            <h3>No team members yet</h3>
            <p>Add collaborators when you want to work together in this workspace.</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className={s.memberRow}>
              <div className={s.memberInfo}>
                <div className={s.memberName}>{member.user.name || member.user.email}</div>
                <div className={s.memberEmail}>{member.user.email}</div>
              </div>
              <span className={s.memberRole}>{member.role}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}
