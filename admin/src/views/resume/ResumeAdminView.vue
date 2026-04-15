<template>
  <div class="resume-admin">
    <a-page-header title="简历管理" sub-title="按用户查看所有简历" />

    <div class="layout-split">
      <aside class="user-sidebar">
        <div class="sidebar-title">有简历的用户</div>
        <a-spin :spinning="sidebarLoading">
          <div
            class="user-item user-item-all"
            :class="{ active: selectedUserId === null }"
            @click="selectUser(null)"
          >
            <span class="user-label">全部</span>
            <a-tag size="small">{{ totalResumeCount }}</a-tag>
          </div>
          <div
            v-for="u in userSummaries"
            :key="u.id"
            class="user-item"
            :class="{ active: selectedUserId === u.id }"
            @click="selectUser(u.id)"
          >
            <a-avatar v-if="u.avatar" :size="32" :src="u.avatar" />
            <a-avatar v-else :size="32" style="background-color: #1677ff; font-size: 13px">
              {{ (u.nickname || u.username || '?').charAt(0) }}
            </a-avatar>
            <div class="user-text">
              <div class="user-name">{{ u.nickname || u.username || `用户 #${u.id}` }}</div>
              <div class="user-sub">{{ u.resumeCount }} 份简历</div>
            </div>
          </div>
          <a-empty
            v-if="!sidebarLoading && !userSummaries.length"
            description="暂无简历"
            :image="simpleEmptyImage"
          />
        </a-spin>
      </aside>

      <div class="main-panel">
        <div class="toolbar">
          <a-space>
            <a-input-search
              v-model:value="keyword"
              placeholder="搜索用户名/昵称/简历标题"
              style="width: 280px"
              allow-clear
              @search="handleSearch"
            />
          </a-space>
        </div>

        <a-table
          :columns="columns"
          :data-source="resumes"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          size="middle"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'user'">
              <div style="display: flex; align-items: center; gap: 6px">
                <a-avatar :size="24" v-if="record.user?.avatar" :src="record.user.avatar" />
                <a-avatar :size="24" v-else style="background-color: #1677ff; font-size: 12px">
                  {{ (record.user?.username || '?').charAt(0) }}
                </a-avatar>
                <span>{{ record.user?.nickname || record.user?.username || '-' }}</span>
              </div>
            </template>
            <template v-if="column.key === 'title'">
              <span>{{ record.title }}</span>
              <a-tag v-if="record.isDefault" color="blue" style="margin-left: 6px">默认</a-tag>
            </template>
            <template v-if="column.key === 'updatedAt'">
              {{ formatTime(record.updatedAt) }}
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" size="small" @click="handlePreview(record.id)">预览</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Empty } from 'ant-design-vue'
import { getResumesAdminApi, renderResumeApi } from '@/api/resume'

const simpleEmptyImage = Empty.PRESENTED_IMAGE_SIMPLE

interface UserSummary {
  id: number
  username?: string
  nickname?: string
  avatar?: string
  resumeCount: number
}

const loading = ref(false)
const sidebarLoading = ref(false)
const resumes = ref<any[]>([])
const keyword = ref('')
const selectedUserId = ref<number | null>(null)
const userMap = ref<Map<number, UserSummary>>(new Map())
const totalResumeCount = ref(0)

const userSummaries = computed(() =>
  Array.from(userMap.value.values()).sort((a, b) => {
    if (b.resumeCount !== a.resumeCount) return b.resumeCount - a.resumeCount
    return (a.nickname || a.username || '').localeCompare(b.nickname || b.username || '')
  }),
)

const pagination = reactive({
  current: 1, pageSize: 10, total: 0,
  showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条`,
})

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '用户', key: 'user', width: 150 },
  { title: '简历标题', key: 'title', ellipsis: true },
  { title: '目标岗位', dataIndex: 'targetPosition', width: 120 },
  { title: '版本', dataIndex: 'version', width: 60 },
  { title: '更新时间', key: 'updatedAt', width: 160 },
  { title: '操作', key: 'action', width: 80 },
]

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

async function loadUserSidebar() {
  sidebarLoading.value = true
  const map = new Map<number, UserSummary>()
  let page = 1
  const pageSize = 100
  let total = 0
  try {
    while (true) {
      const res = await getResumesAdminApi({ page, pageSize })
      const list = res.data?.list || []
      total = res.data?.total ?? 0
      for (const r of list) {
        const u = r.user
        if (!u?.id) continue
        const prev = map.get(u.id)
        if (prev) {
          prev.resumeCount += 1
        } else {
          map.set(u.id, {
            id: u.id,
            username: u.username,
            nickname: u.nickname,
            avatar: u.avatar,
            resumeCount: 1,
          })
        }
      }
      if (!list.length || page * pageSize >= total) break
      page += 1
    }
    userMap.value = map
    totalResumeCount.value = total
  } catch {
    message.error('加载用户列表失败')
  } finally {
    sidebarLoading.value = false
  }
}

async function fetchResumes() {
  loading.value = true
  try {
    const res = await getResumesAdminApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: keyword.value || undefined,
      userId: selectedUserId.value != null ? selectedUserId.value : undefined,
    })
    resumes.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch {
    message.error('获取简历列表失败')
  } finally {
    loading.value = false
  }
}

function selectUser(id: number | null) {
  selectedUserId.value = id
  pagination.current = 1
  fetchResumes()
}

function handleSearch() {
  pagination.current = 1
  fetchResumes()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchResumes()
}

async function handlePreview(id: number) {
  try {
    const res = await renderResumeApi(id)
    const html = res.data?.html || ''
    const w = window.open('', '_blank')
    if (w) {
      const safeHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\bon\w+\s*=/gi, 'data-disabled-')
      w.document.write(safeHtml)
      w.document.close()
    }
  } catch {
    message.error('预览失败')
  }
}

onMounted(async () => {
  await loadUserSidebar()
  await fetchResumes()
})
</script>

<style scoped>
.layout-split {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-top: 8px;
}

.user-sidebar {
  flex: 0 0 220px;
  width: 220px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background 0.15s;
}

.user-item:hover {
  background: #f0f0f0;
}

.user-item.active {
  background: #e6f4ff;
  outline: 1px solid #91caff;
}

.user-item-all {
  justify-content: space-between;
  font-weight: 500;
}

.user-label {
  flex: 1;
}

.user-text {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-sub {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.main-panel {
  flex: 1;
  min-width: 0;
}

.toolbar {
  margin-bottom: 16px;
}
</style>
