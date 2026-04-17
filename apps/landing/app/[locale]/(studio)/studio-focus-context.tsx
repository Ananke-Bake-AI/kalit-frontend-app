"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

interface StudioFocusContextValue {
  focusMode: boolean
  toggleFocus: () => void
}

const StudioFocusContext = createContext<StudioFocusContextValue | null>(null)

interface ProviderProps {
  children: ReactNode
  initial: boolean
  storageKey: string
}

export function StudioFocusProvider({ children, initial, storageKey }: ProviderProps) {
  const [focusMode, setFocusMode] = useState<boolean>(initial)

  // Keep state in sync with the hydrated initial value (localStorage read
  // happens after mount, so initial may flip from false -> true on first load).
  useEffect(() => {
    setFocusMode(initial)
  }, [initial])

  const toggleFocus = useCallback(() => {
    setFocusMode((prev) => {
      const next = !prev
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, next ? "1" : "0")
      }
      return next
    })
  }, [storageKey])

  return (
    <StudioFocusContext.Provider value={{ focusMode, toggleFocus }}>
      {children}
    </StudioFocusContext.Provider>
  )
}

export function useStudioFocus(): StudioFocusContextValue {
  const ctx = useContext(StudioFocusContext)
  if (!ctx) {
    // Safe fallback when used outside the provider (e.g., non-studio pages)
    return { focusMode: false, toggleFocus: () => {} }
  }
  return ctx
}
