<template>
    <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>行为树管理</span>
        <div class="param-btn">
          <el-button type="primary" size="large" @click="addResultGroup">
            <el-icon><plus /></el-icon>
            添加行为树
          </el-button>
        </div>
      </div>
    </template>
    <!--
      行为树卡片展示管理
    -->
  </el-card>
</template>

<script>
import { Tools, Plus } from '@element-plus/icons-vue'
import { getAllBehaviorTree } from '@/api/behavior/behavior'
export default {
  name: 'BehaviorTreeManager',
  components: {
    Tools,
    Plus
  },
  data() {
    return {
      behaviorTrees: [
        {id:-1, name:"基础行为树", desc:"基础行为树"}
      ]
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData(){
        getAllBehaviorTree().then(response => {
            console.log(response.data)
            this.behaviorTrees = response.data
        })
    }
  }
}
</script>

<style scoped>
.config-card {
  min-height: 83vh;
  max-height: 83vh;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 8px;
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

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}
</style>