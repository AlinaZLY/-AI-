<template>
  <div class="page-shell space-y-8">
    <section class="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-600/70">Interview Lab</p>
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">{{ $t('AI 校招模拟面试') }}</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {{ $t('把面试练习、能力雷达和题库浏览放在同一页，先练习，再看弱项，最后回到题库针对性补齐。') }}
          </p>
        </div>
        <button
          @click="openStartModal"
          class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          {{ $t('开始新面试') }}
        </button>
      </div>
    </section>

    <template v-if="isLoggedIn">
      <section class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ $t('练习概览') }}</h2>
              <p class="mt-1 text-sm text-gray-500">{{ $t('先选择方向发起练习，完成答题后右侧会同步更新能力雷达。') }}</p>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:w-[21rem]">
              <div class="rounded-xl bg-gray-50 px-3 py-3">
                <div class="text-xs text-gray-400">{{ $t('总场次') }}</div>
                <div class="mt-1 text-xl font-semibold text-gray-900">{{ interviews.length }}</div>
              </div>
              <div class="rounded-xl bg-blue-50 px-3 py-3">
                <div class="text-xs text-blue-500">{{ $t('进行中') }}</div>
                <div class="mt-1 text-xl font-semibold text-blue-700">{{ inProgressInterviewCount }}</div>
              </div>
              <div class="rounded-xl bg-emerald-50 px-3 py-3">
                <div class="text-xs text-emerald-500">{{ $t('平均分') }}</div>
                <div class="mt-1 text-xl font-semibold text-emerald-700">{{ averageInterviewScore }}</div>
              </div>
            </div>
          </div>

          <div v-if="categoryTree.length" class="mt-5">
            <p class="mb-2 text-sm font-medium text-gray-700">{{ $t('面试方向') }}</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categoryTree"
                :key="cat.id"
                type="button"
                @click="selectRootCategory(cat)"
                :class="[
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
                  selectedCategoryId === cat.id || isDescendantSelected(cat)
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                ]"
              >
                <img
                  v-if="categoryCover(cat)"
                  :src="categoryCover(cat)"
                  alt=""
                  class="h-6 w-6 rounded-full object-cover shrink-0"
                />
                <span>{{ cat.name }}</span>
              </button>
            </div>
            <div v-if="childPillsForSelection.length" class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="ch in childPillsForSelection"
                :key="ch.id"
                type="button"
                @click="selectedCategoryId = ch.id"
                :class="[
                  'rounded-full px-3 py-1 text-xs border transition-colors',
                  selectedCategoryId === ch.id
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100',
                ]"
              >
                {{ ch.name }}
              </button>
            </div>
          </div>
        </div>

        <aside class="overflow-hidden rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-5 text-white shadow-lg shadow-slate-900/10">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/70">Radar</p>
              <h2 class="mt-2 text-lg font-semibold">{{ $t('能力雷达') }}</h2>
              <p class="mt-1 text-sm leading-6 text-slate-300">{{ $t('雷达固定放在右侧，方便一边看记录，一边判断下一轮该练什么。') }}</p>
            </div>
            <span class="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-200">
              {{ $t('{count} 场已完成', { count: completedInterviewCount }) }}
            </span>
          </div>

          <div v-if="radarLoading" class="flex min-h-[320px] items-center justify-center">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-cyan-300 border-t-transparent"></div>
          </div>
          <div v-else-if="!canShowRadarChart" class="flex min-h-[320px] flex-col items-center justify-center text-center">
            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M9.049 2.927C9.349 2.005 10.651 2.005 10.951 2.927L12.2 6.77a1 1 0 00.95.69H17.2c.969 0 1.371 1.24.588 1.81l-3.274 2.378a1 1 0 00-.364 1.118l1.25 3.842c.3.922-.755 1.688-1.539 1.118l-3.273-2.378a1 1 0 00-1.176 0L5.14 17.726c-.784.57-1.838-.196-1.539-1.118l1.25-3.842a1 1 0 00-.364-1.118L1.213 9.27c-.783-.57-.38-1.81.588-1.81h4.05a1 1 0 00.95-.69L9.05 2.927z" />
              </svg>
            </div>
            <p class="text-sm text-slate-200">{{ $t('暂无雷达数据') }}</p>
            <p class="mt-2 max-w-xs text-xs leading-5 text-slate-400">{{ $t('先完成至少一场面试，系统会根据最近完成的记录自动生成能力雷达。') }}</p>
          </div>
          <div v-else-if="radarSpec" class="mt-6 flex flex-col items-center">
            <p v-if="radarInterviewHint" class="mb-4 text-center text-xs text-slate-300">{{ radarInterviewHint }}</p>
            <svg :viewBox="radarViewBox" class="h-auto w-full max-w-[18rem]" role="img" :aria-label="$t('能力雷达图')">
              <g v-for="(gridPts, gi) in radarSpec.grids" :key="'g' + gi">
                <polygon
                  :points="gridPts"
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  stroke-width="1"
                />
              </g>
              <g v-for="(axis, ai) in radarSpec.axes" :key="'a' + ai">
                <line
                  :x1="axis.x1"
                  :y1="axis.y1"
                  :x2="axis.x2"
                  :y2="axis.y2"
                  stroke="rgba(255,255,255,0.18)"
                  stroke-width="1"
                />
              </g>
              <polygon
                :points="radarSpec.dataPoly"
                fill="rgba(34, 211, 238, 0.24)"
                stroke="rgb(34, 211, 238)"
                stroke-width="2"
              />
              <g v-for="(lb, li) in radarSpec.labels" :key="'l' + li">
                <text
                  :x="lb.x"
                  :y="lb.y"
                  :text-anchor="lb.anchor"
                  dominant-baseline="middle"
                  fill="rgba(255,255,255,0.82)"
                  style="font-size: 11px"
                >
                  {{ lb.text }}
                </text>
                <text
                  :x="lb.x"
                  :y="lb.y + 14"
                  :text-anchor="lb.anchor"
                  dominant-baseline="middle"
                  fill="rgb(125, 211, 252)"
                  style="font-size: 10px; font-weight: 600"
                >
                  {{ lb.score }}
                </text>
              </g>
            </svg>
          </div>
        </aside>
      </section>

      <section class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ $t('最近面试') }}</h2>
            <p class="mt-1 text-sm text-gray-500">{{ $t('点击记录查看详情或继续作答，完成后雷达会自动刷新。') }}</p>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-16">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
        <div v-else-if="interviews.length" class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            v-for="iv in interviews"
            :key="iv.id"
            class="cursor-pointer rounded-xl border border-gray-100 p-5 transition-shadow hover:shadow-sm"
            @click="openInterview(iv)"
          >
            <div class="mb-3 flex items-center justify-between">
              <h3 class="font-semibold text-gray-900">{{ iv.jobTitle || $t('模拟面试') }}</h3>
              <span
                :class="iv.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'"
                class="rounded-full px-2 py-0.5 text-xs"
              >
                {{ iv.status === 'completed' ? $t('已完成') : $t('进行中') }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{{ iv.answeredCount }}/{{ iv.questionCount }} {{ $t('题') }}</span>
                <span v-if="iv.totalScore">{{ $t('得分') }}: {{ iv.totalScore }}</span>
                <span>{{ formatTime(iv.createdAt) }}</span>
              </div>
              <button
                type="button"
                class="ml-2 rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50 transition-colors"
                @click.stop="handleDeleteInterview(iv.id)"
>{{ $t('删除') }}</button>
            </div>
          </div>
        </div>
        <div v-else class="py-16 text-center text-gray-400">
          {{ $t('暂无面试记录，点击右上角开始') }}
        </div>
      </section>
    </template>

    <section v-else class="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-blue-900">{{ $t('登录后可查看面试记录与能力雷达') }}</h2>
          <p class="mt-1 text-sm text-blue-800/80">{{ $t('未登录时依然可以先浏览题库，熟悉方向后再开始模拟面试。') }}</p>
        </div>
        <div class="flex gap-3">
          <router-link to="/login" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">{{ $t('立即登录') }}</router-link>
          <router-link to="/register" class="rounded-lg border border-blue-200 px-4 py-2 text-sm text-blue-700 hover:bg-white/60">{{ $t('注册账号') }}</router-link>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('题库浏览') }}</h2>
          <p class="mt-1 text-sm text-gray-500">{{ $t('后台题库会同步展示在这里，可按分类和关键词筛选。') }}</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input
            v-model="questionKeyword"
            type="text"
:placeholder="$t('搜索题目或公司')"
            class="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-64"
            @keyup.enter="handleQuestionSearch"
          />
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            @click="resetQuestionFilters"
          >
            {{ $t('重置') }}
          </button>
          <button
            type="button"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            @click="handleQuestionSearch"
          >
            {{ $t('搜索') }}
          </button>
        </div>
      </div>

      <div v-if="categoryTree.length" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            @click="selectQuestionCategory(null)"
            :class="[
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              questionCategoryId == null
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
            ]"
          >
            {{ $t('全部题目') }}
          </button>
          <button
            v-for="cat in categoryTree"
            :key="`q-root-${cat.id}`"
            type="button"
            @click="selectQuestionRootCategory(cat)"
            :class="[
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
              questionCategoryId === cat.id || isQuestionDescendantSelected(cat)
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
            ]"
          >
            <img
              v-if="categoryCover(cat)"
              :src="categoryCover(cat)"
              alt=""
              class="h-5 w-5 rounded-full object-cover"
            />
            <span>{{ cat.name }}</span>
          </button>
        </div>

        <div v-if="questionChildCategories.length" class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="cat in questionChildCategories"
            :key="`q-child-${cat.id}`"
            type="button"
            @click="selectQuestionCategory(cat.id)"
            :class="[
              'rounded-full border px-3 py-1 text-xs transition-colors',
              questionCategoryId === cat.id
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <div v-if="questionLoading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
      <div v-else-if="questionBank.length" class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article
          v-for="question in questionBank"
          :key="question.id"
          class="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
        >
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <span :class="questionTypeClass(question.questionType)" class="rounded-full px-2.5 py-0.5 text-xs font-medium">
              {{ questionTypeLabel(question.questionType) }}
            </span>
            <span :class="questionDifficultyClass(question.difficulty)" class="rounded-full px-2.5 py-0.5 text-xs font-medium">
              {{ questionDifficultyLabel(question.difficulty) }}
            </span>
            <span v-if="question.company" class="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600">
              {{ question.company }}
            </span>
          </div>
          <h3 class="text-sm font-medium leading-6 text-gray-900">{{ question.question }}</h3>
          <div v-if="question.tags?.length" class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tag in question.tags.slice(0, 4)"
              :key="`${question.id}-${tag}`"
              class="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500 ring-1 ring-gray-200"
            >
              {{ tag }}
            </span>
          </div>
        </article>
      </div>
      <div v-else class="py-12 text-center text-sm text-gray-400">
        {{ $t('当前条件下暂无题目') }}
      </div>

      <div v-if="questionTotal > questionPageSize" class="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="questionPage <= 1"
          @click="changeQuestionPage(questionPage - 1)"
        >
          {{ $t('上一页') }}
        </button>
        <span class="text-sm text-gray-500">{{ questionPage }} / {{ questionTotalPages }}</span>
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="questionPage >= questionTotalPages"
          @click="changeQuestionPage(questionPage + 1)"
        >
          {{ $t('下一页') }}
        </button>
      </div>
    </section>

    <!-- 开始面试弹窗 -->
    <div v-if="showStartModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeStartModal">
      <div class="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-bold text-gray-900 mb-1">{{ $t('开始模拟面试') }}</h2>
        <p class="text-xs text-gray-500 mb-4">{{ startWizardSubtitle }}</p>

        <!-- Step 1: 简历 -->
        <div v-if="startWizardStep === 1 && isLoggedIn" class="min-h-[200px]">
          <div v-if="resumesLoading" class="py-12 flex justify-center">
            <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <template v-else-if="!modalResumes.length">
            <div class="rounded-xl border border-amber-100 bg-amber-50/80 p-6 text-center">
              <p class="text-sm text-amber-900 mb-3">{{ $t('你还没有简历，请先创建一份简历再开始模拟面试。') }}</p>
              <router-link
                to="/my-resumes"
                class="inline-flex px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                @click="closeStartModal"
              >
                {{ $t('去创建简历') }}
              </router-link>
            </div>
          </template>
          <template v-else>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('选择本次面试关联的简历') }}</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="r in modalResumes"
                :key="'rs' + r.id"
                type="button"
                @click="selectedResumeId = r.id"
                :class="[
                  'text-left rounded-xl border p-4 transition-all',
                  selectedResumeId === r.id
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300',
                ]"
              >
                <div class="font-medium text-gray-900 text-sm truncate">{{ r.title || $t('未命名简历') }}</div>
                <div v-if="r.targetPosition" class="text-xs text-gray-500 mt-1 truncate">{{ r.targetPosition }}</div>
                <span v-if="r.isDefault" class="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ $t('默认') }}</span>
              </button>
            </div>
          </template>
        </div>

        <!-- Step 2: 分类 -->
        <div v-else-if="startWizardStep === 2" class="min-h-[200px]">
          <div v-if="categoriesLoading" class="py-12 flex justify-center">
            <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <template v-else>
            <div v-if="categoryTree.length" class="mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('选择分类') }}</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="cat in categoryTree"
                  :key="'m' + cat.id"
                  type="button"
                  @click="selectRootCategory(cat)"
                  :class="[
                    'flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all min-h-[8.5rem]',
                    selectedCategoryId === cat.id || isDescendantSelected(cat)
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white',
                  ]"
                >
                  <img
                    v-if="categoryCover(cat)"
                    :src="categoryCover(cat)"
                    alt=""
                    class="h-16 w-16 rounded-xl object-cover mb-2 shadow-sm"
                  />
                  <span
                    v-else
                    class="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-2 flex items-center justify-center text-gray-400 text-sm font-medium"
                  >{{ $t('题') }}</span>
                  <span class="text-sm font-medium text-gray-800 leading-tight px-1">{{ cat.name }}</span>
                </button>
              </div>
              <p v-if="childPillsForSelection.length" class="text-xs text-gray-500 mt-4 mb-2">{{ $t('细分方向') }}</p>
              <div v-if="childPillsForSelection.length" class="grid grid-cols-2 gap-2">
                <button
                  v-for="ch in childPillsForSelection"
                  :key="'mc' + ch.id"
                  type="button"
                  @click="selectedCategoryId = ch.id"
                  :class="[
                    'rounded-xl px-3 py-2.5 text-sm border text-center transition-colors',
                    selectedCategoryId === ch.id
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50',
                  ]"
                >
                  {{ ch.name }}
                </button>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 py-4">{{ $t('暂无面试分类，可直接进入下一步填写岗位信息。') }}</p>
          </template>
        </div>

        <!-- Step 3: 岗位与题量 -->
        <div v-else-if="startWizardStep === 3" class="space-y-3 min-h-[200px]">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('目标岗位') }}</label>
            <input
              v-model="startForm.jobTitle"
              :placeholder="$t('如：前端开发工程师')"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('题目数量') }}</label>
            <select
              v-model="startForm.questionCount"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option :value="3">{{ $t('3 题（快速练习）') }}</option>
              <option :value="5">{{ $t('5 题（标准模式）') }}</option>
              <option :value="10">{{ $t('10 题（深度训练）') }}</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button type="button" @click="closeStartModal" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            {{ $t('取消') }}
          </button>
          <button
            v-if="startWizardStep > startWizardFirstStep"
            type="button"
            @click="wizardBack"
            class="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {{ $t('上一步') }}
          </button>
          <button
            v-if="startWizardStep < 3"
            type="button"
            @click="wizardNext"
            :disabled="!canWizardNext"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ $t('下一步') }}
          </button>
          <button
            v-if="startWizardStep === 3"
            type="button"
            @click="startInterview"
            :disabled="starting || categoriesLoading"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ starting ? $t('生成中...') : $t('开始面试') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 面试详情弹窗 -->
    <div v-if="currentInterview" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="currentInterview = null">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">{{ currentInterview.jobTitle || $t('模拟面试') }}</h2>
          <button @click="currentInterview = null" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div v-if="currentInterview.totalScore" class="mb-4 p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ currentInterview.totalScore }} {{ $t('分') }}</div>
          <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">{{ currentInterview.overallFeedback }}</p>
        </div>
        <div v-for="(q, qi) in (currentInterview.questions || [])" :key="q.id" class="mb-4 p-4 border border-gray-100 rounded-lg">
          <h4 class="font-semibold text-gray-900 mb-2">{{ $t('第 {n} 题：').replace('{n}', String(Number(qi) + 1)) }}{{ q.question }}</h4>
          <div v-if="q.isAnswered" class="space-y-2">
            <div class="text-sm text-gray-600"><span class="font-medium">{{ $t('你的回答：') }}</span>{{ q.answer }}</div>
            <div class="text-sm text-green-600"><span class="font-medium">{{ $t('得分：') }}</span>{{ q.score }}/100</div>
            <div v-if="q.feedback" class="text-sm text-gray-500 whitespace-pre-line">{{ q.feedback }}</div>
          </div>
          <div v-else class="mt-2">
            <textarea
              v-model="answerTexts[q.id]"
              rows="3"
:placeholder="$t('请输入你的回答...')"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
            <button
              @click="submitAnswer(currentInterview.id, q.id)"
              :disabled="!answerTexts[q.id]?.trim()"
              class="mt-2 px-4 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ $t('提交回答') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import { getCategoriesApi, getQuestionsApi, getRadarDataApi, startInterviewApi, deleteInterviewApi } from '@/api/interview'
import { useI18n } from '@/i18n'

type CategoryNode = {
  id: number
  name: string
  cover?: string
  coverImage?: string
  children?: CategoryNode[]
}

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const router = useRouter()
const { t } = useI18n()

const startWizardStep = ref(1)
const startWizardFirstStep = computed(() => (isLoggedIn.value ? 1 : 2))
const startWizardSubtitle = computed(() => {
  const logged = isLoggedIn.value
  const s = startWizardStep.value
  if (!logged) {
    if (s === 2) return t('步骤 1/2：选择面试方向')
    if (s === 3) return t('步骤 2/2：岗位与题量')
    return ''
  }
  if (s === 1) return t('步骤 1/3：选择简历')
  if (s === 2) return t('步骤 2/3：选择面试方向')
  return t('步骤 3/3：岗位与题量')
})

const modalResumes = ref<any[]>([])
const resumesLoading = ref(false)
const selectedResumeId = ref<number | null>(null)

const interviews = ref<any[]>([])
const loading = ref(false)
const showStartModal = ref(false)
const starting = ref(false)
const currentInterview = ref<any>(null)
const answerTexts = reactive<Record<number, string>>({})
const startForm = reactive({ jobTitle: '', questionCount: 5 })

const categoryTree = ref<CategoryNode[]>([])
const categoriesLoading = ref(false)
const selectedCategoryId = ref<number | null>(null)
const expandedRootId = ref<number | null>(null)
const questionBank = ref<any[]>([])
const questionLoading = ref(false)
const questionKeyword = ref('')
const questionPage = ref(1)
const questionPageSize = 8
const questionTotal = ref(0)
const questionCategoryId = ref<number | null>(null)
const questionExpandedRootId = ref<number | null>(null)

const canWizardNext = computed(() => {
  if (startWizardStep.value === 1 && isLoggedIn.value) {
    if (resumesLoading.value) return false
    if (!modalResumes.value.length) return false
    return selectedResumeId.value != null
  }
  if (startWizardStep.value === 2) return !categoriesLoading.value
  return false
})

const radarLoading = ref(false)
const radarRaw = ref<any>(null)

const radarViewBox = '0 0 240 240'
const completedInterviewCount = computed(() => interviews.value.filter((item) => item.status === 'completed').length)
const inProgressInterviewCount = computed(() => interviews.value.filter((item) => item.status !== 'completed').length)
const averageInterviewScore = computed(() => {
  const scored = interviews.value.filter((item) => Number(item.totalScore) > 0)
  if (!scored.length) return '--'
  const totalScore = scored.reduce((sum, item) => sum + Number(item.totalScore || 0), 0)
  return Math.round(totalScore / scored.length)
})

function formatTime(t: string) {
  return new Date(t).toLocaleDateString('zh-CN')
}

function categoryCover(c: CategoryNode) {
  const u = c.cover || c.coverImage
  if (!u) return ''
  if (u.startsWith('http')) return u
  return u.startsWith('/') ? u : `/${u}`
}

function findRootContainingId(tree: CategoryNode[], id: number | null): CategoryNode | null {
  if (id == null) return tree[0] ?? null
  for (const node of tree) {
    if (node.id === id) return node
    if (node.children?.length && containsId(node.children, id)) return node
  }
  return null
}

function containsId(nodes: CategoryNode[], id: number): boolean {
  for (const n of nodes) {
    if (n.id === id) return true
    if (n.children?.length && containsId(n.children, id)) return true
  }
  return false
}

function selectRootCategory(cat: CategoryNode) {
  expandedRootId.value = cat.id
  selectedCategoryId.value = cat.id
}

function isDescendantSelected(root: CategoryNode): boolean {
  if (selectedCategoryId.value == null) return false
  if (root.id === selectedCategoryId.value) return false
  if (!root.children?.length) return false
  return containsId(root.children, selectedCategoryId.value)
}

const childPillsForSelection = computed(() => {
  const rootId = expandedRootId.value
  if (rootId == null) return []
  const root = categoryTree.value.find((c) => c.id === rootId)
  return root?.children ?? []
})

const questionChildCategories = computed(() => {
  const rootId = questionExpandedRootId.value
  if (rootId == null) return []
  const root = categoryTree.value.find((c) => c.id === rootId)
  return root?.children ?? []
})

const questionTotalPages = computed(() => Math.max(1, Math.ceil(questionTotal.value / questionPageSize)))

function normalizeRadarDimensions(raw: any): { name: string; score: number }[] {
  if (!raw) return []
  const dims = raw.dimensions
  if (!dims?.length) return []
  if (typeof dims[0] === 'object' && dims[0] !== null && 'name' in dims[0]) {
    return (dims as { name: string; score: number }[]).map((d) => ({
      name: String(d.name),
      score: Math.min(100, Math.max(0, Number(d.score) || 0)),
    }))
  }
  const names = dims as string[]
  const scores = raw.scores || {}
  return names.map((name) => ({
    name,
    score: Math.min(100, Math.max(0, Number(scores[name]) || 0)),
  }))
}

const normalizedRadar = computed(() => normalizeRadarDimensions(radarRaw.value))

const canShowRadarChart = computed(() => {
  const ic = radarRaw.value?.interviewCount
  return (ic ?? 0) > 0 && normalizedRadar.value.length > 0
})

const radarSpec = computed(() => {
  const items = normalizedRadar.value
  const n = items.length
  if (!n) return null
  const cx = 120
  const cy = 120
  const R = 88
  const labelR = 112
  const angleAt = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n
  const pointAt = (i: number, radius: number) => {
    const a = angleAt(i)
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) }
  }
  const grids = [1, 0.75, 0.5, 0.25].map((scale) => {
    const pts = Array.from({ length: n }, (_, i) => pointAt(i, R * scale))
    return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  })
  const dataPts = items.map((d, i) => pointAt(i, (d.score / 100) * R))
  const dataPoly = dataPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const axes = Array.from({ length: n }, (_, i) => {
    const outer = pointAt(i, R)
    return { x1: cx, y1: cy, x2: outer.x, y2: outer.y }
  })
  const labels = items.map((d, i) => {
    const p = pointAt(i, labelR)
    const deg = (angleAt(i) * 180) / Math.PI
    let anchor: 'start' | 'middle' | 'end' = 'middle'
    if (deg > 20 && deg < 160) anchor = 'start'
    else if (deg < -20 && deg > -160) anchor = 'end'
    return { x: p.x, y: p.y, text: d.name, score: d.score, anchor }
  })
  return { grids, dataPoly, axes, labels }
})

const radarInterviewHint = computed(() => {
  const c = radarRaw.value?.interviewCount
  if (c == null) return ''
  return t('基于最近 {count} 场已完成面试的维度平均分', { count: c })
})

async function loadCategories() {
  categoriesLoading.value = true
  try {
    const res: any = await getCategoriesApi()
    categoryTree.value = res.data || []
    if (categoryTree.value.length && selectedCategoryId.value == null) {
      const first = categoryTree.value[0]
      selectedCategoryId.value = first.id
      expandedRootId.value = first.id
    }
    if (categoryTree.value.length && questionExpandedRootId.value == null) {
      questionExpandedRootId.value = categoryTree.value[0].id
    }
  } catch {
    categoryTree.value = []
  } finally {
    categoriesLoading.value = false
  }
}

async function loadQuestionBank() {
  questionLoading.value = true
  try {
    const res: any = await getQuestionsApi({
      page: questionPage.value,
      pageSize: questionPageSize,
      categoryId: questionCategoryId.value ?? undefined,
      keyword: questionKeyword.value.trim() || undefined,
    })
    questionBank.value = res.data?.list || []
    questionTotal.value = res.data?.total || 0
  } catch {
    questionBank.value = []
    questionTotal.value = 0
  } finally {
    questionLoading.value = false
  }
}

async function loadRadar() {
  if (!isLoggedIn.value) return
  radarLoading.value = true
  try {
    const res: any = await getRadarDataApi()
    radarRaw.value = res.data
  } catch {
    radarRaw.value = null
  } finally {
    radarLoading.value = false
  }
}

async function loadResumesForModal() {
  if (!isLoggedIn.value) return
  resumesLoading.value = true
  try {
    const res: any = await request.get('/resumes')
    modalResumes.value = Array.isArray(res.data) ? res.data : (res.data?.list ?? [])
    const def = modalResumes.value.find((r: any) => r.isDefault)
    if (def) selectedResumeId.value = def.id
    else if (modalResumes.value.length === 1) selectedResumeId.value = modalResumes.value[0].id
    else selectedResumeId.value = null
  } catch {
    modalResumes.value = []
    selectedResumeId.value = null
  } finally {
    resumesLoading.value = false
  }
}

function closeStartModal() {
  showStartModal.value = false
}

function wizardBack() {
  const first = startWizardFirstStep.value
  if (startWizardStep.value > first) startWizardStep.value -= 1
}

function wizardNext() {
  if (!canWizardNext.value) return
  if (startWizardStep.value < 3) startWizardStep.value += 1
}

function openStartModal() {
  if (!isLoggedIn.value) {
    toast(t('请先登录后使用此功能'), 'warning')
    router.push({ path: '/login', query: { redirect: '/interview' } })
    return
  }
  startWizardStep.value = isLoggedIn.value ? 1 : 2
  showStartModal.value = true
  if (isLoggedIn.value) loadResumesForModal()
  if (!categoryTree.value.length && !categoriesLoading.value) loadCategories()
  const root = findRootContainingId(categoryTree.value, selectedCategoryId.value)
  if (root) expandedRootId.value = root.id
}

watch(showStartModal, (open) => {
  if (!open) {
    startWizardStep.value = 1
    selectedResumeId.value = null
    return
  }
  if (isLoggedIn.value) {
    const root = findRootContainingId(categoryTree.value, selectedCategoryId.value)
    if (root) expandedRootId.value = root.id
  }
})

async function startInterview() {
  if (isLoggedIn.value) {
    if (!selectedResumeId.value) {
      toast(t('请选择一份简历'), 'warning')
      return
    }
  }
  if (categoryTree.value.length && selectedCategoryId.value == null) {
    toast(t('请选择面试分类'), 'warning')
    return
  }
  starting.value = true
  try {
    const body: Record<string, unknown> = {
      jobTitle: startForm.jobTitle || t('模拟面试'),
      questionCount: startForm.questionCount,
    }
    if (selectedCategoryId.value != null) body.categoryId = selectedCategoryId.value
    if (isLoggedIn.value && selectedResumeId.value != null) body.resumeId = selectedResumeId.value
    const res: any = await startInterviewApi(body)
    showStartModal.value = false
    currentInterview.value = res.data
    startForm.jobTitle = ''
    startForm.questionCount = 5
    fetchInterviews()
  } catch {
    /* toast via interceptor */
  } finally {
    starting.value = false
  }
}

async function openInterview(iv: any) {
  try {
    const res: any = await request.get(`/interview/${iv.id}`)
    currentInterview.value = res.data
  } catch {
    /* */
  }
}

async function submitAnswer(interviewId: number, questionId: number) {
  const answer = answerTexts[questionId]?.trim()
  if (!answer) return
  try {
    await request.post(`/interview/${interviewId}/questions/${questionId}/answer`, { answer })
    toast(t('回答已提交'), 'success')
    await openInterview({ id: interviewId })
    await fetchInterviews()
    await loadRadar()
  } catch {
    /* */
  }
}

async function fetchInterviews() {
  loading.value = true
  try {
    const res: any = await request.get('/interview/list')
    interviews.value = res.data?.list || []
  } catch {
    /* */
  } finally {
    loading.value = false
  }
}

async function handleDeleteInterview(id: number) {
  if (!window.confirm(t('确定要删除这条面试记录吗？'))) return
  try {
    await deleteInterviewApi(id)
    toast(t('已删除'), 'success')
    if (currentInterview.value?.id === id) currentInterview.value = null
    await fetchInterviews()
    await loadRadar()
  } catch {
    toast(t('删除失败'), 'error')
  }
}

function questionTypeLabel(type: string) {
  return {
    open: t('开放题'),
    choice: t('选择题'),
    judgment: t('判断题'),
    short_answer: t('简答题'),
  }[type] || t('题目')
}

function questionTypeClass(type: string) {
  return {
    open: 'bg-gray-100 text-gray-600',
    choice: 'bg-blue-50 text-blue-600',
    judgment: 'bg-amber-50 text-amber-600',
    short_answer: 'bg-emerald-50 text-emerald-600',
  }[type] || 'bg-gray-100 text-gray-600'
}

function questionDifficultyLabel(difficulty: string) {
  return {
    easy: t('简单'),
    medium: t('中等'),
    hard: t('困难'),
  }[difficulty] || difficulty || t('未知')
}

function questionDifficultyClass(difficulty: string) {
  return {
    easy: 'bg-green-50 text-green-600',
    medium: 'bg-orange-50 text-orange-600',
    hard: 'bg-red-50 text-red-600',
  }[difficulty] || 'bg-gray-100 text-gray-600'
}

function selectQuestionRootCategory(cat: CategoryNode) {
  questionExpandedRootId.value = cat.id
  questionCategoryId.value = cat.id
  questionPage.value = 1
  loadQuestionBank()
}

function selectQuestionCategory(categoryId: number | null) {
  questionCategoryId.value = categoryId
  if (categoryId == null) {
    questionExpandedRootId.value = categoryTree.value[0]?.id ?? null
  } else {
    const root = findRootContainingId(categoryTree.value, categoryId)
    if (root) questionExpandedRootId.value = root.id
  }
  questionPage.value = 1
  loadQuestionBank()
}

function isQuestionDescendantSelected(root: CategoryNode) {
  if (questionCategoryId.value == null) return false
  if (root.id === questionCategoryId.value) return false
  if (!root.children?.length) return false
  return containsId(root.children, questionCategoryId.value)
}

function handleQuestionSearch() {
  questionPage.value = 1
  loadQuestionBank()
}

function resetQuestionFilters() {
  questionKeyword.value = ''
  questionCategoryId.value = null
  questionExpandedRootId.value = categoryTree.value[0]?.id ?? null
  questionPage.value = 1
  loadQuestionBank()
}

function changeQuestionPage(page: number) {
  questionPage.value = page
  loadQuestionBank()
}

onMounted(() => {
  loadCategories()
  loadQuestionBank()
  if (isLoggedIn.value) {
    fetchInterviews()
    loadRadar()
  }
})
</script>
