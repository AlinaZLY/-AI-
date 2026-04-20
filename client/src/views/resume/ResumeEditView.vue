<template>
  <div class="min-h-screen h-screen flex flex-col bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8">
    <div class="shrink-0 border-b border-gray-200 bg-white/90 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-3">
      <div class="page-shell flex items-center justify-end gap-2">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-3 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            :disabled="previewing || aiWorking"
            @click="onPreview"
          >
            {{ previewing ? $t('预览中…') : $t('预览') }}
          </button>
          <button
            type="button"
            class="px-3 py-2 text-sm font-medium rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            :disabled="exporting || aiWorking"
            @click="onExportPdf"
          >
            {{ exporting ? $t('导出中…') : $t('导出 PDF') }}
          </button>
          <button
            type="button"
            class="px-3 py-2 text-sm font-medium rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
            :disabled="analyzing || aiWorking"
            @click="onAnalyze"
          >
            {{ analyzing ? $t('分析中…') : $t('AI 分析') }}
          </button>
          <button
            v-if="hasResumeContent"
            type="button"
            class="px-3 py-2 text-sm font-medium rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            :disabled="aiWorking"
            @click="onPolish"
          >
            {{ polishing ? $t('润色中…') : $t('AI 润色') }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
            :disabled="saving || aiWorking"
            @click="onSave"
          >
            {{ saving ? $t('保存中…') : $t('保存') }}
          </button>
        </div>
      </div>
    </div>

    <div class="w-full flex flex-1 min-h-0 min-w-0 overflow-hidden" style="max-width: 100rem; margin-inline: auto;">
      <div class="w-[42%] min-w-0 overflow-y-auto max-h-full border-r border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
      <!-- AI 一键生成（可折叠） -->
      <div
        v-if="!loading && !loadError"
        class="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 shadow-sm overflow-hidden"
      >
        <button
          type="button"
          class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-blue-50/50 transition-colors"
          @click="aiGenerateOpen = !aiGenerateOpen"
        >
          <span class="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold">AI</span>
            {{ $t('智能生成与润色') }}
          </span>
          <svg
            class="w-5 h-5 text-gray-500 shrink-0 transition-transform"
            :class="aiGenerateOpen ? 'rotate-180' : ''"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="aiGenerateOpen" class="px-4 pb-4 pt-0 border-t border-blue-100/80">
          <p class="text-xs text-gray-500 mt-3 mb-4">
            {{ $t('填写关键信息并一键调用 AI 生成建议（将随请求提交至服务端；实际效果取决于 ARK_API_KEY 配置）。') }}
          </p>
          <div class="flex items-start gap-4 mb-4">
            <div class="shrink-0">
              <p class="text-xs text-gray-500 mb-1">{{ $t('头像') }}</p>
              <label class="block cursor-pointer group relative" style="width:72px;height:90px">
                <img
                  v-if="content.basicInfo.avatar"
                  :src="content.basicInfo.avatar"
                  class="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                />
                <div
                  v-else
                  class="w-full h-full rounded-lg border-2 border-dashed border-gray-300 group-hover:border-blue-400 flex flex-col items-center justify-center text-gray-400 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>
                  <span class="text-[10px] mt-1">{{ $t('上传') }}</span>
                </div>
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
              </label>
            </div>
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="block text-xs text-gray-500">
              {{ $t('姓名') }}
              <input
                v-model="content.basicInfo.name"
                type="text"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('手机') }}
              <input
                v-model="content.basicInfo.phone"
                type="tel"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                :placeholder="$t('请输入手机号')"
              />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('邮箱') }}
              <input
                v-model="content.basicInfo.email"
                type="email"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                :placeholder="$t('请输入邮箱')"
              />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('学校') }}
              <input
                v-model="content.basicInfo.school"
                type="text"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('专业') }}
              <input
                v-model="content.basicInfo.major"
                type="text"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('毕业年份') }}
              <input
                v-model="content.basicInfo.graduationYear"
                type="text"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                :placeholder="$t('如 2026')"
              />
            </label>
            <label class="block text-xs text-gray-500 sm:col-span-2">
              {{ $t('技能（逗号分隔）') }}
              <input
                v-model="aiSkillsComma"
                type="text"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                placeholder="Vue, TypeScript, Node.js"
              />
            </label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
              :disabled="generatingAi || polishing || saving"
              @click="onAiGenerate"
            >
              <span
                v-if="generatingAi"
                class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
              {{ generatingAi ? $t('生成中…') : $t('AI 一键生成') }}
            </button>
          </div>
          <div
            v-if="optimizeFeedback.visible"
            class="mt-4 rounded-xl border border-blue-200 bg-white/90 p-4 text-sm shadow-inner"
          >
            <div class="flex justify-between items-start gap-2 mb-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                <p class="font-semibold text-blue-900">{{ $t('AI 分析结果') }}</p>
              </div>
              <button type="button" class="text-xs text-gray-400 hover:text-gray-600" @click="optimizeFeedback.visible = false">&times;</button>
            </div>
            <p v-if="optimizeFeedback.message" class="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-3">{{ optimizeFeedback.message }}</p>
            <div v-if="optimizeFeedback.suggestions.length">
              <p class="text-xs font-medium text-gray-500 mb-2">{{ $t('优化建议') }}</p>
              <div class="space-y-2">
                <div v-for="(s, i) in optimizeFeedback.suggestions" :key="i" class="flex gap-2 items-start text-sm text-gray-700">
                  <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{{ i + 1 }}</span>
                  <span>{{ s }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 简历撰写小贴士 -->
      <div
        v-if="!loading && !loadError"
        class="mb-6 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
      >
        <p class="text-xs font-semibold text-gray-900 mb-2">{{ $t('撰写小贴士') }}</p>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-600 list-disc pl-4">
          <li>{{ $t('量化成果：用数字体现增长、规模或效率（如「QPS 提升 30%」）。') }}</li>
          <li>{{ $t('突出技术关键词：对齐目标岗位 JD 中的技能栈表述。') }}</li>
          <li>{{ $t('STAR 简述项目：情境、任务、行动、结果各一句话即可。') }}</li>
          <li>{{ $t('保持真实可核验：实习/项目时间与职责尽量具体。') }}</li>
        </ul>
      </div>

      <div v-if="loadError" class="rounded-xl border border-red-100 bg-red-50 text-red-800 px-4 py-3 text-sm mb-6">
        {{ loadError }}
      </div>

      <div v-if="loading" class="flex justify-center py-24">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>

      <div v-else class="space-y-6">
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{{ $t('简历标题') }}</label>
          <input
            v-model="title"
            type="text"
            class="w-full text-xl font-bold text-gray-900 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            :placeholder="$t('例如：校招-前端开发')"
          />
        </section>

        <section id="resume-basic-section" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 scroll-mt-24">
          <h2 class="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{{ $t('基本信息') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="block text-xs text-gray-500">
              {{ $t('姓名') }}
              <input v-model="content.basicInfo.name" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('手机') }}
              <input v-model="content.basicInfo.phone" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('邮箱') }}
              <input v-model="content.basicInfo.email" type="email" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('学校') }}
              <input v-model="content.basicInfo.school" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('专业') }}
              <input v-model="content.basicInfo.major" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('毕业年份') }}
              <input v-model="content.basicInfo.graduationYear" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </label>
          </div>
        </section>

        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{{ $t('求职意向') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="block text-xs text-gray-500">
              {{ $t('目标岗位') }}
              <input v-model="content.jobIntention.targetPosition" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" :placeholder="$t('如：前端开发工程师')" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('期望薪资') }}
              <input v-model="content.jobIntention.expectedSalary" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" :placeholder="$t('如：8-12K')" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('意向城市') }}
              <input v-model="content.jobIntention.preferredCity" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" :placeholder="$t('如：北京、上海')" />
            </label>
            <label class="block text-xs text-gray-500">
              {{ $t('工作类型') }}
              <select v-model="content.jobIntention.workType" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">{{ $t('请选择') }}</option>
                <option value="full_time">{{ $t('全职') }}</option>
                <option value="intern">{{ $t('实习') }}</option>
                <option value="part_time">{{ $t('兼职') }}</option>
              </select>
            </label>
          </div>
        </section>

        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{{ $t('自我介绍') }}</h2>
          <textarea
            v-model="content.selfIntro"
            rows="5"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[120px]"
            :placeholder="$t('简要介绍你的优势与求职意向')"
          />
        </section>

        <section v-for="section in arraySections" :key="section.key" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 class="text-sm font-semibold text-gray-900">{{ section.label }}</h2>
            <button type="button" class="text-xs font-medium text-blue-600 hover:text-blue-700" @click="addArrayRow(section.key)">
              {{ $t('+ 添加') }}
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="(row, idx) in contentRows(section.key)"
              :key="idx"
              class="border border-gray-100 rounded-xl p-4 bg-gray-50/80 space-y-2"
            >
              <div class="flex justify-end">
                <button type="button" class="text-xs text-red-500 hover:text-red-600 font-medium" @click="removeArrayRow(section.key, idx)">
                  {{ $t('删除') }}
                </button>
              </div>
              <template v-if="section.key === 'education'">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input v-model="row.school" :placeholder="$t('学校')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.major" :placeholder="$t('专业')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.startDate" :placeholder="$t('开始时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.endDate" :placeholder="$t('结束时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              </template>
              <template v-else-if="section.key === 'experience'">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input v-model="row.company" :placeholder="$t('公司')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.position" :placeholder="$t('职位')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.startDate" :placeholder="$t('开始时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.endDate" :placeholder="$t('结束时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <textarea v-model="row.description" :placeholder="$t('工作描述')" rows="3" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </template>
              <template v-else-if="section.key === 'projects'">
                <input v-model="row.name" :placeholder="$t('项目名称')" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input v-model="row.startDate" :placeholder="$t('开始时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.endDate" :placeholder="$t('结束时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <textarea v-model="row.description" :placeholder="$t('项目描述')" rows="3" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </template>
              <template v-else-if="section.key === 'awards'">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input v-model="row.name" :placeholder="$t('证书/奖项名称')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.date" :placeholder="$t('获得时间（如 2025.06）')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <input v-model="row.description" :placeholder="$t('补充说明（选填）')" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </template>
              <template v-else-if="section.key === 'activities'">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input v-model="row.organization" :placeholder="$t('组织/社团名称')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.role" :placeholder="$t('担任职务')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.startDate" :placeholder="$t('开始时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input v-model="row.endDate" :placeholder="$t('结束时间')" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <textarea v-model="row.description" :placeholder="$t('活动描述与收获')" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </template>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{{ $t('技能') }}</h2>
          <p class="text-xs text-gray-500 mb-3">{{ $t('输入后按 Enter 添加为标签') }}</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="(s, si) in content.skills"
              :key="si"
              class="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-blue-50 text-blue-800 text-sm border border-blue-100"
            >
              {{ s }}
              <button type="button" class="p-0.5 rounded-full hover:bg-blue-100 text-blue-600" :aria-label="$t('移除')" @click="content.skills.splice(si, 1)">
                ×
              </button>
            </span>
          </div>
          <input
            v-model="skillInput"
            type="text"
            class="w-full max-w-md border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            :placeholder="$t('例如：Vue 3、TypeScript')"
            @keydown.enter.prevent="addSkillTag"
          />
        </section>
      </div>
      </div>

      <div class="w-[58%] min-w-0 flex flex-col bg-gray-100/50 border-l border-gray-200">
        <div class="sticky top-0 z-10 flex flex-col gap-3 p-5 w-full h-[calc(100vh-5.5rem)] min-h-0 self-start">
          <div class="flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              <p class="text-sm font-semibold text-gray-800">{{ $t('实时预览') }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="templateLoading" class="text-xs text-gray-400">{{ $t('模板加载中…') }}</span>
              <span v-else-if="templateLoadError" class="text-xs text-amber-600 truncate max-w-[60%]">{{ templateLoadError }}</span>
              <select
                v-else-if="!resumeTemplateId"
                class="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                @change="(e) => { const v = Number((e.target as HTMLSelectElement).value); if (v) applyTemplate(v) }"
              >
                <option value="">{{ $t('选择模板') }}</option>
                <option v-for="tpl in availableTemplates" :key="tpl.id" :value="tpl.id">{{ tpl.name }}</option>
              </select>
              <span v-else class="text-xs text-emerald-600">{{ $t('已同步') }}</span>
            </div>
          </div>
          <div class="flex-1 min-h-0 rounded-2xl bg-white shadow-lg border border-gray-200/60 overflow-hidden relative">
            <iframe
              :srcdoc="previewHtml"
              class="w-full h-full border-none"
              :class="{ 'opacity-30 blur-[2px]': aiWorking }"
              sandbox=""
              :title="$t('简历实时预览')"
            />
            <div v-if="aiWorking" class="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-10">
              <div class="space-y-4 w-3/4 max-w-xs">
                <div class="flex justify-center">
                  <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p class="text-sm font-medium text-blue-700 text-center">{{ $t('AI 正在生成简历内容…') }}</p>
                <div class="space-y-3 animate-pulse">
                  <div class="h-5 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
                  <div class="h-3 bg-gray-100 rounded w-full"></div>
                  <div class="h-3 bg-gray-100 rounded w-5/6"></div>
                  <div class="h-3 bg-gray-100 rounded w-4/6"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-1/2 mt-4"></div>
                  <div class="h-3 bg-gray-100 rounded w-full"></div>
                  <div class="h-3 bg-gray-100 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded-lg w-1/2 mt-4"></div>
                  <div class="h-3 bg-gray-100 rounded w-full"></div>
                  <div class="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
          <p class="text-[11px] text-gray-400 text-center shrink-0">{{ $t('编辑左侧内容，预览实时更新') }}</p>
        </div>
      </div>
    </div>

    <!-- AI 分析结果 -->
    <div
      v-if="analysisDialog.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="analysisDialog.open = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl p-6" @click.stop>
        <div class="flex justify-between items-start mb-2">
          <div>
            <h2 class="text-lg font-bold text-gray-900">{{ $t('AI 简历分析') }}</h2>
            <p class="text-xs text-gray-500 mt-1">{{ $t('基于当前已保存内容的结构与关键词给出参考，保存最新修改后可再次分析。') }}</p>
          </div>
          <button type="button" class="text-gray-400 hover:text-gray-600 text-2xl leading-none" @click="analysisDialog.open = false">
            &times;
          </button>
        </div>
        <div v-if="analysisDialog.data" class="space-y-5 text-sm mt-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p class="text-gray-500 text-xs font-medium mb-1">{{ $t('信息完整度') }}</p>
              <p class="text-3xl font-bold text-blue-600 tabular-nums">{{ analysisDialog.data.completeness }}<span class="text-lg">%</span></p>
            </div>
            <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p class="text-gray-500 text-xs font-medium mb-1">{{ $t('综合评分') }}</p>
              <p class="text-3xl font-bold text-gray-900 tabular-nums">{{ analysisDialog.data.score }}</p>
            </div>
          </div>
          <div v-if="analysisDialog.data.keywords?.length" class="rounded-xl border border-gray-100 p-4">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{{ $t('简历关键词') }}</p>
            <p class="text-xs text-gray-500 mb-3">{{ $t('可在自我介绍与项目描述中自然覆盖以下方向，提升与岗位的匹配度。') }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(kw, i) in analysisDialog.data.keywords"
                :key="i"
                class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
              >
                {{ kw }}
              </span>
            </div>
          </div>
          <div v-if="analysisDialog.data.suggestions?.length" class="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
            <p class="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-2">{{ $t('改进建议') }}</p>
            <ul class="space-y-2 text-gray-800">
              <li v-for="(sug, i) in analysisDialog.data.suggestions" :key="i" class="flex gap-2">
                <span class="text-blue-600 font-bold shrink-0">{{ i + 1 }}.</span>
                <span>{{ sug }}</span>
              </li>
            </ul>
          </div>
          <div v-if="!analysisDialog.data.keywords?.length && !analysisDialog.data.suggestions?.length" class="text-center py-6 text-gray-500 text-sm">
            {{ $t('暂无细分建议，可先完善基本信息与经历后再试。') }}
          </div>
          <div class="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              class="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              @click="closeAnalysisAndEdit"
            >
              {{ $t('根据建议继续编辑') }}
            </button>
            <button
              type="button"
              class="flex-1 px-4 py-3 text-sm font-medium rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              @click="analysisDialog.open = false"
            >
              {{ $t('稍后再说') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getResumeDetailApi,
  getResumeTemplateApi,
  getTemplatesApi,
  updateResumeApi,
  analyzeResumeApi,
  optimizeResumeApi,
  renderResumeApi,
} from '@/api/resume'
import { toast } from '@/utils/toast'
import { useI18n } from '@/i18n'

interface BasicInfo {
  name: string
  phone: string
  email: string
  school: string
  major: string
  graduationYear: string
  avatar?: string
}

interface EduRow {
  school: string
  major: string
  startDate: string
  endDate: string
}

interface ExpRow {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface ProjRow {
  name: string
  startDate: string
  endDate: string
  description: string
}

interface AwardRow {
  name: string
  date: string
  description: string
}

interface ActivityRow {
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
}

interface JobIntention {
  targetPosition: string
  expectedSalary: string
  preferredCity: string
  workType: string
}

interface ResumeContent {
  basicInfo: BasicInfo
  jobIntention: JobIntention
  education: EduRow[]
  experience: ExpRow[]
  projects: ProjRow[]
  awards: AwardRow[]
  activities: ActivityRow[]
  skills: string[]
  selfIntro: string
}

const route = useRoute()
const router = useRouter()
const { t, locale: currentLocale } = useI18n()

const resumeId = computed(() => {
  const n = Number(route.params.id)
  return Number.isFinite(n) ? n : NaN
})

const loading = ref(true)
const loadError = ref('')
const saving = ref(false)
const previewing = ref(false)
const exporting = ref(false)
const analyzing = ref(false)
const polishing = ref(false)
const aiWorking = computed(() => generatingAi.value || polishing.value)
const hasResumeContent = computed(() => {
  const c = content
  return !!(c.basicInfo?.name || c.selfIntro || c.education?.length || c.experience?.length || c.projects?.length || c.skills?.length)
})
const generatingAi = ref(false)
const aiGenerateOpen = ref(true)
const aiSkillsComma = ref('')

function handleAvatarUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const img = new Image()
  img.onload = () => {
    const MAX_W = 300, MAX_H = 400
    let w = img.width, h = img.height
    if (w > MAX_W || h > MAX_H) {
      const ratio = Math.min(MAX_W / w, MAX_H / h)
      w = Math.round(w * ratio)
      h = Math.round(h * ratio)
    }
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)
    content.basicInfo.avatar = canvas.toDataURL('image/jpeg', 0.8)
    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(file)
}

const resumeTemplateId = ref<number | null>(null)
const loadedTemplate = ref<{ htmlContent: string; cssContent: string } | null>(null)
const templateLoading = ref(false)
const templateLoadError = ref('')
const availableTemplates = ref<{ id: number; name: string }[]>([])

async function loadAvailableTemplates() {
  try {
    const res: any = await getTemplatesApi({ page: 1, pageSize: 100 })
    const data = res.data ?? res
    availableTemplates.value = (data.list ?? []).filter((t: any) => t?.id != null).map((t: any) => ({ id: t.id, name: t.name || `Template ${t.id}` }))
  } catch { availableTemplates.value = [] }
}

async function applyTemplate(tid: number) {
  const id = resumeId.value
  if (!Number.isFinite(id)) return
  resumeTemplateId.value = tid
  try {
    await updateResumeApi(id, { templateId: tid })
    await loadTemplate(tid)
  } catch {
    toast(t('模板应用失败'), 'error')
  }
}

function buildAvatarDataUri(name?: string): string {
  const ch = (name || '').trim().charAt(0) || '?'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="125"><rect width="100" height="125" fill="#2563eb" rx="8"/><text x="50" y="72" font-size="40" fill="#fff" text-anchor="middle" font-family="sans-serif">${ch}</text></svg>`
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}

const title = ref('')
const skillInput = ref('')

const content = reactive<ResumeContent>({
  basicInfo: {
    name: '',
    phone: '',
    email: '',
    school: '',
    major: '',
    graduationYear: '',
  },
  jobIntention: {
    targetPosition: '',
    expectedSalary: '',
    preferredCity: '',
    workType: '',
  },
  education: [],
  experience: [],
  projects: [],
  awards: [],
  activities: [],
  skills: [],
  selfIntro: '',
})

const arraySections = [
  { key: 'education' as const, get label() { return t('教育经历') } },
  { key: 'experience' as const, get label() { return t('实习/工作经历') } },
  { key: 'projects' as const, get label() { return t('项目经验') } },
  { key: 'awards' as const, get label() { return t('证书/荣誉奖项') } },
  { key: 'activities' as const, get label() { return t('校园活动/社会实践') } },
]

const analysisDialog = reactive({
  open: false,
  data: null as null | {
    completeness: number
    score: number
    keywords: string[]
    suggestions: string[]
  },
})

const optimizeFeedback = reactive({
  visible: false,
  message: '',
  suggestions: [] as string[],
  rawJson: '',
})

function escapeHtmlStr(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function stripScriptsFromCss(css: string): string {
  return (css || '').replace(/<\/?script[^>]*>/gi, '')
}

/** 与后端 resume.service injectContentIntoTemplate 占位规则一致 */
function injectContentIntoTemplateFragment(html: string, c: ResumeContent): string {
  const basic = c.basicInfo
  const esc = escapeHtmlStr
  const skillsHtml = c.skills
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<span class="skill-tag">${esc(s)}</span>`)
    .join(' ')
  const educationHtml = c.education
    .map(
      (e) =>
        `<div class="item"><strong>${esc(e.school || '')}</strong> - ${esc(e.major || '')} <span class="time">${esc(e.startDate || '')} ~ ${esc(e.endDate || '')}</span></div>`,
    )
    .join('')
  const experienceHtml = c.experience
    .map(
      (e) =>
        `<div class="item"><strong>${esc(e.company || '')}</strong> - ${esc(e.position || '')} <span class="time">${esc(e.startDate || '')} ~ ${esc(e.endDate || '')}</span><p>${esc(e.description || '')}</p></div>`,
    )
    .join('')
  const projectsHtml = c.projects
    .map(
      (p) =>
        `<div class="item"><strong>${esc(p.name || '')}</strong> <span class="time">${esc(p.startDate || '')} ~ ${esc(p.endDate || '')}</span><p>${esc(p.description || '')}</p></div>`,
    )
    .join('')
  const awardsHtml = c.awards
    .map(
      (a) =>
        `<div class="item"><strong>${esc(a.name || '')}</strong> <span class="time">${esc(a.date || '')}</span>${a.description ? `<p>${esc(a.description)}</p>` : ''}</div>`,
    )
    .join('')
  const activitiesHtml = c.activities
    .map(
      (a) =>
        `<div class="item"><strong>${esc(a.organization || '')}</strong> - ${esc(a.role || '')} <span class="time">${esc(a.startDate || '')} ~ ${esc(a.endDate || '')}</span>${a.description ? `<p>${esc(a.description)}</p>` : ''}</div>`,
    )
    .join('')

  const job = c.jobIntention
  return html
    .replace(/\{\{avatar\}\}/g, basic.avatar || buildAvatarDataUri(basic.name))
    .replace(/\{\{name\}\}/g, esc(basic.name || t('姓名')))
    .replace(/\{\{phone\}\}/g, esc(basic.phone || ''))
    .replace(/\{\{email\}\}/g, esc(basic.email || ''))
    .replace(/\{\{school\}\}/g, esc(basic.school || ''))
    .replace(/\{\{major\}\}/g, esc(basic.major || ''))
    .replace(/\{\{graduationYear\}\}/g, esc(basic.graduationYear || ''))
    .replace(/\{\{targetPosition\}\}/g, esc(job.targetPosition || ''))
    .replace(/\{\{expectedSalary\}\}/g, esc(job.expectedSalary || ''))
    .replace(/\{\{preferredCity\}\}/g, esc(job.preferredCity || ''))
    .replace(/\{\{workType\}\}/g, esc(job.workType || ''))
    .replace(/\{\{selfIntro\}\}/g, esc(c.selfIntro || ''))
    .replace(/\{\{skills\}\}/g, skillsHtml)
    .replace(/\{\{education\}\}/g, educationHtml)
    .replace(/\{\{experience\}\}/g, experienceHtml)
    .replace(/\{\{projects\}\}/g, projectsHtml)
    .replace(/\{\{awards\}\}/g, awardsHtml)
    .replace(/\{\{activities\}\}/g, activitiesHtml)
    .replace(/<h2>About Me<\/h2>/g, `<h2>${t('自我介绍')}</h2>`)
    .replace(/<h2>Education<\/h2>/g, `<h2>${t('教育经历')}</h2>`)
    .replace(/<h2>Work Experience<\/h2>/g, `<h2>${t('实习/工作经历')}</h2>`)
    .replace(/<h2>Projects<\/h2>/g, `<h2>${t('项目经验')}</h2>`)
    .replace(/<h2>Awards & Certificates<\/h2>/g, `<h2>${t('证书/荣誉奖项')}</h2>`)
    .replace(/<h2>Activities<\/h2>/g, `<h2>${t('校园活动/社会实践')}</h2>`)
    .replace(/<h2>Skills<\/h2>/g, `<h2>${t('技能')}</h2>`)
    .replace(/<h3>Contact<\/h3>/g, `<h3>${t('联系方式')}</h3>`)
    .replace(/<h3>Education<\/h3>/g, `<h3>${t('教育经历')}</h3>`)
    .replace(/<h3>Skills<\/h3>/g, `<h3>${t('技能')}</h3>`)
    .replace(/<h3>Awards & Certificates<\/h3>/g, `<h3>${t('证书/荣誉奖项')}</h3>`)
    .replace(/<h3>Activities<\/h3>/g, `<h3>${t('校园活动/社会实践')}</h3>`)
}

function buildPlaceholderPreviewDoc(message: string): string {
  const safe = escapeHtmlStr(message)
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;font-family:system-ui,-apple-system,sans-serif;padding:24px;color:#64748b;line-height:1.6;font-size:14px;background:#f8fafc}</style></head><body><p>${safe}</p></body></html>`
}

const previewHtml = computed(() => {
  const tid = resumeTemplateId.value
  void title.value

  void content.basicInfo.name
  void content.basicInfo.phone
  void content.basicInfo.email
  void content.basicInfo.school
  void content.basicInfo.major
  void content.basicInfo.graduationYear
  void content.basicInfo.avatar
  void content.jobIntention.targetPosition
  void content.jobIntention.expectedSalary
  void content.jobIntention.preferredCity
  void content.jobIntention.workType
  void content.selfIntro
  void content.skills.length
  content.skills.forEach((s) => {
    void s
  })
  void content.education.length
  content.education.forEach((e) => {
    void e.school
    void e.major
    void e.startDate
    void e.endDate
  })
  void content.experience.length
  content.experience.forEach((e) => {
    void e.company
    void e.position
    void e.startDate
    void e.endDate
    void e.description
  })
  void content.projects.length
  content.projects.forEach((p) => {
    void p.name
    void p.startDate
    void p.endDate
    void p.description
  })
  void content.awards.length
  content.awards.forEach((a) => {
    void a.name
    void a.date
    void a.description
  })
  void content.activities.length
  content.activities.forEach((a) => {
    void a.organization
    void a.role
    void a.startDate
    void a.endDate
    void a.description
  })

  if (!tid) {
    return buildPlaceholderPreviewDoc(t('当前简历未绑定模板。在模板库选择模板创建简历后即可在此实时预览。'))
  }
  if (templateLoading.value) {
    return buildPlaceholderPreviewDoc(t('正在加载模板…'))
  }
  const tpl = loadedTemplate.value
  if (templateLoadError.value && !tpl?.htmlContent) {
    return buildPlaceholderPreviewDoc(templateLoadError.value)
  }
  if (!tpl?.htmlContent?.trim()) {
    return buildPlaceholderPreviewDoc(t('该模板暂无 HTML 内容。'))
  }

  const bodyHtml = injectContentIntoTemplateFragment(tpl.htmlContent, content)
  const css = stripScriptsFromCss(tpl.cssContent || '')
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:24px 28px;overflow:auto;box-sizing:border-box;background:#fff;font-size:14px}${css}</style></head><body>${bodyHtml}</body></html>`
})

function defaultContent(): ResumeContent {
  return {
    basicInfo: {
      name: '',
      phone: '',
      email: '',
      school: '',
      major: '',
      graduationYear: '',
    },
    jobIntention: {
      targetPosition: '',
      expectedSalary: '',
      preferredCity: '',
      workType: '',
    },
    education: [],
    experience: [],
    projects: [],
    awards: [],
    activities: [],
    skills: [],
    selfIntro: '',
  }
}

function normalizeContent(raw: Record<string, unknown> | undefined | null): ResumeContent {
  const base = defaultContent()
  if (!raw || typeof raw !== 'object') return base
  const basic = (raw.basicInfo as Record<string, string>) || {}
  base.basicInfo = {
    name: basic.name ?? '',
    phone: basic.phone ?? '',
    email: basic.email ?? '',
    school: basic.school ?? '',
    major: basic.major ?? '',
    graduationYear: String(basic.graduationYear ?? ''),
    avatar: basic.avatar || undefined,
  }
  const jobIntention = (raw.jobIntention as Record<string, string>) || {}
  base.jobIntention = {
    targetPosition: jobIntention.targetPosition ?? '',
    expectedSalary: jobIntention.expectedSalary ?? '',
    preferredCity: jobIntention.preferredCity ?? '',
    workType: jobIntention.workType ?? '',
  }
  base.selfIntro = String(raw.selfIntro ?? '')
  const edu = raw.education
  if (Array.isArray(edu)) {
    base.education = edu.map((e: Record<string, string>) => ({
      school: e?.school ?? '',
      major: e?.major ?? '',
      startDate: e?.startDate ?? '',
      endDate: e?.endDate ?? '',
    }))
  }
  const exp = raw.experience
  if (Array.isArray(exp)) {
    base.experience = exp.map((e: Record<string, string>) => ({
      company: e?.company ?? '',
      position: e?.position ?? '',
      startDate: e?.startDate ?? '',
      endDate: e?.endDate ?? '',
      description: e?.description ?? '',
    }))
  }
  const proj = raw.projects
  if (Array.isArray(proj)) {
    base.projects = proj.map((p: Record<string, string>) => ({
      name: p?.name ?? '',
      startDate: p?.startDate ?? '',
      endDate: p?.endDate ?? '',
      description: p?.description ?? '',
    }))
  }
  const awards = raw.awards
  if (Array.isArray(awards)) {
    base.awards = awards.map((a: Record<string, string>) => ({
      name: a?.name ?? '',
      date: a?.date ?? '',
      description: a?.description ?? '',
    }))
  }
  const activities = raw.activities
  if (Array.isArray(activities)) {
    base.activities = activities.map((a: Record<string, string>) => ({
      organization: a?.organization ?? '',
      role: a?.role ?? '',
      startDate: a?.startDate ?? '',
      endDate: a?.endDate ?? '',
      description: a?.description ?? '',
    }))
  }
  const skills = raw.skills
  if (Array.isArray(skills)) {
    base.skills = skills.map((s) => String(s)).filter(Boolean)
  } else if (typeof skills === 'string' && skills) {
    base.skills = skills.split(/[,，、]/).map((s) => s.trim()).filter(Boolean)
  }
  return base
}

function assignContent(from: ResumeContent) {
  Object.assign(content.basicInfo, from.basicInfo)
  Object.assign(content.jobIntention, from.jobIntention)
  content.selfIntro = from.selfIntro
  content.education.splice(0, content.education.length, ...from.education.map((e) => ({ ...e })))
  content.experience.splice(0, content.experience.length, ...from.experience.map((e) => ({ ...e })))
  content.projects.splice(0, content.projects.length, ...from.projects.map((p) => ({ ...p })))
  content.awards.splice(0, content.awards.length, ...from.awards.map((a) => ({ ...a })))
  content.activities.splice(0, content.activities.length, ...from.activities.map((a) => ({ ...a })))
  content.skills.splice(0, content.skills.length, ...from.skills)
}

type ArraySectionKey = 'education' | 'experience' | 'projects' | 'awards' | 'activities'

function contentRows(key: ArraySectionKey) {
  return content[key] as any[]
}

function emptyRow(key: ArraySectionKey): any {
  if (key === 'education') return { school: '', major: '', startDate: '', endDate: '' }
  if (key === 'experience') return { company: '', position: '', startDate: '', endDate: '', description: '' }
  if (key === 'awards') return { name: '', date: '', description: '' }
  if (key === 'activities') return { organization: '', role: '', startDate: '', endDate: '', description: '' }
  return { name: '', startDate: '', endDate: '', description: '' }
}

function addArrayRow(key: ArraySectionKey) {
  ;(content[key] as unknown[]).push(emptyRow(key))
}

function removeArrayRow(key: ArraySectionKey, idx: number) {
  ;(content[key] as any[]).splice(idx, 1)
}

function addSkillTag() {
  const t = skillInput.value.trim()
  if (!t) return
  if (!content.skills.includes(t)) content.skills.push(t)
  skillInput.value = ''
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/user-center/resumes')
  }
}

async function loadTemplate(id: number) {
  templateLoading.value = true
  templateLoadError.value = ''
  try {
    const res: any = await getResumeTemplateApi(id)
    const raw = (res.data ?? res) as Record<string, unknown>
    loadedTemplate.value = {
      htmlContent: String(raw.htmlContent ?? ''),
      cssContent: String(raw.cssContent ?? ''),
    }
  } catch {
    loadedTemplate.value = null
    templateLoadError.value = t('模板加载失败，请稍后重试')
  } finally {
    templateLoading.value = false
  }
}

async function loadResume() {
  const id = resumeId.value
  if (!Number.isFinite(id)) {
    loadError.value = t('无效的简历 ID')
    loading.value = false
    resumeTemplateId.value = null
    loadedTemplate.value = null
    return
  }
  loading.value = true
  loadError.value = ''
  try {
    const res: any = await getResumeDetailApi(id)
    const detail = (res.data ?? res) as Record<string, unknown>
    title.value = String(detail.title ?? '')
    assignContent(normalizeContent(detail.content as Record<string, unknown>))
    if (!content.jobIntention.targetPosition && typeof detail.targetPosition === 'string') {
      content.jobIntention.targetPosition = detail.targetPosition
    }
    aiSkillsComma.value = content.skills.join(', ')

    const rawTid = detail.templateId
    const n = Number(rawTid)
    resumeTemplateId.value =
      rawTid != null && rawTid !== '' && Number.isFinite(n) && n > 0 ? Math.floor(n) : null
    templateLoadError.value = ''
    if (resumeTemplateId.value != null) {
      await loadTemplate(resumeTemplateId.value)
    } else {
      loadedTemplate.value = null
      // Auto-assign first available template for resumes without one
      await loadAvailableTemplates()
      if (availableTemplates.value.length > 0) {
        const firstTid = availableTemplates.value[0].id
        await applyTemplate(firstTid)
      }
    }
  } catch {
    loadError.value = t('加载简历失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function buildPayload() {
  const skills = content.skills.map((s) => s.trim()).filter(Boolean)
  return {
    title: title.value.trim(),
    targetPosition: content.jobIntention.targetPosition.trim() || undefined,
    content: {
      basicInfo: { ...content.basicInfo },
      jobIntention: { ...content.jobIntention },
      education: content.education.filter((e) => e.school || e.major),
      experience: content.experience.filter((e) => e.company || e.position),
      projects: content.projects.filter((p) => p.name),
      awards: content.awards.filter((a) => a.name || a.date || a.description),
      activities: content.activities.filter((a) => a.organization || a.role || a.description),
      skills,
      selfIntro: content.selfIntro,
    },
  }
}

async function autoSave(): Promise<boolean> {
  const id = resumeId.value
  if (!Number.isFinite(id) || !title.value.trim()) return false
  try {
    await updateResumeApi(id, buildPayload())
    return true
  } catch {
    return false
  }
}

async function onSave() {
  const id = resumeId.value
  if (!Number.isFinite(id)) return
  if (!title.value.trim()) {
    toast(t('请填写简历标题'), 'warning')
    return
  }
  saving.value = true
  try {
    await updateResumeApi(id, buildPayload())
    toast(t('保存成功'), 'success')
  } catch {
    // request interceptor
  } finally {
    saving.value = false
  }
}

async function onPreview() {
  const id = resumeId.value
  if (!Number.isFinite(id)) return
  previewing.value = true
  await autoSave()
  try {
    const res: { data?: { html?: string } } & { html?: string } = await renderResumeApi(id, currentLocale.value)
    const payload = res.data ?? res
    const html = typeof payload === 'object' && payload && 'html' in payload ? String(payload.html ?? '') : ''
    if (!html) {
      toast(t('暂无预览内容'), 'warning')
      return
    }
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    if (!w) {
      toast(t('请允许弹出窗口以查看预览'), 'warning')
      URL.revokeObjectURL(url)
      return
    }
    setTimeout(() => URL.revokeObjectURL(url), 120_000)
  } catch {
    // interceptor
  } finally {
    previewing.value = false
  }
}

async function onExportPdf() {
  const id = resumeId.value
  if (!Number.isFinite(id)) return
  exporting.value = true
  await autoSave()
  let container: HTMLDivElement | null = null
  try {
    const res: { data?: { html?: string } } & { html?: string } = await renderResumeApi(id, currentLocale.value)
    const payload = res.data ?? res
    const html = typeof payload === 'object' && payload && 'html' in payload ? String(payload.html ?? '') : ''
    if (!html) {
      toast(t('暂无可导出的内容'), 'warning')
      return
    }

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    const bodyContent = bodyMatch ? bodyMatch[1] : html.replace(/^<!DOCTYPE[^>]*>/i, '').replace(/<\/?html[^>]*>/gi, '').replace(/<\/?head[^>]*>/gi, '').replace(/<\/?body[^>]*>/gi, '')

    const scopeId = `__pdf_${Date.now()}`
    container = document.createElement('div')
    container.id = scopeId
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:800px;background:#fff;z-index:-9999;pointer-events:none'

    const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    for (const sm of styleMatches) {
      const styleEl = document.createElement('style')
      let css = sm[1]
      css = css.replace(/(^|[};,\s])\*\s*\{/gm, `$1#${scopeId} *{`)
      css = css.replace(/(^|[};,\s])body\s*\{/gm, `$1#${scopeId} {`)
      styleEl.textContent = css
      container.appendChild(styleEl)
    }

    const contentDiv = document.createElement('div')
    contentDiv.innerHTML = bodyContent
    container.appendChild(contentDiv)
    document.body.appendChild(container)

    await new Promise(r => setTimeout(r, 300))

    const { default: html2pdf } = await import('html2pdf.js')
    const fileName = `${title.value.trim() || 'resume'}.pdf`
    await html2pdf().set({
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: 800 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(contentDiv).save()
    toast(t('PDF 已导出'), 'success')
  } catch {
    // interceptor
  } finally {
    if (container?.parentNode) container.remove()
    exporting.value = false
  }
}

async function onAnalyze() {
  const id = resumeId.value
  if (!Number.isFinite(id)) return
  analyzing.value = true
  try {
    const res: any = await analyzeResumeApi(id)
    const data = (res.data ?? res) as Record<string, unknown>
    analysisDialog.data = {
      completeness: Number(data.completeness ?? 0),
      score: Number(data.score ?? 0),
      keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
      suggestions: Array.isArray(data.suggestions) ? (data.suggestions as string[]) : [],
    }
    analysisDialog.open = true
  } catch {
    // interceptor
  } finally {
    analyzing.value = false
  }
}

function closeAnalysisAndEdit() {
  analysisDialog.open = false
  requestAnimationFrame(() => {
    document.getElementById('resume-basic-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

async function onPolish() {
  const id = resumeId.value
  if (!Number.isFinite(id)) return
  polishing.value = true
  try {
    await optimizeResumeApi(id, { locale: currentLocale.value })
    toast(t('润色请求已完成'), 'success')
    await loadResume()
  } catch {
    // interceptor
  } finally {
    polishing.value = false
  }
}

async function onAiGenerate() {
  const id = resumeId.value
  if (!Number.isFinite(id)) return
  const parsed = aiSkillsComma.value
    .split(/[,，、]/)
    .map((s) => s.trim())
    .filter(Boolean)
  parsed.forEach((s) => {
    if (!content.skills.includes(s)) content.skills.push(s)
  })
  generatingAi.value = true
  try {
    const payload: Record<string, unknown> = {
      mode: 'generate',
      locale: currentLocale.value,
      basicInfo: {
        name: content.basicInfo.name,
        school: content.basicInfo.school,
        major: content.basicInfo.major,
        graduationYear: content.basicInfo.graduationYear,
      },
      skills: content.skills.map((s) => s.trim()).filter(Boolean),
      targetPosition: content.jobIntention.targetPosition || '',
    }
    const res: any = await optimizeResumeApi(id, payload)
    const data = (res.data ?? res) as Record<string, unknown>

    // 如果后端返回了全量生成内容，填充到表单中
    if (data.mode === 'generate' && data.generatedContent) {
      const generated = normalizeContent(data.generatedContent as Record<string, unknown>)
      assignContent(generated)
      aiSkillsComma.value = content.skills.join(', ')
      toast(typeof data.message === 'string' ? data.message : t('已成功生成完整简历内容'), 'success')
      optimizeFeedback.visible = false
    } else {
      // 降级为建议模式
      optimizeFeedback.visible = true
      optimizeFeedback.message = typeof data.message === 'string' ? data.message : ''
      optimizeFeedback.suggestions = Array.isArray(data.suggestions) ? (data.suggestions as string[]) : []
      optimizeFeedback.rawJson = JSON.stringify(data, null, 2)
      toast(t('已收到 AI 优化接口响应'), 'success')
    }
  } catch {
    // interceptor
  } finally {
    generatingAi.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    void loadResume()
  },
)

onMounted(() => {
  void loadAvailableTemplates()
  void loadResume()
})
</script>
