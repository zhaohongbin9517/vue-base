/**
 * 计量站控制相关接口
 * 对应 /measure_controller/* API
 */
import { get, post } from './configRequest'

/**
 * 获取全部计量站列表（复用站配置接口）
 * @returns {Promise<Array>} 站列表
 */
export function getAllStations() {
  return get('/tmms_config/get_station_config')
}

/**
 * 重启单个计量站进程
 * @param {string} stationId - 站id
 * @returns {Promise}
 */
export function restartMeasureProcessOne(stationId) {
  return post('/measure_controller/restart_measure_process_one', { station_id: stationId })
}

/**
 * 重启全部计量站进程
 * @returns {Promise}
 */
export function restartMeasureProcessAll() {
  return post('/measure_controller/restart_measure_process_all', {})
}

/**
 * 计量配置检查
 * @param {string} stationId - 站id
 * @param {string[]|string} [checkItems] - 检测项列表，缺省 'all'
 *   可选值: config_check / meter_config / plan_columns / result_columns / daunit_tag / base_tongdao
 * @returns {Promise<Object>} 结构化检查结果 { item_key: { name, msg, result, child? } }
 */
export function checkStationMeterConfig(stationId, checkItems) {
  return post('/measure_controller/check_station_meter_config', {
    station_id: stationId,
    check_items: checkItems || 'all'
  })
}

/**
 * 清空scada缓存
 * @returns {Promise}
 */
export function clearScadaCache() {
  return post('/measure_controller/clear_scada_cache', {})
}

/**
 * 获取计量站进程信息
 * @param {string} stationId - 站id
 * @returns {Promise<Object>} 进程信息 { alive, station_id, pid, status, measure_mode, process_info, groups }
 */
export function getStationProcessInfo(stationId) {
  return post('/measure_controller/get_station_process_info', { station_id: stationId })
}
