import request from '@/api/userUtils/userRequest'

// 获取数据权限基础数据（组织对象树，节点含 objectType / objectId / objectName / children）
export const getDataPermissionBase = (params) =>
  request({ url: '/ac/get_data_permission_base', method: 'get', params })

// 查询用户数据权限（返回 { user_name, permission }，permission 为勾选树）
export const getUserDataPermission = (params) =>
  request({ url: '/ac/get_user_data_permission', method: 'get', params })

// 设置用户数据权限（permission 需传 JSON 字符串）
export const setUserDataPermission = (data) =>
  request({ url: '/ac/set_user_data_permission', method: 'post', data })

// 校验用户对指定对象是否有数据权限
export const authUserDataPermission = (params) =>
  request({ url: '/ac/auth_user_data_permission', method: 'get', params })
