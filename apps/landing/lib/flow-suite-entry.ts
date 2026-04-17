import { suiteEntryUrl, suiteMarketingLoginHref } from "@/lib/suite-marketing-entry"

/** Chemin sur l’app Kalit après connexion (page Flow marketing). */
export const FLOW_MARKETING_PATH = "/flow"

export function flowLoginHref(options?: { prompt?: string }): string {
  return suiteMarketingLoginHref(FLOW_MARKETING_PATH, options)
}

export function flowSuiteEntryUrl(suiteAppUrl: string, options?: { prompt?: string }): string {
  return suiteEntryUrl(suiteAppUrl, options)
}
