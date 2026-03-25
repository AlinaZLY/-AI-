<template>
  <a-config-provider :locale="antLocale">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { antLocale } = useI18n()
</script>
