"use client"

import { HeroPromptChat } from "@/components/hero-prompt-chat"
import { Icon } from "@/components/icon"
import { useAnimatedPlaceholder } from "@/hooks/use-animated-placeholder"
import { suiteEntryUrl, suiteMarketingLoginHref } from "@/lib/suite-marketing-entry"
import { MARKETING_MARKETING_PATH } from "@/lib/suite-marketing-paths"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import s from "./suite-landing-hero.module.scss"

const PLACEHOLDERS = [
  "Summer sale campaign for my e-commerce store on Meta and Google...",
  "LinkedIn lead-gen ads for a B2B SaaS with a free trial CTA...",
  "Retargeting funnel for cart abandoners across Instagram and TikTok...",
  "Launch a product teaser video campaign on multiple platforms..."
]

const BUTTONS = [
  { icon: "hugeicons:user-ai", label: "Lead generation" },
  { icon: "hugeicons:chart-average", label: "Traffic" },
  { icon: "hugeicons:chart-breakout-square", label: "Conversion" },
  { icon: "hugeicons:chart-relationship", label: "Retargeting" }
]

export interface MarketingHeroPromptProps {
  suiteAppUrl: string
  marketingPath?: string
}

export function MarketingHeroPrompt({
  suiteAppUrl,
  marketingPath = MARKETING_MARKETING_PATH
}: MarketingHeroPromptProps) {
  const router = useRouter()
  const { status } = useSession()
  const [promptValue, setPromptValue] = useState("")
  const promptRef = useRef<HTMLTextAreaElement | null>(null)
  const { handleFocus, handleBlur } = useAnimatedPlaceholder(promptRef, {
    phrases: PLACEHOLDERS,
    focusedPlaceholder: "What would you like to create today?"
  })

  const handleSubmit = useCallback(() => {
    const trimmed = promptValue.trim()
    if (!trimmed) return
    if (status === "loading") return
    if (status === "authenticated") {
      window.location.assign(suiteEntryUrl(suiteAppUrl, { prompt: trimmed }))
      return
    }
    router.push(suiteMarketingLoginHref(marketingPath, { prompt: trimmed }))
  }, [marketingPath, promptValue, router, status, suiteAppUrl])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <>
      <HeroPromptChat
        layout="flush"
        textareaRef={promptRef}
        value={promptValue}
        placeholder="What would you like to create today?"
        onChange={(e) => setPromptValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onSend={handleSubmit}
        sendLabel="Create campaign"
        sendLogoId="marketing"
        showBlurBackground={false}
      />
      <div className={s.buttons}>
        {BUTTONS.map((button) => (
          <button key={button.label} type="button" className={s.btn}>
            <Icon icon={button.icon} />
            {button.label}
          </button>
        ))}
      </div>
      <p className={s.mention}>
        Describe your product. Kalit Marketing generates visuals, copy, targeting, and launches optimized campaigns
        automatically. No setup. Just results.
      </p>
    </>
  )
}
