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
      <div v-if="selectedNode.node.node_type === 'leaf'" class="info-item-desc">
        <span class="label">模块：</span>
        <span class="content">{{ getNodeModule(selectedNode.node.node_type) }}</span>
      </div>
      <div v-if="selectedNode.node.node_type === 'leaf'"  class="info-item-desc">
        <span class="label">模块：</span>
        <span class="content">{{ getNodeFunc(selectedNode.node.node_type) }}</span>
      </div>
      <div  class="info-item-desc">
        <span class="label">节点描述：</span>
        <span class="content">{{ getNodeDesc(selectedNode.node.node_type) }}</span>
      </div>
      <div v-if="isShowArgs()" class="info-item-desc">
        <span class="label">参数：</span>
        <div class="content">
          <div v-for="(arg, index) in argsList" :key="index" class="arg-item">
            <div class="arg-name">{{ arg.name }}</div>
            <div class="arg-type">{{ arg.type }}</div>
            <el-input
              v-if="arg.type === 'string'"
              v-model="arg.value"
              size="small"
              @change="handleArgChange(index, $event)"
            />
            <el-input-number
              v-else-if="arg.type === 'int'"
              v-model="arg.value"
              size="small"
              :controls="false"
              @change="handleArgChange(index, $event)"
            />
            <el-input
              v-if="arg.type === 'atom'"
              v-model="arg.value"
              size="small"
              @change="handleArgChange(index, $event)"
            />
            <el-switch 
              v-if="arg.type === 'bool'"
              v-model="arg.value"
              size="small"
              active-text="成功"
              inactive-text="失败"
              @change="handleArgChange(index, $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="info-actions">
      <el-button  size="small"  @click="leftMove" type="primary" :disabled="!isCanLeftMove()" >左移  </el-button>
      <el-button  size="small"  @click="rightMove" type="primary" :disabled="!isCanRightMove()" >右移  </el-button>
      <el-button 
        size="small" 
        @click="collapseExpand"
        type="primary"
        :disabled="selectedNode.node.node_type === 'leaf'"
      > {{ selectedNode.node.isUnfold  ? '收起' : '展开' }}
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
  emits: ['delete-node', 'toggle-fold', 'arg-change'],
  setup() {
    return {
      stomOptions: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  },
  data() {
    return {
      argsList: []
    }
  },
  watch: {
    selectedNode() {
      this.loadArgs()
    }
  },
  mounted() {
    this.loadArgs()
  },
  methods: {
    loadArgs() {
      if (!this.selectedNode || !this.selectedNode.node) return
      if(this.selectedNode.node.node_type === 'loop_bool_node') {
        this.argsList = [{ name: '循环结果', type: 'bool',  value: this.selectedNode.node.bool } ]
      }else if(this.selectedNode.node.node_type === 'loop_num_node'){
        this.argsList = [{ name: '循环次数', type: 'int',  value: this.selectedNode.node.num } ]
      }else {
        const nodeData = this.expandedGroups[this.selectedNode.node.behavior_id] || {}
        const argsDefinition = nodeData.args || []
        let argsValue = this.selectedNode.node.args || []
        this.argsList = argsDefinition.map((item, index) => ({
          ...item,
          value: argsValue[index] || ''
        }))
      }
      console.log(this.argsList)
    },
    handleArgChange(index, value) {
      if (this.selectedNode && this.selectedNode.node) {
        this.$emit('arg-change', {nodeId:this.selectedNode.node_id,index:index,value:value
        })
      }
    },
    //是否显示参数
    isShowArgs(){
      if(this.selectedNode.node.node_type === 'loop_bool_node') return true
      if(this.selectedNode.node.node_type === 'loop_num_node') return true
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
        return this.expandedGroups[this.selectedNode.node.behavior_id]?.desc || '无描述'
      }
      return this.nodeTypeMap[nodeType]?.description || '无描述'
    },
    //获取节点函数
    getNodeFunc(nodeType) {
      if (nodeType === 'leaf') {
        return this.expandedGroups[this.selectedNode.node.behavior_id]?.func || '无函数'
      }
      return  '无函数'
    },
    //获取节点模块
    getNodeModule(nodeType) {
      if (nodeType === 'leaf') {
        return this.expandedGroups[this.selectedNode.node.behavior_id]?.module || '无模块'
      }
      return '无模块'
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
  max-height: 400px;
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
