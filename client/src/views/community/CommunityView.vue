<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">校园求职社区</h1>
      <div class="flex gap-3">
        <input v-if="activeTab === 'all'" v-model="keyword" type="text" placeholder="搜索帖子..." class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" @keyup.enter="refreshList" />
        <button v-if="userStore.token" @click="showCreateModal = true" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">发帖</button>
      </div>
    </div>

    <div class="flex gap-2 mb-4 border-b border-gray-200">
      <button type="button" @click="setTab('all')" :class="activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 text-sm -mb-px transition-colors">全部</button>
      <button type="button" @click="setTab('mine')" :class="activeTab === 'mine' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 text-sm -mb-px transition-colors">我的帖子</button>
      <button type="button" @click="setTab('favorites')" :class="activeTab === 'favorites' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 text-sm -mb-px transition-colors">我的收藏</button>
    </div>

    <div v-if="activeTab === 'all'" class="flex gap-3 mb-6 flex-wrap">
      <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = selectedCategory === cat.id ? null : cat.id; refreshList()"
        :class="selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
        class="px-4 py-1.5 rounded-full text-sm border border-gray-200 transition-colors">
        {{ cat.name }}
      </button>
    </div>

    <div v-if="(activeTab === 'mine' || activeTab === 'favorites') && !userStore.token" class="text-center py-16 text-gray-500">
      <p class="mb-3">登录后可查看{{ activeTab === 'mine' ? '我的帖子' : '我的收藏' }}</p>
      <router-link to="/login" class="text-blue-600 text-sm hover:underline">去登录</router-link>
    </div>

    <div v-else-if="loading" class="flex justify-center py-16">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
    <div v-else class="space-y-4">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer" @click="$router.push(`/community/post/${post.id}`)">
        <div class="flex gap-4 flex-wrap items-start">
          <div class="min-w-0 flex-1">
        <div class="flex items-center gap-3 mb-3 flex-wrap">
          <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">{{ (post.user?.nickname || post.user?.username || '?').charAt(0) }}</div>
          <span class="text-sm text-gray-600">{{ post.user?.nickname || post.user?.username }}</span>
          <span class="text-xs text-gray-400">{{ formatTime(post.createdAt) }}</span>
          <span v-if="post.category?.name || categoryName(post.categoryId)" class="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{{ post.category?.name || categoryName(post.categoryId) }}</span>
          <span v-if="activeTab === 'mine' && post.status" class="text-xs px-2 py-0.5 rounded-full"
            :class="statusClass(post.status)">{{ statusLabel(post.status) }}</span>
          <div v-if="activeTab === 'mine'" class="ml-auto flex gap-2" @click.stop>
            <button type="button" @click="openEditModal(post)" class="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">编辑</button>
            <button type="button" @click="handleDeletePost(post)" class="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded-lg">删除</button>
          </div>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
        <div class="flex gap-4 text-sm text-gray-400">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {{ post.viewCount }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            {{ post.likeCount }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {{ post.commentCount }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            {{ post.favoriteCount }}
          </span>
        </div>
          </div>
          <div v-if="post.images?.length" class="shrink-0 w-full sm:w-auto sm:ml-auto">
            <img :src="post.images[0]" alt="" class="h-14 w-20 sm:h-16 sm:w-24 object-cover rounded-lg border border-gray-100" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="posts.length === 0 && !loading && (activeTab === 'all' || userStore.token)" class="text-center py-16 text-gray-400">
      {{ emptyHint }}
    </div>
    <div v-if="total > pageSize && (activeTab === 'all' || userStore.token)" class="flex justify-center mt-6">
      <button v-if="page > 1" @click="page--; refreshList()" class="px-4 py-2 text-sm border rounded-lg mr-2">上一页</button>
      <span class="px-4 py-2 text-sm text-gray-500">{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
      <button v-if="page * pageSize < total" @click="page++; refreshList()" class="px-4 py-2 text-sm border rounded-lg ml-2">下一页</button>
    </div>

    <!-- 发帖弹窗 -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showCreateModal = false">
      <div class="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">发表帖子</h2>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <input v-model="newPost.title" placeholder="帖子标题" class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <select v-model="newPost.categoryId" class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
          <option :value="undefined">选择分类（可选）</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <textarea v-model="newPost.content" rows="8" placeholder="分享你的经验、面经、求职感悟..."
          class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-3"></textarea>
        <input ref="createImageInputRef" type="file" accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp" class="hidden" multiple @change="onCreateImageFiles" />
        <div
          class="mb-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/80 px-4 py-3 text-center text-sm text-gray-500 hover:border-blue-300 transition-colors"
          :class="imageUploading ? 'pointer-events-none opacity-60' : ''"
          @click="triggerCreateImagePick"
          @dragover.prevent="onCreateImageDragOver"
          @drop.prevent="onCreateImageDrop"
        >
          <p class="mb-1">拖拽图片到此处，或点击上传（最多 9 张，单张 ≤5MB）</p>
          <p class="text-xs text-gray-400">{{ imageUploading ? '上传中…' : '支持 jpg / png / gif / webp' }}</p>
        </div>
        <div class="flex gap-2 mb-2">
          <input v-model="imageUrlDraftCreate" type="url" placeholder="粘贴第三方图片链接（https://…）" class="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" @keyup.enter="addImageUrlCreate" />
          <button type="button" @click="addImageUrlCreate" class="shrink-0 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">添加链接</button>
        </div>
        <div v-if="newPost.images.length" class="flex flex-wrap gap-2 mb-3">
          <div v-for="(src, idx) in newPost.images" :key="idx + src" class="relative group">
            <img :src="src" alt="" class="h-16 w-16 object-cover rounded-lg border border-gray-100" />
            <button type="button" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-800 text-white text-xs leading-5 opacity-90 hover:opacity-100" @click.stop="removeImageCreate(idx)" aria-label="移除">×</button>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">{{ newPost.content.length }} 字</span>
          <div class="flex gap-2">
            <button @click="showCreateModal = false" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
            <button @click="handleCreatePost" :disabled="!newPost.title.trim() || !newPost.content.trim() || postSubmitting"
              class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ postSubmitting ? '发布中...' : '发布' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑帖子弹窗 -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showEditModal = false">
      <div class="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">编辑帖子</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <input v-model="editPost.title" placeholder="帖子标题" class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <select v-model="editPost.categoryId" class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
          <option :value="undefined">选择分类（可选）</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <textarea v-model="editPost.content" rows="8" placeholder="正文内容"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-3"></textarea>
        <input ref="editImageInputRef" type="file" accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp" class="hidden" multiple @change="onEditImageFiles" />
        <div
          class="mb-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/80 px-4 py-3 text-center text-sm text-gray-500 hover:border-blue-300 transition-colors"
          :class="imageUploading ? 'pointer-events-none opacity-60' : ''"
          @click="triggerEditImagePick"
          @dragover.prevent="onEditImageDragOver"
          @drop.prevent="onEditImageDrop"
        >
          <p class="mb-1">拖拽图片到此处，或点击上传（最多 9 张）</p>
          <p class="text-xs text-gray-400">{{ imageUploading ? '上传中…' : '支持 jpg / png / gif / webp' }}</p>
        </div>
        <div class="flex gap-2 mb-2">
          <input v-model="imageUrlDraftEdit" type="url" placeholder="粘贴第三方图片链接（https://…）" class="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" @keyup.enter="addImageUrlEdit" />
          <button type="button" @click="addImageUrlEdit" class="shrink-0 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">添加链接</button>
        </div>
        <div v-if="editPost.images.length" class="flex flex-wrap gap-2 mb-3">
          <div v-for="(src, idx) in editPost.images" :key="idx + src" class="relative group">
            <img :src="src" alt="" class="h-16 w-16 object-cover rounded-lg border border-gray-100" />
            <button type="button" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-800 text-white text-xs leading-5 opacity-90 hover:opacity-100" @click.stop="removeImageEdit(idx)" aria-label="移除">×</button>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">{{ editPost.content.length }} 字</span>
          <div class="flex gap-2">
            <button @click="showEditModal = false" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
            <button @click="handleUpdatePost" :disabled="!editPost.title.trim() || !editPost.content.trim() || editSubmitting"
              class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ editSubmitting ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import { confirmDialog } from '@/utils/confirm'
import { getMyPostsApi, getMyFavoritesApi, updatePostApi, deletePostApi, uploadCommunityImageApi } from '@/api/community'

const userStore = useUserStore()
const loading = ref(false)
const posts = ref<any[]>([])
const categories = ref<any[]>([])
const keyword = ref('')
const selectedCategory = ref<number | null>(null)
const page = ref(1)
const pageSize = 10
const total = ref(0)
const showCreateModal = ref(false)
const postSubmitting = ref(false)
const MAX_POST_IMAGES = 9
const newPost = reactive({ title: '', content: '', categoryId: undefined as number | undefined, images: [] as string[] })
const activeTab = ref<'all' | 'mine' | 'favorites'>('all')
const showEditModal = ref(false)
const editSubmitting = ref(false)
const editPost = reactive({ id: 0, title: '', content: '', categoryId: undefined as number | undefined, images: [] as string[] })
const createImageInputRef = ref<HTMLInputElement | null>(null)
const editImageInputRef = ref<HTMLInputElement | null>(null)
const imageUploading = ref(false)
const imageUrlDraftCreate = ref('')
const imageUrlDraftEdit = ref('')

const emptyHint = computed(() => {
  if (activeTab.value === 'mine') return '暂无帖子'
  if (activeTab.value === 'favorites') return '暂无收藏'
  return '暂无帖子'
})

function formatTime(t: string) {
  return new Date(t).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function categoryName(categoryId?: number) {
  if (categoryId == null) return ''
  return categories.value.find((c) => c.id === categoryId)?.name || ''
}

function statusLabel(status: string) {
  const m: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return m[status] || status
}

function statusClass(status: string) {
  if (status === 'approved') return 'bg-green-50 text-green-700'
  if (status === 'rejected') return 'bg-red-50 text-red-600'
  return 'bg-amber-50 text-amber-700'
}

function triggerCreateImagePick() {
  createImageInputRef.value?.click()
}

function triggerEditImagePick() {
  editImageInputRef.value?.click()
}

function onCreateImageDragOver(e: DragEvent) {
  e.preventDefault()
}

function onEditImageDragOver(e: DragEvent) {
  e.preventDefault()
}

async function uploadImagesForBucket(bucket: { images: string[] }, files: FileList | File[]) {
  const arr = Array.from(files)
  for (const file of arr) {
    if (bucket.images.length >= MAX_POST_IMAGES) {
      toast(`最多 ${MAX_POST_IMAGES} 张图片`, 'warning')
      break
    }
    if (!file.type.startsWith('image/')) continue
    imageUploading.value = true
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res: any = await uploadCommunityImageApi(fd)
      const url = res.data?.url
      if (url) bucket.images.push(url)
    } catch {
      break
    } finally {
      imageUploading.value = false
    }
  }
}

function onCreateImageFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) uploadImagesForBucket(newPost, input.files)
  input.value = ''
}

function onEditImageFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) uploadImagesForBucket(editPost, input.files)
  input.value = ''
}

function onCreateImageDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files?.length) uploadImagesForBucket(newPost, files)
}

function onEditImageDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files?.length) uploadImagesForBucket(editPost, files)
}

function addImageUrlCreate() {
  const t = imageUrlDraftCreate.value.trim()
  if (!t) return
  if (!/^https?:\/\//i.test(t)) {
    toast('请输入以 http:// 或 https:// 开头的图片链接', 'warning')
    return
  }
  if (newPost.images.length >= MAX_POST_IMAGES) {
    toast(`最多 ${MAX_POST_IMAGES} 张图片`, 'warning')
    return
  }
  newPost.images.push(t)
  imageUrlDraftCreate.value = ''
}

function addImageUrlEdit() {
  const t = imageUrlDraftEdit.value.trim()
  if (!t) return
  if (!/^https?:\/\//i.test(t)) {
    toast('请输入以 http:// 或 https:// 开头的图片链接', 'warning')
    return
  }
  if (editPost.images.length >= MAX_POST_IMAGES) {
    toast(`最多 ${MAX_POST_IMAGES} 张图片`, 'warning')
    return
  }
  editPost.images.push(t)
  imageUrlDraftEdit.value = ''
}

function removeImageCreate(idx: number) {
  newPost.images.splice(idx, 1)
}

function removeImageEdit(idx: number) {
  editPost.images.splice(idx, 1)
}

function setTab(tab: 'all' | 'mine' | 'favorites') {
  activeTab.value = tab
  page.value = 1
  refreshList()
}

async function refreshList() {
  if ((activeTab.value === 'mine' || activeTab.value === 'favorites') && !userStore.token) {
    posts.value = []
    total.value = 0
    return
  }
  loading.value = true
  try {
    if (activeTab.value === 'all') {
      const res: any = await request.get('/community/posts', {
        params: { page: page.value, pageSize, keyword: keyword.value || undefined, categoryId: selectedCategory.value || undefined, sort: 'hot' },
      })
      posts.value = res.data?.list || []
      total.value = res.data?.total || 0
    } else if (activeTab.value === 'mine') {
      const res: any = await getMyPostsApi({ page: page.value, pageSize })
      posts.value = res.data?.list || []
      total.value = res.data?.total || 0
    } else {
      const res: any = await getMyFavoritesApi({ page: page.value, pageSize })
      posts.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } catch {
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res: any = await request.get('/community/categories')
    categories.value = res.data || []
  } catch {}
}

async function handleCreatePost() {
  if (!newPost.title.trim() || !newPost.content.trim()) return
  postSubmitting.value = true
  try {
    await request.post('/community/posts', {
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      categoryId: newPost.categoryId || undefined,
      images: newPost.images.length ? [...newPost.images] : undefined,
    })
    toast('帖子发布成功，等待审核', 'success')
    showCreateModal.value = false
    newPost.title = ''
    newPost.content = ''
    newPost.categoryId = undefined
    newPost.images = []
    imageUrlDraftCreate.value = ''
    await refreshList()
  } catch {
  } finally {
    postSubmitting.value = false
  }
}

function openEditModal(post: any) {
  editPost.id = post.id
  editPost.title = post.title || ''
  editPost.content = post.content || ''
  editPost.categoryId = post.categoryId ?? post.category?.id
  editPost.images = Array.isArray(post.images) ? [...post.images] : []
  imageUrlDraftEdit.value = ''
  showEditModal.value = true
}

async function handleUpdatePost() {
  if (!editPost.title.trim() || !editPost.content.trim() || editSubmitting.value) return
  editSubmitting.value = true
  try {
    await updatePostApi(editPost.id, {
      title: editPost.title.trim(),
      content: editPost.content.trim(),
      categoryId: editPost.categoryId || undefined,
      images: [...editPost.images],
    })
    toast('已保存', 'success')
    showEditModal.value = false
    await refreshList()
  } catch {
  } finally {
    editSubmitting.value = false
  }
}

async function handleDeletePost(post: any) {
  const ok = await confirmDialog(`确定删除「${post.title}」？此操作不可恢复。`, '删除帖子')
  if (!ok) return
  try {
    await deletePostApi(post.id)
    toast('已删除', 'success')
    await refreshList()
  } catch {}
}

onMounted(() => {
  fetchCategories()
  refreshList()
})
</script>
