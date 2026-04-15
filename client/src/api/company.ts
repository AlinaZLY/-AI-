import request from '@/utils/request'

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
