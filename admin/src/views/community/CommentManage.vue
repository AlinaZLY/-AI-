<template>
  <div class="comment-manage">
    <div class="toolbar">
      <a-input-search
        v-model:value="keyword"
        placeholder="搜索评论内容"
        style="width: 300px"
        allow-clear
        @search="handleSearch"
      />
    </div>

    <a-table
      :columns="columns"
      :data-source="commentsList"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      size="middle"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'content'">
          <span>{{ record.content }}</span>
        </template>
        <template v-if="column.key === 'post'">
          <a-tooltip :title="record.post?.title">
            <span class="post-title">{{ record.post?.title || '-' }}</span>
          </a-tooltip>
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
        <template v-if="column.key === 'parentId'">
          <span v-if="record.parentId" style="color: #1677ff">回复 #{{ record.parentId }}</span>
          <span v-else style="color: #999">—</span>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-popconfirm
            title="确定要删除此评论吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record.id)"
          >
            <a-button type="link" size="small" danger>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getAllCommentsApi, deleteCommentApi } from '@/api/community'

const keyword = ref('')
const loading = ref(false)
const commentsList = ref<any[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '评论内容', key: 'content', ellipsis: true },
  { title: '所属帖子', key: 'post', width: 180, ellipsis: true },
  { title: '评论者', key: 'user', width: 130 },
  { title: '回复', key: 'parentId', width: 90 },
  { title: '点赞', dataIndex: 'likeCount', key: 'likeCount', width: 70 },
  { title: '评论时间', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

async function fetchComments() {
  loading.value = true
  try {
    const res = await getAllCommentsApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: keyword.value || undefined,
    })
    commentsList.value = res.list
    pagination.total = res.total
  } catch {
    message.error('获取评论列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchComments()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchComments()
}

async function handleDelete(id: number) {
  try {
    await deleteCommentApi(id)
    message.success('评论已删除')
    fetchComments()
  } catch {
    message.error('删除失败')
  }
}

onMounted(() => fetchComments())
</script>

<style scoped lang="less">
.comment-manage {
  .toolbar {
    margin-bottom: 16px;
  }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.post-title {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
</style>
