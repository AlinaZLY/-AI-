<template>
  <div class="resume-manage">
    <a-page-header title="简历管理" sub-title="管理和优化你的简历">
      <template #extra>
        <a-button type="primary" @click="openCreateModal"><PlusOutlined /> 新建简历</a-button>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-empty v-if="resumes.length === 0 && !loading" description="暂无简历，点击右上角创建" />

      <a-row :gutter="16">
        <a-col :span="8" v-for="resume in resumes" :key="resume.id" style="margin-bottom: 16px">
          <a-card :bordered="true" hoverable @click="showDetail(resume)">
            <template #actions>
              <a-tooltip title="编辑"><EditOutlined @click.stop="openEditModal(resume)" /></a-tooltip>
              <a-tooltip title="复制"><CopyOutlined @click.stop="handleDuplicate(resume.id)" /></a-tooltip>
              <a-tooltip title="AI分析"><ThunderboltOutlined @click.stop="handleAnalyze(resume.id)" /></a-tooltip>
              <a-tooltip title="删除">
                <a-popconfirm title="确定删除？" @confirm="handleDelete(resume.id)">
                  <DeleteOutlined @click.stop />
                </a-popconfirm>
              </a-tooltip>
            </template>
            <a-card-meta>
              <template #title>
                <span>{{ resume.title }}</span>
                <a-tag v-if="resume.isDefault" color="blue" style="margin-left: 8px">默认</a-tag>
              </template>
              <template #description>
                <div v-if="resume.targetPosition"><FileTextOutlined /> {{ resume.targetPosition }}</div>
                <div style="font-size: 12px; color: #999; margin-top: 4px">
                  版本 v{{ resume.version }} · {{ formatTime(resume.updatedAt) }}
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>

    <!-- 新建/编辑弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="editingId ? '编辑简历' : '新建简历'"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="formLoading"
      @ok="handleFormSubmit"
      width="800px"
      :destroy-on-close="true"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="简历标题" required>
              <a-input v-model:value="formData.title" placeholder="如：前端开发简历" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="目标岗位">
              <a-input v-model:value="formData.targetPosition" placeholder="如：前端开发工程师" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="选择模板">
          <a-radio-group v-model:value="formData.templateId">
            <a-radio-button v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-divider>基本信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="8"><a-form-item label="姓名"><a-input v-model:value="formData.content.basicInfo.name" /></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="手机号"><a-input v-model:value="formData.content.basicInfo.phone" /></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="邮箱"><a-input v-model:value="formData.content.basicInfo.email" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8"><a-form-item label="学校"><a-input v-model:value="formData.content.basicInfo.school" /></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="专业"><a-input v-model:value="formData.content.basicInfo.major" /></a-form-item></a-col>
          <a-col :span="8"><a-form-item label="毕业年份"><a-input v-model:value="formData.content.basicInfo.graduationYear" /></a-form-item></a-col>
        </a-row>

        <a-divider>技能标签</a-divider>
        <a-form-item>
          <a-select v-model:value="formData.content.skills" mode="tags" placeholder="输入技能后按回车添加" />
        </a-form-item>

        <a-divider>自我评价</a-divider>
        <a-form-item>
          <a-textarea v-model:value="formData.content.selfIntro" :rows="3" placeholder="简要介绍自己" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情/分析 抽屉 -->
    <a-drawer
      v-model:open="detailVisible"
      :title="currentResume?.title"
      width="640"
      :destroy-on-close="true"
    >
      <template v-if="currentResume">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="目标岗位">{{ currentResume.targetPosition || '-' }}</a-descriptions-item>
          <a-descriptions-item label="版本">v{{ currentResume.version }}</a-descriptions-item>
          <a-descriptions-item label="默认">{{ currentResume.isDefault ? '是' : '否' }}</a-descriptions-item>
          <a-descriptions-item label="文件">{{ currentResume.filePath ? '已上传' : '未上传' }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>基本信息</a-divider>
        <a-descriptions :column="2" bordered size="small" v-if="currentResume.content?.basicInfo">
          <a-descriptions-item label="姓名">{{ currentResume.content.basicInfo.name || '-' }}</a-descriptions-item>
          <a-descriptions-item label="手机号">{{ currentResume.content.basicInfo.phone || '-' }}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{ currentResume.content.basicInfo.email || '-' }}</a-descriptions-item>
          <a-descriptions-item label="学校">{{ currentResume.content.basicInfo.school || '-' }}</a-descriptions-item>
          <a-descriptions-item label="专业">{{ currentResume.content.basicInfo.major || '-' }}</a-descriptions-item>
          <a-descriptions-item label="毕业年份">{{ currentResume.content.basicInfo.graduationYear || '-' }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>技能</a-divider>
        <div v-if="currentResume.content?.skills?.length">
          <a-tag v-for="s in currentResume.content.skills" :key="s" color="blue">{{ s }}</a-tag>
        </div>
        <span v-else style="color: #999">暂无技能标签</span>

        <a-divider>自我评价</a-divider>
        <p>{{ currentResume.content?.selfIntro || '暂无' }}</p>

        <template v-if="analysisResult">
          <a-divider>AI 分析结果</a-divider>
          <a-progress :percent="analysisResult.completeness" :status="analysisResult.completeness >= 80 ? 'success' : 'normal'" />
          <div style="margin-top: 8px; font-size: 13px; color: #666">完整度评分：{{ analysisResult.score }}%</div>
          <a-divider dashed />
          <h4>优化建议</h4>
          <ul>
            <li v-for="(s, i) in analysisResult.suggestions" :key="i">{{ s }}</li>
          </ul>
          <h4>关键词</h4>
          <a-tag v-for="k in analysisResult.keywords" :key="k" color="green" style="margin-bottom: 4px">{{ k }}</a-tag>
        </template>

        <a-divider />
        <a-space>
          <a-button v-if="!currentResume.isDefault" @click="handleSetDefault(currentResume.id)">设为默认</a-button>
          <a-button type="primary" @click="handlePreview(currentResume.id)"><EyeOutlined /> 预览简历</a-button>
          <a-button @click="handleAnalyze(currentResume.id)"><ThunderboltOutlined /> AI 分析</a-button>
          <a-button @click="handleOptimize(currentResume.id)"><RobotOutlined /> AI 优化</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined, EditOutlined, CopyOutlined, DeleteOutlined,
  ThunderboltOutlined, FileTextOutlined, RobotOutlined, EyeOutlined,
} from '@ant-design/icons-vue'
import {
  getResumesApi, getResumeDetailApi, createResumeApi, updateResumeApi,
  deleteResumeApi, duplicateResumeApi, setDefaultResumeApi,
  analyzeResumeApi, optimizeResumeApi, getResumeTemplatesApi, renderResumeApi,
} from '@/api/resume'

const loading = ref(false)
const resumes = ref<any[]>([])
const templates = ref<any[]>([])

const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const defaultContent = () => ({
  basicInfo: { name: '', phone: '', email: '', school: '', major: '', graduationYear: '' },
  education: [], experience: [], projects: [], skills: [] as string[], awards: [], selfIntro: '',
})
const formData = reactive({
  title: '', targetPosition: '', templateId: undefined as number | undefined,
  content: defaultContent(),
})

const detailVisible = ref(false)
const currentResume = ref<any>(null)
const analysisResult = ref<any>(null)

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

async function fetchResumes() {
  loading.value = true
  try {
    const res = await getResumesApi()
    resumes.value = res.data || []
  } catch { message.error('获取简历列表失败') }
  finally { loading.value = false }
}

async function fetchTemplates() {
  try {
    const res = await getResumeTemplatesApi()
    templates.value = res.data || []
  } catch { /* ignore */ }
}

function openCreateModal() {
  editingId.value = null
  formData.title = ''
  formData.targetPosition = ''
  formData.templateId = templates.value[0]?.id
  Object.assign(formData.content, defaultContent())
  formVisible.value = true
}

async function openEditModal(record: any) {
  editingId.value = record.id
  try {
    const res = await getResumeDetailApi(record.id)
    const d = res.data
    formData.title = d.title
    formData.targetPosition = d.targetPosition || ''
    formData.templateId = d.templateId
    Object.assign(formData.content, defaultContent(), d.content || {})
  } catch { message.error('获取详情失败') }
  formVisible.value = true
}

async function handleFormSubmit() {
  if (!formData.title.trim()) return message.warning('请输入简历标题')
  formLoading.value = true
  try {
    const payload = { title: formData.title, targetPosition: formData.targetPosition, templateId: formData.templateId, content: formData.content }
    if (editingId.value) {
      await updateResumeApi(editingId.value, payload)
      message.success('已更新')
    } else {
      await createResumeApi(payload)
      message.success('已创建')
    }
    formVisible.value = false
    fetchResumes()
  } catch { message.error('操作失败') }
  finally { formLoading.value = false }
}

async function handleDelete(id: number) {
  try { await deleteResumeApi(id); message.success('已删除'); fetchResumes() }
  catch { message.error('删除失败') }
}

async function handleDuplicate(id: number) {
  try { await duplicateResumeApi(id); message.success('已复制'); fetchResumes() }
  catch { message.error('复制失败') }
}

async function handleSetDefault(id: number) {
  try { await setDefaultResumeApi(id); message.success('已设为默认'); fetchResumes() }
  catch { message.error('操作失败') }
}

async function showDetail(record: any) {
  detailVisible.value = true
  analysisResult.value = null
  try {
    const res = await getResumeDetailApi(record.id)
    currentResume.value = res.data
    if (res.data?.analysisResult) {
      try { analysisResult.value = JSON.parse(res.data.analysisResult) } catch { /* ignore */ }
    }
  } catch { message.error('获取详情失败') }
}

async function handleAnalyze(id: number) {
  try {
    message.loading({ content: '正在分析...', key: 'analyze' })
    const res = await analyzeResumeApi(id)
    analysisResult.value = res.data
    message.success({ content: '分析完成', key: 'analyze' })
    if (currentResume.value?.id === id) {
      currentResume.value.analysisResult = JSON.stringify(res.data)
    }
  } catch { message.error({ content: '分析失败', key: 'analyze' }) }
}

async function handlePreview(id: number) {
  try {
    message.loading({ content: '正在生成预览...', key: 'preview' })
    const res = await renderResumeApi(id)
    const html = res.data?.html || ''
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      const safeHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\bon\w+\s*=/gi, 'data-disabled-')
      previewWindow.document.write(safeHtml)
      previewWindow.document.close()
    }
    message.destroy('preview')
  } catch { message.error({ content: '预览失败', key: 'preview' }) }
}

async function handleOptimize(id: number) {
  try {
    message.loading({ content: '正在优化...', key: 'optimize' })
    const res = await optimizeResumeApi(id)
    message.info({ content: res.data?.message || 'AI优化功能即将上线', key: 'optimize' })
  } catch { message.error({ content: '优化失败', key: 'optimize' }) }
}

onMounted(() => { fetchResumes(); fetchTemplates() })
</script>

<style scoped lang="less">
.resume-manage {
  :deep(.ant-card-actions) {
    background: #fafafa;
  }
}
</style>
