"use client"

import { useLoading } from "@/components/loading"
import { Tag } from "@/types/Tag"
import { useGSAP } from "@gsap/react"
import clsx from "clsx"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { useRef } from "react"
import s from "./reveal-text.module.scss"

interface RevealTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode
  className?: string
  tag?: Tag
  animate?: boolean
  start?: string
  onComplete?: () => void
}

export const RevealText = ({
  children,
  className,
  tag = "div",
  animate = true,
  start = "50% bottom",
  onComplete,
  ...props
}: RevealTextProps) => {
  const Element = tag
  const elementRef = useRef<HTMLDivElement>(null)
  const { isLoading } = useLoading()

  useGSAP(() => {
    if (isLoading) return

    const svg = elementRef.current?.querySelectorAll("svg")
    const split = new SplitText(elementRef.current, {
      type: "words",
      wordsClass: s.word,
      smartWrap: true
    })

    const tl = gsap.timeline({
      defaults: { ease: "power2" },
      scrollTrigger: {
        trigger: elementRef.current,
        start
      }
    })

    if (animate) {
      tl.from(split.words, {
        yPercent: -50,
        opacity: 0,
        stagger: 0.075,
        duration: 1,
        onComplete: () => {
          onComplete?.()
        }
      })

      if (svg && svg.length > 0) {
        tl.from(
          svg,
          {
            rotate: -60,
            opacity: 0,
            duration: 2,
            stagger: 0.2
          },
          "<"
        )
      }
    }
  }, [isLoading, animate])

  return (
    <Element ref={elementRef} className={clsx(s.reveal, className)} {...props}>
      {children}
    </Element>
  )
}
