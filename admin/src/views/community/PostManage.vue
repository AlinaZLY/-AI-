<template>
  <div class="post-manage">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <a-input-search
          v-model:value="keyword"
          placeholder="搜索帖子标题或内容"
          style="width: 260px"
          allow-clear
          @search="handleSearch"
        />
        <a-select
          v-model:value="categoryId"
          placeholder="分类筛选"
          style="width: 140px"
          allow-clear
          @change="handleSearch"
        >
          <a-select-option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="statusFilter"
          placeholder="审核状态"
          style="width: 130px"
          allow-clear
          @change="handleSearch"
        >
          <a-select-option value="pending">待审核</a-select-option>
          <a-select-option value="approved">已通过</a-select-option>
          <a-select-option value="rejected">已拒绝</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" @click="openCreateModal">
        <PlusOutlined /> 新建帖子
      </a-button>
    </div>

    <!-- 帖子列表表格 -->
    <a-table
      :columns="columns"
      :data-source="posts"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      size="middle"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a @click="showDetail(record)" style="color: #1677ff">{{ record.title }}</a>
        </template>
        <template v-if="column.key === 'category'">
          <a-tag :color="record.category?.color || 'default'">
            {{ record.category?.name || '未分类' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'user'">
          <div class="user-cell">
            <a-avatar
              v-if="record.user?.avatar"
              :size="24"
              :src="record.user.avatar"
            />
            <a-avatar v-else :size="24" style="background-color: #1677ff; font-size: 12px">
              {{ (record.user?.username || '?').charAt(0) }}
            </a-avatar>
            <span>{{ record.user?.nickname || record.user?.username || '-' }}</span>
          </div>
        </template>
        <template v-if="column.key === 'stats'">
          <a-space :size="4">
            <a-tooltip title="浏览"><EyeOutlined /> {{ record.viewCount }}</a-tooltip>
            <a-tooltip title="点赞"><LikeOutlined /> {{ record.likeCount }}</a-tooltip>
            <a-tooltip title="评论"><MessageOutlined /> {{ record.commentCount }}</a-tooltip>
          </a-space>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">
            {{ statusLabel(record.status) }}
          </a-tag>
          <a-tooltip v-if="record.status === 'rejected' && record.rejectReason" :title="record.rejectReason">
            <InfoCircleOutlined style="color: #ff4d4f; cursor: pointer; margin-left: 4px" />
          </a-tooltip>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button type="link" size="small" @click="showDetail(record)">查看</a-button>
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-dropdown v-if="record.status === 'pending'">
              <a-button type="link" size="small">审核</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleReview(record.id, 'approved')">
                    <CheckOutlined style="color: #52c41a" /> 通过
                  </a-menu-item>
                  <a-menu-item @click="showRejectModal(record.id)">
                    <CloseOutlined style="color: #faad14" /> 拒绝
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-popconfirm
              title="确定要删除此帖子吗？删除后不可恢复。"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新建/编辑帖子弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="editingId ? '编辑帖子' : '新建帖子'"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="formLoading"
      @ok="handleFormSubmit"
      width="800px"
      :destroy-on-close="true"
    >
      <a-form layout="vertical">
        <a-form-item label="标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入帖子标题" :maxlength="200" show-count />
        </a-form-item>
        <a-form-item label="分类">
          <a-select v-model:value="formData.categoryId" placeholder="请选择分类" allow-clear>
            <a-select-option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="内容" required>
          <div style="border: 1px solid #d9d9d9; border-radius: 6px; overflow: hidden; z-index: 100">
            <Toolbar :editor="editorRef" :default-config="toolbarConfig" style="border-bottom: 1px solid #d9d9d9" />
            <Editor
              v-model="formData.content"
              :default-config="editorConfig"
              style="height: 300px; overflow-y: auto"
              @onCreated="handleEditorCreated"
            />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 帖子详情弹窗 -->
    <a-modal
      v-model:open="detailVisible"
      :title="currentPost?.title"
      width="720px"
      :footer="null"
    >
      <div v-if="currentPost" class="post-detail">
        <div class="detail-meta">
          <a-space>
            <a-avatar
              v-if="currentPost.user?.avatar"
              :size="28"
              :src="currentPost.user.avatar"
            />
            <a-avatar v-else :size="28" style="background-color: #1677ff; font-size: 14px">
              {{ (currentPost.user?.username || '?').charAt(0) }}
            </a-avatar>
            <span>{{ currentPost.user?.nickname || currentPost.user?.username }}</span>
            <a-tag :color="currentPost.category?.color || 'default'">
              {{ currentPost.category?.name || '未分类' }}
            </a-tag>
            <a-tag :color="statusColor(currentPost.status)">
              {{ statusLabel(currentPost.status) }}
            </a-tag>
            <span class="detail-time">{{ formatTime(currentPost.createdAt) }}</span>
          </a-space>
          <div class="detail-stats">
            <EyeOutlined /> {{ currentPost.viewCount }}
            <LikeOutlined style="margin-left: 12px" /> {{ currentPost.likeCount }}
            <StarOutlined style="margin-left: 12px" /> {{ currentPost.favoriteCount }}
            <MessageOutlined style="margin-left: 12px" /> {{ currentPost.commentCount }}
          </div>
        </div>
        <a-divider />
        <div class="detail-content" v-html="currentPost.content"></div>

        <!-- 评论区域 -->
        <a-divider>评论 ({{ comments.length }})</a-divider>
        <a-spin :spinning="commentsLoading">
          <a-empty v-if="comments.length === 0" description="暂无评论" />
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <a-space>
                <a-avatar
                  v-if="comment.user?.avatar"
                  :size="24"
                  :src="comment.user.avatar"
                />
                <a-avatar v-else :size="24" style="background-color: #1677ff; font-size: 12px">
                  {{ (comment.user?.username || '?').charAt(0) }}
                </a-avatar>
                <span class="comment-username">{{ comment.user?.nickname || comment.user?.username }}</span>
                <span v-if="comment.parentId" class="comment-reply">回复 #{{ comment.parentId }}</span>
                <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
              </a-space>
              <a-popconfirm
                title="确定要删除此评论吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteComment(comment.id)"
              >
                <a-button type="link" size="small" danger><DeleteOutlined /></a-button>
              </a-popconfirm>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
        </a-spin>
      </div>
    </a-modal>

    <!-- 拒绝原因弹窗 -->
    <a-modal
      v-model:open="rejectVisible"
      title="拒绝帖子"
      ok-text="确认拒绝"
      cancel-text="取消"
      @ok="handleReject"
    >
      <a-textarea v-model:value="rejectReason" placeholder="请输入拒绝原因（可选）" :rows="3" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore - wangeditor types issue
import { ref, reactive, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { message } from 'ant-design-vue'
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import {
  PlusOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'
import {
  getPostsApi, getPostDetailApi, createPostApi, updatePostApi,
  deletePostApi, getCommentsApi, deleteCommentApi, reviewPostApi,
  getCategoriesApi,
} from '@/api/community'

// ========== 分类列表 ==========
const categoryList = ref<any[]>([])

// ========== 富文本编辑器 ==========
const editorRef = shallowRef<IDomEditor>()
const toolbarConfig: Partial<IToolbarConfig> = {}
const editorConfig: Partial<IEditorConfig> = { placeholder: '请输入帖子内容...' }

function handleEditorCreated(editor: IDomEditor) {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})

async function fetchCategories() {
  try {
    const res = await getCategoriesApi()
    categoryList.value = res.data || []
  } catch {
    categoryList.value = []
  }
}

// ========== 列表相关 ==========
const keyword = ref('')
const categoryId = ref<number | undefined>(undefined)
const statusFilter = ref<string | undefined>(undefined)
const loading = ref(false)
const posts = ref<any[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '分类', key: 'category', width: 100 },
  { title: '作者', key: 'user', width: 130 },
  { title: '状态', key: 'status', width: 100 },
  { title: '数据', key: 'stats', width: 160 },
  { title: '发布时间', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const },
]

// ========== 表单相关 ==========
const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = reactive({ title: '', content: '', categoryId: undefined as number | undefined })

// ========== 详情相关 ==========
const detailVisible = ref(false)
const currentPost = ref<any>(null)
const comments = ref<any[]>([])
const commentsLoading = ref(false)

// ========== 审核相关 ==========
const rejectVisible = ref(false)
const rejectReason = ref('')
const rejectPostId = ref<number>(0)

// ========== 工具函数 ==========
const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待审核', color: 'gold' },
  approved: { label: '已通过', color: 'green' },
  rejected: { label: '已拒绝', color: 'red' },
}
function statusLabel(s: string) { return statusMap[s]?.label || s }
function statusColor(s: string) { return statusMap[s]?.color || 'default' }

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

// ========== 列表操作 ==========
async function fetchPosts() {
  loading.value = true
  try {
    const res = await getPostsApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: keyword.value || undefined,
      categoryId: categoryId.value || undefined,
      status: statusFilter.value || undefined,
    })
    posts.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch {
    message.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchPosts()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchPosts()
}

// ========== CRUD 操作 ==========
function openCreateModal() {
  editingId.value = null
  formData.title = ''
  formData.content = ''
  formData.categoryId = undefined
  formVisible.value = true
}

async function openEditModal(record: any) {
  editingId.value = record.id
  formData.title = record.title
  formData.categoryId = record.categoryId || undefined
  // 列表接口不返回content，需要调详情接口获取
  try {
    const res = await getPostDetailApi(record.id)
    formData.content = res.data?.content || ''
  } catch {
    formData.content = record.content || ''
  }
  formVisible.value = true
}

async function handleFormSubmit() {
  if (!formData.title.trim()) return message.warning('请输入标题')
  if (!formData.content.trim()) return message.warning('请输入内容')

  formLoading.value = true
  try {
    if (editingId.value) {
      await updatePostApi(editingId.value, formData)
      message.success('帖子已更新')
    } else {
      await createPostApi(formData)
      message.success('帖子已创建')
    }
    formVisible.value = false
    fetchPosts()
  } catch {
    message.error('操作失败')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete(id: number) {
  try {
    await deletePostApi(id)
    message.success('帖子已删除')
    fetchPosts()
  } catch {
    message.error('删除失败')
  }
}

// ========== 详情 + 评论 ==========
async function showDetail(record: any) {
  detailVisible.value = true
  commentsLoading.value = true
  try {
    const detailRes = await getPostDetailApi(record.id)
    currentPost.value = detailRes.data
  } catch {
    currentPost.value = record
  }
  try {
    const commentsRes = await getCommentsApi(record.id)
    comments.value = commentsRes.data || []
  } catch {
    comments.value = []
  } finally {
    commentsLoading.value = false
  }
}

async function handleDeleteComment(id: number) {
  try {
    await deleteCommentApi(id)
    message.success('评论已删除')
    if (currentPost.value) {
      const cRes = await getCommentsApi(currentPost.value.id)
      comments.value = cRes.data || []
      currentPost.value.commentCount = comments.value.length
    }
  } catch {
    message.error('删除评论失败')
  }
}

// ========== 审核操作 ==========
async function handleReview(id: number, status: string) {
  try {
    await reviewPostApi(id, { status })
    message.success('审核通过')
    fetchPosts()
  } catch {
    message.error('审核操作失败')
  }
}

function showRejectModal(id: number) {
  rejectPostId.value = id
  rejectReason.value = ''
  rejectVisible.value = true
}

async function handleReject() {
  try {
    await reviewPostApi(rejectPostId.value, { status: 'rejected', rejectReason: rejectReason.value })
    message.success('已拒绝该帖子')
    rejectVisible.value = false
    fetchPosts()
  } catch {
    message.error('操作失败')
  }
}

onMounted(() => {
  fetchCategories()
  fetchPosts()
})
</script>

<style scoped lang="less">
.post-manage {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .toolbar-left {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.post-detail {
  .detail-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .detail-time {
    color: #999;
    font-size: 13px;
  }
  .detail-stats {
    color: #666;
    font-size: 13px;
  }
  .detail-content {
    line-height: 1.8;
    color: #333;
    word-break: break-word;

    :deep(img) {
      max-width: 100%;
      border-radius: 4px;
    }
    :deep(blockquote) {
      border-left: 4px solid #d9d9d9;
      padding-left: 12px;
      color: #666;
      margin: 8px 0;
    }
  }
}

.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .comment-username { font-weight: 500; font-size: 13px; }
  .comment-reply { color: #1677ff; font-size: 12px; }
  .comment-time { color: #999; font-size: 12px; }
  .comment-content {
    margin: 6px 0 0 30px;
    color: #333;
    line-height: 1.6;
  }
}
</style>
