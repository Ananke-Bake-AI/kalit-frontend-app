"use client"

import { type DependencyList, type RefObject, useEffect, useState } from "react"

export function useTotalLength(ref: RefObject<SVGPathElement | null>, deps: DependencyList = []) {
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    try {
      const totalLength = ref.current.getTotalLength()

      if (!Number.isNaN(totalLength)) {
        setLength(totalLength)
      }
    } catch {
      // ignore invalid path values
    }
  }, [ref, ...deps])

  return length
}
