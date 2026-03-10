import request from '@/utils/request'

export function getResumesApi() {
  return request.get('/resumes')
}

export function getResumesAdminApi(params?: Record<string, any>) {
  return request.get('/resumes/admin', { params })
}

export function getResumeDetailApi(id: number) {
  return request.get(`/resumes/${id}`)
}

export function createResumeApi(data: Record<string, any>) {
  return request.post('/resumes', data)
}

export function updateResumeApi(id: number, data: Record<string, any>) {
  return request.put(`/resumes/${id}`, data)
}

export function deleteResumeApi(id: number) {
  return request.delete(`/resumes/${id}`)
}

export function duplicateResumeApi(id: number) {
  return request.post(`/resumes/item/${id}/duplicate`)
}

export function setDefaultResumeApi(id: number) {
  return request.put(`/resumes/item/${id}/default`)
}

export function analyzeResumeApi(id: number) {
  return request.post(`/resumes/item/${id}/analyze`)
}

export function optimizeResumeApi(id: number) {
  return request.post(`/resumes/item/${id}/optimize`)
}

export function getResumeTemplatesApi(params?: Record<string, any>) {
  return request.get('/resumes/templates', { params })
}

export function getTemplateCategoriesApi() {
  return request.get('/resumes/templates/categories')
}

export function getTemplateDetailApi(id: number) {
  return request.get(`/resumes/templates/${id}`)
}

export function createTemplateApi(data: Record<string, any>) {
  return request.post('/resumes/templates', data)
}

export function updateTemplateApi(id: number, data: Record<string, any>) {
  return request.put(`/resumes/templates/${id}`, data)
}

export function deleteTemplateApi(id: number) {
  return request.delete(`/resumes/templates/${id}`)
}

export function uploadTemplateDocxApi(formData: FormData) {
  return request.post('/resumes/templates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function renderResumeApi(id: number) {
  return request.get(`/resumes/item/${id}/render`)
}
