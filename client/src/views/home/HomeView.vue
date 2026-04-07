<template>
  <div class="home-tech relative">
    <!-- Hero：左文案 + 右插画（大屏双栏，小屏单列） -->
    <section class="px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-14">
      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- 左侧文案 -->
          <div class="text-center lg:text-left">
            <p class="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-blue-600/80 mb-3">{{ $t('AI 校园招聘') }}</p>
            <h1 class="text-2xl sm:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900 mb-3 leading-snug">
              {{ $t('找工作，直接跟') }}<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">{{ $t('老板谈') }}</span>
            </h1>
            <p class="text-gray-500 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 mb-6 leading-relaxed">
              {{ $t('智能面试模拟 · 简历优化 · 投递追踪 · 求职社区 — 先搜职位，再一键发起沟通。') }}
            </p>

            <div class="max-w-xl mx-auto lg:mx-0 mb-5">
              <div class="flex rounded-xl border border-blue-100 bg-white/90 backdrop-blur p-1 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/5">
                <input
                  v-model="heroSearch"
                  type="search"
                  :placeholder="$t('搜索职位、公司、岗位关键词...')"
                  class="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none"
                  @keyup.enter="goSearch"
                />
                <button
                  type="button"
                  class="shrink-0 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all shadow-md shadow-blue-500/25"
                  @click="goSearch"
                >
                  {{ $t('搜索') }}
                </button>
              </div>
            </div>

            <div class="flex flex-wrap justify-center lg:justify-start items-center gap-2 mb-6">
              <span class="text-xs text-gray-400 w-full lg:w-auto lg:mr-1">{{ $t('热门：') }}</span>
              <button
                v-for="tag in hotTags"
                :key="tag"
                type="button"
                class="px-3 py-1 text-xs text-gray-600 bg-white/80 border border-gray-200/80 rounded-full hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                @click="heroSearch = tag; goSearch()"
              >
                {{ $t(tag) }}
              </button>
            </div>

            <div class="flex justify-center lg:justify-start gap-3 flex-wrap">
              <router-link
                to="/jobs"
                class="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:border-blue-300 hover:bg-blue-50/80 transition-colors"
              >{{ $t('职位列表') }}</router-link>
              <router-link
                to="/interview"
                class="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >{{ $t('AI 模拟面试') }}</router-link>
            </div>
          </div>

          <!-- 右侧插画 -->
          <div class="hidden lg:flex justify-center items-center p-4">
            <img
              src="https://stories.freepiklabs.com/storage/1485/Job-Hunt-01.svg"
              alt="Career illustration"
              class="w-full max-w-lg drop-shadow-xl"
              @error="onHeroImgError"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 数据条：极简栅格 -->
      <section class="py-5 mb-6 border-b border-gray-100" aria-label="平台数据概览">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 max-w-3xl mx-auto sm:max-w-none">
          <div v-for="s in platformStats" :key="s.label" class="text-center sm:text-left">
            <div class="text-lg sm:text-xl font-semibold text-blue-600 tabular-nums">{{ s.value }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ $t(s.label) }}</div>
          </div>
        </div>
      </section>

      <!-- 能力入口：一行四格，弱边框 -->
      <section class="mb-8">
        <h2 class="sr-only">核心能力入口</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <router-link
            v-for="f in features"
            :key="f.title"
            :to="f.link"
            class="group flex items-start gap-2.5 rounded-lg bg-white border border-gray-200 p-3 hover:border-blue-200 transition-colors"
          >
            <div class="w-8 h-8 rounded-md flex items-center justify-center shrink-0" :style="{ background: f.bg }">
              <svg class="w-4 h-4" :style="{ color: f.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="f.path" />
              </svg>
            </div>
            <div class="min-w-0 text-left">
              <h3 class="text-sm font-medium text-gray-900 group-hover:text-blue-600 leading-tight">{{ $t(f.title) }}</h3>
              <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ $t(f.desc) }}</p>
            </div>
          </router-link>
        </div>
      </section>

      <!-- 双栏：职位 + 讨论 -->
      <div class="space-y-10 mb-12">
        <section>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-slate-900 inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" aria-hidden="true" />
              {{ $t('最新职位') }}
            </h2>
            <router-link to="/jobs" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ $t('查看全部') }}</router-link>
          </div>
          <div v-if="jobsLoading" class="flex justify-center py-12">
            <div class="animate-spin w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full" />
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="job in latestJobs"
              :key="job.id"
              class="rounded-xl border border-slate-200/90 bg-white p-5 hover:border-blue-300/70 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer"
              @click="$router.push(`/jobs/${job.id}`)"
            >
              <div class="flex justify-between items-start gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-slate-900 text-base leading-snug mb-1.5">{{ job.title }}</h3>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-if="job.location" class="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded">{{ job.location }}</span>
                    <span v-if="job.workType" class="text-xs px-2 py-0.5 rounded font-medium" :class="workTypeClass(job.workType)">{{ workTypeLabel(job.workType) }}</span>
                    <span v-if="job.positionType" class="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded">{{ positionTypeLabel(job.positionType) }}</span>
                  </div>
                </div>
                <span v-if="job.salaryMin && job.salaryMax" class="shrink-0 text-sm font-bold text-emerald-600 tabular-nums">{{ job.salaryMin }}-{{ job.salaryMax }}K</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {{ (job.user?.nickname || job.companyName || '企').charAt(0) }}
                    </div>
                    <div>
                      <router-link
                        :to="job.companyId ? `/companies/${job.companyId}` : { path: '/companies', query: { keyword: job.companyName } }"
                        class="text-sm font-medium text-slate-700 hover:text-blue-600"
                        @click.stop
                      >
                        {{ job.companyName }}
                      </router-link>
                      <div class="text-xs text-slate-400">{{ job.user?.nickname || $t('招聘方') }}</div>
                    </div>
                  </div>
                </div>
                <button
                  v-if="appliedJobIds.has(job.id)"
                  class="text-xs px-4 py-1.5 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed whitespace-nowrap"
                  disabled @click.stop
                >{{ $t('已沟通') }}</button>
                <button
                  v-else
                  class="text-xs px-4 py-1.5 rounded-lg font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all whitespace-nowrap"
                  @click.stop="handleChat(job)"
                >{{ $t('立即沟通') }}</button>
              </div>
            </div>
          </div>
          <div v-if="!jobsLoading && latestJobs.length === 0" class="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-white">{{ $t('暂无职位') }}</div>
        </section>

        <section>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-slate-900 inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-600" aria-hidden="true" />
              {{ $t('热门讨论') }}
            </h2>
            <router-link to="/community" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ $t('查看全部') }}</router-link>
          </div>
          <div v-if="postsLoading" class="flex justify-center py-12">
            <div class="animate-spin w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="post in hotPosts"
              :key="post.id"
              class="rounded-xl border border-slate-200/90 bg-white p-4 hover:border-blue-300/70 hover:shadow-md transition-all cursor-pointer"
              @click="$router.push(`/community/post/${post.id}`)"
            >
              <h3 class="font-semibold text-slate-900 text-sm mb-1.5 line-clamp-2">{{ post.title }}</h3>
              <p class="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-2.5">{{ stripHtml(post.content) }}</p>
              <div class="flex items-center gap-3 text-xs text-slate-400">
                <span>{{ post.author?.nickname || $t('匿名') }}</span>
                <span>{{ post.likeCount || 0 }} {{ $t('赞') }}</span>
                <span>{{ post.commentCount || 0 }} {{ $t('评') }}</span>
              </div>
            </div>
          </div>
          <div v-if="!postsLoading && hotPosts.length === 0" class="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-white">{{ $t('暂无帖子') }}</div>
        </section>
      </div>

      <section class="relative overflow-hidden rounded-2xl border border-blue-500/25 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-10 text-center mb-10 shadow-xl shadow-blue-900/30">
        <div class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.25),transparent_50%)]" aria-hidden="true" />
        <div class="relative z-10">
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">{{ $t('开启你的校招主线任务') }}</h2>
          <p class="text-slate-300 text-sm mb-6 max-w-md mx-auto">{{ $t('注册后可同步投递、消息沟通与 AI 面试记录，全链路留在同一科技蓝工作台。') }}</p>
          <div class="flex justify-center gap-3 flex-wrap">
            <router-link
              to="/register"
              class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20"
            >{{ $t('免费注册') }}</router-link>
            <router-link
              to="/about"
              class="px-6 py-2.5 rounded-lg border border-white/25 text-white text-sm font-medium hover:bg-white/10"
            >{{ $t('了解更多') }}</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { getApplicationsApi } from '@/api/application'
import { toast } from '@/utils/toast'
import { useI18n } from '@/i18n'

const router = useRouter()
const { t } = useI18n()
const appliedJobIds = ref(new Set<number>())
const heroSearch = ref('')
const hotTags = ['Frontend', 'Backend', 'Product Manager', 'AI/Algorithm', 'Data Analysis', 'Internship']

const heroHighlights = [
  { title: '职位直达招聘方', sub: '发起聊天时自动带上职位与公司上下文' },
  { title: 'AI 面试复盘', sub: '模拟结束后生成要点与改进建议' },
  { title: '投递全链路可视', sub: '申请状态、日历与通知集中在一处' },
]

const heroPills = ['校招', '实习', '面经', '简历模板']

function goSearch() {
  const q = heroSearch.value.trim()
  if (q) router.push({ path: '/jobs', query: { keyword: q } })
  else router.push('/jobs')
}

const features = [
  { title: 'AI 模拟面试', desc: '智能生成面试题，多维度评分', color: '#2563eb', bg: '#eff6ff', link: '/interview', path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: '简历管理', desc: '模板系统，AI 分析与优化', color: '#7c3aed', bg: '#f5f3ff', link: '/resumes', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: '投递追踪', desc: '状态流转，日历与数据统计', color: '#059669', bg: '#ecfdf5', link: '/applications', path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: '求职社区', desc: '面经分享，评论互动交流', color: '#dc2626', bg: '#fef2f2', link: '/community', path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
]

const platformStats = ref([
  { value: '—', label: '在招职位' },
  { value: '—', label: '简历模板' },
  { value: '—', label: '社区帖子' },
  { value: '4', label: 'AI 求职能力' },
])

const latestJobs = ref<any[]>([])
const hotPosts = ref<any[]>([])
const jobsLoading = ref(true)
const postsLoading = ref(true)

function stripHtml(html: string) {
  return (html || '').replace(/<[^>]+>/g, '').substring(0, 120)
}

const workTypeMap: Record<string, string> = { full_time: 'Full-time', part_time: 'Part-time', intern: 'Internship', campus: 'Campus Hiring' }
const workTypeClassMap: Record<string, string> = { full_time: 'bg-blue-50 text-blue-600', part_time: 'bg-amber-50 text-amber-600', intern: 'bg-purple-50 text-purple-600', campus: 'bg-emerald-50 text-emerald-600' }
const positionTypeMap: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full Stack',
  mobile: 'Mobile Development',
  data: 'Data Analysis',
  ai: 'AI/Algorithm',
  product: 'Product Manager',
  design: 'Design',
  test: 'Test Development',
  devops: 'DevOps',
}

function workTypeLabel(wt: string) { return workTypeMap[wt] || wt }
function workTypeClass(wt: string) { return workTypeClassMap[wt] || 'bg-gray-100 text-gray-600' }
function positionTypeLabel(pt: string) { return positionTypeMap[pt] || pt }

function formatStat(n: number) {
  if (n <= 0) return '0'
  if (n >= 10000) return `${Math.round(n / 1000) / 10}k+`
  return `${n}+`
}

async function fetchAppliedJobs() {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const res: any = await getApplicationsApi({ pageSize: 100 })
    const list = res.data?.list || res.list || []
    appliedJobIds.value = new Set(list.filter((a: any) => a.jobId).map((a: any) => a.jobId))
  } catch { /* ignore */ }
}

function handleChat(job: any) {
  const token = localStorage.getItem('token')
  if (!token) {
    toast(t('请先登录后再沟通'), 'warning')
    router.push({ path: '/login', query: { redirect: '/home' } })
    return
  }
  if (!job.userId) {
    toast(t('该职位暂无联系人'), 'warning')
    return
  }
  router.push({
    path: '/chat',
    query: { userId: job.userId, jobId: job.id, message: t('你好，我对「{title}」这个职位很感兴趣，想了解一下！').replace('{title}', job.title) },
  })
}

async function fetchHomeData() {
  try {
    const [jobRes, postRes, tplRes]: any[] = await Promise.all([
      request.get('/jobs', { params: { page: 1, pageSize: 6 } }),
      request.get('/community/posts', { params: { page: 1, pageSize: 4, sort: 'hot' } }),
      request.get('/resumes/templates', { params: { page: 1, pageSize: 1 } }),
    ])
    latestJobs.value = (jobRes.data?.list || jobRes.list || []).slice(0, 6)
    hotPosts.value = (postRes.data?.list || postRes.list || []).slice(0, 4)

    const totalJobs = jobRes.data?.total ?? jobRes.total ?? 0
    const totalPosts = postRes.data?.total ?? postRes.total ?? 0
    const totalTemplates = tplRes.data?.total ?? tplRes.total ?? 0
    platformStats.value = [
      { value: formatStat(Number(totalJobs) || 0), label: '在招职位' },
      { value: formatStat(Number(totalTemplates) || 0), label: '简历模板' },
      { value: formatStat(Number(totalPosts) || 0), label: '社区帖子' },
      { value: '4', label: 'AI 求职能力' },
    ]
  } catch {}
  finally {
    jobsLoading.value = false
    postsLoading.value = false
  }
}

const heroImgFallbacks = [
  'https://stories.freepiklabs.com/storage/18253/job-hunt-bro-1292.png',
  'https://stories.freepiklabs.com/storage/1720/Hiring-01.svg',
  'https://stories.freepiklabs.com/storage/13273/Interview-01.svg',
  '/illustrations/hero-interview.svg',
]
let heroImgIdx = 0
function onHeroImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (heroImgIdx < heroImgFallbacks.length) {
    img.src = heroImgFallbacks[heroImgIdx++]
  } else {
    img.style.display = 'none'
  }
}

onMounted(() => {
  fetchHomeData()
  fetchAppliedJobs()
})
</script>
