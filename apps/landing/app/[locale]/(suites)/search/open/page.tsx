import { auth } from "@/lib/auth"
import { localeHref } from "@/lib/i18n-server"
import { prisma } from "@/lib/prisma"
import { SignJWT } from "jose"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default async function OpenSearchPage() {
  const session = await auth()
  if (!session?.user?.orgId || !session?.user?.id || !session?.user?.email) {
    redirect(await localeHref("/login?callbackUrl=/search/open"))
  }

  const secret = process.env.SUITE_JWT_SECRET || process.env.AUTH_SECRET
  if (!secret) {
    redirect(await localeHref("/dashboard"))
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, orgId: session.user.orgId }
  })

  const encoder = new TextEncoder()
  const token = await new SignJWT({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name || null,
    orgId: session.user.orgId,
    suiteId: "search",
    role: membership?.role || "MEMBER"
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setSubject(session.user.id)
    .setIssuer("kalit-main")
    .setAudience("search")
    .sign(encoder.encode(secret))

  const baseUrl = process.env.SUITE_SEARCH_URL || "https://search.kalit.ai"
  const redirectUrl = `${baseUrl}/api/auth/sso/callback?token=${encodeURIComponent(token)}`

  redirect(redirectUrl)
}
