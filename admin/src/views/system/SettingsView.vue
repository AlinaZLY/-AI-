<template>
  <div class="settings-page">
    <a-page-header :title="$t('系统设置')" :sub-title="$t('管理平台基础配置')" />

    <a-card :title="$t('网站信息')" class="card" style="margin-top: 20px">
      <a-form
        :model="settingsForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        @finish="handleSave"
      >
        <a-form-item :label="$t('平台 LOGO')">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="logo-preview">
              <img v-if="logoPreview" :src="logoPreview" alt="LOGO" />
              <div v-else class="logo-placeholder">{{ $t('暂无 LOGO') }}</div>
            </div>
            <div>
              <a-upload
                :show-upload-list="false"
                accept="image/*"
                :before-upload="handleLogoUpload"
              >
                <a-button :loading="logoUploading">
                  <template #icon><UploadOutlined /></template>
                  {{ logoPreview ? $t('更换 LOGO') : $t('上传 LOGO') }}
                </a-button>
              </a-upload>
              <div style="margin-top: 4px; font-size: 12px; color: #999;">
                {{ $t('建议尺寸 200x200，不超过 2MB') }}
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item :label="$t('网站名称')" name="siteName">
          <a-input
            v-model:value="settingsForm.siteName"
            :placeholder="$t('请输入网站名称（将显示在登录页和后台标题）')"
          />
        </a-form-item>
        <a-form-item :label="$t('后台默认语言')">
          <a-select v-model:value="settingsForm.adminDefaultLocale" :options="localeSelectOptions" />
        </a-form-item>
        <a-form-item :label="$t('客户端默认语言')">
          <a-select v-model:value="settingsForm.clientDefaultLocale" :options="localeSelectOptions" />
        </a-form-item>
        <a-form-item :label="$t('语言配置')">
          <div class="locale-config-panel">
            <div class="locale-config-toolbar">
              <a-select
                v-model:value="presetLocaleToAdd"
                :options="availablePresetOptions"
                :placeholder="$t('请选择语言')"
                style="width: 240px"
              />
              <a-button @click="handleAddPresetLocale">{{ $t('添加预设语言') }}</a-button>
            </div>
            <div class="locale-config-toolbar">
              <a-input
                v-model:value="customLocale.code"
                :placeholder="$t('语言代码，如 ja-JP')"
                style="width: 180px"
              />
              <a-input
                v-model:value="customLocale.label"
                :placeholder="$t('语言显示名称')"
                style="width: 220px"
              />
              <a-select
                v-model:value="customLocale.fallback"
                :options="fallbackOptions"
                style="width: 160px"
              />
              <a-button @click="handleAddCustomLocale">{{ $t('添加自定义语言') }}</a-button>
            </div>
            <a-table
              size="small"
              :pagination="false"
              :data-source="settingsForm.localeCatalog"
              :columns="localeColumns"
              row-key="code"
            />
          </div>
        </a-form-item>
        <a-form-item :label="$t('启用语言')">
          <a-checkbox-group v-model:value="settingsForm.enabledLocales" :options="localeCheckboxOptions" />
        </a-form-item>
        <a-form-item :label="$t('i18n 内容')">
          <div class="i18n-entry">
            <div class="i18n-entry__copy">
              <div class="i18n-entry__title">{{ $t('i18n 内容已迁移到独立菜单') }}</div>
              <div class="i18n-entry__desc">{{ $t('现在可在专属页面按后台/客户端、语言、状态集中维护翻译词条') }}</div>
            </div>
            <a-button type="primary" @click="router.push('/system/i18n')">
              {{ $t('前往 i18n 内容') }}
            </a-button>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4, span: 12 }">
          <a-button type="primary" html-type="submit" :loading="loading">
            {{ $t('保存设置') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { getSettingsApi, updateSettingsApi, uploadLogoApi } from '@/api/system'
import { bootstrapI18n, useI18n } from '@/i18n'
import { useSystemStore } from '@/stores/system'
import { LOCALE_PRESETS, parseLocaleCatalog } from '@/utils/i18n-content'

const loading = ref(false)
const logoUploading = ref(false)
const logoPreview = ref('')
const systemStore = useSystemStore()
const router = useRouter()
const { t, setLocale, locale } = useI18n()

const presetLocaleToAdd = ref<string>()
const customLocale = reactive({ code: '', label: '', fallback: 'en-US' })

const settingsForm = reactive({
  siteName: '',
  adminDefaultLocale: 'zh-CN',
  clientDefaultLocale: 'zh-CN',
  enabledLocales: ['zh-CN', 'en-US'] as string[],
  localeCatalog: [] as Array<{ code: string; label: string; fallback?: string }>,
})

const localeSelectOptions = computed(() =>
  settingsForm.enabledLocales
    .map((code) => settingsForm.localeCatalog.find((item) => item.code === code))
    .filter(Boolean)
    .map((item) => ({ label: item!.label, value: item!.code })),
)

const localeCheckboxOptions = computed(() =>
  settingsForm.localeCatalog.map((item) => ({ label: item.label, value: item.code })),
)

const fallbackOptions = computed(() =>
  settingsForm.localeCatalog.map((item) => ({ label: item.label, value: item.code })),
)

const availablePresetOptions = computed(() =>
  LOCALE_PRESETS
    .filter((item) => !settingsForm.localeCatalog.some((current) => current.code === item.code))
    .map((item) => ({ label: `${item.label} (${item.code})`, value: item.code })),
)

const localeColumns = computed(() => [
  { title: t('语言代码'), dataIndex: 'code', width: 140 },
  { title: t('语言显示名称'), dataIndex: 'label', width: 220 },
  {
    title: t('回退语言'),
    key: 'fallback',
    width: 180,
    customRender: ({ record }: any) => record.fallback || 'en-US',
  },
  {
    title: t('启用'),
    key: 'enabled',
    width: 100,
    customRender: ({ record }: any) => settingsForm.enabledLocales.includes(record.code) ? t('是') : t('否'),
  },
  {
    title: t('操作'),
    key: 'action',
    width: 100,
    customRender: ({ record }: any) => record.code === 'zh-CN'
      ? t('内置')
      : h('a', { onClick: () => removeLocale(record.code) }, t('删除')),
  },
])

function ensureLocaleExists(code: string) {
  if (!settingsForm.localeCatalog.some((item) => item.code === code)) {
    settingsForm.localeCatalog.push({
      code,
      label: code,
      fallback: code === 'zh-CN' ? 'zh-CN' : 'en-US',
    })
  }
}

async function fetchSettings() {
  try {
    const res: any = await getSettingsApi()
    settingsForm.siteName = res.data?.siteName || ''
    logoPreview.value = res.data?.site_logo || ''
    settingsForm.localeCatalog = parseLocaleCatalog(res.data?.locale_catalog)
    settingsForm.adminDefaultLocale = res.data?.admin_default_locale || res.data?.default_locale || 'zh-CN'
    settingsForm.clientDefaultLocale = res.data?.client_default_locale || res.data?.default_locale || 'zh-CN'
    settingsForm.enabledLocales = String(res.data?.enabled_locales || 'zh-CN,en-US')
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean)
    ensureLocaleExists(settingsForm.adminDefaultLocale)
    ensureLocaleExists(settingsForm.clientDefaultLocale)
  } catch { /* 拦截器处理 */ }
}

function handleAddPresetLocale() {
  if (!presetLocaleToAdd.value) return
  const preset = LOCALE_PRESETS.find((item) => item.code === presetLocaleToAdd.value)
  if (!preset) return
  settingsForm.localeCatalog.push({ ...preset })
  presetLocaleToAdd.value = undefined
}

function handleAddCustomLocale() {
  const code = customLocale.code.trim()
  const label = customLocale.label.trim()
  if (!/^[a-z]{2,3}-[A-Z]{2}$/.test(code)) {
    message.warning(t('语言代码格式不正确'))
    return
  }
  if (!label) {
    message.warning(t('请填写语言显示名称'))
    return
  }
  if (settingsForm.localeCatalog.some((item) => item.code === code)) {
    message.warning(t('该语言已存在'))
    return
  }
  settingsForm.localeCatalog.push({ code, label, fallback: customLocale.fallback })
  customLocale.code = ''
  customLocale.label = ''
  customLocale.fallback = 'en-US'
}

function removeLocale(code: string) {
  settingsForm.localeCatalog = settingsForm.localeCatalog
    .filter((item) => item.code !== code)
    .map((item) => ({
      ...item,
      fallback: item.fallback === code ? (item.code === 'zh-CN' ? 'zh-CN' : 'en-US') : item.fallback,
    }))
  settingsForm.enabledLocales = settingsForm.enabledLocales.filter((item) => item !== code)
  if (settingsForm.adminDefaultLocale === code) settingsForm.adminDefaultLocale = 'zh-CN'
  if (settingsForm.clientDefaultLocale === code) settingsForm.clientDefaultLocale = 'zh-CN'
}

async function handleLogoUpload(file: File) {
  logoUploading.value = true
  try {
    const res: any = await uploadLogoApi(file)
    if (res.data?.url) {
      logoPreview.value = res.data.url
      message.success(t('LOGO 上传成功'))
      systemStore.fetchSettings()
    }
  } catch { /* 拦截器处理 */ } finally {
    logoUploading.value = false
  }
  return false
}

async function handleSave() {
  if (settingsForm.enabledLocales.length === 0) {
    message.warning(t('至少启用一种语言'))
    return
  }
  if (!settingsForm.enabledLocales.includes(settingsForm.adminDefaultLocale)) {
    message.warning(t('后台默认语言必须是启用语言'))
    return
  }
  if (!settingsForm.enabledLocales.includes(settingsForm.clientDefaultLocale)) {
    message.warning(t('客户端默认语言必须是启用语言'))
    return
  }
  loading.value = true
  try {
    await updateSettingsApi({
      siteName: settingsForm.siteName,
      admin_default_locale: settingsForm.adminDefaultLocale,
      client_default_locale: settingsForm.clientDefaultLocale,
      enabled_locales: settingsForm.enabledLocales.join(','),
      locale_catalog: JSON.stringify(settingsForm.localeCatalog),
      default_locale: settingsForm.clientDefaultLocale,
    })
    message.success(t('系统设置已更新'))
    systemStore.fetchSettings()
    const currentLocale = locale.value
    await bootstrapI18n()
    setLocale(currentLocale)
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

.locale-config-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.locale-config-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.i18n-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid #e6f4ff;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5fbff 0%, #f9f0ff 100%);
}

.i18n-entry__copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.i18n-entry__title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
}

.i18n-entry__desc {
  font-size: 13px;
  color: #595959;
}

.logo-preview {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.logo-placeholder {
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
