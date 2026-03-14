import { reactive } from 'vue'

let _resolve: ((value: boolean) => void) | null = null

export const confirmState = reactive({
  visible: false,
  title: '',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
  type: 'confirm' as 'confirm' | 'alert',
})

export function confirmDialog(message: string, title = '提示'): Promise<boolean> {
  return new Promise((resolve) => {
    _resolve = resolve
    confirmState.title = title
    confirmState.message = message
    confirmState.confirmText = '确定'
    confirmState.cancelText = '取消'
    confirmState.type = 'confirm'
    confirmState.visible = true
  })
}

export function alertDialog(message: string, title = '提示'): Promise<boolean> {
  return new Promise((resolve) => {
    _resolve = resolve
    confirmState.title = title
    confirmState.message = message
    confirmState.confirmText = '知道了'
    confirmState.type = 'alert'
    confirmState.visible = true
  })
}

export function resolveConfirm(value: boolean) {
  confirmState.visible = false
  _resolve?.(value)
  _resolve = null
}
