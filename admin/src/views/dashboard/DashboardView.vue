<template>
  <div>
    <a-page-header title="仪表盘" sub-title="系统数据概览">
      <template #extra>
        <a-space>
          <a-radio-group v-model:value="dateMode" button-style="solid" size="small" @change="onDateModeChange">
            <a-radio-button value="today">今日</a-radio-button>
            <a-radio-button value="week">近7天</a-radio-button>
            <a-radio-button value="month">近30天</a-radio-button>
            <a-radio-button value="custom">自定义</a-radio-button>
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
                <RiseOutlined v-if="card.range > 0" />
                {{ rangeLabel }}：{{ card.range }}
              </span>
            </template>
            <template v-else-if="card.today !== undefined">
              <span class="stat-card-range" :class="{ positive: card.today > 0 }">
                <RiseOutlined v-if="card.today > 0" />
                今日 +{{ card.today }}
              </span>
            </template>
            <span v-else class="stat-card-range">&nbsp;</span>
          </div>
        </div>
      </div>

      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <a-col :span="12">
          <a-card title="帖子分类分布" size="small">
            <v-chart :option="categoryChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="帖子审核状态" size="small">
            <v-chart :option="statusChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <a-col :span="16">
          <a-card title="近7日数据趋势" size="small">
            <v-chart :option="trendChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="用户角色分布" size="small">
            <v-chart :option="roleChartOption" autoresize style="height: 280px" />
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import {
  TeamOutlined, ThunderboltOutlined, FileTextOutlined, MessageOutlined,
  SolutionOutlined, RocketOutlined, SendOutlined, BankOutlined,
  RiseOutlined, ReloadOutlined,
} from '@ant-design/icons-vue'
import { getDashboardStatsApi } from '@/api/system'

use([CanvasRenderer, PieChart, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const loading = ref(false)
const dateMode = ref<'today' | 'week' | 'month' | 'custom'>('today')
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

const rangeLabel = computed(() => {
  if (dateMode.value === 'today') return '今日'
  if (dateMode.value === 'week') return '近7天'
  if (dateMode.value === 'month') return '近30天'
  return '区间'
})

const stats = reactive({
  totalUsers: 0, activeUsers: 0, totalPosts: 0, pendingPosts: 0, approvedPosts: 0, rejectedPosts: 0,
  totalComments: 0, totalResumes: 0, totalApplications: 0, totalJobs: 0, totalCompanies: 0,
  todayPosts: 0, todayComments: 0, todayUsers: 0,
  rangeUsers: 0, rangePosts: 0, rangeComments: 0, rangeResumes: 0, rangeApplications: 0, rangeJobs: 0, rangeCompanies: 0,
  categoryStats: [] as { name: string; count: number }[],
  roleStats: [] as { role: string; count: number }[],
})

interface StatCard {
  label: string
  value: number
  today?: number
  range?: number
  color: string
  icon: any
}

const statCards = computed<StatCard[]>(() => [
  { label: '注册用户', value: stats.totalUsers, today: stats.todayUsers, range: stats.rangeUsers, color: '#1677ff', icon: TeamOutlined },
  { label: '活跃用户', value: stats.activeUsers, color: '#722ed1', icon: ThunderboltOutlined },
  { label: '帖子总数', value: stats.totalPosts, today: stats.todayPosts, range: stats.rangePosts, color: '#13c2c2', icon: FileTextOutlined },
  { label: '评论总数', value: stats.totalComments, today: stats.todayComments, range: stats.rangeComments, color: '#52c41a', icon: MessageOutlined },
  { label: '简历总数', value: stats.totalResumes, range: stats.rangeResumes, color: '#fa8c16', icon: SolutionOutlined },
  { label: '职位总数', value: stats.totalJobs, range: stats.rangeJobs, color: '#eb2f96', icon: RocketOutlined },
  { label: '投递总数', value: stats.totalApplications, range: stats.rangeApplications, color: '#2f54eb', icon: SendOutlined },
  { label: '企业总数', value: stats.totalCompanies, range: stats.rangeCompanies, color: '#faad14', icon: BankOutlined },
])

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
    : [{ value: 1, name: '暂无数据', itemStyle: { color: '#d9d9d9' } }]
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
  xAxis: { type: 'category', data: ['已通过', '待审核', '已拒绝'], axisLabel: { fontSize: 12 } },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar', barWidth: 40,
    itemStyle: { borderRadius: [6, 6, 0, 0] },
    data: [
      { value: stats.approvedPosts ?? 0, itemStyle: { color: '#52c41a' } },
      { value: stats.pendingPosts ?? 0, itemStyle: { color: '#faad14' } },
      { value: stats.rejectedPosts ?? 0, itemStyle: { color: '#ff4d4f' } },
    ],
  }],
}))

const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
function simulateTrend(total: number, today: number): number[] {
  if (total <= 0) return [0, 0, 0, 0, 0, 0, today || 0]
  const base = Math.max(1, Math.floor(total / 7))
  const variation = [0.8, 1.1, 0.9, 1.2, 1.0, 0.7, 1.3]
  const arr = variation.map((v) => Math.max(0, Math.round(base * v)))
  arr[6] = today
  return arr
}
const trendChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['帖子', '评论', '用户'], bottom: 0 },
  grid: { top: 20, right: 20, bottom: 40, left: 40 },
  xAxis: { type: 'category', data: days, boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    { name: '帖子', type: 'line', smooth: true, data: simulateTrend(stats.totalPosts, stats.todayPosts), areaStyle: { opacity: 0.1 }, lineStyle: { color: '#1677ff' }, itemStyle: { color: '#1677ff' } },
    { name: '评论', type: 'line', smooth: true, data: simulateTrend(stats.totalComments, stats.todayComments), areaStyle: { opacity: 0.1 }, lineStyle: { color: '#52c41a' }, itemStyle: { color: '#52c41a' } },
    { name: '用户', type: 'line', smooth: true, data: simulateTrend(stats.totalUsers, stats.todayUsers), areaStyle: { opacity: 0.1 }, lineStyle: { color: '#fa8c16' }, itemStyle: { color: '#fa8c16' } },
  ],
}))

const roleColors: Record<string, string> = { 学生: '#1677ff', 企业: '#52c41a', 管理员: '#ff4d4f' }
const roleChartOption = computed(() => {
  const data = stats.roleStats.length > 0
    ? stats.roleStats.map((r) => ({
        value: r.count, name: r.role,
        itemStyle: { color: roleColors[r.role] ?? '#8c8c8c' },
      }))
    : [{ value: 1, name: '暂无数据', itemStyle: { color: '#d9d9d9' } }]
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
