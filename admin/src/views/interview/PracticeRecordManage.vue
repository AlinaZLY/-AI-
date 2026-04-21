<template>
  <div class="practice-record-manage">
    <a-page-header :title="$t('练习记录管理')" :sub-title="$t('查看用户在题库的练习答题记录')" />

    <a-row :gutter="12" style="margin-bottom: 16px">
      <a-col :span="8">
        <a-card size="small">
          <a-statistic :title="$t('总练习次数')" :value="adminStats.totalRecords" :value-style="{ fontSize: '20px', color: '#1677ff' }" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small">
          <a-statistic :title="$t('参与用户数')" :value="adminStats.totalUsers" :value-style="{ fontSize: '20px', color: '#52c41a' }" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small">
          <a-statistic :title="$t('平均分')" :value="adminStats.avgScore" :value-style="{ fontSize: '20px', color: '#fa8c16' }" />
        </a-card>
      </a-col>
    </a-row>

    <div class="toolbar" style="margin-bottom: 16px">
      <a-input-search
        v-model:value="keyword"
        :placeholder="$t('搜索用户/题目')"
        style="width: 260px"
        allow-clear
        @search="handleSearch"
      />
    </div>

    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      size="middle"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'user'">
          <a-space>
            <a-avatar :size="28" :src="record.user?.avatar">{{ (record.user?.nickname || record.user?.username || '?')[0] }}</a-avatar>
            <span>{{ record.user?.nickname || record.user?.username || '-' }}</span>
          </a-space>
        </template>
        <template v-if="column.key === 'question'">
          <div style="max-width: 280px" class="truncate">{{ record.question?.question || $t('题目已删除') }}</div>
        </template>
        <template v-if="column.key === 'questionType'">
          <a-tag :color="typeColor(record.question?.questionType)" size="small">{{ typeLabel(record.question?.questionType) }}</a-tag>
        </template>
        <template v-if="column.key === 'score'">
          <span :style="{ color: record.score >= 80 ? '#52c41a' : record.score >= 60 ? '#fa8c16' : '#ff4d4f', fontWeight: 600 }">{{ record.score }}</span>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button type="link" size="small" @click="showDetail(record)">{{ $t('详情') }}</a-button>
            <a-popconfirm :title="$t('确定删除此记录？')" @confirm="handleDelete(record.id)">
              <a-button type="link" size="small" danger>{{ $t('删除') }}</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="detailVisible" :title="$t('练习详情')" :footer="null" width="600px">
      <template v-if="currentRecord">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item :label="$t('用户')">
            <a-space>
              <a-avatar :size="28" :src="currentRecord.user?.avatar">{{ (currentRecord.user?.nickname || currentRecord.user?.username || '?')[0] }}</a-avatar>
              {{ currentRecord.user?.nickname || currentRecord.user?.username || '-' }}
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('得分')">
            <span :style="{ color: currentRecord.score >= 80 ? '#52c41a' : currentRecord.score >= 60 ? '#fa8c16' : '#ff4d4f', fontWeight: 600, fontSize: '18px' }">{{ currentRecord.score }}</span>
            <span style="color: #999; font-size: 12px"> / 100</span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('题型')">
            <a-tag :color="typeColor(currentRecord.question?.questionType)">{{ typeLabel(currentRecord.question?.questionType) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('时间')">{{ formatTime(currentRecord.createdAt) }}</a-descriptions-item>
        </a-descriptions>

        <div style="margin-top: 16px; padding: 12px; background: #fafafa; border-radius: 8px">
          <div style="font-weight: 600; margin-bottom: 8px">{{ $t('题目') }}</div>
          <div>{{ currentRecord.question?.question || $t('题目已删除') }}</div>
        </div>

        <div style="margin-top: 12px; padding: 12px; background: #f0f5ff; border-radius: 8px">
          <div style="font-weight: 600; margin-bottom: 8px">{{ $t('用户回答') }}</div>
          <div style="white-space: pre-wrap">{{ currentRecord.answer || '-' }}</div>
        </div>

        <div v-if="currentRecord.dimensionScores && Object.keys(currentRecord.dimensionScores).length" style="margin-top: 12px">
          <div style="font-weight: 600; margin-bottom: 8px">{{ $t('维度评分') }}</div>
          <a-space wrap>
            <a-tag v-for="(v, k) in currentRecord.dimensionScores" :key="k" :color="v >= 80 ? 'green' : v >= 60 ? 'orange' : 'red'">{{ k }}: {{ v }}</a-tag>
          </a-space>
        </div>

        <div v-if="currentRecord.feedback" style="margin-top: 12px; padding: 12px; background: #f6ffed; border-radius: 8px; border: 1px solid #d9f7be">
          <div style="font-weight: 600; margin-bottom: 8px">{{ $t('AI 反馈') }}</div>
          <div style="white-space: pre-wrap; color: #333">{{ currentRecord.feedback }}</div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getPracticeRecordsAdminApi, getPracticeStatsAdminApi, deletePracticeRecordApi } from '@/api/interview'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const loading = ref(false)
const list = ref<any[]>([])
const keyword = ref('')
const pagination = reactive({ current: 1, pageSize: 15, total: 0, showSizeChanger: true, showTotal: (total: number) => t('共 {count} 条', { count: total }) })
const adminStats = ref({ totalRecords: 0, totalUsers: 0, avgScore: 0 })
const detailVisible = ref(false)
const currentRecord = ref<any>(null)

const columns = computed(() => [
  { title: t('用户'), key: 'user', width: 160 },
  { title: t('题目'), key: 'question', ellipsis: true },
  { title: t('题型'), key: 'questionType', width: 80 },
  { title: t('得分'), key: 'score', width: 70 },
  { title: t('时间'), key: 'createdAt', width: 150 },
  { title: t('操作'), key: 'action', width: 120 },
])

function typeLabel(questionType?: string) {
  const labels: Record<string, string> = { open: '开放题', choice: '选择题', judgment: '判断题', short_answer: '简答题' }
  return t(labels[questionType || ''] || '未知')
}
function typeColor(questionType?: string) {
  return { open: 'default', choice: 'blue', judgment: 'orange', short_answer: 'green' }[questionType || ''] || 'default'
}
function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getPracticeRecordsAdminApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: keyword.value.trim() || undefined,
    })
    const data = res.data ?? res
    list.value = data.list || []
    pagination.total = data.total || 0
  } catch { list.value = [] }
  finally { loading.value = false }
}

async function fetchStats() {
  try {
    const res: any = await getPracticeStatsAdminApi()
    adminStats.value = res.data ?? res
  } catch { /* keep defaults */ }
}

function handleSearch() { pagination.current = 1; fetchList() }
function handleTableChange(pag: any) { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

function showDetail(record: any) {
  currentRecord.value = record
  detailVisible.value = true
}

async function handleDelete(id: number) {
  try {
    await deletePracticeRecordApi(id)
    message.success(t('已删除'))
    fetchList()
    fetchStats()
  } catch { message.error(t('删除失败')) }
}

onMounted(() => { fetchList(); fetchStats() })
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
