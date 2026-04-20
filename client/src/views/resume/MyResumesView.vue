<template>
  <div class="min-h-screen bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2">
    <div class="page-shell">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ $t('我的简历') }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ $t('管理、编辑与 AI 分析你的简历') }}</p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm gap-1.5"
            :disabled="uploading"
            @click="triggerUpload()"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            {{ uploading ? $t('上传中…') : $t('上传简历') }}
          </button>
          <router-link
            to="/resumes"
            class="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            {{ $t('从模板新建') }}
          </router-link>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept=".pdf,.doc,.docx"
          class="hidden"
          @change="onFileSelected"
        />
      </div>

      <!-- Upload loading overlay -->
      <div v-if="uploading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p class="text-sm text-gray-700 font-semibold">
          {{ uploadPhase === 'uploading' ? $t('正在上传文件…') : $t('正在 AI 分析简历…') }}
        </p>
        <div class="w-full max-w-md">
          <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
              :style="{ width: `${uploadProgress}%` }"
            />
          </div>
          <div class="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <span>{{ $t('预计需要 10-60 秒，请勿关闭页面') }}</span>
            <span>{{ uploadProgress }}%</span>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>

      <div
        v-else-if="!resumes.length"
        class="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-20 px-6"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('暂无简历') }}</h2>
        <p class="text-gray-500 text-sm mb-6 max-w-md mx-auto">{{ $t('前往简历模板库选择模板，即可快速创建第一份简历。') }}</p>
        <router-link
          to="/resumes"
          class="inline-flex px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          {{ $t('浏览模板') }}
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <article
          v-for="r in resumes"
          :key="r.id"
          class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div v-if="renaming === r.id" class="flex-1 flex gap-2">
              <input
                ref="renameInputRef"
                v-model="renameTitle"
                class="flex-1 text-lg font-semibold text-gray-900 border border-blue-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                @keydown.enter="doRename(r)"
                @keydown.esc="renaming = null"
              />
              <button type="button" class="text-xs text-blue-600 hover:text-blue-700 font-medium" @click="doRename(r)">{{ $t('确认') }}</button>
              <button type="button" class="text-xs text-gray-400 hover:text-gray-600" @click="renaming = null">{{ $t('取消') }}</button>
            </div>
            <h2 v-else class="font-semibold text-gray-900 text-lg leading-snug line-clamp-2">{{ r.title }}</h2>
            <span
              v-if="r.isDraft"
              class="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200"
            >
              {{ $t('草稿') }}
            </span>
            <span
              v-else-if="r.isDefault"
              class="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
            >
              {{ $t('默认') }}
            </span>
          </div>
          <dl class="text-sm text-gray-500 space-y-1.5 mb-4 flex-1">
            <div class="flex justify-between gap-2">
              <dt class="text-gray-400">{{ $t('创建时间') }}</dt>
              <dd>{{ formatDate(r.createdAt) }}</dd>
            </div>
            <div class="flex justify-between gap-2">
              <dt class="text-gray-400">{{ $t('模板') }}</dt>
              <dd class="text-gray-700 font-medium text-right">{{ templateLabel(r.templateId) }}</dd>
            </div>
            <div v-if="r.filePath" class="flex justify-between gap-2">
              <dt class="text-gray-400">{{ $t('附件') }}</dt>
              <dd class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                <span class="text-emerald-600 font-medium text-xs">{{ fileExtLabel(r.filePath) }}</span>
              </dd>
            </div>
          </dl>
          <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
              @click="openEdit(r)"
            >
              {{ $t('编辑') }}
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
              @click="startRename(r)"
            >
              {{ $t('重命名') }}
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
              @click="onDuplicate(r)"
              :disabled="actionId === r.id"
            >
              {{ $t('复制') }}
            </button>
            <button
              v-if="!r.isDefault"
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
              @click="onSetDefault(r)"
              :disabled="actionId === r.id"
            >
              {{ $t('设为默认') }}
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              @click="onAnalyze(r)"
              :disabled="actionId === r.id"
            >
              {{ $t('AI 分析') }}
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100"
              @click="onOptimize(r)"
              :disabled="actionId === r.id"
            >
              {{ $t('AI 优化') }}
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              @click="triggerUpload(r.id)"
              :disabled="uploading"
            >
              {{ r.filePath ? $t('重新上传') : $t('上传文件') }}
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 ml-auto"
              @click="confirmDelete(r)"
              :disabled="actionId === r.id"
            >
              {{ $t('删除') }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div
      v-if="editModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeEdit"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col"
        @click.stop
      >
        <div class="shrink-0 border-b border-gray-100 px-6 py-4 flex justify-between items-center gap-4">
          <input
            v-model="editModal.title"
            type="text"
            class="flex-1 text-lg font-bold text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
:placeholder="$t('简历标题')"
          />
          <button type="button" class="text-gray-400 hover:text-gray-600 text-2xl leading-none px-1" @click="closeEdit">
            &times;
          </button>
        </div>
        <div v-if="editModal.loading" class="flex justify-center py-16">
          <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div v-else class="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          <section>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ $t('基本信息') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="block text-xs text-gray-500">
                {{ $t('姓名') }}
                <input v-model="editModal.content.basicInfo.name" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label class="block text-xs text-gray-500">
                {{ $t('手机') }}
                <input v-model="editModal.content.basicInfo.phone" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label class="block text-xs text-gray-500">
                {{ $t('邮箱') }}
                <input v-model="editModal.content.basicInfo.email" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label class="block text-xs text-gray-500">
                {{ $t('学校') }}
                <input v-model="editModal.content.basicInfo.school" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label class="block text-xs text-gray-500">
                {{ $t('专业') }}
                <input v-model="editModal.content.basicInfo.major" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label class="block text-xs text-gray-500">
                {{ $t('毕业年份') }}
                <input v-model="editModal.content.basicInfo.graduationYear" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </label>
            </div>
          </section>

          <section v-for="section in arraySections" :key="section.key">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900">{{ section.label }}</h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                @click="addArrayRow(section.key)"
              >
                {{ $t('+ 添加') }}
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(row, idx) in editModalRows(section.key)"
                :key="idx"
                class="border border-gray-100 rounded-xl p-3 bg-gray-50/80 space-y-2"
              >
                <div class="flex justify-end">
                  <button type="button" class="text-xs text-red-500 hover:text-red-600" @click="removeArrayRow(section.key, idx)">
                    {{ $t('删除') }}
                  </button>
                </div>
                <template v-if="section.key === 'education'">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input v-model="row.school" :placeholder="$t('学校')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input v-model="row.major" :placeholder="$t('专业')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input v-model="row.startDate" :placeholder="$t('开始时间')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input v-model="row.endDate" :placeholder="$t('结束时间')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                  </div>
                </template>
                <template v-else-if="section.key === 'experience'">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input v-model="row.company" :placeholder="$t('公司')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input v-model="row.position" :placeholder="$t('职位')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input v-model="row.startDate" :placeholder="$t('开始时间')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input v-model="row.endDate" :placeholder="$t('结束时间')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                  </div>
                  <textarea
                    v-model="row.description"
                    :placeholder="$t('工作描述')"
                    rows="2"
                    class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                  />
                </template>
                <template v-else-if="section.key === 'projects'">
                  <input v-model="row.name" :placeholder="$t('项目名称')" class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input v-model="row.startDate" :placeholder="$t('开始时间')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input v-model="row.endDate" :placeholder="$t('结束时间')" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" />
                  </div>
                  <textarea
                    v-model="row.description"
                    :placeholder="$t('项目描述')"
                    rows="2"
                    class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                  />
                </template>
              </div>
            </div>
          </section>

          <section>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900">{{ $t('技能') }}</h3>
              <button type="button" class="text-xs text-blue-600 hover:text-blue-700 font-medium" @click="editModal.content.skills.push('')">
                {{ $t('+ 添加技能') }}
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <div v-for="(_s, si) in editModal.content.skills" :key="si" class="flex items-center gap-1">
                <input
                  v-model="editModal.content.skills[si]"
                  class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-36"
                  :placeholder="$t('技能')"
                />
                <button type="button" class="text-gray-400 hover:text-red-500 text-sm px-1" @click="editModal.content.skills.splice(si, 1)">
                  ×
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ $t('自我介绍') }}</h3>
            <textarea
              v-model="editModal.content.selfIntro"
              rows="4"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              :placeholder="$t('简要介绍你的优势与求职意向')"
            />
          </section>
        </div>
        <div class="shrink-0 border-t border-gray-100 px-6 py-4 flex justify-end gap-2 bg-white">
          <button type="button" class="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50" @click="closeEdit">
            {{ $t('取消') }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
            :disabled="editModal.saving"
            @click="saveEdit"
          >
            {{ editModal.saving ? $t('保存中…') : $t('保存') }}
          </button>
        </div>
      </div>
    </div>

    <!-- AI 分析结果 -->
    <div
      v-if="analysisDialog.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="analysisDialog.open = false"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl p-6"
        @click.stop
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-bold text-gray-900">{{ $t('AI 分析结果') }}</h2>
          <button type="button" class="text-gray-400 hover:text-gray-600 text-2xl leading-none" @click="analysisDialog.open = false">
            &times;
          </button>
        </div>
        <div v-if="analysisDialog.data" class="space-y-4 text-sm">
          <div class="flex gap-6">
            <div>
              <p class="text-gray-500 text-xs">{{ $t('完整度') }}</p>
              <p class="text-2xl font-bold text-blue-600">{{ analysisDialog.data.completeness }}%</p>
            </div>
            <div>
              <p class="text-gray-500 text-xs">{{ $t('评分') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ analysisDialog.data.score }}</p>
            </div>
          </div>
          <div v-if="analysisDialog.data.keywords?.length">
            <p class="font-medium text-gray-900 mb-2">{{ $t('关键词') }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(kw, i) in analysisDialog.data.keywords"
                :key="i"
                class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
              >
                {{ kw }}
              </span>
            </div>
          </div>
          <div v-if="analysisDialog.data.suggestions?.length">
            <p class="font-medium text-gray-900 mb-2">{{ $t('建议') }}</p>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
              <li v-for="(s, i) in analysisDialog.data.suggestions" :key="i">{{ s }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 优化结果 -->
    <div
      v-if="optimizeDialog.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="optimizeDialog.open = false"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl p-6"
        @click.stop
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-bold text-gray-900">{{ $t('AI 优化') }}</h2>
          <button type="button" class="text-gray-400 hover:text-gray-600 text-2xl leading-none" @click="optimizeDialog.open = false">
            &times;
          </button>
        </div>
        <p v-if="optimizeDialog.message" class="text-sm text-gray-700 mb-4">{{ optimizeDialog.message }}</p>
        <div v-if="optimizeDialog.suggestions?.length">
          <p class="font-medium text-gray-900 mb-2 text-sm">{{ $t('建议') }}</p>
          <ul class="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li v-for="(s, i) in optimizeDialog.suggestions" :key="i">{{ s }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, nextTick } from 'vue'
import { toast } from '@/utils/toast'
import { confirmDialog } from '@/utils/confirm'
import { useI18n } from '@/i18n'
import {
  getResumesApi,
  getResumeDetailApi,
  createResumeApi,
  updateResumeApi,
  deleteResumeApi,
  getTemplatesApi,
  analyzeResumeApi,
  optimizeResumeApi,
  duplicateResumeApi,
  setDefaultResumeApi,
  uploadResumeFileApi,
} from '@/api/resume'

const { t, locale: currentLocale } = useI18n()

interface BasicInfo {
  name: string
  phone: string
  email: string
  school: string
  major: string
  graduationYear: string
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

interface ResumeContent {
  basicInfo: BasicInfo
  education: EduRow[]
  experience: ExpRow[]
  projects: ProjRow[]
  skills: string[]
  selfIntro: string
}

interface ResumeCard {
  id: number
  title: string
  templateId?: number | null
  content?: Record<string, unknown>
  filePath?: string | null
  isDefault: boolean
  isDraft?: boolean
  analysisResult?: string | null
  createdAt: string
  updatedAt: string
}

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
    education: [],
    experience: [],
    projects: [],
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
  }
  base.selfIntro = String(raw.selfIntro ?? '')
  const edu = raw.education
  if (Array.isArray(edu)) {
    base.education = edu.map((e: any) => ({
      school: e?.school ?? '',
      major: e?.major ?? '',
      startDate: e?.startDate ?? '',
      endDate: e?.endDate ?? '',
    }))
  }
  const exp = raw.experience
  if (Array.isArray(exp)) {
    base.experience = exp.map((e: any) => ({
      company: e?.company ?? '',
      position: e?.position ?? '',
      startDate: e?.startDate ?? '',
      endDate: e?.endDate ?? '',
      description: e?.description ?? '',
    }))
  }
  const proj = raw.projects
  if (Array.isArray(proj)) {
    base.projects = proj.map((p: any) => ({
      name: p?.name ?? '',
      startDate: p?.startDate ?? '',
      endDate: p?.endDate ?? '',
      description: p?.description ?? '',
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

const resumes = ref<ResumeCard[]>([])
const loading = ref(true)
const actionId = ref<number | null>(null)
const templateMap = ref<Map<number, string>>(new Map())
const renaming = ref<number | null>(null)
const renameTitle = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadTargetId = ref<number | null>(null)
const uploadPhase = ref<'uploading' | 'parsing'>('uploading')
const uploadProgress = ref(0)
let uploadProgressTimer: ReturnType<typeof setInterval> | null = null

function stopUploadProgressTimer() {
  if (uploadProgressTimer) {
    clearInterval(uploadProgressTimer)
    uploadProgressTimer = null
  }
}

function startParsingProgress() {
  uploadPhase.value = 'parsing'
  uploadProgress.value = Math.max(uploadProgress.value, 72)
  stopUploadProgressTimer()
  uploadProgressTimer = setInterval(() => {
    if (uploadProgress.value < 96) {
      uploadProgress.value += 1
    }
  }, 400)
}

function resetUploadProgress() {
  stopUploadProgressTimer()
  uploadPhase.value = 'uploading'
  uploadProgress.value = 0
}

const arraySections = computed(() => [
  { key: 'education' as const, label: t('教育经历') },
  { key: 'experience' as const, label: t('实习/工作经历') },
  { key: 'projects' as const, label: t('项目经验') },
])

type ArraySectionKey = 'education' | 'experience' | 'projects'

const editModal = reactive({
  open: false,
  loading: false,
  saving: false,
  id: 0,
  title: '',
  content: defaultContent(),
})

const analysisDialog = reactive({
  open: false,
  data: null as null | {
    completeness: number
    score: number
    keywords: string[]
    suggestions: string[]
  },
})

const optimizeDialog = reactive({
  open: false,
  message: '',
  suggestions: [] as string[],
})

function formatDate(t: string) {
  return new Date(t).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function templateLabel(templateId?: number | null) {
  if (templateId == null) return t('未选择')
  return templateMap.value.get(templateId) || `${t('模板')} #${templateId}`
}

function editModalRows(key: ArraySectionKey) {
  return editModal.content[key] as any[]
}

function emptyRow(key: ArraySectionKey): EduRow | ExpRow | ProjRow {
  if (key === 'education') return { school: '', major: '', startDate: '', endDate: '' }
  if (key === 'experience') return { company: '', position: '', startDate: '', endDate: '', description: '' }
  return { name: '', startDate: '', endDate: '', description: '' }
}

function addArrayRow(key: ArraySectionKey) {
  ;(editModal.content[key] as unknown[]).push(emptyRow(key))
}

function removeArrayRow(key: ArraySectionKey, idx: number) {
  editModal.content[key].splice(idx, 1)
}

async function loadTemplates() {
  try {
    const res: any = await getTemplatesApi({ page: 1, pageSize: 500 })
    const data = res.data ?? res
    const list = data.list ?? []
    const m = new Map<number, string>()
    for (const t of list) {
      if (t?.id != null) m.set(t.id, t.name || `Template ${t.id}`)
    }
    templateMap.value = m
  } catch {
    templateMap.value = new Map()
  }
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getResumesApi()
    const raw = res.data
    resumes.value = Array.isArray(raw) ? raw : raw?.list ?? []
  } catch {
    resumes.value = []
  } finally {
    loading.value = false
  }
}

async function openEdit(r: ResumeCard) {
  editModal.open = true
  editModal.loading = true
  editModal.id = r.id
  editModal.title = r.title
  try {
    const res: any = await getResumeDetailApi(r.id)
    const detail = res.data ?? res
    editModal.title = detail.title || r.title
    editModal.content = normalizeContent(detail.content as Record<string, unknown>)
  } catch {
    editModal.content = normalizeContent(r.content as Record<string, unknown>)
    toast(t('加载详情失败，已使用列表缓存数据'), 'warning')
  } finally {
    editModal.loading = false
  }
}

function closeEdit() {
  editModal.open = false
}

async function saveEdit() {
  if (!editModal.title.trim()) {
    toast(t('请填写简历标题'), 'warning')
    return
  }
  editModal.saving = true
  const skills = editModal.content.skills.map((s) => s.trim()).filter(Boolean)
  const payload = {
    title: editModal.title.trim(),
    content: {
      basicInfo: { ...editModal.content.basicInfo },
      education: editModal.content.education.filter((e) => e.school || e.major),
      experience: editModal.content.experience.filter((e) => e.company || e.position),
      projects: editModal.content.projects.filter((p) => p.name),
      skills,
      selfIntro: editModal.content.selfIntro,
    },
  }
  try {
    await updateResumeApi(editModal.id, payload)
    toast(t('保存成功'), 'success')
    closeEdit()
    await fetchList()
  } catch {
    // interceptor
  } finally {
    editModal.saving = false
  }
}

async function onDuplicate(r: ResumeCard) {
  actionId.value = r.id
  try {
    await duplicateResumeApi(r.id)
    toast(t('已复制简历'), 'success')
    await fetchList()
  } catch {
    // interceptor
  } finally {
    actionId.value = null
  }
}

async function onSetDefault(r: ResumeCard) {
  actionId.value = r.id
  try {
    const res: any = await setDefaultResumeApi(r.id)
    const msg = res.data?.message ?? res.message ?? t('已设为默认简历')
    toast(typeof msg === 'string' ? msg : t('已设为默认简历'), 'success')
    await fetchList()
  } catch {
    // interceptor
  } finally {
    actionId.value = null
  }
}

async function onAnalyze(r: ResumeCard) {
  actionId.value = r.id
  try {
    const res: any = await analyzeResumeApi(r.id)
    const data = res.data ?? res
    analysisDialog.data = {
      completeness: data.completeness ?? 0,
      score: data.score ?? 0,
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
    }
    analysisDialog.open = true
    await fetchList()
  } catch {
    // interceptor
  } finally {
    actionId.value = null
  }
}

async function onOptimize(r: ResumeCard) {
  actionId.value = r.id
  try {
    const res: any = await optimizeResumeApi(r.id)
    const data = res.data ?? res
    optimizeDialog.message = data.message || ''
    optimizeDialog.suggestions = Array.isArray(data.suggestions) ? data.suggestions : []
    optimizeDialog.open = true
  } catch {
    // interceptor
  } finally {
    actionId.value = null
  }
}

function startRename(r: ResumeCard) {
  renaming.value = r.id
  renameTitle.value = r.title
  nextTick(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[ref="renameInputRef"]')
    inputs.forEach(el => el.focus())
    renameInputRef.value?.focus()
  })
}

async function doRename(r: ResumeCard) {
  const newTitle = renameTitle.value.trim()
  if (!newTitle) {
    toast(t('请填写简历标题'), 'warning')
    return
  }
  try {
    await updateResumeApi(r.id, { title: newTitle })
    r.title = newTitle
    toast(t('已重命名'), 'success')
  } catch {
    // interceptor
  }
  renaming.value = null
}

function fileExtLabel(path: string) {
  const ext = path.split('.').pop()?.toUpperCase() || 'FILE'
  return ext === 'PDF' ? 'PDF' : ext === 'DOCX' ? 'DOCX' : ext === 'DOC' ? 'DOC' : ext
}

function triggerUpload(resumeId?: number) {
  uploadTargetId.value = resumeId ?? null
  fileInputRef.value?.click()
}

async function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
    toast(t('仅支持 PDF / DOC / DOCX 格式'), 'warning')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    toast(t('文件大小不能超过 10MB'), 'warning')
    return
  }

  uploading.value = true
  uploadPhase.value = 'uploading'
  uploadProgress.value = 8
  try {
    let targetId = uploadTargetId.value
    if (!targetId) {
      const title = file.name.replace(/\.(pdf|docx?)/i, '')
      const defaultTemplateId = templateMap.value.size > 0 ? [...templateMap.value.keys()][0] : undefined
      const res: any = await createResumeApi({
        title: title || 'Uploaded Resume',
        ...(defaultTemplateId ? { templateId: defaultTemplateId } : {}),
      })
      targetId = res.data?.id || res.id
      if (!targetId) {
        toast(t('创建简历记录失败'), 'error')
        return
      }
    }
    await uploadResumeFileApi(targetId, file, currentLocale.value, (percent) => {
      const p = Math.max(8, Math.min(percent, 70))
      uploadProgress.value = p
      if (percent >= 100) {
        startParsingProgress()
      }
    })
    uploadProgress.value = 100
    toast(t('上传成功'), 'success')
    await fetchList()
  } catch {
    toast(t('上传失败，请重试'), 'error')
  } finally {
    uploading.value = false
    uploadTargetId.value = null
    resetUploadProgress()
  }
}

async function confirmDelete(r: ResumeCard) {
  const ok = await confirmDialog(t('确定删除简历「{title}」？此操作不可恢复。').replace('{title}', r.title), { title: t('删除简历'), kind: 'danger', confirmText: t('删除'), description: t('删除后你将无法使用该简历投递职位或开启面试。') })
  if (!ok) return
  void doDelete(r.id)
}

async function doDelete(id: number) {
  actionId.value = id
  try {
    await deleteResumeApi(id)
    toast(t('已删除'), 'success')
    await fetchList()
  } catch {
    // interceptor
  } finally {
    actionId.value = null
  }
}

onMounted(async () => {
  await loadTemplates()
  await fetchList()
})
</script>
