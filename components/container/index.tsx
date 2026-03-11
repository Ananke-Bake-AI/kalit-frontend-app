"use client"

import clsx from "clsx"
import { forwardRef, HTMLAttributes, ReactNode } from "react"
import s from "./container.module.scss"

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, ...props }, ref) => {
    return (
      <div {...props} className={clsx(s.container, props.className)} ref={ref}>
        {children}
      </div>
    )
  }
)

Container.displayName = "Container"
