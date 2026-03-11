import request from '@/utils/request'

/* 管理员登录 */
export function loginApi(data: { username: string; password: string; captcha: string; captchaKey: string }) {
  return request.post('/auth/login', data)
}

/* 获取图形验证码 */
export function getCaptchaApi() {
  return request.get('/auth/captcha')
}

/* 获取当前用户信息 */
export function getUserInfoApi() {
  return request.get('/user/profile')
}
