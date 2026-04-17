import { handlers } from "@/lib/auth"
import { NextRequest } from "next/server"

export const POST = handlers.POST

// GitHub sends iss=https://github.com/login/oauth (RFC 9207) but
// @auth/core@0.41 validates it against a hardcoded fallback issuer
// ("https://authjs.dev") for non-OIDC providers, causing a mismatch.
// We only strip "iss" for non-OIDC providers (GitHub). OIDC providers
// like Google *require* the iss parameter for validation.
const NON_OIDC_ISSUERS = new Set([
  "https://github.com/login/oauth",
])

export async function GET(req: NextRequest) {
  const iss = req.nextUrl.searchParams.get("iss")
  if (iss && NON_OIDC_ISSUERS.has(iss)) {
    const url = req.nextUrl.clone()
    url.searchParams.delete("iss")
    return handlers.GET(new NextRequest(url, {
      method: req.method,
      headers: req.headers,
    }))
  }
  return handlers.GET(req)
}
