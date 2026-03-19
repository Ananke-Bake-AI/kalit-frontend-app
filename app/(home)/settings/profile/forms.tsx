"use client"

import { Button } from "@/components/button"
import { updateProfile, deleteAccount } from "@/server/actions/profile"
import { changePassword } from "@/server/actions/password"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import s from "../../app.module.scss"

export function EditNameForm({ currentName }: { currentName: string }) {
  const router = useRouter()
  const [name, setName] = useState(currentName)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name === currentName) return

    setLoading(true)
    const result = await updateProfile({ name })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Name updated")
    router.refresh()
  }

  return (
    <div className={s.panel}>
      <div className={s.panelHeader}>
        <div>
          <h2 className={s.panelTitle}>Display name</h2>
          <p className={s.panelSubtitle}>This is how your name appears across Kalit.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            minLength={2}
            style={{
              width: "100%",
              height: "3rem",
              padding: "0 1rem",
              borderRadius: "0.75rem",
              border: "1px solid oklch(0 0 0 / 0.09)",
              background: "oklch(1 0 0 / 0.7)",
              color: "var(--text)",
              fontSize: "0.94rem",
              outline: "none",
            }}
          />
        </div>
        <Button type="submit" variant="secondary" disabled={loading || name === currentName}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  )
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setLoading(true)
    const result = await changePassword(currentPassword, newPassword)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Password updated")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className={s.panel}>
      <div className={s.panelHeader}>
        <div>
          <h2 className={s.panelTitle}>Change password</h2>
          <p className={s.panelSubtitle}>Update the password you use to sign in.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          required
          style={{
            height: "3rem",
            padding: "0 1rem",
            borderRadius: "0.75rem",
            border: "1px solid oklch(0 0 0 / 0.09)",
            background: "oklch(1 0 0 / 0.7)",
            color: "var(--text)",
            fontSize: "0.94rem",
            outline: "none",
          }}
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (min. 8 characters)"
          required
          minLength={8}
          style={{
            height: "3rem",
            padding: "0 1rem",
            borderRadius: "0.75rem",
            border: "1px solid oklch(0 0 0 / 0.09)",
            background: "oklch(1 0 0 / 0.7)",
            color: "var(--text)",
            fontSize: "0.94rem",
            outline: "none",
          }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
          minLength={8}
          style={{
            height: "3rem",
            padding: "0 1rem",
            borderRadius: "0.75rem",
            border: "1px solid oklch(0 0 0 / 0.09)",
            background: "oklch(1 0 0 / 0.7)",
            color: "var(--text)",
            fontSize: "0.94rem",
            outline: "none",
          }}
        />
        <div>
          <Button type="submit" variant="secondary" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export function DeleteAccountForm() {
  const [confirmText, setConfirmText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== "delete my account") return

    setLoading(true)
    const result = await deleteAccount()
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className={s.panel} style={{ borderColor: "oklch(0.65 0.22 25 / 0.3)" }}>
      <div className={s.panelHeader}>
        <div>
          <h2 className={s.panelTitle} style={{ color: "oklch(0.65 0.22 25)" }}>Delete account</h2>
          <p className={s.panelSubtitle}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Type <strong>delete my account</strong> to confirm.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="delete my account"
          style={{
            height: "3rem",
            padding: "0 1rem",
            borderRadius: "0.75rem",
            border: "1px solid oklch(0.65 0.22 25 / 0.3)",
            background: "oklch(1 0 0 / 0.7)",
            color: "var(--text)",
            fontSize: "0.94rem",
            outline: "none",
          }}
        />
        <div>
          <button
            onClick={handleDelete}
            disabled={confirmText !== "delete my account" || loading}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius-rounded)",
              border: "none",
              background: confirmText === "delete my account" ? "oklch(0.65 0.22 25)" : "oklch(0 0 0 / 0.1)",
              color: confirmText === "delete my account" ? "white" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: confirmText === "delete my account" ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Deleting..." : "Permanently delete account"}
          </button>
        </div>
      </div>
    </div>
  )
}
