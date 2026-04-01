import { cookies, headers } from "next/headers"
import { COOKIE_NAME, DEFAULT_LOCALE, detectLocaleFromHeaders, isValidLocale, loadMessages, t as translate, type Locale } from "./i18n"

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale
  return detectLocaleFromHeaders(headerStore.get("accept-language"))
}

export async function getServerTranslation() {
  const locale = await getServerLocale()
  const messages = await loadMessages(locale)
  return (key: string, params?: Record<string, string | number>) => translate(messages, key, params)
}
