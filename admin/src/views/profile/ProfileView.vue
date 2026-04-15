<template>
  <div class="profile-page">
    <a-page-header title="个人资料" sub-title="管理个人信息和密码" />
    <a-card class="card">
      <a-tabs v-model:activeKey="activeTab">
        <!-- 个人信息选项卡 -->
        <a-tab-pane key="info" tab="个人信息">
          <a-row :gutter="24">
            <a-col :span="8">
              <div class="avatar-section">
                <a-avatar :size="100" :src="userInfo?.avatar || undefined">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <a-upload
                  :show-upload-list="false"
                  :before-upload="handleAvatarUpload"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                >
                  <a-button type="primary" style="margin-top: 16px">
                    <UploadOutlined />
                    更换头像
                  </a-button>
                </a-upload>
                <p class="avatar-tip">支持 jpg/png/gif/webp，最大 5MB</p>
              </div>
            </a-col>
            <a-col :span="16">
              <a-form
                :model="profileForm"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
                @finish="handleUpdateProfile"
              >
                <a-form-item label="用户名">
                  <a-input :value="userInfo?.username" disabled />
                </a-form-item>
                <a-form-item label="角色">
                  <a-tag :color="userInfo?.role === 'admin' ? 'blue' : 'green'">
                    {{ roleMap[userInfo?.role as string] || userInfo?.role }}
                  </a-tag>
                </a-form-item>
                <a-form-item label="昵称" name="nickname">
                  <a-input v-model:value="profileForm.nickname" placeholder="请输入昵称" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                  <a-input v-model:value="profileForm.email" placeholder="请输入邮箱" />
                </a-form-item>
                <a-form-item label="手机号" name="phone">
                  <a-input v-model:value="profileForm.phone" placeholder="请输入手机号" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
                  <a-button type="primary" html-type="submit" :loading="profileLoading">
                    保存修改
                  </a-button>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- 修改密码选项卡 -->
        <a-tab-pane key="password" tab="修改密码">
          <a-form
            :model="passwordForm"
            :rules="passwordRules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 12 }"
            @finish="handleChangePassword"
            style="max-width: 600px"
          >
            <a-form-item label="旧密码" name="oldPassword">
              <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入旧密码" />
            </a-form-item>
            <a-form-item label="新密码" name="newPassword">
              <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码（6位以上）" />
            </a-form-item>
            <a-form-item label="确认密码" name="confirmPassword">
              <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 12 }">
              <a-button type="primary" html-type="submit" :loading="passwordLoading">
                修改密码
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { UserOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { getUserInfoApi } from '@/api/auth'
import { updateProfileApi, changePasswordApi, uploadAvatarApi } from '@/api/user'

const route = useRoute()
const activeTab = ref((route.query.tab as string) || 'info')
const userInfo = ref<Record<string, any> | null>(null)
const profileLoading = ref(false)
const passwordLoading = ref(false)

const roleMap: Record<string, string> = {
  admin: '平台管理员',
  enterprise: '企业用户',
  student: '学生用户',
}

const profileForm = reactive({
  nickname: '',
  email: '',
  phone: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码不少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        if (value !== passwordForm.newPassword) {
          return Promise.reject('两次密码输入不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
}

async function fetchProfile() {
  const res: any = await getUserInfoApi()
  userInfo.value = res.data
  profileForm.nickname = res.data.nickname || ''
  profileForm.email = res.data.email || ''
  profileForm.phone = res.data.phone || ''
}

async function handleUpdateProfile() {
  profileLoading.value = true
  try {
    await updateProfileApi(profileForm)
    message.success('资料更新成功')
    fetchProfile()
  } catch { /* 错误已在拦截器处理 */ } finally {
    profileLoading.value = false
  }
}

async function handleChangePassword() {
  passwordLoading.value = true
  try {
    await changePasswordApi({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
    message.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch { /* 错误已在拦截器处理 */ } finally {
    passwordLoading.value = false
  }
}

async function handleAvatarUpload(file: File) {
  try {
    await uploadAvatarApi(file)
    message.success('头像更新成功')
    fetchProfile()
  } catch { /* 错误已在拦截器处理 */ }
  return false
}

watch(() => route.query.tab, (tab) => {
  if (tab && typeof tab === 'string') activeTab.value = tab
})

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped lang="less">
.profile-page {
  .card {
    border-radius: 8px;
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
  }

  .avatar-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
}
</style>
