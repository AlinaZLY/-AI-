<template>
  <a-layout class="basic-layout">
    <!-- 左侧菜单栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="220"
      class="layout-sider"
    >
      <div class="logo">
        <img v-if="systemStore.siteLogo" :src="systemStore.siteLogo" alt="LOGO" class="logo-img" />
        <span v-if="!collapsed" class="logo-text">{{ systemStore.siteName }}</span>
        <span v-else-if="!systemStore.siteLogo" class="logo-text">{{ systemStore.siteName.charAt(0) }}</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <DashboardOutlined />
          <span>{{ $t('仪表盘') }}</span>
        </a-menu-item>
        <a-menu-item v-if="userStore.userInfo?.role === 'admin'" key="users">
          <TeamOutlined />
          <span>{{ $t('用户管理') }}</span>
        </a-menu-item>
        <a-menu-item v-if="userStore.userInfo?.role === 'admin'" key="audit">
          <SafetyCertificateOutlined />
          <span>{{ $t('入驻审核') }}</span>
        </a-menu-item>
        <a-sub-menu v-if="userStore.userInfo?.role === 'admin'" key="recruitment">
          <template #title>
            <BankOutlined />
            <span>{{ $t('招聘管理') }}</span>
          </template>
          <a-menu-item key="jobs">
            <SolutionOutlined />
            <span>{{ $t('职位管理') }}</span>
          </a-menu-item>
          <a-menu-item key="companies">
            <BankOutlined />
            <span>{{ $t('企业管理') }}</span>
          </a-menu-item>
          <a-menu-item key="applications">
            <SendOutlined />
            <span>{{ $t('投递管理') }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu v-if="userStore.userInfo?.role === 'admin'" key="community">
          <template #title>
            <TeamOutlined />
            <span>{{ $t('社区管理') }}</span>
          </template>
          <a-menu-item key="community/categories">
            <AppstoreOutlined />
            <span>{{ $t('分类管理') }}</span>
          </a-menu-item>
          <a-menu-item key="community/posts">
            <MessageOutlined />
            <span>{{ $t('帖子管理') }}</span>
          </a-menu-item>
          <a-menu-item key="community/comments">
            <CommentOutlined />
            <span>{{ $t('评论管理') }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu v-if="userStore.userInfo?.role === 'admin'" key="resume">
          <template #title>
            <FileTextOutlined />
            <span>{{ $t('简历中心') }}</span>
          </template>
          <a-menu-item key="resumes/templates">
            <LayoutOutlined />
            <span>{{ $t('模板管理') }}</span>
          </a-menu-item>
          <a-menu-item key="resumes/categories">
            <AppstoreOutlined />
            <span>{{ $t('分类管理') }}</span>
          </a-menu-item>
          <a-menu-item key="resumes/admin">
            <SolutionOutlined />
            <span>{{ $t('简历管理') }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu v-if="userStore.userInfo?.role === 'admin'" key="interview">
          <template #title>
            <BulbOutlined />
            <span>{{ $t('面试题库') }}</span>
          </template>
          <a-menu-item key="interview/questions">
            <UnorderedListOutlined />
            <span>{{ $t('题库管理') }}</span>
          </a-menu-item>
          <a-menu-item key="interview/categories">
            <ApartmentOutlined />
            <span>{{ $t('分类管理') }}</span>
          </a-menu-item>
          <a-menu-item key="interview/records">
            <FileTextOutlined />
            <span>{{ $t('面试记录') }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="notifications">
          <BellOutlined />
          <span>{{ $t('消息通知') }}</span>
          <a-badge v-if="unreadCount > 0" :count="unreadCount" :offset="[10, 0]" />
        </a-menu-item>
        <a-sub-menu v-if="userStore.userInfo?.role === 'admin'" key="ai-config">
          <template #title>
            <ThunderboltOutlined />
            <span>{{ $t('AI 配置') }}</span>
          </template>
          <a-menu-item key="system/ai-config/key">
            <KeyOutlined />
            <span>{{ $t('配置 KEY') }}</span>
          </a-menu-item>
          <a-menu-item key="system/ai-config/billing">
            <AccountBookOutlined />
            <span>{{ $t('用量账单') }}</span>
          </a-menu-item>
          <a-menu-item key="system/ai-config/logs">
            <FileTextOutlined />
            <span>{{ $t('调用日志') }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu v-if="userStore.userInfo?.role === 'admin'" key="system">
          <template #title>
            <SettingOutlined />
            <span>{{ $t('系统管理') }}</span>
          </template>
          <a-menu-item key="system/announcement">
            <NotificationOutlined />
            <span>{{ $t('公告管理') }}</span>
          </a-menu-item>
          <a-menu-item key="system/settings">
            <SettingOutlined />
            <span>{{ $t('系统设置') }}</span>
          </a-menu-item>
          <a-menu-item key="system/i18n">
            <GlobalOutlined />
            <span>{{ $t('i18n 内容') }}</span>
          </a-menu-item>
          <a-menu-item key="system/dict">
            <DatabaseOutlined />
            <span>{{ $t('数据字典') }}</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 顶部导航栏 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <MenuFoldOutlined
            v-if="!collapsed"
            class="trigger"
            @click="collapsed = true"
          />
          <MenuUnfoldOutlined
            v-else
            class="trigger"
            @click="collapsed = false"
          />
        </div>
        <div class="header-right">
          <LocaleSwitch />
          <a-tooltip :title="$t('访问首页')">
            <a class="header-action" :href="clientBaseUrl" target="_blank" rel="noopener noreferrer">
              <HomeFilled />
            </a>
          </a-tooltip>
          <a-tooltip v-if="userStore.userInfo?.role === 'admin'" :title="$t('发送公告')">
            <a class="header-action" @click="openAnnouncementModal">
              <SoundOutlined />
            </a>
          </a-tooltip>
          <a-tooltip :title="$t('消息通知')">
            <a-badge :count="unreadCount" :offset="[-4, 2]" :overflow-count="99">
              <a class="header-action" @click="router.push('/notifications')">
                <BellOutlined />
              </a>
            </a-badge>
          </a-tooltip>
          <a-dropdown>
            <span class="user-info">
              <a-avatar
                v-if="userStore.userInfo?.avatar"
                :size="28"
                :src="userStore.userInfo.avatar"
              />
              <a-avatar
                v-else
                :size="28"
                style="background-color: #1677ff; font-size: 14px"
              >
                {{ String(userStore.userInfo?.nickname || userStore.userInfo?.username || '管').charAt(0) }}
              </a-avatar>
              <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username || $t('管理员') }}</span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="router.push('/profile?tab=info')">
                  <UserOutlined />
                  <span>{{ $t('个人信息') }}</span>
                </a-menu-item>
                <a-menu-item @click="router.push('/profile?tab=password')">
                  <LockOutlined />
                  <span>{{ $t('修改密码') }}</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="handleLogout">
                  <LogoutOutlined />
                  <span>{{ $t('退出登录') }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>

    <a-modal
      v-model:open="announcementModalOpen"
      :title="$t('发送公告')"
      width="640px"
      destroy-on-close
      :footer="null"
    >
      <a-form layout="vertical" class="announcement-form">
        <a-form-item :label="$t('标题')" required>
          <a-input
            v-model:value="announcementTitle"
            :placeholder="$t('请输入公告标题')"
            :maxlength="200"
            show-count
          />
        </a-form-item>
        <a-form-item :label="$t('正文')" required>
          <a-textarea
            v-model:value="announcementContent"
            :placeholder="$t('请输入公告内容')"
            :rows="6"
            :maxlength="5000"
            show-count
          />
        </a-form-item>
        <a-form-item :label="$t('预览（用户收到的通知文案）')">
          <div class="announcement-preview">{{ announcementPreview }}</div>
          <div v-if="announcementPreviewTruncated" class="announcement-preview-hint">
            {{ $t('通知正文最长 500 字，超出部分已截断预览（发送时同样截断）') }}
          </div>
        </a-form-item>
        <a-alert
          v-if="announcementResult !== null"
          type="success"
          show-icon
          :message="announcementResult.message"
          class="announcement-result"
        />
      </a-form>
      <div class="announcement-modal-footer">
        <a-button @click="announcementModalOpen = false">{{ $t('取消') }}</a-button>
        <a-button type="primary" :loading="announcementSubmitting" @click="submitAnnouncement">
          {{ $t('发送给所有用户') }}
        </a-button>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  MessageOutlined,
  CommentOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BankOutlined,
  BellOutlined,
  HomeFilled,
  SendOutlined,
  FileTextOutlined,
  SolutionOutlined,
  LayoutOutlined,
  BulbOutlined,
  DatabaseOutlined,
  UnorderedListOutlined,
  ApartmentOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  AccountBookOutlined,
  SoundOutlined,
  NotificationOutlined,
  GlobalOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'
import LocaleSwitch from '@/components/LocaleSwitch.vue'
import { getUnreadCountApi, sendAnnouncementApi } from '@/api/system'
import { message } from 'ant-design-vue'
import { useI18n } from '@/i18n'

const clientBaseUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'
const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])
const openKeys = ref<string[]>([])
const unreadCount = ref(0)
const announcementModalOpen = ref(false)
const announcementTitle = ref('')
const announcementContent = ref('')
const announcementSubmitting = ref(false)
const announcementResult = ref<{ message: string; notifiedCount: number } | null>(null)

const NOTIFICATION_MAX = 500
const announcementPreviewRaw = computed(() => {
  const title = announcementTitle.value.trim()
  const c = announcementContent.value.trim()
  if (!title && !c) return t('（填写标题与正文后在此预览）')
  return t('[公告] {title}: {content}', {
    title: title || t('（标题）'),
    content: c || t('（正文）'),
  })
})
const announcementPreviewTruncated = computed(
  () => announcementPreviewRaw.value.length > NOTIFICATION_MAX,
)
const announcementPreview = computed(() => {
  const raw = announcementPreviewRaw.value
  if (raw.length <= NOTIFICATION_MAX) return raw
  return `${raw.slice(0, NOTIFICATION_MAX)}…`
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const systemStore = useSystemStore()
const { t } = useI18n()

async function fetchUnreadCount() {
  try {
    const res = await getUnreadCountApi()
    unreadCount.value = typeof res.data === 'number' ? res.data : 0
  } catch {
    unreadCount.value = 0
  }
}

function updateMenuState() {
  const path = route.path.replace(/^\//, '')
  selectedKeys.value = [path]
  const newOpenKeys: string[] = []
  if (path.startsWith('community/')) newOpenKeys.push('community')
  if (path.startsWith('resumes')) newOpenKeys.push('resume')
  if (path.startsWith('interview/')) newOpenKeys.push('interview')
  if (path.startsWith('system/')) newOpenKeys.push('system')
  if (path.startsWith('system/ai-config')) newOpenKeys.push('ai-config')
  if (path === 'jobs' || path === 'companies' || path === 'applications') newOpenKeys.push('recruitment')
  openKeys.value = newOpenKeys
}

let unreadTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  systemStore.fetchSettings()
  userStore.fetchUserInfo()
  fetchUnreadCount()
  updateMenuState()
  unreadTimer = setInterval(fetchUnreadCount, 30000)
})

onBeforeUnmount(() => {
  if (unreadTimer) {
    clearInterval(unreadTimer)
    unreadTimer = null
  }
})

watch(() => route.path, updateMenuState)

function handleMenuClick({ key }: { key: string }) {
  router.push(`/${key}`)
}

function handleLogout() {
  userStore.logout()
}

function openAnnouncementModal() {
  announcementTitle.value = ''
  announcementContent.value = ''
  announcementResult.value = null
  announcementModalOpen.value = true
}

async function submitAnnouncement() {
  const title = announcementTitle.value.trim()
  const content = announcementContent.value.trim()
  if (!title) {
    message.warning(t('请填写标题'))
    return
  }
  if (!content) {
    message.warning(t('请填写正文'))
    return
  }
  announcementSubmitting.value = true
  announcementResult.value = null
  try {
    const res = await sendAnnouncementApi({ title, content })
    const payload = res.data as { message: string; notifiedCount: number }
    announcementResult.value = payload
    message.success(t('已通知 {count} 位用户', { count: payload.notifiedCount }))
    await fetchUnreadCount()
  } finally {
    announcementSubmitting.value = false
  }
}
</script>

<style scoped lang="less">
.basic-layout {
  height: 100vh;
  overflow: hidden;
}

.layout-sider {
  border-right: 1px solid #e8e8e8;
  height: 100vh;
  overflow-y: auto;

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 12px;
  }

  .logo-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 15px;
    font-weight: 600;
    color: #1677ff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;
  line-height: 64px;
  flex-shrink: 0;

  .trigger {
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    color: #666;

    &:hover {
      color: #1677ff;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .header-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f0f0f0;
      color: #1677ff;
    }
  }

  .user-info {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
    padding: 4px 8px;
    border-radius: 6px;
    margin-left: 8px;
    transition: all 0.2s;

    &:hover {
      background-color: #f0f0f0;
      color: #1677ff;
    }

    .username {
      font-size: 14px;
    }
  }
}

.layout-content {
  margin: 16px;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  overflow-y: auto;
  flex: 1;
}

.announcement-form {
  margin-top: 8px;
}

.announcement-preview {
  padding: 12px 14px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.announcement-preview-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.announcement-result {
  margin-top: 8px;
}

.announcement-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
