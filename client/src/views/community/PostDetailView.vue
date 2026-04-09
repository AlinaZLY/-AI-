<template>
  <div class="page-shell" v-if="post">
    <button @click="$router.back()" class="text-sm text-gray-500 hover:text-blue-600 mb-4">&larr; 返回社区</button>
    <div class="bg-white rounded-xl p-8 border border-gray-100">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
      <div class="flex items-center gap-3 mb-6 text-sm text-gray-500">
        <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">{{ (post.user?.nickname || '?').charAt(0) }}</div>
        <span>{{ post.user?.nickname || post.user?.username }}</span>
        <span>{{ formatTime(post.createdAt) }}</span>
        <span v-if="post.category" class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">{{ post.category.name }}</span>
      </div>
      <div class="prose max-w-none" v-html="sanitize(post.content)"></div>
      <div v-if="displayImages.length" class="flex flex-wrap gap-3 mt-4">
        <a
          v-for="(src, i) in displayImages"
          :key="i + src"
          :href="src"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-lg border border-gray-100 overflow-hidden bg-gray-50 hover:opacity-95 transition-opacity"
          @click.stop
        >
          <img :src="src" alt="" class="max-h-72 max-w-full object-contain" loading="lazy" />
        </a>
      </div>
      <div class="flex gap-6 mt-6 pt-4 border-t text-sm text-gray-400">
        <button @click="toggleLike" class="flex items-center gap-1 hover:text-red-500 transition-colors" :class="post.isLiked ? 'text-red-500' : ''">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          {{ post.likeCount }}
        </button>
        <button @click="toggleFavorite" class="flex items-center gap-1 hover:text-yellow-500 transition-colors" :class="post.isFavorited ? 'text-yellow-500' : ''">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          {{ post.favoriteCount }}
        </button>
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          {{ post.viewCount }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          {{ post.commentCount }}
        </span>
      </div>
    </div>

    <!-- 评论输入 -->
    <div v-if="userStore.token" class="mt-4 bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="font-semibold text-gray-900 mb-3">发表评论</h3>
      <textarea v-model="commentText" rows="3" placeholder="写下你的评论..."
        class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
      <div class="flex justify-between items-center mt-2">
        <span class="text-xs text-gray-400">{{ commentText.length }}/500</span>
        <button @click="submitComment" :disabled="!commentText.trim() || submitting"
          class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ submitting ? '提交中...' : '发表评论' }}
        </button>
      </div>
    </div>

    <div class="mt-4 bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="font-semibold text-gray-900 mb-4">评论 ({{ comments.length }})</h3>
      <div v-for="c in comments" :key="c.id" class="py-3 border-b border-gray-100 last:border-0">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 text-sm mb-1">
              <span class="font-medium text-gray-700">{{ c.user?.nickname || c.user?.username }}</span>
              <span class="text-gray-400 text-xs">{{ formatTime(c.createdAt) }}</span>
            </div>
            <p class="text-gray-600 text-sm">{{ c.content }}</p>
          </div>
          <button type="button" @click.stop="toggleCommentLike(c)" class="shrink-0 flex items-center gap-1 text-sm transition-colors"
            :class="c.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'">
            <svg class="w-4 h-4" :fill="c.isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ c.likeCount ?? 0 }}</span>
          </button>
        </div>
      </div>
      <div v-if="comments.length === 0" class="text-center text-gray-400 py-4">暂无评论</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import DOMPurify from 'dompurify'
import request from '@/utils/request'
import { likeCommentApi } from '@/api/community'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/toast'

const route = useRoute()
const userStore = useUserStore()
const post = ref<any>(null)
const comments = ref<any[]>([])
const commentText = ref('')
const submitting = ref(false)
const commentLikeLoading = ref<number | null>(null)

const displayImages = computed(() => {
  const imgs = post.value?.images
  if (!Array.isArray(imgs)) return [] as string[]
  return imgs.filter(
    (u: unknown) =>
      typeof u === 'string' && (/^https?:\/\//i.test(u) || u.startsWith('/uploads/')),
  ) as string[]
})

function sanitize(html: string) { return DOMPurify.sanitize(html) }
function formatTime(t: string) { return new Date(t).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }

async function fetchComments() {
  const id = route.params.id
  try {
    const res: any = await request.get(`/community/posts/${id}/comments`)
    comments.value = res.data || []
  } catch {}
}

async function submitComment() {
  if (!commentText.value.trim() || submitting.value) return
  submitting.value = true
  try {
    await request.post(`/community/posts/${route.params.id}/comments`, { content: commentText.value.trim() })
    commentText.value = ''
    toast('评论发表成功', 'success')
    await fetchComments()
    if (post.value) post.value.commentCount = (post.value.commentCount || 0) + 1
  } catch {} finally { submitting.value = false }
}

async function toggleLike() {
  if (!userStore.token) return toast('请先登录', 'warning')
  try {
    const res: any = await request.post(`/community/posts/${route.params.id}/like`)
    if (post.value) {
      post.value.isLiked = res.data?.isLiked ?? !post.value.isLiked
      post.value.likeCount = res.data?.likeCount ?? post.value.likeCount
    }
  } catch {}
}

async function toggleFavorite() {
  if (!userStore.token) return toast('请先登录', 'warning')
  try {
    const res: any = await request.post(`/community/posts/${route.params.id}/favorite`)
    if (post.value) {
      post.value.isFavorited = res.data?.isFavorited ?? !post.value.isFavorited
      post.value.favoriteCount = res.data?.favoriteCount ?? post.value.favoriteCount
    }
  } catch {}
}

async function toggleCommentLike(c: any) {
  if (!userStore.token) return toast('请先登录', 'warning')
  if (commentLikeLoading.value === c.id) return
  commentLikeLoading.value = c.id
  try {
    const res: any = await likeCommentApi(c.id)
    const liked = res.data?.liked
    if (liked === true) {
      c.isLiked = true
      c.likeCount = (c.likeCount ?? 0) + 1
    } else if (liked === false) {
      c.isLiked = false
      c.likeCount = Math.max(0, (c.likeCount ?? 0) - 1)
    }
  } catch {
  } finally {
    commentLikeLoading.value = null
  }
}

onMounted(async () => {
  const id = route.params.id
  try {
    const res: any = await request.get(`/community/posts/${id}`)
    post.value = res.data
  } catch {}
  await fetchComments()
})
</script>
