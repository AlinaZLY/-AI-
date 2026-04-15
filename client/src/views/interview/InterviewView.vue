<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">AI 校招模拟面试</h1>
      <button @click="openStartModal" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">开始新面试</button>
    </div>

    <div v-if="isLoggedIn" class="flex gap-1 mb-6 border-b border-gray-200">
      <button
        type="button"
        :class="mainTab === 'list' ? 'border-b-2 border-blue-600 text-blue-600 font-medium -mb-px pb-2 px-3' : 'text-gray-500 hover:text-gray-700 pb-2 px-3'"
        @click="mainTab = 'list'"
      >
        面试记录
      </button>
      <button
        type="button"
        :class="mainTab === 'radar' ? 'border-b-2 border-blue-600 text-blue-600 font-medium -mb-px pb-2 px-3' : 'text-gray-500 hover:text-gray-700 pb-2 px-3'"
        @click="onRadarTab"
      >
        能力雷达
      </button>
    </div>

    <!-- 面试方向（记录页顶部） -->
    <section v-if="isLoggedIn && mainTab === 'list' && categoryTree.length" class="mb-6">
      <p class="text-sm text-gray-600 mb-2">面试方向</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categoryTree"
          :key="cat.id"
          type="button"
          @click="selectRootCategory(cat)"
          :class="[
            'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border transition-colors',
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
      <p v-if="childPillsForSelection.length" class="text-xs text-gray-500 mt-2">细分方向</p>
      <div v-if="childPillsForSelection.length" class="flex flex-wrap gap-2 mt-1">
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
    </section>

    <!-- 能力雷达 -->
    <div v-if="isLoggedIn && mainTab === 'radar'" class="mb-8">
      <div v-if="radarLoading" class="flex justify-center py-16">
        <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
      <div v-else-if="!canShowRadarChart" class="text-center py-12 text-gray-500">暂无雷达数据，请先完成至少一场面试</div>
      <div v-else-if="radarSpec" class="flex flex-col items-center">
        <p v-if="radarInterviewHint" class="text-sm text-gray-500 mb-4">{{ radarInterviewHint }}</p>
        <svg :viewBox="radarViewBox" class="w-full max-w-md h-auto text-gray-800" role="img" aria-label="能力雷达图">
          <g v-for="(gridPts, gi) in radarSpec.grids" :key="'g' + gi">
            <polygon
              :points="gridPts"
              fill="none"
              stroke="currentColor"
              stroke-opacity="0.12"
              stroke-width="1"
              class="text-gray-400"
            />
          </g>
          <g v-for="(axis, ai) in radarSpec.axes" :key="'a' + ai">
            <line
              :x1="axis.x1"
              :y1="axis.y1"
              :x2="axis.x2"
              :y2="axis.y2"
              stroke="currentColor"
              stroke-opacity="0.2"
              stroke-width="1"
              class="text-gray-400"
            />
          </g>
          <polygon
            :points="radarSpec.dataPoly"
            fill="rgba(37, 99, 235, 0.25)"
            stroke="rgb(37, 99, 235)"
            stroke-width="2"
          />
          <g v-for="(lb, li) in radarSpec.labels" :key="'l' + li">
            <text
              :x="lb.x"
              :y="lb.y"
              :text-anchor="lb.anchor"
              dominant-baseline="middle"
              class="fill-gray-600 text-[10px] sm:text-xs"
              style="font-size: 11px"
            >
              {{ lb.text }}
            </text>
            <text
              :x="lb.x"
              :y="lb.y + 14"
              :text-anchor="lb.anchor"
              dominant-baseline="middle"
              class="fill-blue-600 font-medium"
              style="font-size: 10px"
            >
              {{ lb.score }}
            </text>
          </g>
        </svg>
      </div>
    </div>

    <div v-if="mainTab === 'list'">
      <div v-if="loading" class="flex justify-center py-16">
        <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="iv in interviews"
          :key="iv.id"
          class="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer"
          @click="openInterview(iv)"
        >
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-gray-900">{{ iv.jobTitle || '模拟面试' }}</h3>
            <span
              :class="iv.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'"
              class="px-2 py-0.5 rounded-full text-xs"
            >
              {{ iv.status === 'completed' ? '已完成' : '进行中' }}
            </span>
          </div>
          <div class="flex gap-4 text-sm text-gray-500">
            <span>{{ iv.answeredCount }}/{{ iv.questionCount }} 题</span>
            <span v-if="iv.totalScore">得分: {{ iv.totalScore }}</span>
            <span>{{ formatTime(iv.createdAt) }}</span>
          </div>
        </div>
      </div>
      <div v-if="interviews.length === 0 && !loading" class="text-center py-16">
        <template v-if="!isLoggedIn">
          <p class="text-gray-500 mb-4">登录后可以使用 AI 模拟面试功能</p>
          <div class="flex justify-center gap-3">
            <router-link to="/login" class="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">立即登录</router-link>
            <router-link to="/register" class="px-5 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">注册账号</router-link>
          </div>
        </template>
        <p v-else class="text-gray-400">暂无面试记录，点击右上角开始</p>
      </div>
    </div>

    <!-- 开始面试弹窗 -->
    <div v-if="showStartModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeStartModal">
      <div class="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-bold text-gray-900 mb-1">开始模拟面试</h2>
        <p class="text-xs text-gray-500 mb-4">{{ startWizardSubtitle }}</p>

        <!-- Step 1: 简历 -->
        <div v-if="startWizardStep === 1 && isLoggedIn" class="min-h-[200px]">
          <div v-if="resumesLoading" class="py-12 flex justify-center">
            <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <template v-else-if="!modalResumes.length">
            <div class="rounded-xl border border-amber-100 bg-amber-50/80 p-6 text-center">
              <p class="text-sm text-amber-900 mb-3">你还没有简历，请先创建一份简历再开始模拟面试。</p>
              <router-link
                to="/my-resumes"
                class="inline-flex px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                @click="closeStartModal"
              >
                去创建简历
              </router-link>
            </div>
          </template>
          <template v-else>
            <label class="block text-sm font-medium text-gray-700 mb-2">选择本次面试关联的简历</label>
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
                <div class="font-medium text-gray-900 text-sm truncate">{{ r.title || '未命名简历' }}</div>
                <div v-if="r.targetPosition" class="text-xs text-gray-500 mt-1 truncate">{{ r.targetPosition }}</div>
                <span v-if="r.isDefault" class="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">默认</span>
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
              <label class="block text-sm font-medium text-gray-700 mb-3">选择分类</label>
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
                  >题</span>
                  <span class="text-sm font-medium text-gray-800 leading-tight px-1">{{ cat.name }}</span>
                </button>
              </div>
              <p v-if="childPillsForSelection.length" class="text-xs text-gray-500 mt-4 mb-2">细分方向</p>
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
            <p v-else class="text-sm text-gray-500 py-4">暂无面试分类，可直接进入下一步填写岗位信息。</p>
          </template>
        </div>

        <!-- Step 3: 岗位与题量 -->
        <div v-else-if="startWizardStep === 3" class="space-y-3 min-h-[200px]">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">目标岗位</label>
            <input
              v-model="startForm.jobTitle"
              placeholder="如：前端开发工程师"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">题目数量</label>
            <select
              v-model="startForm.questionCount"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option :value="3">3 题（快速练习）</option>
              <option :value="5">5 题（标准模式）</option>
              <option :value="10">10 题（深度训练）</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button type="button" @click="closeStartModal" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            取消
          </button>
          <button
            v-if="startWizardStep > startWizardFirstStep"
            type="button"
            @click="wizardBack"
            class="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            上一步
          </button>
          <button
            v-if="startWizardStep < 3"
            type="button"
            @click="wizardNext"
            :disabled="!canWizardNext"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            下一步
          </button>
          <button
            v-if="startWizardStep === 3"
            type="button"
            @click="startInterview"
            :disabled="starting || categoriesLoading"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ starting ? '生成中...' : '开始面试' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 面试详情弹窗 -->
    <div v-if="currentInterview" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="currentInterview = null">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">{{ currentInterview.jobTitle || '模拟面试' }}</h2>
          <button @click="currentInterview = null" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div v-if="currentInterview.totalScore" class="mb-4 p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ currentInterview.totalScore }} 分</div>
          <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">{{ currentInterview.overallFeedback }}</p>
        </div>
        <div v-for="(q, qi) in (currentInterview.questions || [])" :key="q.id" class="mb-4 p-4 border border-gray-100 rounded-lg">
          <h4 class="font-semibold text-gray-900 mb-2">第 {{ Number(qi) + 1 }} 题：{{ q.question }}</h4>
          <div v-if="q.isAnswered" class="space-y-2">
            <div class="text-sm text-gray-600"><span class="font-medium">你的回答：</span>{{ q.answer }}</div>
            <div class="text-sm text-green-600"><span class="font-medium">得分：</span>{{ q.score }}/100</div>
            <div v-if="q.feedback" class="text-sm text-gray-500 whitespace-pre-line">{{ q.feedback }}</div>
          </div>
          <div v-else class="mt-2">
            <textarea
              v-model="answerTexts[q.id]"
              rows="3"
              placeholder="请输入你的回答..."
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
            <button
              @click="submitAnswer(currentInterview.id, q.id)"
              :disabled="!answerTexts[q.id]?.trim()"
              class="mt-2 px-4 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              提交回答
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import { getCategoriesApi, getRadarDataApi, startInterviewApi } from '@/api/interview'

type CategoryNode = {
  id: number
  name: string
  cover?: string
  coverImage?: string
  children?: CategoryNode[]
}

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const startWizardStep = ref(1)
const startWizardFirstStep = computed(() => (isLoggedIn.value ? 1 : 2))
const startWizardSubtitle = computed(() => {
  const logged = isLoggedIn.value
  const s = startWizardStep.value
  if (!logged) {
    if (s === 2) return '步骤 1/2：选择面试方向'
    if (s === 3) return '步骤 2/2：岗位与题量'
    return ''
  }
  if (s === 1) return '步骤 1/3：选择简历'
  if (s === 2) return '步骤 2/3：选择面试方向'
  return '步骤 3/3：岗位与题量'
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

const mainTab = ref<'list' | 'radar'>('list')
const categoryTree = ref<CategoryNode[]>([])
const categoriesLoading = ref(false)
const selectedCategoryId = ref<number | null>(null)
const expandedRootId = ref<number | null>(null)

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
  return `基于最近 ${c} 场已完成面试的维度平均分`
})

async function loadCategories() {
  if (!isLoggedIn.value) return
  categoriesLoading.value = true
  try {
    const res: any = await getCategoriesApi()
    categoryTree.value = res.data || []
    if (categoryTree.value.length && selectedCategoryId.value == null) {
      const first = categoryTree.value[0]
      selectedCategoryId.value = first.id
      expandedRootId.value = first.id
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

function onRadarTab() {
  mainTab.value = 'radar'
  loadRadar()
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
  startWizardStep.value = isLoggedIn.value ? 1 : 2
  showStartModal.value = true
  if (isLoggedIn.value) loadResumesForModal()
  if (isLoggedIn.value && !categoryTree.value.length && !categoriesLoading.value) loadCategories()
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
      toast('请选择一份简历', 'warning')
      return
    }
  }
  if (categoryTree.value.length && selectedCategoryId.value == null) {
    toast('请选择面试分类', 'warning')
    return
  }
  starting.value = true
  try {
    const body: Record<string, unknown> = {
      jobTitle: startForm.jobTitle || '模拟面试',
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
    toast('回答已提交', 'success')
    await openInterview({ id: interviewId })
    await fetchInterviews()
    if (mainTab.value === 'radar') await loadRadar()
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

onMounted(() => {
  if (isLoggedIn.value) {
    fetchInterviews()
    loadCategories()
  }
})
</script>
