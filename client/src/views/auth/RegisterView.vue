<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8">
    <div class="w-full transition-all duration-300" :class="form.role === 'enterprise' ? 'max-w-3xl' : 'max-w-sm'">
      <div class="flex items-center justify-between mb-6">
        <router-link to="/home" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {{ $t('返回首页') }}
        </router-link>
        <LocaleSwitch />
      </div>
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('创建账号') }}</h1>
        <p class="text-gray-400 mt-1 text-sm">{{ $t('学生 / 应届生 / 企业用户注册') }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- 基本信息 -->
          <div class="grid gap-4" :class="form.role === 'enterprise' ? 'sm:grid-cols-2' : ''">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('用户名') }} <span class="text-red-500">*</span></label>
              <input v-model="form.username" type="text" required minlength="3" autocomplete="off"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                :placeholder="$t('3-50个字符')" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('密码') }} <span class="text-red-500">*</span></label>
              <input v-model="form.password" type="password" required minlength="6" autocomplete="new-password"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                :placeholder="$t('至少6个字符')" />
            </div>
          </div>

          <!-- 身份选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('注册身份') }} <span class="text-red-500">*</span></label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" @click="form.role = 'student'"
                :class="form.role === 'student' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'"
                class="py-3 border-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
                {{ $t('学生 / 应届生') }}
              </button>
              <button type="button" @click="form.role = 'enterprise'"
                :class="form.role === 'enterprise' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'"
                class="py-3 border-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" /></svg>
                {{ $t('企业 / 招聘方') }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('昵称') }} <span class="text-red-500">*</span></label>
            <input v-model="form.nickname" type="text" required autocomplete="off"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              :placeholder="$t('显示名称')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('邮箱') }} <span class="text-xs text-gray-400 font-normal">({{ $t('选填') }})</span></label>
            <div class="flex w-full overflow-hidden">
              <input v-model="emailPrefix" type="text" autocomplete="off"
                class="min-w-0 flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 border-r-0 rounded-l-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                :placeholder="$t('邮箱前缀')" />
              <select v-model="emailSuffix"
                class="w-[130px] shrink-0 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition">
                <option v-for="s in emailSuffixes" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <!-- 企业信息区域 -->
          <div v-if="form.role === 'enterprise'" class="border-t border-gray-100 pt-5 space-y-4">
            <h3 class="text-sm font-semibold text-gray-800">{{ $t('企业认证信息') }}</h3>
            <p class="text-xs text-gray-400 -mt-2">{{ $t('填写后注册即提交审核，也可注册后在"企业认证"页面完善') }}</p>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">{{ $t('企业名称') }}</label>
                <input v-model="enterpriseForm.name" type="text"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  :placeholder="$t('如：北京科技有限公司')" />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">{{ $t('法人姓名') }}</label>
                <input v-model="enterpriseForm.legalPerson" type="text"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">{{ $t('统一社会信用代码') }}</label>
                <input v-model="enterpriseForm.creditCode" type="text"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">{{ $t('所属行业') }}</label>
                <select v-model="enterpriseForm.industry"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition">
                  <option value="">{{ $t('请选择') }}</option>
                  <option v-for="ind in industries" :key="ind" :value="ind">{{ ind }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">{{ $t('联系电话') }}</label>
                <input v-model="enterpriseForm.contactPhone" type="text"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
            </div>

            <!-- 证件上传 -->
            <div>
              <label class="block text-xs text-gray-600 mb-2">{{ $t('证件材料') }}</label>
              <div class="grid grid-cols-3 gap-3">
                <label class="group cursor-pointer">
                  <div class="aspect-[4/3] bg-gray-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden transition"
                    :class="enterpriseForm.businessLicense ? 'border-blue-300' : 'border-gray-200 group-hover:border-blue-300'">
                    <template v-if="enterpriseForm.businessLicense">
                      <img v-if="!isPdfFile(enterpriseForm.businessLicense)" :src="withPrivateFileToken(enterpriseForm.businessLicense)" class="w-full h-full object-cover" />
                      <div v-else class="flex h-full w-full flex-col items-center justify-center bg-blue-50 text-blue-700">
                        <span class="text-2xl font-semibold">PDF</span>
                        <span class="mt-1 text-[11px]">营业执照已上传</span>
                      </div>
                    </template>
                    <template v-else>
                      <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span class="text-[11px] text-gray-400 mt-1">{{ $t('营业执照') }}</span>
                    </template>
                  </div>
                  <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf" class="hidden" @change="(e) => handleUpload(e, 'businessLicense')" />
                </label>
                <label class="group cursor-pointer">
                  <div class="aspect-[4/3] bg-gray-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden transition"
                    :class="enterpriseForm.idCardFront ? 'border-blue-300' : 'border-gray-200 group-hover:border-blue-300'">
                    <template v-if="enterpriseForm.idCardFront">
                      <img v-if="!isPdfFile(enterpriseForm.idCardFront)" :src="withPrivateFileToken(enterpriseForm.idCardFront)" class="w-full h-full object-cover" />
                      <div v-else class="flex h-full w-full flex-col items-center justify-center bg-blue-50 text-blue-700">
                        <span class="text-2xl font-semibold">PDF</span>
                        <span class="mt-1 text-[11px]">身份证正面已上传</span>
                      </div>
                    </template>
                    <template v-else>
                      <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span class="text-[11px] text-gray-400 mt-1">{{ $t('身份证正面') }}</span>
                    </template>
                  </div>
                  <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf" class="hidden" @change="(e) => handleUpload(e, 'idCardFront')" />
                </label>
                <label class="group cursor-pointer">
                  <div class="aspect-[4/3] bg-gray-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden transition"
                    :class="enterpriseForm.idCardBack ? 'border-blue-300' : 'border-gray-200 group-hover:border-blue-300'">
                    <template v-if="enterpriseForm.idCardBack">
                      <img v-if="!isPdfFile(enterpriseForm.idCardBack)" :src="withPrivateFileToken(enterpriseForm.idCardBack)" class="w-full h-full object-cover" />
                      <div v-else class="flex h-full w-full flex-col items-center justify-center bg-blue-50 text-blue-700">
                        <span class="text-2xl font-semibold">PDF</span>
                        <span class="mt-1 text-[11px]">身份证反面已上传</span>
                      </div>
                    </template>
                    <template v-else>
                      <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span class="text-[11px] text-gray-400 mt-1">{{ $t('身份证反面') }}</span>
                    </template>
                  </div>
                  <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf" class="hidden" @change="(e) => handleUpload(e, 'idCardBack')" />
                </label>
              </div>
            </div>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition-colors">
            {{ loading ? $t('注册中...') : $t('注册') }}
          </button>
        </form>

        <div class="mt-5 pt-5 border-t border-gray-100 text-center">
          <p class="text-sm text-gray-400">
            {{ $t('已有账号？') }}<router-link to="/login" class="text-blue-600 hover:underline font-medium">{{ $t('登录') }}</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/toast'
import request from '@/utils/request'
import { withPrivateFileToken } from '@/utils/private-file'
import LocaleSwitch from '@/components/LocaleSwitch.vue'
import { useI18n } from '@/i18n'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const loading = ref(false)
const emailPrefix = ref('')
const emailSuffix = ref('@qq.com')
const emailSuffixes = ['@qq.com', '@163.com', '@126.com', '@gmail.com', '@outlook.com', '@foxmail.com', '@sina.com']
const form = reactive({ username: '', password: '', nickname: '', email: '', role: 'student' })
const enterpriseForm = reactive({
  name: '', legalPerson: '', creditCode: '', industry: '', contactPhone: '',
  businessLicense: '', idCardFront: '', idCardBack: '',
})
const industries = [
  '互联网/IT', '金融/银行', '教育/培训', '医疗/健康', '电商/零售',
  '制造业', '房地产/建筑', '传媒/广告', '物流/运输', '能源/环保',
  '汽车', '餐饮/酒店', '法律/咨询', '政府/事业单位', '其他',
]

function isPdfFile(value?: string) {
  return /\.pdf($|\?)/i.test(value || '')
}

async function handleUpload(e: Event, field: 'businessLicense' | 'idCardFront' | 'idCardBack') {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    toast(t('文件不能超过10MB'), 'error')
    return
  }
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res: any = await request.post('/companies/upload-cert', fd)
    enterpriseForm[field] = res.data?.url || ''
  } catch {
    toast(t('上传失败'), 'error')
  }
}

async function handleRegister() {
  if (!form.username || !form.password) {
    toast(t('请填写用户名和密码'), 'warning')
    return
  }
  if (!form.nickname.trim()) {
    toast(t('请填写昵称'), 'warning')
    return
  }
  form.email = emailPrefix.value.trim() ? `${emailPrefix.value.trim()}${emailSuffix.value}` : ''
  loading.value = true
  try {
    const payload: Record<string, any> = {
      username: form.username,
      password: form.password,
      nickname: form.nickname.trim(),
      role: form.role,
    }
    if (form.email) payload.email = form.email
    if (form.role === 'enterprise' && enterpriseForm.name.trim()) {
      payload.enterpriseInfo = {
        name: enterpriseForm.name.trim(),
        type: 'company',
        legalPerson: enterpriseForm.legalPerson.trim() || undefined,
        creditCode: enterpriseForm.creditCode.trim() || undefined,
        industry: enterpriseForm.industry || undefined,
        contactPhone: enterpriseForm.contactPhone.trim() || undefined,
        businessLicense: enterpriseForm.businessLicense || undefined,
        idCardFront: enterpriseForm.idCardFront || undefined,
        idCardBack: enterpriseForm.idCardBack || undefined,
      }
    }
    await userStore.register(payload)
    if (form.role === 'enterprise' && enterpriseForm.name.trim()) {
      const hasCerts = !!(enterpriseForm.businessLicense && enterpriseForm.idCardFront)
      if (hasCerts) {
        toast(t('注册成功！企业认证已提交审核，请等待管理员审核'), 'success')
      } else {
        toast(t('注册成功！请登录后前往企业认证页上传证件材料以完成审核'), 'warning')
      }
    } else if (form.role === 'enterprise') {
      toast(t('注册成功！请登录后完成企业认证'), 'success')
    } else {
      toast(t('注册成功，请登录'), 'success')
    }
    router.push({ path: '/login', query: { username: form.username } })
  } catch {
  } finally { loading.value = false }
}
</script>
