<template>
  <div>
    <a-page-header title="AI 调用日志" sub-title="查看 AI 接口调用记录" />

    <a-card :bordered="false">
      <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px">
        <a-button type="primary" @click="fetchLogs" :loading="loading">刷新</a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="logs"
        row-key="id"
        size="small"
        :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` }"
      />
      <a-empty v-if="!loading && logs.length === 0" description="暂无调用日志" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const loading = ref(false)
const logs = ref<any[]>([])

const columns = [
  { title: 'ID', dataIndex: 'id', width: 70 },
  { title: '场景', dataIndex: 'scene', width: 120 },
  { title: '模型', dataIndex: 'model', width: 140 },
  { title: 'Token数', dataIndex: 'tokens', width: 90 },
  { title: '耗时(ms)', dataIndex: 'duration', width: 90 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '调用时间', dataIndex: 'createdAt', width: 180 },
]

async function fetchLogs() {
  loading.value = true
  try {
    const res: any = await request.get('/system/ai-logs')
    if (res.data?.success) {
      logs.value = res.data?.data || []
    } else {
      logs.value = []
    }
  } catch {
    logs.value = []
  }
  finally { loading.value = false }
}

onMounted(fetchLogs)
</script>
