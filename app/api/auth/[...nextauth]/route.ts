import { handlers } from "@/lib/auth"

export const POST = handlers.POST

// Wrap GET to strip the "iss" parameter from OAuth callbacks.
// GitHub sends iss=https://github.com/login/oauth (RFC 9207) but
// @auth/core@0.41 validates it against a hardcoded fallback issuer
// ("https://authjs.dev") for non-OIDC providers, causing a mismatch.
export const GET: typeof handlers.GET = (req, ctx) => {
  const url = new URL(req.url)
  if (url.searchParams.has("iss")) {
    url.searchParams.delete("iss")
    const cleaned = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      // @ts-expect-error duplex is needed for streaming bodies
      duplex: "half",
    })
    return handlers.GET(cleaned, ctx)
  }
  return handlers.GET(req, ctx)
}
