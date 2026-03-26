<template>
    <div 
    :class="{'node_selected': selected}"
    class="w-28 h-11 border-2 border-red-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" :connectable="handleConnectable" />
        <h1>选择节点</h1>
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
  name: 'SelectorNode',
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
    const handleConnectable = (node, connectedEdges) => {
      // only allow connections if the node has less than 3 connections
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
    },
    deleteNode() {
      this.$emit('delete-node',this.data.node_id)
    }
  }
}
</script>
