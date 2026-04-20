<template>
  <div class="app-manage">
    <a-page-header title="投递追踪" sub-title="管理职位投递与面试进度">
      <template #extra>
        <a-button type="primary" @click="openCreateModal">
          <PlusOutlined /> 新增投递
        </a-button>
      </template>
    </a-page-header>

    <!-- 统计卡片 -->
    <a-row :gutter="12" style="margin-bottom: 16px">
      <a-col :span="4" v-for="stat in statCards" :key="stat.label">
        <a-card size="small">
          <a-statistic :title="stat.label" :value="stat.value" :value-style="{ fontSize: '20px', color: stat.color }" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <a-space>
        <a-input-search
          v-model:value="filters.keyword"
          placeholder="搜索公司/岗位"
          style="width: 220px"
          allow-clear
          @search="handleSearch"
        />
        <a-select v-model:value="filters.status" placeholder="流程状态" style="width: 130px" allow-clear @change="handleSearch">
          <a-select-option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</a-select-option>
        </a-select>
        <a-select v-model:value="filters.tag" placeholder="状态标签" style="width: 120px" allow-clear @change="handleSearch">
          <a-select-option v-for="t in tagOptions" :key="t.value" :value="t.value">{{ t.label }}</a-select-option>
        </a-select>
      </a-space>
    </div>

    <!-- 列表表格 -->
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      size="middle"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'user'">
          <div style="display: flex; align-items: center; gap: 6px">
            <a-avatar v-if="record.user?.avatar" :src="record.user.avatar" :size="28" />
            <a-avatar v-else :size="28" style="background: #1677ff; font-size: 12px">{{ (record.user?.nickname || record.user?.username || '?').charAt(0) }}</a-avatar>
            <span style="font-size: 13px">{{ record.user?.nickname || record.user?.username || '-' }}</span>
          </div>
        </template>
        <template v-if="column.key === 'company'">
          <strong>{{ record.company }}</strong>
          <div style="font-size: 12px; color: #999">{{ record.position }}</div>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'tag'">
          <a-tag :color="tagColor(record.tag)">{{ tagLabel(record.tag) }}</a-tag>
        </template>
        <template v-if="column.key === 'nextDate'">
          {{ record.nextDate || '-' }}
        </template>
        <template v-if="column.key === 'updatedAt'">
          {{ formatTime(record.updatedAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
            <a-dropdown>
              <a-button type="link" size="small">状态</a-button>
              <template #overlay>
                <a-menu @click="(info: any) => handleStatusChange(record.id, info.key)">
                  <a-menu-item v-for="s in statusOptions" :key="s.value" :disabled="s.value === record.status">
                    {{ s.label }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新建/编辑弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="editingId ? '编辑投递' : '新增投递'"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="formLoading"
      @ok="handleFormSubmit"
      width="600px"
      :destroy-on-close="true"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户ID" :required="!editingId">
              <a-input-number v-model:value="formData.userId" :disabled="!!editingId" :min="1" style="width: 100%" placeholder="学生用户ID" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="公司名称" required>
              <a-input v-model:value="formData.company" placeholder="如：字节跳动" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="岗位名称" required>
              <a-input v-model:value="formData.position" placeholder="如：后端开发工程师" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="投递渠道">
              <a-input v-model:value="formData.channel" placeholder="官网/Boss/牛客" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="薪资范围">
              <a-input v-model:value="formData.salaryRange" placeholder="如：15-25K" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工作地点">
              <a-input v-model:value="formData.location" placeholder="如：北京" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="下次面试日期">
              <a-input v-model:value="formData.nextDate" type="date" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态标签">
              <a-select v-model:value="formData.tag" placeholder="选择标签">
                <a-select-option v-for="t in tagOptions" :key="t.value" :value="t.value">{{ t.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="备注">
          <a-textarea v-model:value="formData.remark" placeholder="补充信息" :rows="2" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="detailVisible"
      :title="`${currentApp?.company} - ${currentApp?.position}`"
      width="600"
      :destroy-on-close="true"
    >
      <template v-if="currentApp">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="公司">{{ currentApp.company }}</a-descriptions-item>
          <a-descriptions-item label="岗位">{{ currentApp.position }}</a-descriptions-item>
          <a-descriptions-item label="渠道">{{ currentApp.channel || '-' }}</a-descriptions-item>
          <a-descriptions-item label="薪资">{{ currentApp.salaryRange || '-' }}</a-descriptions-item>
          <a-descriptions-item label="地点">{{ currentApp.location || '-' }}</a-descriptions-item>
          <a-descriptions-item label="下次面试">{{ currentApp.nextDate || '-' }}</a-descriptions-item>
          <a-descriptions-item label="流程状态">
            <a-tag :color="statusColor(currentApp.status)">{{ statusLabel(currentApp.status) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="标签">
            <a-tag :color="tagColor(currentApp.tag)">{{ tagLabel(currentApp.tag) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">{{ currentApp.remark || '-' }}</a-descriptions-item>
        </a-descriptions>

        <!-- 时间线 -->
        <a-divider>状态变更时间线</a-divider>
        <a-timeline>
          <a-timeline-item
            v-for="log in statusLogs"
            :key="log.id"
            :color="statusColor(log.toStatus)"
          >
            <div><strong>{{ statusLabel(log.toStatus) }}</strong></div>
            <div v-if="log.note" style="color: #666">{{ log.note }}</div>
            <div style="font-size: 12px; color: #999">{{ formatTime(log.createdAt) }}</div>
          </a-timeline-item>
        </a-timeline>

        <!-- 备注列表 -->
        <a-divider>备注记录</a-divider>
        <div class="note-add">
          <a-space>
            <a-select v-model:value="noteType" style="width: 100px" size="small">
              <a-select-option value="interview">面试</a-select-option>
              <a-select-option value="company">公司</a-select-option>
              <a-select-option value="salary">薪资</a-select-option>
              <a-select-option value="other">其他</a-select-option>
            </a-select>
            <a-input v-model:value="noteContent" placeholder="添加备注" style="width: 320px" size="small" @press-enter="handleAddNote" />
            <a-button type="primary" size="small" @click="handleAddNote" :disabled="!noteContent.trim()">添加</a-button>
          </a-space>
        </div>
        <a-empty v-if="notes.length === 0" description="暂无备注" />
        <div v-for="note in notes" :key="note.id" class="note-item">
          <div class="note-header">
            <a-tag :color="noteTypeColor(note.type)" size="small">{{ noteTypeLabel(note.type) }}</a-tag>
            <span class="note-time">{{ formatTime(note.createdAt) }}</span>
            <a-popconfirm title="删除备注？" @confirm="handleDeleteNote(note.id)">
              <a-button type="link" size="small" danger><DeleteOutlined /></a-button>
            </a-popconfirm>
          </div>
          <div class="note-content">{{ note.content }}</div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {
  getApplicationsAdminApi, getApplicationDetailApi, createApplicationApi,
  updateApplicationApi, deleteApplicationApi, updateApplicationStatusApi,
  getApplicationNotesApi, addApplicationNoteApi,
  deleteApplicationNoteApi, getApplicationStatsApi,
} from '@/api/application'

const loading = ref(false)
const list = ref<any[]>([])
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })
const filters = reactive({ keyword: '', status: undefined as string | undefined, tag: undefined as string | undefined })

const statusOptions = [
  { value: 'pending', label: '待筛选' },
  { value: 'written_test', label: '笔试' },
  { value: 'first_interview', label: '一面' },
  { value: 'second_interview', label: '二面' },
  { value: 'hr_interview', label: 'HR面' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: '拒信' },
]

const tagOptions = [
  { value: 'in_progress', label: '进行中' },
  { value: 'passed', label: '已通过' },
  { value: 'failed', label: '已失败' },
  { value: 'abandoned', label: '已放弃' },
]

function statusLabel(s: string) { return statusOptions.find((o) => o.value === s)?.label || s }
function statusColor(s: string) {
  const map: Record<string, string> = { pending: 'default', written_test: 'blue', first_interview: 'cyan', second_interview: 'geekblue', hr_interview: 'purple', offer: 'green', rejected: 'red' }
  return map[s] || 'default'
}
function tagLabel(t: string) { return tagOptions.find((o) => o.value === t)?.label || t }
function tagColor(t: string) {
  const map: Record<string, string> = { in_progress: 'processing', passed: 'success', failed: 'error', abandoned: 'default' }
  return map[t] || 'default'
}

const noteTypeMap: Record<string, { label: string; color: string }> = {
  interview: { label: '面试', color: 'blue' },
  company: { label: '公司', color: 'green' },
  salary: { label: '薪资', color: 'gold' },
  other: { label: '其他', color: 'default' },
}
function noteTypeLabel(t: string) { return noteTypeMap[t]?.label || t }
function noteTypeColor(t: string) { return noteTypeMap[t]?.color || 'default' }

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const columns = [
  { title: '用户', key: 'user', width: 120 },
  { title: '公司/岗位', key: 'company', width: 200 },
  { title: '渠道', dataIndex: 'channel', width: 80 },
  { title: '薪资', dataIndex: 'salaryRange', width: 100 },
  { title: '流程', key: 'status', width: 90 },
  { title: '标签', key: 'tag', width: 80 },
  { title: '下次面试', key: 'nextDate', width: 110 },
  { title: '更新时间', key: 'updatedAt', width: 150 },
  { title: '操作', key: 'action', width: 220, fixed: 'right' as const },
]

// 统计
const statsData = ref<any>({})
const statCards = computed(() => {
  const d = statsData.value
  const byTag = (t: string) => d.byTag?.find((x: any) => x.tag === t)?.count || 0
  return [
    { label: '总投递', value: d.total || 0, color: '#1677ff' },
    { label: '进行中', value: byTag('in_progress'), color: '#1677ff' },
    { label: '已通过', value: byTag('passed'), color: '#52c41a' },
    { label: '已失败', value: byTag('failed'), color: '#ff4d4f' },
    { label: '已放弃', value: byTag('abandoned'), color: '#999' },
  ]
})

// 表单
const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = reactive({
  userId: undefined as number | undefined,
  company: '', position: '', channel: '', salaryRange: '',
  location: '', nextDate: '', remark: '', tag: 'in_progress',
})

// 详情
const detailVisible = ref(false)
const currentApp = ref<any>(null)
const statusLogs = ref<any[]>([])
const notes = ref<any[]>([])
const noteType = ref('other')
const noteContent = ref('')

async function fetchList() {
  loading.value = true
  try {
    const res = await getApplicationsAdminApi({
      page: pagination.current, pageSize: pagination.pageSize,
      keyword: filters.keyword || undefined, status: filters.status, tag: filters.tag,
    })
    list.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch { message.error('获取列表失败') }
  finally { loading.value = false }
}

async function fetchStats() {
  try {
    const res = await getApplicationStatsApi()
    statsData.value = res.data || {}
  } catch { /* ignore */ }
}

function handleSearch() { pagination.current = 1; fetchList() }
function handleTableChange(pag: any) { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

function openCreateModal() {
  editingId.value = null
  Object.assign(formData, { userId: undefined, company: '', position: '', channel: '', salaryRange: '', location: '', nextDate: '', remark: '', tag: 'in_progress' })
  formVisible.value = true
}

function openEditModal(record: any) {
  editingId.value = record.id
  Object.assign(formData, {
    userId: record.userId,
    company: record.company, position: record.position, channel: record.channel || '',
    salaryRange: record.salaryRange || '', location: record.location || '',
    nextDate: record.nextDate || '', remark: record.remark || '', tag: record.tag,
  })
  formVisible.value = true
}

async function handleFormSubmit() {
  if (!formData.company.trim() || !formData.position.trim()) return message.warning('公司和岗位必填')
  if (!editingId.value && !formData.userId) return message.warning('用户ID必填')
  formLoading.value = true
  try {
    const payload: Record<string, any> = {
      company: formData.company,
      position: formData.position,
      channel: formData.channel,
      salaryRange: formData.salaryRange,
      location: formData.location,
      nextDate: formData.nextDate || undefined,
      remark: formData.remark,
      tag: formData.tag,
    }
    if (editingId.value) {
      await updateApplicationApi(editingId.value, payload)
      message.success('已更新')
    } else {
      payload.userId = formData.userId
      await createApplicationApi(payload)
      message.success('已创建')
    }
    formVisible.value = false
    fetchList()
    fetchStats()
  } catch { message.error('操作失败') }
  finally { formLoading.value = false }
}

async function handleDelete(id: number) {
  try { await deleteApplicationApi(id); message.success('已删除'); fetchList(); fetchStats() }
  catch { message.error('删除失败') }
}

async function handleStatusChange(id: number, status: string) {
  try {
    await updateApplicationStatusApi(id, { status })
    message.success('状态已更新')
    fetchList()
    fetchStats()
  } catch { message.error('操作失败') }
}

async function showDetail(record: any) {
  detailVisible.value = true
  try {
    const res = await getApplicationDetailApi(record.id)
    currentApp.value = res.data
    statusLogs.value = res.data?.statusLogs || []
    notes.value = res.data?.notes || []
  } catch { message.error('获取详情失败') }
}

async function handleAddNote() {
  if (!noteContent.value.trim() || !currentApp.value) return
  try {
    await addApplicationNoteApi(currentApp.value.id, { type: noteType.value, content: noteContent.value })
    noteContent.value = ''
    const res = await getApplicationNotesApi(currentApp.value.id)
    notes.value = res.data || []
    message.success('备注已添加')
  } catch { message.error('添加失败') }
}

async function handleDeleteNote(noteId: number) {
  try {
    await deleteApplicationNoteApi(noteId)
    notes.value = notes.value.filter((n) => n.id !== noteId)
    message.success('已删除')
  } catch { message.error('删除失败') }
}

onMounted(() => { fetchList(); fetchStats() })
</script>

<style scoped lang="less">
.app-manage {
  .toolbar {
    margin-bottom: 16px;
  }
}

.note-add {
  margin-bottom: 12px;
}

.note-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }

  .note-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .note-time {
    font-size: 12px;
    color: #999;
    flex: 1;
  }
  .note-content {
    margin-top: 4px;
    color: #333;
    line-height: 1.6;
  }
}
</style>
