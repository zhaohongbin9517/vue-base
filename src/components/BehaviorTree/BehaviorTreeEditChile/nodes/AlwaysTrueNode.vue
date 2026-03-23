<script>
import { Handle, Position } from '@vue-flow/core'
import NodeActionButtons from './NodePublicTemp/NodeActionButtons.vue'
export default {
  name: 'AlwaysTrueNode',
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
    const handleConnectable = (node, connectedEdges) => {
      return connectedEdges.length < 2
    }
    return {
      handleConnectable,
      Position
    }
  },
  methods: {
    collapseExpand() {
      this.$emit('collapse-expand',this.data.node_id)
    }
  }
}
</script>

<template>
    <div class="w-28 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" :connectable="handleConnectable" />
        <h1>永真节点</h1>
        <Handle type="source" :position="Position.Bottom" :connectable="handleConnectable" />
        <NodeActionButtons 
        @collapse-expand="collapseExpand"
        :isCollapsed="data.node_data.isUnfold"
        />
    </div>
</template>