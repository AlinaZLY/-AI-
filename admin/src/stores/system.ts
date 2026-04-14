import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublicSettingsApi } from '@/api/system'

export const useSystemStore = defineStore('system', () => {
  const siteName = ref('校园招聘服务平台')
  const siteLogo = ref('')

  async function fetchSettings() {
    try {
      const res: any = await getPublicSettingsApi()
      if (res.data?.siteName) {
        siteName.value = res.data.siteName
      }
      if (res.data?.site_logo) {
        siteLogo.value = res.data.site_logo
      }
    } catch { /* 使用默认值 */ }
  }

  return { siteName, siteLogo, fetchSettings }
})
