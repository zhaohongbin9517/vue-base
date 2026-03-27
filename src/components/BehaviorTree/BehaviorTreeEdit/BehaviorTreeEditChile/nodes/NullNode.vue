<script>
import { Handle, Position } from '@vue-flow/core'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'NullNode',
  components: {
    Handle,
    Plus
  },
  props: {
    data: {
      type: Object,
      default: () => null
    }
  },
  setup() {
    return {
      Position
    }
  }
}
</script>

<template>
    <div class="w-20 h-11 border-2 border-red-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <el-icon v-if="!data.run_result" ><Plus /></el-icon>
        <h1 v-if="data.run_result">空节点</h1>
    </div>
</template>

<style scoped>

</style>