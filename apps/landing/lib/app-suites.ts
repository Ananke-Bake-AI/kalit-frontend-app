export type SuiteId = "flow" | "marketing" | "pentest"

export interface SuiteConfig {
  id: SuiteId
  name: string
  description: string
  color: string
  icon: string
  href: string
}

export const SUITES: SuiteConfig[] = [
  {
    id: "flow",
    name: "Flow",
    description: "From prompt to a live launch page or a full app — design, copy, frontend, backend, and deploy included.",
    color: "#2F44FF",
    icon: "globe",
    href: "/flow",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Plan, create, run, and optimize acquisition campaigns across channels. AI handles the execution.",
    color: "#12BCFF",
    icon: "megaphone",
    href: "/marketing",
  },
  {
    id: "pentest",
    name: "Pentest",
    description: "Detect vulnerabilities before they become costly. AI scans your apps and systems, delivers actionable fixes.",
    color: "#91E500",
    icon: "shield",
    href: "/pentest",
  },
]

export function getSuite(id: SuiteId): SuiteConfig {
  return SUITES.find((s) => s.id === id)!
}
