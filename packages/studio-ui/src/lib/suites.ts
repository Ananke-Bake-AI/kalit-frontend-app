export type SuiteId = "pentest" | "flow" | "marketing" | "search"

/** Contexte d’URL / store : hors suite ou id de suite active */
export type AppPageState = "default" | SuiteId

export interface SuiteConfig {
  id: SuiteId
  color: string
  /** Valeur CSS pour `var(--gradient-primary)` quand cette suite est active */
  gradient: string
  gradientRadial: string
  /** Vignette marketing (chemin public ou URL) — optionnel pour l’instant */
  thumbnail?: string
  /** Icône onglet / PWA — optionnel pour l’instant */
  favicon?: string
  title: string
  button: string
  description: string
  smallDescription: string
  /** Copy affichée quand une suite est recommandée depuis le prompt (hero, etc.) */
  matchDescription: string
  /** Exemple de prompt pour les raccourcis « quick select » */
  quickPrompt: string
  /** Path SVG du pictogramme (attribut `d`) */
  logoD: string
  /** Texte `<title>` du SVG pour l’accessibilité */
  logoTitle: string
  /** URL de base de l’app suite (SSO, redirections serveur) */
  appUrl: string
}

/** Dégradé global quand aucune suite n’est « active » (dashboard, settings, landing, etc.) */
export const APP_DEFAULT_GRADIENT_PRIMARY = "var(--gradient-linear-3)"
export const APP_DEFAULT_GRADIENT_PRIMARY_RADIAL = "var(--gradient-radial-1)"

export const SUITES: SuiteConfig[] = [
  {
    id: "pentest",
    color: "var(--color-1)",
    gradient: "var(--gradient-color-1)",
    gradientRadial: "var(--gradient-color-1-radial)",
    title: "pentest",
    button: "Run a pre-launch scan",
    description:
      "Pre-launch security scan for your authorized app, API, or staging target. Pentest finds the issues, shows the evidence, and tells you how to fix them.",
    smallDescription: "Pre-launch security scan with actionable findings.",
    matchDescription: "Pentest will scan your authorized target and surface findings with evidence and fixes.",
    quickPrompt: "Run a pre-launch security scan on my staging app",
    logoD:
      "M20.366 10.1298H30.6829C42.0383 10.1298 51.2437 19.3351 51.2437 30.6906C51.2437 42.046 42.0383 51.2513 30.6829 51.2513C19.3274 51.2513 10.1221 42.046 10.1221 30.6906V82.0436",
    logoTitle: "Kalit — Pentest Suite",
    appUrl: process.env.SUITE_PENTEST_URL || "http://localhost:3005"
  },
  {
    id: "flow",
    color: "var(--color-2)",
    gradient: "var(--gradient-color-2)",
    gradientRadial: "var(--gradient-color-2-radial)",
    title: "flow",
    button: "Build with Flow",
    description:
      "Go from prompt to a live launch page or a full app, hosted and deployable in minutes — design, copy, structure, frontend, backend, and deploy included.",
    smallDescription: "Launch pages and full apps from a prompt.",
    matchDescription: "Flow turns your prompt into a launch-ready page or a full app — preview, deploy, iterate.",
    quickPrompt: "Build me a SaaS landing page with pricing, FAQ, and signup",
    logoD: "M61.3701 10.5157H40.9951C16.2951 10.5157 10.1201 31.099 10.1201 41.3907V81.9811M40.9951 50.7657H61.3701",
    logoTitle: "Kalit — Flow",
    appUrl: process.env.SUITE_FLOW_URL || "http://localhost:3004"
  },
  {
    id: "marketing",
    color: "var(--color-3)",
    gradient: "var(--gradient-color-3)",
    gradientRadial: "var(--gradient-color-3-radial)",
    title: "marketing",
    button: "Launch my growth",
    description:
      "Plan, create, run, and optimize acquisition campaigns across channels. AI handles the execution, you focus on the product.",
    smallDescription: "Autonomous campaigns and growth.",
    matchDescription: "AI will plan, create, and optimize your campaigns across channels.",
    quickPrompt: "Launch a growth campaign across social media channels",
    logoD:
      "M71.751 0C71.751 17.0534 57.9265 30.8779 40.873 30.8779C23.8196 30.8779 9.99512 17.0534 9.99512 0V81.9811M71.7665 36.1279L71.6221 81.9124",
    logoTitle: "Kalit — Marketing Suite",
    appUrl: process.env.SUITE_MARKETING_URL || "http://localhost:3002"
  },
  {
    id: "search",
    color: "var(--color-5)",
    gradient: "var(--gradient-color-5)",
    gradientRadial: "var(--gradient-color-5-radial)",
    title: "search",
    button: "Run research",
    description:
      "Pre-launch research on markets, competitors, audience pains, and angles. Search hands the strongest output to Flow so the page or app you build hits.",
    smallDescription: "Market research that feeds your launch.",
    matchDescription: "Search will research the market, score the angles, and pass the strongest one to Flow.",
    quickPrompt: "Research the market and angles for a B2B SaaS launch in fintech",
    logoD:
      "M30.5918 30.4995C30.5918 19.1779 39.7697 10 51.0913 10C62.4129 10 71.5908 19.1779 71.5908 30.4995C71.5908 41.8211 62.4129 50.999 51.0913 50.999L30.6721 50.999L7.07098 74.6001",
    logoTitle: "Kalit — Search Suite",
    appUrl: process.env.SUITE_SEARCH_URL || "https://search.kalit.ai"
  }
]

/** Ordre des boutons suite sous le prompt hero */
export const HERO_PROMPT_SUITE_ORDER: readonly SuiteId[] = ["flow", "pentest", "search"]

const SUITE_KEYWORD_TO_ID: Record<string, SuiteId> = {
  app: "flow",
  application: "flow",
  saas: "flow",
  dashboard: "flow",
  backend: "flow",
  api: "flow",
  database: "flow",
  fullstack: "flow",
  "full-stack": "flow",
  mobile: "flow",
  ios: "flow",
  android: "flow",
  deploy: "flow",
  software: "flow",
  platform: "flow",
  crud: "flow",
  auth: "flow",
  authentication: "flow",
  billing: "flow",
  stripe: "flow",
  "trending ideas": "search",
  "trending saas ideas": "search",
  "startup ideas": "search",
  "project ideas": "search",
  "business ideas": "search",
  "market opportunities": "search",
  "opportunity analysis": "search",
  "what should i build": "search",
  "find ideas": "search",
  "find trending": "search",
  "analyze market": "search",
  "validate idea": "search",
  research: "search",
  trends: "search",
  ideas: "search",
  opportunity: "search",
  landing: "flow",
  website: "flow",
  "landing page": "flow",
  page: "flow",
  portfolio: "flow",
  blog: "flow",
  site: "flow",
  homepage: "flow",
  design: "flow",
  restaurant: "flow",
  agency: "flow",
  marketing: "marketing",
  campaign: "marketing",
  ads: "marketing",
  seo: "marketing",
  social: "marketing",
  growth: "marketing",
  acquisition: "marketing",
  instagram: "marketing",
  facebook: "marketing",
  google: "marketing",
  tiktok: "marketing",
  email: "marketing",
  newsletter: "marketing",
  content: "marketing",
  leads: "marketing",
  funnel: "marketing",
  security: "pentest",
  pentest: "pentest",
  vulnerability: "pentest",
  vulnerabilities: "pentest",
  scan: "pentest",
  hack: "pentest",
  secure: "pentest",
  audit: "pentest",
  penetration: "pentest",
  owasp: "pentest",
  xss: "pentest",
  injection: "pentest",
  firewall: "pentest"
}

export function getSuiteDisplayTitle(suite: SuiteConfig): string {
  return suite.title.charAt(0).toUpperCase() + suite.title.slice(1)
}

export function getSuiteById(id: SuiteId): SuiteConfig | undefined {
  return SUITES.find((s) => s.id === id)
}

/** URL de base de l’app suite (même logique que `appUrl` dans `SUITES`) */
export function getSuiteAppUrl(id: SuiteId): string | undefined {
  return getSuiteById(id)?.appUrl
}

export function resolveAppGradientPrimary(page: AppPageState): string {
  if (page === "default") return APP_DEFAULT_GRADIENT_PRIMARY
  return getSuiteById(page)?.gradient ?? APP_DEFAULT_GRADIENT_PRIMARY
}

export function resolveAppGradientPrimaryRadial(page: AppPageState): string {
  if (page === "default") return APP_DEFAULT_GRADIENT_PRIMARY_RADIAL
  return getSuiteById(page)?.gradientRadial ?? APP_DEFAULT_GRADIENT_PRIMARY_RADIAL
}

/** Suite courante selon le store / l’URL, ou `null` si contexte `default` */
export function resolveActiveSuite(page: AppPageState): SuiteConfig | null {
  if (page === "default") return null
  return getSuiteById(page) ?? null
}

export function getHeroPromptSuites(): SuiteConfig[] {
  return HERO_PROMPT_SUITE_ORDER.map((id) => getSuiteById(id)!)
}

export function detectSuiteFromPrompt(input: string): SuiteConfig {
  const lower = input.toLowerCase()
  const scores: Record<SuiteId, number> = {
    flow: 0,
    marketing: 0,
    pentest: 0,
    search: 0
  }
  for (const [keyword, suiteId] of Object.entries(SUITE_KEYWORD_TO_ID)) {
    if (lower.includes(keyword)) scores[suiteId] += keyword.split(" ").length
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] as [SuiteId, number]
  if (best[1] === 0) return getSuiteById("flow")!
  return getSuiteById(best[0])!
}
