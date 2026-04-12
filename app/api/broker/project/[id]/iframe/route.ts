import { NextRequest } from "next/server"
import { authAndToken } from "@/lib/broker-server"

const BROKER_URL = () =>
  (process.env.BROKER_URL || "http://localhost:9000").replace(/\/+$/, "")

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await authAndToken()
  if ("error" in result) return result.error

  // The broker may respond with a 302 redirect to the deployed subdomain URL.
  // We intentionally do NOT follow the redirect so the browser receives it
  // directly and the iframe loads the real deployed site — relative asset
  // paths resolve against the deployed origin rather than kalit.ai.
  const res = await fetch(`${BROKER_URL()}/api/flow/project/${id}/iframe`, {
    method: "GET",
    headers: { Authorization: `Bearer ${result.token}` },
    redirect: "manual",
  })

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location") || ""
    return new Response(null, {
      status: 302,
      headers: { Location: location, "Cache-Control": "no-cache" },
    })
  }

  if (!res.ok) {
    return new Response("Not found", { status: res.status })
  }

  const html = await res.text()
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}
