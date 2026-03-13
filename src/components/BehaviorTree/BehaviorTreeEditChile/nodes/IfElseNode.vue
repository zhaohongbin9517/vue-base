<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'IfElseNode',
  components: {
    Handle
  },
  setup() {
    return {
      Position
    }
  }
}
</script>

<template>
    <div class="w-40 h-12 border-2 border-blue-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <h1>if else节点</h1>
        <!-- 黄色 check -->
        <Handle id="if-else-check" type="source" :position="Position.Bottom" class="!left-[7%] !bg-yellow-400" />
        <!-- 绿色 handle -->
        <Handle id="if-else-success" type="source" :position="Position.Bottom" class="!left-[35%] !bg-green-400" />

        <!-- 红色 handle -->
        <Handle id="if-else-fail" type="source" :position="Position.Bottom" class="!left-[60%] !bg-red-400" />

        <!-- 灰色 handle -->
        <Handle id="if-else-error" type="source" :position="Position.Bottom" class="!left-[90%] !bg-gray-400" />
    </div>
</template>
