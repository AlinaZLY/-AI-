<template>
  <div>
    <a-page-header :title="$t('仪表盘')" :sub-title="$t('系统数据概览')">
      <template #extra>
        <a-space>
          <a-radio-group v-model:value="dateMode" button-style="solid" size="small" @change="onDateModeChange">
            <a-radio-button value="today">{{ $t('今日') }}</a-radio-button>
            <a-radio-button value="week">{{ $t('近7天') }}</a-radio-button>
            <a-radio-button value="month">{{ $t('近30天') }}</a-radio-button>
            <a-radio-button value="custom">{{ $t('自定义') }}</a-radio-button>
          </a-radio-group>
          <a-range-picker
            v-if="dateMode === 'custom'"
            v-model:value="dateRange"
            size="small"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="fetchStats"
          />
          <a-button size="small" @click="fetchStats"><ReloadOutlined /></a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <div class="stat-grid">
        <div v-for="card in statCards" :key="card.label" class="stat-card" :style="{ '--c': card.color }">
          <div class="stat-card-header">
            <component :is="card.icon" class="stat-card-icon" />
            <span class="stat-card-label">{{ card.label }}</span>
          </div>
          <div class="stat-card-value">{{ card.value }}</div>
          <div class="stat-card-footer">
            <template v-if="card.range !== undefined">
              <span class="stat-card-range">
                {{ $t('总计') }}：{{ card.total }}
              </span>
            </template>
            <span v-else class="stat-card-range">&nbsp;</span>
          </div>
        </div>
      </div>

      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <a-col :span="12">
          <a-card :title="$t('帖子分类分布')" size="small">
            <v-chart :option="categoryChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card :title="$t('帖子审核状态')" size="small">
            <v-chart :option="statusChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <a-col :span="16">
          <a-card :title="$t('数据趋势')" size="small">
            <v-chart :option="trendChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card :title="$t('用户角色分布')" size="small">
            <v-chart :option="roleChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import {
  TeamOutlined, ThunderboltOutlined, FileTextOutlined, MessageOutlined,
  SolutionOutlined, RocketOutlined, SendOutlined, BankOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { getDashboardStatsApi } from '@/api/system'

use([CanvasRenderer, PieChart, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const { t } = useI18n()
const loading = ref(false)
const dateMode = ref<'today' | 'week' | 'month' | 'custom'>('month')
const dateRange = ref<[string, string] | null>(null)

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10)
}
function getDateParams(): { startDate?: string; endDate?: string } {
  const now = new Date()
  if (dateMode.value === 'today') {
    const d = formatDate(now)
    return { startDate: d, endDate: d }
  }
  if (dateMode.value === 'week') {
    const start = new Date(now); start.setDate(start.getDate() - 6)
    return { startDate: formatDate(start), endDate: formatDate(now) }
  }
  if (dateMode.value === 'month') {
    const start = new Date(now); start.setDate(start.getDate() - 29)
    return { startDate: formatDate(start), endDate: formatDate(now) }
  }
  if (dateMode.value === 'custom' && dateRange.value) {
    return { startDate: dateRange.value[0], endDate: dateRange.value[1] }
  }
  return {}
}

const stats = reactive({
  totalUsers: 0, activeUsers: 0, totalPosts: 0, pendingPosts: 0, approvedPosts: 0, rejectedPosts: 0,
  totalComments: 0, totalResumes: 0, totalApplications: 0, totalJobs: 0, totalCompanies: 0,
  todayPosts: 0, todayComments: 0, todayUsers: 0,
  rangeUsers: 0, rangePosts: 0, rangeComments: 0, rangeResumes: 0, rangeApplications: 0, rangeJobs: 0, rangeCompanies: 0,
  rangePending: 0, rangeApproved: 0, rangeRejected: 0,
  categoryStats: [] as { name: string; count: number }[],
  roleStats: [] as { role: string; count: number }[],
  trend: { posts: [], comments: [], users: [] } as {
    posts: { date: string; count: number }[];
    comments: { date: string; count: number }[];
    users: { date: string; count: number }[];
  },
})

interface StatCard {
  label: string
  value: number
  total: number
  today?: number
  range?: number
  color: string
  icon: any
}

const statCards = computed<StatCard[]>(() => {
  const cards = [
    { label: t('注册用户'), total: stats.totalUsers, range: stats.rangeUsers, color: '#1677ff', icon: TeamOutlined },
    { label: t('活跃用户'), total: stats.activeUsers, color: '#722ed1', icon: ThunderboltOutlined },
    { label: t('帖子总数'), total: stats.totalPosts, range: stats.rangePosts, color: '#13c2c2', icon: FileTextOutlined },
    { label: t('评论总数'), total: stats.totalComments, range: stats.rangeComments, color: '#52c41a', icon: MessageOutlined },
    { label: t('简历总数'), total: stats.totalResumes, range: stats.rangeResumes, color: '#fa8c16', icon: SolutionOutlined },
    { label: t('职位总数'), total: stats.totalJobs, range: stats.rangeJobs, color: '#eb2f96', icon: RocketOutlined },
    { label: t('投递总数'), total: stats.totalApplications, range: stats.rangeApplications, color: '#2f54eb', icon: SendOutlined },
    { label: t('企业总数'), total: stats.totalCompanies, range: stats.rangeCompanies, color: '#faad14', icon: BankOutlined },
  ]
  return cards.map((c) => ({
    ...c,
    value: c.range !== undefined ? c.range : c.total,
  }))
})

function onDateModeChange() {
  if (dateMode.value !== 'custom') fetchStats()
}

const categoryColors = ['#1677ff', '#722ed1', '#52c41a', '#fa8c16', '#13c2c2', '#eb2f96', '#faad14']
const categoryChartOption = computed(() => {
  const data = stats.categoryStats.length > 0
    ? stats.categoryStats.map((c, i) => ({
        value: c.count, name: c.name,
        itemStyle: { color: categoryColors[i % categoryColors.length] },
      }))
    : [{ value: 1, name: t('暂无数据'), itemStyle: { color: '#d9d9d9' } }]
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 12 } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false }, data,
    }],
  }
})

const statusChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: [t('已通过'), t('待审核'), t('已拒绝')], axisLabel: { fontSize: 12 } },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar', barWidth: 40,
    itemStyle: { borderRadius: [6, 6, 0, 0] },
    data: [
      { value: stats.rangeApproved ?? stats.approvedPosts ?? 0, itemStyle: { color: '#52c41a' } },
      { value: stats.rangePending ?? stats.pendingPosts ?? 0, itemStyle: { color: '#faad14' } },
      { value: stats.rangeRejected ?? stats.rejectedPosts ?? 0, itemStyle: { color: '#ff4d4f' } },
    ],
  }],
}))

const trendDates = computed(() => {
  if (stats.trend.posts.length > 0) {
    return stats.trend.posts.map((p) => p.date.slice(5))
  }
  const result: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    result.push(`${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  return result
})
const trendChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: [t('帖子'), t('评论'), t('用户')], bottom: 0 },
  grid: { top: 20, right: 20, bottom: 40, left: 40 },
  xAxis: { type: 'category', data: trendDates.value, boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    { name: t('帖子'), type: 'line', smooth: true, data: stats.trend.posts.map((p) => p.count), areaStyle: { opacity: 0.1 }, lineStyle: { color: '#1677ff' }, itemStyle: { color: '#1677ff' } },
    { name: t('评论'), type: 'line', smooth: true, data: stats.trend.comments.map((c) => c.count), areaStyle: { opacity: 0.1 }, lineStyle: { color: '#52c41a' }, itemStyle: { color: '#52c41a' } },
    { name: t('用户'), type: 'line', smooth: true, data: stats.trend.users.map((u) => u.count), areaStyle: { opacity: 0.1 }, lineStyle: { color: '#fa8c16' }, itemStyle: { color: '#fa8c16' } },
  ],
}))

const roleColors: Record<string, string> = { 学生: '#1677ff', 企业: '#52c41a', 管理员: '#ff4d4f', Student: '#1677ff', Enterprise: '#52c41a', Admin: '#ff4d4f' }
const roleChartOption = computed(() => {
  const data = stats.roleStats.length > 0
    ? stats.roleStats.map((r) => ({
        value: r.count, name: t(r.role),
        itemStyle: { color: roleColors[r.role] ?? '#8c8c8c' },
      }))
    : [{ value: 1, name: t('暂无数据'), itemStyle: { color: '#d9d9d9' } }]
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie', radius: '60%',
      label: { formatter: '{b}\n{d}%', fontSize: 12 }, data,
    }],
  }
})

async function fetchStats() {
  loading.value = true
  try {
    const params = getDateParams()
    const res = await getDashboardStatsApi(params)
    Object.assign(stats, res.data)
  } catch { /* defaults */ }
  finally { loading.value = false }
}

onMounted(fetchStats)
</script>

<style scoped lang="less">
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  aspect-ratio: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    border-color: var(--c);
  }

  .stat-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .stat-card-icon {
    font-size: 18px;
    color: var(--c);
    padding: 6px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--c) 10%, transparent);
  }

  .stat-card-label {
    font-size: 13px;
    color: #8c8c8c;
  }

  .stat-card-value {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-card-footer {
    min-height: 18px;
  }

  .stat-card-range {
    font-size: 12px;
    color: #8c8c8c;
    display: inline-flex;
    align-items: center;
    gap: 2px;

    &.positive {
      color: #52c41a;
    }
  }
}

@media (max-width: 1200px) {
  .stat-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 900px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
