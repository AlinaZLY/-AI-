import request from '@/utils/request'

export function getCaptchaApi() {
  return request.get('/auth/captcha')
}

export function loginApi(data: { username: string; password: string; captcha: string; captchaKey: string }) {
  return request.post('/auth/login', data)
}

export function registerApi(data: Record<string, any>) {
  return request.post('/auth/register', data)
}
