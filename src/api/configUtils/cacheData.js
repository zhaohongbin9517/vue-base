import { getObjectRelation } from './config'

// 模块级变量，存储对象信息映射表
let objectInfoMap = new Map();

/**
 * 缓存数据基础函数
 * @returns {Promise<boolean>} 是否成功
 */
export async function initObjectRelation() {
    try {
        const objectRelation = await getObjectRelation();
        
        // 清空现有数据
        objectInfoMap.clear();
        
        const forFn = function (item) {
            // 定义唯一的 key
            const mapKey =`${item.objectId}_${item.objectType}`
            // 存储对象信息
            objectInfoMap.set(mapKey, {
                objectName: item.objectName,
                objectType: item.objectType
            });
            // 递归处理子节点
            if (item.children && item.children.length > 0) {
                for (const child of item.children) {
                    forFn(child);
                }
            }
        };
        
        if (objectRelation.length > 0) {
            for (const item of objectRelation) {
                forFn(item);
            }
        }
        
        // 保存到本地缓存
        saveToLocalCache(objectInfoMap);
        
        return true;
    } catch (error) {
        console.error('获取对象关系失败:', error);
        return false;
    }
}

/**
 * 保存数据到本地缓存
 * @param {Map} data 对象信息映射表
 */
function saveToLocalCache(data) {
    // 将 Map 转换为可序列化的数组
    const cacheData = {
        data: Array.from(data.entries()).map(([key, value]) => ({
            key, // 包含 name 和 type 的对象
            value // 包含 objectName 和 objectType 的对象
        })),
        expireTime: Date.now() + 10 * 60 * 1000 // 10分钟过期
    };
    
    try {
        localStorage.setItem('objectInfoMapCache', JSON.stringify(cacheData));
    } catch (error) {
        console.error('保存本地缓存失败:', error);
    }
}

/**
 * 从本地缓存获取数据
 * @returns {Map|null} 对象信息映射表或null
 */
function getFromLocalCache() {
    try {
        const cacheData = localStorage.getItem('objectInfoMapCache');
        if (!cacheData) return null;
        
        const parsed = JSON.parse(cacheData);
        
        // 检查是否过期
        if (Date.now() > parsed.expireTime) {
            localStorage.removeItem('objectInfoMapCache');
            return null;
        }
        
        // 恢复为 Map
        const map = new Map();
        parsed.data.forEach(item => {
            map.set(item.key, item.value);
        });
        
        return map;
    } catch (error) {
        console.error('读取本地缓存失败:', error);
        localStorage.removeItem('objectInfoMapCache');
        return null;
    }
}

/**
 * 获取所有对象信息
 * @returns {Map} 对象信息映射表
 */
export async function getAllObjectInfoMap() {
    // 尝试从本地缓存获取
    const cachedData = getFromLocalCache();
    if (cachedData) {
        // 更新模块级变量
        objectInfoMap = cachedData;
        return objectInfoMap;
    }
    
    // 缓存不存在或已过期，重新获取
    await initObjectRelation();
    return objectInfoMap;
}


