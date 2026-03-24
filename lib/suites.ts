export type SuiteId = "pentest" | "flow" | "marketing" | "project"

export interface SuiteConfig {
  id: SuiteId
  color: string
  title: string
  button: string
  description: string
  smallDescription: string
  /** Copy affichée quand une suite est recommandée depuis le prompt (hero, etc.) */
  matchDescription: string
  /** Exemple de prompt pour les raccourcis « quick select » */
  quickPrompt: string
}

export const SUITES: SuiteConfig[] = [
  {
    id: "pentest",
    color: "var(--color-1)",
    title: "pentest",
    button: "Secure my product",
    description:
      "Detect vulnerabilities before they become costly. AI scans your apps and systems, uncovers risks, and delivers actionable fixes.",
    smallDescription: "Find and fix vulnerabilities automatically.",
    matchDescription: "AI will scan your systems, find vulnerabilities, and suggest fixes.",
    quickPrompt: "Scan my web application for security vulnerabilities"
  },
  {
    id: "flow",
    color: "var(--color-2)",
    title: "flow",
    button: "Create my site",
    description:
      "Launch high-converting websites and landing pages in minutes. Design, copy, structure, and hosting included.",
    smallDescription: "Websites and landing pages in minutes.",
    matchDescription: "Design, copy, and structure — your site will be live in minutes.",
    quickPrompt: "Create a landing page for my product with pricing"
  },
  {
    id: "marketing",
    color: "var(--color-3)",
    title: "marketing",
    button: "Launch my growth",
    description:
      "Plan, create, run, and optimize acquisition campaigns across channels. AI handles the execution, you focus on the product.",
    smallDescription: "Autonomous campaigns and growth.",
    matchDescription: "AI will plan, create, and optimize your campaigns across channels.",
    quickPrompt: "Launch a growth campaign across social media channels"
  },
  {
    id: "project",
    color: "var(--color-4)",
    title: "project",
    button: "Build my app",
    description:
      "Turn a prompt into a fully deployed application. AI agents plan, build, test, and ship your product end-to-end.",
    smallDescription: "From prompt to deployed app.",
    matchDescription: "AI agents will plan, build, test, and deploy your app end-to-end.",
    quickPrompt: "Build me a SaaS application with authentication and billing"
  }
]

/** Ordre des boutons suite sous le prompt hero */
export const HERO_PROMPT_SUITE_ORDER: readonly SuiteId[] = ["project", "flow", "marketing", "pentest"]

const SUITE_KEYWORD_TO_ID: Record<string, SuiteId> = {
  app: "project",
  application: "project",
  saas: "project",
  dashboard: "project",
  backend: "project",
  api: "project",
  database: "project",
  fullstack: "project",
  "full-stack": "project",
  mobile: "project",
  ios: "project",
  android: "project",
  deploy: "project",
  software: "project",
  platform: "project",
  crud: "project",
  auth: "project",
  authentication: "project",
  billing: "project",
  stripe: "project",
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

export function getHeroPromptSuites(): SuiteConfig[] {
  return HERO_PROMPT_SUITE_ORDER.map((id) => getSuiteById(id)!)
}

export function detectSuiteFromPrompt(input: string): SuiteConfig {
  const lower = input.toLowerCase()
  const scores: Record<SuiteId, number> = {
    project: 0,
    flow: 0,
    marketing: 0,
    pentest: 0
  }
  for (const [keyword, suiteId] of Object.entries(SUITE_KEYWORD_TO_ID)) {
    if (lower.includes(keyword)) scores[suiteId] += keyword.split(" ").length
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] as [SuiteId, number]
  if (best[1] === 0) return getSuiteById("project")!
  return getSuiteById(best[0])!
}
