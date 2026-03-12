<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>节点管理<span class="tips-text">(基础分组+自定义分组)</span></span>
        <div class="param-btn">
          <el-button type="primary" size="large" @click="addResultGroup" class="add-param-btn">
            <el-icon><plus /></el-icon>
            添加分组
          </el-button>
        </div>
      </div>
    </template>

    <!-- 分组卡片展示 -->
    <div class="group-container">
      <div v-for="group in behaviorGroupList" :key="group.id" class="group-item">
        <!-- 分组头部 -->
        <div class="group-header">
          <el-icon class="group-icon"><Folder /></el-icon>
          <span class="group-name">{{ group.group_name }}</span>
          <span class="node-count">{{ group.behaviors.length }}个节点</span>
          <div class="group-actions">
            <el-button type="success" size="small" @click="addNode(group.id)">
              <el-icon><Plus /></el-icon>
              添加节点
            </el-button>
            <el-button type="info" size="small" @click="editGroup(group)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="deleteGroup(group.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        
        <!-- 节点列表 -->
        <div class="node-list">
          <div v-for="node in group.behaviors" :key="node.id" class="node-item">
            <el-icon class="node-icon"><CircleCheck /></el-icon>
            <span class="node-name">{{ node.name }}</span>
            <div class="node-actions">
              <el-button type="primary" size="small" circle @click="viewNodeInfo(node)">
                <el-icon><InfoFilled /></el-icon>
              </el-button>
              <el-button type="warning" size="small" circle @click="editNode(node)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" size="small" circle @click="deleteNode(node.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Tools, Plus, Edit, Delete, Folder, CircleCheck, InfoFilled } from '@element-plus/icons-vue'

// 暂时注释掉未使用的API导入
import { getAllBehavior } from '@/api/behavior/behavior'

export default {
  name: 'MeterConfigResultSetting',
  components: {
    Tools,
    Plus,
    Edit,
    Delete,
    Folder,
    CircleCheck,
    InfoFilled
  },
  setup() {
    return {
      Plus,
      Edit,
      Delete,
      Folder,
      CircleCheck,
      InfoFilled
    }
  },
  data() {
    return {
      behaviorGroupList: [
        {
            id:2562,
            group_name:'计量基础',
            group_desc:'计量基础行为',
            behaviors:[
                {
                    args: [
                        {
                            name: "time_cd",
                            type: "int"
                        }
                    ],
                    desc: "设置下发计划",
                    func: "set_child_step_init_plan_tag",
                    group_id: 2562,
                    id: 3074,
                    module: "measure_behavior_base",
                    name: "设置下发计划",
                    sort: 0
                },
                {
                    args: [],
                    desc: "是否重置计量检查",
                    func: "check_reset_measure",
                    group_id: 2562,
                    id: 3075,
                    module: "measure_behavior_base",
                    name: "是否重置计量检查",
                    sort: 1
                },
                {
                    args: [],
                    desc: "是否下发计划",
                    func: "check_send_plan",
                    group_id: 2562,
                    id: 3076,
                    module: "measure_behavior_base",
                    name: "是否下发计划",
                    sort: 2
                },
                {
                    args: [],
                    desc: "是否下发计划重试",
                    func: "check_retry_send_plan",
                    group_id: 2562,
                    id: 3077,
                    module: "measure_behavior_base",
                    name: "是否下发计划重试",
                    sort: 3
                }
            ]
        }
      ]
    }
  },
  mounted() {
    this.initData()
    console.log('分组列表:', this.behaviorGroupList)
  },
  
  methods: {
    initData(){
        // 注释掉实际API调用，使用本地模拟数据
        getAllBehavior().then(res => {
            console.log('API返回数据:', res)
            this.behaviorGroupList = res
        })
    },
    
    addResultGroup() {
      console.log('添加分组')
      // 实现添加分组逻辑
    },
    
    addNode(groupId) {
      console.log('添加节点到分组:', groupId)
      // 实现添加节点逻辑
    },
    
    editGroup(group) {
      console.log('编辑分组:', group)
      // 实现编辑分组逻辑
    },
    
    deleteGroup(groupId) {
      console.log('删除分组:', groupId)
      // 实现删除分组逻辑
    },
    
    viewNodeInfo(node) {
      console.log('查看节点信息:', node)
      // 实现查看节点信息逻辑
    },
    
    editNode(node) {
      console.log('编辑节点:', node)
      // 实现编辑节点逻辑
    },
    
    deleteNode(nodeId) {
      console.log('删除节点:', nodeId)
      // 实现删除节点逻辑
    }
  }
}
</script>

<style scoped>
.config-card {
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-icon {
  font-size: 20px;
  color: #409eff;
}

.tips-text {
  font-size: 12px;
  color: #409eff;
  margin-left: 8px;
}

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

/* 分组容器 */
.group-container {
  margin-top: 20px;
}

/* 分组项 */
.group-item {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.group-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 分组头部 */
.group-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.group-icon {
  font-size: 18px;
  color: #67c23a;
  margin-right: 8px;
}

.group-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-right: 12px;
}

.node-count {
  font-size: 12px;
  color: #909399;
  margin-right: auto;
}

.group-actions {
  display: flex;
  gap: 8px;
}

/* 节点列表 */
.node-list {
  padding: 12px 16px;
}

/* 节点项 */
.node-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
  transition: background-color 0.3s ease;
}

.node-item:last-child {
  border-bottom: none;
}

.node-item:hover {
  background-color: #f5f7fa;
}

.node-icon {
  font-size: 16px;
  color: #67c23a;
  margin-right: 12px;
}

.node-name {
  font-size: 14px;
  color: #303133;
  margin-right: auto;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.node-item:hover .node-actions {
  opacity: 1;
}
</style>