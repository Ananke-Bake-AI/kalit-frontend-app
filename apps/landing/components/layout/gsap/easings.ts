export const easings = {
  smoothOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  smoothInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  expoOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  expoInOut: "cubic-bezier(0.87, 0, 0.13, 1)",
  snapOut: "cubic-bezier(0.33, 1, 0.68, 1)",
  quartOut: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  material: "cubic-bezier(0.4, 0, 0.2, 1)"
} as const

export type Easing = (typeof easings)[keyof typeof easings]
