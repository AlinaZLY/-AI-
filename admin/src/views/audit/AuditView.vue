<template>
  <div>
    <a-page-header title="入驻审核" sub-title="企业/个体户入驻申请审核" />

    <a-row :gutter="12" style="margin-bottom: 16px">
      <a-col :span="8">
        <a-card size="small" @click="statusFilter = 'pending'; handleSearch()" style="cursor: pointer">
          <a-statistic title="待审核" :value="stats.pending" :value-style="{ color: '#faad14', fontSize: '24px' }" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" @click="statusFilter = 'approved'; handleSearch()" style="cursor: pointer">
          <a-statistic title="已通过" :value="stats.approved" :value-style="{ color: '#52c41a', fontSize: '24px' }" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" @click="statusFilter = 'rejected'; handleSearch()" style="cursor: pointer">
          <a-statistic title="已拒绝" :value="stats.rejected" :value-style="{ color: '#ff4d4f', fontSize: '24px' }" />
        </a-card>
      </a-col>
    </a-row>

    <div style="margin-bottom: 16px">
      <a-space>
        <a-input-search v-model:value="keyword" placeholder="搜索企业名称" style="width: 220px" allow-clear @search="handleSearch" />
        <a-select v-model:value="statusFilter" placeholder="状态" style="width: 120px" allow-clear @change="handleSearch">
          <a-select-option value="pending">待审核</a-select-option>
          <a-select-option value="approved">已通过</a-select-option>
          <a-select-option value="rejected">已拒绝</a-select-option>
        </a-select>
        <a-button @click="statusFilter = undefined; keyword = ''; handleSearch()">重置</a-button>
      </a-space>
    </div>

    <a-table
      row-key="id"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="false"
      :scroll="{ x: 980 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a-tag :color="record.type === 'individual' ? 'purple' : 'blue'" size="small">
            {{ record.type === 'individual' ? '个体工商户' : '企业' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'industry'">
          {{ record.industry || '-' }}
        </template>
        <template v-else-if="column.key === 'legalPerson'">
          {{ record.legalPerson || '-' }}
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
        </template>
        <template v-else-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="openDetail(record)">查看详情</a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <div style="text-align: right; margin-top: 16px" v-if="pagination.total > 0">
      <a-pagination v-model:current="pagination.current" :total="pagination.total" :page-size="pagination.pageSize" show-size-changer @change="fetchList" />
    </div>

    <a-modal
      v-model:open="detailVisible"
      title="入驻申请详情"
      width="800px"
      :footer="null"
      destroy-on-close
      @cancel="closeDetail"
    >
      <template v-if="detailRecord">
        <a-descriptions :column="1" bordered size="small" class="detail-desc">
          <a-descriptions-item label="企业名称">{{ detailRecord.name || '-' }}</a-descriptions-item>
          <a-descriptions-item label="类型">
            <a-tag :color="detailRecord.type === 'individual' ? 'purple' : 'blue'" size="small">
              {{ detailRecord.type === 'individual' ? '个体工商户' : '企业' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="法人/负责人">{{ detailRecord.legalPerson || '-' }}</a-descriptions-item>
          <a-descriptions-item label="统一社会信用代码">{{ detailRecord.creditCode || '-' }}</a-descriptions-item>
          <a-descriptions-item label="行业">{{ detailRecord.industry || '-' }}</a-descriptions-item>
          <a-descriptions-item label="城市">{{ detailRecord.city || '-' }}</a-descriptions-item>
          <a-descriptions-item label="简介">
            <div class="detail-description">{{ detailRecord.description || '-' }}</div>
          </a-descriptions-item>
          <a-descriptions-item v-if="detailRecord.user" label="申请人">
            {{ detailRecord.user.nickname || detailRecord.user.username }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="statusColor(detailRecord.status)">{{ statusLabel(detailRecord.status) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="提交时间">{{ formatTime(detailRecord.createdAt) }}</a-descriptions-item>
        </a-descriptions>

        <div v-if="detailRecord.rejectReason && detailRecord.status === 'rejected'" class="detail-reject-alert">
          <a-alert :message="'拒绝原因: ' + detailRecord.rejectReason" type="error" show-icon banner />
        </div>

        <a-divider orientation="left">认证材料</a-divider>
        <div class="cert-preview-row">
          <template v-if="detailRecord.businessLicense || detailRecord.idCardFront || detailRecord.idCardBack">
            <div v-if="detailRecord.businessLicense" class="cert-preview-item">
              <div class="cert-preview-label">营业执照</div>
              <template v-if="isPdfFile(detailRecord.businessLicense)">
                <a-button type="link" :href="detailRecord.businessLicense" target="_blank">查看 PDF</a-button>
              </template>
              <a-image v-else :width="120" :src="detailRecord.businessLicense" alt="营业执照" />
            </div>
            <div v-if="detailRecord.idCardFront" class="cert-preview-item">
              <div class="cert-preview-label">身份证正面</div>
              <template v-if="isPdfFile(detailRecord.idCardFront)">
                <a-button type="link" :href="detailRecord.idCardFront" target="_blank">查看 PDF</a-button>
              </template>
              <a-image v-else :width="120" :src="detailRecord.idCardFront" alt="身份证正面" />
            </div>
            <div v-if="detailRecord.idCardBack" class="cert-preview-item">
              <div class="cert-preview-label">身份证反面</div>
              <template v-if="isPdfFile(detailRecord.idCardBack)">
                <a-button type="link" :href="detailRecord.idCardBack" target="_blank">查看 PDF</a-button>
              </template>
              <a-image v-else :width="120" :src="detailRecord.idCardBack" alt="身份证反面" />
            </div>
          </template>
          <div v-else class="no-cert">未上传材料</div>
        </div>

        <div class="detail-footer-actions">
          <template v-if="detailRecord.status === 'pending'">
            <a-button type="primary" @click="handleApproveFromDetail">通过审核</a-button>
            <a-button danger @click="openRejectFromDetail">拒绝</a-button>
          </template>
          <template v-else>
            <a-button v-if="detailRecord.status === 'rejected'" type="primary" @click="handleApproveFromDetail">重新通过</a-button>
            <a-button v-if="detailRecord.status === 'approved'" @click="handleRevokeFromDetail">撤销认证</a-button>
          </template>
        </div>
      </template>
    </a-modal>

    <a-modal v-model:open="rejectVisible" title="拒绝原因" @ok="confirmReject" ok-text="确认拒绝" :ok-button-props="{ danger: true }">
      <a-textarea v-model:value="rejectReason" placeholder="请填写拒绝原因，将反馈给申请者" :rows="4" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { getCompaniesAdminApi, updateCompanyStatusApi, getCompanyStatsApi } from '@/api/company'

const loading = ref(false)
const list = ref<any[]>([])
const keyword = ref('')
const statusFilter = ref<string | undefined>('pending')
const pagination = reactive({ current: 1, pageSize: 10, total: 0 })
const stats = reactive({ pending: 0, approved: 0, rejected: 0 })
const rejectVisible = ref(false)
const rejectReason = ref('')
const rejectTargetId = ref(0)
const detailVisible = ref(false)
const detailRecord = ref<any | null>(null)

const columns: TableColumnType[] = [
  { title: '企业名称', dataIndex: 'name', key: 'name', ellipsis: true, width: 200 },
  { title: '类型', key: 'type', width: 120 },
  { title: '行业', key: 'industry', ellipsis: true, width: 140 },
  { title: '法人/负责人', key: 'legalPerson', ellipsis: true, width: 140 },
  { title: '状态', key: 'status', width: 100 },
  { title: '提交时间', key: 'createdAt', width: 180 },
  { title: '操作', key: 'actions', fixed: 'right', width: 120 },
]

function statusLabel(s: string) { return { pending: '待审核', approved: '已通过', rejected: '已拒绝' }[s] || s }
function statusColor(s: string) { return { pending: 'orange', approved: 'green', rejected: 'red' }[s] || 'default' }
function formatTime(t: string) { return new Date(t).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }
function isPdfFile(value?: string) { return /\.pdf($|\?)/i.test(value || '') }

function openDetail(record: any) {
  detailRecord.value = { ...record }
  detailVisible.value = true
}

function closeDetail() {
  detailVisible.value = false
  detailRecord.value = null
}

function refreshDetailInList(id: number) {
  const row = list.value.find((r) => r.id === id)
  if (row && detailRecord.value?.id === id) {
    detailRecord.value = { ...row }
  }
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getCompaniesAdminApi({ page: pagination.current, pageSize: pagination.pageSize, keyword: keyword.value || undefined, status: statusFilter.value })
    list.value = res.data?.list ?? []
    pagination.total = res.data?.total ?? 0
    if (detailRecord.value) {
      refreshDetailInList(detailRecord.value.id)
    }
  } catch { message.error('获取列表失败') }
  finally { loading.value = false }
}

async function fetchStats() {
  try {
    const res = await getCompanyStatsApi()
    stats.pending = res.data?.pending ?? 0
    stats.approved = res.data?.approved ?? 0
    stats.rejected = (res.data?.total ?? 0) - stats.pending - stats.approved
  } catch {}
}

function handleSearch() { pagination.current = 1; fetchList() }

async function handleApprove(id: number) {
  try {
    await updateCompanyStatusApi(id, 'approved')
    message.success('已通过审核')
    await fetchList(); fetchStats()
    refreshDetailInList(id)
  } catch { message.error('操作失败') }
}

function openReject(id: number) {
  rejectTargetId.value = id
  rejectReason.value = ''
  rejectVisible.value = true
}

function openRejectFromDetail() {
  if (!detailRecord.value) return
  openReject(detailRecord.value.id)
}

async function confirmReject() {
  if (!rejectReason.value.trim()) { message.warning('请填写拒绝原因'); return }
  const id = rejectTargetId.value
  try {
    await updateCompanyStatusApi(id, 'rejected', rejectReason.value)
    message.success('已拒绝')
    rejectVisible.value = false
    await fetchList(); fetchStats()
    refreshDetailInList(id)
  } catch { message.error('操作失败') }
}

async function handleRevoke(id: number) {
  try {
    await updateCompanyStatusApi(id, 'pending')
    message.success('已撤销认证')
    await fetchList(); fetchStats()
    refreshDetailInList(id)
  } catch { message.error('操作失败') }
}

function handleApproveFromDetail() {
  if (!detailRecord.value) return
  handleApprove(detailRecord.value.id)
}

function handleRevokeFromDetail() {
  if (!detailRecord.value) return
  handleRevoke(detailRecord.value.id)
}

onMounted(() => { fetchList(); fetchStats() })
</script>

<style scoped lang="less">
.detail-desc {
  margin-bottom: 8px;
}

.detail-description {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 160px;
  overflow-y: auto;
}

.detail-reject-alert {
  margin-top: 12px;
}

.cert-preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  min-height: 140px;
}

.cert-preview-item {
  text-align: center;
}

.cert-preview-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.no-cert {
  color: #bfbfbf;
  font-size: 13px;
  padding: 24px;
  width: 100%;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  border: 1px dashed #f0f0f0;
}

.detail-footer-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
