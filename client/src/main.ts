import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { bootstrapI18n, installI18n, queueTranslateDom } from './i18n'
import './style.css'

const app = createApp(App)
installI18n(app)
app.use(createPinia())
app.use(router)
app.mixin({
  mounted() {
    const el = (this as any).$el
    if (el && el.querySelectorAll) {
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
