import md5 from 'js-md5'
import request from '@/api/userUtils/userRequest'
import { computed } from 'vue'
import { hasAuthPermission } from '@/api/userUtils/auth'

/**
 * 密码登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 登录结果
 */
export const loginByPassword = ({ username, password }) => request({
  url: '/login',
  method: 'post',
  data: {
    username,
    password: md5(password),
    grant_type: 'password'
  }
})

/**
 * 获取授权权限
 * @param {string} permission - 权限字符串
 * @returns {boolean} - 是否有该权限
 */
export function getAuthPermission(permission) {
  console.log(permission)
  const canLicenseWrite = computed(() => hasAuthPermission('config:write'))
  return canLicenseWrite
}
