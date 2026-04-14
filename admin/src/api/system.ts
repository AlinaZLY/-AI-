import request from '@/utils/request'

/** 获取所有系统设置（需管理员权限） */
export function getSettingsApi() {
  return request.get('/system/settings')
}

/** 获取公开系统设置（无需认证） */
export function getPublicSettingsApi() {
  return request.get('/system/settings/public')
}

/** 更新系统设置（需管理员权限） */
export function updateSettingsApi(data: Record<string, string>) {
  return request.put('/system/settings', data)
}

/** 获取仪表盘统计数据 */
export function getDashboardStatsApi(params?: { startDate?: string; endDate?: string }) {
  return request.get('/system/stats', { params })
}

/** 向指定范围活跃用户发送系统公告 */
export function sendAnnouncementApi(data: {
  title: string
  content: string
  target?: string
  userIds?: number[]
}) {
  return request.post('/system/announcement', data)
}

export function getAnnouncementHistoryApi(params?: { page?: number; pageSize?: number }) {
  return request.get('/system/announcement/history', { params })
}

/** 获取通知列表 */
export function getNotificationsApi(params?: {
  page?: number
  pageSize?: number
  type?: string
  isRead?: string
}) {
  return request.get('/notifications', { params })
}

/** 获取未读通知数量 */
export function getUnreadCountApi() {
  return request.get('/notifications/unread-count')
}

/** 标记单条通知已读 */
export function markNotificationReadApi(id: number) {
  return request.put(`/notifications/${id}/read`)
}

/** 标记所有通知已读 */
export function markAllNotificationsReadApi() {
  return request.put('/notifications/read-all')
}

/** 删除所有已读通知 */
export function deleteReadNotificationsApi() {
  return request.delete('/notifications/read')
}

/** 删除单条通知 */
export function deleteNotificationApi(id: number) {
  return request.delete(`/notifications/${id}`)
}

/** 获取所有字典类型及其项 */
export function getDictTypesApi() {
  return request.get('/system/dict')
}

/** 按编码获取字典项 */
export function getDictByCodeApi(code: string) {
  return request.get(`/system/dict/${code}`)
}

/** 创建字典类型 */
export function createDictTypeApi(data: { code: string; name: string; description?: string }) {
  return request.post('/system/dict/types', data)
}

/** 创建字典项 */
export function createDictItemApi(data: { dictTypeId: number; value: string; label: string; color?: string; sort?: number }) {
  return request.post('/system/dict/items', data)
}

/** 更新字典项 */
export function updateDictItemApi(id: number, data: Record<string, any>) {
  return request.put(`/system/dict/items/${id}`, data)
}

/** 删除字典项 */
export function deleteDictItemApi(id: number) {
  return request.delete(`/system/dict/items/${id}`)
}

/** 删除字典类型 */
export function deleteDictTypeApi(id: number) {
  return request.delete(`/system/dict/types/${id}`)
}

/** 上传平台 LOGO */
export function uploadLogoApi(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request.post('/system/upload-logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/** 火山语音识别 - 一站式（提交+轮询） */
export function speechRecognizeApi(audioUrl: string, options?: { format?: string; language?: string }) {
  return request.post('/system/speech/recognize', { audioUrl, ...options })
}

/** 火山语音识别 - 上传音频 */
export function speechUploadApi(file: File, baseUrl?: string) {
  const form = new FormData()
  form.append('file', file)
  return request.post(`/system/speech/upload${baseUrl ? `?baseUrl=${encodeURIComponent(baseUrl)}` : ''}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
