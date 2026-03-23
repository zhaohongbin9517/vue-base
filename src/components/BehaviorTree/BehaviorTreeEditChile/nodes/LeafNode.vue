<script>
import { Handle, Position } from '@vue-flow/core'
import NodeActionButtons from './NodePublicTemp/NodeActionButtons.vue'

export default {
  name: 'LeafNode',
  components: {
    Handle,
    NodeActionButtons
  },
  props: {
    label: {
      type: String,
      default: ''
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
    <div class="w-28 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <h1 class="bg-transparent">{{label}}</h1>
        <NodeActionButtons
          :isCanDelete=true
          :isCanShrink=false
        />
    </div>
</template>

<style scoped>

</style>