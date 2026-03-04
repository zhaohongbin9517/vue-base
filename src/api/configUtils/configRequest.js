/**
 * API 请求基础配置
 * 封装 fetch 请求，统一处理请求和响应
 */

const BASE_URL = ''

/**
 * 获取认证 Token
 * @returns {string|null}
 */
function getAuthToken() {
  // return localStorage.getItem('token') || sessionStorage.getItem('token')
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOls5OSwxMTEsMTEwLDEwMiwxMDUsMTAzLDExNiw5NywxMjIsMTA0XX0.rmC9hAtDRlfqKTAdQEOUWQebMt7aUMA90Cm2L8dDCYQ'
  return token
}

/**
 * 基础请求函数
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} - 返回请求结果
 */
async function request(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`

  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const defaultOptions = {
    headers
  }

  const response = await fetch(fullUrl, { ...defaultOptions, ...options })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  if (data.code !== 0 && data.code !== undefined) {
    throw new Error(data.message || '请求失败')
  }

  return data.data !== undefined ? data.data : data
}

/**
 * GET 请求
 * @param {string} url - 请求地址
 * @param {object} params - 查询参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url
  return request(fullUrl, { method: 'GET' })
}

/**
 * POST 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求体数据
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * PUT 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求体数据
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * DELETE 请求
 * @param {string} url - 请求地址
 * @returns {Promise}
 */
export function del(url) {
  return request(url, { method: 'DELETE' })
}

export default request
