<template>
  <div>
    <a-page-header title="题库分类" sub-title="管理面试题分类">
      <template #extra>
        <a-button type="primary" @click="openCreateModal()"><PlusOutlined /> 新增分类</a-button>
      </template>
    </a-page-header>

    <a-table :columns="columns" :data-source="flatList" :loading="loading" row-key="id" size="middle" :pagination="{ pageSize: 15, showSizeChanger: true }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <span :style="{ paddingLeft: record.parentId ? '24px' : '0' }">
            <span v-if="!record.parentId" style="font-weight: 600">{{ record.name }}</span>
            <span v-else style="color: #666">└ {{ record.name }}</span>
          </span>
        </template>
        <template v-if="column.key === 'cover'">
          <a-avatar v-if="record.coverImage" :src="record.coverImage" shape="square" :size="28" />
          <span v-else style="color: #ccc">-</span>
        </template>
        <template v-if="column.key === 'type'">
          <a-tag v-if="record.type" size="small">{{ record.type }}</a-tag>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-button v-if="!record.parentId" type="link" size="small" @click="openCreateModal(record.id)">+ 子分类</a-button>
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="formVisible" :title="editingId ? '编辑分类' : '新增分类'" ok-text="保存" @ok="handleFormSubmit" :confirm-loading="formLoading" width="480px">
      <a-form layout="vertical">
        <a-form-item label="分类名称" required><a-input v-model:value="formData.name" placeholder="如：数据结构与算法" /></a-form-item>
        <a-form-item label="父分类"><a-select v-model:value="formData.parentId" placeholder="无（一级分类）" allow-clear>
          <a-select-option v-for="c in parentOptions" :key="c.id" :value="c.id">{{ c.name }}</a-select-option>
        </a-select></a-form-item>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="类型"><a-select v-model:value="formData.type" allow-clear>
            <a-select-option value="type">题型</a-select-option>
            <a-select-option value="company">公司</a-select-option>
            <a-select-option value="position">岗位</a-select-option>
          </a-select></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="排序"><a-input-number v-model:value="formData.sort" :min="0" style="width: 100%" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="描述"><a-input v-model:value="formData.description" placeholder="分类描述" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { getInterviewCategoriesApi, createInterviewCategoryApi, updateInterviewCategoryApi, deleteInterviewCategoryApi } from '@/api/interview'

const loading = ref(false)
const categories = ref<any[]>([])

const flatList = computed(() => {
  const result: any[] = []
  for (const cat of categories.value) {
    result.push(cat)
    if (cat.children?.length) {
      for (const child of cat.children) result.push(child)
    }
  }
  return result
})

const parentOptions = computed(() => categories.value.filter((c: any) => !c.parentId))

const formVisible = ref(false)
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = reactive({ name: '', parentId: undefined as number | undefined, type: '', description: '', sort: 0 })

const columns = [
  { title: '分类名称', key: 'name', width: 200 },
  { title: '封面', key: 'cover', width: 60 },
  { title: '类型', key: 'type', width: 80 },
  { title: '题数', dataIndex: 'questionCount', width: 60 },
  { title: '排序', dataIndex: 'sort', width: 60 },
  { title: '描述', dataIndex: 'description', ellipsis: true },
  { title: '操作', key: 'action', width: 200 },
]

async function fetchCategories() {
  loading.value = true
  try { const res = await getInterviewCategoriesApi(); categories.value = res.data || [] }
  catch { message.error('获取分类失败') }
  finally { loading.value = false }
}

function openCreateModal(parentId?: number) {
  editingId.value = null
  Object.assign(formData, { name: '', parentId: parentId || undefined, type: '', description: '', sort: 0 })
  formVisible.value = true
}

function openEditModal(record: any) {
  editingId.value = record.id
  Object.assign(formData, { name: record.name, parentId: record.parentId || undefined, type: record.type || '', description: record.description || '', sort: record.sort || 0 })
  formVisible.value = true
}

async function handleFormSubmit() {
  if (!formData.name.trim()) return message.warning('请输入分类名称')
  formLoading.value = true
  try {
    if (editingId.value) { await updateInterviewCategoryApi(editingId.value, formData); message.success('已更新') }
    else { await createInterviewCategoryApi(formData); message.success('已创建') }
    formVisible.value = false; fetchCategories()
  } catch { message.error('操作失败') }
  finally { formLoading.value = false }
}

async function handleDelete(id: number) {
  try { await deleteInterviewCategoryApi(id); message.success('已删除'); fetchCategories() }
  catch { message.error('删除失败') }
}

onMounted(fetchCategories)
</script>
