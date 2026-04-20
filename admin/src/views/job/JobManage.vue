<template>
  <div class="job-manage">
    <a-page-header :title="$t('职位管理')" :sub-title="$t('共 {count} 个职位', { count: stats.total || pagination.total })">
      <template #extra>
        <a-button type="primary" @click="openCreateModal">
          <PlusOutlined /> 新增职位
        </a-button>
      </template>
    </a-page-header>

    <!-- 统计卡片 -->
    <a-row :gutter="12" class="stats-row">
      <a-col :span="8">
        <a-card size="small">
          <a-statistic title="总职位数" :value="stats.total" :value-style="{ fontSize: '20px', color: '#1677ff' }" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small">
          <a-statistic title="招聘中" :value="stats.open" :value-style="{ fontSize: '20px', color: '#52c41a' }" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small">
          <a-statistic title="已关闭" :value="stats.closed" :value-style="{ fontSize: '20px', color: '#999' }" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <a-space wrap>
        <a-input-search
          v-model:value="keyword"
          placeholder="搜索职位/公司"
          style="width: 220px"
          allow-clear
          @search="handleSearch"
        />
        <a-select v-model:value="statusFilter" placeholder="状态筛选" style="width: 120px" allow-clear @change="handleSearch">
          <a-select-option value="open">招聘中</a-select-option>
          <a-select-option value="closed">已关闭</a-select-option>
          <a-select-option value="paused">已暂停</a-select-option>
        </a-select>
        <a-radio-group v-model:value="viewMode" button-style="solid" size="middle" class="view-toggle">
          <a-radio-button value="list" title="列表视图">
            <UnorderedListOutlined />
          </a-radio-button>
          <a-radio-button value="card" title="卡片视图">
            <AppstoreOutlined />
          </a-radio-button>
        </a-radio-group>
      </a-space>
    </div>

    <!-- 列表表格 -->
    <a-table
      v-show="viewMode === 'list'"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      size="middle"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'salary'">
          {{ formatSalary(record.salaryMin, record.salaryMax) }}
        </template>
        <template v-if="column.key === 'workType'">
          {{ workTypeLabel(record.workType) }}
        </template>
        <template v-if="column.key === 'status'">
          <a-dropdown>
            <a-tag :color="statusColor(record.status)" style="cursor: pointer">
              {{ statusLabel(record.status) }}
              <DownOutlined style="margin-left: 4px; font-size: 10px" />
            </a-tag>
            <template #overlay>
              <a-menu @click="(info: any) => handleStatusChange(record.id, info.key)">
                <a-menu-item v-for="s in statusOptions" :key="s.value" :disabled="s.value === record.status">
                  {{ s.label }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-popconfirm :title="$t('确定删除此职位？')" :ok-text="$t('删除')" :cancel-text="$t('取消')" :ok-button-props="{ danger: true }" @confirm="handleDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 卡片视图 -->
    <a-spin v-show="viewMode === 'card'" :spinning="loading">
      <div v-if="viewMode === 'card' && list.length === 0 && !loading" class="job-card-empty">
        <a-empty description="暂无职位数据" />
      </div>
      <a-row v-else-if="viewMode === 'card'" :gutter="[16, 16]" class="job-card-grid">
        <a-col v-for="record in list" :key="record.id" :xs="24" :sm="12" :lg="8" :xl="8">
          <a-card class="job-manage-card" :bordered="false" :hoverable="true">
            <div class="job-card-head">
              <div class="job-card-titles">
                <div class="job-card-title-line">
                  <span class="job-title-text">{{ record.title }}</span>
                </div>
                <div class="job-company">{{ record.companyName || '-' }}</div>
                <div class="job-salary">{{ formatSalary(record.salaryMin, record.salaryMax) }}</div>
              </div>
              <a-dropdown>
                <a-tag :color="statusColor(record.status)" class="job-status-tag" style="cursor: pointer">
                  {{ statusLabel(record.status) }}
                  <DownOutlined style="margin-left: 4px; font-size: 10px" />
                </a-tag>
                <template #overlay>
                  <a-menu @click="(info: any) => handleStatusChange(record.id, info.key)">
                    <a-menu-item v-for="s in statusOptions" :key="s.value" :disabled="s.value === record.status">
                      {{ s.label }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div class="job-card-badges">
              <a-tag v-if="record.location" color="default">{{ record.location }}</a-tag>
              <a-tag color="processing">{{ workTypeLabel(record.workType) }}</a-tag>
            </div>
            <div class="job-card-footer">
              <span class="job-card-time">{{ formatTime(record.createdAt) }}</span>
              <a-space :size="4">
                <a-button type="link" size="small" class="job-card-action" @click="openEditModal(record)">编辑</a-button>
                <a-popconfirm :title="$t('确定删除此职位？')" :ok-text="$t('删除')" :cancel-text="$t('取消')" :ok-button-props="{ danger: true }" @confirm="handleDelete(record.id)">
                  <a-button type="link" size="small" danger class="job-card-action">删除</a-button>
                </a-popconfirm>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>

    <div v-if="viewMode === 'card' && pagination.total > 0" class="job-card-pagination">
      <a-pagination
        v-model:current="pagination.current"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :show-total="pagination.showTotal"
        show-size-changer
        :page-size-options="['10', '20', '50']"
        @change="handleCardPageChange"
        @showSizeChange="handleCardSizeChange"
      />
    </div>

    <!-- 新建/编辑弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="editingId ? '编辑职位' : '新增职位'"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="formLoading"
      @ok="handleFormSubmit"
      width="720px"
      :destroy-on-close="true"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="职位名称" required>
              <a-input v-model:value="formData.title" placeholder="如：后端开发工程师" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司名称">
              <a-input v-model:value="formData.companyName" placeholder="如：字节跳动" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="岗位类型">
              <a-input v-model:value="formData.positionType" placeholder="如：后端/前端/设计" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工作类型">
              <a-select v-model:value="formData.workType" placeholder="选择工作类型">
                <a-select-option v-for="w in workTypeOptions" :key="w.value" :value="w.value">{{ w.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="最低薪资(元/月)">
              <a-input-number v-model:value="formData.salaryMin" :min="0" placeholder="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="最高薪资(元/月)">
              <a-input-number v-model:value="formData.salaryMax" :min="0" placeholder="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="招聘人数">
              <a-input-number v-model:value="formData.headcount" :min="1" placeholder="1" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="工作地点">
              <a-input v-model:value="formData.location" placeholder="如：北京" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学历要求">
              <a-input v-model:value="formData.education" placeholder="如：本科及以上" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="截止日期">
              <a-input v-model:value="formData.deadline" type="date" placeholder="选择截止日期" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="职位状态">
              <a-select v-model:value="formData.status" placeholder="选择状态">
                <a-select-option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="岗位描述">
          <a-textarea v-model:value="formData.description" placeholder="岗位职责与工作内容" :rows="3" />
        </a-form-item>
        <a-form-item label="任职要求">
          <a-textarea v-model:value="formData.requirements" placeholder="任职资格与技能要求" :rows="3" />
        </a-form-item>
        <a-form-item label="福利待遇">
          <a-input v-model:value="formData.benefits" placeholder="如：五险一金、年终奖、弹性工作" />
        </a-form-item>
        <a-form-item label="标签">
          <a-select v-model:value="formData.tags" mode="tags" placeholder="输入后回车添加，如：Java、Spring" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DownOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import {
  getJobsAdminApi,
  createJobApi,
  updateJobAdminApi,
  deleteJobAdminApi,
  getJobStatsApi,
} from '@/api/job'

const loading = ref(false)
const list = ref<any[]>([])
const keyword = ref('')
const statusFilter = ref<string | undefined>(undefined)
const viewMode = ref<'list' | 'card'>('list')
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })

const stats = reactive({ total: 0, open: 0, closed: 0 })

const statusOptions = [
  { value: 'open', label: '招聘中' },
  { value: 'closed', label: '已关闭' },
  { value: 'paused', label: '已暂停' },
]

const workTypeOptions = [
  { value: 'full_time', label: '全职' },
  { value: 'part_time', label: '兼职' },
  { value: 'intern', label: '实习' },
]

function statusLabel(s: string) {
  return statusOptions.find((o) => o.value === s)?.label || s
}

function statusColor(s: string) {
  const map: Record<string, string> = { open: 'green', closed: 'default', paused: 'orange' }
  return map[s] || 'default'
}

function workTypeLabel(w: string) {
  return workTypeOptions.find((o) => o.value === w)?.label || w
}

function formatSalary(min?: number, max?: number) {
  if (min == null && max == null) return '-'
  if (min != null && max != null) return `${min}-${max}K`
  if (min != null) return `${min}K+`
  return `≤${max}K`
}

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '职位', dataIndex: 'title', width: 160, ellipsis: true },
  { title: '公司', dataIndex: 'companyName', width: 120, ellipsis: true },
  { title: '岗位类型', dataIndex: 'positionType', width: 90 },
  { title: '薪资范围', key: 'salary', width: 100 },
  { title: '地点', dataIndex: 'location', width: 100 },
  { title: '工作类型', key: 'workType', width: 80 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', key: 'createdAt', width: 150 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = reactive({
  title: '',
  description: '',
  requirements: '',
  positionType: '',
  salaryMin: undefined as number | undefined,
  salaryMax: undefined as number | undefined,
  location: '',
  workType: 'full_time',
  headcount: 1,
  deadline: undefined as string | undefined,
  tags: [] as string[],
  companyName: '',
  education: '',
  benefits: '',
  status: 'open',
})

async function fetchList() {
  loading.value = true
  try {
    const res = await getJobsAdminApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: keyword.value || undefined,
      status: statusFilter.value,
    })
    list.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch {
    message.error('获取职位列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const res = await getJobStatsApi()
    const d = res.data || {}
    stats.total = d.total || 0
    stats.open = d.open || 0
    stats.closed = d.closed || 0
  } catch {
    /* ignore */
  }
}

function handleSearch() {
  pagination.current = 1
  fetchList()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchList()
}

function handleCardPageChange(page: number) {
  pagination.current = page
  fetchList()
}

function handleCardSizeChange(_page: number, size: number) {
  pagination.current = 1
  pagination.pageSize = size
  fetchList()
}

function openCreateModal() {
  editingId.value = null
  Object.assign(formData, {
    title: '',
    description: '',
    requirements: '',
    positionType: '',
    salaryMin: undefined,
    salaryMax: undefined,
    location: '',
    workType: 'full_time',
    headcount: 1,
    deadline: undefined,
    tags: [],
    companyName: '',
    education: '',
    benefits: '',
    status: 'open',
  })
  formVisible.value = true
}

function openEditModal(record: any) {
  editingId.value = record.id
  Object.assign(formData, {
    title: record.title,
    description: record.description || '',
    requirements: record.requirements || '',
    positionType: record.positionType || '',
    salaryMin: record.salaryMin,
    salaryMax: record.salaryMax,
    location: record.location || '',
    workType: record.workType || 'full_time',
    headcount: record.headcount ?? 1,
    deadline: record.deadline ? (typeof record.deadline === 'string' ? record.deadline.split('T')[0] : new Date(record.deadline).toISOString().split('T')[0]) : undefined,
    tags: Array.isArray(record.tags) ? [...record.tags] : (record.tags ? String(record.tags).split(',') : []),
    companyName: record.companyName || '',
    education: record.education || '',
    benefits: record.benefits || '',
    status: record.status || 'open',
  })
  formVisible.value = true
}

async function handleFormSubmit() {
  if (!formData.title.trim()) return message.warning('职位名称必填')
  formLoading.value = true
  try {
    const payload: Record<string, any> = {
      title: formData.title.trim(),
      description: formData.description || undefined,
      requirements: formData.requirements || undefined,
      positionType: formData.positionType || undefined,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      location: formData.location || undefined,
      workType: formData.workType,
      headcount: formData.headcount,
      deadline: formData.deadline || undefined,
      tags: formData.tags?.length ? formData.tags : undefined,
      companyName: formData.companyName || undefined,
      education: formData.education || undefined,
      benefits: formData.benefits || undefined,
    }
    if (editingId.value) {
      payload.status = formData.status
      await updateJobAdminApi(editingId.value, payload)
      message.success('已更新')
    } else {
      await createJobApi(payload)
      message.success('已创建')
    }
    formVisible.value = false
    fetchList()
    fetchStats()
  } catch {
    message.error('操作失败')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete(id: number) {
  try {
    await deleteJobAdminApi(id)
    message.success('已删除')
    fetchList()
    fetchStats()
  } catch {
    message.error('删除失败')
  }
}

async function handleStatusChange(id: number, status: string) {
  try {
    await updateJobAdminApi(id, { status })
    message.success('状态已更新')
    fetchList()
    fetchStats()
  } catch {
    message.error('操作失败')
  }
}

onMounted(() => {
  fetchList()
  fetchStats()
})
</script>

<style scoped>
.job-manage .stats-row {
  margin-bottom: 16px;
}

.job-manage .toolbar {
  margin-bottom: 16px;
}

.view-toggle :deep(.ant-radio-button-wrapper) {
  padding-inline: 12px;
}

.job-card-grid {
  margin-bottom: 8px;
}

.job-card-empty {
  padding: 48px 0;
}

.job-manage-card {
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.25s ease, transform 0.2s ease;
  height: 100%;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  :deep(.ant-card-body) {
    padding: 16px 18px;
  }
}

.job-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.job-card-titles {
  min-width: 0;
  flex: 1;
}

.job-card-title-line {
  margin-bottom: 4px;
}

.job-title-text {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-company {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-salary {
  font-size: 15px;
  font-weight: 600;
  color: #52c41a;
}

.job-status-tag {
  margin: 0;
  flex-shrink: 0;
}

.job-card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.job-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.job-card-time {
  font-size: 12px;
  color: #bfbfbf;
}

.job-card-action {
  padding: 0 4px;
}

.job-card-pagination {
  text-align: right;
  margin-top: 16px;
}
</style>
