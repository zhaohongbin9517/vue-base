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
        <div class="group-header" @click="toggleGroup(group)">
          <el-icon class="group-icon"><Folder /></el-icon>
          <span class="group-name">{{ group.group_name }}</span>
          <span class="node-count">{{ group.behaviors.length }}个节点</span>
          
          <div v-if="group.id != -1" class="group-actions">
            <el-button type="success" size="small" @click.stop="addNode(group.id)">
              <el-icon><Plus /></el-icon>
              添加节点
            </el-button>
            <el-button type="primary" size="small" @click.stop="editGroup(group)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click.stop="deleteGroup(group.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button type="warning" size="small" @click.stop="toggleGroup(group)" :title="group.expanded ? '收起分组' : '展开分组'">
              <el-icon >
                <Expand v-if="group.expanded" />
                <Fold v-else />
              </el-icon>
            </el-button>
          </div>
        </div>
        
        <!-- 节点列表 -->
        <transition name="slide-fade">
          <div v-if="group.expanded" class="node-list">
            <div v-for="node in group.behaviors" :key="node.id" class="node-item">
              <el-icon class="node-icon"><CircleCheck /></el-icon>
              <span class="node-name">{{ node.name }}</span>
              <div v-if="group.id != -1" class="node-actions">
                <el-button type="primary" size="small" circle @click="viewNodeInfo(node)">
                  <el-icon><InfoFilled /></el-icon>
                </el-button>
                <el-button type="success" size="small" circle @click="editNode(node)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle @click="deleteNode(node.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Tools, Plus, Edit, Delete, Folder, CircleCheck, InfoFilled, Expand, Fold } from '@element-plus/icons-vue'

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
    InfoFilled,
    Expand,
    Fold
  },
  setup() {
    return {
      Plus,
      Edit,
      Delete,
      Folder,
      CircleCheck,
      InfoFilled,
      Expand,
      Fold
    }
  },
  data() {
    return {
      behaviorGroupList: [
        {
            id:-1,
            group_name:'基础分组',
            group_desc:'基础行为节点',
            expanded: true, // 添加展开状态标志
            behaviors:[
                {id: -2,name: "根节点", desc: "基础节点，包含一个子节点",group_id: -1, sort: 0 },
                {id: -3,name: "永真节点", desc: "无论子节点执行结果如何，本节点都返回success",group_id: -1, sort: 1 },
                {id: -4,name: "ifelse节点", desc: "根据check节点的返回结果决定执行success或fail节点",group_id: -1, sort: 2 },
                {id: -5,name: "循环节点（次数）", desc: "循环执行子节点指定次数",group_id: -1, sort: 3 },
                {id: -6,name: "循环节点（判断结果）", desc: "循环执行子节点直到返回结果与设定值相同",group_id: -1, sort: 4 },
                {id: -7,name: "选择节点", desc: "从左到右执行子节点，遇到第一个success即停止并返回success",group_id: -1, sort: 5 },
                {id: -8,name: "顺序节点", desc: "从左到右执行子节点，遇到第一个fail即停止并返回fail",group_id: -1, sort: 6 },
                {id: -9,name: "取反节点", desc: "对子节点的结果取反并作为本节点的结果返回",group_id: -1, sort: 7 },
                {id: -10,name: "平行节点", desc: "执行所有子节点，将最后一个节点的结果作为本节点的结果返回",group_id: -1, sort: 8 }
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
            // 为API返回的数据添加展开状态
            this.behaviorGroupList = this.behaviorGroupList.concat(res.map(group => ({
              ...group,
              expanded: false
            }))
        )})
    },
    
    // 切换分组展开/收起状态
    toggleGroup(group) {
      group.expanded = !group.expanded
    },
    
    addResultGroup() {
      console.log('添加分组')
      // 实现添加分组逻辑，新分组默认展开
      const newGroup = {
        id: Date.now(),
        group_name: '新分组',
        group_desc: '',
        expanded: true,
        behaviors: []
      }
      this.behaviorGroupList.push(newGroup)
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
:deep(.el-card__body) {
  /* 隐藏滚动条 - Chrome, Safari, Edge */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.group-container:-webkit-scrollbar {
  display: none;
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
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.group-header:hover {
  background-color: #ecf5ff;
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

.expand-icon {
  font-size: 20px;
  color: #909399;
  margin-right: auto;
  margin-top: auto;
  margin-left: auto;
  transition: transform 0.3s ease;
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
  font-size: 16px;
  color: #303133;
  margin-right: auto;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 1;
  margin-right: 30px;
}

/* 展开收起动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  padding: 0 16px;
}
</style>