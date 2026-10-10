const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'
const AUTH_ALIAS_KEY = 'auth_alias'
const AUTH_PERMISSION_KEYS = 'auth_permission_keys'
const REMEMBER_USER_KEY = 'remember_user'
const REMEMBER_FLAG_KEY = 'remember_flag'

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || ''

export const getAuthUser = () => localStorage.getItem(AUTH_USER_KEY) || ''

export const getAuthAlias = () => localStorage.getItem(AUTH_ALIAS_KEY) || ''

export const setAuthSession = ({ token = '', username = '', alias = '' } = {}) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
  if (username) {
    localStorage.setItem(AUTH_USER_KEY, username)
  }
  localStorage.setItem(AUTH_ALIAS_KEY, alias || username || '')
}

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_ALIAS_KEY)
  localStorage.removeItem(AUTH_PERMISSION_KEYS)
}

export const hasAuthSession = () => Boolean(getAuthToken() && getAuthUser())

export const getDisplayName = () => getAuthAlias() || getAuthUser() || '未登录'

export const getAuthPermissionKeys = () => {
  const raw = localStorage.getItem(AUTH_PERMISSION_KEYS)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

export const setAuthPermissionKeys = (keys = []) => {
  const normalized = Array.from(new Set((Array.isArray(keys) ? keys : []).filter(Boolean)))
  localStorage.setItem(AUTH_PERMISSION_KEYS, JSON.stringify(normalized))
  return normalized
}

export const hasAuthPermission = (permissionKey) => {
  if (!permissionKey) {
    return true
  }
  return getAuthPermissionKeys().includes(permissionKey)
}

export const hasAnyAuthPermission = (permissionKeys = []) => {
  const requiredKeys = Array.isArray(permissionKeys) ? permissionKeys.filter(Boolean) : []
  if (requiredKeys.length === 0) {
    return true
  }

  const currentKeys = new Set(getAuthPermissionKeys())
  return requiredKeys.some(key => currentKeys.has(key))
}

export const setRememberedUser = (username, enabled) => {
  localStorage.setItem(REMEMBER_FLAG_KEY, enabled ? 'true' : 'false')
  if (enabled && username) {
    localStorage.setItem(REMEMBER_USER_KEY, username)
    return
  }
  localStorage.removeItem(REMEMBER_USER_KEY)
}

export const getRememberedUser = () => ({
  enabled: localStorage.getItem(REMEMBER_FLAG_KEY) === 'true',
  username: localStorage.getItem(REMEMBER_USER_KEY) || ''
})
