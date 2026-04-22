import { reactive } from 'vue'

export type ConfirmKind = 'info' | 'success' | 'warning' | 'danger'

export interface ConfirmOptions {
  title?: string
  confirmText?: string
  cancelText?: string
  kind?: ConfirmKind
  /** 强调说明（消息下方的次要文本） */
  description?: string
}

let _resolve: ((value: boolean) => void) | null = null

function getI18nText(key: string): string {
  try {
    const locale = localStorage.getItem('locale') || 'zh-CN'
    const map: Record<string, Record<string, string>> = {
      '确定': { en: 'OK', 'en-US': 'OK' },
      '取消': { en: 'Cancel', 'en-US': 'Cancel' },
      '提示': { en: 'Notice', 'en-US': 'Notice' },
      '知道了': { en: 'Got it', 'en-US': 'Got it' },
    }
    return map[key]?.[locale] || key
  } catch { return key }
}

export const confirmState = reactive({
  visible: false,
  title: '',
  message: '',
  description: '',
  confirmText: '确定',
  cancelText: '取消',
  type: 'confirm' as 'confirm' | 'alert',
  kind: 'info' as ConfirmKind,
})

export function confirmDialog(message: string, titleOrOptions?: string | ConfirmOptions): Promise<boolean> {
  const options: ConfirmOptions = typeof titleOrOptions === 'string' ? { title: titleOrOptions } : (titleOrOptions || {})
  return new Promise((resolve) => {
    _resolve = resolve
    confirmState.title = options.title || getI18nText('提示')
    confirmState.message = message
    confirmState.description = options.description || ''
    confirmState.confirmText = options.confirmText || getI18nText('确定')
    confirmState.cancelText = options.cancelText || getI18nText('取消')
    confirmState.type = 'confirm'
    confirmState.kind = options.kind || 'info'
    confirmState.visible = true
  })
}

export function alertDialog(message: string, titleOrOptions?: string | ConfirmOptions): Promise<boolean> {
  const options: ConfirmOptions = typeof titleOrOptions === 'string' ? { title: titleOrOptions } : (titleOrOptions || {})
  return new Promise((resolve) => {
    _resolve = resolve
    confirmState.title = options.title || getI18nText('提示')
    confirmState.message = message
    confirmState.description = options.description || ''
    confirmState.confirmText = options.confirmText || getI18nText('知道了')
    confirmState.type = 'alert'
    confirmState.kind = options.kind || 'info'
    confirmState.visible = true
  })
}

export function resolveConfirm(value: boolean) {
  confirmState.visible = false
  _resolve?.(value)
  _resolve = null
}
