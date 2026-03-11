<template>
  <div class="post-manage">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-input-search
        v-model:value="keyword"
        placeholder="搜索帖子标题或内容"
        style="width: 280px"
        allow-clear
        @search="handleSearch"
      />
      <a-select
        v-model:value="category"
        placeholder="分类筛选"
        style="width: 160px; margin-left: 12px"
        allow-clear
        @change="handleSearch"
      >
        <a-select-option value="interview">面试经验</a-select-option>
        <a-select-option value="written_test">笔试真题</a-select-option>
        <a-select-option value="job_hunting">求职交流</a-select-option>
        <a-select-option value="company">公司点评</a-select-option>
        <a-select-option value="other">其他</a-select-option>
      </a-select>
    </div>

    <!-- 帖子列表表格 -->
    <a-table
      :columns="columns"
      :data-source="posts"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'category'">
          <a-tag :color="categoryColor(record.category)">
            {{ categoryLabel(record.category) }}
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
            <span class="user-name">{{ record.user?.nickname || record.user?.username || '-' }}</span>
          </div>
        </template>
        <template v-if="column.key === 'stats'">
          <span>
            <EyeOutlined /> {{ record.viewCount }}
            <span style="margin: 0 6px; color: #d9d9d9">|</span>
            <LikeOutlined /> {{ record.likeCount }}
            <span style="margin: 0 6px; color: #d9d9d9">|</span>
            <MessageOutlined /> {{ record.commentCount }}
          </span>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="showDetail(record)">
              <EyeOutlined /> 查看
            </a-button>
            <a-popconfirm
              title="确定要删除此帖子吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" size="small" danger>
                <DeleteOutlined /> 删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

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
            <a-tag :color="categoryColor(currentPost.category)">
              {{ categoryLabel(currentPost.category) }}
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
        <div class="detail-content">{{ currentPost.content }}</div>

        <!-- 评论区域 -->
        <a-divider>评论 ({{ comments.length }})</a-divider>
        <a-spin :spinning="commentsLoading">
          <div v-if="comments.length === 0" class="no-comments">暂无评论</div>
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
                <span v-if="comment.parentId" class="comment-reply">
                  回复 #{{ comment.parentId }}
                </span>
                <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
              </a-space>
              <a-popconfirm
                title="确定要删除此评论吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteComment(comment.id)"
              >
                <a-button type="link" size="small" danger>
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { getPostsApi, getPostDetailApi, deletePostApi, getCommentsApi, deleteCommentApi } from '@/api/community'

const keyword = ref('')
const category = ref<string | undefined>(undefined)
const loading = ref(false)
const posts = ref<any[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const detailVisible = ref(false)
const currentPost = ref<any>(null)
const comments = ref<any[]>([])
const commentsLoading = ref(false)

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '分类', key: 'category', width: 100 },
  { title: '作者', key: 'user', width: 140 },
  { title: '数据', key: 'stats', width: 180 },
  { title: '发布时间', key: 'createdAt', width: 170 },
  { title: '操作', key: 'action', width: 140, fixed: 'right' as const },
]

const categoryMap: Record<string, { label: string; color: string }> = {
  interview: { label: '面试经验', color: 'blue' },
  written_test: { label: '笔试真题', color: 'purple' },
  job_hunting: { label: '求职交流', color: 'green' },
  company: { label: '公司点评', color: 'orange' },
  other: { label: '其他', color: 'default' },
}

function categoryLabel(cat: string) {
  return categoryMap[cat]?.label || cat
}

function categoryColor(cat: string) {
  return categoryMap[cat]?.color || 'default'
}

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function fetchPosts() {
  loading.value = true
  try {
    const res = await getPostsApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: keyword.value || undefined,
      category: category.value || undefined,
    })
    posts.value = res.list
    pagination.total = res.total
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

async function showDetail(record: any) {
  detailVisible.value = true
  commentsLoading.value = true
  try {
    const res = await getPostDetailApi(record.id)
    currentPost.value = res
  } catch {
    currentPost.value = record
  }
  try {
    const res = await getCommentsApi(record.id)
    comments.value = res
  } catch {
    comments.value = []
  } finally {
    commentsLoading.value = false
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

async function handleDeleteComment(id: number) {
  try {
    await deleteCommentApi(id)
    message.success('评论已删除')
    if (currentPost.value) {
      const res = await getCommentsApi(currentPost.value.id)
      comments.value = res
      currentPost.value.commentCount = comments.value.length
    }
  } catch {
    message.error('删除评论失败')
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped lang="less">
.post-manage {
  .search-bar {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .user-name {
    font-size: 13px;
  }
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
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 24px 0;
}

.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .comment-username {
    font-weight: 500;
    font-size: 13px;
  }

  .comment-reply {
    color: #1677ff;
    font-size: 12px;
  }

  .comment-time {
    color: #999;
    font-size: 12px;
  }

  .comment-content {
    margin: 6px 0 0 30px;
    color: #333;
    line-height: 1.6;
  }
}
</style>
