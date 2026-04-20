import request from '@/utils/request'

export function getResumesApi() {
  return request.get('/resumes')
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

export function getTemplatesApi(params?: Record<string, unknown>) {
  return request.get('/resumes/templates', { params })
}

export function getResumeTemplateApi(id: number) {
  return request.get(`/resumes/templates/${id}`)
}

export function analyzeResumeApi(id: number) {
  return request.post(`/resumes/item/${id}/analyze`, null, { timeout: 120000 })
}

export function renderResumeApi(id: number, locale?: string) {
  return request.get(`/resumes/item/${id}/render`, { params: locale ? { locale } : undefined })
}

export function uploadResumeFileApi(
  id: number,
  file: File,
  locale?: string,
  onUploadProgress?: (percent: number) => void,
) {
  const fd = new FormData()
  fd.append('file', file)
  return request.post(`/resumes/item/${id}/upload`, fd, {
    timeout: 120000,
    onUploadProgress: (event) => {
      const total = event.total || file.size || 0
      if (total <= 0) return
      const percent = Math.min(100, Math.round((event.loaded / total) * 100))
      onUploadProgress?.(percent)
    },
    params: locale ? { locale } : undefined,
  })
}

export function optimizeResumeApi(id: number, data?: Record<string, unknown>) {
  return request.post(`/resumes/item/${id}/optimize`, data, { timeout: 120000 })
}

export function duplicateResumeApi(id: number) {
  return request.post(`/resumes/item/${id}/duplicate`)
}

export function setDefaultResumeApi(id: number) {
  return request.put(`/resumes/item/${id}/default`)
}
