<template>
  <div class="page-shell space-y-6">
    <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ $t('企业精选') }}</h1>
          <p class="mt-2 text-sm text-slate-500">{{ $t('浏览已通过审核的企业，查看企业简介和在招职位。') }}</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <input
            v-model="keyword"
            type="text"
            :placeholder="$t('搜索企业名称或简介')"
            class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:w-72"
            @keyup.enter="fetchCompanies"
          />
          <button type="button" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" @click="fetchCompanies">
            {{ $t('搜索') }}
          </button>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div class="flex flex-wrap items-end gap-3">
        <div class="w-44">
          <label class="mb-1 block text-sm font-medium text-slate-600">{{ $t('行业') }}</label>
          <input v-model="industry" type="text" :placeholder="$t('如：互联网/IT')" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="w-44">
          <label class="mb-1 block text-sm font-medium text-slate-600">{{ $t('城市') }}</label>
          <input v-model="city" type="text" :placeholder="$t('如：北京')" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" @click="resetFilters">
          {{ $t('重置') }}
        </button>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
      <div v-else-if="companies.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-sm text-slate-400">
        {{ $t('当前条件下暂无企业') }}
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="company in companies"
          :key="company.id"
          class="rounded-xl border border-slate-100 p-5 transition-all hover:border-blue-100 hover:shadow-sm"
        >
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700">
              {{ (company.name || '企').charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="truncate text-lg font-semibold text-slate-900">{{ company.name }}</h2>
                <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{{ $t('已认证') }}</span>
              </div>
              <div class="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                <span v-if="company.industry">{{ company.industry }}</span>
                <span v-if="company.city">· {{ company.city }}</span>
                <span>· {{ $t('{count} 个在招职位', { count: company.openJobCount || 0 }) }}</span>
              </div>
            </div>
          </div>
          <p class="mt-4 line-clamp-4 text-sm leading-6 text-slate-500">{{ company.description || $t('该企业暂未填写简介。') }}</p>
          <div class="mt-5 flex justify-end">
            <router-link :to="`/companies/${company.id}`" class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              {{ $t('查看详情') }}
            </router-link>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCompaniesApi } from '@/api/company'
import { useI18n } from '@/i18n'

const { t: $t } = useI18n()
const loading = ref(false)
const companies = ref<any[]>([])
const keyword = ref('')
const industry = ref('')
const city = ref('')

async function fetchCompanies() {
  loading.value = true
  try {
    const res: any = await getCompaniesApi({
      page: 1,
      pageSize: 24,
      keyword: keyword.value.trim() || undefined,
      industry: industry.value.trim() || undefined,
      city: city.value.trim() || undefined,
    })
    companies.value = res.data?.list || res.list || []
  } catch {
    companies.value = []
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  keyword.value = ''
  industry.value = ''
  city.value = ''
  fetchCompanies()
}

onMounted(() => {
  fetchCompanies()
})
</script>
