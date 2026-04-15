const container = document.createElement('div')
container.id = 'toast-container'
container.style.cssText = 'position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none'
document.body.appendChild(container)

type ToastType = 'success' | 'error' | 'warning' | 'info'

const config: Record<ToastType, { bg: string; text: string; border: string; svg: string }> = {
  success: {
    bg: '#f0fdf4', text: '#166534', border: '#bbf7d0',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  },
  error: {
    bg: '#fef2f2', text: '#991b1b', border: '#fecaca',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  },
  warning: {
    bg: '#fffbeb', text: '#92400e', border: '#fde68a',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
  },
  info: {
    bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  },
}

export function toast(message: string, type: ToastType = 'info', duration = 3000) {
  const c = config[type]
  const el = document.createElement('div')
  el.style.cssText = `background:${c.bg};color:${c.text};padding:12px 18px;border-radius:12px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,0.08);display:flex;align-items:center;gap:10px;transform:translateX(120%);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);pointer-events:auto;max-width:380px;border:1px solid ${c.border}`
  const iconWrap = document.createElement('span')
  iconWrap.style.cssText = 'width:20px;height:20px;flex-shrink:0;display:flex'
  iconWrap.innerHTML = c.svg
  const msgSpan = document.createElement('span')
  msgSpan.style.cssText = 'line-height:1.4'
  msgSpan.textContent = message
  el.appendChild(iconWrap)
  el.appendChild(msgSpan)
  container.appendChild(el)
  requestAnimationFrame(() => { el.style.transform = 'translateX(0)' })
  setTimeout(() => {
    el.style.transform = 'translateX(120%)'
    setTimeout(() => el.remove(), 300)
  }, duration)
}

export default toast
