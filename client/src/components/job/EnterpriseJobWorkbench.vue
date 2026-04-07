<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ $t('企业职位工作台') }}</h1>
          <p class="mt-2 text-sm text-slate-500">{{ $t('在这里发布、编辑和下线自己的职位，处理后续候选人投递。') }}</p>
        </div>
        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          :disabled="!canManageJobs"
          @click="openCreateModal"
        >
          {{ $t('发布职位') }}
        </button>
      </div>
    </section>

    <section v-if="companyLoading" class="rounded-2xl border border-slate-100 bg-white p-10 shadow-sm text-center text-sm text-slate-400">
      {{ $t('加载企业认证状态中...') }}
    </section>

    <section v-else-if="!company" class="rounded-2xl border border-dashed border-slate-200 bg-white p-10 shadow-sm text-center">
      <h2 class="text-lg font-semibold text-slate-900">{{ $t('还没有企业认证资料') }}</h2>
      <p class="mt-2 text-sm text-slate-500">{{ $t('先提交企业认证，审核通过后即可发布职位。') }}</p>
      <router-link to="/enterprise-cert" class="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        {{ $t('去提交认证') }}
      </router-link>
    </section>

    <section
      v-else-if="company.status !== 'approved'"
      class="rounded-2xl border border-amber-100 bg-amber-50 p-6 shadow-sm"
    >
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-amber-900">{{ $t('当前还不能发布职位') }}</h2>
          <p class="mt-1 text-sm text-amber-800">
            {{ $t('企业认证状态：') }}{{ companyStatusLabel(company.status) }}{{ $t('审核通过后，职位发布和编辑入口会自动开放。') }}
          </p>
          <p v-if="company.rejectReason" class="mt-2 text-sm text-red-600">{{ $t('驳回原因：') }}{{ company.rejectReason }}</p>
        </div>
        <router-link to="/enterprise-cert" class="inline-flex rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm text-amber-800 hover:bg-amber-50">
          {{ $t('前往认证管理') }}
        </router-link>
      </div>
    </section>

    <template v-else>
      <section class="grid gap-4 md:grid-cols-4">
        <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div class="text-xs text-slate-400">{{ $t('职位总数') }}</div>
          <div class="mt-2 text-2xl font-semibold text-slate-900">{{ jobs.length }}</div>
        </div>
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <div class="text-xs text-emerald-500">{{ $t('开放中') }}</div>
          <div class="mt-2 text-2xl font-semibold text-emerald-700">{{ jobStatusCount('open') }}</div>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
          <div class="text-xs text-slate-400">{{ $t('已关闭') }}</div>
          <div class="mt-2 text-2xl font-semibold text-slate-700">{{ jobStatusCount('closed') }}</div>
        </div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
          <div class="text-xs text-blue-500">{{ $t('累计投递') }}</div>
          <div class="mt-2 text-2xl font-semibold text-blue-700">{{ totalApplicationCount }}</div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div class="flex flex-wrap items-end gap-3">
          <div class="min-w-[220px] flex-1">
            <label class="mb-1 block text-sm font-medium text-slate-600">{{ $t('关键词') }}</label>
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索职位名称 / 城市 / 岗位类型"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="w-40">
            <label class="mb-1 block text-sm font-medium text-slate-600">{{ $t('状态') }}</label>
            <select v-model="statusFilter" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{{ $t('全部') }}</option>
              <option value="open">{{ $t('开放中') }}</option>
              <option value="closed">{{ $t('已关闭') }}</option>
              <option value="paused">{{ $t('已暂停') }}</option>
            </select>
          </div>
          <button type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" @click="resetFilters">
            {{ $t('重置') }}
          </button>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div v-if="jobsLoading" class="flex justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
        <div v-else-if="filteredJobs.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-sm text-slate-400">
          {{ $t('暂无职位，先发布一个职位开始招聘。') }}
        </div>
        <div v-else class="space-y-3">
          <article
            v-for="job in filteredJobs"
            :key="job.id"
            class="rounded-xl border border-slate-100 p-4 transition-colors hover:border-blue-100"
          >
            <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base font-semibold text-slate-900">{{ job.title }}</h3>
                  <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="jobStatusClass(job.status)">
                    {{ jobStatusLabel(job.status) }}
                  </span>
                </div>
                <div class="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>{{ job.companyName || company.name }}</span>
                  <span v-if="job.location">{{ $t('地点：') }}{{ job.location }}</span>
                  <span v-if="job.positionType">{{ $t('岗位类型：') }}{{ job.positionType }}</span>
                  <span>{{ $t('浏览：') }}{{ job.viewCount || 0 }}</span>
                  <span>{{ $t('投递：') }}{{ job.applicationCount || 0 }}</span>
                  <span>{{ $t('发布时间：') }}{{ formatDateTime(job.createdAt) }}</span>
                </div>
                <p v-if="job.description" class="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{{ job.description }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button type="button" class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50" @click="openEditModal(job)">
                  {{ $t('编辑') }}
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-1.5 text-sm text-white"
                  :class="job.status === 'open' ? 'bg-slate-500 hover:bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-700'"
                  @click="toggleJobStatus(job)"
                >
                  {{ job.status === 'open' ? $t('关闭职位') : $t('重新开放') }}
                </button>
                <button type="button" class="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100" @click="removeJob(job)">
                  {{ $t('删除') }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </template>

    <div v-if="modalVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="modalVisible = false">
      <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 class="text-lg font-bold text-slate-900">{{ editingJobId ? $t('编辑职位') : $t('发布职位') }}</h2>
          <button type="button" class="text-2xl leading-none text-slate-400 hover:text-slate-600" @click="modalVisible = false">&times;</button>
        </div>
        <div class="space-y-4 px-6 py-5">
          <div class="grid gap-4 md:grid-cols-2">
            <label class="block text-sm text-slate-600">
              {{ $t('职位名称') }}
              <input v-model="form.title" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('公司名称') }}
              <input v-model="form.companyName" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('岗位类型') }}
              <input v-model="form.positionType" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('工作地点') }}
              <input v-model="form.location" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('工作类型') }}
              <select v-model="form.workType" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="full_time">{{ $t('全职') }}</option>
                <option value="part_time">{{ $t('兼职') }}</option>
                <option value="intern">{{ $t('实习') }}</option>
              </select>
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('状态') }}
              <select v-model="form.status" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="open">{{ $t('开放中') }}</option>
                <option value="closed">{{ $t('已关闭') }}</option>
                <option value="paused">{{ $t('已暂停') }}</option>
              </select>
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('最低薪资') }}
              <input v-model.number="form.salaryMin" type="number" min="0" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('最高薪资') }}
              <input v-model.number="form.salaryMax" type="number" min="0" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('招聘人数') }}
              <input v-model.number="form.headcount" type="number" min="1" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('截止日期') }}
              <input v-model="form.deadline" type="date" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('学历要求') }}
              <input v-model="form.education" placeholder="如：本科及以上" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <label class="block text-sm text-slate-600">
              {{ $t('福利待遇') }}
              <input v-model="form.benefits" placeholder="如：五险一金、年终奖" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>

          <div class="text-sm text-slate-600">
            <label class="mb-1 block">{{ $t('标签') }}</label>
            <div class="flex flex-wrap gap-2 rounded-lg border border-slate-200 p-2 min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
              <span v-for="(tag, i) in form.tags" :key="i" class="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {{ tag }}
                <button type="button" class="text-blue-500 hover:text-blue-800" @click="form.tags.splice(i, 1)">&times;</button>
              </span>
              <input v-model="tagInput" type="text" class="min-w-[100px] flex-1 bg-transparent text-sm outline-none" placeholder="输入后回车添加" @keydown.enter.prevent="addTag" />
            </div>
          </div>

          <label class="block text-sm text-slate-600">
            {{ $t('任职要求') }}
            <textarea v-model="form.requirements" rows="4" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </label>

          <label class="block text-sm text-slate-600">
            {{ $t('职位描述') }}
            <textarea v-model="form.description" rows="5" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </label>
        </div>
        <div class="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" @click="modalVisible = false">
            {{ $t('取消') }}
          </button>
          <button type="button" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50" :disabled="submitting" @click="submitJob">
            {{ submitting ? $t('提交中...') : $t('确认保存') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import request from '@/utils/request'
import toast from '@/utils/toast'
import { getMyCompanyApi } from '@/api/company'
import { useI18n } from '@/i18n'

const { t } = useI18n()

interface EnterpriseJob {
  id: number
  title: string
  companyName?: string
  positionType?: string
  location?: string
  workType?: string
  status: string
  salaryMin?: number
  salaryMax?: number
  description?: string
  requirements?: string
  applicationCount?: number
  viewCount?: number
  createdAt: string
}

const company = ref<any>(null)
const companyLoading = ref(false)
const jobsLoading = ref(false)
const jobs = ref<EnterpriseJob[]>([])
const keyword = ref('')
const statusFilter = ref('')
const modalVisible = ref(false)
const submitting = ref(false)
const editingJobId = ref<number | null>(null)

const tagInput = ref('')
const form = reactive({
  title: '',
  companyName: '',
  positionType: '',
  location: '',
  workType: 'full_time',
  status: 'open',
  salaryMin: undefined as number | undefined,
  salaryMax: undefined as number | undefined,
  headcount: 1,
  deadline: '',
  education: '',
  benefits: '',
  tags: [] as string[],
  description: '',
  requirements: '',
})

function addTag() {
  const v = tagInput.value.trim()
  if (v && !form.tags.includes(v)) form.tags.push(v)
  tagInput.value = ''
}

const canManageJobs = computed(() => company.value?.status === 'approved')
const filteredJobs = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return jobs.value.filter((job) => {
    if (statusFilter.value && job.status !== statusFilter.value) return false
    if (!kw) return true
    return [job.title, job.location, job.positionType, job.companyName]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(kw))
  })
})
const totalApplicationCount = computed(() => jobs.value.reduce((sum, job) => sum + Number(job.applicationCount || 0), 0))

function companyStatusLabel(status?: string) {
  return {
    pending: t('审核中'),
    approved: t('已通过'),
    rejected: t('审核未通过'),
  }[status || ''] || (status || t('未知'))
}

function jobStatusLabel(status?: string) {
  return {
    open: t('开放中'),
    closed: t('已关闭'),
    paused: t('已暂停'),
  }[status || ''] || (status || t('未知'))
}

function jobStatusClass(status?: string) {
  return {
    open: 'bg-emerald-50 text-emerald-700',
    closed: 'bg-slate-100 text-slate-700',
    paused: 'bg-amber-50 text-amber-700',
  }[status || ''] || 'bg-slate-100 text-slate-600'
}

function jobStatusCount(status: string) {
  return jobs.value.filter((job) => job.status === status).length
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function resetFilters() {
  keyword.value = ''
  statusFilter.value = ''
}

function resetForm() {
  editingJobId.value = null
  form.title = ''
  form.companyName = company.value?.name || ''
  form.positionType = ''
  form.location = company.value?.city || ''
  form.workType = 'full_time'
  form.status = 'open'
  form.salaryMin = undefined
  form.salaryMax = undefined
  form.headcount = 1
  form.deadline = ''
  form.education = ''
  form.benefits = ''
  form.tags = []
  form.description = ''
  form.requirements = ''
  tagInput.value = ''
}

function openCreateModal() {
  resetForm()
  modalVisible.value = true
}

function openEditModal(job: EnterpriseJob) {
  editingJobId.value = job.id
  form.title = job.title || ''
  form.companyName = job.companyName || company.value?.name || ''
  form.positionType = job.positionType || ''
  form.location = job.location || ''
  form.workType = job.workType || 'full_time'
  form.status = job.status || 'open'
  form.salaryMin = job.salaryMin
  form.salaryMax = job.salaryMax
  form.headcount = (job as any).headcount || 1
  form.deadline = (job as any).deadline || ''
  form.education = (job as any).education || ''
  form.benefits = (job as any).benefits || ''
  form.tags = Array.isArray((job as any).tags) ? [...(job as any).tags] : []
  form.description = job.description || ''
  form.requirements = job.requirements || ''
  tagInput.value = ''
  modalVisible.value = true
}

async function fetchCompany() {
  companyLoading.value = true
  try {
    const res: any = await getMyCompanyApi()
    company.value = res.data || res || null
  } catch {
    company.value = null
  } finally {
    companyLoading.value = false
  }
}

async function fetchJobs() {
  jobsLoading.value = true
  try {
    const res: any = await request.get('/jobs/my', { params: { page: 1, pageSize: 100 } })
    jobs.value = res?.data?.list || res?.list || []
  } catch {
    jobs.value = []
  } finally {
    jobsLoading.value = false
  }
}

async function submitJob() {
  if (!form.title.trim()) {
    toast(t('请填写职位名称'), 'warning')
    return
  }
  if (!canManageJobs.value) {
    toast(t('企业认证通过后才能管理职位'), 'warning')
    return
  }

  submitting.value = true
  try {
    const payload = {
      title: form.title.trim(),
      companyName: form.companyName.trim() || company.value?.name || undefined,
      positionType: form.positionType.trim() || undefined,
      location: form.location.trim() || undefined,
      workType: form.workType,
      status: form.status,
      salaryMin: form.salaryMin || undefined,
      salaryMax: form.salaryMax || undefined,
      headcount: form.headcount || undefined,
      deadline: form.deadline || undefined,
      education: form.education.trim() || undefined,
      benefits: form.benefits.trim() || undefined,
      tags: form.tags.length ? form.tags : undefined,
      description: form.description.trim() || undefined,
      requirements: form.requirements.trim() || undefined,
    }

    if (editingJobId.value) {
      await request.put(`/jobs/${editingJobId.value}`, payload)
      toast(t('职位已更新'), 'success')
    } else {
      await request.post('/jobs', payload)
      toast(t('职位已发布'), 'success')
    }

    modalVisible.value = false
    await fetchJobs()
  } catch {
    /* interceptor */
  } finally {
    submitting.value = false
  }
}

async function toggleJobStatus(job: EnterpriseJob) {
  const nextStatus = job.status === 'open' ? 'closed' : 'open'
  try {
    await request.put(`/jobs/${job.id}`, { status: nextStatus })
    toast(nextStatus === 'open' ? t('职位已重新开放') : t('职位已关闭'), 'success')
    await fetchJobs()
  } catch {
    /* interceptor */
  }
}

async function removeJob(job: EnterpriseJob) {
  const ok = window.confirm(t('确定删除职位「{title}」吗？').replace('{title}', job.title))
  if (!ok) return

  try {
    await request.delete(`/jobs/${job.id}`)
    toast(t('职位已删除'), 'success')
    await fetchJobs()
  } catch {
    /* interceptor */
  }
}

onMounted(async () => {
  await fetchCompany()
  if (company.value?.status === 'approved') {
    await fetchJobs()
  }
})
</script>
