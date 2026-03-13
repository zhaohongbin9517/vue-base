<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'LeafNode',
  components: {
    Handle
  },
  props: {
    label: {
      type: String,
      default: '叶子节点'
    }
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
    <div class="w-24 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <h1 class="bg-transparent">{{label}}</h1>
    </div>
</template>

<style scoped>

</style>