import { handlers } from "@/lib/auth"
import { NextRequest } from "next/server"

export const POST = handlers.POST

// Wrap GET to strip the "iss" parameter from OAuth callbacks.
// GitHub sends iss=https://github.com/login/oauth (RFC 9207) but
// @auth/core@0.41 validates it against a hardcoded fallback issuer
// ("https://authjs.dev") for non-OIDC providers, causing a mismatch.
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.has("iss")) {
    const url = req.nextUrl.clone()
    url.searchParams.delete("iss")
    return handlers.GET(new NextRequest(url, {
      method: req.method,
      headers: req.headers,
    }))
  }
  return handlers.GET(req)
}
