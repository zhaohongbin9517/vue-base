<script>
import {Handle, Position } from '@vue-flow/core'

export default {
  name: 'RootNode',
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
    <div class="w-24 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center">
        <h2>根节点</h2>
        <Handle type="source" :position="Position.Bottom" />
    </div>
</template>

<style>

</style>
