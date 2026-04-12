"use client"

import { useCallback } from "react"
import { useStudioStore } from "@/stores/studio"
import { useI18n } from "@/stores/i18n"
import { brokerFetch } from "@/lib/broker-direct"
import { Icon } from "@/components/icon"
import clsx from "clsx"
import s from "./session-sidebar.module.scss"

interface SessionSidebarProps {
  onSessionSelect: (id: string) => void
}

const PROGRESS_MODE_KEY = "kalit_studio_progress_mode"

export function SessionSidebar({ onSessionSelect }: SessionSidebarProps) {
  const { t } = useI18n()
  const {
    sessions,
    activeSessionId,
    deleteConfirm,
    setDeleteConfirm,
    removeSession,
    setActiveSessionId,
    setMessages,
    quota,
    progressMode,
    setProgressMode,
  } = useStudioStore()

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await brokerFetch(`/api/broker/sessions/${id}`, { method: "DELETE" })
      if (res.ok) {
        removeSession(id)
        if (activeSessionId === id) {
          setActiveSessionId(null)
          setMessages([])
        }
      }
    } catch {
      // silent
    }
    setDeleteConfirm(null)
  }, [activeSessionId, removeSession, setActiveSessionId, setMessages, setDeleteConfirm])

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id)
    onSessionSelect(id)
    // Close sidebar on mobile
    if (window.innerWidth < 900) {
      useStudioStore.getState().setSidebarOpen(false)
    }
  }, [setActiveSessionId, onSessionSelect])

  const handleToggleProgressMode = useCallback(() => {
    const next = progressMode === "expert" ? "default" : "expert"
    setProgressMode(next)
    try {
      window.localStorage.setItem(PROGRESS_MODE_KEY, next)
    } catch {
      // silent
    }
    if (activeSessionId) {
      brokerFetch(`/api/broker/sessions/${activeSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressMode: next }),
      }).catch(() => {
        // silent
      })
    }
  }, [progressMode, setProgressMode, activeSessionId])

  return (
    <div className={s.container}>
      {/* Session list */}
      <div className={s.list}>
        {sessions.length === 0 && (
          <p className={s.empty}>{t("studio.noConversations")}</p>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={clsx(s.session, activeSessionId === session.id && s.sessionActive)}
          >
            {deleteConfirm === session.id ? (
              <div className={s.confirmRow}>
                <span className={s.confirmText}>{t("studio.deleteConfirm")}</span>
                <button className={s.confirmYes} onClick={() => handleDelete(session.id)}>
                  {t("studio.yes")}
                </button>
                <button className={s.confirmNo} onClick={() => setDeleteConfirm(null)}>
                  {t("studio.no")}
                </button>
              </div>
            ) : (
              <button
                className={s.sessionBtn}
                onClick={() => handleSelectSession(session.id)}
              >
                <span className={s.sessionTitle}>
                  {session.title || t("studio.newConversation")}
                </span>
                {session.isProcessing && (
                  <span className={s.processingDot} />
                )}
              </button>
            )}
            {deleteConfirm !== session.id && (
              <button
                className={s.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteConfirm(session.id)
                }}
                title={t("studio.delete")}
              >
                <Icon icon="hugeicons:delete-02" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer: mode toggle + quota */}
      <div className={s.footer}>
        <button
          type="button"
          className={s.modeToggle}
          onClick={handleToggleProgressMode}
          title={progressMode === "expert" ? t("studio.expertModeDesc") : t("studio.simpleModeDesc")}
        >
          <span className={clsx(s.switch, progressMode === "expert" && s.switchActive)}>
            <span className={clsx(s.switchThumb, progressMode === "expert" && s.switchThumbActive)} />
          </span>
          <span className={s.modeLabels}>
            <span className={s.modeName}>
              {progressMode === "expert" ? t("studio.expertMode") : t("studio.simpleMode")}
            </span>
            <span className={s.modeDesc}>
              {progressMode === "expert" ? t("studio.expertModeDesc") : t("studio.simpleModeDesc")}
            </span>
          </span>
        </button>

        {quota && (
          <>
            <div className={s.quotaBar}>
              <div
                className={s.quotaFill}
                style={{ width: `${Math.min(quota.percentage, 100)}%` }}
              />
            </div>
            <span className={s.quotaText}>
              {quota.remainingCredits} / {quota.creditsPerMonth} {t("studio.credits")}
            </span>
            <span className={s.quotaPlan}>{quota.plan}</span>
          </>
        )}
      </div>
    </div>
  )
}
