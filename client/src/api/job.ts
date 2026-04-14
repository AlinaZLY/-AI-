import request from '@/utils/request'

export function getJobsApi(params?: Record<string, any>) {
  return request.get('/jobs', { params })
}

export function getJobDetailApi(id: number) {
  return request.get(`/jobs/${id}`)
}
