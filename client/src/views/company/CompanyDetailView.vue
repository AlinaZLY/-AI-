<template>
  <div class="page-shell space-y-6">
    <section v-if="loading" class="rounded-2xl border border-slate-100 bg-white p-16 shadow-sm">
      <div class="flex justify-center">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    </section>

    <template v-else-if="company">
      <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex items-start gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-semibold text-blue-700">
              {{ (company.name || '企').charAt(0) }}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl font-bold text-slate-900">{{ company.name }}</h1>
                <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">{{ $t('已认证企业') }}</span>
              </div>
              <div class="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                <span v-if="company.industry">{{ company.industry }}</span>
                <span v-if="company.city">· {{ company.city }}</span>
                <span v-if="company.scale">· {{ company.scale }}</span>
                <span>· {{ $t('{count} 个在招职位', { count: company.openJobCount || 0 }) }}</span>
              </div>
              <a v-if="company.website" :href="company.website" target="_blank" rel="noreferrer" class="mt-3 inline-flex text-sm text-blue-600 hover:text-blue-700">
                {{ $t('访问企业官网') }}
              </a>
            </div>
          </div>
          <router-link to="/companies" class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            {{ $t('返回企业列表') }}
          </router-link>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_340px]">
        <div class="space-y-6">
          <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">{{ $t('企业简介') }}</h2>
            <p class="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{{ company.description || $t('该企业暂未填写简介。') }}</p>
          </section>

          <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-slate-900">{{ $t('在招职位') }}</h2>
              <router-link :to="{ path: '/jobs', query: { keyword: company.name, searchTab: 'company' } }" class="text-sm text-blue-600 hover:text-blue-700">
                {{ $t('去职位广场查看') }}
              </router-link>
            </div>
            <div v-if="company.jobs?.length" class="mt-4 space-y-3">
              <article v-for="job in company.jobs" :key="job.id" class="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 class="text-base font-semibold text-slate-900">{{ job.title }}</h3>
                    <div class="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span v-if="job.location">{{ job.location }}</span>
                      <span v-if="job.positionType">· {{ job.positionType }}</span>
                      <span>· {{ $t('发布于 ') }}{{ formatDate(job.createdAt) }}</span>
                    </div>
                  </div>
                  <span v-if="job.salaryMin || job.salaryMax" class="text-sm font-semibold text-emerald-600">
                    {{ formatSalary(job.salaryMin, job.salaryMax) }}
                  </span>
                </div>
                <p v-if="job.description" class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{{ job.description }}</p>
              </article>
            </div>
            <div v-else class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-400">
              {{ $t('暂无在招职位') }}
            </div>
          </section>
        </div>

        <aside class="space-y-6">
          <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">{{ $t('企业信息') }}</h2>
            <div class="mt-4 space-y-4 text-sm">
              <div>
                <div class="text-xs text-slate-400">{{ $t('行业') }}</div>
                <div class="mt-1 text-slate-700">{{ company.industry || '-' }}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400">{{ $t('城市') }}</div>
                <div class="mt-1 text-slate-700">{{ company.city || '-' }}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400">{{ $t('详细地址') }}</div>
                <div class="mt-1 text-slate-700">{{ company.address || '-' }}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400">{{ $t('企业类型') }}</div>
                <div class="mt-1 text-slate-700">{{ company.type === 'individual' ? $t('个体工商户') : $t('企业') }}</div>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </template>

    <section v-else class="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900">{{ $t('企业不存在或已下线') }}</h2>
      <router-link to="/companies" class="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        {{ $t('返回企业列表') }}
      </router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getCompanyDetailApi } from '@/api/company'
import { useI18n } from '@/i18n'

const route = useRoute()
const { t } = useI18n()
const loading = ref(false)
const company = ref<any>(null)

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('zh-CN')
}

function formatSalary(min?: number, max?: number) {
  if (!min && !max) return ''
  if (min && max) return `${Math.round(min / 1000)}-${Math.round(max / 1000)}K`
  if (min) return `${Math.round(min / 1000)}K+`
  if (max) return `Up to ${Math.round(max / 1000)}K`
  return ''
}

async function fetchCompany() {
  loading.value = true
  try {
    const res: any = await getCompanyDetailApi(Number(route.params.id))
    company.value = res.data || res || null
  } catch {
    company.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCompany()
})
</script>
