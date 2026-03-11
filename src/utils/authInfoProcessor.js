/**
 * 处理URL中的认证信息参数
 * 用于从URL中解析authInfo并存储到localStorage
 */
import { getQueryObject } from '@/api/userUtils/index'
import { setAuthSession, setAuthPermissionKeys } from '@/api/userUtils/auth'

/**
 * 解析URL中的authInfo参数并存储到localStorage
 * @returns {Object|null} 解析后的认证信息或null
 */
export function processAuthInfoFromUrl() {
  try {
    // 获取URL参数
    const queryParams = getQueryObject(window.location.href)
    const authInfoStr = queryParams.authInfo
    
    if (!authInfoStr) {
      return null
    }
    
    // 解码并解析authInfo
    const decodedAuthInfo = decodeURIComponent(authInfoStr)
    const authInfo = JSON.parse(decodedAuthInfo)
    
    // 验证必要字段
    if (!authInfo.token || !authInfo.user) {
      throw new Error('认证信息缺少必要字段')
    }
    
    // 存储到localStorage
    setAuthSession({
      token: authInfo.token,
      username: authInfo.user,
      alias: authInfo.alias
    })
    
    // 设置权限信息
    if (authInfo.permissionKeys && Array.isArray(authInfo.permissionKeys)) {
      setAuthPermissionKeys(authInfo.permissionKeys)
    }
    
    console.log('认证信息已从URL加载:', authInfo)
    return authInfo
  } catch (error) {
    console.error('解析URL认证信息失败:', error)
    return null
  }
}

/**
 * 从URL中移除authInfo参数
 * 用于在处理完认证信息后保持URL干净
 */
export function removeAuthInfoFromUrl() {
  const url = window.location.href
  const urlObj = new URL(url)
  
  // 移除authInfo参数
  if (urlObj.searchParams.has('authInfo')) {
    urlObj.searchParams.delete('authInfo')
    
    // 更新URL但不刷新页面
    window.history.replaceState({}, document.title, urlObj.toString())
  }
}

/**
 * 完整的认证信息处理流程
 * 解析URL中的authInfo并存储，然后从URL中移除该参数
 * @returns {Object|null} 解析后的认证信息或null
 */
export function handleAuthInfoFromUrl() {
  const authInfo = processAuthInfoFromUrl()
  removeAuthInfoFromUrl()
  return authInfo
}
