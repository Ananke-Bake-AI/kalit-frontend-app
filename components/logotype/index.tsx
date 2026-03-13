import clsx from "clsx"
import { Logo } from "../logo"
import s from "./logotype.module.scss"

type LogotypeProps = {
  className?: string
}

export const Logotype = ({ className }: LogotypeProps) => {
  return (
    <div className={clsx(s.logo, className)}>
      <Logo id="kalit" />
      <span>kalit</span>
    </div>
  )
}
