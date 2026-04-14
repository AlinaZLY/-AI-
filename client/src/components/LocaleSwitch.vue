<template>
  <div class="relative" ref="dropdownRef">
    <button
      type="button"
      class="locale-btn"
      @click="open = !open"
    >
      <svg class="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
      <span>{{ currentLabel }}</span>
      <svg class="w-3.5 h-3.5 opacity-40 transition-transform" :class="open ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
    <Transition name="dropdown">
      <div v-if="open" class="locale-menu">
        <button
          v-for="item in localeOptions"
          :key="item.value"
          type="button"
          class="locale-item"
          :class="{ active: item.value === locale }"
          @click="selectLocale(item.value)"
        >
          {{ item.label }}
          <svg v-if="item.value === locale" class="w-3.5 h-3.5 text-blue-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/i18n'

const { locale, localeOptions, setLocale } = useI18n()
const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currentLabel = computed(() => localeOptions.value.find(o => o.value === locale.value)?.label || locale.value)

function selectLocale(value: string) {
  setLocale(value)
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.locale-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.9);
  color: #4b5563;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.locale-btn:hover {
  border-color: #93c5fd;
  background: #eff6ff;
}

.locale-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 130px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 4px;
  z-index: 50;
}

.locale-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 7px 10px;
  font-size: 13px;
  color: #4b5563;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.12s;
  border: none;
  background: none;
}
.locale-item:hover {
  background: #f0f5ff;
  color: #2563eb;
}
.locale-item.active {
  color: #2563eb;
  font-weight: 500;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
