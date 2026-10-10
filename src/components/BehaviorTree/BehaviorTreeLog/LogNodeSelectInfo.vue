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
      <div  class="info-item-desc">
        <span class="label">信息：</span>
        <span class="content">{{getLogInfo()}}</span>
      </div>
    </div>

    <div class="info-actions">
      <el-button 
        size="small" 
        @click="collapseExpand"
        type="primary"
        :disabled="selectedNode.node.node_type === 'leaf'"
      > {{ selectedNode.node.isUnfold  ? '收起' : '展开' }}
      </el-button>
    </div>
  </div>
  
  <div v-else class="node-select-info empty">
    <p>请选择一个节点</p>
  </div>
</template>

<script>

export default {
  name: 'LogNodeSelectInfo',
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
  setup() {
    return {
    }
  },
  data() {
    return {
      argsList: []
    }
  },

  mounted() {
  },
  methods: {
    //获取日志信息
    getLogInfo(){
      console.log('selectedNode:',this.selectedNode)
      return JSON.stringify(this.selectedNode.log_info)
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
        return this.expandedGroups[this.selectedNode.node.behavior_id]?.desc || '无描述'
      }
      return this.nodeTypeMap[nodeType]?.description || '无描述'
    },
   
    //展开收起
    collapseExpand() {
      console.log(this.selectedNode.node.isUnfold)
       this.$emit('collapse-expand',  this.selectedNode.node_id)
    }
   
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

.arg-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 4px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.arg-name {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  min-width: 80px;
}

.arg-type {
  font-size: 12px;
  color: #909399;
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  white-space: nowrap;
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
