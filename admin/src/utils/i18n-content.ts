import { enUS as adminDefaultMessages } from '@/i18n/messages'
import { enUS as clientDefaultMessages } from '../../../client/src/i18n/messages'

export type I18nScope = 'admin' | 'client'
export type EditableMessageCatalog = Record<string, Record<string, string>>

export const LOCALE_PRESETS = [
  { code: 'zh-CN', label: '简体中文', fallback: 'zh-CN' },
  { code: 'en-US', label: 'English (US)', fallback: 'en-US' },
  { code: 'ja-JP', label: '日本語', fallback: 'en-US' },
  { code: 'ko-KR', label: '한국어', fallback: 'en-US' },
  { code: 'fr-FR', label: 'Français', fallback: 'en-US' },
  { code: 'de-DE', label: 'Deutsch', fallback: 'en-US' },
  { code: 'es-ES', label: 'Español', fallback: 'en-US' },
  { code: 'ru-RU', label: 'Русский', fallback: 'en-US' },
  { code: 'pt-BR', label: 'Português (Brasil)', fallback: 'en-US' },
  { code: 'ar-SA', label: 'العربية', fallback: 'en-US' },
]

export const defaultMessageMap: Record<I18nScope, Record<string, string>> = {
  admin: adminDefaultMessages,
  client: clientDefaultMessages,
}

export function normalizeMessageRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record)
      .map(([key, value]) => [String(key || '').trim(), String(value ?? '').trim()])
      .filter(([key, value]) => key && value),
  ) as Record<string, string>
}

export function parseLocaleCatalog(value?: string) {
  try {
    const parsed = JSON.parse(value || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .map((item) => ({
          code: String(item.code || '').trim(),
          label: String(item.label || item.code || '').trim(),
          fallback: String(item.fallback || 'en-US').trim(),
        }))
        .filter((item) => item.code && item.label)
    }
  } catch {}
  return LOCALE_PRESETS.slice(0, 2)
}

export function parseI18nMessages(value: string | undefined, scope: I18nScope): EditableMessageCatalog {
  const baseMessages = defaultMessageMap[scope]
  const result: EditableMessageCatalog = {
    'en-US': { ...baseMessages },
  }
  if (!value) return result

  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object') return result

    if (!Array.isArray(parsed) && Object.values(parsed).every((item) => typeof item === 'string')) {
      Object.assign(result['en-US'], normalizeMessageRecord(parsed as Record<string, unknown>))
      return result
    }

    for (const [localeCode, messages] of Object.entries(parsed)) {
      if (!messages || typeof messages !== 'object' || Array.isArray(messages)) continue
      const normalized = normalizeMessageRecord(messages as Record<string, unknown>)
      if (localeCode === 'en-US') {
        result['en-US'] = { ...baseMessages, ...normalized }
      } else if (Object.keys(normalized).length > 0) {
        result[localeCode] = normalized
      }
    }
  } catch {
    return result
  }

  return result
}

export function serializeI18nMessages(
  catalogs: EditableMessageCatalog,
  scope: I18nScope,
  localeCatalog: Array<{ code: string }>,
) {
  const baseMessages = defaultMessageMap[scope]
  const result: EditableMessageCatalog = {}
  const allowedLocales = new Set(localeCatalog.map((item) => item.code))

  for (const [localeCode, messages] of Object.entries(catalogs)) {
    if (!allowedLocales.has(localeCode)) continue
    const normalized = Object.fromEntries(
      Object.entries(messages)
        .map(([key, value]) => [String(key || '').trim(), String(value ?? '').trim()])
        .filter(([key, value]) => {
          if (!key || !value) return false
          return localeCode === 'en-US' ? value !== (baseMessages[key] || '') : true
        }),
    ) as Record<string, string>

    if (Object.keys(normalized).length > 0) {
      result[localeCode] = normalized
    }
  }

  return JSON.stringify(result)
}
