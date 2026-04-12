import { NextRequest, NextResponse } from "next/server"
import { authAndToken, brokerProxy } from "@/lib/broker-server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await authAndToken()
  if ("error" in result) return result.error

  const res = await brokerProxy(`project/${id}/status`, result.token)
  const body = (await res.json().catch(() => ({}))) as {
    success?: boolean
    data?: unknown
    error?: string
  }

  // Broker wraps its payload as { success, data: {...fields} }. Unwrap once so
  // clients see a single-level { success, data: {...fields} } (otherwise status
  // reads undefined and completed projects look stuck in polling).
  const payload = body && typeof body === "object" && "data" in body ? body.data : body

  return NextResponse.json(
    res.ok ? { success: true, data: payload } : { success: false, error: body?.error || "Failed" },
    { status: res.status },
  )
}
