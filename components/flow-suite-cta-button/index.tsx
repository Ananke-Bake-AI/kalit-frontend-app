"use client"

import { Button } from "@/components/button"
import { FLOW_MARKETING_PATH } from "@/lib/flow-suite-entry"
import { suiteMarketingLoginHref } from "@/lib/suite-marketing-entry"
import { useSession } from "next-auth/react"
import type { ReactNode } from "react"

export interface FlowSuiteCtaButtonProps {
  suiteAppUrl: string
  /** Page marketing pour le retour après login (ex. `/flow`, `/pentest`). */
  marketingPath?: string
  className?: string
  circle?: boolean
  variant?: "primary" | "secondary" | "tertiary"
  children: ReactNode
}

export function FlowSuiteCtaButton({
  suiteAppUrl,
  marketingPath = FLOW_MARKETING_PATH,
  className,
  circle,
  variant = "primary",
  children
}: FlowSuiteCtaButtonProps) {
  const { status } = useSession()

  if (status === "loading") {
    return (
      <Button className={className} circle={circle} variant={variant} disabled>
        {children}
      </Button>
    )
  }

  if (status === "authenticated") {
    return (
      <Button
        className={className}
        circle={circle}
        variant={variant}
        type="button"
        onClick={() => {
          window.location.assign(suiteAppUrl.replace(/\/$/, ""))
        }}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
      className={className}
      circle={circle}
      variant={variant}
      href={suiteMarketingLoginHref(marketingPath)}
    >
      {children}
    </Button>
  )
}

FlowSuiteCtaButton.displayName = "FlowSuiteCtaButton"
