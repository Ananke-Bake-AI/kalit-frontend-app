"use client"

import type { Session } from "next-auth"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import NextTopLoader from "nextjs-toploader"
import { Header } from "@/components/layout/header"
import { RealViewport } from "@/components/layout/real-viewport"
import { SyncAppPageFromRoute } from "@/components/layout/sync-app-page-from-route"
import { Toast } from "@/components/layout/toast"
import { EmailBanner } from "@/components/layout/email-banner"
import { StudioFocusProvider, useStudioFocus } from "./studio-focus-context"
import s from "./studio-shell.module.scss"

interface StudioShellProps {
  children: ReactNode
  session?: Session | null
}

const FOCUS_STORAGE_KEY = "studio-focus-mode"

function StudioShellInner({ children, session }: { children: ReactNode; session: Session | null }) {
  const { focusMode } = useStudioFocus()
  const pathname = usePathname() || ""

  // Project editor + publish pages render their own fullscreen chrome
  // (position: fixed; inset: 0) with a dedicated header and back button.
  // Showing the global Kalit header on top would overlap that chrome,
  // so we treat project routes as implicit focus mode.
  const isProjectRoute = /\/studio\/project\//.test(pathname)
  const hideSiteChrome = focusMode || isProjectRoute

  return (
    <div className={s.root} data-focus={hideSiteChrome || undefined}>
      <SyncAppPageFromRoute />
      {/* Studio is a single locked viewport with no footer — long chats
          scroll inside the message list, not the page. A focus-mode toggle
          lets the user hide the global Kalit header for a true full-screen
          studio experience. Project routes are always chrome-free because
          the editor renders its own fullscreen shell. */}
      {!hideSiteChrome && (
        <>
          <Header initialSession={session} />
          <EmailBanner initialSession={session} />
        </>
      )}
      <main className={s.main}>{children}</main>
      <Toast />
      <RealViewport />
      <NextTopLoader height={2} showSpinner={false} zIndex={9999999} />
    </div>
  )
}

export const StudioShell = ({ children, session = null }: StudioShellProps) => {
  const [initial, setInitial] = useState<boolean>(false)

  // Read saved focus preference from localStorage before first paint once mounted
  useEffect(() => {
    if (typeof window === "undefined") return
    setInitial(window.localStorage.getItem(FOCUS_STORAGE_KEY) === "1")
  }, [])

  return (
    <StudioFocusProvider initial={initial} storageKey={FOCUS_STORAGE_KEY}>
      <StudioShellInner session={session}>{children}</StudioShellInner>
    </StudioFocusProvider>
  )
}
