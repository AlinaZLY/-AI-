import axios from 'axios'
import { toast } from './toast'
import router from '@/router'
import { translate } from '@/i18n'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const locale = localStorage.getItem('client-locale') || document.documentElement.lang || navigator.language || 'zh-CN'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-Locale'] = locale
  config.headers['Accept-Language'] = locale
  return config
})

request.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.code && data.code !== 200) {
      toast(translate(data.message || '请求失败'), 'error')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || error.message || '请求失败'
      localStorage.removeItem('token')
      const currentRoute = router.currentRoute.value
      if (currentRoute.meta?.requireAuth) {
        toast(translate('请登录后使用此功能'), 'warning')
        router.push({ path: '/login', query: { redirect: currentRoute.fullPath } })
      } else {
        toast(translate(msg), 'error')
      }
    } else {
      const msg = error.response?.data?.message || error.message || '网络错误'
      toast(translate(msg), 'error')
    }
    return Promise.reject(error)
  },
)

export default request
