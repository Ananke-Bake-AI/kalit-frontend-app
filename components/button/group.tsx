import clsx from "clsx"
import s from "./button.module.scss"

interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export const ButtonGroup = ({ children, className }: ButtonGroupProps) => {
  return <div className={clsx(s.group, className)}>{children}</div>
}
