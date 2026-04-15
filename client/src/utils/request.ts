import axios from 'axios'
import { toast } from './toast'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.code && data.code !== 200) {
      toast(data.message || '请求失败', 'error')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      toast('请登录后使用此功能', 'warning')
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register') {
        router.push({ path: '/login', query: { redirect: currentPath } })
      }
    } else {
      const msg = error.response?.data?.message || error.message || '网络错误'
      toast(msg, 'error')
    }
    return Promise.reject(error)
  },
)

export default request
