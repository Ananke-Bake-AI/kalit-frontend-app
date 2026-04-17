"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { COOKIE_NAME, DEFAULT_LOCALE, t as translate, type Locale, type Messages } from "./core"

interface I18nContextValue {
  locale: Locale
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: (key) => key,
})

export function I18nProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: ReactNode
  initialLocale: Locale
  initialMessages: Messages
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [messages, setMessages] = useState<Messages>(initialMessages)

  useEffect(() => {
    if (initialLocale !== locale) {
      setLocaleState(initialLocale)
      setMessages(initialMessages)
    }
  }, [initialLocale, initialMessages])

  useEffect(() => {
    if (typeof document === "undefined") return
    document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    document.documentElement.lang = locale
  }, [locale])

  const tFn = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(messages, key, params),
    [messages],
  )

  return <I18nContext.Provider value={{ locale, t: tFn }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useTranslation() {
  const { t } = useContext(I18nContext)
  return t
}
