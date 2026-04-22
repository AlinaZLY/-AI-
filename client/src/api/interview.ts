import request from '@/utils/request'

export function startInterviewApi(data: Record<string, any>) {
  return request.post('/interview/start', data)
}

export function getInterviewsApi() {
  return request.get('/interview/list')
}

export function getInterviewDetailApi(id: number) {
  return request.get(`/interview/${id}`)
}

export function submitAnswerApi(interviewId: number, questionId: number, data: { answer: string; answerType?: string }) {
  return request.post(`/interview/${interviewId}/questions/${questionId}/answer`, data)
}

export function getRadarDataApi() {
  return request.get('/interview/radar')
}

export function getCategoriesApi() {
  return request.get('/interview/categories')
}

export function getQuestionsApi(params?: Record<string, any>) {
  return request.get('/interview/questions', { params })
}

export function deleteInterviewApi(id: number) {
  return request.delete(`/interview/${id}`)
}

export function submitPracticeApi(questionId: number, data: { answer: string }) {
  return request.post(`/interview/questions/${questionId}/practice`, data)
}

export function getPracticeHistoryApi(params?: { page?: number; pageSize?: number }) {
  return request.get('/interview/practice/history', { params })
}

export function getPracticeStatsApi() {
  return request.get('/interview/practice/stats')
}

export function submitQuestionApi(data: Record<string, any>) {
  return request.post('/interview/questions/submit', data)
}

export function getMySubmissionsApi() {
  return request.get('/interview/questions/my')
}
