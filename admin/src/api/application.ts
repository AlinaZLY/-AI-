import request from '@/utils/request'

export function getApplicationsApi(params?: Record<string, any>) {
  return request.get('/applications', { params })
}

export function getApplicationsAdminApi(params?: Record<string, any>) {
  return request.get('/applications/admin', { params })
}

export function getApplicationDetailApi(id: number) {
  return request.get(`/applications/admin/${id}`)
}

export function createApplicationApi(data: Record<string, any>) {
  return request.post('/applications/admin', data)
}

export function updateApplicationApi(id: number, data: Record<string, any>) {
  return request.put(`/applications/admin/${id}`, data)
}

export function deleteApplicationApi(id: number) {
  return request.delete(`/applications/admin/${id}`)
}

export function updateApplicationStatusApi(id: number, data: { status: string; note?: string }) {
  return request.put(`/applications/admin/${id}/status`, data)
}

export function getApplicationLogsApi(id: number) {
  return request.get(`/applications/admin/${id}/logs`)
}

export function getApplicationNotesApi(id: number) {
  return request.get(`/applications/admin/${id}/notes`)
}

export function addApplicationNoteApi(id: number, data: { type?: string; content: string }) {
  return request.post(`/applications/admin/${id}/notes`, data)
}

export function deleteApplicationNoteApi(noteId: number) {
  return request.delete(`/applications/admin/notes/${noteId}`)
}

export function getApplicationCalendarApi(params?: { startDate?: string; endDate?: string }) {
  return request.get('/applications/calendar', { params })
}

export function getApplicationStatsApi() {
  return request.get('/applications/admin/stats')
}
