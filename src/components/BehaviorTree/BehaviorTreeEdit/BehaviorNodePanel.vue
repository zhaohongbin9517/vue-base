<template>

<el-card class="node-info" shadow="hover">
    <template #header>
      <div class="card-header">
        <div class="node-info-search">
          <el-input
            v-model="searchText"
            placeholder="搜索节点"
            size="small"
            clearable
            style="width: 150px;"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <div class="search-btn">
            <el-button type="primary" size="small" circle @click="expandAll()" :title="'展开所有'">
              <el-icon ><Expand /></el-icon>
            </el-button>
            <el-button type="primary" size="small" circle @click="foldAll()" :title="'折叠所有'">
              <el-icon ><Fold /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 分组卡片展示 -->
    <div class="group-container">
      <div v-for="group in filteredGroups" :key="group.id" class="node-group">
        <div class="group-header" @click="toggleGroup(group)">
          <el-icon class="group-icon" :class="{ 'expanded': localExpandedGroups[group.id] }">
            <ArrowRight />
          </el-icon>
          <span class="group-name">{{ group.group_name }}</span>
          <span class="node-count">节点:{{ group.behaviors.length }}</span>
        </div>
        <div v-show="localExpandedGroups[group.id]" class="node-list">
          <el-tooltip   v-for="behavior in group.behaviors" :key="behavior.id" :content="behavior.desc" placement="top" effect="light" >
              <div
                class="node-item"
                draggable="true"
                @dragstart="handleDragStart($event,behavior)"
              >
                <el-icon class="node-icon"><CircleCheck /></el-icon>
                <div class="node-child">
                    <span class="node-name">{{ behavior.name }}</span>
                  </div>
              </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Search, ArrowRight, Expand, Fold, CircleCheck } from '@element-plus/icons-vue'

export default {
  name: 'BehaviorNodePanel',
  components: {
    Search,
    ArrowRight,
    Expand,
    Fold,
    CircleCheck
  },
  props: {
    behaviorGroupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchText: '',
      localBehaviorGroupList: this.behaviorGroupList,
      localExpandedGroups:this.behaviorGroupList.reduce((map, group) => {
        map[group.id] = false
        return map
      }, {})
    }
  },
  watch: {
    // 监听父组件传递的分组数据变化，实时更新
    behaviorGroupList: {
      handler(val) {
        this.localBehaviorGroupList = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    toggleGroup(group) {
       this.localExpandedGroups[group.id] = !this.localExpandedGroups[group.id]  
    },
    expandAll(){
      this.localBehaviorGroupList.forEach(group => {
        this.localExpandedGroups[group.id] = true
      })
    },
    foldAll(){
      this.localBehaviorGroupList.forEach(group => {
        this.localExpandedGroups[group.id] = false
      })
     },
     handleDragStart(event,behavior) {
      event.dataTransfer.setData('application/json', JSON.stringify({behavior_id:behavior.id}))
     }
  },
  computed: {
    filteredGroups() {
      if (!this.searchText) {
        return this.localBehaviorGroupList
      }

      return this.localBehaviorGroupList.map(group => {
        const filteredBehaviors = group.behaviors.filter(behavior =>
          behavior.name.toLowerCase().includes(this.searchText.toLowerCase())
        )

        if (filteredBehaviors.length > 0) {
          return {
            ...group,
            behaviors: filteredBehaviors
          }
        }

        return null
      }).filter(group => group !== null)
    }
  }
}
</script>

<style scoped>
.node-info {
  position: fixed;
  left: 1%;
  height: 87vh;
  width: 250px;
  border: 1px solid #dcdde6;
  border-radius: 8px;
  padding: 16px 5px 16px 10px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.node-info :deep(.el-card__body) {
  overflow-y: scroll !important;
  padding: 10px 5px 0px 1px;
}

.node-info :deep(.el-card__header) {
  padding: 0px 5px 0px 1px;
}

.node-info-search {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding-bottom: 0px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.node-info-search .el-input {
  flex: 1;
}

.search-btn {
  background: #fff;
  margin-left: 0px;
  display: flex;
  gap: 8px;
}

.search-btn :deep(.el-button) {
  margin-left: 0px;
}

.search-btn .el-button {
  padding: 8px;
}


.node-child {
  background-color: #fff;
  z-index: 100;
  overflow-y: auto;
}

.node-group {
  margin-bottom: 10px;
}

.group-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
}

.group-icon {
  font-size: 18px;
  color: #67c23a;
  margin-right: 8px;
}

.group-icon.expanded {
  transform: rotate(90deg);
}

.group-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-right: 12px;
}

.node-count {
  font-size: 12px;
  color: #909399;
  margin-left: auto;
}

.node-list {
  padding: 1px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.node-item {
  display: flex;
  align-items: center;
  padding: 5px;
  margin-bottom: 6px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.3s ease;
}

.node-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px 0 rgba(64, 158, 255, 0.15);
}

.node-item:active {
  cursor: grabbing;
}

.node-icon {
  font-size: 16px;
  color: #67c23a;
  margin-right: 10px;
}

.node-name {
  font-size: 12px;
  color: #303133;
  font-weight: 500;
}

.node-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
