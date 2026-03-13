<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'LeafNode',
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
    <div class="w-24 h-24 border-2 bg-transparent border-green-500 rounded-full flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <h1 class="bg-transparent">叶子节点</h1>
    </div>
</template>

<style scoped>

</style>