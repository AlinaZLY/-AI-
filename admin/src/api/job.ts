import request from '@/utils/request'

export function getJobsAdminApi(params?: Record<string, any>) {
  return request.get('/jobs/admin', { params })
}

export function getJobDetailApi(id: number) {
  return request.get(`/jobs/${id}`)
}

export function createJobApi(data: Record<string, any>) {
  return request.post('/jobs', data)
}

export function updateJobAdminApi(id: number, data: Record<string, any>) {
  return request.put(`/jobs/admin/${id}`, data)
}

export function deleteJobAdminApi(id: number) {
  return request.delete(`/jobs/admin/${id}`)
}

export function getJobStatsApi() {
  return request.get('/jobs/stats')
}
