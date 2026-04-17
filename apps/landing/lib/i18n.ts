/**
 * Re-export shim. The real implementation lives in `@kalit/i18n` (shared
 * workspace package, also used by the future Tauri desktop app). Existing
 * callers import from `@/lib/i18n` — keep this file so those paths resolve.
 */
export {
  LOCALES,
  DEFAULT_LOCALE,
  COOKIE_NAME,
  LOCALE_CONFIG,
  isValidLocale,
  detectLocaleFromHeaders,
  localePath,
  stripLocalePrefix,
  loadMessages,
  t,
} from "@kalit/i18n"
export type { Locale, Messages } from "@kalit/i18n"
