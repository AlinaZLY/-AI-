<template>
  <div>
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
        <button @click="search" class="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">搜索</button>
      </div>
      <div class="flex gap-1">
        <button
          v-for="tab in searchTabs"
          :key="tab.value"
          @click="searchTab = tab.value; search()"
          class="px-3 py-1 rounded text-sm transition-colors"
          :class="searchTab === tab.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 筛选面板 -->
    <div class="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden">
      <div v-for="(row, ri) in filterRows" :key="row.key" class="border-b border-gray-50 last:border-b-0">
        <div class="flex items-start gap-3 px-4 py-2.5">
          <span class="text-sm font-medium text-gray-400 w-14 pt-1 shrink-0 text-right">{{ row.label }}</span>
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
            {{ row.expanded ? '收起' : '展开' }}
            <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': row.expanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 已选筛选 + 结果统计 -->
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <p class="text-sm text-gray-500">共 <span class="font-semibold text-gray-800">{{ total }}</span> 个职位</p>
        <template v-if="hasFilters">
          <span class="text-gray-300">|</span>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="tag in activeFilterTags" :key="tag.key" class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
              {{ tag.label }}
              <button @click="clearFilter(tag.key)" class="text-blue-400 hover:text-blue-700 font-bold">&times;</button>
            </span>
          </div>
          <button @click="clearAllFilters" class="text-xs text-gray-400 hover:text-red-500 ml-1">清除</button>
        </template>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="sort" @change="search" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
          <option value="">默认排序</option>
          <option value="salary">薪资最高</option>
          <option value="views">最多浏览</option>
          <option value="latest">最新发布</option>
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
        <div class="p-5 cursor-pointer" @click="toggleExpand(job.id)">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 text-base">{{ job.title }}</h3>
                <span v-if="job.salaryMin || job.salaryMax" class="text-sm font-semibold text-emerald-600">{{ formatSalary(job.salaryMin, job.salaryMax) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <img v-if="job.user?.avatar" :src="job.user.avatar" class="w-5 h-5 rounded-full object-cover" />
                <div v-else class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">{{ (job.user?.nickname || job.companyName || '企').charAt(0) }}</div>
                <span>{{ job.companyName }}</span>
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
          <div v-if="job.description" class="mb-4"><h4 class="text-sm font-medium text-gray-700 mb-2">岗位描述</h4><p class="text-sm text-gray-600 whitespace-pre-line">{{ job.description }}</p></div>
          <div v-if="job.requirements" class="mb-4"><h4 class="text-sm font-medium text-gray-700 mb-2">任职要求</h4><p class="text-sm text-gray-600 whitespace-pre-line">{{ job.requirements }}</p></div>
          <div class="flex justify-end"><button @click="openApplyModal(job)" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">立即投递</button></div>
        </div>
      </div>
    </div>

    <!-- Card view -->
    <div v-if="viewMode === 'card' && jobs.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="job in jobs" :key="job.id" class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all cursor-pointer group" @click="toggleExpand(job.id)">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{{ job.title }}</h3>
          <span class="px-2 py-0.5 rounded text-xs font-medium shrink-0 ml-2" :class="workTypeClass(job.workType)">{{ workTypeLabel(job.workType) }}</span>
        </div>
        <p class="text-sm text-gray-500 mb-2">{{ job.companyName }}</p>
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
          <button @click.stop="openApplyModal(job)" class="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">立即投递</button>
        </div>
        <!-- Card expanded detail -->
        <div v-if="expandedId === job.id" class="mt-3 pt-3 border-t border-gray-100">
          <div v-if="job.description" class="mb-2"><p class="text-xs text-gray-600 line-clamp-4">{{ job.description }}</p></div>
          <button @click.stop="openApplyModal(job)" class="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 mt-2">立即投递</button>
        </div>
      </div>
    </div>

    <div v-if="!loading && jobs.length === 0" class="text-center py-16 text-gray-400">暂无符合条件的职位</div>

    <!-- Infinite scroll sentinel -->
    <div ref="sentinelRef" class="h-1"></div>
    <div v-if="loadingMore" class="flex justify-center py-6">
      <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
    <div v-if="jobs.length > 0 && jobs.length >= total && !loading" class="text-center mt-4 mb-2 text-xs text-gray-400">已加载全部 {{ total }} 个职位</div>

    <!-- Apply modal -->
    <div v-if="showApplyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showApplyModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">选择简历投递</h2>
          <button @click="showApplyModal = false" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <p v-if="selectedJob" class="text-sm text-gray-500 mb-4">投递至：{{ selectedJob.companyName }} · {{ selectedJob.title }}</p>
        <div v-if="resumesLoading" class="flex justify-center py-8"><div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div></div>
        <div v-else-if="resumes.length === 0" class="py-6 text-center text-gray-500 text-sm">暂无简历，请先<router-link to="/my-resumes" class="text-blue-600 hover:underline" @click="showApplyModal = false">创建简历</router-link></div>
        <div v-else class="space-y-2 max-h-64 overflow-y-auto">
          <button v-for="r in resumes" :key="r.id" type="button" :disabled="applySubmitting"
            class="w-full text-left px-4 py-3 rounded-lg border transition-colors"
            :class="selectedResumeId === r.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'"
            @click="selectedResumeId = r.id">
            <div class="font-medium">{{ r.title }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ r.targetPosition || '未设置目标岗位' }}</div>
          </button>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showApplyModal = false" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
          <button @click="submitApply" :disabled="!selectedResumeId || applySubmitting" class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ applySubmitting ? '提交中...' : '确认投递' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import request from '@/utils/request'
import toast from '@/utils/toast'

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
  if (searchTab.value === 'company') return '输入公司名称搜索...'
  if (searchTab.value === 'position') return '输入岗位名称搜索...'
  return '搜索校招职位、公司、关键词...'
})

const filters = reactive<Record<string, string>>({
  location: '', positionType: '', workType: '', salary: '',
})

const filterRows = reactive([
  {
    key: 'location', label: '地区', expanded: false,
    options: [
      { value: '北京', label: '北京' }, { value: '上海', label: '上海' }, { value: '广州', label: '广州' },
      { value: '深圳', label: '深圳' }, { value: '杭州', label: '杭州' }, { value: '成都', label: '成都' },
      { value: '南京', label: '南京' }, { value: '武汉', label: '武汉' }, { value: '西安', label: '西安' },
      { value: '苏州', label: '苏州' }, { value: '长沙', label: '长沙' }, { value: '重庆', label: '重庆' },
      { value: '天津', label: '天津' }, { value: '郑州', label: '郑州' }, { value: '合肥', label: '合肥' },
      { value: '厦门', label: '厦门' }, { value: '青岛', label: '青岛' }, { value: '大连', label: '大连' },
      { value: '东莞', label: '东莞' }, { value: '佛山', label: '佛山' }, { value: '珠海', label: '珠海' },
    ],
  },
  {
    key: 'positionType', label: '岗位', expanded: false,
    options: [
      { value: '前端开发', label: '前端开发' }, { value: '后端开发', label: '后端开发' },
      { value: 'AI/算法', label: 'AI/算法' }, { value: '移动开发', label: '移动开发' },
      { value: '测试开发', label: '测试' }, { value: '全栈开发', label: '全栈' },
      { value: '嵌入式开发', label: '嵌入式' }, { value: '产品经理', label: '产品经理' },
      { value: 'UI/UX设计', label: 'UI/UX设计' }, { value: '平面设计', label: '平面设计' },
      { value: '运营', label: '运营' }, { value: '市场营销', label: '市场营销' },
      { value: '新媒体运营', label: '新媒体' }, { value: '数据分析', label: '数据分析' },
      { value: '财务/会计', label: '财务/会计' }, { value: '人力资源', label: '人力资源' },
      { value: '行政管理', label: '行政' }, { value: '法务', label: '法务' },
      { value: '供应链/物流', label: '供应链' }, { value: '机械工程', label: '机械工程' },
      { value: '电气工程', label: '电气工程' }, { value: '土木工程', label: '土木工程' },
      { value: '生物医药', label: '生物医药' }, { value: '教育培训', label: '教育' },
      { value: '翻译', label: '翻译' }, { value: '客服', label: '客服' }, { value: '销售', label: '销售' },
    ],
  },
  {
    key: 'workType', label: '类型', expanded: false,
    options: [
      { value: 'campus', label: '校招' }, { value: 'intern', label: '实习' },
      { value: 'full_time', label: '全职' }, { value: 'part_time', label: '兼职' },
    ],
  },
  {
    key: 'salary', label: '薪资', expanded: false,
    options: [
      { value: '0-5000', label: '5K以下' }, { value: '5000-10000', label: '5-10K' },
      { value: '10000-20000', label: '10-20K' }, { value: '20000-35000', label: '20-35K' },
      { value: '35000-50000', label: '35-50K' }, { value: '50000-', label: '50K以上' },
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
const totalPages = computed(() => Math.ceil(total.value / pageSize.value) || 1)

function workTypeLabel(wt: string) {
  return ({ full_time: '全职', part_time: '兼职', intern: '实习', campus: '校招' } as Record<string, string>)[wt] || wt
}
function workTypeClass(wt: string) {
  return ({ full_time: 'bg-blue-50 text-blue-600', part_time: 'bg-amber-50 text-amber-600', intern: 'bg-purple-50 text-purple-600', campus: 'bg-emerald-50 text-emerald-600' } as Record<string, string>)[wt] || 'bg-gray-100 text-gray-600'
}
function formatSalary(min?: number, max?: number) {
  if (!min && !max) return ''
  if (min && max) return `${(min / 1000).toFixed(0)}-${(max / 1000).toFixed(0)}K`
  if (min) return `${(min / 1000).toFixed(0)}K+`
  if (max) return `${(max / 1000).toFixed(0)}K以内`
  return ''
}
function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }
function parseTags(t: string | string[]) { return (Array.isArray(t) ? t : (t || '').split(',')).filter(Boolean) }
function toggleExpand(id: number) { expandedId.value = expandedId.value === id ? null : id }
function search() { page.value = 1; jobs.value = []; fetchJobs() }

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

function openApplyModal(job: Job) {
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
  if (!selectedJob.value || !selectedResumeId.value) return
  applySubmitting.value = true
  try {
    await request.post('/applications', {
      jobId: selectedJob.value.id, resumeId: selectedResumeId.value,
      company: selectedJob.value.companyName, position: selectedJob.value.title,
    })
    toast('投递成功', 'success')
    showApplyModal.value = false
  } catch {} finally { applySubmitting.value = false }
}

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  fetchJobs()
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && !loadingMore.value && jobs.value.length < total.value && jobs.value.length > 0) {
      loadMore()
    }
  }, { rootMargin: '200px' })
  if (sentinelRef.value) observer.observe(sentinelRef.value)
})

onUnmounted(() => { observer?.disconnect() })

watch(sentinelRef, (el) => { if (el && observer) observer.observe(el) })
</script>
