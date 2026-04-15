<template>
  <div class="-mt-6 -mx-4 sm:-mx-6 lg:-mx-8">
    <!-- Hero -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-16 text-center text-white">
      <h1 class="text-3xl sm:text-4xl font-bold mb-3">AI 赋能，大学生求职更高效</h1>
      <p class="text-blue-100 text-base max-w-xl mx-auto mb-8">专为应届毕业生打造——智能面试模拟、简历 AI 优化、校招投递追踪、求职社区交流</p>
      <div class="flex justify-center gap-3">
        <router-link to="/jobs" class="px-6 py-2.5 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">浏览职位</router-link>
        <router-link to="/interview" class="px-6 py-2.5 border border-white/40 text-white rounded-lg font-medium text-sm hover:bg-white/10 transition-colors">开始模拟面试</router-link>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Feature cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-8 relative z-10">
        <router-link
          v-for="f in features"
          :key="f.title"
          :to="f.link"
          class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3" :style="{ background: f.bg }">
            <svg class="w-5 h-5" :style="{ color: f.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="f.path" />
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{{ f.title }}</h3>
          <p class="text-sm text-gray-500">{{ f.desc }}</p>
        </router-link>
      </section>

      <!-- Stats -->
      <section class="grid grid-cols-2 sm:grid-cols-4 gap-4 my-10">
        <div v-for="s in platformStats" :key="s.label" class="text-center py-4">
          <div class="text-2xl font-bold text-gray-900">{{ s.value }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ s.label }}</div>
        </div>
      </section>

      <!-- Latest Jobs -->
      <section class="mb-10">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">最新职位</h2>
          <router-link to="/jobs" class="text-sm text-blue-600 hover:underline">查看全部</router-link>
        </div>
        <div v-if="jobsLoading" class="flex justify-center py-8">
          <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="job in latestJobs"
            :key="job.id"
            class="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            @click="$router.push('/jobs')"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-900 text-sm">{{ job.title }}</h3>
              <span v-if="job.salaryMin && job.salaryMax" class="text-sm font-medium text-blue-600">{{ job.salaryMin }}-{{ job.salaryMax }}K</span>
            </div>
            <div class="text-sm text-gray-600 mb-2">{{ job.companyName }}</div>
            <div class="flex flex-wrap gap-1.5">
              <span v-if="job.location" class="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded">{{ job.location }}</span>
              <span v-if="job.workType" class="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded">{{ job.workType }}</span>
              <span v-if="job.positionType" class="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded">{{ job.positionType }}</span>
            </div>
          </div>
        </div>
        <div v-if="!jobsLoading && latestJobs.length === 0" class="text-center py-8 text-gray-400 text-sm">暂无职位</div>
      </section>

      <!-- Hot Posts -->
      <section class="mb-10">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">热门讨论</h2>
          <router-link to="/community" class="text-sm text-blue-600 hover:underline">查看全部</router-link>
        </div>
        <div v-if="postsLoading" class="flex justify-center py-8">
          <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="post in hotPosts"
            :key="post.id"
            class="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            @click="$router.push(`/community/post/${post.id}`)"
          >
            <h3 class="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">{{ post.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ stripHtml(post.content) }}</p>
            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span>{{ post.author?.nickname || '匿名' }}</span>
              <span>{{ post.likeCount || 0 }} 赞</span>
              <span>{{ post.commentCount || 0 }} 评</span>
            </div>
          </div>
        </div>
        <div v-if="!postsLoading && hotPosts.length === 0" class="text-center py-8 text-gray-400 text-sm">暂无帖子</div>
      </section>

      <!-- CTA -->
      <section class="bg-gray-50 rounded-xl p-8 text-center mb-10 border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-2">准备好开启校园求职之旅了吗？</h2>
        <p class="text-gray-500 text-sm mb-5">注册账号，享受 AI 驱动的一站式校园招聘服务</p>
        <div class="flex justify-center gap-3">
          <router-link to="/register" class="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium">免费注册</router-link>
          <router-link to="/about" class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 font-medium">了解更多</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const features = [
  { title: 'AI 模拟面试', desc: '智能生成面试题，多维度评分', color: '#2563eb', bg: '#eff6ff', link: '/interview', path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: '简历管理', desc: '模板系统，AI 分析与优化', color: '#7c3aed', bg: '#f5f3ff', link: '/resumes', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: '投递追踪', desc: '状态流转，日历与数据统计', color: '#059669', bg: '#ecfdf5', link: '/applications', path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: '求职社区', desc: '面经分享，评论互动交流', color: '#dc2626', bg: '#fef2f2', link: '/community', path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
]

const platformStats = ref([
  { value: '-', label: '注册用户' },
  { value: '-', label: '在招职位' },
  { value: '-', label: '简历模板' },
  { value: '-', label: '社区帖子' },
])

const latestJobs = ref<any[]>([])
const hotPosts = ref<any[]>([])
const jobsLoading = ref(true)
const postsLoading = ref(true)

function stripHtml(html: string) {
  return (html || '').replace(/<[^>]+>/g, '').substring(0, 120)
}

async function fetchHomeData() {
  try {
    const [jobRes, postRes]: any[] = await Promise.all([
      request.get('/jobs', { params: { page: 1, pageSize: 6 } }),
      request.get('/community/posts', { params: { page: 1, pageSize: 4, sort: 'hot' } }),
    ])
    latestJobs.value = (jobRes.data?.list || jobRes.list || []).slice(0, 6)
    hotPosts.value = (postRes.data?.list || postRes.list || []).slice(0, 4)

    const totalJobs = jobRes.data?.total || jobRes.total || 0
    const totalPosts = postRes.data?.total || postRes.total || 0
    platformStats.value = [
      { value: totalJobs > 0 ? `${totalJobs}+` : '0', label: '校招职位' },
      { value: totalPosts > 0 ? `${totalPosts}+` : '0', label: '校招面经' },
      { value: `${latestJobs.value.length}+`, label: '校园简历模板' },
      { value: '4', label: '核心功能模块' },
    ]
  } catch {}
  finally {
    jobsLoading.value = false
    postsLoading.value = false
  }
}

onMounted(fetchHomeData)
</script>
