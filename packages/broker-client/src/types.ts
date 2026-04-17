/**
 * Shared types for the Kalit broker API. These are HTTP-surface contracts only
 * — anything that talks to /api/broker/* (web) or the broker directly (desktop)
 * can import these. No environment-specific types.
 */

export interface BrokerTokenPayload {
  userId: string
  orgId: string | null
  email: string | null
  isAdmin: boolean
  iat: number
  exp: number
}

export interface BrokerTokenResponse {
  token: string
  expiresAt: number
}

export interface BrokerUsageResponse {
  credits: {
    remaining: number
    total: number
  }
  entitlements: Array<{
    suite: string
    expiresAt: number | null
  }>
}
