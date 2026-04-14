import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import { bootstrapI18n, installI18n, queueTranslateDom } from './i18n'
import './styles/global.less'

const app = createApp(App)

installI18n(app)
app.use(createPinia())
app.use(router)
app.use(Antd)

app.directive('no-autocomplete', {
  mounted(el: HTMLElement) {
    const inputs = el.tagName === 'INPUT' ? [el] : el.querySelectorAll('input')
    inputs.forEach((input: Element) => {
      input.setAttribute('autocomplete', 'off')
      input.setAttribute('autocorrect', 'off')
      input.setAttribute('autocapitalize', 'off')
    })
  },
})

app.mixin({
  mounted() {
    const el = (this as any).$el
    if (el && el.querySelectorAll) {
      const inputs = el.querySelectorAll('input, textarea')
      inputs.forEach((input: Element) => {
        if (!input.getAttribute('autocomplete')) {
          input.setAttribute('autocomplete', 'new-password')
        }
      })
      const forms = el.querySelectorAll('form')
      forms.forEach((form: Element) => {
        form.setAttribute('autocomplete', 'off')
      })
      queueTranslateDom(el as Element)
    }
  },
  updated() {
    const el = (this as any).$el
    if (el && el.querySelectorAll) {
      queueTranslateDom(el as Element)
    }
  },
})

bootstrapI18n().finally(() => {
  app.mount('#app')
})
