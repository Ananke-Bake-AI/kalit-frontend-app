"use client"

import type { ReactNode } from "react"
import { useStudioStore } from "../../store"
import clsx from "clsx"
import s from "./chat-layout.module.scss"

interface ChatLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  rightPanel?: ReactNode
}

export function ChatLayout({ sidebar, children, rightPanel }: ChatLayoutProps) {
  const { sidebarOpen, rightPanelOpen, setRightPanelOpen } = useStudioStore()
  const closeRight = () => setRightPanelOpen(false)

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
