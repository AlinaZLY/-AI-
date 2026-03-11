<template>
  <div class="settings-page">
    <a-page-header title="系统设置" sub-title="管理平台基础配置" />

    <a-card title="网站信息" class="card" style="margin-top: 20px">
      <a-form
        :model="settingsForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        @finish="handleSave"
      >
        <a-form-item label="网站名称" name="siteName">
          <a-input
            v-model:value="settingsForm.siteName"
            placeholder="请输入网站名称（将显示在登录页和后台标题）"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4, span: 12 }">
          <a-button type="primary" html-type="submit" :loading="loading">
            保存设置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getSettingsApi, updateSettingsApi } from '@/api/system'

const loading = ref(false)

const settingsForm = reactive({
  siteName: '',
})

async function fetchSettings() {
  try {
    const res: any = await getSettingsApi()
    settingsForm.siteName = res.data?.siteName || ''
  } catch { /* 拦截器处理 */ }
}

async function handleSave() {
  loading.value = true
  try {
    await updateSettingsApi({ siteName: settingsForm.siteName })
    message.success('设置保存成功')
  } catch { /* 拦截器处理 */ } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped lang="less">
.settings-page {
  .card {
    border-radius: 8px;
  }
}
</style>
