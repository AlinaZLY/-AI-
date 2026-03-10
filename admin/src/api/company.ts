import request from '@/utils/request'

export function getCompaniesAdminApi(params?: Record<string, any>) {
  return request.get('/companies/admin', { params })
}

export function getCompanyDetailApi(id: number) {
  return request.get(`/companies/${id}`)
}

export function updateCompanyStatusApi(id: number, status: string, rejectReason?: string) {
  return request.put(`/companies/admin/${id}/status`, { status, rejectReason })
}

export function deleteCompanyAdminApi(id: number) {
  return request.delete(`/companies/admin/${id}`)
}

export function getCompanyStatsApi() {
  return request.get('/companies/stats')
}
