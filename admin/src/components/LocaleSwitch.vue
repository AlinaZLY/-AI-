<template>
  <a-select
    :value="locale"
    size="small"
    class="locale-switch"
    @change="handleChange"
  >
    <a-select-option v-for="item in localeOptions" :key="item.value" :value="item.value">
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { locale, localeOptions, setLocale } = useI18n()

function handleChange(value: string) {
  setLocale(value)
}
</script>

<style scoped>
.locale-switch {
  width: 112px;
}
</style>
