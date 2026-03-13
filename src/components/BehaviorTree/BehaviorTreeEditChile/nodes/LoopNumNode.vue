<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'LoopNumNode',
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
    <div class="w-32 h-12 border-2 border-purple-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" :connectable="handleConnectable" />
        <h1>循环节点(次数)</h1>
        <Handle type="source" :position="Position.Bottom" :connectable="handleConnectable" />
    </div>
</template>