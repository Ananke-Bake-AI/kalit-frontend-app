"use client"

import { Icon } from "@/components/icon"
import { resendVerificationEmail } from "@/server/actions/auth"
import { useTranslation } from "@/stores/i18n"
import { useSession } from "next-auth/react"
import type { Session } from "next-auth"
import { useState } from "react"
import { toast } from "sonner"
import s from "./email-banner.module.scss"

interface EmailBannerProps {
  initialSession?: Session | null
}

export const EmailBanner = ({ initialSession = null }: EmailBannerProps) => {
  const { data: session, status } = useSession()
  const [dismissed, setDismissed] = useState(false)
  const [sending, setSending] = useState(false)
  const t = useTranslation()

  const resolved = status === "loading" ? initialSession : session

  if (dismissed) return null
  if (!resolved?.user) return null
  if (resolved.user.emailVerified) return null

  const handleResend = async () => {
    setSending(true)
    const result = await resendVerificationEmail()
    setSending(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(t("auth.verificationSent"))
    }
  }

  return (
    <div className={s.banner}>
      <div className={s.content}>
        <Icon icon="hugeicons:mail-send-02" />
        <span className={s.text}>
          {t("auth.verifyEmail")}
        </span>
        <button className={s.resend} onClick={handleResend} disabled={sending}>
          {sending ? t("auth.sendingEmail") : t("auth.resendEmail")}
        </button>
      </div>
      <button className={s.close} onClick={() => setDismissed(true)} aria-label="Dismiss">
        <Icon icon="hugeicons:cancel-01" />
      </button>
    </div>
  )
}
