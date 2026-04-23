<template>
  <div class="page-shell space-y-6 py-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('我的工作台') }}</h1>
      <p class="text-sm text-gray-500">{{ $t('面试提醒、待办事项、投递数据一览') }}</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else>
      <!-- 统计卡片 -->
      <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <div class="text-xs text-gray-400">{{ $t('投递总数') }}</div>
          <div class="mt-1 text-2xl font-bold text-gray-900">{{ dashboard.total || 0 }}</div>
        </div>
        <div class="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <div class="text-xs text-blue-500">{{ $t('进行中') }}</div>
          <div class="mt-1 text-2xl font-bold text-blue-700">{{ tagCount('in_progress') }}</div>
        </div>
        <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <div class="text-xs text-emerald-500">{{ $t('已通过') }}</div>
          <div class="mt-1 text-2xl font-bold text-emerald-700">{{ tagCount('passed') }}</div>
        </div>
        <div class="rounded-xl bg-red-50 border border-red-100 p-4">
          <div class="text-xs text-red-500">{{ $t('已失败') }}</div>
          <div class="mt-1 text-2xl font-bold text-red-700">{{ tagCount('failed') }}</div>
        </div>
      </section>

      <!-- 待办事项 + 面试提醒 -->
      <section class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500" />
            {{ $t('面试提醒 & 待办') }}
          </h2>
          <div v-if="!upcoming.length" class="py-8 text-center text-sm text-gray-400">
            {{ $t('暂无近期安排') }}
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="item in upcoming"
              :key="item.id"
              class="flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              @click="router.push('/applications')"
            >
              <div class="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg text-white text-center leading-tight"
                :class="urgencyClass(item.nextDate)">
                <span class="text-lg font-bold">{{ dayOfMonth(item.nextDate) }}</span>
                <span class="text-[10px]">{{ monthLabel(item.nextDate) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate">{{ item.company }} · {{ item.position }}</div>
                <div class="text-xs text-gray-400 flex gap-2 mt-0.5">
                  <span :class="statusBadgeClass(item.status)" class="px-1.5 py-0.5 rounded text-[10px] font-medium">{{ statusLabel(item.status) }}</span>
                  <span>{{ relativeDate(item.nextDate) }}</span>
                </div>
              </div>
              <svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>

        <!-- 公司分布 -->
        <div class="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500" />
            {{ $t('投递公司分布') }}
          </h2>
          <div v-if="!dashboard.byCompany?.length" class="py-8 text-center text-sm text-gray-400">
            {{ $t('暂无数据') }}
          </div>
          <div ref="companyChartRef" class="h-64" />
        </div>
      </section>

      <!-- 投递趋势 -->
      <section class="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
        <h2 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cyan-500" />
          {{ $t('近30天投递趋势') }}
        </h2>
        <div v-if="!dashboard.trend?.length" class="py-8 text-center text-sm text-gray-400">
          {{ $t('暂无数据') }}
        </div>
        <div ref="trendChartRef" class="h-64" />
      </section>

      <!-- 状态漏斗 -->
      <section class="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
        <h2 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-violet-500" />
          {{ $t('投递状态分布') }}
        </h2>
        <div v-if="!dashboard.byStatus?.length" class="py-8 text-center text-sm text-gray-400">
          {{ $t('暂无数据') }}
        </div>
        <div ref="statusChartRef" class="h-64" />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { useI18n } from '@/i18n'
import * as echarts from 'echarts/core'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([PieChart, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

const router = useRouter()
const { t } = useI18n()

const loading = ref(true)
const dashboard = ref<any>({})
const upcoming = computed<any[]>(() => dashboard.value.upcoming || [])

const companyChartRef = ref<HTMLElement | null>(null)
const trendChartRef = ref<HTMLElement | null>(null)
const statusChartRef = ref<HTMLElement | null>(null)

let companyChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null
let statusChart: echarts.ECharts | null = null

const STATUS_MAP: Record<string, string> = {
  pending: '待筛选', written_test: '笔试', first_interview: '一面',
  second_interview: '二面', hr_interview: 'HR面', offer: 'Offer', rejected: '拒信',
}
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', written_test: '#3b82f6', first_interview: '#06b6d4',
  second_interview: '#14b8a6', hr_interview: '#6366f1', offer: '#10b981', rejected: '#ef4444',
}

function statusLabel(s: string) { return t(STATUS_MAP[s] || s) }
function statusBadgeClass(s: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700', written_test: 'bg-blue-50 text-blue-700',
    first_interview: 'bg-cyan-50 text-cyan-700', second_interview: 'bg-teal-50 text-teal-700',
    hr_interview: 'bg-indigo-50 text-indigo-700', offer: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  }
  return map[s] || 'bg-gray-100 text-gray-600'
}
function tagCount(tag: string) {
  return Number(dashboard.value.byTag?.find((i: any) => i.tag === tag)?.count || 0)
}
function dayOfMonth(d: string) { return new Date(d).getDate() }
function monthLabel(d: string) { return `${new Date(d).getMonth() + 1}${t('月')}` }
function relativeDate(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  if (diff <= 0) return t('今天')
  if (diff === 1) return t('明天')
  return t('{n}天后', { n: diff }).replace('{n}', String(diff))
}
function urgencyClass(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  if (diff <= 0) return 'bg-red-500'
  if (diff <= 2) return 'bg-amber-500'
  return 'bg-blue-500'
}

function renderCharts() {
  if (companyChartRef.value && dashboard.value.byCompany?.length) {
    companyChart = echarts.init(companyChartRef.value)
    companyChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie', radius: ['40%', '70%'], padAngle: 2, itemStyle: { borderRadius: 6 },
        data: dashboard.value.byCompany.map((c: any) => ({ name: c.company, value: +c.count })),
        label: { show: true, formatter: '{b}', fontSize: 12 },
      }],
    })
  }

  if (trendChartRef.value && dashboard.value.trend?.length) {
    trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: { type: 'category', data: dashboard.value.trend.map((t: any) => t.date.slice(5)), axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{
        type: 'line', data: dashboard.value.trend.map((t: any) => +t.count),
        smooth: true, areaStyle: { color: 'rgba(59,130,246,0.1)' },
        lineStyle: { color: '#3b82f6', width: 2 }, itemStyle: { color: '#3b82f6' },
      }],
    })
  }

  if (statusChartRef.value && dashboard.value.byStatus?.length) {
    statusChart = echarts.init(statusChartRef.value)
    statusChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 80, right: 20, top: 10, bottom: 30 },
      yAxis: {
        type: 'category', inverse: true,
        data: dashboard.value.byStatus.map((s: any) => t(STATUS_MAP[s.status] || s.status)),
        axisLabel: { fontSize: 12 },
      },
      xAxis: { type: 'value', minInterval: 1 },
      series: [{
        type: 'bar', barWidth: 18, itemStyle: { borderRadius: [0, 4, 4, 0] },
        data: dashboard.value.byStatus.map((s: any) => ({
          value: +s.count, itemStyle: { color: STATUS_COLORS[s.status] || '#94a3b8' },
        })),
      }],
    })
  }
}

function handleResize() {
  companyChart?.resize()
  trendChart?.resize()
  statusChart?.resize()
}

onMounted(async () => {
  try {
    const res: any = await request.get('/applications/dashboard')
    dashboard.value = res.data || res || {}
  } catch { dashboard.value = {} }
  finally { loading.value = false }
  await nextTick()
  renderCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  companyChart?.dispose()
  trendChart?.dispose()
  statusChart?.dispose()
})
</script>
