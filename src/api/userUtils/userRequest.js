import axios from 'axios'
import { ElMessage } from 'element-plus'
import { clearAuthSession, getAuthToken } from './auth'

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]'
const isFormData = (value) => typeof FormData !== 'undefined' && value instanceof FormData

const toFormUrlEncoded = (data) => {
  const params = new URLSearchParams()
  Object.entries(data || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach(item => params.append(key, item))
      return
    }

    params.append(key, value)
  })
  return params.toString()
}

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 50000
})

service.interceptors.request.use(
  config => {
    const nextConfig = { ...config }
    const method = String(nextConfig.method || 'get').toLowerCase()
    const url = String(nextConfig.url || '')
    const token = getAuthToken()
    const isLoginRequest = url === '/login' || url.endsWith('/login')

    if (method === 'post' && isPlainObject(nextConfig.data) && !isFormData(nextConfig.data)) {
      nextConfig.data = toFormUrlEncoded(nextConfig.data)
      nextConfig.headers = {
        ...nextConfig.headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    if (!isLoginRequest && token) {
      // 确保Authorization头包含"Bearer "前缀
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
      nextConfig.headers = {
        ...nextConfig.headers,
        Authorization: authToken
      }
    }

    return nextConfig
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res?.code !== undefined && res.code !== 0) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  error => {
    const status = error?.response?.status

    if (status === 401) {
      clearAuthSession()
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login'
      }
    }

    ElMessage({
      message: error?.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
