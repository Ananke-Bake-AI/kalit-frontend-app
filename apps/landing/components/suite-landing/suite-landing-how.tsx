import { Container } from "@/components/container"
import { Heading } from "@/components/heading"
import { Powered } from "@/components/models/powered"
import { AnimatedLine } from "@/components/svg/animated-line"
import type { Tag } from "@/types/Tag"
import { type ReactNode } from "react"
import s from "./suite-landing-how.module.scss"
import { SuiteLandingStep, type SuiteLandingStepProps } from "./suite-landing-step"

export type SuiteLandingAccent = 1 | 2 | 3 | 4

export interface SuiteLandingHowProps {
  accent: SuiteLandingAccent
  lineStroke: string
  lineD: string
  lineViewBox: string
  headingSubtitle: string
  headingParagraph: string
  headingTitle: ReactNode
  steps: [SuiteLandingStepProps, SuiteLandingStepProps, SuiteLandingStepProps]
  poweredTitle: string
  headingTag?: Tag
}

export function SuiteLandingHow({
  accent,
  lineStroke,
  lineD,
  lineViewBox,
  headingSubtitle,
  headingParagraph,
  headingTitle,
  steps,
  poweredTitle,
  headingTag
}: SuiteLandingHowProps) {
  return (
    <div className={s.how} data-accent={accent}>
      <Container>
        <Heading className={s.heading} tag={headingTag} subtitle={headingSubtitle} paragraph={headingParagraph}>
          {headingTitle}
        </Heading>
        <div className={s.steps}>
          {steps.map((step) => (
            <SuiteLandingStep key={step.number} {...step} />
          ))}
          <AnimatedLine d={lineD} viewBox={lineViewBox} stroke={lineStroke} className={s.line} />
        </div>
        <Powered title={poweredTitle} className={s.powered} />
      </Container>
    </div>
  )
}

SuiteLandingHow.displayName = "SuiteLandingHow"
