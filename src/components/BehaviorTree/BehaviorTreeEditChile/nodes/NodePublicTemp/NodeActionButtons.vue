<template>
  <div class="node-action-buttons">
    <el-button
      v-if="isCanDelete"
      size="small"
      circle
      class="absolute top-1 right-1 p-0.5 icon-delete-btn"
      @click="handleDelete"
    >
      <el-icon><Delete /></el-icon>
    </el-button>

    <el-button
      v-if="isCanShrink"
      size="small"
      circle
      class="absolute bottom-1 right-1 p-0.5 icon-shrink-btn"
      @click="collapseExpand"
    >
      <el-icon>
        <Plus v-if="!isCollapsed" />
        <Minus v-else />
      </el-icon>
    </el-button>
  </div>
</template>

<script>
import { Delete, Plus,Minus } from '@element-plus/icons-vue'

export default {
  name: 'NodeActionButtons',
  components: {
    Delete,
    Plus,
    Minus
  },
  props: {
    // 是否可以删除
    isCanDelete: {
      type: Boolean,
      default: true
    },
    // 是否可以缩放
    isCanShrink: {
      type: Boolean,
      default: true
    },
    // 是否已折叠
    isCollapsed: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    return {
      handleDelete: () => {
        console.log('Delete button clicked')
      }
    }
  },
  methods: {
    // 处理保存配置
    handleSave() {
      this.$emit('save', this.formData)
    },
    // 处理缩放展开
    collapseExpand() {
      this.$emit('collapse-expand')
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
