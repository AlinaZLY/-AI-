<template>
  <div class="i18n-page">
    <a-page-header :title="$t('i18n 内容')" :sub-title="$t('集中管理后台与客户端多语言词条')" />

    <div class="hero-panel">
      <div class="hero-panel__copy">
        <div class="hero-panel__title">{{ $t('翻译工作台') }}</div>
        <div class="hero-panel__desc">{{ $t('按作用端、语言版本和完成状态集中维护词条，保存后即时写入系统配置') }}</div>
      </div>
      <div class="hero-panel__controls">
        <a-radio-group v-model:value="editor.scope" button-style="solid">
          <a-radio-button value="admin">{{ $t('后台管理') }}</a-radio-button>
          <a-radio-button value="client">{{ $t('客户端') }}</a-radio-button>
        </a-radio-group>
        <a-select
          v-model:value="editor.locale"
          :options="localeOptions"
          :placeholder="$t('请选择语言')"
          style="width: 220px"
        />
        <a-input
          v-model:value="editor.keyword"
          allow-clear
          :placeholder="$t('搜索词条或翻译')"
          style="width: 260px"
        />
        <a-checkbox v-model:checked="editor.onlyPending">{{ $t('只看待补充') }}</a-checkbox>
        <a-button @click="fetchSettings" :loading="loading">{{ $t('刷新配置') }}</a-button>
        <a-button type="primary" @click="handleSave" :loading="saving">{{ $t('保存') }}</a-button>
      </div>
    </div>

    <div v-if="localeOptions.length > 0" class="summary-grid">
      <a-card size="small" class="summary-card">
        <a-statistic :title="$t('总词条数')" :value="stats.total" />
      </a-card>
      <a-card size="small" class="summary-card">
        <a-statistic :title="$t('已完成')" :value="stats.done" />
      </a-card>
      <a-card size="small" class="summary-card">
        <a-statistic :title="$t('待补充')" :value="stats.pending" />
      </a-card>
      <a-card size="small" class="summary-card summary-card--progress">
        <div class="summary-progress">
          <div class="summary-progress__label">{{ $t('完成度') }}</div>
          <div class="summary-progress__value">{{ stats.percent }}%</div>
          <a-progress :percent="stats.percent" :show-info="false" stroke-color="#1677ff" />
        </div>
      </a-card>
    </div>

    <a-card class="table-card">
      <template #title>
        <div class="table-card__title">
          <span>{{ currentScopeLabel }}</span>
          <a-tag color="blue">{{ currentLocaleLabel }}</a-tag>
        </div>
      </template>
      <template #extra>
        <span class="table-card__extra">
          {{ rows.length === allRows.length ? $t('共 {count} 条', { count: allRows.length }) : `${t('当前结果')} ${rows.length} / ${allRows.length}` }}
        </span>
      </template>

      <a-empty v-if="localeOptions.length === 0" :description="$t('请先添加非中文语言后再配置翻译')">
        <a-button type="primary" @click="router.push('/system/settings')">{{ $t('前往系统设置') }}</a-button>
      </a-empty>

      <a-table
        v-else
        size="middle"
        :loading="loading"
        :data-source="rows"
        :columns="columns"
        :row-class-name="getRowClassName"
        :pagination="{ pageSize: 12, showSizeChanger: true, pageSizeOptions: ['12', '24', '50'] }"
        :scroll="{ x: 1280 }"
        row-key="key"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'source'">
            <div class="source-cell" data-no-translate>
              <div class="source-cell__text">{{ record.key }}</div>
            </div>
          </template>

          <template v-else-if="column.key === 'reference'">
            <div class="reference-cell" data-no-translate>{{ record.reference || '-' }}</div>
          </template>

          <template v-else-if="column.key === 'translation'">
            <a-textarea
              :value="record.translation"
              :auto-size="{ minRows: 2, maxRows: 4 }"
              :placeholder="$t('请输入翻译内容')"
              @update:value="handleMessageInput(record.key, $event)"
            />
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.statusColor">{{ record.statusLabel }}</a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-button v-if="record.actionable" type="link" @click="resetRow(record)">
              {{ record.actionLabel }}
            </a-button>
            <span v-else class="action-placeholder">-</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getSettingsApi, updateSettingsApi } from '@/api/system'
import { bootstrapI18n, useI18n } from '@/i18n'
import {
  defaultMessageMap,
  parseI18nMessages,
  parseLocaleCatalog,
  serializeI18nMessages,
} from '@/utils/i18n-content'
import type { EditableMessageCatalog, I18nScope } from '@/utils/i18n-content'

interface LocaleCatalogItem {
  code: string
  label: string
  fallback?: string
}

interface I18nRow {
  key: string
  reference: string
  translation: string
  status: 'default' | 'overridden' | 'translated' | 'pending'
  statusLabel: string
  statusColor: string
  actionLabel: string
  actionable: boolean
}

const router = useRouter()
const { t, locale, setLocale } = useI18n()

const loading = ref(false)
const saving = ref(false)
const editor = reactive({
  scope: 'admin' as I18nScope,
  locale: 'en-US',
  keyword: '',
  onlyPending: false,
})

const state = reactive({
  localeCatalog: [] as LocaleCatalogItem[],
  adminMessages: { 'en-US': { ...defaultMessageMap.admin } } as EditableMessageCatalog,
  clientMessages: { 'en-US': { ...defaultMessageMap.client } } as EditableMessageCatalog,
})

const localeOptions = computed(() =>
  state.localeCatalog
    .filter((item) => item.code !== 'zh-CN')
    .map((item) => ({ label: `${item.label} (${item.code})`, value: item.code })),
)

const currentScopeLabel = computed(() =>
  editor.scope === 'admin' ? t('后台管理') : t('客户端'),
)

const currentLocaleLabel = computed(() =>
  localeOptions.value.find((item) => item.value === editor.locale)?.label || editor.locale,
)

const columns = computed(() => [
  { title: t('源文案'), key: 'source', dataIndex: 'key', width: 280, fixed: 'left' },
  { title: t('参考翻译'), key: 'reference', width: 280 },
  { title: t('当前翻译'), key: 'translation', width: 420 },
  { title: t('状态'), key: 'status', width: 120 },
  { title: t('操作'), key: 'action', width: 120, fixed: 'right' },
])

const allRows = computed<I18nRow[]>(() => {
  const scope = editor.scope
  const localeCode = editor.locale
  const baseMessages = defaultMessageMap[scope]
  const currentMessages = getScopeCatalog(scope)[localeCode] || (localeCode === 'en-US' ? { ...baseMessages } : {})
  const keys = Array.from(new Set([...Object.keys(baseMessages), ...Object.keys(currentMessages)]))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))

  return keys
    .map((key) => buildRow(scope, localeCode, key))
})

const rows = computed<I18nRow[]>(() => {
  const keyword = editor.keyword.trim().toLowerCase()

  return allRows.value
    .filter((row) => {
      if (editor.onlyPending && row.status !== 'pending') return false
      if (!keyword) return true
      return [row.key, row.reference, row.translation]
        .some((value) => String(value || '').toLowerCase().includes(keyword))
    })
})

const stats = computed(() => {
  const total = allRows.value.length
  const done = allRows.value.filter((item) => item.status === 'translated' || item.status === 'default' || item.status === 'overridden').length
  const pending = allRows.value.filter((item) => item.status === 'pending').length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return { total, done, pending, percent }
})

function getScopeCatalog(scope: I18nScope) {
  return scope === 'admin' ? state.adminMessages : state.clientMessages
}

function ensureLocaleCatalog(scope: I18nScope, localeCode: string) {
  const catalog = getScopeCatalog(scope)
  const baseMessages = defaultMessageMap[scope]
  if (!catalog[localeCode]) {
    catalog[localeCode] = localeCode === 'en-US' ? { ...baseMessages } : {}
  } else if (localeCode === 'en-US') {
    catalog[localeCode] = { ...baseMessages, ...catalog[localeCode] }
  }
  return catalog[localeCode]
}

function getFallbackLocale(localeCode: string) {
  return state.localeCatalog.find((item) => item.code === localeCode)?.fallback || 'en-US'
}

function getMessageValue(scope: I18nScope, localeCode: string, key: string) {
  const catalog = ensureLocaleCatalog(scope, localeCode)
  if (localeCode === 'en-US') {
    return catalog[key] ?? defaultMessageMap[scope][key] ?? ''
  }
  return catalog[key] ?? ''
}

function getReferenceTranslation(scope: I18nScope, localeCode: string, key: string) {
  if (localeCode === 'en-US') {
    return defaultMessageMap[scope][key] || ''
  }
  const fallbackLocale = getFallbackLocale(localeCode)
  return getMessageValue(scope, fallbackLocale, key) || defaultMessageMap[scope][key] || ''
}

function buildRow(scope: I18nScope, localeCode: string, key: string): I18nRow {
  const translation = getMessageValue(scope, localeCode, key)
  const reference = getReferenceTranslation(scope, localeCode, key)
  const baseTranslation = defaultMessageMap[scope][key] || ''

  if (localeCode === 'en-US') {
    const overridden = translation !== baseTranslation
    return {
      key,
      reference: baseTranslation,
      translation,
      status: overridden ? 'overridden' : 'default',
      statusLabel: overridden ? t('已覆盖') : t('默认'),
      statusColor: overridden ? 'gold' : 'blue',
      actionLabel: t('恢复默认'),
      actionable: overridden,
    }
  }

  const translated = Boolean(translation)
  return {
    key,
    reference,
    translation,
    status: translated ? 'translated' : 'pending',
    statusLabel: translated ? t('已翻译') : t('待补充'),
    statusColor: translated ? 'green' : 'orange',
    actionLabel: t('清空'),
    actionable: translated,
  }
}

function syncEditorLocale() {
  const firstLocale = localeOptions.value[0]?.value || 'en-US'
  if (!localeOptions.value.some((item) => item.value === editor.locale)) {
    editor.locale = firstLocale
  }
  if (localeOptions.value.length > 0) {
    ensureLocaleCatalog('admin', editor.locale)
    ensureLocaleCatalog('client', editor.locale)
  }
}

function handleMessageInput(key: string, value: string) {
  const scope = editor.scope
  const localeCode = editor.locale
  const catalog = ensureLocaleCatalog(scope, localeCode)
  const nextValue = String(value || '').trim()

  if (localeCode === 'en-US') {
    catalog[key] = nextValue || defaultMessageMap[scope][key] || ''
    return
  }

  if (!nextValue) {
    delete catalog[key]
    return
  }
  catalog[key] = nextValue
}

function resetRow(row: I18nRow) {
  const catalog = ensureLocaleCatalog(editor.scope, editor.locale)
  if (editor.locale === 'en-US') {
    catalog[row.key] = defaultMessageMap[editor.scope][row.key] || ''
  } else {
    delete catalog[row.key]
  }
}

function getRowClassName(record: I18nRow) {
  if (record.status === 'pending') return 'row-pending'
  if (record.status === 'overridden') return 'row-overridden'
  return ''
}

async function fetchSettings() {
  loading.value = true
  try {
    const res: any = await getSettingsApi()
    state.localeCatalog = parseLocaleCatalog(res.data?.locale_catalog)
    state.adminMessages = parseI18nMessages(res.data?.admin_i18n_messages, 'admin')
    state.clientMessages = parseI18nMessages(res.data?.client_i18n_messages, 'client')
    syncEditorLocale()
  } catch { /* 拦截器处理 */ } finally {
    loading.value = false
  }
}

async function handleSave() {
  saving.value = true
  try {
    await updateSettingsApi({
      admin_i18n_messages: serializeI18nMessages(state.adminMessages, 'admin', state.localeCatalog),
      client_i18n_messages: serializeI18nMessages(state.clientMessages, 'client', state.localeCatalog),
    })
    message.success(t('翻译已保存'))
    const currentLocale = locale.value
    await bootstrapI18n()
    setLocale(currentLocale)
  } catch { /* 拦截器处理 */ } finally {
    saving.value = false
  }
}

watch([() => editor.scope, localeOptions], () => {
  syncEditorLocale()
}, { immediate: true })

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped lang="less">
.i18n-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border-radius: 16px;
  background:
    radial-gradient(circle at top left, rgba(22, 119, 255, 0.18), transparent 42%),
    linear-gradient(135deg, #ffffff 0%, #f5faff 52%, #f8f3ff 100%);
  border: 1px solid #e6f4ff;
}

.hero-panel__copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-panel__title {
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
}

.hero-panel__desc {
  max-width: 620px;
  font-size: 14px;
  line-height: 1.6;
  color: #595959;
}

.hero-panel__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
  border-radius: 14px;
}

.summary-card--progress {
  overflow: hidden;
}

.summary-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-progress__label {
  font-size: 14px;
  color: #595959;
}

.summary-progress__value {
  font-size: 28px;
  font-weight: 700;
  color: #1677ff;
}

.table-card :deep(.ant-card-head) {
  border-bottom: none;
}

.table-card :deep(.ant-table-thead > tr > th) {
  background: #f7fbff;
  font-weight: 600;
}

.table-card :deep(.row-pending > td) {
  background: #fffaf0;
}

.table-card :deep(.row-overridden > td) {
  background: #fffbe6;
}

.table-card__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.table-card__extra {
  color: #8c8c8c;
  font-size: 13px;
}

.source-cell__text,
.reference-cell {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.source-cell__text {
  color: #262626;
  font-weight: 500;
}

.reference-cell {
  color: #595959;
}

.action-placeholder {
  color: #bfbfbf;
}

@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    padding: 18px;
  }

  .hero-panel__controls {
    justify-content: flex-start;
  }
}
</style>
