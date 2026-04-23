<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="flex items-center justify-between mb-6">
        <router-link to="/home" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {{ $t('返回首页') }}
        </router-link>
        <LocaleSwitch />
      </div>
      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('AI 校园招聘平台') }}</h1>
        <p class="text-gray-400 mt-1 text-sm">{{ $t('大学生 / 企业用户登录') }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form @submit.prevent="handleLogin" autocomplete="off" class="space-y-4">
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </span>
            <input v-model="form.username" type="text" required autocomplete="new-password"
              class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              :placeholder="$t('用户名')" />
          </div>
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </span>
            <input v-model="form.password" type="password" required autocomplete="new-password"
              class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              :placeholder="$t('密码')" />
          </div>
          <div class="flex gap-3">
            <div class="relative flex-1">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </span>
              <input v-model="form.captcha" type="text" required autocomplete="off"
                class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                :placeholder="$t('验证码')" />
            </div>
            <div class="cursor-pointer border border-gray-200 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 flex items-center hover:border-blue-300 transition"
              @click="refreshCaptcha" v-html="captchaSvg" />
          </div>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition-colors shadow-sm shadow-blue-600/20">
            {{ loading ? $t('登录中...') : $t('登录') }}
          </button>
        </form>

        <div class="mt-5 pt-4 border-t border-gray-100">
          <p class="text-center text-[11px] text-gray-400 mb-3">{{ $t('快捷体验登录') }}</p>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="quickLogin('student')" :disabled="loading"
              class="flex items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-2.5 hover:border-blue-300 hover:bg-blue-50/50 transition-all group disabled:opacity-50">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div class="text-left">
                <div class="text-xs font-medium text-gray-700 group-hover:text-blue-700">{{ $t('应聘者') }}</div>
                <div class="text-[10px] text-gray-400">student</div>
              </div>
            </button>
            <button type="button" @click="quickLogin('enterprise')" :disabled="loading"
              class="flex items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-2.5 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group disabled:opacity-50">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div class="text-left">
                <div class="text-xs font-medium text-gray-700 group-hover:text-emerald-700">{{ $t('企业用户') }}</div>
                <div class="text-[10px] text-gray-400">enterprise</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          {{ $t('没有账号？') }}<router-link to="/register" class="text-blue-600 hover:underline font-medium">{{ $t('注册') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import LocaleSwitch from '@/components/LocaleSwitch.vue'
import { useI18n } from '@/i18n'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()
const loading = ref(false)
const captchaSvg = ref('')
const captchaKey = ref('')
const form = reactive({ username: '', password: '', captcha: '' })

async function quickLogin(type: 'student' | 'enterprise') {
  form.username = type === 'student' ? 'student' : 'enterprise'
  form.password = type === 'student' ? 'student123' : 'enterprise123'
  form.captcha = '__quick_demo__'
  await handleLogin()
}

async function refreshCaptcha() {
  try {
    const res: any = await request.get('/auth/captcha')
    captchaSvg.value = res.data.captchaSvg
    captchaKey.value = res.data.captchaKey
  } catch {}
}

async function handleLogin() {
  if (!form.username || !form.password || !form.captcha) {
    toast(t('请填写完整'), 'warning')
    return
  }
  loading.value = true
  try {
    await userStore.login({ ...form, captchaKey: captchaKey.value })
    toast(t('登录成功'), 'success')
    const redirect = route.query.redirect as string
    const safeRedirect = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/home'
    router.push(safeRedirect)
  } catch {
    refreshCaptcha()
    form.captcha = ''
  } finally { loading.value = false }
}

onMounted(() => {
  refreshCaptcha()
  if (route.query.username) {
    form.username = route.query.username as string
  }
})
</script>
