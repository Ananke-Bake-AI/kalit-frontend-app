"use client"

import { Color4Bg } from "@/components/color4bg"
import { Container } from "@/components/container"
import { Icon } from "@/components/icon"
import { Logo } from "@/components/logo"
import { Models } from "@/components/models"
import { Subtitle } from "@/components/subtitle"
import { useGSAP } from "@gsap/react"
import clsx from "clsx"
import gsap from "gsap"
import { localePath } from "@/lib/i18n"
import { useI18n } from "@/stores/i18n"
import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import s from "./prompt.module.scss"

const COLORS = ["#91E500", "#8200DF", "#12BCFF", "#91E500", "#2F44FF", "#8200DF", "#91E500"]

const PLACEHOLDERS = [
  "Create a launch page for my AI startup with pricing tiers...",
  "Build me a SaaS app with auth, billing, and a dashboard...",
  "Generate a portfolio site with case studies and contact form...",
  "Scan my web app for security vulnerabilities before launch..."
]

type SuiteMatch = {
  id: "flow" | "pentest"
  name: string
  description: string
  color: string
  icon: string
  logo: "flow" | "pentest"
}

const SUITE_MATCHES: SuiteMatch[] = [
  {
    id: "flow",
    name: "Flow",
    description: "From prompt to a live launch page or a full app — design, copy, frontend, backend, and deploy included.",
    color: "#2F44FF",
    icon: "hugeicons:paint-bucket",
    logo: "flow"
  },
  {
    id: "pentest",
    name: "Pentest",
    description: "AI scans your authorized app, API, or staging target before traffic and surfaces actionable findings.",
    color: "#91E500",
    icon: "hugeicons:shield-01",
    logo: "pentest"
  }
]

const SUITE_KEYWORDS: Record<string, "flow" | "pentest"> = {
  // Flow — pages and apps
  app: "flow",
  application: "flow",
  saas: "flow",
  dashboard: "flow",
  backend: "flow",
  api: "flow",
  database: "flow",
  fullstack: "flow",
  "full-stack": "flow",
  mobile: "flow",
  ios: "flow",
  android: "flow",
  deploy: "flow",
  software: "flow",
  platform: "flow",
  crud: "flow",
  auth: "flow",
  authentication: "flow",
  billing: "flow",
  stripe: "flow",
  landing: "flow",
  website: "flow",
  "landing page": "flow",
  page: "flow",
  portfolio: "flow",
  blog: "flow",
  site: "flow",
  homepage: "flow",
  design: "flow",
  restaurant: "flow",
  agency: "flow",
  // Pentest
  security: "pentest",
  pentest: "pentest",
  vulnerability: "pentest",
  vulnerabilities: "pentest",
  scan: "pentest",
  hack: "pentest",
  secure: "pentest",
  audit: "pentest",
  penetration: "pentest",
  owasp: "pentest",
  xss: "pentest",
  injection: "pentest",
  firewall: "pentest"
}

function detectSuite(input: string): SuiteMatch | null {
  const lower = input.toLowerCase()
  const scores: Record<"flow" | "pentest", number> = { flow: 0, pentest: 0 }

  for (const [keyword, suiteId] of Object.entries(SUITE_KEYWORDS)) {
    if (lower.includes(keyword)) {
      scores[suiteId] += keyword.split(" ").length
    }
  }

  const best = (Object.entries(scores) as ["flow" | "pentest", number][]).sort((a, b) => b[1] - a[1])[0]
  if (best[1] === 0) return null

  return SUITE_MATCHES.find((s) => s.id === best[0]) || null
}

export const Prompt = () => {
  const router = useRouter()
  const { locale } = useI18n()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [value, setValue] = useState("")
  const [matchedSuite, setMatchedSuite] = useState<SuiteMatch | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  useGSAP(() => {
    if (textareaRef.current) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })

      PLACEHOLDERS.forEach((phrase) => {
        const chars = phrase.split("")

        tl.call(() => {
          if (textareaRef.current) {
            textareaRef.current.placeholder = "|"
          }
        })

        chars.forEach((_, index) => {
          tl.call(
            () => {
              if (!textareaRef.current) return
              const text = phrase.slice(0, index + 1)
              textareaRef.current.placeholder = `${text}|`
            },
            [],
            "+=0.04"
          )
        })

        tl.to({}, { duration: 1 })

        chars.forEach((_, index) => {
          tl.call(
            () => {
              if (!textareaRef.current) return
              const remaining = phrase.length - index - 1
              const text = phrase.slice(0, remaining)
              textareaRef.current.placeholder = text ? `${text}|` : "|"
            },
            [],
            "+=0.02"
          )
        })
      })

      timelineRef.current = tl

      return () => {
        tl.kill()
      }
    }
  }, [])

  const handleFocus = () => {
    if (timelineRef.current) {
      timelineRef.current.pause()
    }
    if (textareaRef.current) {
      textareaRef.current.placeholder = "Describe what you want to build..."
    }
  }

  const handleBlur = () => {
    if (!value.trim() && timelineRef.current) {
      timelineRef.current.play()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (matchedSuite) setMatchedSuite(null)
    if (isThinking) setIsThinking(false)
  }

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) return

    setIsThinking(true)
    setMatchedSuite(null)

    setTimeout(() => {
      const suite = detectSuite(trimmed)
      setIsThinking(false)
      if (suite) {
        setMatchedSuite(suite)
      } else {
        setMatchedSuite(SUITE_MATCHES[0])
      }
    }, 800)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuiteClick = (suiteId: string) => {
    const prompt = encodeURIComponent(value.trim())
    router.push(localePath(`/${suiteId}?prompt=${prompt}`, locale))
  }

  const handleQuickSelect = (suite: SuiteMatch, prompt: string) => {
    setValue(prompt)
    if (timelineRef.current) {
      timelineRef.current.pause()
    }
    setIsThinking(true)
    setTimeout(() => {
      setIsThinking(false)
      setMatchedSuite(suite)
    }, 600)
  }

  return (
    <section className={s.prompt}>
      <Container className={s.container}>
        <Subtitle>Tell us what you need</Subtitle>

        <h1 className={s.title}>
          <span className={s.line1}>One prompt.</span>
          <span className={s.line2}>The right AI suite.</span>
        </h1>

        <p className={s.subtitle}>
          Describe your project, Kalit finds the best suite and gets to work.
        </p>

        <div className={s.formWrapper}>
          <div className={s.form}>
            <div className={s.textarea}>
              <div className={s.inputRow}>
                <Icon icon="hugeicons:message-edit-01" className={s.inputIcon} />
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you want to build..."
                  rows={3}
                />
              </div>
              <div className={s.bottom}>
                <div className={s.bottomLeft}>
                  <button className={s.mic} type="button">
                    <Icon icon="hugeicons:mic-02" />
                  </button>
                </div>
                <button className={s.send} type="button" onClick={handleSubmit} disabled={!value.trim()}>
                  <Logo id="kalit" />
                  <span>Find my suite</span>
                </button>
              </div>
            </div>

            {isThinking && (
              <div className={s.thinking}>
                <div className={s.thinkingDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <span>Analyzing your request...</span>
              </div>
            )}

            {matchedSuite && !isThinking && (
              <div className={s.result} style={{ "--suite-color": matchedSuite.color } as React.CSSProperties}>
                <div className={s.resultHeader}>
                  <Icon icon="hugeicons:sparkles" className={s.resultSpark} />
                  <span>Recommended suite</span>
                </div>
                <button className={s.resultCard} type="button" onClick={() => handleSuiteClick(matchedSuite.id)}>
                  <div className={s.resultIcon}>
                    <Logo id={matchedSuite.logo} />
                  </div>
                  <div className={s.resultInfo}>
                    <strong>Kalit {matchedSuite.name}</strong>
                    <span>{matchedSuite.description}</span>
                  </div>
                  <div className={s.resultArrow}>
                    <Icon icon="hugeicons:arrow-right-02" />
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className={s.quickSuites}>
            {SUITE_MATCHES.map((suite) => (
              <button
                key={suite.id}
                type="button"
                className={s.quickSuite}
                style={{ "--suite-color": suite.color } as React.CSSProperties}
                onClick={() =>
                  handleQuickSelect(
                    suite,
                    suite.id === "flow"
                      ? "Build me a SaaS launch page with pricing, FAQ, and signup"
                      : "Scan my web application for vulnerabilities before launch"
                  )
                }
              >
                <span className={s.quickIcon}>
                  <Logo id={suite.logo} />
                </span>
                <span>{suite.name}</span>
              </button>
            ))}
          </div>

        </div>

        <div className={s.ai} data-reveal>
          <h2>Powered by leading AI models, orchestrated by Kalit</h2>
          <Models />
        </div>
      </Container>
      <div className={s.bg}>
        <Color4Bg className={s.gradient} style="blur-gradient" colors={COLORS} seed={1000} loop={true} noise={0} />
      </div>
    </section>
  )
}
