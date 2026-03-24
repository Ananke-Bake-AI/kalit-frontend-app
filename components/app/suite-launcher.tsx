"use client"

import { Button } from "@/components/button"
import type { SuiteId } from "@/lib/suites"
import { useState } from "react"
import s from "./suite-launcher.module.scss"

interface SuiteLauncherProps {
  suiteId: SuiteId
  suiteName: string
}

export function SuiteLauncher({ suiteId, suiteName }: SuiteLauncherProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLaunch() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/suite/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suiteId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to generate token")
        return
      }

      window.location.href = data.redirectUrl
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.root}>
      <h2 className={s.title}>Kalit {suiteName}</h2>
      <p className={s.description}>
        Launch the full {suiteName} suite in a dedicated workspace.
      </p>
      <Button
        type="button"
        variant="primary"
        disabled={loading}
        onClick={handleLaunch}
      >
        {loading ? "Launching..." : `Open Kalit ${suiteName}`}
      </Button>
      {error ? <p className={s.error}>{error}</p> : null}
    </div>
  )
}
