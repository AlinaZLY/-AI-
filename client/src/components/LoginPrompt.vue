<template>
  <div class="flex flex-col items-center justify-center py-20 px-4">
    <div class="w-16 h-16 mb-6 rounded-full bg-blue-50 flex items-center justify-center">
      <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
    <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
    <p class="text-gray-500 text-sm mb-6 text-center max-w-sm">{{ description }}</p>
    <div class="flex gap-3">
      <router-link
        :to="{ name: 'Login', query: { redirect: currentPath } }"
        class="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        {{ $t('立即登录') }}
      </router-link>
      <router-link
        to="/register"
        class="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        {{ $t('注册账号') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n'

const { t } = useI18n()

withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: '请先登录',
  description: '登录后即可使用此功能，体验更多精彩服务',
})

const route = useRoute()
const currentPath = computed(() => route.fullPath)
</script>
