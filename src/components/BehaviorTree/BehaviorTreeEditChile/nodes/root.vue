<template>
  <!-- 节点容器：relative 确保图标绝对定位生效 -->
  <div class="w-28 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center relative">
    <!-- 节点文本 -->
    <h2>根节点</h2>
    <!-- Vue Flow 内置的底部连线手柄 -->
    <Handle type="source" :position="Position.Bottom" />
    <NodeActionButtons />
  </div>
</template>
<script>
import {Handle, Position } from '@vue-flow/core'
import NodeActionButtons from './NodePublicTemp/NodeActionButtons.vue'

export default {
  name: 'RootNode',
  components: {
      Handle,
      NodeActionButtons
  },
  setup() {
    return {
      Position
    }
  }
}
</script>

<style scoped>

</style>

