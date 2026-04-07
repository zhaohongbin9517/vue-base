import { acGetUserAccess } from '@/api/userUtils/userCenter'
import {
  getAuthPermissionKeys,
  getAuthUser,
  setAuthPermissionKeys
} from './auth'

let permissionLoadPromise = null

const normalizePermissionKeys = (items) => {
  const keys = []

  ;(Array.isArray(items) ? items : []).forEach(item => {
    const resourceKey = item?.resource || item?.key
    if (!resourceKey) {
      return
    }

    const accessList = Array.isArray(item?.access)
      ? item.access
      : Array.isArray(item?.permission)
        ? item.permission.map(permission => (typeof permission === 'string' ? permission : permission?.key))
        : []

    accessList
      .filter(Boolean)
      .forEach(action => keys.push(`${resourceKey}:${action}`))
  })

  return Array.from(new Set(keys))
}

export const getFirstAuthorizedPath = () => {
  // const permissions = new Set(getAuthPermissionKeys())

  // if (permissions.has('license:read')) {
  //   return '/config/blank'
  // }

  // if (permissions.has('user_manage:read')) {
  //   return '/user-center/users'
  // }

  // return '/403'

  return '/behavior-tree/node-manager'
}

export const refreshAuthPermissions = async (force = false) => {
  const currentUser = getAuthUser()
  if (!currentUser) {
    return setAuthPermissionKeys([])
  }

  const cachedKeys = getAuthPermissionKeys()
  if (!force && cachedKeys.length > 0) {
    return cachedKeys
  }

  if (!permissionLoadPromise) {
    permissionLoadPromise = (async () => {
      try {
        const res = await acGetUserAccess({ user_name: currentUser })
        if (res?.result !== 'ok') {
          return setAuthPermissionKeys([])
        }

        return setAuthPermissionKeys(normalizePermissionKeys(res.content))
      } catch {
        return setAuthPermissionKeys([])
      } finally {
        permissionLoadPromise = null
      }
    })()
  }

  return permissionLoadPromise
}
