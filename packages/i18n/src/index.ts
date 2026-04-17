export {
  LOCALES,
  DEFAULT_LOCALE,
  COOKIE_NAME,
  LOCALE_CONFIG,
  isValidLocale,
  detectLocaleFromHeaders,
  localePath,
  stripLocalePrefix,
  t,
} from "./core"
export type { Locale, Messages } from "./core"
export { loadMessages } from "./load"
export { I18nProvider, useI18n, useTranslation } from "./react"
