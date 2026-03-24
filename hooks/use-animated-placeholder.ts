import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { type RefObject, useCallback, useRef } from "react"

export interface UseAnimatedPlaceholderOptions {
  phrases: readonly string[]
  focusedPlaceholder: string
  typeCharDelay?: number
  eraseCharDelay?: number
  holdDuration?: number
  repeatDelay?: number
}

export interface UseAnimatedPlaceholderResult {
  timelineRef: RefObject<gsap.core.Timeline | null>
  handleFocus: () => void
  handleBlur: () => void
}

export function useAnimatedPlaceholder(
  inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
  {
    phrases,
    focusedPlaceholder,
    typeCharDelay = 0.04,
    eraseCharDelay = 0.02,
    holdDuration = 1,
    repeatDelay = 1
  }: UseAnimatedPlaceholderOptions
): UseAnimatedPlaceholderResult {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const phrasesKey = phrases.join("\0")

  useGSAP(
    () => {
      const el = inputRef.current
      if (!el) return

      const tl = gsap.timeline({ repeat: -1, repeatDelay })

      phrases.forEach((phrase) => {
        const chars = phrase.split("")

        tl.call(() => {
          if (inputRef.current) inputRef.current.placeholder = "|"
        })

        chars.forEach((_, index) => {
          tl.call(
            () => {
              if (!inputRef.current) return
              const text = phrase.slice(0, index + 1)
              inputRef.current.placeholder = `${text}|`
            },
            [],
            `+=${typeCharDelay}`
          )
        })

        tl.to({}, { duration: holdDuration })

        chars.forEach((_, index) => {
          tl.call(
            () => {
              if (!inputRef.current) return
              const remaining = phrase.length - index - 1
              const text = phrase.slice(0, remaining)
              inputRef.current.placeholder = text ? `${text} |` : "|"
            },
            [],
            `+=${eraseCharDelay}`
          )
        })
      })

      timelineRef.current = tl

      return () => {
        tl.kill()
        timelineRef.current = null
      }
    },
    {
      dependencies: [phrasesKey, typeCharDelay, eraseCharDelay, holdDuration, repeatDelay]
    }
  )

  const handleFocus = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    timelineRef.current?.pause()
    el.placeholder = focusedPlaceholder
  }, [focusedPlaceholder])

  const handleBlur = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    if (!el.value.trim()) timelineRef.current?.play()
  }, [])

  return { timelineRef, handleFocus, handleBlur }
}
