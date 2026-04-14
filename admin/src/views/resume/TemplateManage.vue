<template>
  <div class="template-manage">
    <a-page-header :title="$t('模板管理')" :sub-title="pageSubtitle">
      <template #extra>
        <a-space>
          <a-button @click="showUploadModal = true"><UploadOutlined /> {{ $t('上传 Word') }}</a-button>
          <a-button type="primary" @click="openCreateModal"><PlusOutlined /> {{ $t('新建模板') }}</a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <a-space>
        <a-radio-group v-model:value="categoryFilter" @change="handleSearch">
          <a-radio-button value="">{{ $t('全部') }}</a-radio-button>
          <a-radio-button v-for="cat in categories" :key="cat" :value="cat">{{ translateCategory(cat) }}</a-radio-button>
        </a-radio-group>
        <a-input-search
          v-model:value="keyword"
          :placeholder="$t('搜索模板')"
          style="width: 200px"
          allow-clear
          @search="handleSearch"
        />
      </a-space>
    </div>

    <!-- 模板卡片列表 -->
    <a-spin :spinning="loading">
      <a-empty v-if="templates.length === 0 && !loading" :description="$t('暂无模板')" />
      <a-row :gutter="16">
        <a-col :span="6" v-for="tpl in templates" :key="tpl.id" style="margin-bottom: 16px">
          <a-card hoverable class="template-card" @click="openEditModal(tpl)">
            <template #cover>
              <div class="template-preview" v-if="tpl.htmlContent">
                <iframe
                  :srcdoc="buildPreviewHtml(tpl)"
                  class="preview-iframe"
                  sandbox=""
                  scrolling="no"
                />
                <div class="preview-overlay">
                  <a-space>
                    <a-button type="primary" size="small" @click.stop="handlePreview(tpl)"><EyeOutlined /> {{ $t('预览') }}</a-button>
                    <a-button size="small" @click.stop="openEditModal(tpl)"><EditOutlined /> {{ $t('编辑') }}</a-button>
                  </a-space>
                </div>
              </div>
              <div class="no-cover" v-else>
                <FileImageOutlined style="font-size: 40px; color: #d9d9d9" />
                <div style="color: #999; font-size: 13px; margin-top: 8px">{{ $t('暂无封面') }}</div>
              </div>
            </template>
            <a-card-meta>
              <template #title>
                <div class="card-title">
                  {{ tpl.name }}
                  <a-tag v-if="tpl.isSystem" color="blue" size="small">系统</a-tag>
                </div>
              </template>
              <template #description>
                <a-tag color="default" size="small">{{ translateCategory(tpl.category) }}</a-tag>
                <span class="card-desc">{{ tpl.description || '' }}</span>
                <div class="card-meta">{{ $t('排序') }}: {{ tpl.sort }} · {{ formatTime(tpl.updatedAt || tpl.createdAt) }}</div>
              </template>
            </a-card-meta>
            <template #actions>
              <a-tooltip :title="$t('预览')"><EyeOutlined @click.stop="handlePreview(tpl)" /></a-tooltip>
              <a-tooltip :title="$t('编辑')"><EditOutlined @click.stop="openEditModal(tpl)" /></a-tooltip>
              <a-dropdown :trigger="['click']" @click.stop>
                <a-tooltip :title="$t('下载')"><DownloadOutlined /></a-tooltip>
                <template #overlay>
                  <a-menu @click="menuDownloadHandler(tpl)">
                    <a-menu-item key="word">{{ $t('下载 Word') }}</a-menu-item>
                    <a-menu-item key="pdf">{{ $t('下载 PDF') }}</a-menu-item>
                    <a-menu-item key="html">{{ $t('下载 HTML') }}</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <a-tooltip :title="$t('删除')">
                <a-popconfirm :title="tpl.isSystem ? $t('这是系统模板，确定要删除吗？') : $t('确定删除？')" @confirm="handleDelete(tpl.id)">
                  <DeleteOutlined @click.stop />
                </a-popconfirm>
              </a-tooltip>
            </template>
          </a-card>
        </a-col>
      </a-row>

      <!-- 分页 -->
      <div class="pagination-wrap" v-if="pagination.total > pagination.pageSize">
        <a-pagination
          v-model:current="pagination.current"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          show-size-changer
          :show-total="showTotal"
          @change="handlePageChange"
          @showSizeChange="handleSizeChange"
        />
      </div>
    </a-spin>

    <!-- 新建/编辑弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="editingId ? $t('编辑模板') : $t('新建模板')"
      :ok-text="$t('保存')"
      :cancel-text="$t('取消')"
      :confirm-loading="formLoading"
      @ok="handleFormSubmit"
      width="1100px"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item :label="$t('模板名称')" required>
              <a-input v-model:value="formData.name" :placeholder="$t('如：简约标准')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('模板分类')">
              <a-auto-complete
                v-model:value="formData.category"
                :options="allCategoryOptions"
                :placeholder="$t('选择或输入新分类')"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('描述')">
              <a-input v-model:value="formData.description" :placeholder="$t('简要描述')" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item :label="$t('排序')">
              <a-input-number v-model:value="formData.sort" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-tabs v-model:activeKey="editMode">
          <a-tab-pane key="visual" :tab="$t('可视化编辑')">
            <div class="visual-editor">
              <div class="editor-left">
                <div style="margin-bottom: 12px">
                  <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px">{{ $t('布局类型') }}</div>
                  <a-radio-group v-model:value="layoutType" size="small" @change="rebuildHtml" style="display: flex; flex-wrap: wrap; gap: 4px">
                    <a-radio-button value="standard">{{ $t('经典居中') }}</a-radio-button>
                    <a-radio-button value="leftbar">{{ $t('左侧栏') }}</a-radio-button>
                    <a-radio-button value="banner">{{ $t('顶部横幅') }}</a-radio-button>
                    <a-radio-button value="timeline">{{ $t('时间轴') }}</a-radio-button>
                  </a-radio-group>
                </div>
                <div class="section-header">
                  <span style="font-weight: 600; font-size: 14px">{{ $t('模板区块') }}</span>
                  <a-button size="small" type="dashed" @click="loadDefaultSections">{{ $t('重置') }}</a-button>
                </div>
                <div class="section-list">
                  <div
                    v-for="(sec, idx) in sections"
                    :key="sec.key"
                    class="section-item"
                    :class="{ disabled: !sec.enabled }"
                  >
                    <div class="section-item-header">
                      <a-checkbox v-model:checked="sec.enabled" @change="rebuildHtml" />
                      <input v-model="sec.title" class="section-title-input" @input="rebuildHtml" />
                      <div class="section-actions">
                        <a-button size="small" :disabled="idx === 0" @click="moveSection(idx, -1)">
                          <template #icon><span style="font-size: 12px">&#8593;</span></template>
                        </a-button>
                        <a-button size="small" :disabled="idx === sections.length - 1" @click="moveSection(idx, 1)">
                          <template #icon><span style="font-size: 12px">&#8595;</span></template>
                        </a-button>
                      </div>
                    </div>
                    <div class="section-desc">{{ sec.placeholder }}</div>
                  </div>
                </div>
                <div style="margin-top: 12px">
                  <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px">{{ $t('主题色') }}</div>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap">
                    <div
                      v-for="color in themeColors"
                      :key="color"
                      :style="{ background: color, width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', border: selectedColor === color ? '2px solid #333' : '2px solid transparent' }"
                      @click="selectedColor = color; rebuildHtml()"
                    />
                  </div>
                </div>
              </div>
              <div class="editor-right">
                <div class="preview-label">{{ $t('实时预览') }}</div>
                <div class="preview-container">
                  <iframe :srcdoc="livePreviewHtml" class="preview-frame" sandbox="" />
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="code" :tab="$t('代码编辑')">
            <div style="display: flex; gap: 8px; margin-bottom: 12px">
              <a-button size="small" @click="formatHtml">{{ $t('格式化 HTML') }}</a-button>
              <a-button size="small" @click="formatCss">{{ $t('格式化 CSS') }}</a-button>
              <a-button size="small" type="dashed" @click="loadDefaultTemplate">{{ $t('加载默认模板') }}</a-button>
            </div>
            <a-form-item :label="$t('HTML 模板内容')">
              <a-textarea
                v-model:value="formData.htmlContent"
                :rows="16"
                class="code-editor"
                :placeholder="$t('在此输入 HTML 模板代码，支持占位符如 {{name}}、{{skills}} 等')"
              />
            </a-form-item>
            <a-form-item :label="$t('CSS 样式')">
              <a-textarea
                v-model:value="formData.cssContent"
                :rows="8"
                class="code-editor"
                :placeholder="$t('在此输入 CSS 样式代码')"
              />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="preview" :tab="$t('实时预览')">
            <div class="live-preview-wrap">
              <iframe
                :srcdoc="buildPreviewHtml({ htmlContent: formData.htmlContent, cssContent: formData.cssContent }, true)"
                class="live-preview-iframe"
                sandbox=""
              />
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-modal>

    <!-- 上传 Word 模板弹窗 -->
    <a-modal
      v-model:open="showUploadModal"
      :title="$t('上传 Word 简历模板')"
      :footer="null"
      width="640px"
      :destroy-on-close="true"
    >
      <a-alert
        type="info"
        show-icon
        style="margin-bottom: 16px"
        :message="$t('Word 模板上传说明')"
      >
        <template #description>
          <ul style="margin: 0; padding-left: 16px; line-height: 2">
            <li>{{ $t('仅支持 .docx 格式（Word 2007+）') }}</li>
            <li>{{ $t('模板中可使用占位符，导入后会自动解析为 HTML') }}</li>
            <li>{{ $t('建议使用简洁排版，复杂样式可能无法完全还原') }}</li>
            <li>{{ $t('上传后可在编辑器中进一步调整 HTML 和 CSS') }}</li>
          </ul>
        </template>
      </a-alert>

      <div style="margin-bottom: 16px">
        <a-form-item :label="$t('模板名称')" style="margin-bottom: 12px">
          <a-input v-model:value="uploadName" :placeholder="$t('为上传的模板命名（可选，默认使用文件名）')" />
        </a-form-item>
        <a-form-item :label="$t('模板分类')" style="margin-bottom: 12px">
          <a-auto-complete
            v-model:value="uploadCategory"
            :options="allCategoryOptions"
            :placeholder="$t('选择已有分类或输入新分类')"
            style="width: 100%"
          />
        </a-form-item>
      </div>

      <a-upload-dragger
        :before-upload="handleUploadDocxWithModal"
        :show-upload-list="false"
        accept=".docx"
        :disabled="uploading"
      >
        <p style="font-size: 40px; color: #1677ff; margin-bottom: 8px">
          <UploadOutlined />
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 4px">
          {{ uploading ? $t('解析上传中...') : $t('点击或拖拽 .docx 文件到此处') }}
        </p>
        <p style="font-size: 13px; color: #999">
          {{ $t('支持 Word 2007+ (.docx) 格式，最大 10MB') }}
        </p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, UploadOutlined, EyeOutlined, EditOutlined, DeleteOutlined, FileImageOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { useI18n } from '@/i18n'
import {
  getResumeTemplatesApi, getTemplateDetailApi,
  createTemplateApi, updateTemplateApi, deleteTemplateApi,
  uploadTemplateDocxApi, getTemplateCategoriesApi,
} from '@/api/resume'

const { t, formatDateTime } = useI18n()
const loading = ref(false)
const templates = ref<any[]>([])
const categories = ref<string[]>([])
const categoryFilter = ref('')
const keyword = ref('')
const pagination = reactive({ current: 1, pageSize: 12, total: 0 })
const DEFAULT_CATEGORY = '通用'
const pageSubtitle = computed(() => t('共 {count} 个模板', { count: pagination.total }))
const showTotal = (total: number) => t('共 {count} 个', { count: total })

const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const editMode = ref('visual')
const formData = reactive({ name: '', description: '', category: DEFAULT_CATEGORY, htmlContent: '', cssContent: '', sort: 0 })

const allCategoryOptions = computed(() => {
  return categories.value.map(c => ({ value: c, label: translateCategory(c) }))
})

const showUploadModal = ref(false)
const uploading = ref(false)
const uploadName = ref('')
const uploadCategory = ref(DEFAULT_CATEGORY)

interface Section { key: string; title: string; placeholder: string; enabled: boolean }

function createDefaultSections(): Section[] {
  return [
    { key: 'header', title: t('个人信息'), placeholder: '{{name}} · {{phone}} · {{email}}', enabled: true },
    { key: 'selfIntro', title: t('自我评价'), placeholder: '{{selfIntro}}', enabled: true },
    { key: 'education', title: t('教育经历'), placeholder: '{{education}}', enabled: true },
    { key: 'experience', title: t('实习/工作经历'), placeholder: '{{experience}}', enabled: true },
    { key: 'projects', title: t('项目经验'), placeholder: '{{projects}}', enabled: true },
    { key: 'skills', title: t('技能'), placeholder: '{{skills}}', enabled: true },
  ]
}

const sections = ref<Section[]>(createDefaultSections())
const selectedColor = ref('#1677ff')
const layoutType = ref<'standard' | 'leftbar' | 'banner' | 'timeline'>('standard')
const themeColors = ['#1677ff', '#2f54eb', '#722ed1', '#eb2f96', '#13c2c2', '#52c41a', '#fa8c16', '#f5222d', '#333333']
const livePreviewHtml = ref('')

function loadDefaultSections() {
  sections.value = createDefaultSections()
  selectedColor.value = '#1677ff'
  rebuildHtml()
}

function moveSection(idx: number, dir: number) {
  const target = idx + dir
  if (target < 0 || target >= sections.value.length) return
  const arr = [...sections.value]
  ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
  sections.value = arr
  rebuildHtml()
}

function rebuildHtml() {
  const color = selectedColor.value
  const enabled = sections.value.filter(s => s.enabled)
  const layout = layoutType.value

  const sectionHtml = (sec: Section): string => {
    if (sec.key === 'header') return ''
    if (sec.key === 'skills') return `<div class="section"><h2>${sec.title}</h2><div class="skills">{{skills}}</div></div>`
    if (sec.key === 'selfIntro') return `<div class="section"><h2>${sec.title}</h2><p>{{selfIntro}}</p></div>`
    return `<div class="section"><h2>${sec.title}</h2>{{${sec.key}}}</div>`
  }

  const mainSections = enabled.filter(s => s.key !== 'header').map(sectionHtml).join('')
  const hasHeader = enabled.some(s => s.key === 'header')
  const sidebarSections = enabled.filter(s => ['header', 'skills', 'education'].includes(s.key))
  const contentSections = enabled.filter(s => !['header', 'skills', 'education'].includes(s.key))

  let html = ''
  if (layout === 'standard') {
    const header = hasHeader ? `<div class="header"><div class="avatar-wrap"><img class="avatar-img" src="{{avatar}}" alt="头像" /></div><h1>{{name}}</h1><div class="contact">{{phone}} | {{email}}</div><div class="contact">{{school}} · {{major}} · {{graduationYear}}</div></div>` : ''
    html = `<div class="resume">${header}${mainSections}</div>`
  } else if (layout === 'leftbar') {
    const sideItems = sidebarSections.map(s => {
      if (s.key === 'header') return `<div class="avatar-wrap"><img class="avatar-img" src="{{avatar}}" alt="头像" /></div><div class="sidebar-section"><h3>联系方式</h3><p>{{phone}}</p><p>{{email}}</p></div>`
      if (s.key === 'education') return `<div class="sidebar-section"><h3>${s.title}</h3><p>{{school}}</p><p>{{major}}</p><p>{{graduationYear}}</p></div>`
      if (s.key === 'skills') return `<div class="sidebar-section"><h3>${s.title}</h3><div class="skills">{{skills}}</div></div>`
      return ''
    }).join('')
    const mainItems = contentSections.map(sectionHtml).join('')
    html = `<div class="resume two-col"><div class="sidebar">${sideItems}</div><div class="main">${mainItems}</div></div>`
  } else if (layout === 'banner') {
    const banner = hasHeader ? `<div class="banner"><h1>{{name}}</h1><div class="contact-row"><span>{{phone}}</span><span>{{email}}</span><span>{{school}} · {{major}}</span></div></div>` : ''
    html = `<div class="resume">${banner}<div class="body">${mainSections}</div></div>`
  } else if (layout === 'timeline') {
    const header = hasHeader ? `<div class="header"><h1>{{name}}</h1><div class="contact">{{phone}} · {{email}} · {{school}} {{major}} {{graduationYear}}</div></div>` : ''
    const tlSections = enabled.filter(s => s.key !== 'header').map(s => {
      if (s.key === 'skills') return `<div class="section"><h2>${s.title}</h2><div class="skills">{{skills}}</div></div>`
      if (s.key === 'selfIntro') return `<div class="section"><h2>${s.title}</h2><p>{{selfIntro}}</p></div>`
      return `<div class="section"><h2>${s.title}</h2><div class="timeline">{{${s.key}}}</div></div>`
    }).join('')
    html = `<div class="resume">${header}${tlSections}</div>`
  }

  formData.htmlContent = html
  formData.cssContent = generateCssForLayout(color, layout)
  updateLivePreview()
}

function generateCssForLayout(color: string, layout: string): string {
  const base = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff}`
  const common = `.section{margin-bottom:20px}.section p{line-height:1.8;font-size:14px}.item{margin-bottom:10px;font-size:14px;line-height:1.6}.item strong{color:#333}.item .time{color:#999;font-size:13px;float:right}.item p{color:#666;margin-top:4px}`

  if (layout === 'leftbar') {
    return `${base}.two-col{display:flex;min-height:100vh}.sidebar{width:240px;background:${color};color:#fff;padding:30px 20px;flex-shrink:0}.avatar-wrap{text-align:center;margin-bottom:20px}.avatar-img{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3)}.sidebar-section{margin-bottom:20px}.sidebar-section h3{font-size:14px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.3)}.sidebar-section p{font-size:13px;margin-bottom:4px;opacity:0.9}.sidebar .skills{display:flex;flex-wrap:wrap;gap:6px}.sidebar .skill-tag{background:rgba(255,255,255,0.2);color:#fff;padding:2px 8px;border-radius:3px;font-size:12px}.main{flex:1;padding:30px}${common}.section h2{font-size:18px;color:${color};margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid ${color}}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:${color}10;color:${color};padding:2px 10px;border-radius:4px;font-size:13px}@media print{body{padding:0}@page{margin:10mm}}`
  }
  if (layout === 'banner') {
    return `${base}.banner{background:linear-gradient(135deg,${color},${color}dd);color:#fff;padding:40px;text-align:center}.banner h1{font-size:32px;margin-bottom:10px;letter-spacing:4px}.contact-row{display:flex;justify-content:center;gap:20px;font-size:14px;opacity:0.9}.body{padding:30px 40px}${common}.section h2{font-size:16px;color:${color};margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #eee}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:${color}10;color:${color};padding:3px 12px;border-radius:20px;font-size:13px;border:1px solid ${color}30}@media print{.banner{padding:24px}body{padding:0}@page{margin:10mm}}`
  }
  if (layout === 'timeline') {
    return `${base}body{padding:40px}.resume{max-width:800px;margin:0 auto}.header{margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid ${color}}.header h1{font-size:30px;color:${color};margin-bottom:6px}.contact{font-size:14px;color:#666}${common}.section h2{font-size:16px;color:${color};margin-bottom:12px;display:flex;align-items:center;gap:8px}.section h2::before{content:'';width:4px;height:16px;background:${color};border-radius:2px}.timeline{border-left:2px solid ${color}30;padding-left:16px}.timeline .item{position:relative}.timeline .item::before{content:'';position:absolute;left:-21px;top:6px;width:10px;height:10px;background:${color};border-radius:50%}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:${color}10;color:${color};padding:3px 12px;border-radius:4px;font-size:13px}@media print{body{padding:20px}@page{margin:15mm}}`
  }
  return `${base}body{padding:40px}.resume{max-width:800px;margin:0 auto}.header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid ${color}}.avatar-wrap{margin-bottom:12px}.avatar-img{width:80px;height:80px;border-radius:50%;object-fit:cover}.header h1{font-size:28px;color:${color};margin-bottom:8px}.contact{font-size:14px;color:#666;margin-bottom:4px}${common}.section h2{font-size:16px;color:${color};border-bottom:1px solid #e8e8e8;padding-bottom:6px;margin-bottom:12px}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:${color}10;color:${color};padding:2px 10px;border-radius:4px;font-size:13px;border:1px solid ${color}30}@media print{body{padding:20px}@page{margin:15mm}}`
}

function updateLivePreview() {
  livePreviewHtml.value = buildPreviewHtml({ htmlContent: formData.htmlContent, cssContent: formData.cssContent }, true)
}

watch(formVisible, (val) => {
  if (val) {
    parseSectionsFromHtml()
    updateLivePreview()
  }
})

watch([() => formData.htmlContent, () => formData.cssContent], () => {
  updateLivePreview()
}, { deep: true })

function parseSectionsFromHtml() {
  const html = formData.htmlContent || ''
  if (!html) {
    loadDefaultSections()
    return
  }
  const css = formData.cssContent || ''
  const color = extractColor(css)
  if (color) selectedColor.value = color
  if (html.includes('two-col')) layoutType.value = 'leftbar'
  else if (html.includes('banner')) layoutType.value = 'banner'
  else if (html.includes('timeline')) layoutType.value = 'timeline'
  else layoutType.value = 'standard'
}

function formatTime(time: string) {
  if (!time) return '-'
  return formatDateTime(time, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function translateCategory(category?: string) {
  const raw = String(category || '').trim()
  return raw ? t(raw) : t('未分类')
}

const SAMPLE_DATA: Record<string, string> = {
  '{{avatar}}': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzE2NzdmZiIgcng9IjUwIi8+PHRleHQgeD0iNTAiIHk9IjYwIiBmb250LXNpemU9IjQwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5bygPC90ZXh0Pjwvc3ZnPg==',
  '{{name}}': '张三',
  '{{phone}}': '138-0000-0000',
  '{{email}}': 'zhangsan@example.com',
  '{{school}}': '清华大学',
  '{{major}}': '计算机科学与技术',
  '{{graduationYear}}': '2026',
  '{{selfIntro}}': '热爱技术，具有扎实的编程基础和良好的团队协作能力。在校期间积极参与项目实践，拥有丰富的前端开发经验。',
  '{{skills}}': '<span class="skill-tag">JavaScript</span> <span class="skill-tag">TypeScript</span> <span class="skill-tag">Vue.js</span> <span class="skill-tag">React</span> <span class="skill-tag">Node.js</span>',
  '{{education}}': '<div class="item"><strong>清华大学</strong> - 计算机科学与技术 <span class="time">2022.09 ~ 2026.06</span></div>',
  '{{experience}}': '<div class="item"><strong>字节跳动</strong> - 前端开发实习生 <span class="time">2025.06 ~ 2025.09</span><p>负责抖音电商后台管理系统的前端开发与优化</p></div>',
  '{{projects}}': '<div class="item"><strong>校园招聘平台</strong> <span class="time">2025.03 ~ 2025.06</span><p>基于 Vue3 + NestJS 的全栈项目，支持简历管理、AI 面试等功能</p></div>',
}

function buildPreviewHtml(tpl: any, fullScale = false) {
  let html = tpl.htmlContent || ''
  const css = (tpl.cssContent || '').replace(/<\/?script[^>]*>/gi, '')

  for (const [placeholder, value] of Object.entries(SAMPLE_DATA)) {
    html = html.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  }

  const bodyStyle = fullScale
    ? 'margin:0;padding:40px;'
    : 'margin:0;padding:20px 24px;overflow:hidden;pointer-events:none;transform-origin:top left;transform:scale(0.42);width:700px'

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{${bodyStyle}}
${css}
</style></head><body>${html}</body></html>`
}

async function fetchTemplates() {
  loading.value = true
  try {
    const res = await getResumeTemplatesApi({
      page: pagination.current, pageSize: pagination.pageSize,
      category: categoryFilter.value || undefined,
      keyword: keyword.value || undefined,
    })
    templates.value = res.data?.list || res.data || []
    pagination.total = res.data?.total || templates.value.length
  } catch { message.error(t('获取模板失败')) }
  finally { loading.value = false }
}

async function fetchCategories() {
  try {
    const res = await getTemplateCategoriesApi()
    categories.value = res.data || []
  } catch { categories.value = [] }
}

function handleSearch() { pagination.current = 1; fetchTemplates() }
function handlePageChange(page: number) { pagination.current = page; fetchTemplates() }
function handleSizeChange(_: number, size: number) { pagination.current = 1; pagination.pageSize = size; fetchTemplates() }

function extractColor(css: string): string {
  const match = css.match(/border-bottom:\s*2px solid\s*(#[0-9a-fA-F]{6})/)
  return match?.[1] || ''
}

function openCreateModal() {
  editingId.value = null; editMode.value = 'visual'
  Object.assign(formData, { name: '', description: '', category: DEFAULT_CATEGORY, htmlContent: '', cssContent: '', sort: 0 })
  loadDefaultSections()
  formVisible.value = true
}

async function openEditModal(record: any) {
  editingId.value = record.id; editMode.value = 'visual'
  try {
    const res = await getTemplateDetailApi(record.id)
    const d = res.data
    Object.assign(formData, {
      name: String(d.name || ''),
      description: String(d.description || ''),
      category: String(d.category || DEFAULT_CATEGORY),
      htmlContent: String(d.htmlContent || ''),
      cssContent: String(d.cssContent || ''),
      sort: d.sort || 0,
    })
  } catch {
    Object.assign(formData, { name: record.name, description: '', category: DEFAULT_CATEGORY, htmlContent: '', cssContent: '', sort: 0 })
  }
  formVisible.value = true
}

async function handleFormSubmit() {
  if (!formData.name.trim()) return message.warning(t('请输入模板名称'))
  formLoading.value = true
  try {
    if (editingId.value) { await updateTemplateApi(editingId.value, formData); message.success(t('已更新')) }
    else { await createTemplateApi(formData); message.success(t('已创建')) }
    formVisible.value = false
    fetchTemplates(); fetchCategories()
  } catch { message.error(t('操作失败')) }
  finally { formLoading.value = false }
}

async function handleDelete(id: number) {
  try { await deleteTemplateApi(id); message.success(t('已删除')); fetchTemplates(); fetchCategories() }
  catch { message.error(t('删除失败')) }
}

function handlePreview(record: any) {
  const w = window.open('', '_blank')
  if (w) {
    const html = buildPreviewHtml(record, true)
    w.document.write(html)
    w.document.close()
  }
}

async function handleUploadDocxWithModal(file: File) {
  uploading.value = true
  const fd = new FormData()
  fd.append('file', file)
  fd.append('name', uploadName.value.trim() || file.name.replace(/\.docx$/i, ''))
  try {
    message.loading({ content: t('解析中...'), key: 'upload' })
    await uploadTemplateDocxApi(fd)
    message.success({ content: t('导入成功'), key: 'upload' })
    showUploadModal.value = false
    uploadName.value = ''
    uploadCategory.value = DEFAULT_CATEGORY
    fetchTemplates(); fetchCategories()
  } catch { message.error({ content: t('导入失败'), key: 'upload' }) }
  finally { uploading.value = false }
  return false
}

function formatHtml() {
  let html = formData.htmlContent || ''
  html = html
    .replace(/>\s*</g, '>\n<')
    .replace(/(<\/?(div|section|h[1-6]|p|ul|ol|li|table|tr|td|th|thead|tbody|form|header|footer|main|nav|article)[^>]*>)/gi, '\n$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  formData.htmlContent = html
}

function formatCss() {
  let css = formData.cssContent || ''
  css = css
    .replace(/\{/g, ' {\n  ')
    .replace(/;/g, ';\n  ')
    .replace(/\s*\}\s*/g, '\n}\n')
    .replace(/\n\s*\n/g, '\n')
    .trim()
  formData.cssContent = css
}

function loadDefaultTemplate() {
  formData.htmlContent = `<div class="resume">
  <div class="header">
    <h1>{{name}}</h1>
    <div class="contact">{{phone}} | {{email}}</div>
    <div class="contact">{{school}} · {{major}} · {{graduationYear}}</div>
  </div>

  <div class="section">
    <h2>${t('自我评价')}</h2>
    <p>{{selfIntro}}</p>
  </div>

  <div class="section">
    <h2>${t('教育经历')}</h2>
    {{education}}
  </div>

  <div class="section">
    <h2>${t('实习/工作经历')}</h2>
    {{experience}}
  </div>

  <div class="section">
    <h2>${t('项目经验')}</h2>
    {{projects}}
  </div>

  <div class="section">
    <h2>${t('技能')}</h2>
    <div class="skills">{{skills}}</div>
  </div>
</div>`

  formData.cssContent = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Microsoft YaHei', sans-serif; color: #333; background: #fff; padding: 40px; }
.resume { max-width: 800px; margin: 0 auto; }
.header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #1677ff; }
.header h1 { font-size: 28px; color: #1677ff; margin-bottom: 8px; }
.contact { font-size: 14px; color: #666; margin-bottom: 4px; }
.section { margin-bottom: 20px; }
.section h2 { font-size: 16px; color: #1677ff; border-bottom: 1px solid #e8e8e8; padding-bottom: 6px; margin-bottom: 12px; }
.section p { line-height: 1.8; font-size: 14px; }
.item { margin-bottom: 10px; font-size: 14px; line-height: 1.6; }
.item strong { color: #333; }
.item .time { color: #999; font-size: 13px; float: right; }
.item p { color: #666; margin-top: 4px; }
.skills { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag { background: #f0f5ff; color: #1677ff; padding: 2px 10px; border-radius: 4px; font-size: 13px; border: 1px solid #d6e4ff; }
@media print { body { padding: 20px; } @page { margin: 15mm; } }`
  message.success(t('已加载默认模板'))
}

function menuDownloadHandler(tpl: any) {
  return (info: { key: string }) => handleDownload(tpl, info.key)
}

function handleDownload(tpl: any, format: string) {
  const fullHtml = buildPreviewHtml(tpl, true)
  const fileName = tpl.name || '模板'

  if (format === 'html') {
    downloadBlob(new Blob([fullHtml], { type: 'text/html;charset=utf-8' }), `${fileName}.html`)
  } else if (format === 'pdf') {
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(fullHtml + '<script>setTimeout(()=>{window.print()},500)<\/script>')
      w.document.close()
    } else {
      message.warning(t('请允许弹窗以下载 PDF'))
    }
  } else if (format === 'word') {
    const wordDoc = buildWordDocument(tpl)
    downloadBlob(new Blob(['\ufeff' + wordDoc], { type: 'application/msword;charset=utf-8' }), `${fileName}.doc`)
    message.success(t('Word 文件已下载'))
  }
}

function buildWordDocument(tpl: any): string {
  let html = tpl.htmlContent || ''
  const css = (tpl.cssContent || '').replace(/<\/?script[^>]*>/gi, '')
  for (const [placeholder, value] of Object.entries(SAMPLE_DATA)) {
    html = html.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  }
  return `<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!--[if gte mso 9]><xml>
<w:WordDocument><w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument></xml><![endif]-->
<style>
@page { size: 210mm 297mm; margin: 2cm 2cm 2cm 2cm; }
body { font-family: '微软雅黑', 'Microsoft YaHei', sans-serif; font-size: 14pt; line-height: 1.8; color: #333; }
h1 { font-size: 26pt; }
h2 { font-size: 18pt; }
h3 { font-size: 16pt; }
.item { font-size: 14pt; }
.skill-tag { font-size: 13pt; }
${css}
</style>
</head>
<body>${html}</body></html>`
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => { fetchTemplates(); fetchCategories() })
</script>

<style scoped lang="less">
.template-manage {
}

.filter-bar {
  margin-bottom: 16px;
}

.template-card {
  :deep(.ant-card-cover) { padding: 0; }
  :deep(.ant-card-body) { padding: 12px 16px; }
}

.template-preview {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: inset 0 -20px 30px -10px rgba(0,0,0,0.04);

  .preview-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 700px;
    height: 900px;
    border: none;
    pointer-events: none;
  }

  .preview-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover .preview-overlay { opacity: 1; }
}

.no-cover {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.card-desc {
  font-size: 12px;
  color: #666;
  margin-left: 4px;
}

.card-meta {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.visual-editor {
  display: flex;
  gap: 16px;
  height: 500px;

  .editor-left {
    width: 320px;
    flex-shrink: 0;
    overflow-y: auto;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 12px;
    background: #fafafa;
  }

  .editor-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .section-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section-item {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 8px 12px;
    transition: all 0.2s;

    &:hover { border-color: #1677ff; }
    &.disabled { opacity: 0.5; }
  }

  .section-item-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    outline: none;
    padding: 2px 4px;
    border-radius: 4px;

    &:focus { background: #f0f0f0; }
  }

  .section-actions {
    display: flex;
    gap: 2px;
  }

  .section-desc {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
    margin-left: 28px;
  }

  .preview-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 6px;
  }

  .preview-container {
    flex: 1;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    background: #f5f5f5;
  }

  .preview-frame {
    width: 100%;
    height: 100%;
    border: none;
    background: #fff;
  }
}

.code-editor {
  :deep(textarea) {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
    font-size: 13px !important;
    line-height: 1.6 !important;
    tab-size: 2;
    white-space: pre;
    overflow-x: auto;
  }
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.live-preview-wrap {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  height: 500px;
  display: flex;
  justify-content: center;
  padding: 16px;

  .live-preview-iframe {
    width: 800px;
    height: 100%;
    border: none;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}
</style>
