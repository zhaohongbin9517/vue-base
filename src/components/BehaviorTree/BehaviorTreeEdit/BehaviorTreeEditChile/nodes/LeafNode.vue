<template>
    <div 
    :class="{'node_selected': selected}"
    class="w-28 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center relative">
        <Handle type="target" :position="Position.Top" />
        <h1 class="leaf-label">{{data.label}}</h1>
        <NodeActionButtons
          :isCanDelete="true"
          :isCanShrink="false"
          :isHaveArgs="isArgsValid()"
          @delete-node="deleteNode"
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
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      Position
    }
  },
  methods: {
    isArgsValid(){
      return {bool:this.data.node_data.args.length > 0,msg:this.data.node_data.args.join(',')}
    },
    collapseExpand() {
      console.log('props:', this.data)
    },
    deleteNode() {
      this.$emit('delete-node',this.data.node_id)
    }
  }
}
</script>

<style scoped>
.leaf-label {
  font-size: 12px;
  margin-right: 18px;
}
</style>