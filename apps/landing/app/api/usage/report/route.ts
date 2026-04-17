import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRemainingCredits } from "@/lib/entitlements"

export async function POST(req: NextRequest) {
  try {
    // Validate the suite API key
    const authHeader = req.headers.get("authorization")
    const expectedKey = process.env.SUITE_API_KEY

    if (!expectedKey) {
      console.error("[usage/report] SUITE_API_KEY is not configured")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      )
    }

    const apiKey = authHeader.slice(7)
    if (apiKey !== expectedKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { userId, orgId, suiteId, action, credits, metadata } = body

    // Validate required fields
    if (!userId || !orgId || !suiteId || !action || typeof credits !== "number") {
      return NextResponse.json(
        {
          error: "Missing required fields: userId, orgId, suiteId, action, credits",
        },
        { status: 400 }
      )
    }

    if (credits <= 0) {
      return NextResponse.json(
        { error: "Credits must be a positive number" },
        { status: 400 }
      )
    }

    // Verify the org exists
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    })

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    // Create usage record
    await prisma.usageRecord.create({
      data: {
        orgId,
        suiteId,
        action,
        credits,
        metadata: metadata || undefined,
      },
    })

    // Get remaining credits after the debit
    const remainingCredits = await getRemainingCredits(orgId)

    return NextResponse.json({ success: true, remainingCredits })
  } catch (error) {
    console.error("[usage/report] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
