import { NextRequest, NextResponse } from "next/server"
import { getRemainingCredits } from "@/lib/entitlements"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("authorization")?.replace("Bearer ", "")

  if (!apiKey || apiKey !== process.env.SUITE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orgId = req.nextUrl.searchParams.get("orgId")
  if (!orgId) {
    return NextResponse.json({ error: "orgId is required" }, { status: 400 })
  }

  const org = await prisma.organization.findUnique({ where: { id: orgId } })
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 })
  }

  const remaining = await getRemainingCredits(orgId)

  return NextResponse.json({
    credits: remaining,
    allowed: remaining > 0,
  })
}
