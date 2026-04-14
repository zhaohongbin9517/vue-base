/**
 * 计量配置相关接口
 * 对应 api.md 中的配置相关接口
 */
import { get, post, del } from './taskConfigRequest'

// 快照相关接口
const SNAPSHOT_URL = '/behavior_file/get_snapshot'


// 行为节点相关接口
const GET_ALL_BEHAVIOR_URL = '/behavior/get_all_behavior'



// 快照相关接口
export function getSnapshot() { return get(SNAPSHOT_URL)}


// 行为节点相关接口
export function getAllBehavior() { return get(GET_ALL_BEHAVIOR_URL)}
