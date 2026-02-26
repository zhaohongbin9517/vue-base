<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <el-button type="primary" size="small" @click="addParameter" class="add-param-btn">
          <el-icon><plus /></el-icon>
          新增参数
        </el-button>
      </div>
    </template>
    <el-table :data="parameters" border class="config-table" stripe>
      <el-table-column prop="paramName" label="参数选择" min-width="200">
        <template #default="{ row }">
          <el-select v-model="row.paramName" placeholder="请选择参数">
              <el-option 
                v-for="option in paramOptions" 
                :key="option.value" 
                :label="option.label" 
                :value="option.value" 
              />
            </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="paramValue" label="参数值" min-width="200">
        <template #default="{ row }">
          <el-input v-model="row.paramValue" placeholder="请输入参数值" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" size="small" circle @click="removeParameter($index)">
            <el-icon><delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { Tools, Plus, Delete } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigStartStopSetting',
  components: {
    Tools,
    Plus,
    Delete
  },
  props: {
    parameters: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '启动设备参数设置'
    },
    tips: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },

    paramOptions: {
      type: Array,
      default: () => [
        // { label: '参数1', value: 'param1' },
        // { label: '参数2', value: 'param2' },
        // { label: '参数3', value: 'param3' }
      ]
    }
  },
  setup() {
    return {
      Plus
    }
  },
  methods: {
    addParameter() {
      this.$emit('add-parameter', this.name)
    },
    removeParameter(index) {
      this.$emit('remove-parameter', this.name, index)
    }
  }
}
</script>

<style scoped>
.config-card {
  margin-bottom: 20px;
  border-radius: 8px;
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

.add-param-btn {
  margin-left: auto;
}

.config-table {
  width: 100%;
}

.config-table :deep(.el-table__header th) {
  background: #f5f7fa;
  font-weight: 600;
  color: #606266;
}
</style>
