import { DEFAULT_LOCALE, type Locale, type Messages } from "./core"

const messageCache = new Map<Locale, Messages>()

export async function loadMessages(locale: Locale): Promise<Messages> {
  if (messageCache.has(locale)) return messageCache.get(locale)!

  try {
    const messages = (await import(`../messages/${locale}.json`)).default as Messages
    messageCache.set(locale, messages)
    return messages
  } catch {
    if (locale !== DEFAULT_LOCALE) return loadMessages(DEFAULT_LOCALE)
    return {} as Messages
  }
}
