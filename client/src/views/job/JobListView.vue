<template>
  <div class="page-shell">
    <EnterpriseJobWorkbench v-if="isEnterprise" />
    <template v-else>
    <!-- 搜索栏 + 选项卡 -->
    <div class="bg-white rounded-xl border border-gray-100 p-4 mb-4">
      <div class="flex gap-3 mb-3">
        <div class="flex-1 relative">
          <input
            v-model="keyword"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            @keyup.enter="search"
          />
        </div>
        <button @click="search" class="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">{{ $t('搜索') }}</button>
      </div>
      <div class="flex gap-1">
        <button
          v-for="tab in searchTabs"
          :key="tab.value"
          @click="searchTab = tab.value; search()"
          class="px-3 py-1 rounded text-sm transition-colors"
          :class="searchTab === tab.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ $t(tab.label) }}
        </button>
      </div>
    </div>

    <!-- 筛选面板 -->
    <div class="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden">
      <div v-for="(row, ri) in filterRows" :key="row.key" class="border-b border-gray-50 last:border-b-0">
        <div class="flex items-start gap-3 px-4 py-2.5">
          <span class="text-sm font-medium text-gray-400 w-14 pt-1 shrink-0 text-right">{{ $t(row.label) }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap gap-1.5 transition-all" :style="{ maxHeight: row.expanded ? '500px' : '32px', overflow: 'hidden' }">
              <button
                v-for="opt in row.options"
                :key="opt.value"
                @click="setFilter(row.key, opt.value)"
                class="px-3 py-1 rounded text-sm transition-all whitespace-nowrap"
                :class="getFilterValue(row.key) === opt.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
          <button
            v-if="row.options.length > 6"
            @click="row.expanded = !row.expanded"
            class="shrink-0 text-xs text-gray-400 hover:text-blue-500 pt-1.5 flex items-center gap-0.5 transition-colors"
          >
            {{ row.expanded ? $t('收起') : $t('展开') }}
            <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': row.expanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 已选筛选 + 结果统计 -->
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <p class="text-sm text-gray-500">{{ $t('共 {count} 个职位', { count: total }) }}</p>
        <template v-if="hasFilters">
          <span class="text-gray-300">|</span>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="tag in activeFilterTags" :key="tag.key" class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
              {{ tag.label }}
              <button @click="clearFilter(tag.key)" class="text-blue-400 hover:text-blue-700 font-bold">&times;</button>
            </span>
          </div>
          <button @click="clearAllFilters" class="text-xs text-gray-400 hover:text-red-500 ml-1">{{ $t('清除') }}</button>
        </template>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="sort" @change="search" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
          <option value="">{{ $t('默认排序') }}</option>
          <option value="salary">{{ $t('薪资最高') }}</option>
          <option value="views">{{ $t('最多浏览') }}</option>
          <option value="latest">{{ $t('最新发布') }}</option>
        </select>
        <div class="flex bg-gray-100 rounded-lg p-0.5">
          <button @click="viewMode = 'list'" class="p-1.5 rounded transition-all" :class="viewMode === 'list' ? 'bg-white shadow-sm' : ''">
            <svg class="w-4 h-4" :class="viewMode === 'list' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button @click="viewMode = 'card'" class="p-1.5 rounded transition-all" :class="viewMode === 'card' ? 'bg-white shadow-sm' : ''">
            <svg class="w-4 h-4" :class="viewMode === 'card' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading (initial) -->
    <div v-if="loading && jobs.length === 0" class="flex justify-center py-16">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- List view -->
    <div v-if="viewMode === 'list' && jobs.length" class="space-y-3">
      <div v-for="job in jobs" :key="job.id" class="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-5 cursor-pointer" @click="$router.push(`/jobs/${job.id}`)">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 text-base">{{ job.title }}</h3>
                <span v-if="job.salaryMin || job.salaryMax" class="text-sm font-semibold text-emerald-600">{{ formatSalary(job.salaryMin, job.salaryMax) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <img v-if="job.user?.avatar" :src="job.user.avatar" class="w-5 h-5 rounded-full object-cover" />
                <div v-else class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">{{ (job.user?.nickname || job.companyName || '企').charAt(0) }}</div>
                <router-link
                  :to="companyLink(job)"
                  class="hover:text-blue-600"
                  @click.stop
                >
                  {{ job.companyName }}
                </router-link>
              </div>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span v-if="job.location" class="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">{{ job.location }}</span>
                <span class="px-2 py-0.5 rounded text-xs font-medium" :class="workTypeClass(job.workType)">{{ workTypeLabel(job.workType) }}</span>
                <span v-if="job.positionType" class="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">{{ job.positionType }}</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
              <span class="text-xs text-gray-400">{{ formatDate(job.createdAt) }}</span>
              <svg class="w-4 h-4 text-gray-300 transition-transform" :class="{ 'rotate-180': expandedId === job.id }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
        <div v-if="expandedId === job.id" class="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
          <div v-if="job.description" class="mb-4"><h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('岗位描述') }}</h4><p class="text-sm text-gray-600 whitespace-pre-line">{{ job.description }}</p></div>
          <div v-if="job.requirements" class="mb-4"><h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('任职要求') }}</h4><p class="text-sm text-gray-600 whitespace-pre-line">{{ job.requirements }}</p></div>
          <div class="flex justify-end">
            <button v-if="appliedJobIds.has(job.id)" @click="router.push('/applications')" class="px-5 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 border border-emerald-200">{{ $t('已投递 · 查看进度') }}</button>
            <button v-else @click="goChat(job)" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">{{ $t('立即沟通') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Card view -->
    <div v-if="viewMode === 'card' && jobs.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="job in jobs" :key="job.id" class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all cursor-pointer group" @click="$router.push(`/jobs/${job.id}`)">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{{ job.title }}</h3>
          <span class="px-2 py-0.5 rounded text-xs font-medium shrink-0 ml-2" :class="workTypeClass(job.workType)">{{ workTypeLabel(job.workType) }}</span>
        </div>
        <router-link :to="companyLink(job)" class="mb-2 block text-sm text-gray-500 hover:text-blue-600" @click.stop>
          {{ job.companyName }}
        </router-link>
        <div v-if="job.salaryMin || job.salaryMax" class="text-base font-bold text-emerald-600 mb-2">{{ formatSalary(job.salaryMin, job.salaryMax) }}</div>
        <div class="flex flex-wrap gap-1.5 mb-3">
          <span v-if="job.location" class="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">{{ job.location }}</span>
          <span v-if="job.positionType" class="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">{{ job.positionType }}</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-50">
          <div class="flex items-center gap-2">
            <img v-if="job.user?.avatar" :src="job.user.avatar" class="w-5 h-5 rounded-full object-cover" />
            <div v-else class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">{{ (job.user?.nickname || job.companyName || '企').charAt(0) }}</div>
            <span class="text-xs text-gray-400">{{ job.user?.nickname || job.companyName }} · {{ formatDate(job.createdAt) }}</span>
          </div>
          <button v-if="appliedJobIds.has(job.id)" @click.stop="router.push('/applications')" class="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg hover:bg-emerald-100 border border-emerald-200">{{ $t('已投递') }}</button>
          <button v-else @click.stop="goChat(job)" class="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">{{ $t('立即沟通') }}</button>
        </div>
        <!-- Card expanded detail -->
        <div v-if="expandedId === job.id" class="mt-3 pt-3 border-t border-gray-100">
          <div v-if="job.description" class="mb-2"><p class="text-xs text-gray-600 line-clamp-4">{{ job.description }}</p></div>
          <button v-if="appliedJobIds.has(job.id)" @click.stop="router.push('/applications')" class="w-full py-2 bg-emerald-50 text-emerald-600 text-sm rounded-lg hover:bg-emerald-100 border border-emerald-200 mt-2">{{ $t('已投递 · 查看进度') }}</button>
          <button v-else @click.stop="goChat(job)" class="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 mt-2">{{ $t('立即沟通') }}</button>
        </div>
      </div>
    </div>

    <div v-if="!loading && jobs.length === 0" class="text-center py-16 text-gray-400">{{ $t('暂无符合条件的职位') }}</div>

    <!-- Infinite scroll sentinel -->
    <div ref="sentinelRef" class="h-1"></div>
    <div v-if="loadingMore" class="flex justify-center py-6">
      <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
    <div v-if="jobs.length > 0 && jobs.length >= total && !loading" class="text-center mt-4 mb-2 text-xs text-gray-400">{{ $t('已加载全部 {count} 个职位', { count: total }) }}</div>

    <!-- Apply modal -->
    <div v-if="showApplyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showApplyModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">{{ $t('选择简历投递') }}</h2>
          <button @click="showApplyModal = false" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <p v-if="selectedJob" class="text-sm text-gray-500 mb-4">{{ $t('投递至：') }}{{ selectedJob.companyName }} · {{ selectedJob.title }}</p>
        <div v-if="resumesLoading" class="flex justify-center py-8"><div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div></div>
        <div v-else-if="resumes.length === 0" class="py-6 text-center text-gray-500 text-sm">{{ $t('暂无简历，请先') }}<router-link to="/my-resumes" class="text-blue-600 hover:underline" @click="showApplyModal = false">{{ $t('创建简历') }}</router-link></div>
        <div v-else class="space-y-2 max-h-64 overflow-y-auto">
          <button v-for="r in resumes" :key="r.id" type="button" :disabled="applySubmitting"
            class="w-full text-left px-4 py-3 rounded-lg border transition-colors"
            :class="selectedResumeId === r.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'"
            @click="selectedResumeId = r.id">
            <div class="font-medium">{{ r.title }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ r.targetPosition || $t('未设置目标岗位') }}</div>
          </button>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showApplyModal = false" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">{{ $t('取消') }}</button>
          <button @click="submitApply" :disabled="!selectedResumeId || applySubmitting" class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ applySubmitting ? $t('提交中...') : $t('确认投递') }}</button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import toast from '@/utils/toast'
import { useI18n } from '@/i18n'
import { useUserStore } from '@/stores/user'
import EnterpriseJobWorkbench from '@/components/job/EnterpriseJobWorkbench.vue'

const router = useRouter()
const route = useRoute()
const { t, formatDateTime } = useI18n()
const userStore = useUserStore()
const isEnterprise = computed(() => userStore.userInfo?.role === 'enterprise')

interface Job {
  id: number; title: string; companyName: string; location?: string; positionType?: string
  salaryMin?: number; salaryMax?: number; workType: string; tags?: string[] | string
  deadline?: string; createdAt: string; description?: string; requirements?: string
  user?: { id: number; nickname?: string; avatar?: string; username?: string }
}
interface Resume { id: number; title: string; targetPosition?: string }

const jobs = ref<Job[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const loadingMore = ref(false)
const keyword = ref('')
const sort = ref('')
const expandedId = ref<number | null>(null)
const viewMode = ref<'list' | 'card'>('card')

const searchTab = ref('all')
const searchTabs = [
  { value: 'all', label: '综合' },
  { value: 'position', label: '按职位' },
  { value: 'company', label: '按公司' },
]
const searchPlaceholder = computed(() => {
  if (searchTab.value === 'company') return t('输入公司名称搜索...')
  if (searchTab.value === 'position') return t('输入岗位名称搜索...')
  return t('搜索校招职位、公司、关键词...')
})

const filters = reactive<Record<string, string>>({
  location: '', positionType: '', workType: '', salary: '',
})

const filterRows = reactive([
  {
    key: 'location', label: '地区', expanded: false,
    options: [
      { value: 'Beijing', label: 'Beijing' }, { value: 'Shanghai', label: 'Shanghai' }, { value: 'Guangzhou', label: 'Guangzhou' },
      { value: 'Shenzhen', label: 'Shenzhen' }, { value: 'Hangzhou', label: 'Hangzhou' }, { value: 'Chengdu', label: 'Chengdu' },
      { value: 'Nanjing', label: 'Nanjing' }, { value: 'Wuhan', label: 'Wuhan' }, { value: "Xi'an", label: "Xi'an" },
      { value: 'Suzhou', label: 'Suzhou' }, { value: 'Changsha', label: 'Changsha' }, { value: 'Chongqing', label: 'Chongqing' },
      { value: 'Tianjin', label: 'Tianjin' }, { value: 'Zhengzhou', label: 'Zhengzhou' }, { value: 'Hefei', label: 'Hefei' },
      { value: 'Xiamen', label: 'Xiamen' }, { value: 'Qingdao', label: 'Qingdao' }, { value: 'Dalian', label: 'Dalian' },
      { value: 'Dongguan', label: 'Dongguan' }, { value: 'Foshan', label: 'Foshan' }, { value: 'Zhuhai', label: 'Zhuhai' },
    ],
  },
  {
    key: 'positionType', label: '岗位', expanded: false,
    options: [
      { value: 'Frontend', label: 'Frontend' }, { value: 'Backend', label: 'Backend' },
      { value: 'AI/Algorithm', label: 'AI/Algorithm' }, { value: 'Mobile Development', label: 'Mobile Development' },
      { value: 'Test Development', label: 'Test Development' }, { value: 'Data Analysis', label: 'Data Analysis' },
      { value: 'Embedded Development', label: 'Embedded Development' }, { value: 'Product Manager', label: 'Product Manager' },
      { value: 'Design', label: 'Design' }, { value: 'Marketing', label: 'Marketing' },
      { value: 'Operations', label: 'Operations' }, { value: 'Finance', label: 'Finance' },
      { value: 'Supply Chain', label: 'Supply Chain' }, { value: 'Hardware', label: 'Hardware' },
      { value: 'Security', label: 'Security' }, { value: 'Telecom/Network', label: 'Telecom/Network' },
      { value: 'Game Development', label: 'Game Development' },
    ],
  },
  {
    key: 'workType', label: '类型', expanded: false,
    options: [
      { value: 'campus', label: 'Campus Hiring' }, { value: 'intern', label: 'Internship' },
      { value: 'full_time', label: 'Full-time' }, { value: 'part_time', label: 'Part-time' },
    ],
  },
  {
    key: 'salary', label: '薪资', expanded: false,
    options: [
      { value: '0-5000', label: 'Below 5K' }, { value: '5000-10000', label: '5-10K' },
      { value: '10000-20000', label: '10-20K' }, { value: '20000-35000', label: '20-35K' },
      { value: '35000-50000', label: '35-50K' }, { value: '50000-', label: '50K+' },
    ],
  },
])

function getFilterValue(key: string) { return filters[key] || '' }
function setFilter(key: string, value: string) {
  filters[key] = filters[key] === value ? '' : value
  search()
}
function clearFilter(key: string) { filters[key] = ''; search() }
function clearAllFilters() { Object.keys(filters).forEach(k => filters[k] = ''); search() }

const hasFilters = computed(() => Object.values(filters).some(Boolean))
const activeFilterTags = computed(() => {
  const tags: { key: string; label: string }[] = []
  for (const row of filterRows) {
    const v = filters[row.key]
    if (v) {
      const opt = row.options.find(o => o.value === v)
      tags.push({ key: row.key, label: opt?.label || v })
    }
  }
  return tags
})

const showApplyModal = ref(false)
const selectedJob = ref<Job | null>(null)
const resumes = ref<Resume[]>([])
const resumesLoading = ref(false)
const selectedResumeId = ref<number | null>(null)
const applySubmitting = ref(false)
const appliedJobIds = ref(new Set<number>())
const totalPages = computed(() => Math.ceil(total.value / pageSize.value) || 1)

function workTypeLabel(wt: string) {
  return ({ full_time: 'Full-time', part_time: 'Part-time', intern: 'Internship', campus: 'Campus Hiring' } as Record<string, string>)[wt] || wt
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
function parseTags(t: string | string[]) { return (Array.isArray(t) ? t : (t || '').split(',')).filter(Boolean) }
function toggleExpand(id: number) { expandedId.value = expandedId.value === id ? null : id }
function search() { page.value = 1; jobs.value = []; fetchJobs() }
function companyLink(job: Job) {
  const id = (job as any).companyId
  return id ? `/companies/${id}` : { path: '/companies', query: { keyword: job.companyName } }
}

async function loadMore() {
  if (loadingMore.value || jobs.value.length >= total.value) return
  loadingMore.value = true
  page.value++
  const { salaryMin, salaryMax } = parseSalaryFilter()
  try {
    const res: any = await request.get('/jobs', {
      params: {
        page: page.value, pageSize: pageSize.value, sort: sort.value || undefined,
        keyword: keyword.value.trim() || undefined,
        location: filters.location || undefined, workType: filters.workType || undefined,
        positionType: filters.positionType || undefined, salaryMin, salaryMax,
      },
    })
    const data = res.data || res
    jobs.value.push(...(data.list || []))
    total.value = data.total ?? total.value
  } catch {} finally { loadingMore.value = false }
}

function parseSalaryFilter() {
  const v = filters.salary
  if (!v) return { salaryMin: undefined, salaryMax: undefined }
  const [min, max] = v.split('-')
  return { salaryMin: min ? +min : undefined, salaryMax: max ? +max : undefined }
}

async function fetchJobs() {
  loading.value = true
  const { salaryMin, salaryMax } = parseSalaryFilter()
  try {
    const res: any = await request.get('/jobs', {
      params: {
        page: page.value, pageSize: pageSize.value, sort: sort.value || undefined,
        keyword: keyword.value.trim() || undefined,
        location: filters.location || undefined,
        workType: filters.workType || undefined,
        positionType: filters.positionType || undefined,
        salaryMin, salaryMax,
      },
    })
    const data = res.data || res
    jobs.value = data.list || []
    total.value = data.total ?? 0
  } catch { jobs.value = []; total.value = 0 }
  finally { loading.value = false }
}

function goChat(job: Job) {
  const token = localStorage.getItem('token')
  if (!token) {
    toast(t('请先登录后再沟通'), 'warning')
    router.push({ path: '/login', query: { redirect: '/jobs' } })
    return
  }
  if (!job.user?.id) {
    toast(t('该职位暂无联系人'), 'warning')
    return
  }
  router.push({
    path: '/chat',
    query: { userId: String(job.user.id), jobId: String(job.id), message: t('你好，我对「{title}」这个职位很感兴趣，想了解一下！').replace('{title}', job.title) },
  })
}

function openApplyModal(job: Job) {
  if (isEnterprise.value) {
    toast(t('企业账号不能投递职位'), 'warning')
    return
  }
  selectedJob.value = job; selectedResumeId.value = null; showApplyModal.value = true; fetchResumes()
}
async function fetchResumes() {
  resumesLoading.value = true
  try {
    const res: any = await request.get('/resumes')
    resumes.value = Array.isArray(res.data) ? res.data : (res.data?.list ?? [])
  } catch { resumes.value = [] }
  finally { resumesLoading.value = false }
}
async function submitApply() {
  if (isEnterprise.value) {
    toast(t('企业账号不能投递职位'), 'warning')
    return
  }
  if (!selectedJob.value || !selectedResumeId.value) return
  applySubmitting.value = true
  try {
    await request.post('/applications', {
      jobId: selectedJob.value.id, resumeId: selectedResumeId.value,
      company: selectedJob.value.companyName, position: selectedJob.value.title,
    })
    toast(t('投递成功'), 'success')
    if (selectedJob.value) appliedJobIds.value.add(selectedJob.value.id)
    showApplyModal.value = false
  } catch {} finally { applySubmitting.value = false }
}

async function fetchAppliedJobs() {
  const token = localStorage.getItem('token')
  if (!token) return
  if (isEnterprise.value) {
    appliedJobIds.value = new Set()
    return
  }
  try {
    const res: any = await request.get('/applications', { params: { pageSize: 100 } })
    const list = res.data?.list || res.list || []
    appliedJobIds.value = new Set(list.filter((a: any) => a.jobId).map((a: any) => a.jobId))
  } catch { /* ignore */ }
}

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(async () => {
  if (userStore.token && !userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch {
      /* ignore */
    }
  }

  const queryKeyword = typeof route.query.keyword === 'string' ? route.query.keyword : ''
  const queryTab = typeof route.query.searchTab === 'string' ? route.query.searchTab : ''
  if (queryKeyword) keyword.value = queryKeyword
  if (queryTab && searchTabs.some((tab) => tab.value === queryTab)) searchTab.value = queryTab

  if (!isEnterprise.value) {
    fetchJobs()
    fetchAppliedJobs()
  }

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && !loadingMore.value && jobs.value.length < total.value && jobs.value.length > 0) {
      loadMore()
    }
  }, { rootMargin: '200px' })
  if (sentinelRef.value) observer.observe(sentinelRef.value)
})

onUnmounted(() => { observer?.disconnect() })

watch(sentinelRef, (el) => { if (el && observer) observer.observe(el) })
watch(
  () => [route.query.keyword, route.query.searchTab],
  ([nextKeyword, nextTab]) => {
    const normalizedKeyword = typeof nextKeyword === 'string' ? nextKeyword : ''
    const normalizedTab = typeof nextTab === 'string' ? nextTab : ''
    if (normalizedKeyword !== keyword.value) keyword.value = normalizedKeyword
    if (!normalizedTab && searchTab.value !== 'all') {
      searchTab.value = 'all'
    } else if (normalizedTab && searchTabs.some((tab) => tab.value === normalizedTab) && normalizedTab !== searchTab.value) {
      searchTab.value = normalizedTab
    }
    if (!isEnterprise.value) {
      search()
    }
  },
)
</script>
