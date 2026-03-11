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
        <span v-if="!collapsed" class="logo-text">{{ systemStore.siteName }}</span>
        <span v-else class="logo-text">{{ systemStore.siteName.charAt(0) }}</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <DashboardOutlined />
          <span>仪表盘</span>
        </a-menu-item>
        <a-sub-menu v-if="userStore.userInfo?.role === 'admin'" key="community">
          <template #title>
            <TeamOutlined />
            <span>社区管理</span>
          </template>
          <a-menu-item key="community/posts">
            <MessageOutlined />
            <span>帖子管理</span>
          </a-menu-item>
          <a-menu-item key="community/comments">
            <CommentOutlined />
            <span>评论管理</span>
          </a-menu-item>
          <a-menu-item key="community/categories">
            <AppstoreOutlined />
            <span>分类管理</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-if="userStore.userInfo?.role === 'admin'" key="system/settings">
          <SettingOutlined />
          <span>系统设置</span>
        </a-menu-item>
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
                {{ (userStore.userInfo?.username || '管').charAt(0) }}
              </a-avatar>
              <span class="username">{{ userStore.userInfo?.username || '管理员' }}</span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="router.push('/profile?tab=info')">
                  <UserOutlined />
                  <span>个人信息</span>
                </a-menu-item>
                <a-menu-item @click="router.push('/profile?tab=password')">
                  <LockOutlined />
                  <span>修改密码</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="handleLogout">
                  <LogoutOutlined />
                  <span>退出登录</span>
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
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'

const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])
const openKeys = ref<string[]>([])
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const systemStore = useSystemStore()

function updateMenuState() {
  const path = route.path.replace(/^\//, '')
  selectedKeys.value = [path]
  if (path.startsWith('community/')) {
    openKeys.value = ['community']
  }
}

onMounted(() => {
  systemStore.fetchSettings()
  userStore.fetchUserInfo()
  updateMenuState()
})

watch(() => route.path, updateMenuState)

function handleMenuClick({ key }: { key: string }) {
  router.push(`/${key}`)
}

function handleLogout() {
  userStore.logout()
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

  .logo-avatar {
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

  .user-info {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;

    &:hover {
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
</style>
