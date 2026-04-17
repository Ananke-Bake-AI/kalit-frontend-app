import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Suite-to-main user lookup. Used by suite backends (e.g. the broker) that
 * know a user's id + orgId from their session but need email/name to build
 * headers for internal suite calls (e.g. X-User-Email into kalit-marketing).
 *
 * Auth: Bearer SUITE_API_KEY (same as /api/suite/credits, /api/suite/quota).
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!apiKey || apiKey !== process.env.SUITE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      memberships: {
        select: { orgId: true, role: true },
        take: 1,
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    orgId: user.memberships[0]?.orgId ?? null,
  })
}
