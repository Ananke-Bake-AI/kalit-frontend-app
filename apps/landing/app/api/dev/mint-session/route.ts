import { NextResponse } from "next/server"
import { encode } from "next-auth/jwt"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not available" }, { status: 404 })
  }

  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "kalit-dev-secret-change-in-production-32chars"

  const now = Math.floor(Date.now() / 1000)
  const maxAge = 60 * 30

  const token = await encode({
    token: {
      sub: "cmmwejeif00007bural0m8kol",
      userId: "cmmwejeif00007bural0m8kol",
      email: "test@kalit.ai",
      name: "Test User",
      orgId: "cmmwejeik00017bur6pb77q7o",
      isAdmin: false,
      onboardingDone: true,
      emailVerified: true,
      iat: now,
      exp: now + maxAge,
    },
    secret,
    salt: "authjs.session-token",
    maxAge,
  })

  const res = NextResponse.json({ ok: true, user: "test@kalit.ai" })
  res.cookies.set("authjs.session-token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  })
  return res
}
