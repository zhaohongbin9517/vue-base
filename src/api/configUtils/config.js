/**
 * 计量配置相关接口
 * 对应 api.md 中的配置相关接口
 */
import { get, post } from './configRequest'

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
 * 保存站相关配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export function updateStationConfig(data) {
  return post('/tmms_config/updata_station_config', data)
}

/**
 * 删除配置
 * @param {string} configId - 配置id
 * @returns {Promise}
 */
export function deleteMeterConfig(configId) {
   return get('/tmms_config/delete_meter_config', {config_id : configId})
}

/**
 * 获取额外参数枚举
 * @returns {Promise<Array>} 额外参数枚举列表
 */
export function getExtendConfigEnum() {
  return get('/tmms_config/get_extend_config_enum')
}

/**
 * 获取额外参数枚举
 * @returns {Promise<Array>} 额外参数枚举列表
 */
export function getWebPort() {
  return get('/tmms_config/get_web_port')
}

/**
 * 获取对象关系
 * @returns {Promise<Array>} 对象关系列表
 */
export function getObjectRelation() {
  return get('/meter_general/get_object_relation')
}

/**
 * 获取所有站配置
 * @returns {Promise<Array>} 站配置列表
 */
export function getAllStationConfig() {
  return get('/tmms_config/get_station_config')
}


/**
 * 获取额外ws配置
 * @returns {Promise<Object>} ws配置数据
 */
export function getWebWsConfig() {
  return get('/tmms_config/get_web_ws_config')
}

/**
 * 获取额外ws配置
 * @returns {Promise} ws配置数据
 */
export function updateWebWsConfig() {
  return get('/tmms_config/update_web_ws_config')
}

/**
 * 获取额外ws配置
 * @returns {Promise} ws配置数据
 */
export function changeWebWsConfig(Data) {
  return post('/tmms_config/change_web_ws_config',Data)
}


/**
 * 获取额外web temp配置
 * @returns {Promise<Object>} web temp配置数据
 */
export function getWebTempConfig() {
  return get('/tmms_config/get_web_temp_config')
}

/**
 * 获取额外web temp配置
 * @returns {Promise} web temp配置数据
 */
export function resetWebTempConfig() {
  return get('/tmms_config/reset_web_temp_config')
}

/**
 * 获取额外web temp配置
 * @returns {Promise} web temp配置数据
 */
export function changeWebTempConfig(Data) {
  return post('/tmms_config/change_web_temp_config',Data)
}

/**
 * 获取额外web temp配置
 * @returns {Promise} web temp配置数据
 */
export function changeWebTempFilename(Data) {
  return post('/tmms_config/change_web_temp_filename',Data)
}