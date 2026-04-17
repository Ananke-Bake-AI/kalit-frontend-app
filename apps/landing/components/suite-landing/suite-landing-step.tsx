import { Icon } from "@/components/icon"
import clsx from "clsx"
import s from "./suite-landing-how.module.scss"

export interface SuiteLandingStepProps {
  icon: string
  number: 1 | 2 | 3
  title: string
  description: string
}

export function SuiteLandingStep({ icon, number, title, description }: SuiteLandingStepProps) {
  return (
    <div className={clsx(s.step, s[`step${number}`])} data-reveal>
      <div className={s.top}>
        <Icon icon={icon} />
        <div className={s.number}>0{number}</div>
      </div>
      <div className={s.content}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}
