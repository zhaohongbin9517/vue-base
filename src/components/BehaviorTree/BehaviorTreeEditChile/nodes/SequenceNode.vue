<script>
import { Handle, Position } from '@vue-flow/core'
import NodeActionButtons from './NodePublicTemp/NodeActionButtons.vue'

export default {
  name: 'SequenceNode',
  components: {
    Handle,
    NodeActionButtons
  },
  setup() {
    const handleConnectable = (node, connectedEdges) => {
      // only allow connections if the node has less than 3 connections
      return connectedEdges.length < 2
    }

    return {
      handleConnectable,
      Position
    }
  }
}
</script>

<template>
    <div class="w-28 h-12 border-2 border-indigo-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" :connectable="handleConnectable" />
        <h1>顺序节点</h1>
        <Handle type="source" :position="Position.Bottom" :connectable="handleConnectable" />
        <NodeActionButtons />
    </div>
</template>