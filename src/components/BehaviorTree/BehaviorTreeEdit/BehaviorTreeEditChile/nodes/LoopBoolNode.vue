<template>
    <div 
    :class="{'node_selected': selected}"
    class="w-32 h-11 border-2 border-yellow-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" :connectable="handleConnectable" />
        <h1 class="label">循环节点(结果)</h1>
        <Handle type="source" :position="Position.Bottom" :connectable="handleConnectable" />
        <NodeActionButtons 
        @collapse-expand="collapseExpand"
        :isCollapsed="data.node_data.isUnfold"
        @delete-node="deleteNode"
        />
    </div>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'
import NodeActionButtons from './NodePublicTemp/NodeActionButtons.vue'

export default {
  name: 'LoopBoolNode',
  components: {
    Handle,
    NodeActionButtons
  },
  props: {
    data: {
      type: Object,
      default: () => null
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Position
    }
  },
  methods: {
    collapseExpand() {
      this.$emit('collapse-expand',this.data.node_id)
    },
    deleteNode() {
      this.$emit('delete-node',this.data.node_id)
    }
  }
}
</script>
<style scoped>
.label {
  font-size: 14px;
  margin-right: 18px;
}
</style>