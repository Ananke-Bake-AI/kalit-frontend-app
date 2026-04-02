"use client"

import { COOKIE_NAME, DEFAULT_LOCALE, loadMessages, t as translate, type Locale } from "@/lib/i18n"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

type Messages = Record<string, unknown>

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key
})

export function I18nProvider({
  children,
  initialLocale,
  initialMessages
}: {
  children: React.ReactNode
  initialLocale: Locale
  initialMessages: Messages
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [messages, setMessages] = useState<Messages>(initialMessages)

  // Sync state from server props after router.refresh() delivers new locale.
  // This ensures locale state and server-rendered text update at the same time,
  // preventing GSAP-animated headings from remounting with stale text.
  useEffect(() => {
    if (initialLocale !== locale) {
      setLocaleState(initialLocale)
      setMessages(initialMessages)
    }
  }, [initialLocale, initialMessages])

  const setLocale = useCallback(async (newLocale: Locale) => {
    // Set cookie and HTML lang immediately so router.refresh() picks up the new locale
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    document.documentElement.lang = newLocale
  }, [])

  const tFn = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(messages as never, key, params),
    [messages]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: tFn }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useTranslation() {
  const { t } = useContext(I18nContext)
  return t
}
