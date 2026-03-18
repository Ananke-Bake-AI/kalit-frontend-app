import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import s from "../../app.module.scss"

export default async function WorkspacePage() {
  const session = await auth()
  if (!session?.user?.orgId) redirect("/login")

  const org = await prisma.organization.findUnique({ where: { id: session.user.orgId } })

  if (!org) redirect("/dashboard")

  return (
    <>
      <div className={s.panel}>
        <div className={s.panelHeader}>
          <div>
            <h2 className={s.panelTitle}>Workspace identity</h2>
            <p className={s.panelSubtitle}>The organization record that powers billing, access, and data ownership across the Kalit suite.</p>
          </div>
          <span className={s.badge}>{org.slug}</span>
        </div>

        <div className={s.infoRow}>
          <label>Name</label>
          <span>{org.name}</span>
        </div>
        <div className={s.infoRow}>
          <label>Slug</label>
          <span>{org.slug}</span>
        </div>
        <div className={s.infoRow}>
          <label>Website</label>
          <span>{org.websiteUrl || "No website added yet"}</span>
        </div>
        <div className={s.infoRow}>
          <label>Created</label>
          <span>{org.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>
    </>
  )
}
