<template>
  <div class="interview-record-manage">
    <a-page-header title="面试记录管理" sub-title="查看与管理模拟面试记录" />

    <a-row :gutter="12" style="margin-bottom: 16px">
      <a-col :span="6" v-for="stat in statCards" :key="stat.label">
        <a-card size="small">
          <a-statistic :title="stat.label" :value="stat.value" :value-style="{ fontSize: '20px', color: stat.color }" />
        </a-card>
      </a-col>
    </a-row>

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
            <a-avatar :size="32" :src="record.user?.avatar">{{ avatarText(record.user) }}</a-avatar>
            <span>{{ displayUser(record.user) }}</span>
          </a-space>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'score'">
          <span :class="['score-text', scoreClass(record.totalScore)]">{{ formatScore(record.totalScore) }}</span>
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

    <a-drawer
      v-model:open="detailVisible"
      class="interview-result-drawer"
      width="980"
      :destroy-on-close="true"
      :body-style="{ padding: 0, background: '#f5f7fb' }"
    >
      <template #title>
        <div class="drawer-title">
          <span>{{ currentInterview?.jobTitle || '模拟面试' }}</span>
          <a-tag v-if="currentInterview" :color="statusColor(currentInterview.status)">{{ statusLabel(currentInterview.status) }}</a-tag>
        </div>
      </template>

      <a-spin :spinning="detailLoading">
        <template v-if="currentInterview">
          <section class="result-hero">
            <div class="hero-main">
              <div class="hero-kicker">面试最终报告</div>
              <h2>{{ currentInterview.jobTitle || '模拟面试' }}</h2>
              <p>{{ currentInterview.overallFeedback || emptyFeedbackText }}</p>
              <div class="hero-tags">
                <a-tag color="blue">记录 #{{ currentInterview.id }}</a-tag>
                <a-tag color="cyan">{{ formatTime(currentInterview.createdAt) }} 开始</a-tag>
                <a-tag color="purple">{{ formatTime(currentInterview.updatedAt) }} 更新</a-tag>
              </div>
            </div>
            <div class="score-panel">
              <a-progress
                type="circle"
                :percent="normalizedScore"
                :width="132"
                :stroke-color="scoreStroke"
                :format="() => formatScore(currentInterview.totalScore)"
              />
              <div class="score-caption">{{ scoreLevel(currentInterview.totalScore) }}</div>
            </div>
          </section>

          <section class="detail-grid">
            <div class="main-column">
              <a-card class="section-card" size="small">
                <template #title>完成情况</template>
                <a-row :gutter="12">
                  <a-col :span="8">
                    <div class="metric">
                      <span>题目总数</span>
                      <strong>{{ currentInterview.questionCount ?? questionCount }}</strong>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="metric">
                      <span>已回答</span>
                      <strong>{{ currentInterview.answeredCount ?? answeredCount }}</strong>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="metric">
                      <span>完成率</span>
                      <strong>{{ answerRate }}%</strong>
                    </div>
                  </a-col>
                </a-row>
                <a-progress :percent="answerRate" :show-info="false" :stroke-color="answerRate >= 100 ? '#52c41a' : '#1677ff'" />
              </a-card>

              <a-card class="section-card" size="small">
                <template #title>能力维度</template>
                <div v-if="dimensionEntries.length" class="dimension-list">
                  <div v-for="item in dimensionEntries" :key="item.name" class="dimension-row">
                    <div class="dimension-head">
                      <span>{{ item.name }}</span>
                      <strong>{{ item.score }}</strong>
                    </div>
                    <a-progress :percent="item.score" :show-info="false" :stroke-color="dimensionColor(item.score)" />
                  </div>
                </div>
                <a-empty v-else description="暂无维度评分" />
              </a-card>

              <a-card class="section-card" size="small">
                <template #title>题目与回答</template>
                <a-collapse v-if="questionCount" v-model:activeKey="activeQuestionKeys" ghost>
                  <a-collapse-panel v-for="(q, idx) in currentInterview.questions" :key="String(q.id)" class="question-panel">
                    <template #header>
                      <div class="question-title">
                        <a-tag :color="q.isAnswered ? 'green' : 'default'">第 {{ idx + 1 }} 题</a-tag>
                        <span>{{ q.question }}</span>
                      </div>
                    </template>
                    <div class="question-meta">
                      <a-tag>{{ questionTypeLabel(q.questionType) }}</a-tag>
                      <a-tag color="geekblue">{{ questionSourceLabel(q.questionSource) }}</a-tag>
                      <a-tag v-if="q.answerType === 'voice'" color="purple">语音 {{ q.voiceDuration || 0 }} 秒</a-tag>
                      <a-tag :color="q.isAnswered ? 'success' : 'default'">{{ q.isAnswered ? '已回答' : '未回答' }}</a-tag>
                      <span>创建：{{ formatTime(q.createdAt) }}</span>
                    </div>

                    <div class="qa-block question-block">
                      <div class="qa-label">题目</div>
                      <div class="qa-content">{{ q.question }}</div>
                    </div>
                    <div class="qa-block answer-block">
                      <div class="qa-label">候选人回答</div>
                      <div class="qa-content preline">{{ q.answer || '未作答' }}</div>
                    </div>
                    <div v-if="q.referenceAnswer" class="qa-block reference-block">
                      <div class="qa-label">参考答案</div>
                      <div class="qa-content preline">{{ q.referenceAnswer }}</div>
                    </div>

                    <div class="question-result">
                      <div class="question-score">
                        <span>本题得分</span>
                        <strong :class="scoreClass(q.score)">{{ q.isAnswered ? `${q.score ?? 0}/100` : '-' }}</strong>
                      </div>
                      <div v-if="dimensionEntriesOf(q).length" class="mini-dimensions">
                        <a-tag
                          v-for="item in dimensionEntriesOf(q)"
                          :key="item.name"
                          :color="tagColorByScore(item.score)"
                        >
                          {{ item.name }} {{ item.score }}
                        </a-tag>
                      </div>
                    </div>

                    <div v-if="q.feedback" class="qa-block feedback-block">
                      <div class="qa-label">AI 评价</div>
                      <div class="qa-content preline">{{ q.feedback }}</div>
                    </div>

                    <div v-if="q.voiceUrl" class="voice-link">
                      语音文件：<a :href="q.voiceUrl" target="_blank" rel="noopener noreferrer">{{ q.voiceUrl }}</a>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
                <a-empty v-else description="暂无题目" />
              </a-card>
            </div>

            <aside class="side-column">
              <a-card class="section-card" size="small">
                <template #title>候选人</template>
                <div class="person-card">
                  <a-avatar :size="48" :src="currentInterview.user?.avatar">{{ avatarText(currentInterview.user) }}</a-avatar>
                  <div>
                    <strong>{{ displayUser(currentInterview.user) }}</strong>
                    <span>ID：{{ currentInterview.userId }}</span>
                  </div>
                </div>
                <a-descriptions :column="1" size="small" class="compact-desc">
                  <a-descriptions-item label="用户名">{{ currentInterview.user?.username || '-' }}</a-descriptions-item>
                  <a-descriptions-item label="邮箱">{{ currentInterview.user?.email || '-' }}</a-descriptions-item>
                  <a-descriptions-item label="手机号">{{ currentInterview.user?.phone || '-' }}</a-descriptions-item>
                </a-descriptions>
              </a-card>

              <a-card class="section-card" size="small">
                <template #title>岗位信息</template>
                <a-descriptions :column="1" size="small" class="compact-desc">
                  <a-descriptions-item label="岗位">{{ currentInterview.jobTitle || '-' }}</a-descriptions-item>
                  <a-descriptions-item label="简历ID">{{ currentInterview.resumeId || '-' }}</a-descriptions-item>
                </a-descriptions>
                <div class="long-text">
                  <div class="long-text-title">JD 内容</div>
                  <div class="preline">{{ currentInterview.jobDescription || '未填写' }}</div>
                </div>
              </a-card>

              <a-card class="section-card" size="small">
                <template #title>关联简历</template>
                <template v-if="currentInterview.resume">
                  <a-descriptions :column="1" size="small" class="compact-desc">
                    <a-descriptions-item label="标题">{{ currentInterview.resume.title || '-' }}</a-descriptions-item>
                    <a-descriptions-item label="目标岗位">{{ currentInterview.resume.targetPosition || '-' }}</a-descriptions-item>
                  </a-descriptions>
                  <div class="long-text resume-content">
                    <div class="long-text-title">简历内容</div>
                    <div class="preline">{{ currentInterview.resume.content || '暂无内容' }}</div>
                  </div>
                </template>
                <a-empty v-else description="未关联简历" />
              </a-card>

              <a-card class="section-card" size="small">
                <template #title>出题策略</template>
                <div v-if="strategyEntries.length" class="strategy-list">
                  <div v-for="item in strategyEntries" :key="item.key">
                    <span>{{ item.key }}</span>
                    <strong>{{ item.value }}</strong>
                  </div>
                </div>
                <a-empty v-else description="暂无策略记录" />
              </a-card>
            </aside>
          </section>
        </template>
        <a-empty v-else class="detail-empty" description="请选择面试记录" />
      </a-spin>
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
const detailLoading = ref(false)
const list = ref<any[]>([])
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })
const filters = reactive({ keyword: '', status: undefined as string | undefined })

const detailVisible = ref(false)
const currentInterview = ref<any>(null)
const activeQuestionKeys = ref<string[]>([])

function statusLabel(s: string) {
  const map: Record<string, string> = { in_progress: '进行中', completed: '已完成', abandoned: '已放弃' }
  return map[s] || s || '-'
}

function statusColor(s: string) {
  const map: Record<string, string> = { in_progress: 'processing', completed: 'success', abandoned: 'default' }
  return map[s] || 'default'
}

function formatTime(time?: string) {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function displayUser(user?: any) {
  return user?.nickname || user?.username || '-'
}

function avatarText(user?: any) {
  return (user?.nickname || user?.username || '?').charAt(0)
}

function formatScore(score?: number | null) {
  if (score === null || score === undefined) return '-'
  return String(Math.round(Number(score) || 0))
}

function scoreClass(score?: number | null) {
  const value = Number(score) || 0
  if (value >= 80) return 'score-high'
  if (value >= 60) return 'score-mid'
  if (value > 0) return 'score-low'
  return 'score-empty'
}

function scoreLevel(score?: number | null) {
  const value = Number(score) || 0
  if (value >= 90) return '优秀'
  if (value >= 80) return '良好'
  if (value >= 60) return '合格'
  if (value > 0) return '待提升'
  return '暂无评分'
}

function questionTypeLabel(type?: string) {
  const map: Record<string, string> = {
    behavioral: '行为题',
    technical: '技术题',
    situational: '情景题',
    followup: '追问题',
    open: '开放题',
    choice: '选择题',
    judgment: '判断题',
    short_answer: '简答题',
  }
  return map[type || ''] || type || '未标记题型'
}

function questionSourceLabel(source?: string) {
  const map: Record<string, string> = {
    bank: '题库',
    jd_custom: 'JD 定制',
    resume_followup: '简历追问',
    followup: '动态追问',
  }
  return map[source || ''] || source || '未知来源'
}

function normalizeScore(score?: number | null) {
  return Math.max(0, Math.min(100, Math.round(Number(score) || 0)))
}

function dimensionColor(score: number) {
  if (score >= 80) return '#52c41a'
  if (score >= 60) return '#faad14'
  return '#ff4d4f'
}

function tagColorByScore(score: number) {
  if (score >= 80) return 'green'
  if (score >= 60) return 'orange'
  return 'red'
}

function entriesFromScores(scores?: Record<string, number>) {
  return Object.entries(scores || {}).map(([name, raw]) => ({ name, score: normalizeScore(raw) }))
}

function dimensionEntriesOf(question: any) {
  return entriesFromScores(question?.dimensionScores)
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

const questionCount = computed(() => currentInterview.value?.questions?.length || 0)
const answeredCount = computed(() => (currentInterview.value?.questions || []).filter((q: any) => q.isAnswered).length)
const answerRate = computed(() => {
  const total = currentInterview.value?.questionCount || questionCount.value
  if (!total) return 0
  return Math.round(((currentInterview.value?.answeredCount ?? answeredCount.value) / total) * 100)
})
const normalizedScore = computed(() => normalizeScore(currentInterview.value?.totalScore))
const scoreStroke = computed(() => dimensionColor(normalizedScore.value))
const dimensionEntries = computed(() => entriesFromScores(currentInterview.value?.dimensionScores))
const strategyEntries = computed(() => {
  const strategy = currentInterview.value?.questionStrategy || {}
  return Object.entries(strategy).map(([key, value]) => ({
    key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-'),
  }))
})
const emptyFeedbackText = computed(() => {
  if (currentInterview.value?.status === 'completed') return '本场面试暂无总体评价。'
  return '面试尚未完成，完成后会展示总分与总体评价。'
})

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
    /* keep current stats */
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
  detailLoading.value = true
  currentInterview.value = null
  activeQuestionKeys.value = []
  try {
    const res = await getInterviewDetailAdminApi(record.id)
    currentInterview.value = res.data
    activeQuestionKeys.value = (res.data?.questions || []).slice(0, 1).map((q: any) => String(q.id))
  } catch {
    message.error('获取详情失败')
  } finally {
    detailLoading.value = false
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
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #111827 0%, #1d4ed8 58%, #0891b2 100%);
  color: #fff;

  h2 {
    margin: 4px 0 8px;
    color: #fff;
    font-size: 24px;
    line-height: 1.3;
  }

  p {
    max-width: 680px;
    margin: 0;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.7;
    white-space: pre-line;
  }

  .hero-kicker {
    color: rgba(255, 255, 255, 0.66);
    font-size: 12px;
    letter-spacing: 0;
  }

  .hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
  }
}

.score-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 168px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);

  :deep(.ant-progress-text) {
    color: #fff !important;
    font-size: 26px;
    font-weight: 700;
  }
}

.score-caption {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 16px;
  padding: 16px;
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.section-card {
  border-radius: 8px;
  border: 1px solid #e8edf5;

  :deep(.ant-card-head) {
    min-height: 42px;
  }

  :deep(.ant-card-head-title) {
    font-weight: 700;
  }
}

.metric {
  padding: 12px;
  border-radius: 8px;
  background: #f7f9fc;

  span {
    display: block;
    color: #6b7280;
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 4px;
    color: #111827;
    font-size: 22px;
  }
}

.dimension-list {
  display: grid;
  gap: 12px;
}

.dimension-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  color: #374151;
  font-size: 13px;
}

.question-panel {
  margin-bottom: 10px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  background: #fff;
}

.question-title {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;

  span:last-child {
    line-height: 1.6;
  }
}

.question-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  color: #8c8c8c;
  font-size: 12px;
}

.qa-block {
  margin-top: 10px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eef2f7;
}

.question-block {
  background: #fafafa;
}

.answer-block {
  background: #f0f7ff;
  border-color: #d7e9ff;
}

.reference-block {
  background: #fffaf0;
  border-color: #ffe5b5;
}

.feedback-block {
  background: #f6ffed;
  border-color: #d9f7be;
}

.qa-label {
  margin-bottom: 6px;
  color: #667085;
  font-size: 12px;
  font-weight: 700;
}

.qa-content {
  color: #1f2937;
  line-height: 1.7;
}

.preline {
  white-space: pre-line;
}

.question-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f7f9fc;
}

.question-score {
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #667085;
    font-size: 12px;
  }

  strong {
    font-size: 18px;
  }
}

.mini-dimensions {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
}

.voice-link {
  margin-top: 10px;
  color: #667085;
  font-size: 12px;
  word-break: break-all;
}

.person-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  strong,
  span {
    display: block;
  }

  span {
    margin-top: 2px;
    color: #667085;
    font-size: 12px;
  }
}

.compact-desc {
  :deep(.ant-descriptions-item-label) {
    width: 74px;
    color: #667085;
  }
}

.long-text {
  margin-top: 10px;
  padding: 10px;
  max-height: 220px;
  overflow: auto;
  border-radius: 8px;
  background: #f7f9fc;
  color: #374151;
  line-height: 1.7;
}

.resume-content {
  max-height: 260px;
}

.long-text-title {
  margin-bottom: 6px;
  color: #667085;
  font-size: 12px;
  font-weight: 700;
}

.strategy-list {
  display: grid;
  gap: 8px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    background: #f7f9fc;
  }

  span {
    color: #667085;
  }

  strong {
    min-width: 0;
    color: #111827;
    font-weight: 600;
    overflow-wrap: anywhere;
    text-align: right;
  }
}

.score-text {
  font-weight: 700;
}

.score-high {
  color: #389e0d;
}

.score-mid {
  color: #d48806;
}

.score-low {
  color: #cf1322;
}

.score-empty {
  color: #8c8c8c;
}

.detail-empty {
  padding: 80px 0;
}

@media (max-width: 900px) {
  .result-hero,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    order: -1;
  }
}
</style>
