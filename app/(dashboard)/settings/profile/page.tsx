import info from "@/components/settings-info-rows/settings-info-rows.module.scss"
import { Avatar } from "@/components/avatar"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ChangePasswordForm, DeleteAccountForm, EditNameForm } from "./forms"
import s from "./profile.module.scss"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) redirect("/login")

  const signInMethod = user.hashedPassword ? "Email and password" : "OAuth via Google or GitHub"

  return (
    <>
      <div className={s.card}>
        <div className={s.header}>
          <Avatar className={s.avatar} name={user.name || user.email} />
          <div>
            <div className={s.name}>{user.name || "Unnamed user"}</div>
            <div className={s.email}>{user.email}</div>
          </div>
        </div>

        <div className={info.row}>
          <label>Email</label>
          <span>
            {user.email}
            {user.emailVerified ? " ✓" : ""}
          </span>
        </div>
        <div className={info.row}>
          <label>Sign-in method</label>
          <span>{signInMethod}</span>
        </div>
        <div className={info.row}>
          <label>Primary suite</label>
          <span>
            {user.defaultSuite
              ? user.defaultSuite.charAt(0).toUpperCase() + user.defaultSuite.slice(1)
              : "Not selected"}
          </span>
        </div>
        <div className={info.row}>
          <label>Member since</label>
          <span>
            {user.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </span>
        </div>
      </div>

      <EditNameForm currentName={user.name || ""} />

      {user.hashedPassword && <ChangePasswordForm />}

      <DeleteAccountForm />
    </>
  )
}
