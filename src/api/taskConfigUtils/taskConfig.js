/**
 * 计量配置相关接口
 * 对应 api.md 中的配置相关接口
 */
import { get, post } from './taskConfigRequest'

// 任务，配置相关接口
const TASK_URL_GET_ALL_TASKS = '/api/tasks_new/get_all_tasks'
const TASK_URL_GET_ALL_CONFIGS = '/api/tasks_new/get_all_configs'
const TASK_URL_GET_TASK = '/api/tasks_new/get_task'
const TASK_URL_GET_CONFIG = '/api/tasks_new/get_config'
const TASK_URL_GET_TASK_LOGS = '/api/tasks_new/get_task_logs'
const TASK_URL_GET_ALL_CONFIG_MODULES = '/api/tasks_new/get_all_config_modules'

const TASK_URL_UPDATE_TASK = '/api/tasks_new/update_task'
const TASK_URL_ADD_TASK = '/api/tasks_new/add_task'
const TASK_URL_ADD_CONFIG = '/api/tasks_new/add_config'
const TASK_URL_UPDATE_CONFIG = '/api/tasks_new/update_config'
const TASK_URL_RUN_TASK = '/api/tasks_new/run_task'

const TASK_URL_DELETE_TASK = '/api/tasks_new/delete_task'
const TASK_URL_DELETE_CONFIG = '/api/tasks_new/delete_config'

//配置上传下载
const TASK_URL_DOWNLOAD_ONE_DATA = '/api/export_new/download_one_data'
const TASK_URL_DOWNLOAD_TASK = '/api/export_new/download_all_tasks'
const TASK_URL_DOWNLOAD_CONFIG = '/api/export_new/download_all_configs'

//文件管理
const TASK_URL_GET_ALL_FILES = '/api/files_new/get_all_files'
const TASK_URL_PREVIEW_FILE = '/api/files_new/preview_file'


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
export function get_task_logs(taskId,pagesize,index) { return get(TASK_URL_GET_TASK_LOGS ,{task_id: taskId,pagesize: pagesize,index: index})}
export function get_all_config_modules() { return get(TASK_URL_GET_ALL_CONFIG_MODULES)}

export function update_task(task) { return post(TASK_URL_UPDATE_TASK, task)}
export function add_task(task) { return post(TASK_URL_ADD_TASK, task)}
export function add_config(config) { return post(TASK_URL_ADD_CONFIG, config)}
export function update_config(config) { return post(TASK_URL_UPDATE_CONFIG, config)}
export function run_task(runTask) { return post(TASK_URL_RUN_TASK , runTask)}
export function delete_task(taskId) { return post(TASK_URL_DELETE_TASK , {task_id: taskId})}
export function delete_config(configId) { return post(TASK_URL_DELETE_CONFIG , {config_id: configId})}

//配置上传下载
export function download_one_data(data_type, id) { return get(TASK_URL_DOWNLOAD_ONE_DATA , {data_type: data_type,id: id})}
export function download_all_tasks() { return get(TASK_URL_DOWNLOAD_TASK)}
export function download_all_configs() { return get(TASK_URL_DOWNLOAD_CONFIG)}

//文件管理
export function get_all_files() { return get(TASK_URL_GET_ALL_FILES)}
export function preview_file(fileName) { return get(TASK_URL_PREVIEW_FILE , {file_name: fileName})}