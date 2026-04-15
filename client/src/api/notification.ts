import request from '@/utils/request'

export function getNotificationsApi(params?: Record<string, any>) {
  return request.get('/notifications', { params })
}

export function getUnreadCountApi() {
  return request.get('/notifications/unread-count')
}

export function markReadApi(id: number) {
  return request.put(`/notifications/${id}/read`)
}

export function markAllReadApi() {
  return request.put('/notifications/read-all')
}

export function deleteReadNotificationsApi() {
  return request.delete('/notifications/read')
}

export function deleteNotificationApi(id: number) {
  return request.delete(`/notifications/${id}`)
}
