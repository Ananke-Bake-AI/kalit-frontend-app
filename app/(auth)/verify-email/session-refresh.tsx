"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export function SessionRefresh() {
  const { update } = useSession()

  useEffect(() => {
    update({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
