import { NextRequest, NextResponse } from "next/server"
import { authAndToken, brokerProxy } from "@/lib/broker-server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await authAndToken()
  if ("error" in result) return result.error

  const res = await brokerProxy(`marketing/workspace/${id}/status`, result.token)
  const body = (await res.json().catch(() => ({}))) as {
    success?: boolean
    data?: unknown
    error?: string
  }

  const payload = body && typeof body === "object" && "data" in body ? body.data : body

  return NextResponse.json(
    res.ok ? { success: true, data: payload } : { success: false, error: body?.error || "Failed" },
    { status: res.status },
  )
}
