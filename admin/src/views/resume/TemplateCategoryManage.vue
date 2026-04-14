<template>
  <div>
    <a-page-header title="模板分类管理" :sub-title="`共 ${categories.length} 个分类`">
      <template #extra>
        <a-space>
          <a-input
            v-model:value="newCategoryName"
            placeholder="输入新分类名称"
            style="width: 200px"
            @keyup.enter="handleAdd"
          />
          <a-button type="primary" @click="handleAdd" :disabled="!newCategoryName.trim()">
            <PlusOutlined /> 添加分类
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-table
        :data-source="categoryStats"
        :columns="columns"
        :pagination="false"
        row-key="name"
        bordered
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <template v-if="editingName === record.name">
              <a-space>
                <a-input
                  v-model:value="editNewName"
                  size="small"
                  style="width: 160px"
                  @keyup.enter="handleSaveRename(record.name)"
                />
                <a-button size="small" type="primary" @click="handleSaveRename(record.name)">保存</a-button>
                <a-button size="small" @click="editingName = null">取消</a-button>
              </a-space>
            </template>
            <span v-else>{{ record.name }}</span>
          </template>
          <template v-if="column.key === 'count'">
            <a-tag color="blue">{{ record.count }} 个模板</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="startRename(record.name)">重命名</a>
              <a-popconfirm
                :title="`确定删除分类「${record.name}」？该分类下的 ${record.count} 个模板将变为「未分类」`"
                @confirm="handleDelete(record.name)"
              >
                <a style="color: #ff4d4f">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  getTemplateCategoriesApi,
  getResumeTemplatesApi,
  createTemplateApi,
  updateTemplateApi,
} from '@/api/resume'

const loading = ref(false)
const categories = ref<string[]>([])
const categoryStats = ref<{ name: string; count: number }[]>([])
const newCategoryName = ref('')
const editingName = ref<string | null>(null)
const editNewName = ref('')

const columns = [
  { title: '分类名称', dataIndex: 'name', key: 'name' },
  { title: '模板数量', dataIndex: 'count', key: 'count', width: 120 },
  { title: '操作', key: 'action', width: 180 },
]

async function fetchData() {
  loading.value = true
  try {
    const catRes = await getTemplateCategoriesApi()
    categories.value = catRes.data || []

    const tplRes = await getResumeTemplatesApi({ pageSize: 1000 })
    const templates = tplRes.data?.list || tplRes.data || []

    const countMap: Record<string, number> = {}
    for (const cat of categories.value) countMap[cat] = 0
    for (const tpl of templates) {
      const cat = tpl.category || '未分类'
      countMap[cat] = (countMap[cat] || 0) + 1
    }
    categoryStats.value = Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  } catch {
    message.error('加载分类失败')
  } finally {
    loading.value = false
  }
}

async function handleAdd() {
  const name = newCategoryName.value.trim()
  if (!name) return message.warning('请输入分类名称')
  if (categories.value.includes(name)) return message.warning('该分类已存在')

  try {
    await createTemplateApi({
      name: `${name} - 示例模板`,
      category: name,
      description: '分类创建时自动生成的示例模板',
    })
    message.success('分类已添加')
    newCategoryName.value = ''
    fetchData()
  } catch {
    message.error('添加失败')
  }
}

function startRename(name: string) {
  editingName.value = name
  editNewName.value = name
}

async function handleSaveRename(oldName: string) {
  const newName = editNewName.value.trim()
  if (!newName) return message.warning('分类名称不能为空')
  if (newName === oldName) { editingName.value = null; return }

  try {
    const tplRes = await getResumeTemplatesApi({ pageSize: 1000, category: oldName })
    const templates = tplRes.data?.list || tplRes.data || []
    for (const tpl of templates) {
      await updateTemplateApi(tpl.id, { category: newName })
    }
    message.success(`已将 ${templates.length} 个模板的分类改为「${newName}」`)
    editingName.value = null
    fetchData()
  } catch {
    message.error('重命名失败')
  }
}

async function handleDelete(name: string) {
  try {
    const tplRes = await getResumeTemplatesApi({ pageSize: 1000, category: name })
    const templates = tplRes.data?.list || tplRes.data || []
    for (const tpl of templates) {
      await updateTemplateApi(tpl.id, { category: '未分类' })
    }
    message.success(`已将 ${templates.length} 个模板移至「未分类」`)
    fetchData()
  } catch {
    message.error('删除失败')
  }
}

onMounted(fetchData)
</script>
