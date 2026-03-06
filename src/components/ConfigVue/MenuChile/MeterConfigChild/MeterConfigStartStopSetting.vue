<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <div class="param-btn">
          <el-button type="primary" size="small" @click="addParameter" class="add-param-btn">
            <el-icon><plus /></el-icon>
            新增参数
          </el-button>
          <save-config-button @save="saveConfig"></save-config-button>
        </div>
      </div>
    </template>
    <el-table :data="parameters" border class="config-table" stripe>
      <el-table-column prop="code_id" label="参数选择" min-width="200">
        <template #default="{ row }">
          <el-select 
            v-model="row.code_id" 
            placeholder="请选择参数"
            filterable
            :class="{ 'invalid-param': isValidParam(row.code_id) }"
          >
              <el-option 
                v-for="option in paramOptions" 
                :key="option.code_id" 
                :label="option.desc" 
                :value="option.code_id" 
              />
            </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="参数值" min-width="200">
        <template #default="{ row }">
          <el-input-number 
            v-model="row.value" 
            placeholder="请输入参数值" 
            :min="0" 
            controls-position="right"
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
import { Tools, Plus, Delete } from '@element-plus/icons-vue'
import SaveConfigButton from '@/components/ConfigVue/MenuChile/MeterConfigChild/Common/SaveConfigButton'

export default {
  name: 'MeterConfigStartStopSetting',
  components: {
    Tools,
    Plus,
    Delete,
    SaveConfigButton 
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
      default: () => []
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
    printParameter() {
      // console.log(this.parameters)  
    },
    removeParameter(index) {
      this.$emit('remove-parameter', this.name, index)
    },
    saveConfig() {
      this.$emit('save-config',this.name)
    },
    isValidParam(codeId) {
      // 如果没有选择参数，无效
      if (!codeId || this.paramOptions.length === 0)  return true
      // 检查选择的参数是否在选项中
      return !this.paramOptions.some(option => option.code_id === codeId)
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

.param-btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.add-param-btn {
  /* margin-left: auto; */
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

.config-table :deep(.el-input-number) {
  width: 100%;
}

.config-table :deep(.el-input) {
  width: 100%;
}

.config-table :deep(.el-input__wrapper) {
  width: 100%;
}

.config-table :deep(.el-select) {
  width: 100%;
}

.config-table :deep(.el-select.invalid-param .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.config-table :deep(.el-select.invalid-param .el-select__selected-item) {
  color: #f56c6c !important;
}
</style>
