<template>
  <div v-if="selectedNode" class="node-select-info">
    <div class="info-header">
      <h3>节点信息</h3>
    </div>
    
    <div class="info-content">
      <div class="info-item">
        <span class="label">节点ID：</span>
        <span class="value">{{ getNodeId(selectedNode.node.node_type)  }}</span>
      </div>
      
      <div class="info-item">
        <span class="label">节点类型：</span>
        <span class="value">{{ getNodeTypeName(selectedNode.node.node_type) }}</span>
      </div>
      <div  class="info-item-desc">
        <span class="label">节点描述：</span>
        <span class="content">{{ getNodeDesc(selectedNode.node.node_type) }}</span>
      </div>
      <div v-if="isShowArgs()" class="info-item">
        <span class="label">参数：</span>
        <pre class="value">参数：</pre>
      </div>
    </div>

    <div class="info-actions">
      <el-button  size="small"  @click="leftMove" type="primary" :disabled="!isCanLeftMove()" >左移  </el-button>
      <el-button  size="small"  @click="rightMove" type="primary" :disabled="!isCanRightMove()" >右移  </el-button>
      <el-button 
        size="small" 
        @click="collapseExpand"
        type="primary"
      > {{ selectedNode.node.isUnfold ? '收起' : '展开' }}
      </el-button>
      <el-button  size="small"  @click="handleDelete" type="danger" :disabled="!isCanDelete()" >删除  </el-button>
    </div>
  </div>
  
  <div v-else class="node-select-info empty">
    <p>请选择一个节点</p>
  </div>
</template>

<script>
// import {  } from '@element-plus/icons-vue'

export default {
  name: 'NodeSelectInfo',
  components: {
  },
  props: {
    selectedNode: {
      type: Object,
      default: null
    },
    nodeMap: {
      type: Object,
      default: () => ({})
    },
    nodeTypeMap: {
      type: String,
      default: '未知'
    },
    expandedGroups: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['delete-node', 'toggle-fold'],
  setup() {
    return {
    }
  },
  methods: {
    //是否显示参数
    isShowArgs(){
      const nodeData = this.expandedGroups[this.selectedNode.node.behavior_id] || {}
      const args =  nodeData.args || []
      this.ShowArgs()
      return args.length > 0
    },
    //显示参数内容
    ShowArgs(){
      const nodeData = this.expandedGroups[this.selectedNode.node.behavior_id] || {}
      const argsDefinition =  nodeData.args || []  //参数定义
      let argsValue = this.selectedNode.node.args
      console.log('argsDefinition',argsDefinition,argsValue)
      return argsDefinition.map((item,index) => ({
        ...item,
        value: argsValue[index] || ''
      }))
    },
    //获取节点类型名称
    getNodeTypeName(nodeType) {
      if (nodeType === 'leaf') return '行为节点'
      return this.nodeTypeMap[nodeType]?.name || nodeType
    },
    //获取节点ID
    getNodeId(nodeType) {
      if (nodeType === 'leaf') {
        return this.selectedNode.node.behavior_id
      }
      return this.nodeTypeMap[nodeType]?.behavior_id || nodeType
    },
    //获取节点描述
    getNodeDesc(nodeType) {
      if (nodeType === 'leaf') {
        return this.selectedNode.node.node_data?.description || '无描述'
      }
      return this.nodeTypeMap[nodeType]?.description || '无描述'
    },
    //是否可以左移
    isCanLeftMove(){
      if(!this.selectedNode.parentId) return false  //没有父节点，不能左移
      const parentNode =  this.nodeMap[this.selectedNode.parentId]
      if (parentNode.node.node) {
        return false} 
      else if (parentNode.node.nodes) {
        return  this.selectedNode.index > 0 //第一个节点不能左移
      } else if (parentNode.node.node_type === 'ifelse_node') {
        return  false
      }
      return true
    },
    //是否可以右移
    isCanRightMove(){
      if(!this.selectedNode.parentId) return false  //没有父节点，不能左移
      const parentNode =  this.nodeMap[this.selectedNode.parentId]
      if (parentNode.node.node) {
        return false} 
      else if (parentNode.node.nodes) {
        return  this.selectedNode.index < (parentNode.node.nodes.length - 2) //第一个节点不能左移
      } else if (parentNode.node.node_type === 'ifelse_node') {
        return  false
      }
      return true
    },
    // 是否可以删除
    isCanDelete(){
        return this.selectedNode.node.node_type !== 'root'
    },
    //删除
    handleDelete() {
      if (this.selectedNode) {
        this.$emit('delete-node', this.selectedNode.node_id)
      }
    },
    //展开收起
    collapseExpand() {
      console.log(this.selectedNode.node.isUnfold)
       this.$emit('collapse-expand',  this.selectedNode.node_id)
    },
    //左移
    leftMove() {
      this.$emit('left-move', this.selectedNode.node_id)
    },
    //右移
    rightMove() {
      this.$emit('right-move', this.selectedNode.node_id)
    },
  }
}
</script>

<style scoped>
.node-select-info {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 320px;
  border: 1px solid #dcdde6;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.node-select-info.empty {
  border: 1px dashed #dcdde6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #909399;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.info-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.info-content {
  margin-bottom: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.info-item-desc {
  display: flex;
  flex-direction: column; /* 关键：改成垂直方向（上下结构） */
  gap: 6px;                /* 上下之间的间距 */
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  align-items: flex-start; /* 内容全部左对齐 */
}

/* 内容文本强制左对齐，解决缩进问题 */
.info-item-desc .content {
  font-size: 13px;
  color: #303133;
  text-align: left;
  flex: 1;
  margin-left: 12px;
  word-break: break-all;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  min-width: 80px;
}

.value {
  font-size: 13px;
  color: #303133;
  text-align: right;
  flex: 1;
  margin-left: 12px;
  word-break: break-all;
}

.value pre {
  margin: 0;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.info-actions {
  display: flex;
  justify-content: flex-end;
}

.empty p {
  margin: 0;
  font-size: 14px;
}
</style>
