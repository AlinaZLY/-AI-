<template>
  <div class="interview-record-manage">
    <a-page-header title="面试记录管理" sub-title="查看与管理模拟面试记录">
    </a-page-header>

    <!-- 统计卡片 -->
    <a-row :gutter="12" style="margin-bottom: 16px">
      <a-col :span="6" v-for="stat in statCards" :key="stat.label">
        <a-card size="small">
          <a-statistic :title="stat.label" :value="stat.value" :value-style="{ fontSize: '20px', color: stat.color }" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <a-space>
        <a-input-search
          v-model:value="filters.keyword"
          placeholder="搜索用户/岗位"
          style="width: 220px"
          allow-clear
          @search="handleSearch"
        />
        <a-select v-model:value="filters.status" placeholder="状态筛选" style="width: 130px" allow-clear @change="handleSearch">
          <a-select-option value="in_progress">进行中</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
          <a-select-option value="abandoned">已放弃</a-select-option>
        </a-select>
      </a-space>
    </div>

    <!-- 列表表格 -->
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="pagination"
      :custom-row="customRow"
      row-key="id"
      size="middle"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'user'">
          <a-space>
            <a-avatar :size="32" :src="record.user?.avatar">{{ (record.user?.nickname || record.user?.username || '?')[0] }}</a-avatar>
            <span>{{ record.user?.nickname || record.user?.username || '-' }}</span>
          </a-space>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'score'">
          {{ record.totalScore ?? '-' }}
        </template>
        <template v-if="column.key === 'answered'">
          {{ record.answeredCount ?? 0 }} / {{ record.questionCount ?? 0 }}
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0" @click.stop>
            <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
            <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="detailVisible"
      :title="`面试记录 #${currentInterview?.id}`"
      width="640"
      :destroy-on-close="true"
    >
      <template v-if="currentInterview">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="用户">
            <a-space>
              <a-avatar :size="28" :src="currentInterview.user?.avatar">{{ (currentInterview.user?.nickname || currentInterview.user?.username || '?')[0] }}</a-avatar>
              {{ currentInterview.user?.nickname || currentInterview.user?.username || '-' }}
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="岗位">{{ currentInterview.jobTitle || '-' }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="statusColor(currentInterview.status)">{{ statusLabel(currentInterview.status) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="得分">{{ currentInterview.totalScore ?? '-' }}</a-descriptions-item>
          <a-descriptions-item label="题目数">{{ currentInterview.questionCount ?? 0 }}</a-descriptions-item>
          <a-descriptions-item label="已回答">{{ currentInterview.answeredCount ?? 0 }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ formatTime(currentInterview.createdAt) }}</a-descriptions-item>
          <a-descriptions-item label="总体评价" :span="2">
            <div v-if="currentInterview.overallFeedback" style="white-space: pre-wrap; color: #333">{{ currentInterview.overallFeedback }}</div>
            <span v-else>-</span>
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>题目与回答</a-divider>
        <div v-for="(q, idx) in (currentInterview.questions || [])" :key="q.id" class="question-block">
          <div class="question-header">
            <a-tag color="blue">{{ idx + 1 }}</a-tag>
            <strong>{{ q.question }}</strong>
            <a-tag v-if="q.isAnswered" color="green" size="small">已答</a-tag>
            <a-tag v-else color="default" size="small">未答</a-tag>
          </div>
          <div v-if="q.answer" class="answer-section">
            <div class="label">回答：</div>
            <div class="content">{{ q.answer }}</div>
          </div>
          <div v-if="q.isAnswered" class="score-section">
            <span class="label">得分：</span>
            <span>{{ q.score ?? '-' }}</span>
            <template v-if="q.dimensionScores && Object.keys(q.dimensionScores).length">
              <span class="label" style="margin-left: 12px">维度：</span>
              <a-tag v-for="(v, k) in q.dimensionScores" :key="k" size="small">{{ k }}: {{ v }}</a-tag>
            </template>
          </div>
          <div v-if="q.feedback" class="feedback-section">
            <div class="label">评价：</div>
            <div class="content" style="white-space: pre-wrap">{{ q.feedback }}</div>
          </div>
        </div>
        <a-empty v-if="!currentInterview.questions?.length" description="暂无题目" />
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  getInterviewsAdminApi,
  getInterviewDetailAdminApi,
  deleteInterviewAdminApi,
  getInterviewStatsApi,
} from '@/api/interview'

const loading = ref(false)
const list = ref<any[]>([])
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })
const filters = reactive({ keyword: '', status: undefined as string | undefined })

function statusLabel(s: string) {
  const map: Record<string, string> = { in_progress: '进行中', completed: '已完成', abandoned: '已放弃' }
  return map[s] || s
}
function statusColor(s: string) {
  const map: Record<string, string> = { in_progress: 'processing', completed: 'success', abandoned: 'default' }
  return map[s] || 'default'
}

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '用户', key: 'user', width: 160 },
  { title: '岗位', dataIndex: 'jobTitle', ellipsis: true },
  { title: '状态', key: 'status', width: 90 },
  { title: '得分', key: 'score', width: 70 },
  { title: '题目/已回答', key: 'answered', width: 100 },
  { title: '创建时间', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

// 统计
const statsData = ref<any>({})
const statCards = computed(() => {
  const d = statsData.value
  return [
    { label: '总面试数', value: d.total ?? 0, color: '#1677ff' },
    { label: '已完成', value: d.completed ?? 0, color: '#52c41a' },
    { label: '进行中', value: d.inProgress ?? 0, color: '#1677ff' },
    { label: '平均分', value: d.avgScore ?? 0, color: '#722ed1' },
  ]
})

// 详情
const detailVisible = ref(false)
const currentInterview = ref<any>(null)

async function fetchList() {
  loading.value = true
  try {
    const res = await getInterviewsAdminApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: filters.keyword || undefined,
      status: filters.status,
    })
    list.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch {
    message.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const res = await getInterviewStatsApi()
    statsData.value = res.data || {}
  } catch {
    /* ignore */
  }
}

function customRow(record: any) {
  return { onClick: () => showDetail(record) }
}

function handleSearch() {
  pagination.current = 1
  fetchList()
}
function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchList()
}

async function showDetail(record: any) {
  detailVisible.value = true
  try {
    const res = await getInterviewDetailAdminApi(record.id)
    currentInterview.value = res.data
  } catch {
    message.error('获取详情失败')
  }
}

async function handleDelete(id: number) {
  try {
    await deleteInterviewAdminApi(id)
    message.success('已删除')
    fetchList()
    fetchStats()
  } catch {
    message.error('删除失败')
  }
}

onMounted(() => {
  fetchList()
  fetchStats()
})
</script>

<style scoped lang="less">
.interview-record-manage {
  .toolbar {
    margin-bottom: 16px;
  }

  :deep(.ant-table-row) {
    cursor: pointer;
  }

  .question-block {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    &:last-child {
      border-bottom: none;
    }
  }

  .question-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .answer-section,
  .score-section,
  .feedback-section {
    margin-top: 8px;
    font-size: 13px;
  }

  .label {
    color: #666;
    margin-right: 4px;
  }

  .content {
    color: #333;
    line-height: 1.6;
    margin-top: 4px;
  }
}
</style>
