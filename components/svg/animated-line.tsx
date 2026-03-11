"use client"

import { forwardRef, useEffect, useState } from "react"
import { Line } from "./line"

interface AnimatedLineProps {
  d: string
  viewBox: string
  className?: string
  stroke?: string
  strokeWidth?: number
}

export const AnimatedLine = forwardRef<SVGPathElement, AnimatedLineProps>(function AnimatedLine(
  { d, viewBox, className, stroke = "currentColor", strokeWidth },
  ref
) {
  const [length, setLength] = useState(0)

  useEffect(() => {
    const path = (ref as React.RefObject<SVGPathElement>)?.current
    if (!path) return

    const totalLength = path.getTotalLength()
    setLength(totalLength)
  }, [d])

  return (
    <Line viewBox={viewBox} className={className}>
      <path
        ref={ref}
        d={d}
        stroke={stroke}
        fill="none"
        strokeWidth={strokeWidth}
        data-length={length}
        style={{
          strokeDasharray: length,
          strokeDashoffset: 0
        }}
      />
    </Line>
  )
})
