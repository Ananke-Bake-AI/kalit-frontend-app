"use client"

import { useEffect, type ReactNode } from "react"
import { useStudioStore } from "../../store"
import clsx from "clsx"
import s from "./chat-layout.module.scss"

interface ChatLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  rightPanel?: ReactNode
}

const MOBILE_BREAKPOINT_PX = 600

export function ChatLayout({ sidebar, children, rightPanel }: ChatLayoutProps) {
  const { sidebarOpen, rightPanelOpen, setRightPanelOpen } = useStudioStore()
  const closeRight = () => setRightPanelOpen(false)

  // The store defaults rightPanelOpen to true (good UX on desktop where the
  // panel is inline and adjacent to the chat). On phone widths the panel is
  // a full-viewport overlay that hides the chat — defaulting it open means
  // the user lands on the file explorer instead of the conversation.
  // Force-close on first mount when the viewport is narrower than the phone
  // breakpoint, and again whenever the viewport crosses the breakpoint
  // downward (orientation change, browser resize). Do not auto-open on the
  // upward crossing — respect the user's last explicit choice on desktop.
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.innerWidth <= MOBILE_BREAKPOINT_PX) {
      setRightPanelOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT_PX) {
        setRightPanelOpen(false)
      }
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [setRightPanelOpen])

  return (
    <div className={s.layout}>
      <aside className={clsx(s.sidebar, sidebarOpen && s.sidebarOpen)}>
        {sidebar}
      </aside>

      <div className={s.backdrop} data-visible={sidebarOpen} onClick={() => useStudioStore.getState().setSidebarOpen(false)} />

      <div className={s.main}>
        {children}
      </div>

      {rightPanel && (
        <>
          <div
            className={s.rightBackdrop}
            data-visible={rightPanelOpen}
            onClick={closeRight}
          />
          <aside className={clsx(s.right, rightPanelOpen && s.rightOpen)}>
            <button
              className={s.rightCloseBtn}
              onClick={closeRight}
              aria-label="Close project panel"
              type="button"
            >
              ×
            </button>
            {rightPanel}
          </aside>
        </>
      )}
    </div>
  )
}
