"use client"

import { useState } from "react"
import { Button } from "@/components/app/button"
import type { SuiteId } from "@/lib/suites"

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
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-foreground">
        Kalit {suiteName}
      </h2>
      <p className="max-w-md text-sm text-muted-fg">
        Launch the full {suiteName} suite in a dedicated workspace.
      </p>
      <Button
        variant="primary"
        size="lg"
        loading={loading}
        onClick={handleLaunch}
      >
        {loading ? "Launching..." : `Open Kalit ${suiteName}`}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
