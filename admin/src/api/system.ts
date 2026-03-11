import request from '@/utils/request'

/** 获取所有系统设置 */
export function getSettingsApi() {
  return request.get('/system/settings')
}

/** 更新系统设置（需管理员权限） */
export function updateSettingsApi(data: Record<string, string>) {
  return request.put('/system/settings', data)
}
