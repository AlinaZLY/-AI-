<template>
  <div class="page-shell max-w-5xl mx-auto space-y-6 pb-12">
    <!-- Hero header -->
    <div class="relative rounded-3xl overflow-hidden shadow-xl shadow-blue-500/10">
      <!-- 主体渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500"></div>
      <!-- 装饰性几何图形 -->
      <div class="absolute inset-0 opacity-[0.18] pointer-events-none">
        <div class="absolute -top-20 -right-12 w-72 h-72 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-24 left-10 w-80 h-80 rounded-full bg-cyan-200 blur-3xl"></div>
        <div class="absolute top-10 left-1/2 w-40 h-40 rounded-full bg-purple-300 blur-2xl"></div>
      </div>
      <!-- 网格点纹理 -->
      <div class="absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"></div>

      <div class="relative px-6 py-8 sm:px-10 sm:py-10">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- 左：标题 + 副标题 + 数据芯片 -->
          <div class="flex-1 min-w-0">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-[11px] font-medium text-white/90 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              {{ $t('AI 智能面试官') }}
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">{{ $t('AI 模拟面试') }}</h1>
            <p class="mt-2 text-sm sm:text-[15px] text-white/80 max-w-xl">{{ $t('练习·复盘·成长') }} · {{ $t('基于你的简历与岗位 JD，生成贴近真实场景的面试问题') }}</p>

            <!-- 数据芯片 -->
            <div class="mt-5 flex flex-wrap gap-2.5">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <svg class="w-4 h-4 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 014-4h6m-3-3l3 3-3 3" /></svg>
                <span class="text-xs text-white/70">{{ $t('总场次') }}</span>
                <span class="text-sm font-bold text-white tabular-nums">{{ overviewStats.total }}</span>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <svg class="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="text-xs text-white/70">{{ $t('已完成') }}</span>
                <span class="text-sm font-bold text-white tabular-nums">{{ overviewStats.completed }}</span>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <svg class="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="text-xs text-white/70">{{ $t('进行中') }}</span>
                <span class="text-sm font-bold text-white tabular-nums">{{ overviewStats.inProgress }}</span>
              </div>
              <div v-if="overviewStats.avgScore > 0" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <svg class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span class="text-xs text-white/70">{{ $t('平均分') }}</span>
                <span class="text-sm font-bold text-white tabular-nums">{{ overviewStats.avgScore }}</span>
              </div>
            </div>
          </div>

          <!-- 右：CTA 按钮组 -->
          <div class="shrink-0 flex items-center gap-3">
            <button @click="toggleWizard"
              class="group inline-flex items-center gap-2 rounded-xl px-5 sm:px-6 py-3 text-sm font-semibold transition-all duration-200"
              :class="showStartWizard
                ? 'bg-white/15 text-white hover:bg-white/25 backdrop-blur border border-white/30'
                : 'bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-blue-900/20 hover:scale-[1.02]'">
              <svg v-if="!showStartWizard" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              {{ showStartWizard ? $t('取消') : $t('开始新面试') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Wizard -->
    <section v-if="showStartWizard" class="rounded-2xl border border-blue-100 bg-white shadow-lg overflow-hidden">
      <div class="p-6">
        <!-- Step indicator -->
        <div class="flex items-center justify-center gap-0 mb-6">
          <template v-for="s in wizardSteps" :key="s.step">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all"
                :class="s.step < startWizardStep ? 'bg-emerald-500 text-white'
                  : startWizardStep === s.step ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : 'bg-gray-100 text-gray-400'">
                <svg v-if="s.step < startWizardStep" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                <template v-else>{{ s.step }}</template>
              </div>
              <span class="text-sm font-medium hidden sm:inline" :class="startWizardStep === s.step ? 'text-blue-700' : s.step < startWizardStep ? 'text-emerald-600' : 'text-gray-400'">{{ s.label }}</span>
            </div>
            <div v-if="s.step < wizardSteps[wizardSteps.length - 1].step" class="w-12 h-0.5 mx-2"
              :class="s.step < startWizardStep ? 'bg-emerald-400' : 'bg-gray-200'"></div>
          </template>
        </div>

        <!-- Step 1: Resume -->
        <div v-if="startWizardStep === 1 && isLoggedIn" class="min-h-[260px]">
          <div v-if="resumesLoading" class="py-16 flex justify-center"><div class="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div></div>
          <template v-else-if="!modalResumes.length">
            <div class="rounded-2xl border border-amber-100 bg-amber-50/80 p-6 text-center">
              <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p class="text-sm text-amber-900 mb-3">{{ $t('你还没有简历，请先创建一份简历再开始模拟面试。') }}</p>
              <router-link to="/my-resumes" class="inline-flex px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm">{{ $t('去创建简历') }}</router-link>
            </div>
          </template>
          <template v-else>
            <div class="grid gap-5 lg:grid-cols-[220px_1fr]">
              <!-- 左侧引导卡 -->
              <aside class="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 p-5">
                <div class="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 class="mt-3 text-sm font-semibold text-gray-900">{{ $t('选择关联简历') }}</h3>
                <p class="mt-1 text-[12px] leading-relaxed text-gray-500">{{ $t('AI 会基于这份简历的项目、技能和教育背景进行追问，结果更贴近真实面试。') }}</p>
                <ul class="mt-3 space-y-1.5 text-[11px] text-gray-500">
                  <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{{ $t('项目越完整，追问越深入') }}</li>
                  <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>{{ $t('结合岗位 JD 效果更佳') }}</li>
                  <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>{{ $t('可在“我的简历”中编辑') }}</li>
                </ul>
                <router-link to="/my-resumes" class="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-700">
                  {{ $t('管理我的简历') }}
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                </router-link>
              </aside>

              <!-- 右侧简历卡片列表 -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-900">{{ $t('你的简历') }} <span class="ml-1 text-xs font-normal text-gray-400">({{ modalResumes.length }})</span></h3>
                  <span v-if="selectedResumeMeta" class="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    {{ $t('已选择') }}
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  <button v-for="r in modalResumes" :key="'rs' + r.id" type="button" @click="selectedResumeId = r.id"
                    :class="['group text-left rounded-2xl border-2 p-4 transition-all relative',
                      selectedResumeId === r.id
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md shadow-blue-100'
                        : 'border-gray-100 hover:border-blue-200 hover:shadow-sm bg-white']">
                    <div class="flex items-start gap-3">
                      <div :class="['w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-sm',
                        selectedResumeId === r.id ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-gray-300 to-gray-400 group-hover:from-blue-400 group-hover:to-indigo-500']">
                        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5">
                          <p class="font-semibold text-sm text-gray-900 truncate">{{ r.title || $t('未命名简历') }}</p>
                          <span v-if="r.isDefault" class="shrink-0 rounded-md bg-amber-50 text-amber-600 text-[10px] px-1.5 py-0.5 font-medium border border-amber-100">{{ $t('默认') }}</span>
                        </div>
                        <p v-if="r.targetPosition" class="mt-0.5 text-xs text-gray-500 truncate">{{ r.targetPosition }}</p>
                        <p v-else class="mt-0.5 text-xs text-gray-300 italic">{{ $t('未填写目标岗位') }}</p>
                      </div>
                      <div v-if="selectedResumeId === r.id" class="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </div>
                    <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                      <span v-if="resumeMetaCount(r, 'projects')" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4m0 0l9-4m-9 4v10" /></svg>
                        {{ resumeMetaCount(r, 'projects') }} {{ $t('项目') }}
                      </span>
                      <span v-if="resumeMetaCount(r, 'skills')" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        {{ resumeMetaCount(r, 'skills') }} {{ $t('技能') }}
                      </span>
                      <span v-if="r.updatedAt" class="ml-auto text-gray-400">{{ formatTime(r.updatedAt) }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Step 2: Category -->
        <div v-else-if="startWizardStep === 2" class="min-h-[260px]">
          <div v-if="categoriesLoading" class="py-16 flex justify-center"><div class="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div></div>
          <template v-else>
            <div v-if="categoryTree.length" class="grid gap-5 lg:grid-cols-[220px_1fr]">
              <!-- 左侧引导卡 -->
              <aside class="rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100 p-5">
                <div class="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <h3 class="mt-3 text-sm font-semibold text-gray-900">{{ $t('选择面试方向') }}</h3>
                <p class="mt-1 text-[12px] leading-relaxed text-gray-500">{{ $t('方向决定 AI 出题的侧重，二级分类越精确，问题越聚焦。') }}</p>
                <div v-if="selectedCategoryName" class="mt-3 rounded-xl bg-white/80 border border-emerald-100 px-3 py-2">
                  <p class="text-[11px] text-gray-400">{{ $t('当前选择') }}</p>
                  <p class="mt-0.5 text-[13px] font-semibold text-emerald-700 truncate">{{ selectedCategoryName }}</p>
                </div>
                <ul class="mt-3 space-y-1.5 text-[11px] text-gray-500">
                  <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{{ $t('技术面试侧重原理与编码') }}</li>
                  <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>{{ $t('行为面试关注沟通与协作') }}</li>
                  <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{{ $t('企业专题模拟特定公司风格') }}</li>
                </ul>
              </aside>

              <!-- 右侧分类网格 -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-900">{{ $t('一级分类') }} <span class="ml-1 text-xs font-normal text-gray-400">({{ categoryTree.length }})</span></h3>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button v-for="(cat, idx) in categoryTree" :key="'m' + cat.id" type="button" @click="selectRootCategory(cat)"
                    :class="['group flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all relative overflow-hidden',
                      selectedCategoryId === cat.id || isDescendantSelected(cat)
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-100'
                        : 'border-gray-100 hover:border-emerald-200 hover:shadow-sm bg-white']">
                    <span :class="['h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', categoryColor(idx)]">
                      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" :d="categoryIcon(idx)" /></svg>
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ $t(cat.name) }}</p>
                      <p class="text-[11px] text-gray-400 mt-0.5">{{ (cat.children?.length || 0) }} {{ $t('个子方向') }}</p>
                    </div>
                    <div v-if="selectedCategoryId === cat.id || isDescendantSelected(cat)" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </button>
                </div>

                <div v-if="childPillsForSelection.length">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="text-[12px] font-semibold text-gray-700">{{ $t('二级方向') }}</h4>
                    <span class="text-[11px] text-gray-400">{{ $t('可选，按子方向出题更聚焦') }}</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button v-for="ch in childPillsForSelection" :key="'mc' + ch.id" type="button" @click="selectedCategoryId = ch.id"
                      :class="['rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all',
                        selectedCategoryId === ch.id
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50']">{{ $t(ch.name) }}</button>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 py-4">{{ $t('暂无面试分类，可直接进入下一步填写岗位信息。') }}</p>
          </template>
        </div>

        <!-- Step 3: Job & count -->
        <div v-else-if="startWizardStep === 3" class="min-h-[260px]">
          <div class="grid gap-5 lg:grid-cols-[220px_1fr]">
            <!-- 左侧引导卡 -->
            <aside class="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-100 p-5">
              <div class="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 class="mt-3 text-sm font-semibold text-gray-900">{{ $t('设置面试参数') }}</h3>
              <p class="mt-1 text-[12px] leading-relaxed text-gray-500">{{ $t('告诉 AI 目标岗位和题目规模，越具体效果越好。') }}</p>
              <div class="mt-3 rounded-xl bg-white/80 border border-amber-100 px-3 py-2 space-y-1.5 text-[11px]">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">{{ $t('简历') }}</span>
                  <span class="font-medium text-gray-700 truncate ml-2">{{ selectedResumeMeta?.title || '—' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">{{ $t('方向') }}</span>
                  <span class="font-medium text-gray-700 truncate ml-2">{{ selectedCategoryName || '—' }}</span>
                </div>
              </div>
              <ul class="mt-3 space-y-1.5 text-[11px] text-gray-500">
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{{ $t('JD 让追问更贴近真实岗位') }}</li>
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{{ $t('每题预计 3 分钟') }}</li>
              </ul>
            </aside>

            <!-- 右侧表单 -->
            <div class="flex flex-col gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  {{ $t('目标岗位') }}
                  <span class="ml-1 text-[11px] text-rose-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <input v-model="startForm.jobTitle" :placeholder="$t('如：前端开发工程师')" class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  {{ $t('岗位 JD') }}
                  <span class="ml-1 text-[11px] font-normal text-gray-400">{{ $t('可选 · 粘贴 JD 后 AI 会按岗位定制提问') }}</span>
                </label>
                <div class="relative">
                  <textarea v-model="startForm.jobDescription" rows="5" maxlength="4000"
                    :placeholder="$t('粘贴目标岗位的职责与要求，例如：\n1. 负责 Web 前端架构设计与开发；\n2. 熟悉 Vue / React，了解性能优化；\n3. 良好的沟通与跨团队协作能力。')"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition resize-y"></textarea>
                  <p class="absolute right-3 bottom-3 text-[11px]" :class="startForm.jobDescription.length > 3500 ? 'text-rose-500' : 'text-gray-300'">{{ startForm.jobDescription.length }} / 4000</p>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700">{{ $t('题目数量') }}</label>
                  <span class="text-[11px] text-gray-400">{{ $t('预计耗时') }} <span class="font-semibold text-orange-600">≈ {{ startForm.questionCount * 3 }} {{ $t('分钟') }}</span></span>
                </div>
                <div class="grid grid-cols-4 gap-3">
                  <button v-for="opt in questionCountOptions" :key="opt.value" type="button" @click="startForm.questionCount = opt.value"
                    :class="['relative rounded-2xl border-2 py-3 text-center transition-all',
                      startForm.questionCount === opt.value
                        ? 'border-orange-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md shadow-orange-100'
                        : 'border-gray-100 hover:border-orange-200 bg-white']">
                    <div class="text-2xl font-bold" :class="startForm.questionCount === opt.value ? 'text-orange-600' : 'text-gray-700'">{{ opt.value }}</div>
                    <div class="text-[11px] text-gray-500">{{ opt.label }}</div>
                    <div class="text-[10px] mt-0.5" :class="startForm.questionCount === opt.value ? 'text-orange-400' : 'text-gray-300'">≈{{ opt.minutes }}{{ $t('分钟') }}</div>
                    <div v-if="startForm.questionCount === opt.value" class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                      <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <button v-if="startWizardStep > startWizardFirstStep" type="button" @click="wizardBack" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">{{ $t('上一步') }}</button>
          <span v-else></span>
          <div class="flex gap-2">
            <button type="button" @click="showStartWizard = false" class="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition">{{ $t('取消') }}</button>
            <button v-if="startWizardStep < 3" type="button" @click="wizardNext" :disabled="!canWizardNext" class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-sm transition">{{ $t('下一步') }}</button>
            <button v-if="startWizardStep === 3" type="button" @click="startInterview" :disabled="starting || categoriesLoading"
              class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-sm transition">
              {{ starting ? $t('生成中...') : $t('开始面试') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats cards 已合并到 Hero 数据芯片中 -->
    <template v-if="isLoggedIn">
      <!-- Interview records -->
      <section class="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-900">{{ $t('面试记录') }}</h2>
          <span class="text-xs text-gray-400">{{ interviews.length }} {{ $t('条记录') }}</span>
        </div>
        <div v-if="loading" class="flex justify-center py-16"><div class="h-7 w-7 animate-spin rounded-full border-3 border-blue-500 border-t-transparent"></div></div>
        <div v-else-if="interviews.length">
          <div
            v-for="iv in interviews" :key="iv.id"
            class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
            @click="openInterview(iv)"
          >
            <div class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              :class="iv.status === 'completed' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' : 'bg-gradient-to-br from-blue-400 to-blue-500'">
              {{ iv.totalScore || '--' }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-gray-900 truncate">{{ iv.jobTitle || $t('模拟面试') }}</p>
                <span class="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                  :class="iv.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                  {{ iv.status === 'completed' ? $t('已完成') : $t('进行中') }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span>{{ iv.answeredCount }}/{{ iv.questionCount }} {{ $t('题') }}</span>
                <span>{{ formatTime(iv.createdAt) }}</span>
              </div>
            </div>
            <button type="button" class="shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition" @click.stop="handleDeleteInterview(iv.id)">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
        <div v-else class="py-14 text-center">
          <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <p class="text-sm text-gray-400">{{ $t('暂无面试记录') }}</p>
          <p class="text-xs text-gray-300 mt-1">{{ $t('点击右上角开始你的第一场模拟面试') }}</p>
        </div>
      </section>

      <!-- Calendar events -->
      <section v-if="calendarEvents.length" class="rounded-2xl border border-amber-100 bg-amber-50/30 p-5">
        <div class="mb-3 flex items-center gap-2">
          <svg class="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <h2 class="text-sm font-semibold text-amber-900">{{ $t('面试日历 & 提醒') }}</h2>
        </div>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="evt in calendarEvents" :key="evt.id"
            class="flex items-center gap-3 rounded-xl border bg-white px-3.5 py-2.5"
            :class="isUrgent(evt.nextDate) ? 'border-red-200' : 'border-amber-100'">
            <div class="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg text-white text-sm leading-tight"
              :class="isUrgent(evt.nextDate) ? 'bg-red-500' : 'bg-amber-500'">
              <span class="font-bold">{{ new Date(evt.nextDate).getDate() }}</span>
              <span class="text-[9px]">{{ (new Date(evt.nextDate).getMonth() + 1) + $t('月') }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">{{ evt.company }} · {{ evt.position }}</p>
              <div class="flex items-center gap-2 text-[11px] mt-0.5">
                <span class="text-amber-600 font-medium">{{ calendarStatusLabel(evt.status) }}</span>
                <span class="text-gray-400">{{ calendarRelative(evt.nextDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Radar (only shown when there is data) -->
      <section v-if="canShowRadarChart && radarSpec" class="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-5 text-white">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold">{{ $t('能力雷达') }}</h2>
          <span class="text-[11px] text-slate-400">{{ $t('{count} 场已完成', { count: completedInterviewCount }) }}</span>
        </div>
        <div class="flex flex-col items-center">
          <p v-if="radarInterviewHint" class="mb-3 text-center text-[11px] text-slate-400">{{ radarInterviewHint }}</p>
          <svg :viewBox="radarViewBox" class="h-auto w-full max-w-[16rem]" role="img" :aria-label="$t('能力雷达图')">
            <g v-for="(gridPts, gi) in radarSpec.grids" :key="'g' + gi"><polygon :points="gridPts" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" /></g>
            <g v-for="(axis, ai) in radarSpec.axes" :key="'a' + ai"><line :x1="axis.x1" :y1="axis.y1" :x2="axis.x2" :y2="axis.y2" stroke="rgba(255,255,255,0.14)" stroke-width="1" /></g>
            <polygon :points="radarSpec.dataPoly" fill="rgba(34,211,238,0.2)" stroke="rgb(34,211,238)" stroke-width="2" />
            <g v-for="(lb, li) in radarSpec.labels" :key="'l' + li">
              <text :x="lb.x" :y="lb.y" :text-anchor="lb.anchor" dominant-baseline="middle" fill="rgba(255,255,255,0.8)" style="font-size:10px">{{ lb.text }}</text>
              <text :x="lb.x" :y="lb.y + 13" :text-anchor="lb.anchor" dominant-baseline="middle" fill="rgb(125,211,252)" style="font-size:9px;font-weight:600">{{ lb.score }}</text>
            </g>
          </svg>
        </div>
      </section>
    </template>

    <section v-else class="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-base font-semibold text-blue-900">{{ $t('登录后可查看面试记录与能力雷达') }}</h2>
          <p class="mt-0.5 text-sm text-blue-700/70">{{ $t('未登录时依然可以先浏览题库，熟悉方向后再开始模拟面试。') }}</p>
        </div>
        <div class="flex gap-2">
          <router-link to="/login" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">{{ $t('立即登录') }}</router-link>
          <router-link to="/register" class="rounded-lg border border-blue-200 px-4 py-2 text-sm text-blue-700 hover:bg-white/60">{{ $t('注册账号') }}</router-link>
        </div>
      </div>
    </section>

    <!-- Quick link to question bank -->
    <section class="rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900">{{ $t('面试题库') }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ $t('浏览、搜索、投稿面试真题，备战校招面试') }}</p>
          </div>
        </div>
        <router-link to="/question-bank" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition">
          {{ $t('进入题库') }}
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </router-link>
      </div>
    </section>

    <!-- Interview detail modal -->
    <div v-if="currentInterview" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="currentInterview = null">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5 shadow-xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-bold text-gray-900">{{ currentInterview.jobTitle || $t('模拟面试') }}</h2>
          <button @click="currentInterview = null" class="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
        </div>
        <div v-if="currentInterview.totalScore" class="mb-4 p-3.5 bg-blue-50 rounded-xl">
          <div class="text-xl font-bold text-blue-600">{{ currentInterview.totalScore }} {{ $t('分') }}</div>
          <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">{{ currentInterview.overallFeedback }}</p>
        </div>
        <div v-for="(q, qi) in (currentInterview.questions || [])" :key="q.id" class="mb-3 p-3.5 border border-gray-100 rounded-xl">
          <h4 class="font-medium text-sm text-gray-900 mb-2">{{ $t('第 {n} 题：').replace('{n}', String(Number(qi) + 1)) }}{{ q.question }}</h4>
          <div v-if="q.isAnswered" class="space-y-1.5">
            <div class="text-sm text-gray-600"><span class="font-medium">{{ $t('你的回答：') }}</span>{{ q.answer }}</div>
            <div class="text-sm text-green-600"><span class="font-medium">{{ $t('得分：') }}</span>{{ q.score }}/100</div>
            <div v-if="q.feedback" class="text-xs text-gray-500 whitespace-pre-line">{{ q.feedback }}</div>
          </div>
          <div v-else class="mt-2">
            <textarea v-model="answerTexts[q.id]" rows="2" :placeholder="$t('请输入你的回答...')" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"></textarea>
            <div class="mt-2 flex items-center gap-2">
              <button @click="submitAnswer(currentInterview.id, q.id)" :disabled="!answerTexts[q.id]?.trim()" class="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ $t('提交回答') }}</button>
            </div>
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
import { confirmDialog } from '@/utils/confirm'
import { getCategoriesApi, getRadarDataApi, startInterviewApi, deleteInterviewApi } from '@/api/interview'
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
const { t, formatDateTime } = useI18n()

const startWizardStep = ref(1)
const startWizardFirstStep = computed(() => (isLoggedIn.value ? 1 : 2))
const wizardSteps = computed(() => {
  if (isLoggedIn.value) {
    return [
      { step: 1, label: t('选择简历') },
      { step: 2, label: t('面试方向') },
      { step: 3, label: t('岗位与题量') },
    ]
  }
  return [
    { step: 2, label: t('面试方向') },
    { step: 3, label: t('岗位与题量') },
  ]
})

function goToStep(step: number) {
  if (step <= startWizardStep.value) startWizardStep.value = step
}

const modalResumes = ref<any[]>([])
const resumesLoading = ref(false)
const selectedResumeId = ref<number | null>(null)

const interviews = ref<any[]>([])
const calendarEvents = ref<any[]>([])
const loading = ref(false)
const showStartWizard = ref(false)
const starting = ref(false)
const currentInterview = ref<any>(null)
const answerTexts = reactive<Record<number, string>>({})
const speechEnabled = ref(false)
const voiceRecording = reactive<Record<number, boolean>>({})
const voiceProcessing = reactive<Record<number, boolean>>({})
const mediaRecorders = reactive<Record<number, MediaRecorder | null>>({})
const audioChunks = reactive<Record<number, Blob[]>>({})
const startForm = reactive({ jobTitle: '', jobDescription: '', questionCount: 5 })
const questionCountOptions = computed(() => [
  { value: 1, label: t('试一试'), minutes: 3 },
  { value: 3, label: t('快速练习'), minutes: 9 },
  { value: 5, label: t('标准模式'), minutes: 15 },
  { value: 10, label: t('深度训练'), minutes: 30 },
])

const categoryTree = ref<CategoryNode[]>([])
const categoriesLoading = ref(false)
const selectedCategoryId = ref<number | null>(null)
const expandedRootId = ref<number | null>(null)
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
const overviewStats = reactive({ total: 0, completed: 0, inProgress: 0, abandoned: 0, avgScore: 0 })
const completedInterviewCount = computed(() => overviewStats.completed)

function formatTime(d: string) {
  return formatDateTime(d, { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/** 取简历内容的某字段长度，用于卡片信息展示。 */
function resumeMetaCount(resume: any, field: string): number {
  const val = resume?.content?.[field]
  return Array.isArray(val) ? val.length : 0
}

const selectedResumeMeta = computed(() => modalResumes.value.find((r) => r.id === selectedResumeId.value) || null)

/** 在分类树中递归查找指定 id 的节点。 */
function findCategoryNode(nodes: CategoryNode[], id: number | null): CategoryNode | null {
  if (id == null) return null
  for (const n of nodes) {
    if (n.id === id) return n
    const inChild = n.children?.length ? findCategoryNode(n.children, id) : null
    if (inChild) return inChild
  }
  return null
}

const selectedCategoryName = computed(() => {
  const node = findCategoryNode(categoryTree.value, selectedCategoryId.value)
  if (!node) return ''
  // 如果是子节点，附带父级路径
  for (const root of categoryTree.value) {
    if (root.id === node.id) return t(node.name)
    if (root.children?.some((c) => c.id === node.id)) return `${t(root.name)} / ${t(node.name)}`
  }
  return t(node.name)
})

function categoryCover(c: CategoryNode) {
  const u = c.cover || c.coverImage
  if (!u) return ''
  if (u.startsWith('http')) return u
  return u.startsWith('/') ? u : `/${u}`
}

const CATEGORY_ICONS = [
  'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  'M13 10V3L4 14h7v7l9-11h-7z',
  'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
]
const CATEGORY_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-purple-500 to-violet-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-yellow-400 to-amber-500',
  'from-sky-400 to-cyan-600',
]

function categoryIcon(index: number) {
  return CATEGORY_ICONS[index % CATEGORY_ICONS.length]
}
function categoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
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
    const all = Array.isArray(res.data) ? res.data : (res.data?.list ?? [])
    modalResumes.value = all.filter((r: any) => !r.isDraft)
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

function toggleWizard() {
  if (showStartWizard.value) {
    showStartWizard.value = false
    return
  }
  if (!isLoggedIn.value) {
    toast(t('请先登录后使用此功能'), 'warning')
    router.push({ path: '/login', query: { redirect: '/interview' } })
    return
  }
  startWizardStep.value = isLoggedIn.value ? 1 : 2
  showStartWizard.value = true
  if (isLoggedIn.value) loadResumesForModal()
  if (!categoryTree.value.length && !categoriesLoading.value) loadCategories()
  const root = findRootContainingId(categoryTree.value, selectedCategoryId.value)
  if (root) expandedRootId.value = root.id
}

function wizardBack() {
  const first = startWizardFirstStep.value
  if (startWizardStep.value > first) startWizardStep.value -= 1
}

function wizardNext() {
  if (!canWizardNext.value) return
  if (startWizardStep.value < 3) startWizardStep.value += 1
}

watch(showStartWizard, (open) => {
  if (!open) {
    startWizardStep.value = 1
    selectedResumeId.value = null
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
    if (startForm.jobDescription.trim()) body.jobDescription = startForm.jobDescription.trim()
    if (selectedCategoryId.value != null) body.categoryId = selectedCategoryId.value
    if (isLoggedIn.value && selectedResumeId.value != null) body.resumeId = selectedResumeId.value
    const res: any = await startInterviewApi(body)
    const detail = res.data || res
    showStartWizard.value = false
    startForm.jobTitle = ''
    startForm.jobDescription = ''
    startForm.questionCount = 5
    fetchInterviews()
    fetchOverview()
    router.push(`/interview/${detail.id}`)
  } catch {
    /* toast via interceptor */
  } finally {
    starting.value = false
  }
}

function openInterview(iv: any) {
  router.push(`/interview/${iv.id}`)
}

async function submitAnswer(interviewId: number, questionId: number, answerType: 'text' | 'voice' = 'text') {
  const answer = answerTexts[questionId]?.trim()
  if (!answer) return
  try {
    await request.post(`/interview/${interviewId}/questions/${questionId}/answer`, { answer, answerType })
    toast(t('回答已提交'), 'success')
    await openInterview({ id: interviewId })
    await fetchInterviews()
    await loadRadar()
  } catch {
    /* */
  }
}

async function blobToWav(blob: Blob): Promise<Blob> {
  const ctx = new AudioContext({ sampleRate: 16000 })
  const buf = await blob.arrayBuffer()
  const audio = await ctx.decodeAudioData(buf)
  const ch = audio.getChannelData(0)
  const wavBuf = new ArrayBuffer(44 + ch.length * 2)
  const view = new DataView(wavBuf)
  const sr = audio.sampleRate
  const writeStr = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)) }
  writeStr(0, 'RIFF'); view.setUint32(4, 36 + ch.length * 2, true); writeStr(8, 'WAVE')
  writeStr(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, sr, true); view.setUint32(28, sr * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true)
  writeStr(36, 'data'); view.setUint32(40, ch.length * 2, true)
  for (let i = 0; i < ch.length; i++) { const s = Math.max(-1, Math.min(1, ch[i])); view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true) }
  ctx.close()
  return new Blob([wavBuf], { type: 'audio/wav' })
}

async function startRecording(questionId: number) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    audioChunks[questionId] = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks[questionId].push(e.data)
    }
    recorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop())
      await processVoice(questionId)
    }
    recorder.start()
    mediaRecorders[questionId] = recorder
    voiceRecording[questionId] = true
  } catch {
    toast(t('无法访问麦克风，请检查权限设置'), 'error')
  }
}

function stopRecording(questionId: number) {
  const recorder = mediaRecorders[questionId]
  if (recorder && recorder.state !== 'inactive') {
    recorder.stop()
  }
  voiceRecording[questionId] = false
}

async function processVoice(questionId: number) {
  voiceProcessing[questionId] = true
  try {
    const chunks = audioChunks[questionId] || []
    if (!chunks.length) { toast(t('录音为空'), 'warning'); return }
    const rawBlob = new Blob(chunks, { type: 'audio/webm' })
    let blob: Blob
    try { blob = await blobToWav(rawBlob) } catch { blob = rawBlob }
    const isWav = blob.type === 'audio/wav'
    const formData = new FormData()
    formData.append('file', blob, isWav ? `answer_${questionId}.wav` : `answer_${questionId}.webm`)
    const uploadRes: any = await request.post('/system/speech/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const audioPath = uploadRes.data?.path || uploadRes.path || uploadRes.data?.url || uploadRes.url
    if (!audioPath) { toast(t('音频上传失败'), 'error'); return }

    const recognizeRes: any = await request.post('/system/speech/recognize', {
      audioUrl: audioPath,
      format: 'wav',
    })
    const text = recognizeRes.data?.text || recognizeRes.text || ''
    if (text) {
      answerTexts[questionId] = (answerTexts[questionId] || '') + text
      toast(t('语音识别成功'), 'success')
    } else {
      toast(t('语音识别未返回文本，请重试或切换文字输入'), 'warning')
    }
  } catch {
    toast(t('语音识别失败，请重试或切换文字输入'), 'error')
  } finally {
    voiceProcessing[questionId] = false
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

async function fetchOverview() {
  try {
    const res: any = await request.get('/interview/overview')
    const d = res.data || res
    overviewStats.total = Number(d?.total) || 0
    overviewStats.completed = Number(d?.completed) || 0
    overviewStats.inProgress = Number(d?.inProgress) || 0
    overviewStats.abandoned = Number(d?.abandoned) || 0
    overviewStats.avgScore = Number(d?.avgScore) || 0
  } catch {
    /* keep last values */
  }
}

async function handleDeleteInterview(id: number) {
  if (!await confirmDialog(t('确定要删除这条面试记录吗？'), { title: t('删除面试记录'), kind: 'danger', confirmText: t('删除'), description: t('删除后面试问答、评分与反馈均将丢失。') })) return
  try {
    await deleteInterviewApi(id)
    toast(t('已删除'), 'success')
    if (currentInterview.value?.id === id) currentInterview.value = null
    await fetchInterviews()
    await fetchOverview()
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

async function fetchSpeechConfig() {
  try {
    const res: any = await request.get('/system/settings/public')
    const d = res.data ?? res
    const provider = d.voice_provider || 'disabled'
    speechEnabled.value = provider !== 'disabled'
  } catch { speechEnabled.value = false }
}

function isUrgent(d: string) {
  const diff = (new Date(d).getTime() - Date.now()) / 86400000
  return diff <= 1 && diff >= -0.5
}
function calendarRelative(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  if (diff <= 0) return t('今天')
  if (diff === 1) return t('明天')
  return `${diff}${t('天后')}`
}
const CALENDAR_STATUS_MAP: Record<string, string> = {
  pending: '待筛选', written_test: '笔试', first_interview: '一面',
  second_interview: '二面', hr_interview: 'HR面', offer: 'Offer', rejected: '拒信',
}
function calendarStatusLabel(s: string) { return t(CALENDAR_STATUS_MAP[s] || s) }

async function fetchCalendarEvents() {
  try {
    const res: any = await request.get('/applications/dashboard')
    calendarEvents.value = (res.data?.upcoming || res.upcoming || []).slice(0, 6)
  } catch { calendarEvents.value = [] }
}

onMounted(() => {
  loadCategories()
  fetchSpeechConfig()
  if (isLoggedIn.value) {
    fetchInterviews()
    fetchOverview()
    loadRadar()
    fetchCalendarEvents()
  }
})
</script>
