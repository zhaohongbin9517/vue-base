<template>
    <div class="w-40 h-12 border-2 border-blue-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <h1>if else节点</h1>
        <!-- 蓝色 check -->
        <Handle id="if-else-check" type="source" :position="Position.Left" class="!top-[90%] !bg-blue-400" />
        <!-- 绿色 handle -->
        <Handle id="if-else-success" type="source" :position="Position.Bottom" class="!left-[35%] !bg-green-400" />

        <!-- 红色 handle -->
        <Handle id="if-else-fail" type="source" :position="Position.Bottom" class="!left-[60%] !bg-red-400" />

        <!-- 灰色 handle -->
        <Handle id="if-else-error" type="source" :position="Position.Right" class="!top-[90%] !bg-gray-400" />
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
  name: 'IfElseNode',
  components: {
    Handle,
    NodeActionButtons
  },
  props: {
    data: {
      type: Object,
      default: () => null
    }
  },
  data(){
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