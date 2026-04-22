<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="confirmState.visible" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="onCancel">
        <div class="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden animate-scale-in">
          <!-- 顶部装饰条 -->
          <div class="h-1.5" :class="kindStyle.topBar"></div>

          <div class="px-6 pt-6 pb-2 flex items-start gap-4">
            <!-- 图标 -->
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm', kindStyle.iconBg]">
              <!-- info -->
              <svg v-if="confirmState.kind === 'info'" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <!-- success -->
              <svg v-else-if="confirmState.kind === 'success'" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <!-- warning -->
              <svg v-else-if="confirmState.kind === 'warning'" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" /></svg>
              <!-- danger -->
              <svg v-else class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>

            <div class="flex-1 min-w-0 pt-0.5">
              <h3 class="text-base font-semibold text-gray-900 leading-tight">{{ confirmState.title }}</h3>
              <p class="text-sm text-gray-600 leading-relaxed mt-1.5 whitespace-pre-line">{{ confirmState.message }}</p>
              <p v-if="confirmState.description" class="text-xs text-gray-400 leading-relaxed mt-2">{{ confirmState.description }}</p>
            </div>
          </div>

          <div class="px-6 pb-5 pt-4 flex justify-end gap-2 bg-gray-50/50">
            <button
              v-if="confirmState.type === 'confirm'"
              @click="onCancel"
              class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition"
            >
              {{ confirmState.cancelText }}
            </button>
            <button
              @click="onConfirm"
              :class="['px-4 py-2 text-sm font-medium text-white rounded-lg transition shadow-sm', kindStyle.confirmBtn]"
            >
              {{ confirmState.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { confirmState, resolveConfirm } from '@/utils/confirm'

function onConfirm() { resolveConfirm(true) }
function onCancel() { resolveConfirm(false) }

const kindStyle = computed(() => {
  switch (confirmState.kind) {
    case 'success':
      return {
        topBar: 'bg-gradient-to-r from-emerald-400 to-green-500',
        iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500',
        confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
      }
    case 'warning':
      return {
        topBar: 'bg-gradient-to-r from-amber-400 to-orange-500',
        iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
        confirmBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
      }
    case 'danger':
      return {
        topBar: 'bg-gradient-to-r from-red-400 to-rose-500',
        iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
        confirmBtn: 'bg-red-600 hover:bg-red-700 shadow-red-200',
      }
    default:
      return {
        topBar: 'bg-gradient-to-r from-blue-400 to-indigo-500',
        iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        confirmBtn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
      }
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-scale-in { animation: scaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn {
  from { transform: scale(0.92) translateY(8px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
</style>
