// Re-export shim.
export * from "@kalit/studio-ui/types"
export {
  SUITES,
  APP_DEFAULT_GRADIENT_PRIMARY,
  APP_DEFAULT_GRADIENT_PRIMARY_RADIAL,
  HERO_PROMPT_SUITE_ORDER,
  getSuiteDisplayTitle,
  getSuiteById,
  getSuiteAppUrl,
  resolveAppGradientPrimary,
  resolveAppGradientPrimaryRadial,
  resolveActiveSuite,
  getHeroPromptSuites,
  detectSuiteFromPrompt,
} from "@kalit/studio-ui"
export type { SuiteId, SuiteConfig, AppPageState } from "@kalit/studio-ui"
