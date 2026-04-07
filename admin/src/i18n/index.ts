import type { App } from 'vue'
import { computed, readonly, ref } from 'vue'
import enUSAntd from 'ant-design-vue/es/locale/en_US'
import zhCNAntd from 'ant-design-vue/es/locale/zh_CN'
import { enUS as defaultEnUSMessages } from './messages'

export type LocaleCode = string
export interface LocaleCatalogItem {
  code: string
  label: string
  fallback?: string
}
type LocaleMessageCatalog = Record<string, Record<string, string>>

const STORAGE_KEY = 'admin-locale'
export const LOCALE_CHANGED_EVENT = 'admin:locale-changed'
const ATTRIBUTES_TO_TRANSLATE = ['placeholder', 'title', 'aria-label'] as const
const DEFAULT_LOCALE_CATALOG: LocaleCatalogItem[] = [
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
const PATTERN_TRANSLATORS = [
  { regex: /^共\s*(\d+)\s*个职位$/, key: '共 {count} 个职位' },
  { regex: /^共\s*(\d+)\s*条$/, key: '共 {count} 条' },
  { regex: /^共\s*(\d+)\s*个$/, key: '共 {count} 个' },
  { regex: /^共\s*(\d+)\s*个用户$/, key: '共 {count} 个用户' },
  { regex: /^共\s*(\d+)\s*家企业$/, key: '共 {count} 家企业' },
  { regex: /^共\s*(\d+)\s*道题$/, key: '共 {count} 道题' },
  { regex: /^共\s*(\d+)\s*个模板$/, key: '共 {count} 个模板' },
  { regex: /^共\s*(\d+)\s*个分类$/, key: '共 {count} 个分类' },
]

const locale = ref<LocaleCode>('zh-CN')
const enabledLocales = ref<LocaleCode[]>(['zh-CN', 'en-US'])
const localeCatalog = ref<LocaleCatalogItem[]>(DEFAULT_LOCALE_CATALOG)
const runtimeMessages = ref<LocaleMessageCatalog>({})
let knownMessages = new Set(Object.keys(defaultEnUSMessages))
const textNodeOriginals = new WeakMap<Text, string>()
const attributeOriginals = new WeakMap<Element, Record<string, string>>()
const translateQueue = new Set<Element>()
let rafId = 0

function normalizeLocale(value?: string | null): LocaleCode {
  const raw = String(value || '').trim()
  if (!raw) return 'zh-CN'
  const matched = localeCatalog.value.find((item) => item.code.toLowerCase() === raw.toLowerCase())
  if (matched) return matched.code
  return raw
}

function uniqueLocales(list: LocaleCode[]) {
  return Array.from(new Set(list)).filter(Boolean)
}

function parseEnabledLocales(value?: string | null): LocaleCode[] {
  if (!value) return ['zh-CN', 'en-US']
  const parsed = uniqueLocales(
    value
      .split(',')
      .map((item) => normalizeLocale(item.trim())),
  )
  return parsed.length > 0 ? parsed : ['zh-CN', 'en-US']
}

function uniqueLocaleCatalog(list: LocaleCatalogItem[]) {
  const map = new Map<string, LocaleCatalogItem>()
  for (const item of list) {
    map.set(item.code, item)
  }
  return Array.from(map.values())
}

function parseLocaleCatalog(value?: string | null): LocaleCatalogItem[] {
  if (!value) return DEFAULT_LOCALE_CATALOG
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return DEFAULT_LOCALE_CATALOG
    const list = parsed
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const code = normalizeLocale(String((item as any).code || ''))
        if (!code) return null
        return {
          code,
          label: String((item as any).label || code),
          fallback: String((item as any).fallback || (code === 'zh-CN' ? 'zh-CN' : 'en-US')),
        } satisfies LocaleCatalogItem
      })
      .filter(Boolean) as LocaleCatalogItem[]
    return list.length > 0 ? uniqueLocaleCatalog(list) : DEFAULT_LOCALE_CATALOG
  } catch {
    return DEFAULT_LOCALE_CATALOG
  }
}

function interpolate(message: string, params?: Record<string, unknown>) {
  if (!params) return message
  return message.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`))
}

function parseLocaleMessages(value?: string | null): LocaleMessageCatalog {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object') return {}

    // 兼容旧结构：直接存 source->translation 时视为 en-US 覆盖
    if (!Array.isArray(parsed) && Object.values(parsed).every((item) => typeof item === 'string')) {
      return {
        'en-US': Object.fromEntries(
          Object.entries(parsed).filter(([key, val]) => key && typeof val === 'string' && String(val).trim()),
        ) as Record<string, string>,
      }
    }

    const result: LocaleMessageCatalog = {}
    for (const [localeCode, messages] of Object.entries(parsed)) {
      if (!messages || typeof messages !== 'object' || Array.isArray(messages)) continue
      const normalized = Object.fromEntries(
        Object.entries(messages)
          .map(([key, val]) => [String(key || '').trim(), String(val ?? '').trim()])
          .filter(([key, val]) => key && val),
      ) as Record<string, string>
      if (Object.keys(normalized).length > 0) {
        result[normalizeLocale(localeCode)] = normalized
      }
    }
    return result
  } catch {
    return {}
  }
}

function refreshKnownMessages() {
  const next = new Set<string>(Object.keys(defaultEnUSMessages))
  Object.values(runtimeMessages.value).forEach((catalog) => {
    Object.keys(catalog).forEach((key) => next.add(key))
  })
  knownMessages = next
}

function getLocaleMessages(targetLocale: string) {
  const base = targetLocale === 'en-US' ? defaultEnUSMessages : {}
  return {
    ...base,
    ...(runtimeMessages.value[targetLocale] || {}),
  }
}

function isKnownMessage(message: string) {
  return knownMessages.has(message)
}

function shouldSkipTranslate(target?: Node | Element | null) {
  const element = target instanceof Element ? target : target?.parentElement
  return Boolean(element?.closest('[data-no-translate]'))
}

export function translate(message: string, params?: Record<string, unknown>) {
  const raw = String(message || '')
  const currentLocale = locale.value
  const fallback = localeCatalog.value.find((item) => item.code === currentLocale)?.fallback || 'en-US'
  const translated =
    currentLocale === 'zh-CN'
      ? raw
      : getLocaleMessages(currentLocale)[raw] ||
        (fallback === 'zh-CN' ? raw : getLocaleMessages(fallback)[raw] || raw)
  return interpolate(translated, params)
}

function updateDocumentLanguage() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale.value
  }
}

export function setLocale(next: LocaleCode | string) {
  const target = normalizeLocale(next)
  const fallback = enabledLocales.value[0] || 'zh-CN'
  const finalLocale = enabledLocales.value.includes(target) ? target : fallback
  locale.value = finalLocale
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, finalLocale)
    window.dispatchEvent(new CustomEvent(LOCALE_CHANGED_EVENT, { detail: finalLocale }))
    queueTranslateDom(document.body)
  }
  updateDocumentLanguage()
}

function resolveLocale(defaultLocale?: string | null) {
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
  const candidates = [stored, defaultLocale, typeof navigator !== 'undefined' ? navigator.language : null]
  for (const candidate of candidates) {
    if (!candidate) continue
    const normalized = normalizeLocale(candidate)
    if (enabledLocales.value.includes(normalized)) return normalized
  }
  return enabledLocales.value[0] || 'zh-CN'
}

export async function bootstrapI18n() {
  try {
    const response = await fetch('/api/system/settings/public')
    const payload = await response.json().catch(() => null)
    const data = payload?.data || {}
    localeCatalog.value = parseLocaleCatalog(data.locale_catalog)
    enabledLocales.value = parseEnabledLocales(data.enabled_locales)
    runtimeMessages.value = parseLocaleMessages(data.admin_i18n_messages)
    refreshKnownMessages()
    const defaultLocale = data.admin_default_locale || data.default_locale
    locale.value = resolveLocale(defaultLocale)
  } catch {
    runtimeMessages.value = {}
    refreshKnownMessages()
    locale.value = resolveLocale()
  }
  updateDocumentLanguage()
}

export const localeOptions = computed(() =>
  enabledLocales.value.map((value) => ({
    value,
    label: localeCatalog.value.find((item) => item.code === value)?.label || value,
  })),
)

export const antLocale = computed(() => (locale.value === 'zh-CN' ? zhCNAntd : enUSAntd))

export function formatDateTime(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale.value, options).format(date)
}

function translateTextNode(node: Text) {
  if (shouldSkipTranslate(node)) return
  const current = node.textContent || ''
  const match = current.match(/^(\s*)(.*?)(\s*)$/s)
  if (!match) return
  const [, leading, body, trailing] = match
  const original = textNodeOriginals.get(node) ?? body
  const dynamic = translateDynamicPattern(original)
  if (dynamic) {
    textNodeOriginals.set(node, original)
    node.textContent = `${leading}${dynamic}${trailing}`
    return
  }
  if (!isKnownMessage(original)) return
  textNodeOriginals.set(node, original)
  node.textContent = `${leading}${translate(original)}${trailing}`
}

function translateDynamicPattern(message: string) {
  for (const item of PATTERN_TRANSLATORS) {
    const match = message.match(item.regex)
    if (!match) continue
    return translate(item.key, { count: match[1] })
  }
  return ''
}

function translateAttributes(element: Element) {
  if (shouldSkipTranslate(element)) return
  const originals = attributeOriginals.get(element) || {}
  let touched = false
  for (const attribute of ATTRIBUTES_TO_TRANSLATE) {
    const current = element.getAttribute(attribute)
    const original = originals[attribute] ?? current
    if (!original || !isKnownMessage(original)) continue
    originals[attribute] = original
    element.setAttribute(attribute, translate(original))
    touched = true
  }
  if (touched) {
    attributeOriginals.set(element, originals)
  }
}

function translateElementTree(root: Element) {
  translateAttributes(root)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    translateTextNode(node as Text)
    node = walker.nextNode()
  }
  const elements = root.querySelectorAll('*')
  elements.forEach((element) => translateAttributes(element))
}

export function queueTranslateDom(root?: Element | null) {
  if (typeof document === 'undefined') return
  if (root) translateQueue.add(root)
  if (rafId) return
  rafId = window.requestAnimationFrame(() => {
    const targets = Array.from(translateQueue)
    translateQueue.clear()
    rafId = 0
    targets.forEach((element) => {
      if (element && document.body.contains(element)) {
        translateElementTree(element)
      }
    })
  })
}

export function installI18n(app: App) {
  app.config.globalProperties.$t = translate
}

export function useI18n() {
  return {
    locale: readonly(locale),
    enabledLocales: readonly(enabledLocales),
    localeCatalog: readonly(localeCatalog),
    localeOptions,
    antLocale,
    t: translate,
    setLocale,
    formatDateTime,
  }
}
