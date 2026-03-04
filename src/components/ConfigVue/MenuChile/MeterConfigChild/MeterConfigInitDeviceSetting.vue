<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <el-button type="primary" size="small" @click="addParameter" class="add-param-btn">
          <el-icon><plus /></el-icon>
          新增映射
        </el-button>
        <el-button type="success" size="small" @click="saveConfig" class="save-param-btn">
          <el-icon><check /></el-icon>
          保存配置
        </el-button>
      </div>
    </template>
    <el-table :data="mappings" border class="config-table" stripe>
      <el-table-column label="设置字段" min-width="200">
        <template #default="{ row }">
          <el-select 
          v-model="row.set" 
          filterable
          :class="{'is-error': codeIdIsValidParam(row.set)}" 
          placeholder="请选择参数">
            <el-option 
              v-for="option in paramOptions" 
              :key="option.code_id" 
              :label="option.desc" 
              :value="option.code_id" 
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="检查字段" min-width="200">
        <template #default="{ row }">
          <el-select 
          v-model="row.check" 
          filterable
          :class="{'is-error': codeIdIsValidParam(row.check)}" 
          placeholder="请选择参数">
            <el-option 
              v-for="option in paramOptions" 
              :key="option.code_id" 
              :label="option.desc" 
              :value="option.code_id" 
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="值字段" min-width="200">
        <template #default="{ row }">
          <el-input-number 
            v-model="row.value" 
            placeholder="请输入值字段" 
            :min="0" 
            controls-position="right"
            style="width: 100%"
          />
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
import { Tools, Plus, Delete, Check } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigInitDeviceSetting',
  components: {
    Tools,
    Plus,
    Delete,
    Check
  },
  props: {
    mappings: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '初始化设备数据设置'
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
      default: () => []
    }
  },
  setup() {
    return {
      Plus,
      Delete
    }
  },
  methods: {
    codeIdIsValidParam(codeId) {
      // 如果没有选择参数，无效
      if (!codeId || this.paramOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.paramOptions.some(option => option.code_id === codeId)
    },
    addParameter() {
      this.$emit('add-parameter', this.name)
    },
    removeParameter(index) {
      this.$emit('remove-parameter', this.name, index)
    },
    saveConfig() {
      this.$emit('save-config',this.name)
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

.save-param-btn {
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

.config-table :deep(.el-table__cell) {
  padding: 8px 12px;
}

.config-table :deep(.el-select) {
  width: 100%;
}

.config-table :deep(.el-input) {
  width: 100%;
}

.config-table :deep(.el-input__wrapper) {
  width: 100%;
}

.config-table :deep(.el-select.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.config-table :deep(.el-select.is-error .el-select__selected-item) {
  color: #f56c6c !important;
}

</style>