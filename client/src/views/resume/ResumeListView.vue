<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">校园简历模板</h1>
      <div class="flex gap-3">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索模板..."
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
        全部
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = selectedCategory === cat ? '' : cat; fetchTemplates()"
        :class="selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
        class="px-4 py-1.5 rounded-full text-sm border border-gray-200 transition-colors"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="tpl in templates"
        :key="tpl.id"
        class="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
        @click="openDetail(tpl)"
      >
        <div v-if="tpl.htmlContent" class="h-52 bg-gray-50 overflow-hidden relative">
          <iframe
            :srcdoc="buildPreviewHtml(tpl)"
            class="absolute top-0 left-0 w-[700px] h-[900px] border-none pointer-events-none"
            sandbox=""
            scrolling="no"
          />
        </div>
        <div v-else class="h-52 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <svg class="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ tpl.name }}</h3>
            <span v-if="tpl.category" class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{{ tpl.category }}</span>
          </div>
          <p class="text-sm text-gray-500 line-clamp-2">{{ tpl.description || '暂无描述' }}</p>
        </div>
      </div>
    </div>

    <div v-if="templates.length === 0 && !loading" class="text-center py-16 text-gray-400">
      暂无简历模板
    </div>

    <div v-if="total > pageSize" class="flex justify-center gap-2 mt-6">
      <button
        :disabled="page <= 1"
        @click="page--; fetchTemplates()"
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
      >
        上一页
      </button>
      <span class="px-4 py-2 text-sm text-gray-600">{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
      <button
        :disabled="page >= Math.ceil(total / pageSize)"
        @click="page++; fetchTemplates()"
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
      >
        下一页
      </button>
    </div>

    <!-- 模板详情弹窗 -->
    <div v-if="currentTemplate" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="currentTemplate = null">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
          <h2 class="text-lg font-bold text-gray-900">{{ currentTemplate.name }}</h2>
          <button @click="currentTemplate = null" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="currentTemplate.thumbnail" class="rounded-lg overflow-hidden border border-gray-100">
            <img :src="currentTemplate.thumbnail" :alt="currentTemplate.name" class="w-full" />
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">分类</span>
            <span>{{ currentTemplate.category || '通用' }}</span>
          </div>
          <div v-if="currentTemplate.description" class="text-sm text-gray-600">
            {{ currentTemplate.description }}
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">更新时间</span>
            <span>{{ formatTime(currentTemplate.updatedAt) }}</span>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2">
          <button @click="previewTemplate(currentTemplate)" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            预览模板
          </button>
          <button
            v-if="isLoggedIn"
            @click="useTemplate(currentTemplate)"
            :disabled="creating"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ creating ? '创建中...' : '使用此模板' }}
          </button>
          <router-link
            v-else
            to="/login"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 inline-block"
          >
            登录后使用
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import toast from '@/utils/toast'

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

const sampleData: Record<string, string> = {
  '{{avatar}}': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzE2NzdmZiIgcng9IjUwIi8+PHRleHQgeD0iNTAiIHk9IjYwIiBmb250LXNpemU9IjQwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5bygPC90ZXh0Pjwvc3ZnPg==',
  '{{name}}': '张三',
  '{{phone}}': '138-0000-0000',
  '{{email}}': 'zhangsan@example.com',
  '{{school}}': '清华大学',
  '{{major}}': '计算机科学与技术',
  '{{graduationYear}}': '2026',
  '{{selfIntro}}': '热爱技术，具有扎实的编程基础和良好的团队协作能力。',
  '{{skills}}': '<span class="skill-tag">JavaScript</span> <span class="skill-tag">Vue.js</span> <span class="skill-tag">React</span> <span class="skill-tag">Node.js</span>',
  '{{education}}': '<div class="item"><strong>清华大学</strong> - 计算机科学与技术 <span class="time">2022.09 ~ 2026.06</span></div>',
  '{{experience}}': '<div class="item"><strong>字节跳动</strong> - 前端开发实习生 <span class="time">2025.06 ~ 2025.09</span><p>负责电商后台管理系统的前端开发</p></div>',
  '{{projects}}': '<div class="item"><strong>校园招聘平台</strong> <span class="time">2025.03 ~ 2025.06</span><p>基于 Vue3 + NestJS 的全栈项目</p></div>',
}

function buildPreviewHtml(tpl: Template): string {
  let html = tpl.htmlContent || ''
  const css = (tpl.cssContent || '').replace(/<\/?script[^>]*>/gi, '')
  for (const [placeholder, value] of Object.entries(sampleData)) {
    html = html.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;overflow:hidden;pointer-events:none;transform-origin:top left;transform:scale(0.28);width:700px;min-height:900px}${css}</style></head><body>${html}</body></html>`
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
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

function formatTime(t: string) {
  return new Date(t).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
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

async function previewTemplate(tpl: Template) {
  try {
    const res: any = await request.get(`/resumes/templates/${tpl.id}`)
    const data = res.data || res
    const html = data.htmlContent || ''
    const css = (data.cssContent || '').replace(/<\/?script[^>]*>/gi, '')
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body></body></html>`)
      win.document.close()
      const container = win.document.createElement('div')
      container.innerHTML = html
      container.querySelectorAll('script').forEach(s => s.remove())
      win.document.body.appendChild(container)
    } else {
      toast('请允许弹窗以预览模板', 'warning')
    }
  } catch {
    toast('预览失败', 'error')
  }
}

async function useTemplate(tpl: Template) {
  creating.value = true
  try {
    const res: any = await request.post('/resumes', {
      title: `${tpl.name} - 我的简历`,
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
    toast('简历已创建，进入编辑', 'success')
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
