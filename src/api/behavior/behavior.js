/**
 * 计量配置相关接口
 * 对应 api.md 中的配置相关接口
 */
import { get, post, del } from './behaviorRequest'

/**
 * 获取计量通用配置
 * @returns {Promise<Object>} 配置数据
 */
export function getSnapshot() {
  return get('/behavior_file/get_snapshot')
}


/**
 * 保存计划相关配置
 * @param {Object} data - 配置数据
 * @param {string} data.config_id - 配置ID
 * @returns {Promise}
 */
export function restoreSnapshot(data) {
  return post('/behavior_file/restore_snapshot', data)
}


/**
 * 保存计划相关配置
 * @returns {Promise}
 */
export function generateSnapshot() {
  return post('/behavior_file/generate_snapshot', {})
}

/**
 * 保存计划相关配置
 * @returns {Promise}
 */
export function snapshotUpload(Data) {
  return post('/behavior_file/upload', Data)
}


/**
 * 删除文件
 * @param {string} fileName - 文件名称
 * @returns {Promise}
 */
export function delSnapshot(fileName) {
  return del(`/behavior_file/delete_snapshot?filename=${fileName}`)
}

/**
 * 获取计量通用配置
 * @returns {Promise<Object>} 配置数据
 */
export function getAllBehavior() {
  return get('/behavior/get_all_behavior')
}