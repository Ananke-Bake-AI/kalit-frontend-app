/**
 * Courbes d'easing personnalisées pour GSAP
 * Inspirées des standards pro (Apple, Material, Stripe)
 * GSAP accepte directement les strings cubic-bezier
 */

export const easings = {
  /** Fin fluide, légère décélération (default pro) */
  smoothOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Début + fin symétriques, très naturel */
  smoothInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Expo out - punchy, impact fort (Stripe-like) */
  expoOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Expo in-out - ultra smooth */
  expoInOut: "cubic-bezier(0.87, 0, 0.13, 1)",
  /** Léger snap en fin, dynamique */
  snapOut: "cubic-bezier(0.33, 1, 0.68, 1)",
  /** Quart out - décélération prononcée */
  quartOut: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  /** Material Design standard */
  material: "cubic-bezier(0.4, 0, 0.2, 1)"
} as const

export type Easing = (typeof easings)[keyof typeof easings]
