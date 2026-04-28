import { NextRequest } from "next/server"

// Edge runtime so the proxy streams natively + cold-starts in ~50ms instead
// of 500-1000ms on Node lambdas. Find-assets best-asset thumbnails were
// taking 1-3s to render on the studio sidebar because the previous impl
// did `await resp.arrayBuffer()` (full body buffer in lambda memory before
// emitting the response) and shipped no s-maxage so Vercel CDN never
// cached at the edge — every browser request re-invoked the function.
export const runtime = "edge"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const findAssetsUrl = process.env.FIND_ASSETS_URL || "https://find-assets.xyz"
  const targetUrl = `${findAssetsUrl}/${path.join("/")}`

  const headers: Record<string, string> = {}
  const apiKey = process.env.FIND_ASSETS_API_KEY || ""
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
  // Forward conditional fetch headers so find-assets can short-circuit
  // with a 304 when the browser already has the image cached. Without
  // these the upstream always re-sends the full body even on cache hit.
  const ifNoneMatch = request.headers.get("if-none-match")
  if (ifNoneMatch) headers["If-None-Match"] = ifNoneMatch
  const ifModifiedSince = request.headers.get("if-modified-since")
  if (ifModifiedSince) headers["If-Modified-Since"] = ifModifiedSince

  const resp = await fetch(targetUrl, { headers })
  if (resp.status === 304) {
    return new Response(null, { status: 304 })
  }
  if (!resp.ok) {
    return new Response("Not found", { status: resp.status })
  }

  // Stream the body straight through — no arrayBuffer() buffering. The
  // browser starts decoding the JPEG header bytes the moment they arrive
  // upstream, instead of waiting for the full file to land in lambda
  // memory.
  const respHeaders: Record<string, string> = {
    "Content-Type": resp.headers.get("Content-Type") || "application/octet-stream",
    // Browser caches for 1h, Vercel edge for 30d. Find-assets paths are
    // immutable per URL (the path includes a research-id + filename),
    // so the immutable directive is honest.
    "Cache-Control": "public, max-age=3600, s-maxage=2592000, immutable",
  }
  const etag = resp.headers.get("ETag")
  if (etag) respHeaders["ETag"] = etag
  const lastModified = resp.headers.get("Last-Modified")
  if (lastModified) respHeaders["Last-Modified"] = lastModified
  const contentLength = resp.headers.get("Content-Length")
  if (contentLength) respHeaders["Content-Length"] = contentLength

  return new Response(resp.body, {
    status: resp.status,
    headers: respHeaders,
  })
}
