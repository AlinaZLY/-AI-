<template>
  <div class="page-shell">
    <LoginPrompt v-if="!isLoggedIn" :title="$t('登录后进行企业认证')" :description="$t('登录后可以提交企业认证材料，成为认证企业用户发布招聘信息')" />
    <template v-else>
    <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('校园招聘企业认证') }}</h1>
    <p class="text-gray-500 mb-6">{{ $t('认证后可发布校招/实习职位，对接大学生人才。管理员将在1-3个工作日内审核') }}</p>

    <!-- 已提交的认证状态 -->
    <div v-if="company" class="mb-6 p-4 rounded-xl border"
      :class="company.status === 'approved' ? 'border-green-200 bg-green-50' : company.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-lg">{{ company.status === 'approved' ? '✅' : company.status === 'rejected' ? '❌' : '⏳' }}</span>
        <span class="font-semibold" :class="company.status === 'approved' ? 'text-green-700' : company.status === 'rejected' ? 'text-red-700' : 'text-yellow-700'">
          {{ { pending: $t('审核中'), approved: $t('已通过'), rejected: $t('审核未通过') }[company.status] || company.status }}
        </span>
      </div>
      <p class="text-sm text-gray-600">{{ $t('企业名称：') }}{{ company.name }}</p>
      <p class="text-sm text-gray-600">{{ $t('企业类型：') }}{{ company.type === 'individual' ? $t('个体工商户') : $t('企业') }}</p>
      <p v-if="company.rejectReason" class="text-sm text-red-600 mt-2">{{ $t('拒绝原因：') }}{{ company.rejectReason }}</p>
      <button v-if="company.status === 'rejected'" @click="editing = true" class="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">{{ $t('重新提交') }}</button>
    </div>

    <!-- 认证表单 -->
    <form v-if="!company || editing" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 类型选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('认证类型') }} <span class="text-red-500">*</span></label>
        <div class="grid grid-cols-2 gap-3">
          <button type="button" @click="form.type = 'company'"
            :class="form.type === 'company' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'"
            class="p-4 border-2 rounded-xl text-center transition-all">
            <div class="text-2xl mb-1">🏢</div>
            <div class="font-medium">{{ $t('企业') }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ $t('需营业执照') }}</div>
          </button>
          <button type="button" @click="form.type = 'individual'"
            :class="form.type === 'individual' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'"
            class="p-4 border-2 rounded-xl text-center transition-all">
            <div class="text-2xl mb-1">🧑‍💼</div>
            <div class="font-medium">{{ $t('个体工商户') }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ $t('需营业执照+身份证') }}</div>
          </button>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h3 class="font-semibold text-gray-800">{{ $t('基本信息') }}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('企业/店铺名称') }} <span class="text-red-500">*</span></label>
            <input v-model="form.name" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('法人/负责人姓名') }} <span class="text-red-500">*</span></label>
            <input v-model="form.legalPerson" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('统一社会信用代码') }} <span class="text-red-500">*</span></label>
            <input v-model="form.creditCode" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" :placeholder="$t('18位统一信用代码')" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('所属行业') }}</label>
            <input v-model="form.industry" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('所在城市') }}</label>
            <input v-model="form.city" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('联系电话') }}</label>
            <input v-model="form.contactPhone" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('联系邮箱') }}</label>
            <input v-model="form.contactEmail" type="email" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" :placeholder="$t('如：hr@company.com')" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('企业规模') }}</label>
            <select v-model="form.scale" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white">
              <option value="">{{ $t('请选择') }}</option>
              <option value="1-49人">{{ $t('1-49人') }}</option>
              <option value="50-149人">{{ $t('50-149人') }}</option>
              <option value="150-499人">{{ $t('150-499人') }}</option>
              <option value="500-999人">{{ $t('500-999人') }}</option>
              <option value="1000-9999人">{{ $t('1000-9999人') }}</option>
              <option value="10000人以上">{{ $t('10000人以上') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">{{ $t('企业官网') }}</label>
            <input v-model="form.website" type="url" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="https://" />
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">{{ $t('详细地址') }}</label>
          <input v-model="form.address" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">{{ $t('企业简介') }}</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"></textarea>
        </div>
      </div>

      <!-- 认证材料 -->
      <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h3 class="font-semibold text-gray-800">{{ $t('认证材料') }}</h3>
        <p class="text-xs text-gray-400">{{ $t('支持 jpg/png/pdf 格式，每张不超过10MB') }}</p>

        <div class="grid grid-cols-3 gap-4">
          <!-- 营业执照 -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">{{ $t('营业执照') }} <span class="text-red-500">*</span></label>
            <div class="upload-area" @click="triggerUpload('businessLicense')" :class="{ 'has-file': form.businessLicense }">
              <template v-if="form.businessLicense">
                <img v-if="!isPdfFile(form.businessLicense)" :src="form.businessLicense" class="upload-preview" />
                <div v-else class="upload-file-card">
                  <div class="upload-file-ext">PDF</div>
                  <a :href="form.businessLicense" target="_blank" rel="noreferrer" class="upload-file-link">{{ $t('打开文件') }}</a>
                </div>
              </template>
              <template v-else>
                <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <div class="text-xs text-gray-400 mt-1">{{ $t('点击上传') }}</div>
              </template>
            </div>
          </div>

          <!-- 身份证正面 -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">{{ $t('身份证正面') }} <span class="text-red-500">*</span></label>
            <div class="upload-area" @click="triggerUpload('idCardFront')" :class="{ 'has-file': form.idCardFront }">
              <template v-if="form.idCardFront">
                <img v-if="!isPdfFile(form.idCardFront)" :src="form.idCardFront" class="upload-preview" />
                <div v-else class="upload-file-card">
                  <div class="upload-file-ext">PDF</div>
                  <a :href="form.idCardFront" target="_blank" rel="noreferrer" class="upload-file-link">{{ $t('打开文件') }}</a>
                </div>
              </template>
              <template v-else>
                <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/></svg>
                <div class="text-xs text-gray-400 mt-1">{{ $t('点击上传') }}</div>
              </template>
            </div>
          </div>

          <!-- 身份证反面 -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">{{ $t('身份证反面') }} <span class="text-red-500">*</span></label>
            <div class="upload-area" @click="triggerUpload('idCardBack')" :class="{ 'has-file': form.idCardBack }">
              <template v-if="form.idCardBack">
                <img v-if="!isPdfFile(form.idCardBack)" :src="form.idCardBack" class="upload-preview" />
                <div v-else class="upload-file-card">
                  <div class="upload-file-ext">PDF</div>
                  <a :href="form.idCardBack" target="_blank" rel="noreferrer" class="upload-file-link">{{ $t('打开文件') }}</a>
                </div>
              </template>
              <template v-else>
                <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/></svg>
                <div class="text-xs text-gray-400 mt-1">{{ $t('点击上传') }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf" class="hidden" @change="handleFileUpload" />

      <div class="flex gap-3">
        <button type="submit" :disabled="submitting"
          class="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50 transition-all">
          {{ submitting ? $t('提交中...') : (company ? $t('重新提交认证') : $t('提交认证申请')) }}
        </button>
        <button v-if="editing" type="button" @click="editing = false"
          class="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">{{ $t('取消') }}</button>
      </div>
    </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const company = ref<any>(null)
const editing = ref(false)
const submitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
let uploadField = ''

const form = reactive({
  name: '',
  type: 'company',
  legalPerson: '',
  creditCode: '',
  industry: '',
  city: '',
  contactPhone: '',
  contactEmail: '',
  scale: '',
  website: '',
  address: '',
  description: '',
  businessLicense: '',
  idCardFront: '',
  idCardBack: '',
})

function isPdfFile(value?: string) {
  return /\.pdf($|\?)/i.test(value || '')
}

onMounted(async () => {
  if (!isLoggedIn.value) return
  try {
    const res: any = await request.get('/companies/my')
    if (res.data) {
      company.value = res.data
      Object.assign(form, {
        name: res.data.name || '',
        type: res.data.type || 'company',
        legalPerson: res.data.legalPerson || '',
        creditCode: res.data.creditCode || '',
        industry: res.data.industry || '',
        city: res.data.city || '',
        contactPhone: res.data.contactPhone || '',
        contactEmail: res.data.contactEmail || '',
        scale: res.data.scale || '',
        website: res.data.website || '',
        address: res.data.address || '',
        description: res.data.description || '',
        businessLicense: res.data.businessLicense || '',
        idCardFront: res.data.idCardFront || '',
        idCardBack: res.data.idCardBack || '',
      })
    }
  } catch {}
})

function triggerUpload(field: string) {
  uploadField = field
  fileInput.value?.click()
}

async function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    toast(t('文件大小不能超过10MB'), 'error')
    return
  }
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res: any = await request.post('/companies/upload-cert', fd)
    ;(form as any)[uploadField] = res.data?.url || ''
    toast(t('上传成功'), 'success')
  } catch {
    toast(t('上传失败'), 'error')
  }
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit() {
  if (!form.name || !form.legalPerson || !form.creditCode) {
    toast(t('请填写必要信息'), 'warning')
    return
  }
  if (!form.businessLicense) {
    toast(t('请上传营业执照'), 'warning')
    return
  }
  if (!form.idCardFront || !form.idCardBack) {
    toast(t('请上传身份证正反面'), 'warning')
    return
  }

  submitting.value = true
  try {
    if (company.value) {
      await request.put(`/companies/${company.value.id}`, form)
      toast(t('认证材料已重新提交'), 'success')
    } else {
      await request.post('/companies', form)
      toast(t('认证申请已提交'), 'success')
    }
    const res: any = await request.get('/companies/my')
    company.value = res.data
    editing.value = false
  } catch {
    toast(t('提交失败'), 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.upload-area {
  width: 100%;
  aspect-ratio: 4/3;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  background: #fafafa;
}
.upload-area:hover {
  border-color: #6366f1;
  background: #f5f3ff;
}
.upload-area.has-file {
  border-style: solid;
  border-color: #6366f1;
}
.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload-file-card {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #eef2ff;
  color: #4338ca;
}
.upload-file-ext {
  font-size: 24px;
  font-weight: 700;
}
.upload-file-link {
  font-size: 12px;
  color: #4338ca;
  text-decoration: underline;
}
</style>
