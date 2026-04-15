import request from '@/utils/request'

export function getApplicationsApi(params?: Record<string, any>) {
  return request.get('/applications', { params })
}

export function getApplicationStatsApi() {
  return request.get('/applications/stats')
}

export function createApplicationApi(data: Record<string, any>) {
  return request.post('/applications', data)
}

export function updateApplicationApi(id: number, data: Record<string, any>) {
  return request.put(`/applications/${id}`, data)
}

export function updateApplicationStatusApi(id: number, data: { status: string; remark?: string }) {
  return request.put(`/applications/${id}/status`, data)
}

export function deleteApplicationApi(id: number) {
  return request.delete(`/applications/${id}`)
}

export function getApplicationCalendarApi(params?: Record<string, any>) {
  return request.get('/applications/calendar', { params })
}

export function getApplicationLogsApi(id: number) {
  return request.get(`/applications/${id}/logs`)
}

export function getApplicationNotesApi(id: number) {
  return request.get(`/applications/${id}/notes`)
}

export function addApplicationNoteApi(id: number, data: Record<string, any>) {
  return request.post(`/applications/${id}/notes`, data)
}

export function deleteApplicationNoteApi(noteId: number) {
  return request.delete(`/applications/notes/${noteId}`)
}
