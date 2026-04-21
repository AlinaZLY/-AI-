import request from '@/utils/request'

export function getInterviewsAdminApi(params?: Record<string, any>) {
  return request.get('/interview/admin/list', { params })
}

export function getInterviewDetailAdminApi(id: number) {
  return request.get(`/interview/admin/${id}`)
}

export function deleteInterviewAdminApi(id: number) {
  return request.delete(`/interview/admin/${id}`)
}

export function getInterviewStatsApi() {
  return request.get('/interview/admin/stats')
}

export function getInterviewCategoriesApi() {
  return request.get('/interview/categories')
}

export function createInterviewCategoryApi(data: Record<string, any>) {
  return request.post('/interview/categories', data)
}

export function updateInterviewCategoryApi(id: number, data: Record<string, any>) {
  return request.put(`/interview/categories/${id}`, data)
}

export function deleteInterviewCategoryApi(id: number) {
  return request.delete(`/interview/categories/${id}`)
}

export function uploadCategoryCoverApi(formData: FormData) {
  return request.post('/interview/categories/upload-cover', formData)
}

export function getQuestionsApi(params?: Record<string, any>) {
  return request.get('/interview/questions/admin', { params })
}

export function getQuestionTypeStatsApi() {
  return request.get('/interview/questions/type-stats')
}

export function createQuestionApi(data: Record<string, any>) {
  return request.post('/interview/questions', data)
}

export function updateQuestionApi(id: number, data: Record<string, any>) {
  return request.put(`/interview/questions/${id}`, data)
}

export function deleteQuestionApi(id: number) {
  return request.delete(`/interview/questions/${id}`)
}

export function getPendingQuestionsApi(params?: Record<string, any>) {
  return request.get('/interview/questions/admin', { params: { ...params, reviewStatus: 'pending' } })
}

export function reviewQuestionApi(id: number, data: { status: string; rejectReason?: string }) {
  return request.put(`/interview/questions/${id}/review`, data)
}

export function getPracticeRecordsAdminApi(params?: Record<string, any>) {
  return request.get('/interview/practice/admin', { params })
}

export function getPracticeStatsAdminApi() {
  return request.get('/interview/practice/admin/stats')
}

export function deletePracticeRecordApi(id: number) {
  return request.delete(`/interview/practice/admin/${id}`)
}
