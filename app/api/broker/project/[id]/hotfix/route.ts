import { NextRequest, NextResponse } from "next/server"
import { authAndToken, brokerProxy } from "@/lib/broker-server"

/** GET: fetch hotfix info (cost, quota) */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await authAndToken()
  if ("error" in result) return result.error

  const res = await brokerProxy(`project/${id}/hotfix`, result.token)
  const body = (await res.json().catch(() => ({}))) as {
    success?: boolean
    data?: unknown
    error?: string
  }
  // Broker wraps its payload as { success, data: {...fields} }. Unwrap once so
  // clients see a single-level { success, data: {...fields} }.
  const payload = body && typeof body === "object" && "data" in body ? body.data : body
  return NextResponse.json(
    res.ok ? { success: true, data: payload } : { success: false, error: body?.error || "Failed" },
    { status: res.status },
  )
}

/** POST: submit a hotfix */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await authAndToken()
  if ("error" in result) return result.error

  const reqBody = await request.text()
  const res = await brokerProxy(`project/${id}/hotfix`, result.token, {
    method: "POST",
    body: reqBody,
    headers: { "Content-Type": "application/json" },
  })
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
