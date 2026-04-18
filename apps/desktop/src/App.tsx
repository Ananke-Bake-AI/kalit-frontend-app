import { useCallback, useEffect, useMemo, useState } from "react"
import { Icon } from "@iconify/react"
import { I18nProvider, loadMessages, type Locale, type Messages } from "@kalit/i18n"
import {
  ChatInput,
  ChatLayout,
  FileExplorer,
  FilePreviewModal,
  MessageList,
  SessionSidebar,
  StudioFocusProvider,
  StudioHostProvider,
  StudioThemeProvider,
  WelcomeScreen,
  useStudioChat,
  useStudioStore,
  useStudioTheme,
} from "@kalit/studio-ui"

import styles from "./App.module.scss"
import { AuthProvider, useAuth } from "./auth/auth-context"
import { SignInScreen } from "./auth/sign-in-screen"

const THEME_STORAGE_KEY = "studio-theme-dark"

function readInitialDarkMode(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function ThemeSync() {
  const { darkMode } = useStudioTheme()
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])
  return null
}

function ThemeToggleButton() {
  const { darkMode, toggleTheme } = useStudioTheme()
  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggleTheme}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Icon icon={darkMode ? "hugeicons:sun-03" : "hugeicons:moon-02"} />
    </button>
  )
}

const DEFAULT_LOCALE: Locale = "en"

// Minimal translator matching the subset of keys the studio hook/UI reads at
// runtime. Desktop ships a static English build for now; extend via loadMessages
// once we localize native windows.
const desktopT = (key: string): string => {
  const table: Record<string, string> = {
    "studio.brokerError": "Broker unavailable (status {status})",
    "studio.connectionError": "Couldn't reach the Kalit broker.",
    "studio.streamError": "Stream interrupted.",
  }
  return table[key] ?? key
}

function StudioDesktop() {
  const { user, signOut } = useAuth()
  const [previewImages, setPreviewImages] = useState<{ url: string; name: string }[]>([])

  const {
    activeSessionId,
    messages,
    messagesLoading,
    isStreaming,
    setPreviewFile,
    previewFile,
    rightPanelOpen,
    setRightPanelOpen,
  } = useStudioStore()

  const {
    ready,
    connectionError,
    chatPrefill,
    handleSend,
    handleStop,
    handleSessionSelect,
    handleNewChat,
    handleWelcomePrompt,
    ensureSession,
    fetchMessages,
  } = useStudioChat({
    locale: DEFAULT_LOCALE,
    t: desktopT,
    // Desktop has no router/URL to sync — noop out the web hooks.
  })

  const handlePreviewFile = useCallback(
    (file: { url: string; name: string }, images?: { url: string; name: string }[]) => {
      setPreviewFile(file)
      setPreviewImages(images ?? [])
    },
    [setPreviewFile],
  )

  const hostValue = useMemo(
    () => ({
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            isAdmin: user.isAdmin === true,
          }
        : null,
      navigate: (_path: string) => {},
      getSearchParam: (_key: string) => null,
    }),
    [user],
  )

  const showWelcome = !activeSessionId || (messages.length === 0 && !isStreaming)

  return (
    <StudioHostProvider value={hostValue}>
      <StudioThemeProvider initial={readInitialDarkMode()} storageKey={THEME_STORAGE_KEY}>
        <ThemeSync />
        <StudioFocusProvider initial={false} storageKey="studio-focus-mode">
          <div className={styles.root}>
            <ChatLayout
              sidebar={
                <div className={styles.sidebarWrap}>
                  <SessionSidebar
                    onSessionSelect={handleSessionSelect}
                    onNewChat={handleNewChat}
                  />
                  <div className={styles.sidebarFooter}>
                    <button
                      type="button"
                      className={styles.signOut}
                      onClick={signOut}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              }
              rightPanel={
                activeSessionId ? (
                  <FileExplorer
                    sessionId={activeSessionId}
                    onPreviewFile={handlePreviewFile}
                  />
                ) : undefined
              }
            >
              <div className={styles.main}>
                <div className={styles.topBar}>
                  <div className={styles.topSpacer} />
                  <div className={styles.topRight}>
                    <ThemeToggleButton />
                    {activeSessionId && (
                      <button
                        type="button"
                        className={styles.topButton}
                        onClick={() => setRightPanelOpen(!rightPanelOpen)}
                        title={rightPanelOpen ? "Hide files" : "Show files"}
                        aria-label="Toggle files panel"
                      >
                        <Icon
                          icon={
                            rightPanelOpen
                              ? "hugeicons:sidebar-right"
                              : "hugeicons:source-code"
                          }
                        />
                      </button>
                    )}
                  </div>
                </div>
                {connectionError ? (
                  <div className={styles.boot}>{connectionError}</div>
                ) : !ready ? (
                  <div className={styles.boot}>Loading Kalit Studio…</div>
                ) : showWelcome ? (
                  <WelcomeScreen onPromptSelect={handleWelcomePrompt} />
                ) : (
                  <div className={styles.messageArea}>
                    {messagesLoading ? (
                      <div className={styles.boot}>Loading messages…</div>
                    ) : (
                      <MessageList
                        onStop={handleStop}
                        onPreviewFile={handlePreviewFile}
                        onRefreshMessages={() =>
                          activeSessionId && fetchMessages(activeSessionId)
                        }
                      />
                    )}
                  </div>
                )}
                <div className={styles.inputDock}>
                  <ChatInput
                    onSend={handleSend}
                    prefill={chatPrefill}
                    onEnsureSession={ensureSession}
                  />
                </div>
              </div>
            </ChatLayout>
            {previewFile && (
              <FilePreviewModal
                url={previewFile.url}
                name={previewFile.name}
                items={previewImages}
                onClose={() => { setPreviewFile(null); setPreviewImages([]) }}
              />
            )}
          </div>
        </StudioFocusProvider>
      </StudioThemeProvider>
    </StudioHostProvider>
  )
}

function AuthGate() {
  const { status } = useAuth()
  if (status === "loading") {
    return <div className={styles.boot}>Loading Kalit Studio…</div>
  }
  if (status === "signed-out") {
    return <SignInScreen />
  }
  return <StudioDesktop />
}

export function App() {
  const [messages, setMessages] = useState<Messages | null>(null)

  useEffect(() => {
    loadMessages(DEFAULT_LOCALE).then(setMessages)
  }, [])

  if (!messages) {
    return <div className={styles.boot}>Loading Kalit Studio…</div>
  }

  return (
    <I18nProvider initialLocale={DEFAULT_LOCALE} initialMessages={messages}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </I18nProvider>
  )
}
