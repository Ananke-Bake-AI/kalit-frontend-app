import type { ReactNode } from "react"
import s from "./empty-placeholder.module.scss"

interface EmptyPlaceholderProps {
  title: string
  description: string
  icon?: ReactNode
  footer?: ReactNode
}

export function EmptyPlaceholder({ title, description, icon, footer }: EmptyPlaceholderProps) {
  return (
    <div className={s.root}>
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
      {footer}
    </div>
  )
}
