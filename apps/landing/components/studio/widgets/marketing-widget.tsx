"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { brokerFetch } from "@/lib/broker-direct"
import { useI18n } from "@/stores/i18n"
import { Icon } from "@/components/icon"
import s from "./widgets.module.scss"

type MarketingPhase = "planning" | "working" | "testing" | null

interface MarketingStatus {
  workspaceId: string
  name: string
  slug: string
  status: string
  phase: MarketingPhase
  dashboardUrl?: string | null
  autonomyMode?: string | null
  productName?: string | null
  counts?: {
    campaignsByStatus?: Record<string, number>
    tasksByStatus?: Record<string, number>
    activeCampaigns?: number
    inFlightTasks?: number
  } | null
  connectedPlatforms?: string[] | null
  lastActivity?: string | null
  updatedAt?: string | null
}

interface MarketingWidgetProps {
  workspaceId: string
  onCompleted?: () => void
}

const TERMINAL_STATUSES = new Set(["archived", "paused"])
const READY_STATUSES = new Set(["monitoring", "optimizing", "scaling"])

const PHASES: { key: NonNullable<MarketingPhase>; label: string }[] = [
  { key: "planning", label: "Planning" },
  { key: "working", label: "Producing" },
  { key: "testing", label: "Optimizing" },
]

function PhaseIndicator({ phase }: { phase: MarketingPhase }) {
  const activeIdx = phase ? PHASES.findIndex((p) => p.key === phase) : -1
  return (
    <div className={s.phases}>
      {PHASES.map((p, i) => {
        const isActive = i === activeIdx
        const isDone = i < activeIdx
        return (
          <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span className={isActive ? s.phaseActive : isDone ? s.phaseDone : s.phase}>
              {isActive && <span className={s.dotPulse} style={{ background: "var(--color-5)" }} />}
              {isDone && <Icon icon="hugeicons:tick-02" />}
              {p.label}
            </span>
            {i < PHASES.length - 1 && <span className={s.phaseSep} />}
          </div>
        )
      })}
    </div>
  )
}

export function MarketingWidget({ workspaceId, onCompleted }: MarketingWidgetProps) {
  const { t } = useI18n()
  const [data, setData] = useState<MarketingStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const finishedRef = useRef(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  const fetchStatus = useCallback(async () => {
    if (finishedRef.current) return
    try {
      const res = await brokerFetch(`/api/broker/marketing/workspace/${workspaceId}/status`)
      if (!res.ok) {
        if (res.status === 404) {
          setError("Workspace not found")
          stopPolling()
        }
        return
      }
      const json = await res.json()
      if (!json.success) {
        setError(json.error || "Could not load workspace status")
        return
      }
      const incoming: MarketingStatus = json.data
      setData(incoming)
      setError(null)

      if (READY_STATUSES.has(incoming.status) || TERMINAL_STATUSES.has(incoming.status)) {
        finishedRef.current = true
        stopPolling()
        if (READY_STATUSES.has(incoming.status) && onCompleted) {
          setTimeout(onCompleted, 3000)
        }
      }
    } catch {
      setError("Network error, retrying…")
    }
  }, [workspaceId, stopPolling, onCompleted])

  const fetchStatusRef = useRef(fetchStatus)
  fetchStatusRef.current = fetchStatus
  useEffect(() => {
    const doFetch = () => fetchStatusRef.current()
    void doFetch()
    pollingRef.current = setInterval(doFetch, 6000)
    return stopPolling
  }, [workspaceId, stopPolling])

  if (!data && !error) {
    return (
      <div className={s.skeleton}>
        <div className={s.skeletonLine} style={{ width: "66%" }} />
        <div className={s.skeletonLine} style={{ width: "40%" }} />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className={s.cardDanger}>
        <p className={s.desc} style={{ color: "var(--danger)" }}>{error}</p>
        <button className={s.retryBtn} onClick={() => { setError(null); void fetchStatus() }}>
          {t("studio.retry")}
        </button>
      </div>
    )
  }

  if (!data) return null

  const activeCampaigns = data.counts?.activeCampaigns ?? 0
  const inFlightTasks = data.counts?.inFlightTasks ?? 0
  const connected = data.connectedPlatforms ?? []
  const displayName = data.productName || data.name
  const dashboard = data.dashboardUrl || `https://marketing.kalit.ai/workspaces/${data.slug || data.workspaceId}`
  const isReady = READY_STATUSES.has(data.status)
  const isPaused = TERMINAL_STATUSES.has(data.status)

  if (isReady) {
    return (
      <div className={s.cardSuccess}>
        <div className={s.header}>
          <span className={s.dotSuccess}><Icon icon="hugeicons:tick-02" /></span>
          <span className={`${s.statusLabel} ${s.textSuccess}`}>Workspace live</span>
        </div>
        <p className={s.desc} style={{ fontWeight: 500, color: "var(--text)" }}>{displayName}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--size-2)" }}>
          <a href={dashboard} target="_blank" rel="noreferrer" className={s.actionBtn}>
            Open workspace
            <Icon icon="hugeicons:link-square-02" />
          </a>
        </div>
      </div>
    )
  }

  if (isPaused) {
    return (
      <div className={s.card}>
        <div className={s.header}>
          <span className={s.statusDot}><Icon icon="hugeicons:pause" /></span>
          <span className={s.statusLabel} style={{ color: "var(--text-secondary)" }}>Workspace paused</span>
        </div>
        <p className={s.desc}>{displayName}</p>
      </div>
    )
  }

  return (
    <div className={s.card}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--size-2)" }}>
        <p className={s.desc} style={{ fontWeight: 500, color: "var(--text)", WebkitLineClamp: 2 }}>
          {displayName}
        </p>
        <span className={s.genDots}>
          {data.status}
          <span className={s.genDot} />
          <span className={s.genDot} />
          <span className={s.genDot} />
        </span>
      </div>

      {data.phase && <PhaseIndicator phase={data.phase} />}

      <div className={s.footer}>
        <span>{activeCampaigns} active · {inFlightTasks} task{inFlightTasks === 1 ? "" : "s"} running</span>
        {connected.length > 0 && (
          <span className={s.badge}>{connected.join(", ")}</span>
        )}
        <a href={dashboard} target="_blank" rel="noreferrer" className={s.cancelBtn} style={{ textDecoration: "none" }}>
          Open dashboard
        </a>
      </div>
    </div>
  )
}
