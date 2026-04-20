<template>
  <div class="category-manage">
    <a-page-header title="分类管理" sub-title="管理社区帖子分类" />
    <!-- 工具栏 -->
    <div class="toolbar">
      <a-button type="primary" @click="openCreateModal">
        <PlusOutlined /> 新建分类
      </a-button>
    </div>

    <!-- 分类列表表格 -->
    <a-table
      :columns="columns"
      :data-source="categories"
      :loading="loading"
      :pagination="false"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'icon'">
          <a-avatar
            v-if="record.icon && isUrl(record.icon)"
            :size="32"
            :src="getIconUrl(record.icon)"
            shape="square"
          />
          <a-avatar v-else :size="32" shape="square" style="background-color: #f0f0f0; color: #999">
            <AppstoreOutlined />
          </a-avatar>
        </template>
        <template v-if="column.key === 'name'">
          <a-tag :color="record.color || 'blue'">{{ record.name }}</a-tag>
        </template>
        <template v-if="column.key === 'postCount'">
          {{ record._postCount ?? '-' }}
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-popconfirm
              :title="$t('确定要删除分类「{name}」吗？').replace('{name}', record.name)"
              :ok-text="$t('删除')"
              :cancel-text="$t('取消')"
              :ok-button-props="{ danger: true }"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新建/编辑分类弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="editingId ? '编辑分类' : '新建分类'"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="formLoading"
      @ok="handleFormSubmit"
      width="560px"
    >
      <a-form layout="vertical">
        <a-form-item label="分类名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入分类名称" :maxlength="50" />
        </a-form-item>
        <a-form-item label="分类图标">
          <a-radio-group v-model:value="iconMode" style="margin-bottom: 12px">
            <a-radio-button value="upload">上传图标</a-radio-button>
            <a-radio-button value="url">图标URL</a-radio-button>
          </a-radio-group>
          <!-- 上传图标 -->
          <div v-if="iconMode === 'upload'" class="icon-upload-area">
            <a-upload
              :show-upload-list="false"
              :before-upload="handleIconUpload"
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.ico"
            >
              <div class="icon-preview" v-if="formData.icon && isUrl(formData.icon)">
                <img :src="getIconUrl(formData.icon)" alt="icon" class="icon-img" />
                <div class="icon-overlay">
                  <EditOutlined />
                </div>
              </div>
              <div v-else class="icon-placeholder">
                <PlusOutlined />
                <div>上传图标</div>
              </div>
            </a-upload>
            <a-button v-if="formData.icon && isUrl(formData.icon)" type="link" size="small" danger @click="formData.icon = ''">
              移除
            </a-button>
          </div>
          <!-- URL输入 -->
          <div v-else>
            <a-input v-model:value="formData.icon" placeholder="输入图标URL，如 https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png" />
            <div style="margin-top: 4px; color: #999; font-size: 12px">
              推荐使用 <a href="https://lobehub.com/zh/icons" target="_blank">Lobe Icons</a> 图标库
            </div>
            <div v-if="formData.icon && formData.icon.startsWith('http')" style="margin-top: 8px">
              <span style="margin-right: 8px; color: #999">预览:</span>
              <a-avatar :size="32" :src="formData.icon" shape="square" />
            </div>
          </div>
        </a-form-item>
        <a-form-item label="标签颜色">
          <a-select v-model:value="formData.color" placeholder="选择颜色">
            <a-select-option v-for="c in colorOptions" :key="c.value" :value="c.value">
              <a-tag :color="c.value">{{ c.label }}</a-tag>
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分类描述">
          <a-textarea v-model:value="formData.description" placeholder="请输入分类描述" :rows="2" :maxlength="200" />
        </a-form-item>
        <a-form-item label="排序值">
          <a-input-number v-model:value="formData.sort" :min="0" :max="9999" placeholder="越小越靠前" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import {
  getCategoriesApi, createCategoryApi, updateCategoryApi,
  deleteCategoryApi, uploadCategoryIconApi, getPostsApi,
} from '@/api/community'

const loading = ref(false)
const categories = ref<any[]>([])
const iconMode = ref<'upload' | 'url'>('url')

const columns = [
  { title: '图标', key: 'icon', width: 70 },
  { title: '分类名称', key: 'name', width: 140 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '帖子数', key: 'postCount', width: 80 },
  { title: '创建时间', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 140 },
]

const colorOptions = [
  { value: 'blue', label: '蓝色' },
  { value: 'green', label: '绿色' },
  { value: 'orange', label: '橙色' },
  { value: 'red', label: '红色' },
  { value: 'purple', label: '紫色' },
  { value: 'cyan', label: '青色' },
  { value: 'magenta', label: '品红' },
  { value: 'gold', label: '金色' },
  { value: 'default', label: '默认' },
]

// ========== 表单相关 ==========
const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = reactive({ name: '', icon: '', color: 'blue', description: '', sort: 0 })

function isUrl(str: string) {
  return str.startsWith('/') || str.startsWith('http')
}

function getIconUrl(icon: string) {
  if (!icon) return ''
  if (icon.startsWith('http')) return icon
  if (icon.startsWith('/')) return icon
  return ''
}

function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

async function fetchCategories() {
  loading.value = true
  try {
    const res = await getCategoriesApi()
    const list = res.data || []
    for (const cat of list) {
      try {
        const postRes = await getPostsApi({ categoryId: cat.id, pageSize: 1 })
        cat._postCount = postRes.data?.total ?? 0
      } catch {
        cat._postCount = 0
      }
    }
    categories.value = list
  } catch {
    message.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingId.value = null
  formData.name = ''
  formData.icon = ''
  formData.color = 'blue'
  formData.description = ''
  formData.sort = 0
  iconMode.value = 'url'
  formVisible.value = true
}

function openEditModal(record: any) {
  editingId.value = record.id
  formData.name = record.name
  formData.icon = record.icon || ''
  formData.color = record.color || 'blue'
  formData.description = record.description || ''
  formData.sort = record.sort || 0
  if (record.icon && record.icon.startsWith('/')) {
    iconMode.value = 'upload'
  } else {
    iconMode.value = 'url'
  }
  formVisible.value = true
}

async function handleIconUpload(file: File) {
  try {
    const res = await uploadCategoryIconApi(file)
    formData.icon = res.data?.url || ''
    message.success('图标上传成功')
  } catch {
    message.error('图标上传失败')
  }
  return false
}

async function handleFormSubmit() {
  if (!formData.name.trim()) return message.warning('请输入分类名称')

  formLoading.value = true
  try {
    if (editingId.value) {
      await updateCategoryApi(editingId.value, { ...formData })
      message.success('分类已更新')
    } else {
      await createCategoryApi({ ...formData })
      message.success('分类已创建')
    }
    formVisible.value = false
    fetchCategories()
  } catch (e: any) {
    message.error(e?.response?.data?.message || '操作失败')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete(id: number) {
  try {
    await deleteCategoryApi(id)
    message.success('分类已删除')
    fetchCategories()
  } catch (e: any) {
    message.error(e?.response?.data?.message || '删除失败')
  }
}

onMounted(() => fetchCategories())
</script>

<style scoped lang="less">
.category-manage {
  .toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
}

.icon-upload-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-preview {
  position: relative;
  width: 64px;
  height: 64px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;

  .icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .icon-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    font-size: 18px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .icon-overlay {
    opacity: 1;
  }
}

.icon-placeholder {
  width: 64px;
  height: 64px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  font-size: 12px;
  gap: 4px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #1677ff;
    color: #1677ff;
  }
}
</style>
