<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <LoginPrompt v-if="!isLoggedIn" title="登录后管理个人资料" description="登录后可以完善您的个人信息、上传头像、修改密码" />
    <template v-else>
    <h1 class="text-2xl font-bold text-gray-900">个人资料</h1>

    <!-- Profile Info Card -->
    <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-800">基本信息</h2>
      </div>
      <div class="p-6">
        <!-- Avatar -->
        <div class="flex items-center gap-4 mb-6">
          <div class="relative group">
            <img
              v-if="form.avatar"
              :src="form.avatar"
              alt="头像"
              class="w-20 h-20 rounded-full object-cover shrink-0"
            />
            <div
              v-else
              class="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-indigo-500 shrink-0"
            >
              {{ avatarChar }}
            </div>
            <label
              class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium"
            >
              上传
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                class="hidden"
                @change="onAvatarChange"
              />
            </label>
          </div>
          <div class="text-sm text-gray-500">
            <p>支持 jpg / png / gif / webp</p>
            <p>最大 10MB</p>
          </div>
        </div>

        <!-- Editable Form -->
        <form class="space-y-4" @submit.prevent="saveProfile">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                v-model="form.nickname"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入昵称"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入邮箱"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入手机号"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
              <select
                v-model="form.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">请选择</option>
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">学校</label>
              <input
                v-model="form.school"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入学校"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">专业</label>
              <input
                v-model="form.major"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入专业"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">毕业年份</label>
              <input
                v-model.number="form.graduationYear"
                type="number"
                min="1990"
                max="2030"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="如 2025"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">学历</label>
              <select
                v-model="form.degree"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">请选择</option>
                <option value="专科">专科</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">求职意向</label>
            <input
              v-model="form.jobIntention"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="如 前端开发、产品经理"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
            <textarea
              v-model="form.bio"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="介绍一下自己..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">技能标签</label>
            <div class="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <span
                v-for="(skill, i) in form.skills"
                :key="i"
                class="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm"
              >
                {{ skill }}
                <button
                  type="button"
                  class="text-indigo-600 hover:text-indigo-800"
                  @click="removeSkill(i)"
                >
                  ×
                </button>
              </span>
              <input
                v-model="skillInput"
                type="text"
                class="flex-1 min-w-[120px] outline-none bg-transparent"
                placeholder="输入后按回车添加"
                @keydown.enter.prevent="addSkill"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ saving ? '保存中...' : '保存资料' }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Change Password Card -->
    <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-800">修改密码</h2>
      </div>
      <div class="p-6">
        <form class="space-y-4 max-w-md" @submit.prevent="changePassword">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="请输入当前密码"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="请输入新密码（至少6位）"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="请再次输入新密码"
            />
          </div>
          <div class="pt-2">
            <button
              type="submit"
              :disabled="changingPassword"
              class="px-6 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ changingPassword ? '修改中...' : '修改密码' }}
            </button>
          </div>
        </form>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import request from '@/utils/request'
import toast from '@/utils/toast'
import { useUserStore } from '@/stores/user'
import LoginPrompt from '@/components/LoginPrompt.vue'

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

interface UserInfo {
  id?: number
  username?: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  gender?: string
  school?: string
  major?: string
  graduationYear?: number
  degree?: string
  jobIntention?: string
  bio?: string
  skills?: string[]
  createdAt?: string
}

const userStore = useUserStore()
const saving = ref(false)
const changingPassword = ref(false)
const skillInput = ref('')

const form = ref<UserInfo>({
  nickname: '',
  email: '',
  phone: '',
  gender: '',
  school: '',
  major: '',
  graduationYear: undefined,
  degree: '',
  jobIntention: '',
  bio: '',
  skills: [],
  avatar: '',
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const avatarChar = computed(() => {
  const name = form.value.nickname || form.value.username || '?'
  return name.charAt(0).toUpperCase()
})

function addSkill() {
  const s = skillInput.value.trim()
  if (s && !form.value.skills?.includes(s)) {
    form.value.skills = form.value.skills || []
    form.value.skills.push(s)
    skillInput.value = ''
  }
}

function removeSkill(i: number) {
  form.value.skills = form.value.skills?.filter((_, idx) => idx !== i) || []
}

async function loadProfile() {
  try {
    const res: any = await request.get('/user/profile')
    const data = res.data || res
    form.value = {
      nickname: data.nickname ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      gender: data.gender ?? '',
      school: data.school ?? '',
      major: data.major ?? '',
      graduationYear: data.graduationYear ?? undefined,
      degree: data.degree ?? '',
      jobIntention: data.jobIntention ?? '',
      bio: data.bio ?? '',
      skills: Array.isArray(data.skills) ? [...data.skills] : [],
      avatar: data.avatar ?? '',
      username: data.username,
    }
  } catch {
    toast('加载资料失败', 'error')
  }
}

async function saveProfile() {
  saving.value = true
  try {
    const payload = {
      nickname: form.value.nickname || undefined,
      email: form.value.email || undefined,
      phone: form.value.phone || undefined,
      gender: form.value.gender || undefined,
      school: form.value.school || undefined,
      major: form.value.major || undefined,
      graduationYear: form.value.graduationYear || undefined,
      degree: form.value.degree || undefined,
      jobIntention: form.value.jobIntention || undefined,
      bio: form.value.bio || undefined,
      skills: form.value.skills?.length ? form.value.skills : undefined,
    }
    await request.put('/user/profile', payload)
    toast('资料已保存', 'success')
    userStore.fetchUserInfo().catch(() => {})
  } catch {
    toast('保存失败', 'error')
  } finally {
    saving.value = false
  }
}

async function onAvatarChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res: any = await request.post('/user/avatar', formData)
    const data = res.data || res
    form.value.avatar = data.avatar ?? data
    toast('头像已更新', 'success')
    userStore.fetchUserInfo().catch(() => {})
  } catch {
    toast('头像上传失败', 'error')
  }
  input.value = ''
}

async function changePassword() {
  const { oldPassword, newPassword, confirmPassword } = passwordForm.value
  if (!oldPassword || !newPassword) {
    toast('请填写完整', 'warning')
    return
  }
  if (newPassword.length < 6) {
    toast('新密码至少6位', 'warning')
    return
  }
  if (newPassword !== confirmPassword) {
    toast('两次输入的新密码不一致', 'warning')
    return
  }
  changingPassword.value = true
  try {
    await request.put('/user/password', { oldPassword, newPassword })
    toast('密码已修改', 'success')
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch {
    toast('修改密码失败', 'error')
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) loadProfile()
})
</script>
