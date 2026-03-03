/**
 * 计量配置相关接口
 * 对应 api.md 中的配置相关接口
 */
import { get, post } from './request'

/**
 * 获取计量通用配置
 * @returns {Promise<Object>} 配置数据
 */
export function getTmmsConfig() {
  return get('/tmms_config/get_tmms_config')
}

/**
 * 获取表列名
 * @param {string} tableName - 表名
 * @param {string} type - 类型
 * @returns {Promise<Array>} 列名列表
 */
export function getTableColumn(tableName, type) {
  return get('/tmms_config/get_table_column', { table_name: tableName, type })
}

/**
 * 获取所有表名
 * @returns {Promise<Array>} 表名列表
 */
export function getAllTableName() {
  return get('/tmms_config/get_all_table_name')
}

/**
 * 保存计划相关配置
 * @param {Object} data - 配置数据
 * @param {string} data.plan_table_name - 计划表名
 * @param {Object} data.xlsx_column_name - Excel列配置
 * @returns {Promise}
 */
export function updateTmmsConfigPlan(data) {
  return post('/tmms_config/update_tmms_config_plan', data)
}

/**
 * 保存结果相关配置
 * @param {Object} data - 配置数据
 * @param {string} data.result_data_table_name - 结果数据表名
 * @param {Object} data.measure_result_title_name - 结果标题配置
 * @returns {Promise}
 */
export function updateTmmsConfigResult(data) {
  return post('/tmms_config/update_tmms_config_result', data)
}


/**
 * 获取所有配置信息
 * @returns {Promise<Array>} 配置信息列表
 */
export function getAllMeterConfig() {
  return get('/tmms_config/get_meter_config')
}

/**
 * 获取所有配了参数的站id
 * @returns {Promise<Array>} 站id列表
 */
export function getAllStationTagKey() {
  return get('/tmms_config/get_all_station_tag_key')
}

/**
 * 获取所有配了参数的站id
 * @returns {Promise<Array>} 站id列表
 */
export function getStationCode(stationId) {
  return get('/tmms_config/get_station_code', {station_id : stationId})
}

/**
 * 保存配置相关配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export function updateMeterConfig(data) {
  return post('/tmms_config/update_meter_config', data)
}

/**
 * 删除配置
 * @param {string} configId - 配置id
 * @returns {Promise}
 */
export function deleteMeterConfig(configId) {
   return get('/tmms_config/delete_meter_config', {config_id : configId})
}
