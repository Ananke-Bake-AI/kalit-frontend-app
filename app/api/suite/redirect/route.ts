import { NextRequest, NextResponse } from "next/server"
import { getSuiteAppUrl, type SuiteId } from "@/lib/suites"

/**
 * GET /api/suite/redirect?suiteId=search&token=xxx
 *
 * Server-side redirect to the suite's SSO callback.
 * This ensures the redirect URL is always resolved server-side,
 * bypassing any client-side caching issues.
 */

const SUITE_URLS: Record<string, string> = {
  marketing: "https://marketing.kalit.ai",
  search: "https://research.kalit.ai",
  flow: process.env.SUITE_FLOW_URL || "http://localhost:3004",
  project: process.env.SUITE_PROJECT_URL || "http://localhost:3003",
  pentest: process.env.SUITE_PENTEST_URL || "http://localhost:3005",
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const suiteId = searchParams.get("suiteId") as SuiteId | null
  const token = searchParams.get("token")

  if (!suiteId || !token) {
    return NextResponse.json({ error: "Missing suiteId or token" }, { status: 400 })
  }

  const baseUrl = SUITE_URLS[suiteId] || getSuiteAppUrl(suiteId)
  if (!baseUrl) {
    return NextResponse.json({ error: "Unknown suite" }, { status: 400 })
  }

  const redirectUrl = `${baseUrl}/api/auth/sso/callback?token=${encodeURIComponent(token)}`
  return NextResponse.redirect(redirectUrl)
}
