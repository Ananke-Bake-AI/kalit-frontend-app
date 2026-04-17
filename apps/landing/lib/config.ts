import { env } from "@/env"

export const APP_NAME = "Kalit AI"

export const APP_COLOR_PRIMARY = "oklch(0.1902 0.0261 287.16)"
export const APP_COLOR_SECONDARY = "oklch(1 0 0)"
export const APP_THEME_COLOR = APP_COLOR_PRIMARY

function normalizeUrl(value: string) {
  return value.replace(/^['"]|['"]$/g, "").trim()
}

const appUrl = normalizeUrl(env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
const baseUrl = normalizeUrl(env.NEXT_PUBLIC_BASE_URL || appUrl)

export const APP_BASE_URL =
  env.NEXT_PUBLIC_NODE_ENV === "production" ? new URL(baseUrl) : new URL(appUrl)

export const APP_URL = new URL(appUrl)
