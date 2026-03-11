import { env } from "@/env"

export const APP_NAME = "Kalit AI"

export const APP_COLOR_PRIMARY = "oklch(0.1902 0.0261 287.16)"
export const APP_COLOR_SECONDARY = "oklch(1 0 0)"
export const APP_THEME_COLOR = APP_COLOR_PRIMARY

export const APP_BASE_URL =
  env.NEXT_PUBLIC_NODE_ENV === "production" ? new URL(env.NEXT_PUBLIC_BASE_URL) : new URL("http://localhost:3000")
