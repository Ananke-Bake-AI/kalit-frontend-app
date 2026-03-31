/** Construit l’URL de login avec retour vers une page marketing suite (`/flow`, `/pentest`, …). */
export function suiteMarketingLoginHref(marketingPath: string, options?: { prompt?: string }) {
  const path =
    options?.prompt !== undefined && options.prompt !== ""
      ? `${marketingPath}?prompt=${encodeURIComponent(options.prompt)}`
      : marketingPath
  return `/login?callbackUrl=${encodeURIComponent(path)}`
}

/** URL d’entrée de l’app suite avec prompt optionnel (query). */
export function suiteEntryUrl(suiteAppUrl: string, options?: { prompt?: string }) {
  const base = suiteAppUrl.replace(/\/$/, "")
  const prompt = options?.prompt?.trim()
  if (!prompt) return base
  const sep = base.includes("?") ? "&" : "?"
  return `${base}${sep}prompt=${encodeURIComponent(prompt)}`
}
