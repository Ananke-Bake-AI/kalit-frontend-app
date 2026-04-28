"use client"

import { Lines } from "@/app/[locale]/(home)/(components)/hero/lines"
import { HeroPromptChat } from "@/components/hero-prompt-chat"
import { Icon } from "@/components/icon"
import { useAnimatedPlaceholder } from "@/hooks/use-animated-placeholder"
import { localePath } from "@/lib/i18n"
import { createStudioSession, studioLoginHref } from "@/lib/studio-redirect"
import { useI18n } from "@/stores/i18n"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import s from "./suite-landing-hero.module.scss"

const BUTTONS = [
  { icon: "hugeicons:user-multiple-02", labelKey: "suiteLanding.searchTopic1" },
  { icon: "hugeicons:chart-evaluation", labelKey: "suiteLanding.searchTopic2" },
  { icon: "hugeicons:target-02", labelKey: "suiteLanding.searchTopic3" },
  { icon: "hugeicons:dollar-circle", labelKey: "suiteLanding.searchTopic4" },
  { icon: "hugeicons:rocket-01", labelKey: "suiteLanding.searchTopic5" }
] as const

export interface SearchHeroPromptProps {
  suiteAppUrl?: string
}

export function SearchHeroPrompt(_props: SearchHeroPromptProps) {
  const router = useRouter()
  const { status } = useSession()
  const { locale, t } = useI18n()
  const [promptValue, setPromptValue] = useState("")
  const promptRef = useRef<HTMLTextAreaElement | null>(null)

  const placeholders = [
    t("suiteLanding.searchPlaceholder1"),
    t("suiteLanding.searchPlaceholder2"),
    t("suiteLanding.searchPlaceholder3"),
    t("suiteLanding.searchPlaceholder4")
  ]

  const { handleFocus, handleBlur } = useAnimatedPlaceholder(promptRef, {
    phrases: placeholders,
    focusedPlaceholder: t("suiteLanding.searchPlaceholder")
  })

  const handleSubmit = useCallback(async () => {
    const trimmed = promptValue.trim()
    if (!trimmed) return
    if (status === "loading") return
    if (status === "authenticated") {
      const url = await createStudioSession(trimmed, "search")
      router.push(localePath(url, locale))
      return
    }
    router.push(localePath(studioLoginHref(trimmed, "search"), locale))
  }, [promptValue, router, status, locale])

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
        placeholder={t("suiteLanding.searchPlaceholder")}
        onChange={(e) => setPromptValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onSend={handleSubmit}
        sendLabel={t("suiteLanding.searchSendLabel")}
        sendLogoId="search"
        showBlurBackground={false}
      >
        <Lines gradient="color-5" />
      </HeroPromptChat>
      <div className={s.buttons}>
        {BUTTONS.map((button) => (
          <button key={button.labelKey} type="button" className={s.btn}>
            <Icon icon={button.icon} />
            {t(button.labelKey)}
          </button>
        ))}
      </div>
      <p className={s.mention}>{t("suiteLanding.searchMention")}</p>
    </>
  )
}
