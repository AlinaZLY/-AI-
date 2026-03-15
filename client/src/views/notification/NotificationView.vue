<template>
  <div class="max-w-4xl mx-auto pb-10 min-h-[60vh]">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900">通知</h1>
          <span
            v-if="unreadCount > 0"
            class="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-blue-600 text-white text-xs font-semibold"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
          <span v-else class="text-sm text-gray-400">暂无未读</span>
        </div>
        <p class="text-sm text-gray-500 mt-1">系统、互动与社区相关提醒</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          :disabled="actionLoading || unreadCount === 0"
          class="px-4 py-2 text-sm font-medium rounded-lg border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          @click="handleMarkAllRead"
        >
          全部已读
        </button>
        <button
          type="button"
          :disabled="actionLoading"
          class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          @click="handleDeleteRead"
        >
          清除已读
        </button>
      </div>
    </div>

    <!-- Type tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="tab in typeTabs"
        :key="tab.key"
        type="button"
        class="px-4 py-2 rounded-full text-sm font-medium border transition-all"
        :class="
          activeType === tab.key
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:text-blue-600'
        "
        @click="selectType(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Read filter (uses isRead query param) -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <span class="text-xs font-medium text-gray-400">已读状态</span>
      <button
        v-for="opt in readOptions"
        :key="String(opt.value)"
        type="button"
        class="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
        :class="
          readFilter === opt.value
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-500 hover:bg-gray-100'
        "
        @click="selectReadFilter(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- List -->
    <div v-else-if="notifications.length" class="space-y-3">
      <article
        v-for="n in notifications"
        :key="n.id"
        class="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-blue-100"
        :class="{ 'bg-blue-50/40 border-blue-100': !n.isRead }"
      >
        <div class="p-4 sm:p-5 flex gap-4">
          <div
            class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-inner"
            :class="typeIconWrapClass(n.type)"
            :aria-label="typeLabel(n.type)"
          >
            <svg v-if="n.type === 'system'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else-if="n.type === 'like' || n.type === 'comment_like'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg v-else-if="n.type === 'comment'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {{ typeLabel(n.type) }}
              </span>
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="n.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'"
              >
                {{ n.isRead ? '已读' : '未读' }}
              </span>
              <span class="text-xs text-gray-400">{{ formatTime(n.createdAt) }}</span>
            </div>
            <p class="text-gray-800 text-sm sm:text-base leading-relaxed">{{ n.content }}</p>
            <p v-if="n.fromUser" class="text-xs text-gray-400 mt-2">
              来自 {{ n.fromUser.nickname || n.fromUser.username || '用户' }}
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0 self-start sm:self-center opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              v-if="!n.isRead"
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              @click="handleMarkOneRead(n)"
            >
              标为已读
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              @click="handleDeleteOne(n)"
            >
              删除
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <p class="text-gray-700 font-medium">暂无通知</p>
      <p class="text-sm text-gray-400 mt-1 max-w-sm">互动与系统消息会出现在这里</p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && total > pageSize" class="flex justify-center items-center gap-3 mt-8">
      <button
        type="button"
        :disabled="page <= 1"
        class="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="goPage(page - 1)"
      >
        上一页
      </button>
      <span class="text-sm text-gray-600">{{ page }} / {{ totalPages }}</span>
      <button
        type="button"
        :disabled="page >= totalPages"
        class="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="goPage(page + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from '@/utils/toast'
import {
  getNotificationsApi,
  getUnreadCountApi,
  markReadApi,
  markAllReadApi,
  deleteReadNotificationsApi,
  deleteNotificationApi,
} from '@/api/notification'

export interface NotificationItem {
  id: number
  type: string
  content: string
  isRead: boolean
  createdAt: string
  fromUser?: {
    id: number
    username?: string
    nickname?: string
    avatar?: string
  }
}

function unwrapPayload<T = unknown>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) {
    return res.data as T
  }
  return res as T
}

const NOTIFICATIONS_CHANGED = 'app:notifications-changed'

function emitNotificationsChanged() {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED))
}

const typeTabs = [
  { key: 'all', label: '全部', apiType: undefined as string | undefined },
  { key: 'system', label: '系统', apiType: 'system' },
  { key: 'like', label: '点赞', apiType: 'like' },
  { key: 'comment', label: '评论', apiType: 'comment' },
  { key: 'follow', label: '收藏', apiType: 'favorite' },
] as const

const readOptions = [
  { value: '' as const, label: '全部' },
  { value: 'false' as const, label: '未读' },
  { value: 'true' as const, label: '已读' },
]

const activeType = ref<(typeof typeTabs)[number]['key']>('all')
const readFilter = ref<'' | 'true' | 'false'>('')

const notifications = ref<NotificationItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const actionLoading = ref(false)
const unreadCount = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

function typeLabel(type: string) {
  const map: Record<string, string> = {
    system: '系统',
    like: '点赞',
    comment: '评论',
    comment_like: '评论赞',
    favorite: '收藏',
  }
  return map[type] || type
}

function typeIconWrapClass(type: string) {
  const map: Record<string, string> = {
    system: 'bg-slate-600',
    like: 'bg-rose-500',
    comment_like: 'bg-rose-500',
    comment: 'bg-blue-600',
    favorite: 'bg-amber-500',
  }
  return map[type] || 'bg-blue-600'
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000) return '刚刚'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} 小时前`
  if (diff < 7 * 86400_000) return `${Math.floor(diff / 86400_000)} 天前`
  return d.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function selectType(key: (typeof typeTabs)[number]['key']) {
  activeType.value = key
  page.value = 1
  fetchList()
}

function selectReadFilter(v: '' | 'true' | 'false') {
  readFilter.value = v
  page.value = 1
  fetchList()
}

function goPage(p: number) {
  page.value = p
  fetchList()
}

async function fetchUnread() {
  try {
    const res: any = await getUnreadCountApi()
    const n = unwrapPayload<number>(res)
    unreadCount.value = typeof n === 'number' ? n : 0
  } catch {
    unreadCount.value = 0
  }
}

async function fetchList() {
  loading.value = true
  try {
    const tab = typeTabs.find((t) => t.key === activeType.value)
    const params: Record<string, any> = {
      page: page.value,
      pageSize: pageSize.value,
    }
    if (tab?.apiType) params.type = tab.apiType
    if (readFilter.value) params.isRead = readFilter.value

    const res: any = await getNotificationsApi(params)
    const data =
      unwrapPayload<{ list: NotificationItem[]; total: number; page: number; pageSize: number }>(res) || {}
    notifications.value = Array.isArray(data.list) ? data.list : []
    total.value = data.total ?? 0
    page.value = data.page ?? page.value
    pageSize.value = data.pageSize ?? pageSize.value
  } catch {
    notifications.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function refreshAll() {
  await Promise.all([fetchList(), fetchUnread()])
  emitNotificationsChanged()
}

async function handleMarkOneRead(n: NotificationItem) {
  if (n.isRead) return
  actionLoading.value = true
  try {
    await markReadApi(n.id)
    toast('已标记为已读', 'success')
    await refreshAll()
  } catch {
    // interceptor
  } finally {
    actionLoading.value = false
  }
}

async function handleMarkAllRead() {
  actionLoading.value = true
  try {
    await markAllReadApi()
    toast('已全部标记为已读', 'success')
    await refreshAll()
  } catch {
    // interceptor
  } finally {
    actionLoading.value = false
  }
}

async function handleDeleteRead() {
  actionLoading.value = true
  try {
    await deleteReadNotificationsApi()
    toast('已删除所有已读通知', 'success')
    await refreshAll()
  } catch {
    // interceptor
  } finally {
    actionLoading.value = false
  }
}

async function handleDeleteOne(n: NotificationItem) {
  actionLoading.value = true
  try {
    await deleteNotificationApi(n.id)
    toast('已删除', 'success')
    await refreshAll()
  } catch {
    // interceptor
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  refreshAll()
})
</script>
