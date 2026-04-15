<template>
  <div class="announcement-page">
    <a-page-header title="公告管理" sub-title="向指定范围活跃用户发送系统通知">
      <template #extra>
        <a-button type="primary" @click="openModal">
          <template #icon><NotificationOutlined /></template>
          发送新公告
        </a-button>
      </template>
    </a-page-header>

    <a-alert
      v-if="lastSendHint"
      type="success"
      show-icon
      closable
      class="hint-banner"
      :message="lastSendHint"
      @close="lastSendHint = ''"
    />

    <a-card title="最近发送记录" class="history-card">
      <template v-if="history.length">
        <a-row :gutter="[16, 16]">
          <a-col v-for="(item, idx) in history" :key="idx" :xs="24" :sm="12" :lg="8">
            <a-card size="small" class="history-item" :bordered="true">
              <div class="history-title">{{ item.title }}</div>
              <p class="history-excerpt">{{ excerpt(item.content) }}</p>
              <div class="history-meta">
                <span>{{ formatTime(item.sentAt) }}</span>
                <a-tag color="blue">已送达 {{ item.userCount }} 人</a-tag>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </template>
      <a-empty v-else description="暂无记录；发送公告后将显示在本页（仅保存在本浏览器）" />
    </a-card>

    <a-modal
      v-model:open="modalOpen"
      title="发送新公告"
      width="720px"
      destroy-on-close
      :confirm-loading="submitting"
      :ok-text="modalOkText"
      cancel-text="取消"
      @ok="handleSend"
    >
      <a-form layout="vertical" class="modal-form">
        <a-form-item label="发送范围" required>
          <a-radio-group v-model:value="sendTarget">
            <a-radio value="all">全部用户</a-radio>
            <a-radio value="student">仅学生</a-radio>
            <a-radio value="enterprise">仅企业</a-radio>
            <a-radio value="specific">指定用户</a-radio>
          </a-radio-group>
        </a-form-item>

        <template v-if="sendTarget === 'specific'">
          <a-form-item label="搜索并添加用户">
            <a-input
              v-model:value="userSearchKeyword"
              placeholder="用户名 / 昵称 / 邮箱"
              allow-clear
              @update:value="scheduleUserSearch"
            />
            <a-spin :spinning="userSearchLoading" class="user-search-spin">
              <a-list
                v-if="userSearchOptions.length"
                size="small"
                bordered
                class="user-pick-list"
                :data-source="userSearchOptions"
              >
                <template #renderItem="{ item }">
                  <a-list-item>
                    <div class="user-pick-main">
                      <a-avatar
                        v-if="item.avatar"
                        :size="28"
                        :src="item.avatar"
                        class="user-pick-avatar"
                      />
                      <a-avatar
                        v-else
                        :size="28"
                        class="user-pick-avatar"
                        style="background-color: #1677ff; font-size: 12px"
                      >
                        {{ (item.username || '?').charAt(0) }}
                      </a-avatar>
                      <div class="user-pick-text">
                        <div class="user-pick-line1">
                          <span class="user-pick-username">{{ item.username }}</span>
                          <span v-if="item.nickname" class="user-pick-nick">（{{ item.nickname }}）</span>
                        </div>
                        <div v-if="item.email" class="user-pick-email">{{ item.email }}</div>
                      </div>
                      <a-tag :color="roleBadgeColor(item.role)" size="small" class="user-pick-role">
                        {{ roleBadgeLabel(item.role) }}
                      </a-tag>
                    </div>
                    <template #actions>
                      <a-button type="link" size="small" @click="addSelectedUser(item)">添加</a-button>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-spin>
          </a-form-item>
          <a-form-item v-if="selectedUsers.length" label="已选用户">
            <div class="selected-tags">
              <a-tag
                v-for="u in selectedUsers"
                :key="u.id"
                closable
                class="selected-user-tag"
                @close="removeSelectedUser(u.id)"
              >
                <span class="selected-user-tag-inner">
                  <a-avatar
                    v-if="u.avatar"
                    :size="20"
                    :src="u.avatar"
                    class="selected-user-avatar"
                  />
                  <a-avatar
                    v-else
                    :size="20"
                    class="selected-user-avatar"
                    style="background-color: #1677ff; font-size: 11px"
                  >
                    {{ (u.username || '?').charAt(0) }}
                  </a-avatar>
                  <span class="selected-user-names">
                    {{ u.username }}<template v-if="u.nickname"> · {{ u.nickname }}</template>
                  </span>
                </span>
              </a-tag>
            </div>
          </a-form-item>
        </template>

        <a-form-item label="标题" required>
          <a-input
            v-model:value="form.title"
            placeholder="请输入公告标题"
            :maxlength="200"
            show-count
          />
        </a-form-item>
        <a-form-item label="正文" required>
          <div class="announcement-editor-wrap">
            <Toolbar :editor="editorRef" :default-config="toolbarConfig" class="announcement-editor-toolbar" />
            <Editor
              v-model="form.content"
              :default-config="editorConfig"
              style="height: 300px; overflow-y: auto"
              @onCreated="handleEditorCreated"
            />
          </div>
        </a-form-item>
        <a-form-item label="预览（用户收到的通知文案）">
          <div class="preview-box">{{ previewText }}</div>
          <div v-if="previewTruncated" class="preview-hint">
            通知正文最长 500 字，超出部分发送时将截断
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore - wangeditor types
import { ref, reactive, computed, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { message } from 'ant-design-vue'
import { NotificationOutlined } from '@ant-design/icons-vue'
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { sendAnnouncementApi } from '@/api/system'
import { getUsersAdminApi } from '@/api/user'

const STORAGE_KEY = 'admin-announcement-history'
const NOTIFICATION_MAX = 500
const EXCERPT_LEN = 120
const CONTENT_PLAIN_MAX = 5000

const editorRef = shallowRef<IDomEditor>()
const toolbarConfig: Partial<IToolbarConfig> = {}
const editorConfig: Partial<IEditorConfig> = { placeholder: '请输入公告内容...' }

function handleEditorCreated(editor: IDomEditor) {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})

type SendTarget = 'all' | 'student' | 'enterprise' | 'specific'

interface AdminUserRow {
  id: number
  username: string
  nickname?: string | null
  email?: string | null
  avatar?: string | null
  role?: string | null
}

interface HistoryItem {
  title: string
  content: string
  sentAt: string
  userCount: number
}

const modalOpen = ref(false)
const submitting = ref(false)
const lastSendHint = ref('')
const history = ref<HistoryItem[]>([])

const sendTarget = ref<SendTarget>('all')
const form = reactive({ title: '', content: '' })

const userSearchKeyword = ref('')
const userSearchLoading = ref(false)
const userSearchOptions = ref<AdminUserRow[]>([])
const selectedUsers = ref<AdminUserRow[]>([])

let userSearchTimer: ReturnType<typeof setTimeout> | null = null

const modalOkText = computed(() => {
  switch (sendTarget.value) {
    case 'student':
      return '发送给学生用户'
    case 'enterprise':
      return '发送给企业用户'
    case 'specific':
      return '发送给已选用户'
    default:
      return '发送给全部用户'
  }
})

function htmlToPlain(html: string): string {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim()
}

function roleBadgeLabel(role?: string | null) {
  switch (role) {
    case 'student':
      return '学生'
    case 'enterprise':
      return '企业'
    case 'admin':
      return '管理员'
    default:
      return role || '用户'
  }
}

function roleBadgeColor(role?: string | null) {
  switch (role) {
    case 'student':
      return 'green'
    case 'enterprise':
      return 'blue'
    case 'admin':
      return 'purple'
    default:
      return 'default'
  }
}

const previewRaw = computed(() => {
  const t = form.title.trim()
  const c = htmlToPlain(form.content)
  if (!t && !c) return '（填写标题与正文后在此预览）'
  return `[公告] ${t || '（标题）'}: ${c || '（正文）'}`
})

const previewTruncated = computed(() => previewRaw.value.length > NOTIFICATION_MAX)

const previewText = computed(() => {
  const raw = previewRaw.value
  if (raw.length <= NOTIFICATION_MAX) return raw
  return `${raw.slice(0, NOTIFICATION_MAX)}…`
})

function scheduleUserSearch() {
  if (userSearchTimer) clearTimeout(userSearchTimer)
  userSearchTimer = setTimeout(() => {
    void runUserSearch()
  }, 300)
}

async function runUserSearch() {
  const kw = userSearchKeyword.value.trim()
  if (!kw) {
    userSearchOptions.value = []
    return
  }
  userSearchLoading.value = true
  try {
    const res = await getUsersAdminApi({ keyword: kw, page: 1, pageSize: 20 })
    const list = (res.data?.list || []) as AdminUserRow[]
    const selectedIds = new Set(selectedUsers.value.map((u) => u.id))
    userSearchOptions.value = list.filter((u) => !selectedIds.has(u.id))
  } catch {
    userSearchOptions.value = []
  } finally {
    userSearchLoading.value = false
  }
}

function addSelectedUser(row: AdminUserRow) {
  if (selectedUsers.value.some((u) => u.id === row.id)) return
  selectedUsers.value = [...selectedUsers.value, row]
  userSearchOptions.value = userSearchOptions.value.filter((u) => u.id !== row.id)
}

function removeSelectedUser(id: number) {
  selectedUsers.value = selectedUsers.value.filter((u) => u.id !== id)
  void runUserSearch()
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      history.value = []
      return
    }
    const parsed = JSON.parse(raw) as HistoryItem[]
    history.value = Array.isArray(parsed) ? parsed : []
  } catch {
    history.value = []
  }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)))
  history.value = items
}

function excerpt(text: string) {
  const t = htmlToPlain(text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= EXCERPT_LEN) return t || '—'
  return `${t.slice(0, EXCERPT_LEN)}…`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function openModal() {
  form.title = ''
  form.content = ''
  sendTarget.value = 'all'
  userSearchKeyword.value = ''
  userSearchOptions.value = []
  selectedUsers.value = []
  modalOpen.value = true
}

function sendScopeDescription(count: number): string {
  switch (sendTarget.value) {
    case 'student':
      return `学生用户（${count} 人）`
    case 'enterprise':
      return `企业用户（${count} 人）`
    case 'specific':
      return `指定用户（${count} 人）`
    default:
      return `全部用户（${count} 人）`
  }
}

async function handleSend() {
  const title = form.title.trim()
  const content = form.content.trim()
  const contentPlain = htmlToPlain(form.content)
  if (!title) {
    message.warning('请填写标题')
    return Promise.reject()
  }
  if (!contentPlain) {
    message.warning('请填写正文')
    return Promise.reject()
  }
  if (contentPlain.length > CONTENT_PLAIN_MAX) {
    message.warning(`正文纯文本长度请不超过 ${CONTENT_PLAIN_MAX} 字`)
    return Promise.reject()
  }
  if (sendTarget.value === 'specific' && selectedUsers.value.length === 0) {
    message.warning('请至少选择一名用户，或改用其他发送范围')
    return Promise.reject()
  }

  submitting.value = true
  try {
    const payload =
      sendTarget.value === 'specific'
        ? {
            title,
            content,
            userIds: selectedUsers.value.map((u) => u.id),
          }
        : {
            title,
            content,
            target: sendTarget.value,
          }
    const res = await sendAnnouncementApi(payload)
    const payloadData = res.data as { message?: string; notifiedCount: number }
    const userCount = typeof payloadData?.notifiedCount === 'number' ? payloadData.notifiedCount : 0
    message.success(`公告已发送：${sendScopeDescription(userCount)}`)
    lastSendHint.value = `公告已发送至${sendScopeDescription(userCount)}。用户将在「消息通知」中收到系统通知。`
    const entry: HistoryItem = {
      title,
      content,
      sentAt: new Date().toISOString(),
      userCount,
    }
    saveHistory([entry, ...history.value])
    modalOpen.value = false
  } catch {
    /* 拦截器已提示 */
    return Promise.reject()
  } finally {
    submitting.value = false
  }
}

onMounted(loadHistory)
</script>

<style scoped lang="less">
.announcement-page {
  .hint-banner {
    margin-bottom: 16px;
  }

  .history-card {
    margin-top: 8px;
    border-radius: 8px;
  }

  .history-item {
    border-radius: 8px;
    height: 100%;
  }

  .history-title {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 8px;
    color: #1f1f1f;
  }

  .history-excerpt {
    margin: 0 0 12px;
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    min-height: 40px;
  }

  .history-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: #999;
  }

  .modal-form {
    margin-top: 8px;
  }

  .announcement-editor-wrap {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    z-index: 100;
  }

  .announcement-editor-toolbar {
    border-bottom: 1px solid #d9d9d9;
  }

  .announcement-editor-body {
    height: 320px !important;
    overflow-y: auto;

    :deep(.w-e-text-container) {
      min-height: 300px !important;
    }
  }

  .user-pick-main {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .user-pick-avatar {
    flex-shrink: 0;
  }

  .user-pick-text {
    flex: 1;
    min-width: 0;
  }

  .user-pick-line1 {
    font-size: 14px;
    line-height: 1.4;
    word-break: break-all;
  }

  .user-pick-username {
    font-weight: 500;
    color: #1f1f1f;
  }

  .user-pick-nick {
    color: #666;
    font-size: 13px;
  }

  .user-pick-email {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-pick-role {
    flex-shrink: 0;
    margin: 0;
  }

  .selected-user-tag {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    padding-inline: 6px 4px;
    margin: 0;

    :deep(.ant-tag-close-icon) {
      margin-inline-start: 4px;
    }
  }

  .selected-user-tag-inner {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 100%;
  }

  .selected-user-avatar {
    flex-shrink: 0;
  }

  .selected-user-names {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
  }

  .user-search-spin {
    display: block;
    margin-top: 8px;
    min-height: 8px;
  }

  .user-pick-list {
    margin-top: 8px;
    max-height: 220px;
    overflow: auto;
    border-radius: 8px;
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .preview-box {
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

  .preview-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
}
</style>
