<template>
  <div class="page-shell min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6" style="max-width: 1200px; margin-inline: auto;">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('校园简历模板') }}</h1>
      <div class="flex gap-3">
        <input
          v-model="keyword"
          type="text"
          :placeholder="$t('搜索模板...')"
          class="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          @keyup.enter="fetchTemplates"
        />
      </div>
    </div>

    <div v-if="categories.length" class="flex gap-2 mb-6 flex-wrap">
      <button
        @click="selectedCategory = ''; fetchTemplates()"
        :class="!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
        class="px-4 py-1.5 rounded-full text-sm border border-gray-200 transition-colors"
      >
        {{ $t('全部') }}
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = selectedCategory === cat ? '' : cat; fetchTemplates()"
        :class="selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
        class="px-4 py-1.5 rounded-full text-sm border border-gray-200 transition-colors"
      >
        {{ $t(cat) }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="tpl in templates"
        :key="tpl.id"
        class="bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group overflow-hidden"
        @click="openDetail(tpl)"
      >
        <div v-if="tpl.htmlContent" class="h-64 bg-gray-50 overflow-hidden relative flex justify-center">
          <iframe
            :srcdoc="buildPreviewHtml(tpl)"
            class="absolute top-0 w-[700px] h-[900px] border-none pointer-events-none"
            style="left: 50%; transform: translateX(-50%)"
            sandbox=""
            scrolling="no"
          />
        </div>
        <div v-else class="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <svg class="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ $t(tpl.name) }}</h3>
            <span v-if="tpl.category" class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{{ $t(tpl.category) }}</span>
          </div>
          <p class="text-sm text-gray-500 line-clamp-2">{{ $t(tpl.description || '暂无描述') }}</p>
        </div>
      </div>
    </div>

    <div v-if="templates.length === 0 && !loading" class="text-center py-16 text-gray-400">
      {{ $t('暂无简历模板') }}
    </div>

    <div v-if="total > pageSize" class="flex justify-center gap-2 mt-6">
      <button
        :disabled="page <= 1"
        @click="page--; fetchTemplates()"
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
      >
        {{ $t('上一页') }}
      </button>
      <span class="px-4 py-2 text-sm text-gray-600">{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
      <button
        :disabled="page >= Math.ceil(total / pageSize)"
        @click="page++; fetchTemplates()"
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
      >
        {{ $t('下一页') }}
      </button>
    </div>

    <!-- 模板详情弹窗 -->
    <div v-if="currentTemplate" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="currentTemplate = null">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
          <h2 class="text-lg font-bold text-gray-900">{{ $t(currentTemplate.name) }}</h2>
          <button @click="currentTemplate = null" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="currentTemplate.thumbnail" class="rounded-lg overflow-hidden border border-gray-100">
            <img :src="currentTemplate.thumbnail" :alt="currentTemplate.name" class="w-full" />
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">{{ $t('分类') }}</span>
            <span>{{ $t(currentTemplate.category || '通用') }}</span>
          </div>
          <div v-if="currentTemplate.description" class="text-sm text-gray-600">
            {{ $t(currentTemplate.description) }}
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">{{ $t('更新时间') }}</span>
            <span>{{ formatTime(currentTemplate.updatedAt) }}</span>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2">
          <button @click="openPreviewModal(currentTemplate)" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            {{ $t('预览模板') }}
          </button>
          <button
            v-if="isLoggedIn"
            @click="useTemplate(currentTemplate)"
            :disabled="creating"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ creating ? $t('创建中...') : $t('使用此模板') }}
          </button>
          <router-link
            v-else
            to="/login"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 inline-block"
          >
            {{ $t('登录后使用') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 全屏预览弹窗 -->
    <div v-if="previewHtml" class="fixed inset-0 z-[60] flex flex-col bg-black/60" @click.self="previewHtml = ''">
      <div class="flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur border-b border-gray-200">
        <h3 class="text-base font-semibold text-gray-800">{{ $t('模板预览') }}</h3>
        <button @click="previewHtml = ''" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
      </div>
      <div class="flex-1 overflow-auto flex justify-center p-6 bg-gray-100">
        <div class="bg-white shadow-xl rounded-lg overflow-hidden" style="width:800px;min-height:1000px">
          <iframe :srcdoc="previewHtml" class="w-full border-none" style="height:1200px" sandbox="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import toast from '@/utils/toast'
import { useI18n } from '@/i18n'

const { t, locale } = useI18n()

const router = useRouter()

interface Template {
  id: number
  name: string
  thumbnail?: string
  description?: string
  category: string
  htmlContent?: string
  cssContent?: string
  updatedAt: string
}

function buildSampleAvatarUri(ch: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120"><rect width="100" height="120" fill="#2563eb" rx="8"/><text x="50" y="70" font-size="38" fill="#fff" text-anchor="middle" font-family="sans-serif">${ch}</text></svg>`
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}

const isEn = computed(() => (locale as Ref<string>).value !== 'zh-CN')

const sampleData = computed<Record<string, string>>(() => {
  if (isEn.value) {
    return {
      '{{avatar}}': buildSampleAvatarUri('J'),
      '{{name}}': 'John Smith',
      '{{phone}}': '+1 (555) 123-4567',
      '{{email}}': 'john.smith@example.com',
      '{{school}}': 'Peking University',
      '{{major}}': 'Computer Science',
      '{{graduationYear}}': '2026',
      '{{targetPosition}}': 'Frontend Developer',
      '{{expectedSalary}}': '15-25K',
      '{{preferredCity}}': 'Beijing',
      '{{workType}}': 'Full-time',
      '{{selfIntro}}': 'Passionate about technology with a solid programming foundation and excellent teamwork skills. Experienced in multiple full-stack projects during college.',
      '{{skills}}': '<span class="skill-tag">JavaScript</span><span class="skill-tag">TypeScript</span><span class="skill-tag">Vue.js</span><span class="skill-tag">React</span><span class="skill-tag">Node.js</span><span class="skill-tag">Python</span>',
      '{{education}}': '<div class="item"><strong>Peking University</strong> — Computer Science <span class="time">2022.09 ~ 2026.06</span></div>',
      '{{experience}}': '<div class="item"><strong>ByteDance</strong> — Frontend Intern <span class="time">2025.06 ~ 2025.09</span><p>Developed and optimized the e-commerce admin dashboard</p></div>',
      '{{projects}}': '<div class="item"><strong>Campus Recruitment Platform</strong> <span class="time">2025.03 ~ 2025.06</span><p>Full-stack project built with Vue 3 + NestJS, featuring resume management and AI interviews</p></div>',
      '{{awards}}': '<div class="item"><strong>National Scholarship</strong> <span class="time">2024</span></div>',
      '{{activities}}': '<div class="item"><strong>Tech Club</strong> — President <span class="time">2023 ~ 2025</span><p>Organized tech talks and hackathon events on campus</p></div>',
    }
  }
  return {
    '{{avatar}}': buildSampleAvatarUri('张'),
    '{{name}}': '张三',
    '{{phone}}': '138-0000-0000',
    '{{email}}': 'zhangsan@example.com',
    '{{school}}': '清华大学',
    '{{major}}': '计算机科学与技术',
    '{{graduationYear}}': '2026',
    '{{targetPosition}}': '前端开发工程师',
    '{{expectedSalary}}': '15-25K',
    '{{preferredCity}}': '北京',
    '{{workType}}': '全职',
    '{{selfIntro}}': '热爱技术，具有扎实的编程基础和良好的团队协作能力。在校期间参与多个实战项目，熟练掌握前后端开发技能。',
    '{{skills}}': '<span class="skill-tag">JavaScript</span><span class="skill-tag">TypeScript</span><span class="skill-tag">Vue.js</span><span class="skill-tag">React</span><span class="skill-tag">Node.js</span><span class="skill-tag">Python</span>',
    '{{education}}': '<div class="item"><strong>清华大学</strong> — 计算机科学与技术 <span class="time">2022.09 ~ 2026.06</span></div>',
    '{{experience}}': '<div class="item"><strong>字节跳动</strong> — 前端开发实习生 <span class="time">2025.06 ~ 2025.09</span><p>负责电商后台管理系统的前端开发与性能优化</p></div>',
    '{{projects}}': '<div class="item"><strong>校园招聘平台</strong> <span class="time">2025.03 ~ 2025.06</span><p>基于 Vue 3 + NestJS 的全栈项目，实现简历管理与智能面试功能</p></div>',
    '{{awards}}': '<div class="item"><strong>国家奖学金</strong> <span class="time">2024</span></div>',
    '{{activities}}': '<div class="item"><strong>技术社团</strong> — 社长 <span class="time">2023 ~ 2025</span><p>组织校内技术分享与黑客马拉松活动</p></div>',
  }
})

function translateSectionHeadings(html: string): string {
  const map: Record<string, string> = {
    'About Me': t('自我介绍'),
    'Education': t('教育经历'),
    'Work Experience': t('实习/工作经历'),
    'Projects': t('项目经验'),
    'Awards & Certificates': t('证书/荣誉奖项'),
    'Activities': t('校园活动/社会实践'),
    'Skills': t('技能'),
    'Contact': t('联系方式'),
  }
  let result = html
  for (const [en, label] of Object.entries(map)) {
    result = result.replace(new RegExp(`<h2>${en}</h2>`, 'g'), `<h2>${label}</h2>`)
      .replace(new RegExp(`<h3>${en}</h3>`, 'g'), `<h3>${label}</h3>`)
  }
  return result
}

function buildPreviewHtml(tpl: Template): string {
  let html = tpl.htmlContent || ''
  const css = (tpl.cssContent || '').replace(/<\/?script[^>]*>/gi, '')
  for (const [placeholder, value] of Object.entries(sampleData.value)) {
    html = html.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  }
  html = translateSectionHeadings(html)
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;overflow:hidden;pointer-events:none;transform-origin:top center;transform:scale(0.32);width:700px;min-height:900px}${css}</style></head><body>${html}</body></html>`
}

const templates = ref<Template[]>([])
const categories = ref<string[]>([])
const loading = ref(false)
const creating = ref(false)
const keyword = ref('')
const selectedCategory = ref('')
const page = ref(1)
const pageSize = 20
const total = ref(0)
const currentTemplate = ref<Template | null>(null)
const previewHtml = ref('')
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

function formatTime(ts: string) {
  return new Date(ts).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

async function fetchTemplates() {
  loading.value = true
  try {
    const res: any = await request.get('/resumes/templates', {
      params: {
        page: page.value,
        pageSize,
        category: selectedCategory.value || undefined,
        keyword: keyword.value.trim() || undefined,
      },
    })
    const data = res.data || res
    templates.value = data.list || []
    total.value = data.total || 0
  } catch {
    templates.value = []
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res: any = await request.get('/resumes/templates/categories')
    categories.value = res.data || res || []
  } catch {
    categories.value = []
  }
}

function openDetail(tpl: Template) {
  currentTemplate.value = tpl
}

function openPreviewModal(tpl: Template) {
  let html = tpl.htmlContent || ''
  const css = (tpl.cssContent || '').replace(/<\/?script[^>]*>/gi, '')
  for (const [placeholder, value] of Object.entries(sampleData.value)) {
    html = html.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  }
  html = translateSectionHeadings(html)
  previewHtml.value = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:40px;background:#fff}${css}</style></head><body>${html}</body></html>`
}

async function useTemplate(tpl: Template) {
  creating.value = true
  try {
    const res: any = await request.post('/resumes', {
      title: `${tpl.name} - My Resume`,
      templateId: tpl.id,
      content: {
        basicInfo: { name: '', phone: '', email: '', school: '', major: '', graduationYear: '' },
        education: [],
        experience: [],
        projects: [],
        skills: [],
        selfIntro: '',
      },
    })
    const newId = res.data?.id || res.id
    currentTemplate.value = null
    toast(t('简历已创建，进入编辑'), 'success')
    if (newId) router.push({ name: 'ResumeEdit', params: { id: newId } })
    else router.push('/user-center')
  } catch {} finally {
    creating.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchTemplates()
})
</script>
