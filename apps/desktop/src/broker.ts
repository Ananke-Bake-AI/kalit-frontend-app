import { createBrokerClient } from "@kalit/broker-client"
import { setStudioBrokerClient } from "@kalit/studio-ui"

const TOKEN_STORAGE_KEY = "kalit-broker-token"
const BROKER_BASE_URL =
  import.meta.env.VITE_BROKER_URL ||
  (import.meta.env.DEV ? "" : "https://kalit.ai")

// The broker serves files under /api/flow/ canonically. In dev the vite proxy
// rewrites /api/broker/ → /api/flow/, so point file URLs at /api/broker/ to
// flow through the same proxy. In packaged builds (file:// renderer origin)
// we need an absolute URL so fetch doesn't resolve against the app bundle.
const LANDING_ORIGIN = import.meta.env.VITE_KALIT_WEB_URL || "https://kalit.ai"
const FILE_URL_TO = import.meta.env.DEV
  ? "/api/broker/"
  : `${LANDING_ORIGIN.replace(/\/+$/, "")}/api/broker/`

async function getToken(): Promise<string | null> {
  if (typeof localStorage === "undefined") return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

// find-assets is proxied by the LANDING (it holds the API key), not the broker.
// Dev goes through the landing's own dev server; packaged builds hit production.
const FIND_ASSETS_PREFIX = import.meta.env.DEV
  ? `${LANDING_ORIGIN.replace(/\/+$/, "")}/api/broker/find-assets/`
  : `${LANDING_ORIGIN.replace(/\/+$/, "")}/api/broker/find-assets/`

const client = createBrokerClient({
  baseUrl: BROKER_BASE_URL,
  getToken,
  fileUrlPrefix: { from: "/api/flow/", to: FILE_URL_TO },
  findAssetsPrefix: FIND_ASSETS_PREFIX,
})

setStudioBrokerClient(client)

export function setBrokerToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  client.clearToken()
}

export function clearBrokerToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  client.clearToken()
}
