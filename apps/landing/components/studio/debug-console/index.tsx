"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useStudioStore } from "@/stores/studio"
import { brokerFetch } from "@/lib/broker-direct"
import type { ConsoleLogEntry } from "@/stores/studio"
import s from "./debug-console.module.scss"

type FilterType = "all" | "route" | "tool" | "text" | "error" | "cost" | "system"

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "route", label: "Route" },
  { key: "tool", label: "Tools" },
  { key: "text", label: "Text" },
  { key: "cost", label: "Cost" },
  { key: "error", label: "Errors" },
  { key: "system", label: "System" },
]

const FILTER_TYPES: Record<FilterType, string[]> = {
  all: [],
  route: ["route"],
  tool: ["tool"],
  text: ["text", "think"],
  cost: ["cost", "done"],
  error: ["error"],
  system: ["system", "cmd", "progress", "widget", "file"],
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k"
  return String(n)
}

// ── Command helpers ─────────────────────────────────────

interface CommandResult {
  entries: ConsoleLogEntry[]
}

async function executeCommand(
  cmd: string,
  activeSessionId: string | null,
  addConsoleLog: (entry: ConsoleLogEntry) => void,
): Promise<CommandResult> {
  const entries: ConsoleLogEntry[] = []
  const log = (tag: string, msg: string) => {
    const entry: ConsoleLogEntry = { id: `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: Date.now(), type: "cmd", tag, message: msg }
    entries.push(entry)
    addConsoleLog(entry)
  }

  const parts = cmd.trim().split(/\s+/)
  const name = parts[0]?.toLowerCase()

  switch (name) {
    case "help": {
      log("HELP", "Available commands:")
      log("HELP", "  clear          Clear console logs")
      log("HELP", "  session        Show active session details")
      log("HELP", "  routing        Show last routing decision")
      log("HELP", "  tokens         Show token usage summary")
      log("HELP", "  model          Show current model")
      log("HELP", "  ping           Test broker connectivity")
      log("HELP", "  quota          Check credit quota")
      log("HELP", "  reload         Reload sessions from broker")
      log("HELP", "  env            Show environment info")
      break
    }

    case "clear": {
      useStudioStore.getState().clearConsoleLogs()
      return { entries: [] }
    }

    case "session": {
      if (!activeSessionId) {
        log("SESSION", "No active session")
        break
      }
      const sessions = useStudioStore.getState().sessions
      const sess = sessions.find((s) => s.id === activeSessionId)
      if (sess) {
        log("SESSION", `ID: ${sess.id}`)
        log("SESSION", `Title: ${sess.title || "(untitled)"}`)
        log("SESSION", `Model: ${sess.model || "default"}`)
        log("SESSION", `Created: ${new Date(sess.createdAt).toLocaleString()}`)
        log("SESSION", `Updated: ${new Date(sess.updatedAt).toLocaleString()}`)
        log("SESSION", `Processing: ${sess.isProcessing ? "yes" : "no"}`)
      } else {
        log("SESSION", `ID: ${activeSessionId} (not found in local list)`)
      }
      break
    }

    case "routing": {
      const routing = useStudioStore.getState().lastRouting
      if (!routing) {
        log("ROUTE", "No routing data yet — send a message first")
        break
      }
      log("ROUTE", `Suite: ${routing.suite}`)
      log("ROUTE", `Confidence: ${routing.confidence}`)
      log("ROUTE", `Source: ${routing.source}`)
      if (routing.latencyMs !== undefined) log("ROUTE", `Latency: ${routing.latencyMs}ms`)
      if (routing.reasoning) log("ROUTE", `Reasoning: ${routing.reasoning}`)
      break
    }

    case "tokens": {
      const summary = useStudioStore.getState().consoleSummary
      if (!summary || (summary.inputTokens === 0 && summary.outputTokens === 0)) {
        log("TOKENS", "No token data yet — complete a turn first")
        break
      }
      log("TOKENS", `Input: ${formatTokens(summary.inputTokens)}`)
      log("TOKENS", `Output: ${formatTokens(summary.outputTokens)}`)
      if (summary.cacheCreationTokens > 0) log("TOKENS", `Cache write: ${formatTokens(summary.cacheCreationTokens)}`)
      if (summary.cacheReadTokens > 0) log("TOKENS", `Cache read: ${formatTokens(summary.cacheReadTokens)}`)
      log("TOKENS", `Cost: ${summary.costCredits.toFixed(4)} credits`)
      log("TOKENS", `Turn time: ${(summary.turnDurationMs / 1000).toFixed(1)}s`)
      break
    }

    case "model": {
      const model = useStudioStore.getState().selectedModel
      log("MODEL", `Current: ${model}`)
      break
    }

    case "ping": {
      const start = performance.now()
      try {
        const res = await brokerFetch("/api/broker/sessions")
        const elapsed = Math.round(performance.now() - start)
        if (res.ok) {
          const data = await res.json().catch(() => null)
          const count = data?.sessions?.length ?? "?"
          log("PING", `Broker OK — ${elapsed}ms (${count} sessions)`)
        } else {
          log("PING", `Broker returned ${res.status} — ${elapsed}ms`)
        }
      } catch (err) {
        const elapsed = Math.round(performance.now() - start)
        log("PING", `Broker unreachable — ${elapsed}ms — ${err}`)
      }
      break
    }

    case "quota": {
      try {
        const res = await fetch("/api/broker/usage")
        if (res.ok) {
          const data = await res.json()
          log("QUOTA", `Plan: ${data.plan}`)
          log("QUOTA", `Remaining: ${data.remaining} / ${data.creditsPerMonth} credits`)
          log("QUOTA", `Usage: ${data.percentage?.toFixed(1)}%`)
        } else {
          log("QUOTA", `Failed to fetch: HTTP ${res.status}`)
        }
      } catch (err) {
        log("QUOTA", `Error: ${err}`)
      }
      break
    }

    case "reload": {
      try {
        const res = await brokerFetch("/api/broker/sessions")
        if (res.ok) {
          const data = await res.json()
          useStudioStore.getState().setSessions(data.sessions || [])
          log("RELOAD", `Loaded ${(data.sessions || []).length} sessions`)
        } else {
          log("RELOAD", `Failed: HTTP ${res.status}`)
        }
      } catch (err) {
        log("RELOAD", `Error: ${err}`)
      }
      break
    }

    case "env": {
      log("ENV", `Locale: ${useStudioStore.getState().preferredLang}`)
      log("ENV", `Progress mode: ${useStudioStore.getState().progressMode}`)
      log("ENV", `Platform: ${typeof navigator !== "undefined" ? navigator.platform : "unknown"}`)
      log("ENV", `User-Agent: ${typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : "unknown"}`)
      break
    }

    default: {
      log("ERR", `Unknown command: ${name}. Type "help" for available commands.`)
    }
  }

  return { entries }
}

// ── Main Component ──────────────────────────────────────

export function DebugConsole() {
  const { data: authSession } = useSession()
  const consoleOpen = useStudioStore((st) => st.consoleOpen)
  const consoleLogs = useStudioStore((st) => st.consoleLogs)
  const consoleSummary = useStudioStore((st) => st.consoleSummary)
  const activeSessionId = useStudioStore((st) => st.activeSessionId)
  const addConsoleLog = useStudioStore((st) => st.addConsoleLog)
  const setConsoleOpen = useStudioStore((st) => st.setConsoleOpen)

  const [filter, setFilter] = useState<FilterType>("all")
  const [minimized, setMinimized] = useState(false)
  const [cmdValue, setCmdValue] = useState("")
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1)

  // Drag state
  const [pos, setPos] = useState({ x: -1, y: -1 })
  const [size, setSize] = useState({ w: 520, h: 360 })
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const cmdInputRef = useRef<HTMLInputElement>(null)

  // Initialize position once
  useEffect(() => {
    if (pos.x < 0 && typeof window !== "undefined") {
      setPos({ x: window.innerWidth - size.w - 20, y: window.innerHeight - size.h - 100 })
    }
  }, [pos.x, size.w, size.h])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [consoleLogs.length])

  // Focus input when console opens
  useEffect(() => {
    if (consoleOpen && !minimized) {
      setTimeout(() => cmdInputRef.current?.focus(), 100)
    }
  }, [consoleOpen, minimized])

  // ── Drag handlers ──────────────────────────────────────

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y }

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.origX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 40, dragRef.current.origY + dy)),
      })
    }

    const handleUp = () => {
      dragRef.current = null
      document.removeEventListener("mousemove", handleMove)
      document.removeEventListener("mouseup", handleUp)
    }

    document.addEventListener("mousemove", handleMove)
    document.addEventListener("mouseup", handleUp)
  }, [pos])

  // ── Resize handlers ────────────────────────────────────

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: size.w, origH: size.h }

    const handleMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return
      const dw = ev.clientX - resizeRef.current.startX
      const dh = ev.clientY - resizeRef.current.startY
      setSize({
        w: Math.max(380, resizeRef.current.origW + dw),
        h: Math.max(200, resizeRef.current.origH + dh),
      })
    }

    const handleUp = () => {
      resizeRef.current = null
      document.removeEventListener("mousemove", handleMove)
      document.removeEventListener("mouseup", handleUp)
    }

    document.addEventListener("mousemove", handleMove)
    document.addEventListener("mouseup", handleUp)
  }, [size])

  // ── Command execution ──────────────────────────────────

  const handleCmd = useCallback(async () => {
    const raw = cmdValue.trim()
    if (!raw) return
    setCmdValue("")
    setCmdHistory((h) => [...h.slice(-50), raw])
    setCmdHistoryIdx(-1)

    addConsoleLog({
      id: `input-${Date.now()}`,
      ts: Date.now(),
      type: "cmd",
      tag: ">",
      message: raw,
    })

    await executeCommand(raw, activeSessionId, addConsoleLog)
  }, [cmdValue, activeSessionId, addConsoleLog])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCmd()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const nextIdx = cmdHistoryIdx < 0 ? cmdHistory.length - 1 : Math.max(0, cmdHistoryIdx - 1)
      setCmdHistoryIdx(nextIdx)
      setCmdValue(cmdHistory[nextIdx] || "")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (cmdHistoryIdx < 0) return
      const nextIdx = cmdHistoryIdx + 1
      if (nextIdx >= cmdHistory.length) {
        setCmdHistoryIdx(-1)
        setCmdValue("")
      } else {
        setCmdHistoryIdx(nextIdx)
        setCmdValue(cmdHistory[nextIdx] || "")
      }
    } else if (e.key === "Escape") {
      setConsoleOpen(false)
    }
  }, [handleCmd, cmdHistory, cmdHistoryIdx, setConsoleOpen])

  // ── Filter logs ────────────────────────────────────────

  const filteredLogs = useMemo(() => {
    if (filter === "all") return consoleLogs
    const types = FILTER_TYPES[filter]
    return consoleLogs.filter((entry) => types.includes(entry.type))
  }, [consoleLogs, filter])

  const filterCounts = useMemo(() => {
    const counts: Record<FilterType, number> = { all: consoleLogs.length, route: 0, tool: 0, text: 0, cost: 0, error: 0, system: 0 }
    for (const entry of consoleLogs) {
      for (const [key, types] of Object.entries(FILTER_TYPES)) {
        if (key === "all") continue
        if (types.includes(entry.type)) counts[key as FilterType]++
      }
    }
    return counts
  }, [consoleLogs])

  // ── Guard: admin only ──────────────────────────────────

  if (!authSession?.user?.isAdmin) return null
  if (!consoleOpen) return null

  return (
    <div
      ref={containerRef}
      className={s.container}
      data-minimized={minimized}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        ...(minimized ? {} : { height: size.h }),
      }}
    >
      {/* Title bar — draggable */}
      <div className={s.titleBar} onMouseDown={handleDragStart}>
        <div className={s.titleDots}>
          <button className={`${s.dot} ${s.dotClose}`} onClick={() => setConsoleOpen(false)} title="Close" />
          <button className={`${s.dot} ${s.dotMinimize}`} onClick={() => setMinimized((v) => !v)} title="Minimize" />
          <button
            className={`${s.dot} ${s.dotMaximize}`}
            onClick={() => {
              if (size.w > 600) {
                setSize({ w: 520, h: 360 })
              } else {
                setSize({ w: Math.min(900, window.innerWidth - 40), h: Math.min(600, window.innerHeight - 100) })
              }
            }}
            title="Maximize"
          />
        </div>
        <span className={s.titleText}>Kalit Debug Console</span>
        {activeSessionId && (
          <span className={s.titleSession} title={activeSessionId}>
            {activeSessionId.slice(0, 8)}
          </span>
        )}
      </div>

      {!minimized && (
        <>
          {/* Stats bar */}
          {consoleSummary && (consoleSummary.inputTokens > 0 || consoleSummary.outputTokens > 0) && (
            <div className={s.statsBar}>
              <div className={s.stat}>
                <span className={s.statLabel}>in:</span>
                <span>{formatTokens(consoleSummary.inputTokens)}</span>
              </div>
              <div className={s.stat}>
                <span className={s.statLabel}>out:</span>
                <span>{formatTokens(consoleSummary.outputTokens)}</span>
              </div>
              {consoleSummary.cacheReadTokens > 0 && (
                <div className={s.stat}>
                  <span className={s.statLabel}>cache:</span>
                  <span>{formatTokens(consoleSummary.cacheReadTokens)}</span>
                </div>
              )}
              <div className={s.statDivider} />
              <div className={s.stat}>
                <span className={s.statLabel}>cost:</span>
                <span>{consoleSummary.costCredits.toFixed(4)}</span>
              </div>
              {consoleSummary.turnDurationMs > 0 && (
                <>
                  <div className={s.statDivider} />
                  <div className={s.stat}>
                    <span className={s.statLabel}>turn:</span>
                    <span>{(consoleSummary.turnDurationMs / 1000).toFixed(1)}s</span>
                  </div>
                </>
              )}
              {consoleSummary.model && (
                <>
                  <div className={s.statDivider} />
                  <div className={s.stat}>
                    <span>{consoleSummary.model.replace(/^(mistral|anthropic|openai):/, "")}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Filter bar */}
          <div className={s.filterBar}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={s.filterBtn}
                data-active={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                {f.key !== "all" && filterCounts[f.key] > 0 && (
                  <span className={s.filterCount}>{filterCounts[f.key]}</span>
                )}
              </button>
            ))}
          </div>

          {/* Log entries */}
          <div className={s.logs}>
            {filteredLogs.length === 0 ? (
              <div className={s.empty}>
                {consoleLogs.length === 0
                  ? "No events yet. Send a message to see live logs.\nType \"help\" for available commands."
                  : "No matching entries for this filter."}
              </div>
            ) : (
              filteredLogs.map((entry) => (
                <div key={entry.id} className={s.logEntry}>
                  <span className={s.logTime}>{formatTime(entry.ts)}</span>
                  <span className={s.logTag} data-type={entry.type}>{entry.tag}</span>
                  <span className={s.logMsg}>{entry.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          {/* Command input */}
          <div className={s.cmdBar}>
            <span className={s.cmdPrompt}>&gt;</span>
            <input
              ref={cmdInputRef}
              className={s.cmdInput}
              type="text"
              value={cmdValue}
              onChange={(e) => setCmdValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command... (help for list)"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {/* Resize handle */}
          <div className={s.resizeHandle} onMouseDown={handleResizeStart} />
        </>
      )}
    </div>
  )
}
