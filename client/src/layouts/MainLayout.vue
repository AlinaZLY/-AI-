<template>
  <div class="min-h-screen">
    <nav class="sticky top-0 z-50 border-b border-white/40 shadow-sm" style="background: rgba(255,255,255,0.65); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <router-link to="/home" class="flex items-center gap-2 text-xl font-bold text-blue-600">
              <img v-if="siteLogo" :src="siteLogo" alt="LOGO" class="w-8 h-8 rounded-md object-contain" />
              <span>{{ siteTitle }}</span>
            </router-link>
            <div class="hidden md:flex gap-1">
              <router-link v-for="item in navItems" :key="item.path" :to="item.path"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="$route.path.startsWith(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'">
                {{ item.name }}
              </router-link>
            </div>
            <!-- 移动端汉堡菜单 -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-gray-600 hover:text-blue-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex items-center gap-4">
            <LocaleSwitch />
            <template v-if="userStore.token">
              <router-link
                to="/chat"
                class="relative p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                :title="$t('消息沟通')"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span
                  v-if="unreadChatCount > 0"
                  class="absolute top-1 right-1 min-w-[1.125rem] h-[1.125rem] px-0.5 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none"
                >
                  {{ unreadChatCount > 99 ? '99+' : unreadChatCount }}
                </span>
              </router-link>
              <router-link
                to="/notifications"
                class="relative p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                :title="$t('消息通知')"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span
                  v-if="unreadNotificationCount > 0"
                  class="absolute top-1 right-1 min-w-[1.125rem] h-[1.125rem] px-0.5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none"
                >
                  {{ unreadNotificationCount > 99 ? '99+' : unreadNotificationCount }}
                </span>
              </router-link>
              <router-link to="/user-center" class="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="w-8 h-8 rounded-full object-cover" />
                <div v-else class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {{ (userStore.userInfo?.nickname || userStore.userInfo?.username || '用').charAt(0) }}
                </div>
                <span class="hidden sm:inline">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
              </router-link>
              <button @click="userStore.logout()" class="text-sm text-gray-500 hover:text-red-500">{{ $t('退出') }}</button>
            </template>
            <template v-else>
              <router-link to="/login" class="text-sm text-gray-600 hover:text-blue-600">{{ $t('登录') }}</router-link>
              <router-link to="/register" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">{{ $t('注册') }}</router-link>
            </template>
          </div>
        </div>
        <!-- 移动端导航菜单 -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 py-2">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path"
            class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path.startsWith(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'"
            @click="mobileMenuOpen = false">
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>
    <main class="w-full px-4 sm:px-6 lg:px-8 py-6 min-h-[80vh]">
      <router-view />
    </main>
    <footer class="bg-gray-900 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="md:col-span-1">
            <div class="flex items-center gap-2 mb-3">
              <img v-if="siteLogo" :src="siteLogo" alt="LOGO" class="w-8 h-8 rounded-lg object-contain" />
              <div v-else class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <span class="text-white font-bold">{{ siteTitle }}</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">{{ $t('基于人工智能的校园招聘服务平台，助力大学生高效求职。') }}</p>
          </div>
          <div>
            <h4 class="text-white font-medium mb-3">{{ $t('核心功能') }}</h4>
            <div class="space-y-2">
              <router-link to="/jobs" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('职位浏览') }}</router-link>
              <router-link to="/resumes" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('简历模板') }}</router-link>
              <router-link to="/interview" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('AI 模拟面试') }}</router-link>
              <router-link to="/community" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('求职社区') }}</router-link>
            </div>
          </div>
          <div>
            <h4 class="text-white font-medium mb-3">{{ $t('个人中心') }}</h4>
            <div class="space-y-2">
              <router-link to="/my-resumes" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('我的简历') }}</router-link>
              <router-link to="/applications" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('投递追踪') }}</router-link>
              <router-link to="/notifications" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('消息通知') }}</router-link>
              <router-link to="/profile" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('个人资料') }}</router-link>
            </div>
          </div>
          <div>
            <h4 class="text-white font-medium mb-3">{{ $t('关于项目') }}</h4>
            <div class="space-y-2">
              <router-link to="/about" class="block text-gray-400 text-sm hover:text-blue-400 transition-colors">{{ $t('关于我们') }}</router-link>
              <span class="block text-gray-400 text-sm">{{ $t('技术栈：Vue 3 + NestJS') }}</span>
              <span class="block text-gray-400 text-sm">{{ $t('AI：火山方舟大模型') }}</span>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <p class="text-gray-500 text-sm">&copy; 2026 {{ $t('基于 AI 的校园招聘服务平台 · 毕业设计作品') }}</p>
            <p class="text-gray-500 text-xs mt-1">{{ $t('团队成员：张灵宇 · 张俊逸 · 王思远 · 田杰') }}</p>
          </div>
          <p class="text-gray-600 text-xs">Vue 3 · NestJS · MySQL · Redis · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUnreadCountApi } from '@/api/notification'
import request from '@/utils/request'
import LocaleSwitch from '@/components/LocaleSwitch.vue'
import { useI18n } from '@/i18n'

const NOTIFICATIONS_CHANGED = 'app:notifications-changed'

const userStore = useUserStore()
const route = useRoute()
const { t } = useI18n()
const mobileMenuOpen = ref(false)
const unreadNotificationCount = ref(0)
const unreadChatCount = ref(0)
const userRole = computed(() => userStore.userInfo?.role || '')
const siteLogo = ref('')
const siteTitle = ref('校园招聘平台')

function unwrapPayload<T = unknown>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) {
    return res.data as T
  }
  return res as T
}

async function fetchUnreadNotificationCount() {
  if (!userStore.token) {
    unreadNotificationCount.value = 0
    return
  }
  try {
    const res: any = await getUnreadCountApi()
    const n = unwrapPayload<number>(res)
    unreadNotificationCount.value = typeof n === 'number' ? n : 0
  } catch {
    unreadNotificationCount.value = 0
  }
}

function onNotificationsChanged() {
  fetchUnreadNotificationCount()
}

const navItems = computed(() => {
  const base = [
    { name: t('首页'), path: '/home' },
    { name: t('职位'), path: '/jobs' },
    { name: t('企业'), path: '/companies' },
    { name: t('社区'), path: '/community' },
    { name: t('简历'), path: '/resumes' },
  ]
  if (userRole.value === 'enterprise') {
    return [
      { name: t('首页'), path: '/home' },
      { name: t('职位'), path: '/jobs' },
      { name: t('企业'), path: '/companies' },
      { name: t('社区'), path: '/community' },
      { name: t('申请记录'), path: '/applications' },
      { name: t('企业认证'), path: '/enterprise-cert' },
    ]
  }
  return [
    ...base,
    { name: t('模拟面试'), path: '/interview' },
  ]
})

async function fetchUnreadChatCount() {
  if (!userStore.token) { unreadChatCount.value = 0; return }
  try {
    const res: any = await request.get('/chat/unread')
    unreadChatCount.value = typeof res.data === 'number' ? res.data : 0
  } catch { unreadChatCount.value = 0 }
}

async function fetchSiteSettings() {
  try {
    const res: any = await request.get('/system/settings/public')
    if (res.data?.site_logo) siteLogo.value = res.data.site_logo
    if (res.data?.siteName) siteTitle.value = res.data.siteName
  } catch { /* use defaults */ }
}

onMounted(() => {
  fetchSiteSettings()
  if (userStore.token && !userStore.userInfo) {
    userStore.fetchUserInfo().catch(() => {})
  }
  fetchUnreadNotificationCount()
  fetchUnreadChatCount()
  window.addEventListener(NOTIFICATIONS_CHANGED, onNotificationsChanged)
})

onUnmounted(() => {
  window.removeEventListener(NOTIFICATIONS_CHANGED, onNotificationsChanged)
})

watch(
  () => userStore.token,
  (t) => {
    if (t) { fetchUnreadNotificationCount(); fetchUnreadChatCount() }
    else { unreadNotificationCount.value = 0; unreadChatCount.value = 0 }
  },
)

watch(
  () => route.path,
  (p) => {
    if (userStore.token && p === '/notifications') {
      fetchUnreadNotificationCount()
    }
  },
)
</script>
