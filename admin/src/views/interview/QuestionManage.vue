<template>
  <div class="question-manage">
    <a-page-header title="题库管理" :sub-title="manageTab === 'bank' ? `共 ${pagination.total} 道题` : `待审核 ${pendingTotal} 条`">
      <template #extra>
        <a-button v-if="manageTab === 'bank'" type="primary" @click="openCreateModal"><PlusOutlined /> 新增题目</a-button>
      </template>
    </a-page-header>

    <a-tabs v-model:activeKey="manageTab" style="margin-bottom: 16px" @change="onManageTabChange">
      <a-tab-pane key="bank" tab="题库管理" />
      <a-tab-pane key="review">
        <template #tab>投稿审核 <a-badge v-if="pendingTotal > 0" :count="pendingTotal" :number-style="{ backgroundColor: '#faad14' }" /></template>
      </a-tab-pane>
    </a-tabs>

    <div v-show="manageTab === 'bank'" class="content-layout">
      <div class="sidebar">
        <div class="sidebar-header">
          <span>题目分类</span>
          <a-button type="link" size="small" @click="showCategoryModal = true"><SettingOutlined /></a-button>
        </div>
        <div class="tree-item root" :class="{ active: !selectedCategoryId }" @click="selectCategory(undefined)">
          <FolderOutlined />
          <span class="tree-label">全部题目</span>
          <span class="tree-badge">{{ pagination.total }}</span>
        </div>
        <template v-for="cat in categories" :key="cat.id">
          <div class="tree-item root" @click="toggleExpand(cat.id)">
            <template v-if="cat.coverImage"><a-avatar :src="cat.coverImage" :size="20" shape="square" /></template>
            <template v-else><FolderOpenOutlined v-if="expandedKeys.has(cat.id)" /><FolderOutlined v-else /></template>
            <span class="tree-label">{{ cat.name }}</span>
            <span class="tree-badge" v-if="cat.questionCount">{{ cat.questionCount }}</span>
            <DownOutlined class="tree-arrow" :class="{ open: expandedKeys.has(cat.id) }" />
          </div>
          <template v-if="expandedKeys.has(cat.id)">
            <template v-if="cat.children?.length">
              <template v-for="child in cat.children" :key="child.id">
                <div class="tree-item child" @click="toggleExpand(child.id, true)">
                  <template v-if="child.coverImage"><a-avatar :src="child.coverImage" :size="18" shape="square" /></template>
                  <template v-else><FileTextOutlined style="color: #8c8c8c" /></template>
                  <span class="tree-label">{{ child.name }}</span>
                  <span class="tree-badge" v-if="child.questionCount">{{ child.questionCount }}</span>
                  <DownOutlined class="tree-arrow small" :class="{ open: expandedKeys.has(child.id) }" />
                </div>
                <template v-if="expandedKeys.has(child.id)">
                  <div v-for="qt in questionTypes" :key="`${child.id}-${qt.type}`" class="tree-item type-item" :class="{ active: selectedCategoryId === child.id && filters.questionType === qt.type }" @click="selectCategoryType(child.id, qt.type)">
                    <span class="type-dot" :style="{ background: chipColor(qt.type) }" />
                    <span class="tree-label">{{ qt.label }}</span>
                  </div>
                </template>
              </template>
            </template>
            <template v-else>
              <div v-for="qt in questionTypes" :key="`${cat.id}-${qt.type}`" class="tree-item type-item" :class="{ active: selectedCategoryId === cat.id && filters.questionType === qt.type }" @click="selectCategoryType(cat.id, qt.type)">
                <span class="type-dot" :style="{ background: chipColor(qt.type) }" />
                <span class="tree-label">{{ qt.label }}</span>
              </div>
            </template>
          </template>
        </template>
      </div>

      <div class="main-content">
        <div class="type-group-bar">
          <div v-for="ts in typeStatsCards" :key="ts.type" class="type-chip" :class="{ active: filters.questionType === ts.type }" @click="toggleType(ts.type)">
            <span class="type-chip-dot" :style="{ background: chipColor(ts.type) }" />
            {{ ts.label }} <strong>{{ ts.count }}</strong>
          </div>
        </div>

        <div class="filter-bar">
          <a-input-search v-model:value="filters.keyword" placeholder="搜索题目/公司/标签" style="width: 240px" allow-clear @search="handleSearch" />
          <a-select v-model:value="filters.difficulty" placeholder="难度" style="width: 90px" allow-clear @change="handleSearch">
            <a-select-option value="easy">简单</a-select-option>
            <a-select-option value="medium">中等</a-select-option>
            <a-select-option value="hard">困难</a-select-option>
          </a-select>
        </div>

        <a-table :columns="columns" :data-source="questions" :loading="loading" :pagination="pagination" row-key="id" size="middle" @change="handleTableChange">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'question'">
              <div class="q-cell">
                <div class="q-text">{{ record.question }}</div>
                <div class="q-meta">
                  <a-tag v-if="record.company" size="small" color="purple">{{ record.company }}</a-tag>
                  <a-tag v-for="t in (record.tags || []).slice(0, 2)" :key="t" size="small">{{ t }}</a-tag>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'questionType'">
              <a-tag :color="typeColors[record.questionType] || 'default'" size="small">{{ typeLabels[record.questionType] || '开放题' }}</a-tag>
            </template>
            <template v-if="column.key === 'difficulty'">
              <a-tag :color="diffColor(record.difficulty)" size="small">{{ diffLabel(record.difficulty) }}</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" size="small" @click="showDetail(record)">查看</a-button>
              <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 投稿审核面板 -->
    <div v-show="manageTab === 'review'">
      <a-table :columns="reviewColumns" :data-source="pendingQuestions" :loading="pendingLoading" :pagination="pendingPagination" row-key="id" size="middle" @change="handlePendingTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'question'">
            <div class="q-cell">
              <div class="q-text">{{ record.question }}</div>
              <div v-if="record.referenceAnswer" class="q-meta" style="color: #999; font-size: 12px; margin-top: 2px">参考答案：{{ record.referenceAnswer.slice(0, 60) }}{{ record.referenceAnswer.length > 60 ? '...' : '' }}</div>
            </div>
          </template>
          <template v-if="column.key === 'difficulty'">
            <a-tag :color="diffColor(record.difficulty)" size="small">{{ diffLabel(record.difficulty) }}</a-tag>
          </template>
          <template v-if="column.key === 'submitter'">
            <span style="font-size: 12px; color: #666">用户#{{ record.userId || '未知' }}</span>
          </template>
          <template v-if="column.key === 'createdAt'">
            <span style="font-size: 12px; color: #999">{{ record.createdAt?.slice(0, 10) }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" style="color: #52c41a" @click="handleReview(record.id, 'approved')">采纳</a-button>
              <a-popconfirm title="驳回原因（可选）" @confirm="handleReview(record.id, 'rejected', rejectReason)" ok-text="驳回" cancel-text="取消">
                <template #description>
                  <a-input v-model:value="rejectReason" placeholder="输入驳回原因" style="width: 220px; margin-top: 8px" />
                </template>
                <a-button type="link" size="small" danger>驳回</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 分类管理弹窗 -->
    <a-modal v-model:open="showCategoryModal" title="分类管理" :footer="null" width="650px">
      <div style="margin-bottom: 12px"><a-button type="primary" size="small" @click="openCatForm()"><PlusOutlined /> 新增分类</a-button></div>
      <a-table :columns="catColumns" :data-source="catFlatList" :pagination="false" row-key="id" size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span :style="{ paddingLeft: record.parentId ? '20px' : '0' }">
              <template v-if="record.coverImage"><a-avatar :src="record.coverImage" :size="22" shape="square" style="margin-right: 6px" /></template>
              <strong v-if="!record.parentId">{{ record.name }}</strong>
              <span v-else style="color: #666">└ {{ record.name }}</span>
            </span>
          </template>
          <template v-if="column.key === 'cover'">
            <a-upload :show-upload-list="false" :before-upload="(f: File) => { uploadCover(record.id, f); return false }">
              <a-button size="small" type="link">{{ record.coverImage ? '更换' : '上传' }}</a-button>
            </a-upload>
          </template>
          <template v-if="column.key === 'action'">
            <a-button v-if="!record.parentId" type="link" size="small" @click="openCatForm(record.id)">+ 子分类</a-button>
            <a-button type="link" size="small" @click="editCat(record)">编辑</a-button>
            <a-popconfirm title="确定删除？" @confirm="deleteCat(record.id)"><a-button type="link" size="small" danger>删除</a-button></a-popconfirm>
          </template>
        </template>
      </a-table>
      <a-modal v-model:open="catFormVisible" :title="catEditId ? '编辑分类' : '新增分类'" ok-text="保存" @ok="submitCat" width="400px">
        <a-form layout="vertical">
          <a-form-item label="名称" required><a-input v-model:value="catForm.name" /></a-form-item>
          <a-form-item label="类型"><a-input v-model:value="catForm.type" placeholder="type / company" /></a-form-item>
          <a-form-item label="描述"><a-input v-model:value="catForm.description" /></a-form-item>
          <a-form-item label="排序"><a-input-number v-model:value="catForm.sort" :min="0" /></a-form-item>
        </a-form>
      </a-modal>
    </a-modal>

    <!-- 新建/编辑题目弹窗 -->
    <a-modal v-model:open="formVisible" :title="editingId ? '编辑题目' : '新增题目'" ok-text="保存" @ok="handleFormSubmit" :confirm-loading="formLoading" width="700px" :destroy-on-close="true">
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8"><a-form-item label="题型"><a-select v-model:value="formData.questionType" @change="onTypeChange"><a-select-option value="open">开放题</a-select-option><a-select-option value="choice">选择题</a-select-option><a-select-option value="judgment">判断题</a-select-option><a-select-option value="short_answer">简答题</a-select-option></a-select></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="难度"><a-select v-model:value="formData.difficulty"><a-select-option value="easy">简单</a-select-option><a-select-option value="medium">中等</a-select-option><a-select-option value="hard">困难</a-select-option></a-select></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="分类"><a-tree-select v-model:value="formData.categoryId" :tree-data="categoryTree" placeholder="选择" allow-clear :field-names="{ children: 'children', label: 'title', value: 'value' }" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="题目内容" required><a-textarea v-model:value="formData.question" :rows="3" placeholder="请输入面试题目" /></a-form-item>
        <template v-if="formData.questionType === 'choice'">
          <a-form-item label="选项">
            <div v-for="(opt, idx) in formData.options" :key="idx" style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center">
              <a-input v-model:value="opt.label" style="width: 50px" /><a-input v-model:value="opt.value" style="flex: 1" placeholder="选项内容" /><a-checkbox v-model:checked="opt.isCorrect">正确</a-checkbox><a-button size="small" type="text" danger @click="formData.options.splice(idx, 1)">删</a-button>
            </div>
            <a-button size="small" type="dashed" block @click="formData.options.push({ label: String.fromCharCode(65 + formData.options.length), value: '' })">+ 添加选项</a-button>
          </a-form-item>
        </template>
        <template v-if="formData.questionType === 'judgment'"><a-form-item label="正确答案"><a-radio-group v-model:value="judgmentAnswer"><a-radio value="true">正确</a-radio><a-radio value="false">错误</a-radio></a-radio-group></a-form-item></template>
        <a-form-item label="参考答案 / 解析"><a-textarea v-model:value="formData.referenceAnswer" :rows="3" placeholder="参考答案或解析" /></a-form-item>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="公司"><a-input v-model:value="formData.company" placeholder="如：字节跳动" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="标签"><a-select v-model:value="formData.tags" mode="tags" placeholder="输入后回车" /></a-form-item></a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 详情弹窗 -->
    <a-modal v-model:open="detailVisible" title="题目详情" :footer="null" width="600px">
      <template v-if="currentQuestion">
        <a-space style="margin-bottom: 8px">
          <a-tag :color="typeColors[currentQuestion.questionType] || 'default'">{{ typeLabels[currentQuestion.questionType] || '开放题' }}</a-tag>
          <a-tag :color="diffColor(currentQuestion.difficulty)">{{ diffLabel(currentQuestion.difficulty) }}</a-tag>
          <a-tag v-if="currentQuestion.company" color="purple">{{ currentQuestion.company }}</a-tag>
        </a-space>
        <h3 style="margin: 8px 0 12px">{{ currentQuestion.question }}</h3>
        <div v-if="currentQuestion.options?.length" style="margin-bottom: 12px; padding: 12px; background: #fafafa; border-radius: 8px">
          <div v-for="opt in currentQuestion.options" :key="opt.label" style="padding: 4px 0; display: flex; align-items: center; gap: 8px">
            <a-tag :color="opt.isCorrect ? 'green' : 'default'">{{ opt.label }}</a-tag>
            <span :style="{ fontWeight: opt.isCorrect ? '600' : 'normal' }">{{ opt.value }}</span>
            <CheckCircleFilled v-if="opt.isCorrect" style="color: #52c41a" />
          </div>
        </div>
        <div v-if="currentQuestion.referenceAnswer" style="padding: 12px; background: #f6ffed; border-radius: 8px; border: 1px solid #d9f7be">
          <strong style="color: #389e0d">参考答案</strong>
          <p style="white-space: pre-wrap; color: #333; margin: 8px 0 0">{{ currentQuestion.referenceAnswer }}</p>
        </div>
        <div style="margin-top: 12px">
          <a-tag v-for="t in (currentQuestion.tags || [])" :key="t" size="small">{{ t }}</a-tag>
          <span style="float: right; color: #999; font-size: 12px">使用 {{ currentQuestion.frequency }} 次</span>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined, SettingOutlined, FolderOutlined, FolderOpenOutlined,
  FileTextOutlined, DownOutlined, CheckCircleFilled,
} from '@ant-design/icons-vue'
import {
  getQuestionsApi, createQuestionApi, updateQuestionApi, deleteQuestionApi,
  getInterviewCategoriesApi, createInterviewCategoryApi, updateInterviewCategoryApi,
  deleteInterviewCategoryApi, uploadCategoryCoverApi, getQuestionTypeStatsApi,
  getPendingQuestionsApi, reviewQuestionApi,
} from '@/api/interview'

const loading = ref(false)
const questions = ref<any[]>([])
const categories = ref<any[]>([])
const categoryTree = ref<any[]>([])
const expandedKeys = reactive(new Set<number>())
const selectedCategoryId = ref<number | undefined>(undefined)
const pagination = reactive({ current: 1, pageSize: 15, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })
const filters = reactive({ keyword: '', categoryId: undefined as number | undefined, difficulty: undefined as string | undefined, questionType: undefined as string | undefined })

const typeStatsMap = reactive<Record<string, number>>({ open: 0, choice: 0, judgment: 0, short_answer: 0 })
const typeLabels: Record<string, string> = { open: '开放题', choice: '选择题', judgment: '判断题', short_answer: '简答题' }
const typeColors: Record<string, string> = { open: 'default', choice: 'blue', judgment: 'orange', short_answer: 'green' }
function diffLabel(d: string) { return { easy: '简单', medium: '中等', hard: '困难' }[d] || d }
function diffColor(d: string) { return { easy: 'green', medium: 'orange', hard: 'red' }[d] || 'default' }
function chipColor(t: string) { return { open: '#8c8c8c', choice: '#1677ff', judgment: '#fa8c16', short_answer: '#52c41a' }[t] || '#8c8c8c' }

const typeStatsCards = computed(() => [
  { type: 'open', label: '开放', count: typeStatsMap.open },
  { type: 'choice', label: '选择', count: typeStatsMap.choice },
  { type: 'judgment', label: '判断', count: typeStatsMap.judgment },
  { type: 'short_answer', label: '简答', count: typeStatsMap.short_answer },
])

const questionTypes = [
  { type: 'open', label: '开放题' },
  { type: 'choice', label: '选择题' },
  { type: 'judgment', label: '判断题' },
  { type: 'short_answer', label: '简答题' },
]

function toggleExpand(id: number, alsoSelect = false) {
  if (expandedKeys.has(id)) expandedKeys.delete(id)
  else expandedKeys.add(id)
  if (alsoSelect) selectCategory(id)
}
function selectCategory(id: number | undefined) {
  selectedCategoryId.value = id; filters.categoryId = id; filters.questionType = undefined; handleSearch()
}
function selectCategoryType(catId: number, qType: string) {
  selectedCategoryId.value = catId; filters.categoryId = catId
  filters.questionType = filters.questionType === qType ? undefined : qType
  handleSearch()
}
function toggleType(type: string) {
  filters.questionType = filters.questionType === type ? undefined : type; handleSearch()
}

const columns = [
  { title: '题目', key: 'question', ellipsis: true },
  { title: '题型', key: 'questionType', width: 75 },
  { title: '难度', key: 'difficulty', width: 65 },
  { title: '操作', key: 'action', width: 140 },
]

const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = reactive({ question: '', referenceAnswer: '', categoryId: undefined as number | undefined, company: '', difficulty: 'medium', questionType: 'open', tags: [] as string[], options: [] as { label: string; value: string; isCorrect?: boolean }[] })
const judgmentAnswer = ref('true')
const detailVisible = ref(false)
const currentQuestion = ref<any>(null)

async function fetchQuestions() {
  loading.value = true
  try {
    const res = await getQuestionsApi({ page: pagination.current, pageSize: pagination.pageSize, ...filters })
    questions.value = res.data?.list || []; pagination.total = res.data?.total || 0
  } catch { message.error('获取题目失败') }
  finally { loading.value = false }
}
async function fetchTypeStats() { try { const r: any = await getQuestionTypeStatsApi(); Object.assign(typeStatsMap, r.data || {}) } catch {} }
function buildTreeData(list: any[]): any[] { return list.map((c: any) => ({ title: `${c.name} (${c.questionCount || 0})`, value: c.id, children: c.children?.length ? buildTreeData(c.children) : undefined })) }
async function fetchCategories() { try { const r = await getInterviewCategoriesApi(); categories.value = r.data || []; categoryTree.value = buildTreeData(categories.value) } catch {} }

function handleSearch() { pagination.current = 1; fetchQuestions() }
function handleTableChange(pag: any) { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchQuestions() }

function onTypeChange() {
  if (formData.questionType === 'judgment') formData.options = [{ label: '正确', value: 'true', isCorrect: true }, { label: '错误', value: 'false', isCorrect: false }]
  else if (formData.questionType === 'choice' && !formData.options.length) formData.options = [{ label: 'A', value: '' }, { label: 'B', value: '' }, { label: 'C', value: '' }, { label: 'D', value: '' }]
}
function openCreateModal() { editingId.value = null; Object.assign(formData, { question: '', referenceAnswer: '', categoryId: selectedCategoryId.value, company: '', difficulty: 'medium', questionType: 'open', tags: [], options: [] }); judgmentAnswer.value = 'true'; formVisible.value = true }
function openEditModal(r: any) { editingId.value = r.id; Object.assign(formData, { question: r.question, referenceAnswer: r.referenceAnswer || '', categoryId: r.categoryId, company: r.company || '', difficulty: r.difficulty, questionType: r.questionType || 'open', tags: r.tags || [], options: r.options || [] }); if (r.questionType === 'judgment') { const c = (r.options || []).find((o: any) => o.isCorrect); judgmentAnswer.value = c?.value || 'true' }; formVisible.value = true }

async function handleFormSubmit() {
  if (!formData.question.trim()) return message.warning('请输入题目')
  const p = { ...formData }
  if (p.questionType === 'judgment') p.options = [{ label: '正确', value: 'true', isCorrect: judgmentAnswer.value === 'true' }, { label: '错误', value: 'false', isCorrect: judgmentAnswer.value === 'false' }]
  if (p.questionType === 'open' || p.questionType === 'short_answer') p.options = []
  formLoading.value = true
  try { if (editingId.value) { await updateQuestionApi(editingId.value, p); message.success('已更新') } else { await createQuestionApi(p); message.success('已创建') }; formVisible.value = false; fetchQuestions(); fetchTypeStats(); fetchCategories() }
  catch { message.error('操作失败') } finally { formLoading.value = false }
}
async function handleDelete(id: number) { try { await deleteQuestionApi(id); message.success('已删除'); fetchQuestions(); fetchTypeStats(); fetchCategories() } catch { message.error('删除失败') } }
function showDetail(r: any) { currentQuestion.value = r; detailVisible.value = true }

// ==================== Category ====================
const showCategoryModal = ref(false)
const catFormVisible = ref(false)
const catEditId = ref<number | null>(null)
const catParentId = ref<number | undefined>(undefined)
const catForm = reactive({ name: '', type: '', description: '', sort: 0 })
const catColumns = [{ title: '名称', key: 'name' }, { title: '图标', key: 'cover', width: 60 }, { title: '题数', dataIndex: 'questionCount', width: 50 }, { title: '操作', key: 'action', width: 180 }]
const catFlatList = computed(() => { const r: any[] = []; for (const c of categories.value) { r.push(c); if (c.children?.length) for (const ch of c.children) r.push(ch) }; return r })

function openCatForm(parentId?: number) { catEditId.value = null; catParentId.value = parentId; Object.assign(catForm, { name: '', type: '', description: '', sort: 0 }); catFormVisible.value = true }
function editCat(r: any) { catEditId.value = r.id; catParentId.value = r.parentId; Object.assign(catForm, { name: r.name, type: r.type || '', description: r.description || '', sort: r.sort || 0 }); catFormVisible.value = true }
async function submitCat() { if (!catForm.name.trim()) return message.warning('请输入名称'); try { const d = { ...catForm, parentId: catParentId.value }; if (catEditId.value) { await updateInterviewCategoryApi(catEditId.value, d); message.success('已更新') } else { await createInterviewCategoryApi(d); message.success('已创建') }; catFormVisible.value = false; fetchCategories() } catch { message.error('操作失败') } }
async function deleteCat(id: number) { try { await deleteInterviewCategoryApi(id); message.success('已删除'); fetchCategories() } catch { message.error('删除失败') } }

async function uploadCover(catId: number, file: File) {
  const fd = new FormData(); fd.append('file', file)
  try {
    const r: any = await uploadCategoryCoverApi(fd)
    if (r.data?.url) {
      await updateInterviewCategoryApi(catId, { coverImage: r.data.url })
      message.success('图标已更新'); fetchCategories()
    }
  } catch { message.error('上传失败') }
}

// ==================== 投稿审核 ====================
const manageTab = ref('bank')
const pendingQuestions = ref<any[]>([])
const pendingLoading = ref(false)
const pendingTotal = ref(0)
const pendingPagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: false, showTotal: (t: number) => `共 ${t} 条` })
const rejectReason = ref('')
const reviewColumns = [
  { title: '题目', key: 'question', ellipsis: true },
  { title: '难度', key: 'difficulty', width: 70 },
  { title: '投稿者', key: 'submitter', width: 100 },
  { title: '提交时间', key: 'createdAt', width: 100 },
  { title: '操作', key: 'action', width: 150 },
]

async function fetchPendingQuestions() {
  pendingLoading.value = true
  try {
    const res: any = await getPendingQuestionsApi({ page: pendingPagination.current, pageSize: pendingPagination.pageSize })
    pendingQuestions.value = res.data?.list || []
    pendingTotal.value = res.data?.total || 0
    pendingPagination.total = pendingTotal.value
  } catch { message.error('获取投稿列表失败') }
  finally { pendingLoading.value = false }
}

function handlePendingTableChange(pag: any) { pendingPagination.current = pag.current; fetchPendingQuestions() }

async function handleReview(id: number, status: string, reason?: string) {
  try {
    await reviewQuestionApi(id, { status, rejectReason: reason || undefined })
    message.success(status === 'approved' ? '已采纳，题目已加入题库' : '已驳回')
    rejectReason.value = ''
    fetchPendingQuestions()
    if (status === 'approved') { fetchQuestions(); fetchTypeStats(); fetchCategories() }
  } catch { message.error('审核操作失败') }
}

function onManageTabChange(key: string) {
  if (key === 'review') fetchPendingQuestions()
}

onMounted(() => { fetchQuestions(); fetchCategories(); fetchTypeStats(); fetchPendingQuestions() })
</script>

<style scoped>
.content-layout { display: flex; gap: 16px; }

.sidebar { width: 240px; flex-shrink: 0; background: #fff; border-radius: 10px; border: 1px solid #f0f0f0; overflow-y: auto; max-height: calc(100vh - 200px); }
.sidebar-header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 14px; border-bottom: 1px solid #f0f0f0; background: #fafafa; border-radius: 10px 10px 0 0; }

.tree-item { padding: 9px 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s; font-size: 13px; color: #333; }
.tree-item.root { font-weight: 500; }
.tree-item.child { padding-left: 36px; font-weight: 400; color: #555; }
.tree-item:hover { background: #f5f5f5; }
.tree-item.active { background: #e6f4ff; color: #1677ff; }
.tree-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tree-badge { font-size: 11px; color: #bbb; background: #f5f5f5; padding: 1px 7px; border-radius: 10px; }
.tree-item.active .tree-badge { background: #bae0ff; color: #1677ff; }
.tree-arrow { font-size: 10px; color: #bbb; transition: transform 0.2s; }
.tree-arrow.small { font-size: 9px; }
.tree-arrow.open { transform: rotate(0); }
.tree-arrow:not(.open) { transform: rotate(-90deg); }

.tree-item.type-item { padding-left: 52px; font-size: 12px; color: #888; }
.tree-item.type-item.active { color: #1677ff; background: #e6f4ff; }
.type-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.main-content { flex: 1; min-width: 0; }

.type-group-bar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.type-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; background: #fafafa; border: 1px solid #f0f0f0; transition: all 0.2s; color: #666; }
.type-chip:hover { border-color: #d9d9d9; }
.type-chip.active { background: #e6f4ff; border-color: #91caff; color: #1677ff; }
.type-chip-dot { width: 8px; height: 8px; border-radius: 50%; }
.type-chip strong { font-weight: 600; color: #333; }

.filter-bar { display: flex; gap: 8px; margin-bottom: 12px; }

.q-cell { line-height: 1.5; }
.q-text { font-size: 13px; color: #333; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-bottom: 4px; }
.q-meta { display: flex; gap: 4px; flex-wrap: wrap; }
</style>
