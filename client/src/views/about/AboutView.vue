<template>
  <div class="bg-gray-50 -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
    <!-- Hero -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl page-shell mt-6 px-6 py-8 text-center">
      <h1 class="text-2xl font-bold text-white mb-1.5">基于 AI 的校园招聘服务平台</h1>
      <p class="text-blue-100 text-sm">{{ $t('融合人工智能技术，为校园求职者打造一站式智能招聘服务') }}</p>
    </div>

    <!-- Team -->
    <div class="page-shell py-14">
      <h2 class="text-xl font-bold text-gray-900 text-center mb-10">{{ $t('项目团队') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="member in members"
          :key="member.name"
          class="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div class="h-0.5 w-12 rounded mb-4" :style="{ background: member.color }"></div>
          <div class="text-base font-semibold text-gray-900 mb-1">{{ member.name }}</div>
          <p class="text-sm text-gray-500 leading-relaxed mb-4">{{ member.topic }}</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in member.tags"
              :key="tag"
              class="text-xs px-2.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech -->
    <div class="page-shell pb-14 text-center">
      <p class="text-sm text-gray-400 mb-3">{{ $t('技术栈') }}</p>
      <div class="flex flex-wrap justify-center gap-2">
        <span v-for="t in techStack" :key="t" class="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-100 rounded-full">{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const techStack = ['Vue 3', 'NestJS', 'MySQL', 'Redis', 'Tailwind CSS', '火山方舟 AI']

const members = [
  {
    name: '张力尹',
    topic: '基于AI的校园招聘服务平台的设计与实现——智能面试与评估模块',
    color: '#2563eb',
    tags: ['AI 模拟面试', '智能评分', '面试题库', '能力雷达图'],
  },
  {
    name: '王思远',
    topic: '基于AI的校园招聘服务平台的设计与实现——简历管理与AI优化模块',
    color: '#7c3aed',
    tags: ['多版本简历', '模板系统', 'AI 分析', '简历预览'],
  },
  {
    name: '王俊翔',
    topic: '基于AI的校园招聘服务平台的设计与实现——社区支持与用户中心模块',
    color: '#059669',
    tags: ['求职社区', '用户中心', '消息通知', '登录鉴权'],
  },
  {
    name: '张峻屹',
    topic: '基于AI的校园招聘服务平台的设计与实现——职位投递与流程追踪模块',
    color: '#dc2626',
    tags: ['投递追踪', '状态流转', '面试日历', '数据统计'],
  },
]
</script>
