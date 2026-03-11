<template>
  <div class="dict-manage">
    <a-page-header title="数据字典" sub-title="管理系统枚举值" />

    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="字典类型" size="small">
          <template #extra>
            <a-button type="link" size="small" @click="openCreateType"><PlusOutlined /></a-button>
          </template>
          <a-spin :spinning="loading">
            <a-list :data-source="dictTypes" size="small">
              <template #renderItem="{ item }">
                <a-list-item
                  :class="{ 'active-type': selectedType?.id === item.id }"
                  style="cursor: pointer"
                  @click="selectType(item)"
                >
                  <a-list-item-meta>
                    <template #title>{{ item.name }}</template>
                    <template #description>{{ item.code }} · {{ item.items?.length || 0 }}项</template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-popconfirm title="删除此字典类型及所有项？" @confirm="handleDeleteType(item.id)">
                      <a-button type="link" size="small" danger><DeleteOutlined /></a-button>
                    </a-popconfirm>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-spin>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card :title="selectedType ? `${selectedType.name} (${selectedType.code})` : '请选择字典类型'" size="small">
          <template #extra v-if="selectedType">
            <a-button type="link" size="small" @click="openCreateItem"><PlusOutlined /> 添加项</a-button>
          </template>
          <a-table
            v-if="selectedType"
            :columns="itemColumns"
            :data-source="selectedType.items || []"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'color'">
                <a-tag v-if="record.color" :color="record.color">{{ record.color }}</a-tag>
                <span v-else>-</span>
              </template>
              <template v-if="column.key === 'isEnabled'">
                <a-switch :checked="record.isEnabled" size="small" @change="(v: boolean) => handleToggleItem(record.id, v)" />
              </template>
              <template v-if="column.key === 'action'">
                <a-popconfirm title="删除？" @confirm="handleDeleteItem(record.id)">
                  <a-button type="link" size="small" danger>删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
          <a-empty v-else description="请在左侧选择字典类型" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 新建类型 -->
    <a-modal v-model:open="typeFormVisible" title="新建字典类型" @ok="handleCreateType" ok-text="确定">
      <a-form layout="vertical">
        <a-form-item label="编码" required><a-input v-model:value="typeForm.code" placeholder="如 application_channel" /></a-form-item>
        <a-form-item label="名称" required><a-input v-model:value="typeForm.name" placeholder="如 投递渠道" /></a-form-item>
        <a-form-item label="描述"><a-input v-model:value="typeForm.description" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 新建项 -->
    <a-modal v-model:open="itemFormVisible" title="新建字典项" @ok="handleCreateItem" ok-text="确定">
      <a-form layout="vertical">
        <a-form-item label="值" required><a-input v-model:value="itemForm.value" placeholder="如 boss" /></a-form-item>
        <a-form-item label="标签" required><a-input v-model:value="itemForm.label" placeholder="如 Boss直聘" /></a-form-item>
        <a-form-item label="颜色"><a-input v-model:value="itemForm.color" placeholder="如 blue" /></a-form-item>
        <a-form-item label="排序"><a-input-number v-model:value="itemForm.sort" :min="0" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {
  getDictTypesApi, createDictTypeApi, createDictItemApi,
  updateDictItemApi, deleteDictItemApi, deleteDictTypeApi,
} from '@/api/system'

const loading = ref(false)
const dictTypes = ref<any[]>([])
const selectedType = ref<any>(null)

const typeFormVisible = ref(false)
const typeForm = reactive({ code: '', name: '', description: '' })

const itemFormVisible = ref(false)
const itemForm = reactive({ value: '', label: '', color: '', sort: 0 })

const itemColumns = [
  { title: '值', dataIndex: 'value', width: 120 },
  { title: '标签', dataIndex: 'label', width: 120 },
  { title: '颜色', key: 'color', width: 80 },
  { title: '排序', dataIndex: 'sort', width: 60 },
  { title: '启用', key: 'isEnabled', width: 70 },
  { title: '操作', key: 'action', width: 80 },
]

async function fetchDictTypes() {
  loading.value = true
  try {
    const res = await getDictTypesApi()
    dictTypes.value = res.data || []
    if (selectedType.value) {
      selectedType.value = dictTypes.value.find((t: any) => t.id === selectedType.value.id) || null
    }
  } catch { message.error('获取字典数据失败') }
  finally { loading.value = false }
}

function selectType(type: any) { selectedType.value = type }

function openCreateType() {
  Object.assign(typeForm, { code: '', name: '', description: '' })
  typeFormVisible.value = true
}

async function handleCreateType() {
  if (!typeForm.code || !typeForm.name) return message.warning('编码和名称必填')
  try {
    await createDictTypeApi(typeForm)
    message.success('已创建')
    typeFormVisible.value = false
    fetchDictTypes()
  } catch { message.error('创建失败') }
}

async function handleDeleteType(id: number) {
  try {
    await deleteDictTypeApi(id)
    message.success('已删除')
    if (selectedType.value?.id === id) selectedType.value = null
    fetchDictTypes()
  } catch { message.error('删除失败') }
}

function openCreateItem() {
  Object.assign(itemForm, { value: '', label: '', color: '', sort: 0 })
  itemFormVisible.value = true
}

async function handleCreateItem() {
  if (!itemForm.value || !itemForm.label) return message.warning('值和标签必填')
  try {
    await createDictItemApi({ ...itemForm, dictTypeId: selectedType.value.id })
    message.success('已添加')
    itemFormVisible.value = false
    fetchDictTypes()
  } catch { message.error('添加失败') }
}

async function handleToggleItem(id: number, enabled: boolean) {
  try {
    await updateDictItemApi(id, { isEnabled: enabled })
    fetchDictTypes()
  } catch { message.error('操作失败') }
}

async function handleDeleteItem(id: number) {
  try {
    await deleteDictItemApi(id)
    message.success('已删除')
    fetchDictTypes()
  } catch { message.error('删除失败') }
}

onMounted(fetchDictTypes)
</script>

<style scoped>
.active-type {
  background-color: #e6f4ff;
}
</style>
