<template>
  <div v-if="selectedNode" class="node-select-info">
    <div class="info-header">
      <h3>节点信息</h3>
      <el-button type="danger" size="small" circle @click="handleDelete">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
    
    <div class="info-content">
      <div class="info-item">
        <span class="label">节点ID：</span>
        <span class="value">{{ selectedNode.id }}</span>
      </div>
      
      <div class="info-item">
        <span class="label">节点类型：</span>
        <span class="value">{{ getNodeTypeName(selectedNode.type) }}</span>
      </div>
      
      <div v-if="selectedNode.data.label" class="info-item">
        <span class="label">节点标签：</span>
        <span class="value">{{ selectedNode.data.label }}</span>
      </div>
      
      <div v-if="selectedNode.data.behaviorId" class="info-item">
        <span class="label">行为ID：</span>
        <span class="value">{{ selectedNode.data.behaviorId }}</span>
      </div>
      
      <div v-if="selectedNode.data.node_data" class="info-item">
        <span class="label">节点数据：</span>
        <pre class="value">{{ selectedNode.data.node_data }}</pre>
      </div>
    </div>
    
    <div class="info-actions">
      <el-button 
        size="small" 
        @click="handleToggleFold"
        type="primary"
      >
        {{ selectedNode.data.isUnfold ? '收起' : '展开' }}
      </el-button>
    </div>
  </div>
  
  <div v-else class="node-select-info empty">
    <p>请选择一个节点</p>
  </div>
</template>

<script>
import { Delete } from '@element-plus/icons-vue'

export default {
  name: 'NodeSelectInfo',
  components: {
    Delete
  },
  props: {
    selectedNode: {
      type: Object,
      default: null
    },
    nodeTypeMap: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['delete-node', 'toggle-fold'],
  setup() {
    return {
      Delete
    }
  },
  methods: {
    getNodeTypeName(nodeType) {
      return this.nodeTypeMap[nodeType]?.name || nodeType
    },
    handleDelete() {
      if (this.selectedNode) {
        this.$emit('delete-node', this.selectedNode.id)
      }
    },
    handleToggleFold() {
      if (this.selectedNode && this.selectedNode.data.node_data) {
        this.$emit('toggle-fold', this.selectedNode.data.node_data)
      }
    }
  }
}
</script>

<style scoped>
.node-select-info {
  border: 1px solid #dcdde6;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
