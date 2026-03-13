<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="confirmState.visible" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" @click.self="onCancel">
        <div class="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden animate-scale-in">
          <div class="px-6 pt-6 pb-2">
            <h3 class="text-lg font-semibold text-gray-900">{{ confirmState.title }}</h3>
          </div>
          <div class="px-6 py-3">
            <p class="text-sm text-gray-600 leading-relaxed">{{ confirmState.message }}</p>
          </div>
          <div class="px-6 pb-5 pt-2 flex justify-end gap-2">
            <button
              v-if="confirmState.type === 'confirm'"
              @click="onCancel"
              class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ confirmState.cancelText }}
            </button>
            <button
              @click="onConfirm"
              class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
import { confirmState, resolveConfirm } from '@/utils/confirm'

function onConfirm() { resolveConfirm(true) }
function onCancel() { resolveConfirm(false) }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-scale-in { animation: scaleIn 0.15s ease; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
