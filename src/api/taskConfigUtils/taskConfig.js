/**
 * 计量配置相关接口
 * 对应 api.md 中的配置相关接口
 */
import { get, post } from './taskConfigRequest'

// 任务，配置相关接口
const TASK_URL_GET_ALL_TASKS = '/api/tasks/get_all_tasks'
const TASK_URL_GET_ALL_CONFIGS = '/api/tasks/get_all_configs'
const TASK_URL_GET_TASK = '/api/tasks/get_task'
const TASK_URL_GET_CONFIG = '/api/tasks/get_config'
const TASK_URL_GET_TASK_LOGS = '/api/tasks/get_task_logs'
const TASK_URL_GET_ALL_CONFIG_MODULES = '/api/tasks/get_all_config_modules'

const TASK_URL_UPDATE_TASK = '/api/tasks/update_task'
const TASK_URL_ADD_TASK = '/api/tasks/add_task'
const TASK_URL_ADD_CONFIG = '/api/tasks/add_config'
const TASK_URL_UPDATE_CONFIG = '/api/tasks/update_config'
const TASK_URL_RUN_TASK = '/api/tasks/run_task'

const TASK_URL_DELETE_TASK = '/api/tasks/delete_task'
const TASK_URL_DELETE_CONFIG = '/api/tasks/delete_config'


// // 配置相关接口
// const CONFIG_URL = '/api/tasks/'

// // 文件相关接口
// const FILE_URL = '/api/tasks/'

// // 插件相关接口
// const TASK_PLUGIN_URL = '/api/tasks/'

// // 导出相关接口
// const EXPORT_URL = '/api/tasks/'



// 任务，配置相关接口
export function get_all_tasks() { return get(TASK_URL_GET_ALL_TASKS)}
export function get_all_configs() { return get(TASK_URL_GET_ALL_CONFIGS)}
export function get_task(taskId) { return get(TASK_URL_GET_TASK + taskId)}
export function get_config(configId) { return get(TASK_URL_GET_CONFIG + configId)}
export function get_task_logs(taskId) { return get(TASK_URL_GET_TASK_LOGS + taskId)}
export function get_all_config_modules() { return get(TASK_URL_GET_ALL_CONFIG_MODULES)}

export function update_task(task) { return post(TASK_URL_UPDATE_TASK, task)}
export function add_task(task) { return post(TASK_URL_ADD_TASK, task)}
export function add_config(config) { return post(TASK_URL_ADD_CONFIG, config)}
export function update_config(config) { return post(TASK_URL_UPDATE_CONFIG, config)}
export function run_task(runTask) { return post(TASK_URL_RUN_TASK , runTask)}
export function delete_task(taskId) { return post(TASK_URL_DELETE_TASK , {task_id: taskId})}
export function delete_config(configId) { return post(TASK_URL_DELETE_CONFIG , {config_id: configId})}
