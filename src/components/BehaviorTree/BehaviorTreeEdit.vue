<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>行为树编辑</span>
        <div class="param-btn">
          <el-button type="primary" size="large">
            <el-icon><plus /></el-icon>
            保存行为树
          </el-button>
        </div>
      </div>
    </template>
    <!--
      行为树编辑容器
    -->
  </el-card>
</template>

<script>
import { Tools, Plus } from '@element-plus/icons-vue'
export default {
  name: 'MeterConfigResultSetting',
  components: {
    Tools,
    Plus
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  
  methods: {
  }
}
</script>

<style scoped>
.config-card {
  min-height: 83vh;
  max-height: 83vh;
  overflow-y: auto;
  margin-bottom: px;
  border-radius: 8px;
}
:deep(.el-card__header) {
  padding: 12px 20px;
}
:deep(.el-card__body) {
  /* 隐藏滚动条 - Chrome, Safari, Edge */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.group-container:-webkit-scrollbar {
  display: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}



.header-icon {
  font-size: 20px;
  color: #409eff;
}

.tips-text {
  font-size: 12px;
  color: #409eff;
  margin-left: 8px;
}

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

</style>