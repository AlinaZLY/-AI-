<template>
  <div>
    <a-page-header title="用量账单" sub-title="火山引擎账单与账户余额查询" />

    <a-card :bordered="false">
      <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px">
        <span>账期：</span>
        <a-month-picker v-model:value="billingMonth" format="YYYY-MM" placeholder="选择月份" style="width: 160px" />
        <a-button type="primary" @click="fetchBilling" :loading="billingLoading">查询账单</a-button>
        <a-button @click="fetchBalance" :loading="balanceLoading">查询余额</a-button>
      </div>

      <a-row :gutter="16" style="margin-bottom: 16px" v-if="balance">
        <a-col :span="8">
          <a-card size="small"><a-statistic title="账户余额" :value="balance.AvailableBalance || balance.AccountBalance || '-'" prefix="¥" :value-style="{ color: '#1677ff' }" /></a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small"><a-statistic title="可用额度" :value="balance.CreditLimit || '-'" prefix="¥" :value-style="{ color: '#52c41a' }" /></a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small"><a-statistic title="冻结金额" :value="balance.FreezeAmount || '0'" prefix="¥" :value-style="{ color: '#faad14' }" /></a-card>
        </a-col>
      </a-row>

      <a-table v-if="billingList.length" :columns="billingColumns" :data-source="billingList" row-key="Product" size="small" :pagination="false" />
      <a-empty v-else-if="!billingLoading && billingQueried" description="暂无账单数据" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import request from '@/utils/request'

const billingLoading = ref(false)
const balanceLoading = ref(false)
const billingQueried = ref(false)
const billingMonth = ref<any>(null)
const billingList = ref<any[]>([])
const balance = ref<any>(null)

const billingColumns = [
  { title: '产品', dataIndex: 'ProductZh', key: 'ProductZh', width: 200 },
  { title: '产品编码', dataIndex: 'Product', key: 'Product', width: 150 },
  { title: '原价(¥)', dataIndex: 'OriginalBillAmount', key: 'OriginalBillAmount', width: 120 },
  { title: '优惠(¥)', dataIndex: 'PreferentialBillAmount', key: 'PreferentialBillAmount', width: 120 },
  { title: '应付(¥)', dataIndex: 'PayableAmount', key: 'PayableAmount', width: 120 },
  { title: '已付(¥)', dataIndex: 'PaidAmount', key: 'PaidAmount', width: 120 },
  { title: '计费模式', dataIndex: 'BillingMode', key: 'BillingMode', width: 100 },
]

async function fetchBilling() {
  const month = billingMonth.value ? (typeof billingMonth.value === 'string' ? billingMonth.value : billingMonth.value?.format?.('YYYY-MM') || new Date().toISOString().substring(0, 7)) : new Date().toISOString().substring(0, 7)
  billingLoading.value = true; billingQueried.value = true
  try {
    const res: any = await request.get('/system/billing', { params: { month } })
    if (res.data?.success) {
      billingList.value = res.data?.data?.List || []
    } else {
      message.error(res.data?.message || '查询失败')
      billingList.value = []
    }
  } catch { message.error('查询账单失败'); billingList.value = [] }
  finally { billingLoading.value = false }
}

async function fetchBalance() {
  balanceLoading.value = true
  try {
    const res: any = await request.get('/system/balance')
    if (res.data?.success) {
      balance.value = res.data?.data || null
    } else {
      message.error(res.data?.message || '查询失败')
    }
  } catch { message.error('查询余额失败') }
  finally { balanceLoading.value = false }
}

onMounted(() => { fetchBalance() })
</script>
