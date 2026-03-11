<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- 左侧品牌区域 -->
      <div class="login-banner">
        <div class="banner-content">
          <div class="banner-icon">
            <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
              <rect x="10" y="20" width="80" height="60" rx="8" stroke="#ffffff" stroke-width="3" />
              <circle cx="50" cy="42" r="12" stroke="#ffffff" stroke-width="3" />
              <path d="M30 70 C30 58 70 58 70 70" stroke="#ffffff" stroke-width="3" fill="none" />
              <rect x="60" y="15" width="20" height="12" rx="4" fill="#ffffff" opacity="0.6" />
              <path d="M65 21 L72 21 M65 24 L75 24" stroke="#1677ff" stroke-width="1.5" />
            </svg>
          </div>
          <h1 class="banner-title">{{ systemStore.siteName }}</h1>
          <p class="banner-desc">基于 AI 的智能化校园招聘管理系统</p>
          <div class="banner-features">
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>智能简历分析与优化</span>
            </div>
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>AI 模拟面试与评估</span>
            </div>
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>投递流程全程追踪</span>
            </div>
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>校园求职社区交流</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-section">
        <div class="form-inner">
          <div class="form-header">
            <h2 class="form-title">管理后台登录</h2>
            <p class="form-desc">请使用管理员账号登录系统</p>
          </div>

          <a-form
            :model="formState"
            :rules="rules"
            @finish="handleLogin"
            layout="vertical"
            class="login-form"
            autocomplete="off"
          >
            <a-form-item name="username" label="用户名">
              <a-input
                v-model:value="formState.username"
                placeholder="请输入用户名"
                size="large"
                autocomplete="new-password"
              >
                <template #prefix>
                  <UserOutlined style="color: #bfbfbf" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" label="密码">
              <a-input-password
                v-model:value="formState.password"
                placeholder="请输入密码"
                size="large"
                autocomplete="new-password"
              >
                <template #prefix>
                  <LockOutlined style="color: #bfbfbf" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item name="captcha" label="验证码">
              <div class="captcha-row">
                <a-input
                  v-model:value="formState.captcha"
                  placeholder="请输入验证码"
                  size="large"
                  class="captcha-input"
                  autocomplete="off"
                >
                  <template #prefix>
                    <SafetyCertificateOutlined style="color: #bfbfbf" />
                  </template>
                </a-input>
                <div class="captcha-image" @click="refreshCaptcha" title="点击刷新验证码">
                  <div v-html="captchaSvg" class="captcha-svg"></div>
                </div>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="loading"
                class="login-btn"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>

          <!-- 测试账号提示 -->
          <div class="test-accounts">
            <a-divider>
              <span class="divider-text">测试账号</span>
            </a-divider>
            <div class="account-list">
              <div class="account-item" @click="fillAccount('admin', 'admin123')">
                <TeamOutlined class="account-icon" />
                <div class="account-info">
                  <span class="account-label">平台管理员</span>
                  <span class="account-detail">admin / admin123</span>
                </div>
              </div>
              <div class="account-item" @click="fillAccount('enterprise', 'enter123')">
                <BankOutlined class="account-icon" />
                <div class="account-info">
                  <span class="account-label">企业账号</span>
                  <span class="account-detail">enterprise / enter123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  BankOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'
import { getCaptchaApi } from '@/api/auth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const systemStore = useSystemStore()
const router = useRouter()
const loading = ref(false)
const captchaSvg = ref('')
const captchaKey = ref('')

const formState = reactive({
  username: '',
  password: '',
  captcha: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

/* 点击测试账号自动填充 */
function fillAccount(username: string, password: string) {
  formState.username = username
  formState.password = password
}

/* 从后端获取 SVG 验证码 */
async function refreshCaptcha() {
  try {
    const res: any = await getCaptchaApi()
    captchaSvg.value = res.data.captchaSvg
    captchaKey.value = res.data.captchaKey
  } catch {
    message.error('获取验证码失败')
  }
}

async function handleLogin() {
  loading.value = true
  try {
    await userStore.login({
      username: formState.username,
      password: formState.password,
      captcha: formState.captcha,
      captchaKey: captchaKey.value,
    })
    message.success('登录成功')
    router.push('/')
  } catch {
    refreshCaptcha()
    formState.captcha = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshCaptcha()
  systemStore.fetchSettings()
})
</script>

<style scoped lang="less">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.login-wrapper {
  display: flex;
  width: 900px;
  min-height: 560px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 左侧品牌区域 */
.login-banner {
  width: 400px;
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;

  .banner-content {
    color: #ffffff;
    text-align: center;
  }

  .banner-icon {
    margin-bottom: 24px;
  }

  .banner-title {
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #ffffff;
  }

  .banner-desc {
    font-size: 14px;
    opacity: 0.85;
    margin-bottom: 36px;
  }

  .banner-features {
    text-align: left;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      font-size: 14px;
      opacity: 0.9;
    }
  }
}

/* 右侧表单区域 */
.login-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.form-inner {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 28px;

  .form-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
  }

  .form-desc {
    font-size: 13px;
    color: #999;
  }
}

.login-form {
  .captcha-row {
    display: flex;
    gap: 12px;
  }

  .captcha-input {
    flex: 1;
  }

  .captcha-image {
    cursor: pointer;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #d9d9d9;
    height: 40px;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    &:hover {
      border-color: #1677ff;
    }

    .captcha-svg {
      display: flex;
      align-items: center;
      height: 100%;

      :deep(svg) {
        width: 120px;
        height: 40px;
      }
    }
  }

  .login-btn {
    height: 42px;
    font-size: 15px;
    border-radius: 6px;
  }
}

/* 测试账号 */
.test-accounts {
  margin-top: 8px;

  .divider-text {
    font-size: 12px;
    color: #bbb;
  }

  .account-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .account-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #1677ff;
      background: #f0f7ff;
    }

    .account-icon {
      font-size: 20px;
      color: #1677ff;
    }

    .account-info {
      display: flex;
      flex-direction: column;

      .account-label {
        font-size: 13px;
        color: #333;
        font-weight: 500;
      }

      .account-detail {
        font-size: 12px;
        color: #999;
        font-family: monospace;
      }
    }
  }
}
</style>
