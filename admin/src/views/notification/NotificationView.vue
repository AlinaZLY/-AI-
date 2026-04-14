<template>
  <div class="notification-page">
    <a-page-header title="消息通知" :sub-title="`共 ${pagination.total} 条`">
      <template #extra>
        <a-space>
          <a-button @click="handleMarkAllRead" :disabled="!hasUnread">
            <CheckOutlined /> 全部已读
          </a-button>
          <a-popconfirm title="确定清除所有已读通知？" @confirm="handleDeleteRead">
            <a-button danger>
              <DeleteOutlined /> 清除已读
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-page-header>

    <div class="filter-bar">
      <a-radio-group v-model:value="readFilter" @change="handleFilterChange">
        <a-radio-button value="">全部</a-radio-button>
        <a-radio-button value="false">
          未读
          <a-badge v-if="unreadCount > 0" :count="unreadCount" :offset="[6, -4]" />
        </a-radio-button>
        <a-radio-button value="true">已读</a-radio-button>
      </a-radio-group>
      <a-select
        v-model:value="typeFilter"
        placeholder="通知类型"
        style="width: 140px; margin-left: 12px"
        allow-clear
        @change="handleFilterChange"
      >
        <a-select-option value="comment">评论</a-select-option>
        <a-select-option value="like">点赞</a-select-option>
        <a-select-option value="favorite">收藏</a-select-option>
        <a-select-option value="comment_like">评论点赞</a-select-option>
        <a-select-option value="system">系统</a-select-option>
      </a-select>
    </div>

    <a-spin :spinning="loading">
      <a-empty v-if="notifications.length === 0 && !loading" description="暂无通知" />
      <a-list :data-source="notifications" item-layout="horizontal">
        <template #renderItem="{ item }">
          <a-list-item :class="{ unread: !item.isRead }">
            <a-list-item-meta>
              <template #avatar>
                <a-avatar
                  v-if="item.fromUser?.avatar"
                  :src="item.fromUser.avatar"
                  :size="40"
                />
                <a-avatar v-else :size="40" style="background-color: #1677ff">
                  {{ typeIcon(item.type) }}
                </a-avatar>
              </template>
              <template #title>
                <span class="notify-user">{{ item.fromUser?.nickname || item.fromUser?.username || '系统' }}</span>
                <span class="notify-content">{{ item.content }}</span>
              </template>
              <template #description>
                <a-space :size="12">
                  <a-tag :color="typeColor(item.type)" size="small">{{ typeLabel(item.type) }}</a-tag>
                  <span class="notify-time">{{ formatTime(item.createdAt) }}</span>
                </a-space>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button
                v-if="!item.isRead"
                type="link"
                size="small"
                @click="handleMarkRead(item.id)"
              >
                标为已读
              </a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(item.id)">
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </template>
          </a-list-item>
        </template>
      </a-list>
      <div class="pagination-wrap" v-if="pagination.total > pagination.pageSize">
        <a-pagination
          v-model:current="pagination.current"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          show-size-changer
          @change="handlePageChange"
        />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {
  getNotificationsApi,
  getUnreadCountApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteReadNotificationsApi,
  deleteNotificationApi,
} from '@/api/system'

const loading = ref(false)
const notifications = ref<any[]>([])
const unreadCount = ref(0)
const hasUnread = ref(false)
const readFilter = ref('')
const typeFilter = ref<string | undefined>(undefined)
const pagination = reactive({ current: 1, pageSize: 20, total: 0 })

const typeMap: Record<string, { label: string; color: string; icon: string }> = {
  comment: { label: '评论', color: 'blue', icon: '💬' },
  like: { label: '点赞', color: 'red', icon: '❤' },
  comment_like: { label: '评论点赞', color: 'orange', icon: '👍' },
  favorite: { label: '收藏', color: 'gold', icon: '⭐' },
  system: { label: '系统', color: 'green', icon: '🔔' },
}
function typeLabel(t: string) { return typeMap[t]?.label || t }
function typeColor(t: string) { return typeMap[t]?.color || 'default' }
function typeIcon(t: string) { return typeMap[t]?.icon || '🔔' }

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

async function fetchNotifications() {
  loading.value = true
  try {
    const res = await getNotificationsApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      type: typeFilter.value || undefined,
      isRead: readFilter.value || undefined,
    })
    notifications.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch {
    message.error('获取通知列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchUnreadCount() {
  try {
    const res = await getUnreadCountApi()
    unreadCount.value = typeof res.data === 'number' ? res.data : 0
    hasUnread.value = unreadCount.value > 0
  } catch {
    unreadCount.value = 0
  }
}

async function handleMarkRead(id: number) {
  try {
    await markNotificationReadApi(id)
    fetchNotifications()
    fetchUnreadCount()
  } catch {
    message.error('操作失败')
  }
}

async function handleMarkAllRead() {
  try {
    await markAllNotificationsReadApi()
    message.success('已全部标为已读')
    fetchNotifications()
    fetchUnreadCount()
  } catch {
    message.error('操作失败')
  }
}

async function handleDeleteRead() {
  try {
    await deleteReadNotificationsApi()
    message.success('已清除所有已读通知')
    fetchNotifications()
    fetchUnreadCount()
  } catch {
    message.error('操作失败')
  }
}

async function handleDelete(id: number) {
  try {
    await deleteNotificationApi(id)
    message.success('已删除')
    fetchNotifications()
    fetchUnreadCount()
  } catch {
    message.error('删除失败')
  }
}

function handleFilterChange() {
  pagination.current = 1
  fetchNotifications()
}

function handlePageChange(page: number) {
  pagination.current = page
  fetchNotifications()
}

onMounted(() => {
  fetchNotifications()
  fetchUnreadCount()
})
</script>

<style scoped lang="less">
.notification-page {
  .filter-bar {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
}

.unread {
  background-color: #f0f5ff;
}

.notify-user {
  font-weight: 600;
  margin-right: 6px;
}

.notify-content {
  color: #333;
}

.notify-time {
  color: #999;
  font-size: 12px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
