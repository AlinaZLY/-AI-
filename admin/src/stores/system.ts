import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSettingsApi } from '@/api/system'

export const useSystemStore = defineStore('system', () => {
  const siteName = ref('校园招聘服务平台')

  async function fetchSettings() {
    try {
      const res: any = await getSettingsApi()
      if (res.data?.siteName) {
        siteName.value = res.data.siteName
      }
    } catch { /* 使用默认值 */ }
  }

  return { siteName, fetchSettings }
})
