import { RadialGradient } from "@/components/svg/radial-gradient"
import { LinearGradient } from "../../svg/linear-gradient"

export const Defs = () => {
  return (
    <svg aria-hidden="true" width="0" height="0">
      <defs>
        <LinearGradient
          id="button-stroke"
          x1={47.0547}
          y1={7.23981}
          x2={5.28623}
          y2={40.1964}
          gradientUnits="userSpaceOnUse"
        />
        <RadialGradient
          id="hero_line_1"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(615.873 112.067) rotate(158.849) scale(586.974 679.116)"
          stops={[
            { offset: 0, color: "var(--text)" },
            { offset: 0.15, color: "var(--color-1)" },
            { offset: 0.3, color: "var(--color-1)" },
            { offset: 0.5, color: "var(--color-2)" },
            { offset: 0.75, color: "var(--color-3)" },
            { offset: 1, color: "var(--color-4)" }
          ]}
        />
        <RadialGradient
          id="hero_line_2"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(567.49 -108 -212.587 437.783 6.4803 108.88)"
          stops={[
            { offset: 0, color: "var(--text)" },
            { offset: 0.25, color: "var(--color-4)" },
            { offset: 0.5, color: "var(--color-3)" },
            { offset: 0.75, color: "var(--color-2)" },
            { offset: 1, color: "var(--color-1)" }
          ]}
        />
        <RadialGradient
          id="hero_line_3"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-473.27 -152 323.364 -304.629 549.713 180.72)"
          stops={[
            { offset: 0, color: "var(--text)" },
            { offset: 0.25, color: "var(--color-2)" },
            { offset: 0.5, color: "var(--color-1)" },
            { offset: 0.75, color: "var(--color-3)" },
            { offset: 1, color: "var(--color-4)" }
          ]}
        />
        <RadialGradient
          id="hero_line_4"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(600.49 138 -402.225 314.22 6.48025 72.6799)"
          stops={[
            { offset: 0, color: "var(--text)" },
            { offset: 0.25, color: "var(--color-3)" },
            { offset: 0.5, color: "var(--color-2)" },
            { offset: 0.75, color: "var(--color-1)" },
            { offset: 1, color: "var(--color-4)" }
          ]}
        />
      </defs>
    </svg>
  )
}
