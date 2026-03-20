<template>
  <div class="node-action-buttons">
    <el-button
      size="small"
      circle
      class="absolute top-1 right-1 p-0.5 icon-delete-btn"
      @click="handleDelete"
    >
      <el-icon><Delete /></el-icon>
    </el-button>

    <el-button
      size="small"
      circle
      class="absolute bottom-1 right-1 p-0.5 icon-shrink-btn"
    >
      <el-icon>
        <Expand v-if=false />
        <Fold v-else />
      </el-icon>
    </el-button>
  </div>
</template>

<script>
import { Delete, Expand, Fold } from '@element-plus/icons-vue'

export default {
  name: 'NodeActionButtons',
  components: {
    Delete,
    Expand,
    Fold
  },
  setup() {
    return {
      handleDelete: () => {
        console.log('Delete button clicked')
      }
    }
  }
}
</script>

<style scoped>
.node-action-buttons {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.node-action-buttons .el-button {
  pointer-events: auto;
}

.icon-delete-btn {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  width: 20px !important;
  height: 20px !important;
  --el-button-hover-bg-color: transparent !important;
  --el-button-active-bg-color: transparent !important;
  color: #ff4d4f !important;
}

.icon-delete-btn:hover {
  color: #ff7875 !important;
  background-color: #fef0f0 !important;
  border-radius: 50% !important;
}

.icon-shrink-btn {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  width: 20px !important;
  height: 20px !important;
  --el-button-hover-bg-color: transparent !important;
  --el-button-active-bg-color: transparent !important;
  color: #4d94ff !important;
}

.icon-shrink-btn:hover {
  color: #4d94ff !important;
  background-color: #4d94ff34 !important;
  border-radius: 50% !important;
}
</style>
