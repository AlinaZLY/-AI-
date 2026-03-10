<template>
  <div class="company-manage">
    <a-page-header title="企业管理" :sub-title="`共 ${pagination.total} 家企业`" />

    <a-row :gutter="12" style="margin-bottom: 16px">
      <a-col :span="6" v-for="stat in statCards" :key="stat.label">
        <a-card size="small">
          <a-statistic :title="stat.label" :value="stat.value" :value-style="{ fontSize: '20px', color: stat.color }" />
        </a-card>
      </a-col>
    </a-row>

    <div class="toolbar">
      <a-space>
        <a-input-search v-model:value="keyword" placeholder="搜索企业名称/行业" style="width: 240px" allow-clear @search="handleSearch" />
        <a-select v-model:value="statusFilter" placeholder="审核状态" style="width: 130px" allow-clear @change="handleSearch">
          <a-select-option value="pending">待审核</a-select-option>
          <a-select-option value="approved">已通过</a-select-option>
          <a-select-option value="rejected">已拒绝</a-select-option>
        </a-select>
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="list" :loading="loading" :pagination="pagination" row-key="id" size="middle" @change="handleTableChange"
      :scroll="{ x: 1200 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a @click="showDetail(record)" style="color: #1677ff; font-weight: 500">{{ record.name }}</a>
          <div style="font-size: 11px; color: #999" v-if="record.type">{{ record.type === 'individual' ? '个体工商户' : '企业' }}</div>
        </template>
        <template v-if="column.key === 'user'">
          <span v-if="record.user">{{ record.user.nickname || record.user.username }}</span>
          <span v-else>ID: {{ record.userId }}</span>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'verified'">
          <a-tag :color="record.isVerified ? 'green' : 'default'">{{ record.isVerified ? '已认证' : '未认证' }}</a-tag>
        </template>
        <template v-if="column.key === 'certs'">
          <a-space :size="4">
            <a-tag v-if="record.businessLicense" color="blue" size="small">营业执照</a-tag>
            <a-tag v-if="record.idCardFront" color="cyan" size="small">身份证</a-tag>
            <span v-if="!record.businessLicense && !record.idCardFront" style="color: #ccc">-</span>
          </a-space>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button type="link" size="small" @click="showDetail(record)">审核</a-button>
            <a-button v-if="record.status === 'pending'" type="link" size="small" style="color: #52c41a" @click="handleApprove(record.id)">通过</a-button>
            <a-button v-if="record.status === 'pending'" type="link" size="small" danger @click="handleReject(record.id)">拒绝</a-button>
            <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 审核详情弹窗 -->
    <a-modal v-model:open="detailVisible" :title="'企业审核 - ' + (currentCompany?.name || '')" width="700px" :footer="null">
      <template v-if="currentCompany">
        <a-tabs>
          <a-tab-pane key="info" tab="基本信息">
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="企业名称">{{ currentCompany.name }}</a-descriptions-item>
              <a-descriptions-item label="类型">{{ currentCompany.type === 'individual' ? '个体工商户' : '企业' }}</a-descriptions-item>
              <a-descriptions-item label="法人/负责人">{{ currentCompany.legalPerson || '-' }}</a-descriptions-item>
              <a-descriptions-item label="统一信用代码">{{ currentCompany.creditCode || '-' }}</a-descriptions-item>
              <a-descriptions-item label="行业">{{ currentCompany.industry || '-' }}</a-descriptions-item>
              <a-descriptions-item label="规模">{{ currentCompany.scale || '-' }}</a-descriptions-item>
              <a-descriptions-item label="城市">{{ currentCompany.city || '-' }}</a-descriptions-item>
              <a-descriptions-item label="联系电话">{{ currentCompany.contactPhone || '-' }}</a-descriptions-item>
              <a-descriptions-item label="联系邮箱" :span="2">{{ currentCompany.contactEmail || '-' }}</a-descriptions-item>
              <a-descriptions-item label="地址" :span="2">{{ currentCompany.address || '-' }}</a-descriptions-item>
              <a-descriptions-item label="关联用户" :span="2">
                <span v-if="currentCompany.user">{{ currentCompany.user.nickname || currentCompany.user.username }} (ID: {{ currentCompany.userId }})</span>
                <span v-else>用户ID: {{ currentCompany.userId }}</span>
              </a-descriptions-item>
            </a-descriptions>
            <div v-if="currentCompany.description" style="margin-top: 12px">
              <div style="font-weight: 500; margin-bottom: 6px">企业简介</div>
              <div style="padding: 10px 14px; background: #fafafa; border-radius: 6px; font-size: 13px; line-height: 1.8; white-space: pre-wrap">{{ currentCompany.description }}</div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="certs" tab="认证材料">
            <div v-if="currentCompany.businessLicense || currentCompany.idCardFront || currentCompany.idCardBack">
              <div class="cert-grid">
                <div v-if="currentCompany.businessLicense" class="cert-card">
                  <div class="cert-title">营业执照</div>
                  <img :src="currentCompany.businessLicense" class="cert-img" @click="previewImg = currentCompany.businessLicense" />
                </div>
                <div v-if="currentCompany.idCardFront" class="cert-card">
                  <div class="cert-title">身份证正面</div>
                  <img :src="currentCompany.idCardFront" class="cert-img" @click="previewImg = currentCompany.idCardFront" />
                </div>
                <div v-if="currentCompany.idCardBack" class="cert-card">
                  <div class="cert-title">身份证反面</div>
                  <img :src="currentCompany.idCardBack" class="cert-img" @click="previewImg = currentCompany.idCardBack" />
                </div>
              </div>
            </div>
            <a-empty v-else description="未上传认证材料" />
          </a-tab-pane>

          <a-tab-pane key="audit" tab="审核操作">
            <div style="margin-bottom: 12px">
              <span>当前状态：</span>
              <a-tag :color="statusColor(currentCompany.status)" style="font-size: 14px">{{ statusLabel(currentCompany.status) }}</a-tag>
            </div>
            <div v-if="currentCompany.rejectReason" style="margin-bottom: 12px">
              <a-alert :message="'上次拒绝原因：' + currentCompany.rejectReason" type="warning" show-icon />
            </div>
            <a-space direction="vertical" style="width: 100%">
              <a-button type="primary" block :disabled="currentCompany.status === 'approved'" @click="handleApprove(currentCompany.id)">
                ✓ 通过审核
              </a-button>
              <div>
                <label class="block text-sm mb-1" style="color: #666">拒绝原因</label>
                <a-textarea v-model:value="rejectReason" placeholder="请填写拒绝原因（必填）" :rows="3" />
              </div>
              <a-button danger block :disabled="currentCompany.status === 'rejected' || !rejectReason" @click="handleRejectWithReason(currentCompany.id)">
                ✕ 拒绝审核
              </a-button>
            </a-space>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-modal>

    <!-- 图片预览 -->
    <a-modal :open="!!previewImg" :footer="null" width="auto" style="max-width: 90vw" @cancel="previewImg = ''">
      <img :src="previewImg" style="max-width: 100%; max-height: 80vh" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  getCompaniesAdminApi,
  getCompanyDetailApi,
  updateCompanyStatusApi,
  deleteCompanyAdminApi,
  getCompanyStatsApi,
} from '@/api/company'

const loading = ref(false)
const list = ref<any[]>([])
const keyword = ref('')
const statusFilter = ref<string | undefined>(undefined)
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })
const rejectReason = ref('')
const previewImg = ref('')

function statusLabel(s: string) { return { pending: '待审核', approved: '已通过', rejected: '已拒绝' }[s] || s }
function statusColor(s: string) { return { pending: 'orange', approved: 'green', rejected: 'red' }[s] || 'default' }
function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '企业名称', key: 'name', width: 180 },
  { title: '申请人', key: 'user', width: 120 },
  { title: '行业', dataIndex: 'industry', width: 90 },
  { title: '城市', dataIndex: 'city', width: 80 },
  { title: '认证材料', key: 'certs', width: 120 },
  { title: '状态', key: 'status', width: 90 },
  { title: '认证', key: 'verified', width: 80 },
  { title: '申请时间', key: 'createdAt', width: 150 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const },
]

const statsData = ref<any>({})
const statCards = computed(() => [
  { label: '总申请数', value: statsData.value.total ?? 0, color: '#1677ff' },
  { label: '已通过', value: statsData.value.approved ?? 0, color: '#52c41a' },
  { label: '待审核', value: statsData.value.pending ?? 0, color: '#faad14' },
  { label: '已拒绝', value: (statsData.value.total ?? 0) - (statsData.value.approved ?? 0) - (statsData.value.pending ?? 0), color: '#ff4d4f' },
])

const detailVisible = ref(false)
const currentCompany = ref<any>(null)

async function fetchList() {
  loading.value = true
  try {
    const res = await getCompaniesAdminApi({ page: pagination.current, pageSize: pagination.pageSize, keyword: keyword.value || undefined, status: statusFilter.value })
    list.value = res.data?.list ?? []
    pagination.total = res.data?.total ?? 0
  } catch { message.error('获取列表失败') }
  finally { loading.value = false }
}

async function fetchStats() {
  try { const res = await getCompanyStatsApi(); statsData.value = res.data ?? {} } catch {}
}

function handleSearch() { pagination.current = 1; fetchList() }
function handleTableChange(pag: any) { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

async function showDetail(record: any) {
  currentCompany.value = record
  rejectReason.value = ''
  detailVisible.value = true
  try {
    const res = await getCompanyDetailApi(record.id)
    currentCompany.value = res.data ?? record
  } catch { message.error('获取详情失败') }
}

async function handleApprove(id: number) {
  try {
    await updateCompanyStatusApi(id, 'approved')
    message.success('已通过审核')
    fetchList(); fetchStats()
    if (currentCompany.value?.id === id) currentCompany.value = { ...currentCompany.value, status: 'approved', isVerified: true }
  } catch { message.error('操作失败') }
}

async function handleReject(id: number) {
  const reason = prompt('请输入拒绝原因：')
  if (!reason) return
  try {
    await updateCompanyStatusApi(id, 'rejected', reason)
    message.success('已拒绝')
    fetchList(); fetchStats()
  } catch { message.error('操作失败') }
}

async function handleRejectWithReason(id: number) {
  if (!rejectReason.value) { message.warning('请填写拒绝原因'); return }
  try {
    await updateCompanyStatusApi(id, 'rejected', rejectReason.value)
    message.success('已拒绝')
    fetchList(); fetchStats()
    if (currentCompany.value?.id === id) currentCompany.value = { ...currentCompany.value, status: 'rejected', rejectReason: rejectReason.value }
  } catch { message.error('操作失败') }
}

async function handleDelete(id: number) {
  try {
    await deleteCompanyAdminApi(id)
    message.success('已删除')
    if (currentCompany.value?.id === id) detailVisible.value = false
    fetchList(); fetchStats()
  } catch { message.error('删除失败') }
}

onMounted(() => { fetchList(); fetchStats() })
</script>

<style scoped lang="less">
.toolbar { margin-bottom: 16px; }

.cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.cert-card {
  text-align: center;

  .cert-title {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .cert-img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
