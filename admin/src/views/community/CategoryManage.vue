<template>
  <div class="category-manage">
    <a-alert
      message="帖子分类目前为系统内置分类，如需新增分类请联系开发人员。"
      type="info"
      show-icon
      style="margin-bottom: 16px"
    />

    <a-table
      :columns="columns"
      :data-source="categories"
      :pagination="false"
      row-key="value"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'tag'">
          <a-tag :color="record.color">{{ record.label }}</a-tag>
        </template>
        <template v-if="column.key === 'count'">
          <span>{{ record.count }}</span>
        </template>
      </template>
    </a-table>

    <a-card title="分类统计" style="margin-top: 16px" :loading="statsLoading">
      <a-row :gutter="16">
        <a-col :span="8" v-for="item in categories" :key="item.value">
          <a-statistic :title="item.label" :value="item.count" style="margin-bottom: 16px">
            <template #prefix>
              <component :is="item.icon" />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  TrophyOutlined,
  FormOutlined,
  SearchOutlined,
  BankOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue'
import { getPostsApi } from '@/api/community'

const statsLoading = ref(false)

const columns = [
  { title: '分类值', dataIndex: 'value', key: 'value', width: 140 },
  { title: '显示名称', key: 'tag', width: 120 },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '帖子数', key: 'count', width: 100 },
]

const categories = ref([
  { value: 'interview', label: '面试经验', color: 'blue', description: '分享面试过程、面试题目、面试技巧等', icon: TrophyOutlined, count: 0 },
  { value: 'written_test', label: '笔试真题', color: 'purple', description: '笔试真题分享、解题思路、备考经验', icon: FormOutlined, count: 0 },
  { value: 'job_hunting', label: '求职交流', color: 'green', description: '求职心得、职业规划、简历指导等', icon: SearchOutlined, count: 0 },
  { value: 'company', label: '公司点评', color: 'orange', description: '公司文化、工作环境、薪资待遇等评价', icon: BankOutlined, count: 0 },
  { value: 'other', label: '其他', color: 'default', description: '其他与校园招聘相关的讨论', icon: MoreOutlined, count: 0 },
])

async function fetchCategoryCounts() {
  statsLoading.value = true
  try {
    for (const cat of categories.value) {
      const res = await getPostsApi({ category: cat.value, pageSize: 1 })
      cat.count = res.total
    }
  } catch {
    message.error('获取分类统计失败')
  } finally {
    statsLoading.value = false
  }
}

onMounted(() => fetchCategoryCounts())
</script>

<style scoped lang="less">
.category-manage {
  max-width: 900px;
}
</style>
