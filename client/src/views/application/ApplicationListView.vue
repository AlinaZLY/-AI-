<template>
  <div class="min-h-screen bg-slate-50">
    <div class="page-shell py-6">
      <div v-if="isEnterprise" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 class="text-2xl font-bold text-slate-800">{{ $t('企业工作台') }}</h1>
          <p class="mt-2 text-sm text-slate-500">{{ $t('先查看企业认证申请状态，再处理学生投递并发送笔试或面试邀请。') }}</p>
        </div>

        <div v-if="companyApplication" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex flex-wrap justify-between items-start gap-4">
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-semibold text-slate-900">{{ companyApplication.name }}</h2>
                <span class="px-3 py-1 rounded-full text-xs font-medium" :class="companyStatusClass(companyApplication.status)">
                  {{ companyStatusLabel(companyApplication.status) }}
                </span>
              </div>
              <p class="mt-2 text-sm text-slate-500">
                {{ companyApplication.type === 'individual' ? $t('个体工商户认证申请') : $t('企业认证申请') }}
              </p>
            </div>
            <router-link
              to="/enterprise-cert"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ $t('前往认证管理') }}
            </router-link>
          </div>

          <div class="p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-xl bg-slate-50 px-4 py-4">
              <div class="text-xs text-slate-400">{{ $t('审核状态') }}</div>
              <div class="mt-1 text-base font-semibold text-slate-900">{{ companyStatusLabel(companyApplication.status) }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 px-4 py-4">
              <div class="text-xs text-slate-400">{{ $t('申请时间') }}</div>
              <div class="mt-1 text-base font-semibold text-slate-900">{{ formatDate(companyApplication.createdAt) }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 px-4 py-4">
              <div class="text-xs text-slate-400">{{ $t('最近更新') }}</div>
              <div class="mt-1 text-base font-semibold text-slate-900">{{ formatDate(companyApplication.updatedAt) }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 px-4 py-4">
              <div class="text-xs text-slate-400">{{ $t('认证结果') }}</div>
              <div class="mt-1 text-base font-semibold text-slate-900">{{ companyApplication.isVerified ? $t('已认证') : $t('待认证') }}</div>
            </div>
          </div>

          <div class="px-6 pb-6 space-y-4">
            <div class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <div class="text-xs text-slate-400 mb-1">{{ $t('行业 / 城市') }}</div>
              <div class="text-sm text-slate-700">{{ companyApplication.industry || $t('未填写') }} · {{ companyApplication.city || $t('未填写') }}</div>
            </div>
            <div v-if="companyApplication.rejectReason" class="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
              <div class="text-xs text-red-400 mb-1">{{ $t('驳回原因') }}</div>
              <div class="text-sm text-red-700 whitespace-pre-wrap">{{ companyApplication.rejectReason }}</div>
            </div>
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-blue-800">
              {{ $t('企业账号不能创建或维护学生投递记录，也不能投递职位。请前往企业认证和职位发布相关页面完成企业侧操作。') }}
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div class="text-lg font-semibold text-slate-900">{{ $t('暂无企业认证申请记录') }}</div>
          <p class="mt-2 text-sm text-slate-500">{{ $t('你当前是企业账号，但还没有提交企业认证申请。') }}</p>
          <router-link
            to="/enterprise-cert"
            class="inline-flex mt-5 px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {{ $t('去提交认证申请') }}
          </router-link>
        </div>

        <div v-if="companyApplication?.status === 'approved'" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div class="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">{{ $t('收到的投递') }}</h2>
              <p class="mt-2 text-sm text-slate-500">{{ $t('查看学生投递到你发布职位的记录，并发起笔试或面试邀请。') }}</p>
            </div>
            <div class="grid grid-cols-3 gap-2 min-w-[240px]">
              <div class="rounded-xl bg-slate-50 px-3 py-3">
                <div class="text-xs text-slate-400">{{ $t('总投递') }}</div>
                <div class="mt-1 text-lg font-semibold text-slate-900">{{ companyApplicationStats.total || 0 }}</div>
              </div>
              <div class="rounded-xl bg-blue-50 px-3 py-3">
                <div class="text-xs text-blue-500">{{ $t('进行中') }}</div>
                <div class="mt-1 text-lg font-semibold text-blue-700">{{ companyTagCount('in_progress') }}</div>
              </div>
              <div class="rounded-xl bg-emerald-50 px-3 py-3">
                <div class="text-xs text-emerald-500">{{ $t('已通过') }}</div>
                <div class="mt-1 text-lg font-semibold text-emerald-700">{{ companyTagCount('passed') }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 items-end">
            <div class="flex-1 min-w-[220px]">
              <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('关键词') }}</label>
              <input
                v-model="companyFilters.keyword"
                :placeholder="$t('学生昵称 / 公司 / 岗位')"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                @keyup.enter="fetchCompanyApplications"
              />
            </div>
            <div class="w-40">
              <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('状态') }}</label>
              <select v-model="companyFilters.status" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">{{ $t('全部') }}</option>
                <option v-for="s in statusOptions" :key="`company-${s.value}`" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div class="w-40">
              <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('标签') }}</label>
              <select v-model="companyFilters.tag" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">{{ $t('全部') }}</option>
                <option v-for="t in tagOptions" :key="`company-tag-${t.value}`" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
            <button @click="fetchCompanyApplications" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">{{ $t('搜索') }}</button>
          </div>

          <div v-if="companyApplicationsLoading" class="flex justify-center py-10">
            <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <div v-else-if="companyApplications.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-400">
            {{ $t('暂无学生投递到你的职位') }}
          </div>
          <div v-else class="space-y-3">
            <article
              v-for="app in companyApplications"
              :key="`company-app-${app.id}`"
              class="rounded-xl border border-slate-100 p-4 hover:border-blue-100 transition-colors"
            >
              <div class="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div class="text-base font-semibold text-slate-900">{{ app.position }}</div>
                  <div class="mt-1 text-sm text-slate-500">{{ app.company }}</div>
                  <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{{ $t('投递者：') }}{{ app.user?.nickname || app.user?.username || $t('未知用户') }}</span>
                    <span v-if="app.resume?.title">{{ $t('简历：') }}{{ app.resume.title }}</span>
                    <span>{{ $t('投递时间：') }}{{ formatTime(app.createdAt) }}</span>
                    <span v-if="app.nextDate">{{ $t('安排时间：') }}{{ formatDate(app.nextDate) }}</span>
                    <span v-if="app.stageMeta?.checkedInAt" class="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700">
                      {{ $t('已签到') }} {{ formatTime(app.stageMeta.checkedInAt) }}
                    </span>
                    <span v-if="app.stageMeta?.resultInquiryAt" class="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                      {{ $t('已询问结果') }} {{ formatTime(app.stageMeta.resultInquiryAt) }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-medium" :class="statusBadgeClass(app.status)">
                    {{ statusLabel(app.status) }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-medium" :class="tagBadgeClass(app.tag)">
                    {{ tagLabel(app.tag) }}
                  </span>
                  <button
                    v-if="app.resume"
                    @click="openCompanyResumeModal(app)"
                    class="px-3 py-1.5 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    {{ $t('查看简历') }}
                  </button>
                  <button
                    v-if="canCompanyAdjustSchedule(app)"
                    @click="openCompanyInviteModal(app)"
                    class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {{ companyScheduleActionLabel(app) }}
                  </button>
                  <button
                    v-if="canCompanySendResult(app)"
                    @click="openCompanyResultModal(app)"
                    class="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    {{ $t('发送结果') }}
                  </button>
                </div>
              </div>
              <p v-if="app.remark" class="mt-3 text-sm text-slate-500 whitespace-pre-wrap">{{ app.remark }}</p>
            </article>
          </div>
        </div>
      </div>

      <div v-else>
      <!-- Header -->
      <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-slate-800">{{ $t('校招投递追踪') }}</h1>
          <div class="flex bg-slate-100 rounded-lg p-0.5">
            <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">{{ $t('列表') }}</button>
            <button @click="viewMode = 'calendar'; fetchCalendar()" :class="viewMode === 'calendar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">{{ $t('日历') }}</button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <router-link to="/dashboard"
            class="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            {{ $t('数据看板') }}
          </router-link>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {{ $t('+ 新增投递') }}
          </button>
        </div>
      </div>

      <!-- Calendar View -->
      <div v-if="viewMode === 'calendar'" class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <button @click="changeMonth(-1)" class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">&lt; {{ $t('上月') }}</button>
          <h2 class="text-lg font-semibold text-slate-800">{{ calendarYear }}{{ $t('年') }}{{ calendarMonth }}{{ $t('月') }}</h2>
          <button @click="changeMonth(1)" class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">{{ $t('下月') }} &gt;</button>
        </div>
        <div class="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
          <div v-for="d in weekDayLabels" :key="d" class="bg-slate-50 py-2 text-center text-xs font-medium text-slate-500">{{ d }}</div>
          <div v-for="(day, i) in calendarDays" :key="i" class="bg-white min-h-[80px] p-1.5" :class="day.isCurrentMonth ? '' : 'opacity-30'">
            <div class="text-xs font-medium mb-1" :class="day.isToday ? 'text-indigo-600 font-bold' : 'text-slate-600'">{{ day.date }}</div>
            <div v-for="evt in day.events" :key="evt.id" class="text-[11px] px-1.5 py-0.5 mb-0.5 rounded bg-indigo-50 text-indigo-700 truncate cursor-pointer hover:bg-indigo-100" :title="`${evt.company} - ${evt.position}`" @click="onCalendarEventClick(evt)">
              {{ evt.company }}
            </div>
          </div>
        </div>
        <div v-if="calendarEvents.length === 0" class="text-center py-8 text-slate-400 text-sm">{{ $t('本月暂无面试安排') }}</div>
      </div>

      <!-- Stats cards -->
      <div v-if="viewMode === 'list'" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div class="text-sm text-slate-500">{{ $t('全部') }}</div>
          <div class="text-xl font-bold text-slate-800 mt-1">{{ stats.total }}</div>
        </div>
        <div
          v-for="s in statsByStatus"
          :key="s.status"
          class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm cursor-pointer transition-all hover:border-indigo-200"
          :class="{ 'ring-2 ring-indigo-500': filters.status === s.status }"
          @click="toggleStatusFilter(s.status)"
        >
          <div class="text-sm text-slate-500 truncate">{{ statusLabel(s.status) }}</div>
          <div class="text-xl font-bold text-slate-800 mt-1">{{ s.count }}</div>
        </div>
        <div
          v-for="t in statsByTag"
          :key="t.tag"
          class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm cursor-pointer transition-all hover:border-indigo-200"
          :class="{ 'ring-2 ring-indigo-500': filters.tag === t.tag }"
          @click="toggleTagFilter(t.tag)"
        >
          <div class="text-sm text-slate-500 truncate">{{ tagLabel(t.tag) }}</div>
          <div class="text-xl font-bold text-slate-800 mt-1">{{ t.count }}</div>
        </div>
      </div>

      <!-- Search & filter -->
      <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-6">
        <div class="flex flex-wrap gap-3 items-end">
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('关键词') }}</label>
            <input
              v-model="filters.keyword"
              :placeholder="$t('公司/岗位')"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              @keyup.enter="fetchList"
            />
          </div>
          <div class="w-36">
            <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('状态') }}</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">{{ $t('全部') }}</option>
              <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div class="w-36">
            <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('标签') }}</label>
            <select
              v-model="filters.tag"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">{{ $t('全部') }}</option>
              <option v-for="t in tagOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
          <div class="w-40">
            <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('开始日期') }}</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div class="w-40">
            <label class="block text-sm font-medium text-slate-600 mb-1">{{ $t('结束日期') }}</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button
            @click="page = 1; fetchList()"
            class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            {{ $t('搜索') }}
          </button>
          <button
            @click="resetFilters"
            class="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm"
          >
            {{ $t('重置') }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Application cards -->
      <div v-else class="space-y-3">
        <div
          v-for="app in applications"
          :key="app.id"
          class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
        >
          <div
            class="p-5 cursor-pointer"
            @click="toggleExpand(app.id)"
          >
            <div class="flex flex-wrap justify-between items-start gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-900 text-lg">{{ app.company }} · {{ app.position }}</h3>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                  <span>{{ app.channel || '-' }}</span>
                  <span>{{ app.salaryRange || '-' }}</span>
                  <span>{{ app.location || '-' }}</span>
                  <span v-if="app.nextDate">{{ $t('下次:') }} {{ formatDate(app.nextDate) }}</span>
                  <span>{{ $t('更新:') }} {{ formatTime(app.updatedAt) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span
                  :class="statusBadgeClass(app.status)"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ statusLabel(app.status) }}
                </span>
                <span
                  :class="tagBadgeClass(app.tag)"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ tagLabel(app.tag) }}
                </span>
                <select
                  v-if="!isPlatformManaged(app)"
                  :value="app.status"
                  class="text-xs border border-slate-200 rounded px-2 py-1 bg-white"
                  @change="(e) => changeStatus(app, (e.target as HTMLSelectElement).value)"
                  @click.stop
                >
                  <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <button
                  v-if="canStudentCheckIn(app)"
                  @click.stop="checkInApplication(app)"
                  :disabled="isStudentActionLoading(app.id, 'checkin')"
                  class="px-3 py-1.5 text-xs bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50"
                >
                  {{ isStudentActionLoading(app.id, 'checkin') ? $t('签到中...') : $t('面试签到') }}
                </button>
                <button
                  v-if="canStudentInquireResult(app)"
                  @click.stop="inquireApplicationResult(app)"
                  :disabled="isStudentActionLoading(app.id, 'inquiry')"
                  class="px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  {{ isStudentActionLoading(app.id, 'inquiry') ? $t('发送中...') : $t('询问结果') }}
                </button>
                <span
                  v-if="isPlatformManaged(app) && app.stageMeta?.checkedInAt"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700"
                >
                  {{ $t('已签到') }}
                </span>
                <span
                  v-if="isPlatformManaged(app) && app.stageMeta?.resultInquiryAt"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700"
                >
                  {{ $t('已询问结果') }}
                </span>
                <button
                  v-if="!isPlatformManaged(app)"
                  @click.stop="openEditModal(app)"
                  class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                  :title="$t('编辑')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                  v-if="!isPlatformManaged(app)"
                  @click.stop="confirmDelete(app)"
                  class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                  :title="$t('删除')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            <div v-if="isPlatformManaged(app)" class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{{ $t('企业维护流程') }}</span>
              <span v-if="app.stageMeta?.checkedInAt" class="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
                {{ $t('\u5df2\u4e8e {time} \u5b8c\u6210\u7b7e\u5230').replace('{time}', formatTime(app.stageMeta.checkedInAt)) }}
              </span>
              <span v-else-if="canStudentCheckIn(app)" class="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
                {{ $t('到面试日后可签到') }}
              </span>
              <span v-if="app.stageMeta?.resultInquiryAt" class="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                {{ $t('已询问结果，等待企业反馈') }}
              </span>
              <span v-else-if="canStudentInquireResult(app)" class="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                {{ $t('已到次日，可询问结果') }}
              </span>
            </div>
          </div>

          <!-- Expanded detail -->
          <div v-if="expandedId === app.id" class="border-t border-slate-100 bg-slate-50/50 p-5">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Timeline -->
              <div>
                <h4 class="text-sm font-semibold text-slate-700 mb-3">{{ $t('状态时间线') }}</h4>
                <div v-if="loadingLogs[app.id]" class="text-sm text-slate-400">{{ $t('加载中...') }}</div>
                <div v-else-if="!logsMap[app.id]?.length" class="text-sm text-slate-400">{{ $t('暂无记录') }}</div>
                <div v-else class="space-y-2">
                  <div
                    v-for="(log, i) in logsMap[app.id]"
                    :key="log.id"
                    class="flex gap-3"
                  >
                    <div class="flex flex-col items-center">
                      <div class="w-2.5 h-2.5 rounded-full bg-indigo-500" :class="{ 'bg-slate-300': i === logsMap[app.id].length - 1 }"></div>
                      <div v-if="i < logsMap[app.id].length - 1" class="w-0.5 flex-1 bg-slate-200 min-h-[8px]"></div>
                    </div>
                    <div class="flex-1 pb-3">
                      <div class="text-sm text-slate-700">{{ statusLabel(log.fromStatus) }} → {{ statusLabel(log.toStatus) }}</div>
                      <div v-if="log.note" class="text-xs text-slate-500 mt-0.5">{{ log.note }}</div>
                      <div class="text-xs text-slate-400 mt-1">{{ formatTime(log.createdAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Notes -->
              <div>
                <h4 class="text-sm font-semibold text-slate-700 mb-3">{{ $t('备注') }}</h4>
                <div class="flex gap-2 mb-3">
                  <select
                    v-model="newNoteType[app.id]"
                    class="w-28 px-2 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  >
                    <option value="other">{{ $t('其他') }}</option>
                    <option value="interview">{{ $t('面试') }}</option>
                    <option value="company">{{ $t('公司') }}</option>
                    <option value="salary">{{ $t('薪资') }}</option>
                  </select>
                  <input
                    v-model="newNoteContent[app.id]"
                    :placeholder="$t('添加备注...')"
                    class="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    @keyup.enter="addNote(app)"
                  />
                  <button
                    @click="addNote(app)"
                    class="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                  >
                    {{ $t('添加') }}
                  </button>
                </div>
                <div v-if="loadingNotes[app.id]" class="text-sm text-slate-400">{{ $t('加载中...') }}</div>
                <div v-else-if="!notesMap[app.id]?.length" class="text-sm text-slate-400">{{ $t('暂无备注') }}</div>
                <div v-else class="space-y-2">
                  <div
                    v-for="note in notesMap[app.id]"
                    :key="note.id"
                    class="flex justify-between gap-2 bg-white rounded-lg p-3 border border-slate-100"
                  >
                    <div class="flex-1">
                      <span v-if="note.type && note.type !== 'other'" class="inline-block mr-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded" :class="noteTypeBadgeClass(note.type)">{{ noteTypeLabel(note.type) }}</span>
                      <span class="text-sm text-slate-700">{{ note.content }}</span>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <span class="text-xs text-slate-400">{{ formatTime(note.createdAt) }}</span>
                      <button
                        @click="deleteNote(app, note.id)"
                        class="p-1 text-slate-400 hover:text-red-600"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && applications.length === 0" class="text-center py-16">
        <template v-if="!isLoggedIn">
          <p class="text-slate-500 mb-4">{{ $t('登录后可以记录和追踪投递进度') }}</p>
          <div class="flex justify-center gap-3">
            <router-link to="/login" class="px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">{{ $t('立即登录') }}</router-link>
            <router-link to="/register" class="px-5 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">{{ $t('注册账号') }}</router-link>
          </div>
        </template>
        <p v-else class="text-slate-400">{{ $t('暂无投递记录') }}</p>
      </div>

      <!-- Pagination -->
      <div v-if="total > pageSize" class="flex justify-center gap-2 mt-6">
        <button
          :disabled="page <= 1"
          @click="page = Math.max(1, page - 1); fetchList()"
          class="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          {{ $t('上一页') }}
        </button>
        <span class="px-4 py-2 text-sm text-slate-600">
          {{ page }} / {{ Math.ceil(total / pageSize) }}
        </span>
        <button
          :disabled="page >= Math.ceil(total / pageSize)"
          @click="page = Math.min(Math.ceil(total / pageSize), page + 1); fetchList()"
          class="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          {{ $t('下一页') }}
        </button>
      </div>
    </div>

    <!-- Create modal -->
    <div v-if="showCreate" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showCreate = false">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div class="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-900">{{ $t('新增投递记录') }}</h2>
          <button @click="showCreate = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('公司名称') }} <span class="text-red-500">*</span></label>
            <input v-model="form.company" :placeholder="$t('如：字节跳动')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('岗位名称') }} <span class="text-red-500">*</span></label>
            <input v-model="form.position" :placeholder="$t('如：前端开发工程师')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('投递渠道') }}</label>
              <input v-model="form.channel" :placeholder="$t('如：官网/Boss直聘')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('薪资范围') }}</label>
              <input v-model="form.salaryRange" :placeholder="$t('如：15-25k')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('工作地点') }}</label>
            <input v-model="form.location" :placeholder="$t('如：北京')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('岗位描述') }}</label>
            <textarea v-model="form.jobDescription" rows="3" :placeholder="$t('岗位要求（可选）')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-2 p-6 border-t border-slate-100">
          <button @click="showCreate = false" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">{{ $t('取消') }}</button>
          <button
            @click="handleCreate"
            :disabled="!form.company.trim() || !form.position.trim() || submitting"
            class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? $t('提交中...') : $t('提交') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showEdit = false">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div class="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-900">{{ $t('编辑投递记录') }}</h2>
          <button @click="showEdit = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('公司名称') }} <span class="text-red-500">*</span></label>
            <input v-model="editForm.company" :placeholder="$t('如：字节跳动')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('岗位名称') }} <span class="text-red-500">*</span></label>
            <input v-model="editForm.position" :placeholder="$t('如：前端开发工程师')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('投递渠道') }}</label>
              <input v-model="editForm.channel" :placeholder="$t('如：官网/Boss直聘')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('薪资范围') }}</label>
              <input v-model="editForm.salaryRange" :placeholder="$t('如：15-25k')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('工作地点') }}</label>
            <input v-model="editForm.location" :placeholder="$t('如：北京')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('下次日期') }}</label>
            <input v-model="editForm.nextDate" type="date" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('备注') }}</label>
            <textarea v-model="editForm.remark" rows="3" :placeholder="$t('备注')" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-2 p-6 border-t border-slate-100">
          <button @click="showEdit = false" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">{{ $t('取消') }}</button>
          <button
            @click="handleEdit"
            :disabled="!editForm.company.trim() || !editForm.position.trim() || submitting"
            class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? $t('保存中...') : $t('保存') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirmation -->
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="deleteTarget = null">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ $t('确认删除') }}</h3>
        <p class="text-slate-600 text-sm mb-4">{{ $t('确定要删除「{company} · {position}」的投递记录吗？此操作不可恢复。').replace('{company}', deleteTarget.company).replace('{position}', deleteTarget.position) }}</p>
        <div class="flex justify-end gap-2">
          <button @click="deleteTarget = null" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">{{ $t('取消') }}</button>
          <button
            @click="handleDelete"
            class="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            {{ $t('删除') }}
          </button>
        </div>
        </div>
      </div>

      <div v-if="companyInviteVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="companyInviteVisible = false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
          <div class="flex justify-between items-center p-6 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ $t('发送面试邀请') }}</h3>
              <p class="text-xs text-slate-400 mt-1">{{ selectedCompanyApp?.user?.nickname || selectedCompanyApp?.user?.username || $t('候选人') }} · {{ selectedCompanyApp?.position }}</p>
            </div>
            <button @click="companyInviteVisible = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('邀请环节') }}</label>
              <select v-model="companyInviteForm.status" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="written_test">{{ $t('笔试邀请') }}</option>
                <option value="first_interview">{{ $t('一面邀请') }}</option>
                <option value="second_interview">{{ $t('二面邀请') }}</option>
                <option value="hr_interview">{{ $t('HR面邀请') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('时间安排') }}</label>
              <input v-model="companyInviteForm.nextDate" type="date" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('附言') }}</label>
              <textarea v-model="companyInviteForm.note" rows="3" :placeholder="$t('例如：请于约定时间准时参加线上一面')" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2 p-6 border-t border-slate-100">
            <button @click="companyInviteVisible = false" class="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">{{ $t('取消') }}</button>
            <button @click="submitCompanyInvite" :disabled="companyInviteSubmitting || !selectedCompanyApp" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {{ companyInviteSubmitting ? $t('发送中...') : $t('确认发送') }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="companyResultVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="companyResultVisible = false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
          <div class="flex justify-between items-center p-6 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ $t('发送面试结果') }}</h3>
              <p class="text-xs text-slate-400 mt-1">{{ selectedCompanyApp?.user?.nickname || selectedCompanyApp?.user?.username || $t('候选人') }} · {{ selectedCompanyApp?.position }}</p>
            </div>
            <button @click="companyResultVisible = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('结果去向') }}</label>
              <select v-model="companyResultForm.status" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500">
                <option
                  v-for="option in companyResultOptions(selectedCompanyApp)"
                  :key="`company-result-${option.value}`"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div v-if="requiresNextDate(companyResultForm.status)">
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('下一轮安排') }}</label>
              <input v-model="companyResultForm.nextDate" type="date" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('结果说明') }}</label>
              <textarea v-model="companyResultForm.note" rows="3" :placeholder="$t('例如：通过本轮面试，请准备下一轮')" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2 p-6 border-t border-slate-100">
            <button @click="companyResultVisible = false" class="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">{{ $t('取消') }}</button>
            <button @click="submitCompanyResult" :disabled="companyResultSubmitting || !selectedCompanyApp" class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              {{ companyResultSubmitting ? $t('发送中...') : $t('确认发送') }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="companyResumeVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="companyResumeVisible = false">
        <div class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
          <div class="flex items-start justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ $t('候选人简历') }}</h3>
              <p class="mt-1 text-xs text-slate-400">{{ selectedCompanyResumeApp?.user?.nickname || selectedCompanyResumeApp?.user?.username || $t('候选人') }} · {{ selectedCompanyResumeApp?.resume?.title || $t('未命名简历') }}</p>
            </div>
            <button @click="companyResumeVisible = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="space-y-5 px-6 py-5">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-xl bg-slate-50 px-4 py-4">
                <div class="text-xs text-slate-400">{{ $t('姓名') }}</div>
                <div class="mt-1 text-sm font-medium text-slate-900">{{ companyResumeBasicInfo.name || selectedCompanyResumeApp?.user?.nickname || selectedCompanyResumeApp?.user?.username || '-' }}</div>
              </div>
              <div class="rounded-xl bg-slate-50 px-4 py-4">
                <div class="text-xs text-slate-400">{{ $t('目标岗位') }}</div>
                <div class="mt-1 text-sm font-medium text-slate-900">{{ selectedCompanyResumeApp?.resume?.targetPosition || selectedCompanyResumeApp?.position || '-' }}</div>
              </div>
              <div class="rounded-xl bg-slate-50 px-4 py-4">
                <div class="text-xs text-slate-400">{{ $t('联系方式') }}</div>
                <div class="mt-1 text-sm font-medium text-slate-900">{{ companyResumeBasicInfo.phone || '-' }}<span v-if="companyResumeBasicInfo.email"> / {{ companyResumeBasicInfo.email }}</span></div>
              </div>
              <div class="rounded-xl bg-slate-50 px-4 py-4">
                <div class="text-xs text-slate-400">{{ $t('学校 / 专业') }}</div>
                <div class="mt-1 text-sm font-medium text-slate-900">{{ companyResumeBasicInfo.school || '-' }}<span v-if="companyResumeBasicInfo.major"> · {{ companyResumeBasicInfo.major }}</span></div>
              </div>
            </div>

            <div v-if="companyResumeSkills.length" class="rounded-xl border border-slate-100 p-4">
              <div class="mb-3 text-sm font-semibold text-slate-900">{{ $t('技能标签') }}</div>
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in companyResumeSkills" :key="skill" class="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="companyResumeContent?.selfIntro" class="rounded-xl border border-slate-100 p-4">
              <div class="mb-3 text-sm font-semibold text-slate-900">{{ $t('自我介绍') }}</div>
              <p class="whitespace-pre-wrap text-sm leading-6 text-slate-600">{{ companyResumeContent.selfIntro }}</p>
            </div>

            <div v-if="companyResumeEducation.length" class="rounded-xl border border-slate-100 p-4">
              <div class="mb-3 text-sm font-semibold text-slate-900">{{ $t('教育经历') }}</div>
              <div class="space-y-3">
                <div v-for="(item, index) in companyResumeEducation" :key="`edu-${index}`" class="rounded-lg bg-slate-50 px-4 py-3">
                  <div class="text-sm font-medium text-slate-900">{{ item.school || '-' }}<span v-if="item.major"> · {{ item.major }}</span></div>
                  <div class="mt-1 text-xs text-slate-400">{{ item.startDate || '-' }} - {{ item.endDate || '-' }}</div>
                </div>
              </div>
            </div>

            <div v-if="companyResumeExperience.length" class="rounded-xl border border-slate-100 p-4">
              <div class="mb-3 text-sm font-semibold text-slate-900">{{ $t('实习 / 工作经历') }}</div>
              <div class="space-y-3">
                <div v-for="(item, index) in companyResumeExperience" :key="`exp-${index}`" class="rounded-lg bg-slate-50 px-4 py-3">
                  <div class="text-sm font-medium text-slate-900">{{ item.company || '-' }}<span v-if="item.position"> · {{ item.position }}</span></div>
                  <div class="mt-1 text-xs text-slate-400">{{ item.startDate || '-' }} - {{ item.endDate || '-' }}</div>
                  <p v-if="item.description" class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{{ item.description }}</p>
                </div>
              </div>
            </div>

            <div v-if="companyResumeProjects.length" class="rounded-xl border border-slate-100 p-4">
              <div class="mb-3 text-sm font-semibold text-slate-900">{{ $t('项目经历') }}</div>
              <div class="space-y-3">
                <div v-for="(item, index) in companyResumeProjects" :key="`proj-${index}`" class="rounded-lg bg-slate-50 px-4 py-3">
                  <div class="text-sm font-medium text-slate-900">{{ item.name || '-' }}</div>
                  <div class="mt-1 text-xs text-slate-400">{{ item.startDate || '-' }} - {{ item.endDate || '-' }}</div>
                  <p v-if="item.description" class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{{ item.description }}</p>
                </div>
              </div>
            </div>

            <div v-if="selectedCompanyResumeApp?.resume?.filePath" class="flex justify-end">
              <a :href="withPrivateFileToken(selectedCompanyResumeApp.resume.filePath)" target="_blank" rel="noreferrer" class="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
                {{ $t('打开附件简历') }}
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import toast from '@/utils/toast'
import { withPrivateFileToken } from '@/utils/private-file'
import { getApplicationCalendarApi } from '@/api/application'
import { getMyCompanyApi } from '@/api/company'
import { useUserStore } from '@/stores/user'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const route = useRoute()

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const userStore = useUserStore()
const isEnterprise = computed(() => userStore.userInfo?.role === 'enterprise')
const viewMode = ref<'list' | 'calendar'>('list')
const calendarYear = ref(new Date().getFullYear())
const calendarMonth = ref(new Date().getMonth() + 1)
const calendarEvents = ref<any[]>([])
const companyApplication = ref<any>(null)
const companyApplications = ref<any[]>([])
const companyApplicationsLoading = ref(false)
const companyApplicationStats = ref<any>({ total: 0, byStatus: [], byTag: [] })
const companyInviteVisible = ref(false)
const companyInviteSubmitting = ref(false)
const companyResultVisible = ref(false)
const companyResultSubmitting = ref(false)
const companyResumeVisible = ref(false)
const selectedCompanyApp = ref<any>(null)
const selectedCompanyResumeApp = ref<any>(null)
const companyInviteForm = reactive({
  status: 'first_interview',
  nextDate: '',
  note: '',
})
const companyResultForm = reactive({
  status: 'second_interview',
  nextDate: '',
  note: '',
})
const companyFilters = reactive({
  keyword: '',
  status: '',
  tag: '',
})

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  events: any[]
}

const calendarDays = computed<CalendarDay[]>(() => {
  const y = calendarYear.value, m = calendarMonth.value
  const firstDay = new Date(y, m - 1, 1)
  const lastDay = new Date(y, m, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const days: CalendarDay[] = []
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(y, m - 1, -i)
    days.push({ date: d.getDate(), isCurrentMonth: false, isToday: false, events: [] })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date: d, isCurrentMonth: true, isToday: dateStr === todayStr,
      events: calendarEvents.value.filter(e => e.nextDate?.startsWith(dateStr)),
    })
  }
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, isCurrentMonth: false, isToday: false, events: [] })
    }
  }
  return days
})

function changeMonth(delta: number) {
  calendarMonth.value += delta
  if (calendarMonth.value > 12) { calendarMonth.value = 1; calendarYear.value++ }
  if (calendarMonth.value < 1) { calendarMonth.value = 12; calendarYear.value-- }
  fetchCalendar()
}

function onCalendarEventClick(evt: { id: number }) {
  viewMode.value = 'list'
  nextTick(() => {
    expandedId.value = evt.id
    fetchLogs(evt.id)
    fetchNotes(evt.id)
  })
}

async function fetchCalendar() {
  const y = calendarYear.value, m = calendarMonth.value
  const startDate = `${y}-${String(m).padStart(2, '0')}-01`
  const lastDay = new Date(y, m, 0).getDate()
  const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`
  try {
    const res: any = await getApplicationCalendarApi({ startDate, endDate })
    calendarEvents.value = res.data || res || []
  } catch {
    calendarEvents.value = []
  }
}

const STATUS_OPTIONS = computed(() => [
  { value: 'pending', label: t('待筛选') },
  { value: 'written_test', label: t('笔试') },
  { value: 'first_interview', label: t('一面') },
  { value: 'second_interview', label: t('二面') },
  { value: 'hr_interview', label: t('HR面') },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: t('拒信') },
])
const TAG_OPTIONS = computed(() => [
  { value: 'in_progress', label: t('进行中') },
  { value: 'passed', label: t('已通过') },
  { value: 'failed', label: t('已失败') },
  { value: 'abandoned', label: t('已放弃') },
])
const weekDayLabels = computed(() => [
  t('周一'), t('周二'), t('周三'), t('周四'), t('周五'), t('周六'), t('周日'),
])

interface Application {
  id: number
  company: string
  position: string
  channel?: string
  salaryRange?: string
  location?: string
  status: string
  tag: string
  nextDate?: string
  remark?: string
  createdAt: string
  updatedAt: string
  jobId?: number
  stageMeta?: StageMeta
  resume?: {
    id: number
    title?: string
    targetPosition?: string
    filePath?: string
    content?: Record<string, any>
    updatedAt?: string
  } | null
}

interface StageMeta {
  stageStartAt?: string
  checkedInAt?: string | null
  resultInquiryAt?: string | null
}

interface StatusLog {
  id: number
  fromStatus: string
  toStatus: string
  note?: string
  createdAt: string
}

interface ApplicationNote {
  id: number
  type?: string
  content: string
  createdAt: string
}

interface Stats {
  total: number
  byStatus: { status: string; count: string }[]
  byTag: { tag: string; count: string }[]
}

const applications = ref<Application[]>([])
const stats = ref<Stats>({ total: 0, byStatus: [], byTag: [] })
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const expandedId = ref<number | null>(null)
const logsMap = ref<Record<number, StatusLog[]>>({})
const notesMap = ref<Record<number, ApplicationNote[]>>({})
const loadingLogs = ref<Record<number, boolean>>({})
const loadingNotes = ref<Record<number, boolean>>({})
const newNoteContent = ref<Record<number, string>>({})
const newNoteType = ref<Record<number, string>>({})
const showCreate = ref(false)
const showEdit = ref(false)
const submitting = ref(false)
const deleteTarget = ref<Application | null>(null)
const editId = ref<number | null>(null)
const studentActionLoading = ref<Record<string, boolean>>({})

const filters = reactive({
  keyword: '',
  status: '',
  tag: '',
  startDate: '',
  endDate: '',
})

const form = reactive({
  company: '',
  position: '',
  channel: '',
  salaryRange: '',
  location: '',
  jobDescription: '',
})

const editForm = reactive({
  company: '',
  position: '',
  channel: '',
  salaryRange: '',
  location: '',
  nextDate: '',
  remark: '',
})

const statusOptions = STATUS_OPTIONS
const tagOptions = TAG_OPTIONS


const statsByStatus = ref<{ status: string; count: number }[]>([])
const statsByTag = ref<{ tag: string; count: number }[]>([])
function companyStatusLabel(status?: string) {
  return {
    pending: t('审核中'),
    approved: t('已通过'),
    rejected: t('审核未通过'),
  }[status || ''] || (status || t('未知'))
}
function companyStatusClass(status?: string) {
  return {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  }[status || ''] || 'bg-slate-100 text-slate-600'
}
function companyTagCount(tag: string) {
  return Number(companyApplicationStats.value.byTag?.find((item: any) => item.tag === tag)?.count || 0)
}
const companyResumeContent = computed<Record<string, any>>(() => selectedCompanyResumeApp.value?.resume?.content || {})
const companyResumeBasicInfo = computed<Record<string, any>>(() => companyResumeContent.value?.basicInfo || {})
const companyResumeSkills = computed<string[]>(() => Array.isArray(companyResumeContent.value?.skills) ? companyResumeContent.value.skills : [])
const companyResumeEducation = computed<any[]>(() => Array.isArray(companyResumeContent.value?.education) ? companyResumeContent.value.education : [])
const companyResumeExperience = computed<any[]>(() => Array.isArray(companyResumeContent.value?.experience) ? companyResumeContent.value.experience : [])
const companyResumeProjects = computed<any[]>(() => Array.isArray(companyResumeContent.value?.projects) ? companyResumeContent.value.projects : [])
function isInterviewStage(status?: string) {
  return ['written_test', 'first_interview', 'second_interview', 'hr_interview'].includes(status || '')
}
function isPlatformManaged(app: Application) {
  return !!app.jobId
}
function normalizeDateOnly(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  date.setHours(0, 0, 0, 0)
  return date
}
function hasDateStarted(value?: string) {
  const target = normalizeDateOnly(value)
  if (!target) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.getTime() >= target.getTime()
}
function isNextDayOrLater(value?: string) {
  const target = normalizeDateOnly(value)
  if (!target) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.getTime() > target.getTime()
}
function canStudentCheckIn(app: Application) {
  return isPlatformManaged(app) && isInterviewStage(app.status) && hasDateStarted(app.nextDate) && !app.stageMeta?.checkedInAt
}
function canStudentInquireResult(app: Application) {
  return isPlatformManaged(app) && isInterviewStage(app.status) && !!app.stageMeta?.checkedInAt && !app.stageMeta?.resultInquiryAt && isNextDayOrLater(app.nextDate)
}
function isStudentActionLoading(id: number, action: 'checkin' | 'inquiry') {
  return !!studentActionLoading.value[`${action}-${id}`]
}
function canCompanyAdjustSchedule(app: any) {
  return app.status !== 'offer' && app.status !== 'rejected'
}
function companyScheduleActionLabel(app: any) {
  return isInterviewStage(app.status) ? t('调整安排') : t('发送邀请')
}
function canCompanySendResult(app: any) {
  return isInterviewStage(app.status) && (isNextDayOrLater(app.nextDate) || !!app.stageMeta?.checkedInAt || !!app.stageMeta?.resultInquiryAt)
}
function companyResultOptions(app?: any) {
  const currentStatus = app?.status
  const map: Record<string, { value: string; label: string }[]> = {
    written_test: [
      { value: 'first_interview', label: t('进入一面') },
      { value: 'rejected', label: t('未通过') },
    ],
    first_interview: [
      { value: 'second_interview', label: t('进入二面') },
      { value: 'hr_interview', label: t('进入 HR 面') },
      { value: 'offer', label: t('发放 Offer') },
      { value: 'rejected', label: t('未通过') },
    ],
    second_interview: [
      { value: 'hr_interview', label: t('进入 HR 面') },
      { value: 'offer', label: t('发放 Offer') },
      { value: 'rejected', label: t('未通过') },
    ],
    hr_interview: [
      { value: 'offer', label: t('发放 Offer') },
      { value: 'rejected', label: t('未通过') },
    ],
  }
  return map[currentStatus || ''] || []
}
function requiresNextDate(status?: string) {
  return ['written_test', 'first_interview', 'second_interview', 'hr_interview'].includes(status || '')
}

function statusLabel(s: string) {
  return STATUS_OPTIONS.value.find((o) => o.value === s)?.label ?? s
}
function tagLabel(tg: string) {
  return TAG_OPTIONS.value.find((o) => o.value === tg)?.label ?? tg
}
function statusBadgeClass(s: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    written_test: 'bg-blue-50 text-blue-700',
    first_interview: 'bg-cyan-50 text-cyan-700',
    second_interview: 'bg-teal-50 text-teal-700',
    hr_interview: 'bg-indigo-50 text-indigo-700',
    offer: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  }
  return map[s] ?? 'bg-slate-100 text-slate-600'
}
function tagBadgeClass(t: string) {
  const map: Record<string, string> = {
    in_progress: 'bg-blue-50 text-blue-600',
    passed: 'bg-green-50 text-green-600',
    failed: 'bg-red-50 text-red-600',
    abandoned: 'bg-slate-100 text-slate-500',
  }
  return map[t] ?? 'bg-slate-100 text-slate-600'
}
function formatTime(t: string) {
  return new Date(t).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('zh-CN')
}

function toggleStatusFilter(s: string) {
  filters.status = filters.status === s ? '' : s
  page.value = 1
  fetchList()
}
function toggleTagFilter(t: string) {
  filters.tag = filters.tag === t ? '' : t
  page.value = 1
  fetchList()
}
function resetFilters() {
  filters.keyword = ''
  filters.status = ''
  filters.tag = ''
  filters.startDate = ''
  filters.endDate = ''
  page.value = 1
  fetchList()
}

async function fetchStats() {
  try {
    const res: any = await request.get('/applications/stats')
    const d = res?.data ?? res
    stats.value = { total: d.total ?? 0, byStatus: d.byStatus ?? [], byTag: d.byTag ?? [] }
    statsByStatus.value = (d.byStatus ?? []).map((x: any) => ({ status: x.status, count: +x.count }))
    statsByTag.value = (d.byTag ?? []).map((x: any) => ({ tag: x.tag, count: +x.count }))
  } catch {}
}

async function fetchCompanyApplications() {
  companyApplicationsLoading.value = true
  try {
    const res: any = await request.get('/applications/company', {
      params: {
        keyword: companyFilters.keyword.trim() || undefined,
        status: companyFilters.status || undefined,
        tag: companyFilters.tag || undefined,
        page: 1,
        pageSize: 20,
      },
    })
    companyApplications.value = res?.data?.list || res?.list || []
  } catch {
    companyApplications.value = []
  } finally {
    companyApplicationsLoading.value = false
  }
}

async function fetchCompanyApplicationStats() {
  try {
    const res: any = await request.get('/applications/company/stats')
    companyApplicationStats.value = res?.data || res || { total: 0, byStatus: [], byTag: [] }
  } catch {
    companyApplicationStats.value = { total: 0, byStatus: [], byTag: [] }
  }
}

function openCompanyInviteModal(app: any) {
  selectedCompanyApp.value = app
  companyInviteForm.status = app.status && app.status !== 'pending' ? app.status : 'first_interview'
  companyInviteForm.nextDate = app.nextDate ? String(app.nextDate).split('T')[0] : ''
  companyInviteForm.note = ''
  companyInviteVisible.value = true
}

function openCompanyResumeModal(app: any) {
  selectedCompanyResumeApp.value = app
  companyResumeVisible.value = true
}

function openCompanyResultModal(app: any) {
  selectedCompanyApp.value = app
  const options = companyResultOptions(app)
  companyResultForm.status = options[0]?.value || 'rejected'
  companyResultForm.nextDate = ''
  companyResultForm.note = ''
  companyResultVisible.value = true
}

async function submitCompanyInvite() {
  if (!selectedCompanyApp.value) return
  companyInviteSubmitting.value = true
  try {
    await request.put(`/applications/company/${selectedCompanyApp.value.id}/status`, {
      status: companyInviteForm.status,
      nextDate: companyInviteForm.nextDate || undefined,
      note: companyInviteForm.note.trim() || undefined,
    })
    toast(t('面试邀请已发送'), 'success')
    companyInviteVisible.value = false
    await fetchCompanyApplications()
    await fetchCompanyApplicationStats()
  } catch {
    /* interceptor */
  } finally {
    companyInviteSubmitting.value = false
  }
}

async function submitCompanyResult() {
  if (!selectedCompanyApp.value) return
  companyResultSubmitting.value = true
  try {
    await request.post(`/applications/company/${selectedCompanyApp.value.id}/result`, {
      status: companyResultForm.status,
      nextDate: requiresNextDate(companyResultForm.status) ? companyResultForm.nextDate || undefined : undefined,
      note: companyResultForm.note.trim() || undefined,
    })
    toast(t('面试结果已发送'), 'success')
    companyResultVisible.value = false
    await fetchCompanyApplications()
    await fetchCompanyApplicationStats()
  } catch {
    /* interceptor */
  } finally {
    companyResultSubmitting.value = false
  }
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await request.get('/applications', {
      params: {
        page: page.value,
        pageSize: pageSize.value,
        keyword: filters.keyword.trim() || undefined,
        status: filters.status || undefined,
        tag: filters.tag || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      },
    })
    const d = res?.data ?? res
    applications.value = d.list ?? []
    total.value = d.total ?? 0
    page.value = d.page ?? page.value
    pageSize.value = d.pageSize ?? pageSize.value
    await focusApplicationFromRoute()
  } catch {
  } finally {
    loading.value = false
  }
}

function getFocusedApplicationId() {
  const raw = route.query.appId
  const value = Array.isArray(raw) ? raw[0] : raw
  const id = Number(value)
  return Number.isFinite(id) && id > 0 ? id : null
}

async function focusApplicationFromRoute() {
  const id = getFocusedApplicationId()
  if (!id || isEnterprise.value) return
  if (!applications.value.some((app) => app.id === id)) {
    try {
      const res: any = await request.get(`/applications/${id}`)
      const app = res?.data ?? res
      if (app?.id) {
        applications.value = [app, ...applications.value.filter((item) => item.id !== app.id)]
      }
    } catch {
      return
    }
  }
  expandedId.value = id
  fetchLogs(id)
  fetchNotes(id)
}

function toggleExpand(id: number) {
  if (expandedId.value === id) {
    expandedId.value = null
    return
  }
  expandedId.value = id
  fetchLogs(id)
  fetchNotes(id)
}

async function fetchLogs(id: number) {
  loadingLogs.value[id] = true
  try {
    const res: any = await request.get(`/applications/${id}/logs`)
    const list = res?.data ?? res ?? []
    logsMap.value = { ...logsMap.value, [id]: Array.isArray(list) ? list : [] }
  } catch {
    logsMap.value = { ...logsMap.value, [id]: [] }
  } finally {
    loadingLogs.value[id] = false
  }
}

async function fetchNotes(id: number) {
  loadingNotes.value[id] = true
  try {
    const res: any = await request.get(`/applications/${id}/notes`)
    const list = res?.data ?? res ?? []
    notesMap.value = { ...notesMap.value, [id]: Array.isArray(list) ? list : [] }
  } catch {
    notesMap.value = { ...notesMap.value, [id]: [] }
  } finally {
    loadingNotes.value[id] = false
  }
}

async function changeStatus(app: Application, newStatus: string) {
  const oldStatus = app.status
  if (oldStatus === newStatus) return
  try {
    const res: any = await request.put(`/applications/${app.id}/status`, { status: newStatus })
    const updated = res?.data ?? res
    app.status = updated?.status ?? newStatus
    app.tag = updated?.tag ?? app.tag
    app.nextDate = updated?.nextDate ?? app.nextDate
    toast(t('状态已更新'), 'success')
    fetchStats()
    if (expandedId.value === app.id) fetchLogs(app.id)
  } catch {
    app.status = oldStatus
  }
}

async function checkInApplication(app: Application) {
  const key = `checkin-${app.id}`
  studentActionLoading.value[key] = true
  try {
    await request.post(`/applications/${app.id}/check-in`, {})
    toast(t('面试签到成功'), 'success')
    await fetchList()
    if (expandedId.value === app.id) await fetchLogs(app.id)
  } catch {
    /* interceptor */
  } finally {
    studentActionLoading.value[key] = false
  }
}

async function inquireApplicationResult(app: Application) {
  const key = `inquiry-${app.id}`
  studentActionLoading.value[key] = true
  try {
    await request.post(`/applications/${app.id}/result-inquiry`, {})
    toast(t('已提醒企业反馈面试结果'), 'success')
    await fetchList()
    if (expandedId.value === app.id) await fetchLogs(app.id)
  } catch {
    /* interceptor */
  } finally {
    studentActionLoading.value[key] = false
  }
}

function noteTypeLabel(type: string) {
  return ({ interview: t('面试'), company: t('公司'), salary: t('薪资'), other: t('其他') } as Record<string, string>)[type] || type
}
function noteTypeBadgeClass(type: string) {
  return ({ interview: 'bg-blue-50 text-blue-600', company: 'bg-purple-50 text-purple-600', salary: 'bg-emerald-50 text-emerald-600', other: 'bg-slate-50 text-slate-500' } as Record<string, string>)[type] || 'bg-slate-50 text-slate-500'
}

async function addNote(app: Application) {
  const content = (newNoteContent.value[app.id] ?? '').trim()
  if (!content) return
  const type = newNoteType.value[app.id] || 'other'
  try {
    await request.post(`/applications/${app.id}/notes`, { content, type })
    newNoteContent.value = { ...newNoteContent.value, [app.id]: '' }
    newNoteType.value = { ...newNoteType.value, [app.id]: 'other' }
    toast(t('备注已添加'), 'success')
    fetchNotes(app.id)
  } catch {}
}

async function deleteNote(app: Application, noteId: number) {
  try {
    await request.delete(`/applications/notes/${noteId}`)
    toast(t('备注已删除'), 'success')
    fetchNotes(app.id)
  } catch {}
}

function openCreateModal() {
  form.company = ''
  form.position = ''
  form.channel = ''
  form.salaryRange = ''
  form.location = ''
  form.jobDescription = ''
  showCreate.value = true
}

async function handleCreate() {
  if (!form.company.trim() || !form.position.trim()) return
  submitting.value = true
  try {
    await request.post('/applications', {
      company: form.company.trim(),
      position: form.position.trim(),
      channel: form.channel.trim() || undefined,
      salaryRange: form.salaryRange.trim() || undefined,
      location: form.location.trim() || undefined,
      jobDescription: form.jobDescription.trim() || undefined,
    })
    toast(t('投递记录创建成功'), 'success')
    showCreate.value = false
    fetchList()
    fetchStats()
  } catch {
  } finally {
    submitting.value = false
  }
}

function openEditModal(app: Application) {
  editId.value = app.id
  editForm.company = app.company
  editForm.position = app.position
  editForm.channel = app.channel ?? ''
  editForm.salaryRange = app.salaryRange ?? ''
  editForm.location = app.location ?? ''
  editForm.nextDate = app.nextDate ? app.nextDate.split('T')[0] : ''
  editForm.remark = app.remark ?? ''
  showEdit.value = true
}

async function handleEdit() {
  if (!editId.value || !editForm.company.trim() || !editForm.position.trim()) return
  submitting.value = true
  try {
    await request.put(`/applications/${editId.value}`, {
      company: editForm.company.trim(),
      position: editForm.position.trim(),
      channel: editForm.channel.trim() || undefined,
      salaryRange: editForm.salaryRange.trim() || undefined,
      location: editForm.location.trim() || undefined,
      nextDate: editForm.nextDate || undefined,
      remark: editForm.remark.trim() || undefined,
    })
    toast(t('投递记录已更新'), 'success')
    showEdit.value = false
    const idx = applications.value.findIndex((a) => a.id === editId.value)
    if (idx >= 0) {
      applications.value[idx] = { ...applications.value[idx], ...editForm }
    }
    fetchList()
  } catch {
  } finally {
    submitting.value = false
  }
}

function confirmDelete(app: Application) {
  deleteTarget.value = app
}

async function handleDelete() {
  if (!deleteTarget.value) return
  const id = deleteTarget.value.id
  try {
    await request.delete(`/applications/${id}`)
    toast(t('投递记录已删除'), 'success')
    deleteTarget.value = null
    if (expandedId.value === id) expandedId.value = null
    fetchList()
    fetchStats()
  } catch {
  } finally {
    deleteTarget.value = null
  }
}

watch([() => filters.status, () => filters.tag, () => filters.keyword], () => {
  page.value = 1
})

watch(() => route.query.appId, () => {
  focusApplicationFromRoute()
})

onMounted(() => {
  if (!isLoggedIn.value) return
  const load = async () => {
    if (!userStore.userInfo) {
      try { await userStore.fetchUserInfo() } catch { /* ignore */ }
    }
    if (isEnterprise.value) {
      try {
        const res: any = await getMyCompanyApi()
        companyApplication.value = res.data || res || null
      } catch {
        companyApplication.value = null
      }
      if (companyApplication.value?.status === 'approved') {
        await fetchCompanyApplications()
        await fetchCompanyApplicationStats()
      }
      return
    }
    fetchStats()
    fetchList()
  }
  load()
})
</script>
