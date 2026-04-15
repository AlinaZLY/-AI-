import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, registerApi } from '@/api/auth'
import { getProfileApi } from '@/api/user'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<any>(null)

  async function login(data: { username: string; password: string; captcha: string; captchaKey: string }) {
    const res: any = await loginApi(data)
    token.value = res.data.accessToken
    userInfo.value = res.data.user
    localStorage.setItem('token', token.value)
  }

  async function register(data: Record<string, any>) {
    await registerApi(data)
  }

  async function fetchUserInfo() {
    const res: any = await getProfileApi()
    userInfo.value = res.data
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { token, userInfo, login, register, fetchUserInfo, logout }
})
