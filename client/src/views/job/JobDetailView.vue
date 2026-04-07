<template>
  <div class="page-shell max-w-4xl mx-auto">
    <!-- 加载中 -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-gray-500 mb-4">{{ error }}</p>
      <button @click="router.back()" class="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">{{ $t('返回') }}</button>
    </div>

    <!-- 职位详情 -->
    <template v-else-if="job">
      <!-- 返回导航 -->
      <button @click="router.back()" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        {{ $t('返回') }}
      </button>

      <!-- 头部信息卡片 -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ job.title }}</h1>
            <div class="flex flex-wrap gap-2 mb-3">
              <span v-if="job.salaryMin || job.salaryMax" class="text-lg font-bold text-emerald-600">{{ formatSalary(job.salaryMin, job.salaryMax) }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-if="job.location" class="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs">{{ job.location }}</span>
              <span v-if="job.workType" class="px-2.5 py-1 rounded-lg text-xs font-medium" :class="workTypeClass(job.workType)">{{ workTypeLabel(job.workType) }}</span>
              <span v-if="job.positionType" class="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs">{{ job.positionType }}</span>
              <span v-if="job.education" class="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs">{{ job.education }}</span>
              <span v-if="job.headcount" class="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs">{{ $t('招 {n} 人', { n: job.headcount }) }}</span>
            </div>
          </div>
          <div class="shrink-0 flex flex-col items-end gap-2">
            <button v-if="appliedJobIds.has(job.id)" disabled class="px-6 py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">{{ $t('已沟通') }}</button>
            <button v-else @click="goChat" class="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">{{ $t('立即沟通') }}</button>
          </div>
        </div>

        <!-- 元信息 -->
        <div class="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <span v-if="job.viewCount != null">{{ $t('浏览 {n} 次', { n: job.viewCount }) }}</span>
          <span v-if="job.applicationCount != null">{{ $t('{n} 人投递', { n: job.applicationCount }) }}</span>
          <span v-if="job.deadline">{{ $t('截止日期：') }}{{ formatDate(job.deadline) }}</span>
          <span>{{ $t('发布于 ') }}{{ formatDate(job.createdAt) }}</span>
        </div>
      </div>

      <!-- 企业信息 -->
      <div class="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
            {{ (job.user?.nickname || job.companyName || '企').charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <router-link
              :to="companyLink"
              class="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >{{ job.companyName || $t('未知企业') }}</router-link>
            <p v-if="job.user?.nickname" class="text-xs text-gray-400">{{ $t('招聘方：') }}{{ job.user.nickname }}</p>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="parsedTags.length" class="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">{{ $t('职位标签') }}</h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in parsedTags" :key="tag" class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">{{ tag }}</span>
        </div>
      </div>

      <!-- 岗位描述 -->
      <div v-if="job.description" class="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">{{ $t('岗位描述') }}</h2>
        <p class="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{{ job.description }}</p>
      </div>

      <!-- 任职要求 -->
      <div v-if="job.requirements" class="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">{{ $t('任职要求') }}</h2>
        <p class="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{{ job.requirements }}</p>
      </div>

      <!-- 福利待遇 -->
      <div v-if="job.benefits" class="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">{{ $t('福利待遇') }}</h2>
        <p class="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{{ job.benefits }}</p>
      </div>

      <!-- 底部沟通按钮 -->
      <div class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm text-center">
        <p class="text-sm text-gray-500 mb-3">{{ $t('对这个职位感兴趣？') }}</p>
        <button v-if="appliedJobIds.has(job.id)" disabled class="px-8 py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">{{ $t('已沟通') }}</button>
        <button v-else @click="goChat" class="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">{{ $t('立即沟通') }}</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getJobDetailApi } from '@/api/job'
import request from '@/utils/request'
import toast from '@/utils/toast'
import { useI18n } from '@/i18n'

const route = useRoute()
const router = useRouter()
const { t, formatDateTime } = useI18n()

const job = ref<any>(null)
const loading = ref(true)
const error = ref('')
const appliedJobIds = ref(new Set<number>())

const parsedTags = computed(() => {
  if (!job.value?.tags) return []
  return (Array.isArray(job.value.tags) ? job.value.tags : (job.value.tags || '').split(',')).filter(Boolean)
})

const companyLink = computed(() => {
  if (!job.value) return '/companies'
  return job.value.companyId
    ? `/companies/${job.value.companyId}`
    : { path: '/companies', query: { keyword: job.value.companyName } }
})

function workTypeLabel(wt: string) {
  return ({ full_time: t('全职'), part_time: t('兼职'), intern: t('实习'), campus: t('校招') } as Record<string, string>)[wt] || wt
}
function workTypeClass(wt: string) {
  return ({ full_time: 'bg-blue-50 text-blue-600', part_time: 'bg-amber-50 text-amber-600', intern: 'bg-purple-50 text-purple-600', campus: 'bg-emerald-50 text-emerald-600' } as Record<string, string>)[wt] || 'bg-gray-100 text-gray-600'
}
function formatSalary(min?: number, max?: number) {
  if (!min && !max) return ''
  if (min && max) return `${(min / 1000).toFixed(0)}-${(max / 1000).toFixed(0)}K`
  if (min) return `${(min / 1000).toFixed(0)}K+`
  if (max) return `Up to ${(max / 1000).toFixed(0)}K`
  return ''
}
function formatDate(d: string) { return formatDateTime(d, { year: 'numeric', month: '2-digit', day: '2-digit' }) }

function goChat() {
  const token = localStorage.getItem('token')
  if (!token) {
    toast(t('请先登录后再沟通'), 'warning')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  if (!job.value?.user?.id) {
    toast(t('该职位暂无联系人'), 'warning')
    return
  }
  router.push({
    path: '/chat',
    query: {
      userId: String(job.value.user.id),
      jobId: String(job.value.id),
      message: t('你好，我对「{title}」这个职位很感兴趣，想了解一下！').replace('{title}', job.value.title),
    },
  })
}

async function fetchAppliedJobs() {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const res: any = await request.get('/applications', { params: { pageSize: 100 } })
    const list = res.data?.list || res.list || []
    appliedJobIds.value = new Set(list.filter((a: any) => a.jobId).map((a: any) => a.jobId))
  } catch { /* ignore */ }
}

async function fetchJob() {
  loading.value = true
  error.value = ''
  try {
    const id = Number(route.params.id)
    if (!id || isNaN(id)) { error.value = t('无效的职位ID'); return }
    const res: any = await getJobDetailApi(id)
    job.value = res.data || res
  } catch (e: any) {
    error.value = e?.response?.data?.message || t('加载职位详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchJob()
  fetchAppliedJobs()
})
</script>
