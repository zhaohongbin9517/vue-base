<template>
    <div class="w-28 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center">
        <Handle type="target" :position="Position.Top" />
        <h1 class="bg-transparent">{{data.label}}</h1>
        <NodeActionButtons
          :isCanDelete=true
          :isCanShrink=false
        />
    </div>
</template>

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
    data: {
      type: Object,
      default: () => null
    }
  },
  data(){
    return {
      Position
    }
  },
  methods: {
    collapseExpand() {
      console.log('props:', this.data)
    }
  }
}
</script>

<style scoped>

</style>