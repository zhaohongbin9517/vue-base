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
    
    <!-- 行为树卡片展示管理 -->
    <div class="behavior-tree-container">
      <div v-for="tree in behaviorTrees" :key="tree.id" class="behavior-tree-card">
        <div class="tree-header">
          <div class="tree-info">
            <span class="tree-name">{{ tree.name }}</span>
            <span class="tree-id">ID: {{ tree.id }}</span>
          </div>
          <div class="tree-actions">
            <el-button type="danger" size="small" @click="deleteTree(tree.id)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
            <el-button type="success" size="small" @click="buildTree(tree.id)">
              <el-icon><VideoPlay /></el-icon> 构建
            </el-button>
          </div>
        </div>
        <div class="tree-content">
          <div class="tree-desc">
            <span class="label">描述：</span>
            <span class="value">{{ tree.desc || '无描述' }}</span>
          </div>
          <div class="tree-status">
            <el-button  @click="editTree(tree.id)" style="width: 100%;">
              <el-icon><Edit /></el-icon> 设计编辑
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Tools, Plus, Edit, Delete ,VideoPlay} from '@element-plus/icons-vue'
import { getAllBehaviorTree,deleteBehaviorTree,builderExecutableTree } from '@/api/behavior/behavior'
export default {
  name: 'BehaviorTreeManager',
  components: {
    Tools,
    Plus,
    Edit,
    Delete,
    VideoPlay
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
            console.log()
            this.behaviorTrees = response
        })
    },
    
    // 添加行为树
    addResultGroup() {
      console.log('添加行为树')
      // 这里可以实现添加行为树的逻辑
    },
    
    // 编辑行为树
    editTree(tree) {
      console.log('编辑行为树:', tree)
      // 这里可以实现编辑行为树的逻辑
    },
    
    // 删除行为树
    deleteTree(treeId) {
      console.log('删除行为树:', treeId)
      // 这里可以实现删除行为树的逻辑
      if(treeId == -1){
        this.$message({
          message: '基础行为树不能删除',
          type: 'error'
        })
        return
      }
      this.$confirm('确认删除选中的行为树吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实现删除分组逻辑
        deleteBehaviorTree(treeId).then(response => {
            if(response.code == 0){
            this.$message({
                message: '删除成功',
                type: 'success'
            })
            this.initData()
            }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除行为树'
        })
      })
    },
    
    // 构建行为树
    buildTree(treeId) {
      console.log('构建行为树:', treeId)
      // 这里可以实现构建行为树的逻辑
      builderExecutableTree({id:treeId}).then(response => {
        if(response.file_name != undefined && response.file_name != ""){
          this.$message({
            message: '构建成功',
            type: 'success'
          })
            const link = document.createElement('a')
            link.href = `/behavior_tree/${response.file_name}`
            link.download = response.file_name // 自定义下载文件名
            link.click()
            this.initData()
        }
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

/* 行为树容器样式 */
.behavior-tree-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

/* 行为树卡片样式 */
.behavior-tree-card {
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.behavior-tree-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

/* 卡片头部样式 */
.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tree-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tree-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.tree-id {
  font-size: 12px;
  color: #909399;
}

.tree-actions {
  display: flex;
  gap: 8px;
}

/* 卡片内容样式 */
.tree-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tree-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}

.tree-desc .label {
  font-weight: 500;
  color: #303133;
}

.tree-status {
  margin-top: 4px;
  display: flex;
  justify-content: center;
}
</style>