import request from '@/utils/request'

export function getCompaniesApi(params?: Record<string, any>) {
  return request.get('/companies', { params })
}

export function getCompanyDetailApi(id: number) {
  return request.get(`/companies/${id}`)
}

export function getMyCompanyApi() {
  return request.get('/companies/my')
}

export function createCompanyApi(data: Record<string, any>) {
  return request.post('/companies', data)
}

export function updateCompanyApi(id: number, data: Record<string, any>) {
  return request.put(`/companies/${id}`, data)
}

export function uploadCertApi(formData: FormData) {
  return request.post('/companies/upload-cert', formData)
}
