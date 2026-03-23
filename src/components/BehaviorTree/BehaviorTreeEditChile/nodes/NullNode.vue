<script>
import { Handle, Position } from '@vue-flow/core'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'NullNode',
  components: {
    Handle,
    Plus
  },
  setup() {
    return {
      Position
    }
  }
}
</script>

<template>
    <div class="w-24 h-12 border-2 border-red-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <el-icon ><Plus /></el-icon>
        <!-- <h1>待添加节点</h1> -->
    </div>
</template>

<style scoped>

</style>