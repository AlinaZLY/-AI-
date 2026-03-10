import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

/* 创建 axios 实例 */
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

/* 请求拦截器 — 自动附加 JWT Token */
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/* 响应拦截器 — 统一处理错误 */
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200) {
      return data
    }
    message.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message))
  },
  (error) => {
    if (error.response?.status === 401) {
      const isOnLogin = router.currentRoute.value.path === '/login'
      if (!isOnLogin) {
        localStorage.removeItem('token')
        const currentPath = router.currentRoute.value.fullPath
        router.push({ path: '/login', query: { redirect: currentPath } })
        message.error('登录已过期，请重新登录')
      }
    } else {
      message.error(error.response?.data?.message || '网络异常')
    }
    return Promise.reject(error)
  }
)

export default request
