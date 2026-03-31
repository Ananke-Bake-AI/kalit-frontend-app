"use client"

import { Direction } from "@/types/Direction"
import { useGSAP } from "@gsap/react"
import clsx from "clsx"
import { gsap } from "gsap"
import { HTMLAttributes, ReactNode, useRef } from "react"
import s from "./marquee.module.scss"

interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  factor?: number
  direction?: Direction
}

export const Marquee = ({
  children,
  factor = 2,
  direction = "left",
  ...props
}: MarqueeProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<GSAPTween | null>(null)

  const options = {
    repeat: -1,
    ease: "none",
    scrollTrigger: {
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play pause resume pause"
    }
  }

  useGSAP(() => {
    if (direction === "right" || direction === "left") {
      const width = contentRef.current?.offsetWidth || 2
      const duration = width * factor * 0.004

      animationRef.current = gsap.fromTo(
        contentRef.current,
        { x: "0%" },
        {
          x: direction == "left" ? "-50%" : "50%",
          duration,
          ...options
        }
      )
    } else {
      const height = contentRef.current?.offsetHeight || 0
      const duration = height * factor * 0.02

      animationRef.current = gsap.fromTo(
        contentRef.current,
        { y: "0%" },
        {
          y: direction == "up" ? "-50%" : "50%",
          duration,
          ...options
        }
      )
    }
  })

  const handleMouseEnter = () => {
    if (animationRef.current) {
      gsap.to(animationRef.current, { timeScale: 0.25, duration: 0.5 })
    }
  }

  const handleMouseLeave = () => {
    if (animationRef.current) {
      gsap.to(animationRef.current, { timeScale: 1, duration: 1 })
    }
  }

  return (
    <div
      {...props}
      ref={containerRef}
      className={clsx(s.marquee, props.className, {
        [s.right]: direction === "right",
        [s.left]: direction === "left",
        [s.up]: direction === "up",
        [s.down]: direction === "down"
      })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={contentRef} className={s.content}>
        {children}
        {children}
      </div>
    </div>
  )
}
