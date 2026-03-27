<template>
  <div class="page-shell flex h-[calc(100vh-10rem)] bg-white rounded-xl border border-gray-100 overflow-hidden">
    <!-- 会话列表 -->
    <div class="w-80 border-r border-gray-100 flex flex-col shrink-0">
      <div class="p-4 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">{{ $t('消息') }}</h2>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-if="conversationsLoading" class="flex justify-center py-8">
          <div class="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
        <div v-else-if="conversations.length === 0" class="px-5 py-10 text-center">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-700">{{ $t('暂无聊天对话') }}</p>
          <p class="mt-2 text-xs leading-5 text-gray-400">
            {{ $t('需要先从职位页或消息沟通入口发起一次聊天。') }}
            <template v-if="notificationUnreadCount > 0">
              {{ $t('当前还有 {count} 条未读通知，可去通知中心查看。').replace('{count}', String(notificationUnreadCount)) }}
            </template>
          </p>
          <div class="mt-4 flex justify-center gap-3">
            <router-link to="/jobs" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">{{ $t('去看职位') }}</router-link>
            <router-link
              v-if="notificationUnreadCount > 0"
              to="/notifications"
              class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              {{ $t('打开通知中心') }}
            </router-link>
          </div>
        </div>
        <div
          v-for="conv in conversations"
          :key="conv.id"
          class="px-4 py-3 cursor-pointer transition-colors border-b border-gray-50"
          :class="activeConvId === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'"
          @click="selectConversation(conv)"
        >
          <div class="flex items-center gap-3">
            <div class="relative shrink-0">
              <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                {{ (getOtherUser(conv)?.nickname || getOtherUser(conv)?.username || '?').charAt(0) }}
              </div>
              <span
                class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                :class="onlineStatusMap[getOtherUser(conv)?.id]?.online ? 'bg-blue-500' : 'bg-gray-300'"
              ></span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="font-medium text-gray-900 text-sm truncate">{{ getOtherUser(conv)?.nickname || getOtherUser(conv)?.username || $t('用户') }}{{ conv.job ? ' · ' + conv.job.companyName : '' }}</span>
                  <span
                    v-if="onlineStatusMap[getOtherUser(conv)?.id]?.online"
                    class="inline-flex items-center gap-1 text-[11px] font-medium text-blue-500 shrink-0"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{{ $t('在线') }}
                  </span>
                </div>
                <span class="text-xs text-gray-400 shrink-0 ml-2">{{ formatTime(conv.lastMessageAt) }}</span>
              </div>
              <div class="flex justify-between items-center mt-0.5">
                <p class="text-xs text-gray-500 truncate">
                  <template v-if="conv.job">{{ conv.job.title }}<template v-if="conv.job.salaryMin && conv.job.salaryMax"> · {{ conv.job.salaryMin }}-{{ conv.job.salaryMax }}K</template> | </template>{{ conv.lastMessage || $t('暂无消息') }}
                </p>
                <span
                  v-if="conv.unreadCount > 0"
                  class="ml-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0"
                >{{ conv.unreadCount > 99 ? '99+' : conv.unreadCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div class="flex-1 flex flex-col">
      <template v-if="activeConvId">
        <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
          <div class="relative">
            <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
              {{ activeChatUser?.nickname?.charAt(0) || '?' }}
            </div>
            <span
              class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
              :class="otherUserOnline ? 'bg-blue-500' : 'bg-gray-300'"
            ></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 text-sm">{{ activeChatUser?.nickname || activeChatUser?.username }}</span>
              <span v-if="otherUserOnline" class="inline-flex items-center gap-1 text-xs font-medium text-blue-500"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{{ $t('在线') }}</span>
              <span v-else-if="otherUserLastOnline" class="text-xs text-gray-400">{{ formatLastOnline(otherUserLastOnline) }}</span>
            </div>
            <div v-if="activeConvJob" class="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span class="font-medium text-gray-600">{{ activeConvJob.companyName }}</span>
              <span class="text-gray-300">·</span>
              <span>{{ activeConvJob.title }}</span>
              <span v-if="activeConvJob.location" class="text-gray-300">·</span>
              <span v-if="activeConvJob.location">{{ activeConvJob.location }}</span>
              <span v-if="activeConvJob.salaryMin && activeConvJob.salaryMax" class="text-blue-600 font-medium">{{ activeConvJob.salaryMin }}-{{ activeConvJob.salaryMax }}K</span>
            </div>
            <div v-else class="text-xs text-gray-400 mt-0.5">{{ activeChatUser?.role === 'enterprise' ? $t('企业用户') : $t('求职者') }}</div>
          </div>
        </div>
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 space-y-4">
          <div v-if="messagesLoading" class="flex justify-center py-8">
            <div class="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <div v-for="msg in messages" :key="msg.id" class="flex" :class="isMine(msg) ? 'justify-end' : 'justify-start'">
            <div class="max-w-[70%]">
              <div
                class="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words"
                :class="isMine(msg)
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'"
              >{{ msg.content }}</div>
              <div class="text-xs text-gray-400 mt-1" :class="isMine(msg) ? 'text-right' : ''">
                {{ formatTime(msg.createdAt) }}
              </div>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 border-t border-gray-100">
          <!-- 简历投递面板 -->
          <div v-if="showResumePanel" class="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-blue-800">{{ $t('选择简历投递') }}</span>
              <button @click="showResumePanel = false" class="text-xs text-gray-400 hover:text-gray-600">{{ $t('关闭') }}</button>
            </div>
            <div v-if="resumesLoading" class="text-center py-2 text-sm text-gray-400">{{ $t('加载中...') }}</div>
            <div v-else-if="resumes.length === 0" class="text-center py-2 text-sm text-gray-400">{{ $t('暂无简历，请先创建') }}</div>
            <div v-else class="space-y-1.5 max-h-32 overflow-y-auto">
              <button
                v-for="r in resumes" :key="r.id"
                @click="submitResume(r)"
                :disabled="resumeSubmitting"
                class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors flex justify-between items-center"
              >
                <span>{{ r.title || $t('未命名简历') }}</span>
                <span class="text-xs text-blue-600">{{ $t('投递') }}</span>
              </button>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              v-if="!isEnterprise"
              @click="toggleResumePanel"
              class="px-3 py-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-sm"
              :title="$t('投递简历')"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </button>
            <input
              v-model="inputMessage"
              type="text"
              :placeholder="$t('输入消息...')"
              
              class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              @keyup.enter="send"
            />
            <button
              @click="send"
              :disabled="!inputMessage.trim()"
              class="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >{{ $t('发送') }}</button>
          </div>
        </div>
      </template>
      <div v-else class="flex-1 flex items-center justify-center text-gray-400">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-sm">{{ $t('选择一个对话开始聊天') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from '@/stores/user'
import { getConversationsApi, getMessagesApi, sendMessageApi, startConversationApi } from '@/api/chat'
import { createApplicationApi } from '@/api/application'
import { getUnreadCountApi } from '@/api/notification'
import { toast } from '@/utils/toast'
import request from '@/utils/request'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const route = useRoute()
const userStore = useUserStore()
const currentUserId = computed(() => userStore.userInfo?.id)
const isEnterprise = computed(() => userStore.userInfo?.role === 'enterprise')

const conversations = ref<any[]>([])
const conversationsLoading = ref(true)
const activeConvId = ref<number | null>(null)
const activeChatUser = ref<any>(null)
const messages = ref<any[]>([])
const messagesLoading = ref(false)
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()

function isMine(msg: any) {
  return Number(msg.senderId) === Number(currentUserId.value)
}

const activeConvJob = computed(() => {
  if (!activeConvId.value) return null
  const conv = conversations.value.find((c: any) => c.id === activeConvId.value)
  return conv?.job || null
})

let socket: Socket | null = null
const showResumePanel = ref(false)
const resumes = ref<any[]>([])
const resumesLoading = ref(false)
const resumeSubmitting = ref(false)
const notificationUnreadCount = ref(0)
const onlineStatusMap = ref<Record<number, { online: boolean; lastOnlineAt: string | null }>>({})
const otherUserOnline = ref(false)
const otherUserLastOnline = ref<string | null>(null)
let onlineTimer: ReturnType<typeof setInterval> | null = null

async function fetchNotificationUnreadCount() {
  try {
    const res: any = await getUnreadCountApi()
    notificationUnreadCount.value = typeof res.data === 'number' ? res.data : 0
  } catch {
    notificationUnreadCount.value = 0
  }
}

function getOtherUser(conv: any) {
  if (!conv) return { id: 0, nickname: '?', username: '?', role: '' }
  const myId = Number(currentUserId.value)
  const isA = Number(conv.userAId) === myId
  const other = isA ? conv.userB : conv.userA
  return other || { id: isA ? conv.userBId : conv.userAId, nickname: t('用户'), username: t('用户'), role: '' }
}

function applyPresenceUpdate(payload: { userId: number; online: boolean; lastOnlineAt?: string | null }) {
  if (!payload?.userId) return
  onlineStatusMap.value = {
    ...onlineStatusMap.value,
    [payload.userId]: {
      online: Boolean(payload.online),
      lastOnlineAt: payload.lastOnlineAt || null,
    },
  }
  if (activeChatUser.value?.id === payload.userId) {
    otherUserOnline.value = Boolean(payload.online)
    otherUserLastOnline.value = payload.lastOnlineAt || null
  }
}

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatLastOnline(dateStr: string | null) {
  if (!dateStr) return t('离线')
  const d = new Date(dateStr)
  const now = Date.now()
  const diff = now - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return t('刚刚在线')
  if (mins < 60) return t('{n}分钟前在线').replace('{n}', String(mins))
  const hours = Math.floor(mins / 60)
  if (hours < 24) return t('{n}小时前在线').replace('{n}', String(hours))
  const days = Math.floor(hours / 24)
  return t('{n}天前在线').replace('{n}', String(days))
}

async function fetchOnlineStatus() {
  const userIds = conversations.value.map(c => {
    const other = getOtherUser(c)
    return other?.id
  }).filter(Boolean)
  if (userIds.length === 0) return
  try {
    const res: any = await request.get('/chat/online-status', { params: { userIds: userIds.join(',') } })
    onlineStatusMap.value = res.data || {}
    if (activeChatUser.value?.id) {
      const status = onlineStatusMap.value[activeChatUser.value.id]
      otherUserOnline.value = status?.online || false
      otherUserLastOnline.value = status?.lastOnlineAt || null
    }
  } catch { /* ignore */ }
}

async function fetchConversations() {
  conversationsLoading.value = true
  try {
    const res: any = await getConversationsApi()
    conversations.value = res.data || res || []
  } catch { conversations.value = [] }
  finally { conversationsLoading.value = false }
}

async function selectConversation(conv: any) {
  activeConvId.value = conv.id
  activeChatUser.value = getOtherUser(conv)
  const status = onlineStatusMap.value[activeChatUser.value?.id]
  otherUserOnline.value = status?.online || false
  otherUserLastOnline.value = status?.lastOnlineAt || null
  messagesLoading.value = true
  try {
    const res: any = await getMessagesApi(conv.id)
    messages.value = res.data?.list || res.list || []
    conv.unreadCount = 0
    socket?.emit('joinConversation', { conversationId: conv.id })
  } catch { messages.value = [] }
  finally {
    messagesLoading.value = false
    scrollToBottom()
  }
}

async function send() {
  const content = inputMessage.value.trim()
  if (!content || !activeConvId.value) return
  inputMessage.value = ''
  try {
    if (socket?.connected) {
      socket.emit('sendMessage', { conversationId: activeConvId.value, content })
    } else {
      const res: any = await sendMessageApi({ conversationId: activeConvId.value, content })
      messages.value.push(res.data || res)
      scrollToBottom()
    }
  } catch { /* error handled by interceptor */ }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function toggleResumePanel() {
  if (isEnterprise.value) {
    toast(t('企业账号不能投递简历'), 'warning')
    return
  }
  showResumePanel.value = !showResumePanel.value
  if (showResumePanel.value && resumes.value.length === 0) {
    resumesLoading.value = true
    try {
      const res: any = await request.get('/resumes')
      resumes.value = Array.isArray(res.data) ? res.data : (res.data?.list ?? [])
    } catch { resumes.value = [] }
    finally { resumesLoading.value = false }
  }
}

async function submitResume(resume: any) {
  if (isEnterprise.value) {
    toast(t('企业账号不能投递简历'), 'warning')
    return
  }
  if (!activeConvId.value || resumeSubmitting.value) return
  resumeSubmitting.value = true
  try {
    const activeConv = conversations.value.find(c => c.id === activeConvId.value)
    const jobId = activeConv?.jobId || Number(route.query.jobId) || undefined

    await createApplicationApi({
      jobId,
      resumeId: resume.id,
    })

    const resumeMsg = `📄 ${t('简历投递成功！')} 「${resume.title || t('未命名简历')}」`
    await sendMessageApi({ conversationId: activeConvId.value, content: resumeMsg })
    messages.value.push({
      id: Date.now(),
      conversationId: activeConvId.value,
      senderId: currentUserId.value,
      content: resumeMsg,
      createdAt: new Date().toISOString(),
    })
    scrollToBottom()
    showResumePanel.value = false
    toast(t('简历投递成功！'), 'success')
  } catch { /* interceptor handles */ }
  finally { resumeSubmitting.value = false }
}

function initSocket() {
  const token = localStorage.getItem('token')
  if (!token) return

  socket = io('/chat', { auth: { token }, path: '/socket.io', transports: ['websocket', 'polling'] })

  socket.on('connect', () => {
    fetchOnlineStatus()
    if (activeConvId.value) {
      socket?.emit('joinConversation', { conversationId: activeConvId.value })
    }
  })

  socket.on('newMessage', (msg: any) => {
    if (msg.conversationId === activeConvId.value) {
      const exists = messages.value.some(m => m.id === msg.id)
      if (!exists) {
        messages.value.push(msg)
        scrollToBottom()
      }
    }
    fetchConversations()
  })

  socket.on('conversationUpdated', () => {
    fetchConversations()
  })

  socket.on('presenceChanged', (payload: { userId: number; online: boolean; lastOnlineAt?: string | null }) => {
    applyPresenceUpdate(payload)
  })
}

async function handleStartConversation() {
  const targetUserId = Number(route.query.userId)
  const jobId = route.query.jobId ? Number(route.query.jobId) : undefined
  if (!targetUserId || isNaN(targetUserId)) return

  conversationsLoading.value = true
  try {
    const res: any = await startConversationApi({
      targetUserId,
      jobId,
      content: decodeURIComponent((route.query.message as string) || t('你好，我对这个职位很感兴趣！')),
    })
    await fetchConversations()
    await fetchOnlineStatus()
    const conv = res.data?.conversation || res.conversation
    if (conv) {
      const found = conversations.value.find((c: any) => c.id === conv.id)
      if (found) selectConversation(found)
      else selectConversation(conv)
    }
  } catch (e: any) {
    toast(e?.response?.data?.message || t('发起对话失败'), 'error')
  } finally {
    conversationsLoading.value = false
  }
}

onMounted(async () => {
  if (!userStore.userInfo) {
    try { await userStore.fetchUserInfo() } catch { /* */ }
  }
  if (!currentUserId.value) return
  await fetchConversations()
  await fetchNotificationUnreadCount()
  await fetchOnlineStatus()
  onlineTimer = setInterval(fetchOnlineStatus, 30000)
  initSocket()

  if (route.query.userId) {
    handleStartConversation()
  } else if (route.query.convId) {
    const conv = conversations.value.find(c => c.id === Number(route.query.convId))
    if (conv) selectConversation(conv)
  }
})

onUnmounted(() => {
  if (socket) { socket.disconnect(); socket = null }
  if (onlineTimer) { clearInterval(onlineTimer); onlineTimer = null }
})

watch(() => route.query, (q) => {
  if (q.userId) handleStartConversation()
}, { deep: true })
</script>
