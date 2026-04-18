/**
 * Environment-agnostic broker client.
 *
 * Web (kalit-landing) instantiates this with baseUrl="" + a getToken that
 * hits `/api/broker/token` (httpOnly NextAuth session). Desktop (future Tauri
 * app) instantiates it with baseUrl pointing at the hosted broker and a
 * getToken backed by an OS-keychain credential.
 */

export interface BrokerClientConfig {
  /**
   * Base URL prefix for broker calls. Empty string means "same-origin" — the
   * host app is expected to provide a rewrite from /api/broker/* to the
   * real broker. For desktop set something like "https://api.kalit.ai".
   */
  baseUrl?: string
  /**
   * Async resolver for the current bearer token. Returning null means the
   * caller is unauthenticated; the fetch will still be attempted (some
   * broker routes are public, e.g. find-assets).
   */
  getToken: () => Promise<string | null>
  /**
   * Optional path prefix rewrite for file URLs the broker returns. The broker
   * canonically serves files under `/api/flow/...`. Web rewrites that to
   * `/api/broker/...`; desktop points it at the real broker host.
   */
  fileUrlPrefix?: {
    from: string
    to: string
  }
  /**
   * Prefix applied to find-assets preview URLs. Third-party asset hosts are
   * proxied through a landing route (`/api/broker/find-assets/<rest>`) that
   * adds the API key. Defaults to the relative landing path; desktop should
   * pass an absolute landing URL so packaged renderers (file://) resolve it.
   */
  findAssetsPrefix?: string
}

export interface BrokerClient {
  /** Fetch wrapper that adds the bearer token + base URL prefix. */
  fetch: (path: string, options?: RequestInit) => Promise<Response>
  /** Rewrite a broker-canonical file URL for client rendering. */
  mapFileUrl: (url: string | undefined | null) => string
  /** Proxy a find-assets preview URL through the landing asset proxy. */
  mapFindAssetsUrl: (url: string | undefined | null) => string
  /** Invalidate any cached token. Call on logout. */
  clearToken: () => void
}

export function createBrokerClient(config: BrokerClientConfig): BrokerClient {
  const baseUrl = (config.baseUrl ?? "").replace(/\/+$/, "")
  let cachedToken: string | null = null
  let tokenFetchPromise: Promise<string | null> | null = null

  async function resolveToken(): Promise<string | null> {
    if (cachedToken) return cachedToken
    if (!tokenFetchPromise) {
      tokenFetchPromise = config
        .getToken()
        .then((token) => {
          cachedToken = token
          tokenFetchPromise = null
          return token
        })
        .catch(() => {
          tokenFetchPromise = null
          return null
        })
    }
    return tokenFetchPromise
  }

  async function brokerFetch(path: string, options?: RequestInit): Promise<Response> {
    const token = await resolveToken()
    const headers = new Headers(options?.headers)
    if (token) headers.set("Authorization", `Bearer ${token}`)
    return fetch(`${baseUrl}${path}`, { ...options, headers })
  }

  function mapFileUrl(url: string | undefined | null): string {
    if (!url) return ""
    const prefix = config.fileUrlPrefix
    if (prefix && url.startsWith(prefix.from)) {
      return `${prefix.to}${url.slice(prefix.from.length)}`
    }
    return url
  }

  const findAssetsPrefix = (config.findAssetsPrefix ?? "/api/broker/find-assets/").replace(
    /\/+$/,
    "/",
  )

  function mapFindAssetsUrl(url: string | undefined | null): string {
    if (!url) return ""
    const match = url.match(/https?:\/\/[^/]+\/(.+)/)
    if (match) return `${findAssetsPrefix}${match[1]}`
    return url
  }

  function clearToken(): void {
    cachedToken = null
    tokenFetchPromise = null
  }

  return { fetch: brokerFetch, mapFileUrl, mapFindAssetsUrl, clearToken }
}
