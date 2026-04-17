"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

interface ThemeContextValue {
  darkMode: boolean
  toggleTheme: () => void
}

const STORAGE_KEY = "dark-mode"

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "1") setDarkMode(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
        document.documentElement.classList.toggle("dark", next)
      }
      return next
    })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) return { darkMode: false, toggleTheme: () => {} }
  return ctx
}
