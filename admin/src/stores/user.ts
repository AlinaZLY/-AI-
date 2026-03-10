import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, getUserInfoApi } from '@/api/auth'
import router from '@/router'

/* 用户状态管理 */
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<Record<string, unknown> | null>(null)

  /* 登录 */
  async function login(params: { username: string; password: string; captcha: string; captchaKey: string }) {
    const res: any = await loginApi(params)
    token.value = res.data.accessToken
    localStorage.setItem('token', token.value)
    return res
  }

  /* 获取用户信息 */
  async function fetchUserInfo() {
    const res: any = await getUserInfoApi()
    userInfo.value = res.data
    return res
  }

  /* 退出登录 */
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { token, userInfo, login, fetchUserInfo, logout }
})
