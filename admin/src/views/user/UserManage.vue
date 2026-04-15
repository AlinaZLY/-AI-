<template>
  <div class="user-manage">
    <a-page-header title="用户管理" :sub-title="`共 ${pagination.total} 个用户`" />

    <div class="toolbar">
      <a-space>
        <a-button type="primary" @click="openCreateModal"><PlusOutlined /> 新建用户</a-button>
        <a-input-search v-model:value="keyword" placeholder="搜索用户名/昵称/邮箱" style="width: 260px" allow-clear @search="handleSearch" />
        <a-select v-model:value="roleFilter" placeholder="角色筛选" style="width: 120px" allow-clear @change="handleSearch">
          <a-select-option value="student">学生</a-select-option>
          <a-select-option value="enterprise">企业</a-select-option>
          <a-select-option value="admin">管理员</a-select-option>
        </a-select>
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="users" :loading="loading" :pagination="pagination" :scroll="{ x: 1400 }" row-key="id" size="middle" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'user'">
          <div style="display: flex; align-items: center; gap: 8px">
            <a-avatar v-if="record.avatar" :size="32" :src="record.avatar" />
            <a-avatar v-else :size="32" style="background-color: #1677ff">{{ String(record.nickname || record.username || '?').charAt(0) }}</a-avatar>
            <div>
              <div><strong>{{ record.nickname || record.username }}</strong></div>
              <div style="font-size: 12px; color: #999">@{{ record.username }}</div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'role'">
          <a-tag :color="roleColor(record.role)">{{ roleLabel(record.role) }}</a-tag>
        </template>
        <template v-if="column.key === 'school'">
          {{ record.school || '-' }}
        </template>
        <template v-if="column.key === 'major'">
          {{ record.major || '-' }}
        </template>
        <template v-if="column.key === 'degree'">
          {{ record.degree || '-' }}
        </template>
        <template v-if="column.key === 'isActive'">
          <a-switch :checked="record.isActive" checked-children="启用" un-checked-children="禁用" @change="handleToggle(record.id)" />
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-popconfirm title="确定要删除该用户吗？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新建/编辑用户弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="editingId ? '编辑用户' : '新建用户'"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="formLoading"
      @ok="handleFormSubmit"
      width="640px"
    >
      <a-form ref="formRef" :model="formData" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" name="username" :rules="editingId ? [] : [{ required: true, message: '请输入用户名' }]">
              <a-input v-model:value="formData.username" placeholder="请输入用户名" :disabled="!!editingId" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密码" name="password" :rules="editingId ? [] : [{ required: true, message: '请输入密码' }]">
              <a-input-password v-model:value="formData.password" :placeholder="editingId ? '留空则不修改' : '请输入密码'" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色" name="role">
              <a-select v-model:value="formData.role" placeholder="选择角色">
                <a-select-option value="student">学生</a-select-option>
                <a-select-option value="enterprise">企业</a-select-option>
                <a-select-option value="admin">管理员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机" name="phone">
              <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="性别" name="gender">
              <a-select v-model:value="formData.gender" placeholder="选择性别" allow-clear>
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
                <a-select-option value="未知">未知</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学历" name="degree">
              <a-select v-model:value="formData.degree" placeholder="选择学历" allow-clear>
                <a-select-option value="专科">专科</a-select-option>
                <a-select-option value="本科">本科</a-select-option>
                <a-select-option value="硕士">硕士</a-select-option>
                <a-select-option value="博士">博士</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="学校" name="school">
              <a-input v-model:value="formData.school" placeholder="请输入学校" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业" name="major">
              <a-input v-model:value="formData.major" placeholder="请输入专业" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="毕业年份" name="graduationYear">
              <a-input-number v-model:value="formData.graduationYear" placeholder="如 2025" :min="1990" :max="2100" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="求职意向" name="jobIntention">
              <a-input v-model:value="formData.jobIntention" placeholder="请输入求职意向" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="个人简介" name="bio">
          <a-textarea v-model:value="formData.bio" placeholder="请输入个人简介" :rows="3" />
        </a-form-item>
        <a-form-item label="技能标签" name="skills">
          <a-select v-model:value="formData.skills" mode="tags" placeholder="输入后回车添加技能" :max-tag-count="10" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  getUsersAdminApi,
  toggleUserActiveApi,
  createUserAdminApi,
  updateUserAdminApi,
  deleteUserAdminApi,
} from '@/api/user'

const loading = ref(false)
const users = ref<any[]>([])
const keyword = ref('')
const roleFilter = ref<string | undefined>(undefined)
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 个` })

const formVisible = ref(false)
const formLoading = ref(false)
const formRef = ref<FormInstance>()
const editingId = ref<number | null>(null)
const formData = reactive<Record<string, any>>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  role: 'student',
  gender: undefined,
  school: '',
  major: '',
  graduationYear: undefined,
  degree: undefined,
  jobIntention: '',
  bio: '',
  skills: [],
})

function roleLabel(r: string) { return { student: '学生', enterprise: '企业', admin: '管理员' }[r] || r }
function roleColor(r: string) { return { student: 'blue', enterprise: 'green', admin: 'red' }[r] || 'default' }

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '用户', key: 'user', width: 200 },
  { title: '邮箱', dataIndex: 'email', width: 180 },
  { title: '手机', dataIndex: 'phone', width: 120 },
  { title: '角色', key: 'role', width: 80 },
  { title: '求职意向', dataIndex: 'jobIntention', width: 120, ellipsis: true },
  { title: '学校', key: 'school', width: 120, ellipsis: true },
  { title: '专业', key: 'major', width: 120, ellipsis: true },
  { title: '学历', key: 'degree', width: 80 },
  { title: '状态', key: 'isActive', width: 90 },
  { title: '注册时间', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' },
]

function resetForm() {
  formData.username = ''
  formData.password = ''
  formData.nickname = ''
  formData.email = ''
  formData.phone = ''
  formData.role = 'student'
  formData.gender = undefined
  formData.school = ''
  formData.major = ''
  formData.graduationYear = undefined
  formData.degree = undefined
  formData.jobIntention = ''
  formData.bio = ''
  formData.skills = []
  editingId.value = null
}

function openCreateModal() {
  resetForm()
  formVisible.value = true
}

function openEditModal(record: any) {
  editingId.value = record.id
  formData.username = record.username
  formData.password = ''
  formData.nickname = record.nickname ?? ''
  formData.email = record.email ?? ''
  formData.phone = record.phone ?? ''
  formData.role = record.role ?? 'student'
  formData.gender = record.gender ?? undefined
  formData.school = record.school ?? ''
  formData.major = record.major ?? ''
  formData.graduationYear = record.graduationYear ?? undefined
  formData.degree = record.degree ?? undefined
  formData.jobIntention = record.jobIntention ?? ''
  formData.bio = record.bio ?? ''
  formData.skills = Array.isArray(record.skills) ? [...record.skills] : []
  formVisible.value = true
}

async function handleFormSubmit() {
  if (editingId.value) {
    const payload: Record<string, any> = {
      nickname: formData.nickname,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      gender: formData.gender,
      school: formData.school,
      major: formData.major,
      graduationYear: formData.graduationYear,
      degree: formData.degree,
      jobIntention: formData.jobIntention,
      bio: formData.bio,
      skills: formData.skills,
    }
    if (formData.password) payload.password = formData.password
    formLoading.value = true
    try {
      await updateUserAdminApi(editingId.value, payload)
      message.success('更新成功')
      formVisible.value = false
      fetchUsers()
    } catch (e: any) {
      message.error(e?.response?.data?.message || '更新失败')
    } finally {
      formLoading.value = false
    }
  } else {
    try {
      await formRef.value?.validate()
    } catch {
      return
    }
    const payload = {
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      gender: formData.gender,
      school: formData.school,
      major: formData.major,
      graduationYear: formData.graduationYear,
      degree: formData.degree,
      jobIntention: formData.jobIntention,
      bio: formData.bio,
      skills: formData.skills,
    }
    formLoading.value = true
    try {
      await createUserAdminApi(payload)
      message.success('创建成功')
      formVisible.value = false
      fetchUsers()
    } catch (e: any) {
      message.error(e?.response?.data?.message || '创建失败')
    } finally {
      formLoading.value = false
    }
  }
}

async function handleDelete(id: number) {
  try {
    await deleteUserAdminApi(id)
    message.success('删除成功')
    fetchUsers()
  } catch (e: any) {
    message.error(e?.response?.data?.message || '删除失败')
  }
}

async function fetchUsers() {
  loading.value = true
  try {
    const res = await getUsersAdminApi({ page: pagination.current, pageSize: pagination.pageSize, keyword: keyword.value || undefined, role: roleFilter.value })
    users.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch { message.error('获取用户列表失败') }
  finally { loading.value = false }
}

function handleSearch() { pagination.current = 1; fetchUsers() }
function handleTableChange(pag: any) { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchUsers() }

async function handleToggle(id: number) {
  try { await toggleUserActiveApi(id); message.success('已更新'); fetchUsers() }
  catch { message.error('操作失败') }
}

onMounted(fetchUsers)
</script>

<style scoped>
.toolbar { margin-bottom: 16px; }
</style>
