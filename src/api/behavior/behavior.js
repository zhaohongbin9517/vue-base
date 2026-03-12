/**
 * 计量配置相关接口
 * 对应 api.md 中的配置相关接口
 */
import { get, post, del } from './behaviorRequest'

// 快照相关接口
const SNAPSHOT_URL = '/behavior_file/get_snapshot'
const RESTORE_SNAPSHOT_URL = '/behavior_file/restore_snapshot'
const GENERATE_SNAPSHOT_URL = '/behavior_file/generate_snapshot'
const UPLOAD_SNAPSHOT_URL = '/behavior_file/upload'
const DEL_SNAPSHOT_URL = '/behavior_file/delete_snapshot'

// 行为节点相关接口
const GET_ALL_BEHAVIOR_URL = '/behavior/get_all_behavior'
const GET_ALL_BEHAVIOR_TREE_URL = '/behavior/get_all_behavior_tree'
const GET_BEHAVIOR_TREE_URL = '/behavior/get_behavior_tree'
const ADD_BEHAVIOR_GROUP_URL = '/behavior/add_behavior_group'
const UPDATE_BEHAVIOR_GROUP_URL = '/behavior/update_behavior_group'
const ADD_BEHAVIOR_URL = '/behavior/add_behavior'
const UPDATE_BEHAVIOR_URL = '/behavior/update_behavior'
const ADD_BEHAVIOR_TREE_URL = '/behavior/add_behavior_tree'
const UPDATE_BEHAVIOR_TREE_URL = '/behavior/update_behavior_tree'
const BUILDER_EXECUTABLE_TREE_URL = '/behavior/builder_executable_tree'
const DELETE_BEHAVIOR_GROUP_URL = '/behavior/delete_behavior_group'
const DELETE_BEHAVIOR_URL = '/behavior/delete_behavior'
const DELETE_BEHAVIOR_TREE_URL = '/behavior/delete_behavior_tree'


// 快照相关接口
export function getSnapshot() { return get(SNAPSHOT_URL)}
export function restoreSnapshot(data) { return post(RESTORE_SNAPSHOT_URL, data)}
export function generateSnapshot() {return post(GENERATE_SNAPSHOT_URL, {})}
export function snapshotUpload(Data) { return post(UPLOAD_SNAPSHOT_URL, Data)}
export function delSnapshot(fileName) { return del(`${DEL_SNAPSHOT_URL}?filename=${fileName}`)}

// 行为节点相关接口
export function getAllBehavior() { return get(GET_ALL_BEHAVIOR_URL)}
export function getAllBehaviorTree() { return get(GET_ALL_BEHAVIOR_TREE_URL)}
export function getBehaviorTree(treeId) { return get(`${GET_BEHAVIOR_TREE_URL}?id=${treeId}`)}
export function addBehaviorGroup(data) { return post(ADD_BEHAVIOR_GROUP_URL, data)}
export function updateBehaviorGroup(data) { return post(UPDATE_BEHAVIOR_GROUP_URL, data)}
export function addBehavior(data) { return post(ADD_BEHAVIOR_URL, data)}
export function updateBehavior(data) { return post(UPDATE_BEHAVIOR_URL, data)}
export function addBehaviorTree(data) { return post(ADD_BEHAVIOR_TREE_URL, data)}
export function updateBehaviorTree(data) { return post(UPDATE_BEHAVIOR_TREE_URL, data)}
export function builderExecutableTree(data) { return post(BUILDER_EXECUTABLE_TREE_URL, data)}
export function deleteBehaviorGroup(groupId) { return del(`${DELETE_BEHAVIOR_GROUP_URL}?id=${groupId}`)}
export function deleteBehavior(behaviorId) { return del(`${DELETE_BEHAVIOR_URL}?id=${behaviorId}`)}
export function deleteBehaviorTree(treeId) { return del(`${DELETE_BEHAVIOR_TREE_URL}?id=${treeId}`)}