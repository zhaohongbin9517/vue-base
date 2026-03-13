<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'NegationNode',
  components: {
    Handle
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
    <div class="w-28 h-12 border-2 border-pink-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" :connectable="handleConnectable" />
        <h1>取反节点</h1>
        <Handle type="source" :position="Position.Bottom" :connectable="handleConnectable" />
    </div>
</template>