<template>
  <div>
    <a-page-header title="配置 KEY" sub-title="大模型 API、语音服务与账号密钥" />

    <a-tabs v-model:activeKey="activeTab" type="card">
      <a-tab-pane key="model" tab="大模型配置">
        <a-card :bordered="false">
          <a-form layout="vertical" style="max-width: 700px">
            <a-form-item label="AI 服务提供商">
              <a-radio-group v-model:value="config.aiProvider" button-style="solid">
                <a-radio-button value="volcano">火山方舟（豆包）</a-radio-button>
                <a-radio-button value="openai">OpenAI</a-radio-button>
                <a-radio-button value="zhipu">智谱 AI</a-radio-button>
                <a-radio-button value="custom">自定义</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="API Key（密钥）">
              <a-input-password v-model:value="config.arkApiKey" placeholder="请输入 API Key" />
              <div style="font-size: 12px; color: #999; margin-top: 4px">
                <template v-if="config.aiProvider === 'volcano'">前往 <a href="https://www.volcengine.com/experience/ark" target="_blank">方舟控制台</a> 获取</template>
                <template v-else-if="config.aiProvider === 'openai'">前往 <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI 平台</a> 获取</template>
                <template v-else-if="config.aiProvider === 'zhipu'">前往 <a href="https://open.bigmodel.cn/" target="_blank">智谱开放平台</a> 获取</template>
                <template v-else>请输入对应平台的 API Key</template>
              </div>
            </a-form-item>
            <a-form-item label="API Base URL">
              <a-input v-model:value="config.arkBaseUrl" :placeholder="baseUrlPlaceholder" />
            </a-form-item>
            <a-form-item label="模型选择（参考）">
              <a-select v-model:value="selectedModelRef" placeholder="选择模型参考（仅供显示价格参考）" show-search allow-clear :options="modelOptions" :filter-option="filterOption" @change="onModelRefChange" />
              <div style="font-size: 12px; color: #999; margin-top: 4px">
                火山方舟需要在 <a href="https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint" target="_blank">控制台</a> 创建推理端点后，将端点ID填入下方
              </div>
            </a-form-item>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="模型端点 ID / 模型名称">
                  <a-input v-model:value="config.arkModelId" placeholder="ep-xxxx 或 模型名称" />
                  <div style="font-size: 12px; color: #999; margin-top: 4px">火山方舟填端点ID (ep-xxx)，OpenAI/智谱填模型名</div>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="API 接口类型">
                  <a-select v-model:value="config.apiType">
                    <a-select-option value="chat">Chat Completions（对话）</a-select-option>
                    <a-select-option value="responses">Responses（新版多模态）</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="最大 Token 数">
                  <a-input-number v-model:value="config.maxTokens" :min="100" :max="32000" :step="100" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Temperature">
                  <a-input-number v-model:value="config.temperature" :min="0" :max="2" :step="0.1" :precision="1" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="请求超时(秒)">
                  <a-input-number v-model:value="config.timeout" :min="10" :max="300" :step="10" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSave" :loading="saving">保存配置</a-button>
                <a-button @click="handleTest" :loading="testing">测试连接</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="voice" tab="语音配置">
        <a-card :bordered="false">
          <a-form layout="vertical" style="max-width: 600px">
            <a-form-item label="语音识别服务">
              <a-select v-model:value="voiceConfig.provider" placeholder="选择语音服务提供商">
                <a-select-option value="volcano">火山引擎语音识别</a-select-option>
                <a-select-option value="aliyun">阿里云语音识别</a-select-option>
                <a-select-option value="tencent">腾讯云语音识别</a-select-option>
                <a-select-option value="disabled">未启用</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="API Key（豆包语音）">
              <a-input-password v-model:value="voiceConfig.apiKey" placeholder="豆包语音控制台 → API Key 管理中获取" />
              <div style="font-size: 12px; color: #999; margin-top: 4px">前往 <a href="https://console.volcengine.com/speech/new/welcome?projectName=default" target="_blank">豆包语音控制台</a> → API Key 管理获取</div>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSaveVoice" :loading="savingVoice">保存语音配置</a-button>
                <a-button @click="handleTestVoice" :loading="testingVoice">
                  {{ voiceTestResult === 'success' ? '✓ 连接正常' : voiceTestResult === 'failed' ? '✕ 连接失败' : '测试语音连接' }}
                </a-button>
              </a-space>
              <div v-if="voiceTestResult === 'success'" style="margin-top: 8px">
                <a-tag color="green">语音服务连接正常</a-tag>
              </div>
              <div v-if="voiceTestResult === 'failed'" style="margin-top: 8px">
                <a-tag color="red">语音服务连接失败，请检查配置</a-tag>
              </div>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="keys" tab="账号密钥">
        <a-card :bordered="false">
          <a-alert message="以下密钥用于调用火山引擎 OpenAPI（账单查询、余额查询等），请妥善保管" type="info" show-icon style="margin-bottom: 16px" />
          <a-form layout="vertical" style="max-width: 600px">
            <a-form-item label="AccessKey ID">
              <a-input v-model:value="volcKeys.accessKeyId" placeholder="火山引擎 AccessKey ID" />
            </a-form-item>
            <a-form-item label="SecretAccessKey">
              <a-input-password v-model:value="volcKeys.secretAccessKey" placeholder="火山引擎 SecretAccessKey" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSaveKeys" :loading="savingKeys">保存密钥</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="status" tab="功能状态">
        <a-card :bordered="false">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="AI 服务商"><a-tag color="blue">{{ providerName(config.aiProvider) }}</a-tag></a-descriptions-item>
            <a-descriptions-item label="API Key"><a-tag :color="config.arkApiKey ? 'green' : 'red'">{{ config.arkApiKey ? '已配置' : '未配置' }}</a-tag></a-descriptions-item>
            <a-descriptions-item label="当前模型"><a-tag v-if="config.arkModelId" color="cyan">{{ config.arkModelId }}</a-tag><a-tag v-else color="red">未配置</a-tag></a-descriptions-item>
            <a-descriptions-item label="接口类型"><a-tag>{{ config.apiType === 'responses' ? 'Responses (多模态)' : 'Chat Completions' }}</a-tag></a-descriptions-item>
            <a-descriptions-item label="连接状态"><a-tag :color="testResult === 'success' ? 'green' : testResult === 'failed' ? 'red' : 'default'">{{ testResult === 'success' ? '连接正常' : testResult === 'failed' ? '连接失败' : '未测试' }}</a-tag></a-descriptions-item>
            <a-descriptions-item label="语音服务"><a-tag :color="voiceConfig.provider !== 'disabled' ? 'green' : 'default'">{{ voiceConfig.provider !== 'disabled' ? voiceLabel(voiceConfig.provider) : '未启用' }}</a-tag></a-descriptions-item>
            <a-descriptions-item label="AI 调用地址" :span="2">
              <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 12px; word-break: break-all">
                {{ config.arkBaseUrl || baseUrlPlaceholder }}/{{ config.apiType === 'responses' ? 'responses' : 'chat/completions' }}
              </code>
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <h4>单次调用费用参考</h4>
          <a-table :columns="costColumns" :data-source="costData" size="small" :pagination="false" style="margin-top: 8px" />
          <a-divider />
          <h4>已启用的 AI 功能</h4>
          <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px">
            <a-tag color="green">简历完整度分析</a-tag>
            <a-tag color="green">简历关键词提取</a-tag>
            <a-tag color="green">面试题规则评分</a-tag>
            <a-tag :color="aiEnabled ? 'green' : 'default'">AI 简历优化润色</a-tag>
            <a-tag :color="aiEnabled ? 'green' : 'default'">AI 面试题智能生成</a-tag>
            <a-tag :color="aiEnabled ? 'green' : 'default'">AI 面试智能评分</a-tag>
            <a-tag :color="aiEnabled ? 'green' : 'default'">JD 智能解析</a-tag>
            <a-tag :color="config.apiType === 'responses' && aiEnabled ? 'green' : 'default'">图片识别分析</a-tag>
            <a-tag :color="voiceConfig.provider !== 'disabled' ? 'green' : 'default'">语音面试</a-tag>
            <a-tag :color="voiceConfig.provider !== 'disabled' ? 'green' : 'default'">语音转文字</a-tag>
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getSettingsApi, updateSettingsApi } from '@/api/system'
import request from '@/utils/request'

const activeTab = ref('model')
const saving = ref(false)
const savingVoice = ref(false)
const savingKeys = ref(false)
const testing = ref(false)
const testResult = ref('')

const config = reactive({
  aiProvider: 'volcano',
  arkApiKey: '',
  arkBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
  arkModelId: '',
  apiType: 'chat',
  maxTokens: 4096,
  temperature: 0.7,
  timeout: 60,
})
const voiceConfig = reactive({ provider: 'disabled', apiKey: '', appId: '' })
const volcKeys = reactive({ accessKeyId: '', secretAccessKey: '' })
const aiEnabled = computed(() => !!config.arkApiKey && !!config.arkModelId)
const selectedModelRef = ref('')

function onModelRefChange(val: string) {
  if (config.aiProvider !== 'volcano') config.arkModelId = val
}

const volcanoModels = [
  { value: 'doubao-seed-2-0-pro-260215', label: 'Doubao-seed-2.0-pro (旗舰/推理增强, 输入¥4/M)' },
  { value: 'doubao-1-5-pro-256k-250115', label: 'Doubao-1.5-pro-256k (长文本专家, 输入¥5/M)' },
  { value: 'doubao-1-5-pro-32k-250115', label: 'Doubao-1.5-pro-32k (高性能, 输入¥0.8/M)' },
  { value: 'doubao-1-5-lite-32k-250115', label: 'Doubao-1.5-lite-32k (轻量高速, 输入¥0.3/M)' },
  { value: 'doubao-pro-32k', label: 'Doubao-pro-32k (标准版, 输入¥0.8/M 输出¥2/M)' },
  { value: 'doubao-pro-256k', label: 'Doubao-pro-256k (长文本, 输入¥5/M 输出¥9/M)' },
  { value: 'doubao-lite-32k', label: 'Doubao-lite-32k (经济版, 输入¥0.3/M 输出¥0.6/M)' },
  { value: 'doubao-lite-128k', label: 'Doubao-lite-128k (经济长文本, 输入¥0.8/M 输出¥1/M)' },
  { value: 'doubao-vision-pro-32k', label: 'Doubao-vision-pro (多模态图片理解, 输入¥3/M)' },
  { value: 'doubao-vision-lite-32k', label: 'Doubao-vision-lite (轻量图片理解, 输入¥1/M)' },
  { value: 'doubao-embedding', label: 'Doubao-embedding (文本向量化, ¥0.5/M)' },
]
const openaiModels = [
  { value: 'gpt-5.4', label: 'GPT-5.4 (旗舰推理/编码, 输入$2.5/M 输出$15/M)' },
  { value: 'gpt-5-mini', label: 'GPT-5-mini (高性价比, 输入$0.25/M 输出$2/M)' },
  { value: 'gpt-4o', label: 'GPT-4o (多模态, 输入$2.5/M 输出$10/M)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (经济多模态, 输入$0.15/M 输出$0.6/M)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (128K上下文)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (经济版)' },
]
const zhipuModels = [
  { value: 'glm-4-plus', label: 'GLM-4-Plus (旗舰版, 输入¥50/M 输出¥50/M)' },
  { value: 'glm-4-0520', label: 'GLM-4 (标准版, 输入¥100/M 输出¥100/M)' },
  { value: 'glm-4-air', label: 'GLM-4-Air (高性价比, 输入¥1/M 输出¥1/M)' },
  { value: 'glm-4-airx', label: 'GLM-4-AirX (快速推理, 输入¥10/M 输出¥10/M)' },
  { value: 'glm-4-flash', label: 'GLM-4-Flash (免费版, ¥0/M)' },
  { value: 'glm-4v-plus', label: 'GLM-4V-Plus (多模态旗舰, 输入¥10/M 输出¥10/M)' },
  { value: 'glm-4v', label: 'GLM-4V (多模态标准, 输入¥50/M 输出¥50/M)' },
]

const modelOptions = computed(() => {
  if (config.aiProvider === 'volcano') return volcanoModels
  if (config.aiProvider === 'openai') return openaiModels
  if (config.aiProvider === 'zhipu') return zhipuModels
  return [{ value: 'custom', label: '自定义模型' }]
})

const baseUrlPlaceholder = computed(() => {
  const map: Record<string, string> = {
    volcano: 'https://ark.cn-beijing.volces.com/api/v3',
    openai: 'https://api.openai.com/v1',
    zhipu: 'https://open.bigmodel.cn/api/paas/v4',
    custom: 'https://your-api-url.com/v1',
  }
  return map[config.aiProvider] || map.custom
})

function providerName(p: string) { return { volcano: '火山方舟（豆包）', openai: 'OpenAI', zhipu: '智谱 AI', custom: '自定义' }[p] || p }
function voiceLabel(p: string) { return { volcano: '火山引擎', aliyun: '阿里云', tencent: '腾讯云' }[p] || p }
function filterOption(input: string, option: any) { return (option.label || '').toLowerCase().includes(input.toLowerCase()) }

const costColumns = [
  { title: '场景', dataIndex: 'scene', width: 140 },
  { title: '约消耗Token', dataIndex: 'tokens', width: 120 },
  { title: 'Doubao-lite (经济)', dataIndex: 'lite', width: 140 },
  { title: 'Doubao-pro (标准)', dataIndex: 'pro', width: 140 },
  { title: 'GLM-4-Flash', dataIndex: 'flash', width: 120 },
]
const costData = [
  { key: '1', scene: '简历分析', tokens: '~1000', lite: '¥0.0009', pro: '¥0.003', flash: '免费' },
  { key: '2', scene: '面试评分', tokens: '~1500', lite: '¥0.001', pro: '¥0.005', flash: '免费' },
  { key: '3', scene: '简历优化', tokens: '~2000', lite: '¥0.002', pro: '¥0.006', flash: '免费' },
  { key: '4', scene: 'JD解析', tokens: '~800', lite: '¥0.0007', pro: '¥0.002', flash: '免费' },
  { key: '5', scene: '每天100次调用', tokens: '~150K', lite: '¥0.13', pro: '¥0.42', flash: '免费' },
]

async function fetchConfig() {
  try {
    const res = await getSettingsApi()
    const d = res.data || {}
    config.aiProvider = d.ai_provider || 'volcano'
    config.arkApiKey = d.ark_api_key || ''
    config.arkBaseUrl = d.ark_base_url || 'https://ark.cn-beijing.volces.com/api/v3'
    config.arkModelId = d.ark_model_id || ''
    config.apiType = d.api_type || 'chat'
    config.maxTokens = parseInt(d.ai_max_tokens) || 4096
    config.temperature = parseFloat(d.ai_temperature) || 0.7
    config.timeout = parseInt(d.ai_timeout) || 60
    voiceConfig.provider = d.voice_provider || 'disabled'
    voiceConfig.apiKey = d.voice_api_key || ''
    voiceConfig.appId = d.voice_app_id || ''
    volcKeys.accessKeyId = d.volc_access_key_id || ''
    volcKeys.secretAccessKey = d.volc_secret_access_key || ''
  } catch {}
}

async function handleSave() {
  saving.value = true
  try {
    await updateSettingsApi({
      ai_provider: config.aiProvider,
      ark_api_key: config.arkApiKey,
      ark_base_url: config.arkBaseUrl,
      ark_model_id: config.arkModelId,
      api_type: config.apiType,
      ai_max_tokens: String(config.maxTokens),
      ai_temperature: String(config.temperature),
      ai_timeout: String(config.timeout),
    })
    message.success('配置已保存')
  } catch { message.error('保存失败') }
  finally { saving.value = false }
}

async function handleSaveVoice() {
  savingVoice.value = true
  try {
    await updateSettingsApi({ voice_provider: voiceConfig.provider, voice_api_key: voiceConfig.apiKey, voice_app_id: voiceConfig.appId })
    message.success('语音配置已保存')
  } catch { message.error('保存失败') }
  finally { savingVoice.value = false }
}

async function handleSaveKeys() {
  savingKeys.value = true
  try {
    await updateSettingsApi({ volc_access_key_id: volcKeys.accessKeyId, volc_secret_access_key: volcKeys.secretAccessKey })
    message.success('密钥已保存')
  } catch { message.error('保存失败') }
  finally { savingKeys.value = false }
}

const testingVoice = ref(false)
const voiceTestResult = ref('')

async function handleTestVoice() {
  if (!voiceConfig.apiKey) { message.warning('请先填写并保存 API Key'); return }
  testingVoice.value = true; voiceTestResult.value = ''
  try {
    const res: any = await request.post('/system/speech/health-check')
    voiceTestResult.value = res.data?.success ? 'success' : 'failed'
    voiceTestResult.value === 'success' ? message.success('语音服务连接正常') : message.warning(res.data?.message || '语音服务响应异常')
  } catch {
    voiceTestResult.value = 'failed'; message.error('语音服务连接失败')
  } finally { testingVoice.value = false }
}

async function handleTest() {
  if (!config.arkApiKey || !config.arkModelId) { message.warning('请先保存配置后再测试'); return }
  testing.value = true; testResult.value = ''
  try {
    const res: any = await request.post('/system/ai-test')
    testResult.value = res.data?.success ? 'success' : 'failed'
    res.data?.success ? message.success('连接成功！') : message.error(res.data?.message || '连接失败')
  } catch { testResult.value = 'failed'; message.error('测试失败') }
  finally { testing.value = false }
}

onMounted(fetchConfig)
</script>
