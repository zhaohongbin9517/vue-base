<template>
  <el-card class="config-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><tools /></el-icon>
        <span>{{ title }}<span class="tips-text">{{ tips }}</span></span>
        <el-button type="primary" size="small" @click="addEnum" class="add-param-btn">
          <el-icon><plus /></el-icon>
          新增枚举
        </el-button>
      </div>
    </template>
    
    <!-- 参数选择 -->
    <div class="param-select-section">
      <el-form label-width="100px">
        <el-form-item label="状态参数">
          <el-select v-model="localParamName" placeholder="请选择参数" @change="handleParamNameChange">
            <el-option 
              v-for="option in paramOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value" 
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 枚举列表 -->
    <el-table :data="enums" border class="config-table" stripe>
      <el-table-column prop="value" label="值" min-width="150">
        <template #default="{ row }">
          <el-input-number v-model="row.value" placeholder="请输入值" :min="0" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态(英文)" min-width="150">
        <template #default="{ row }">
          <el-input 
            v-model="row.status" 
            placeholder="请输入状态" 
            @input="filterStatusInput(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" size="small" circle @click="removeEnum($index)">
            <el-icon><delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 启停状态枚举分类 -->
    <div class="status-classification-section">
      <h4 class="section-title">
        <el-icon class="title-icon"><classify /></el-icon>
        枚举分类：
      </h4>
      <div class="classification-content">
        <el-form label-width="120px">
          <el-form-item label="运行状态：">
            <div class="checkbox-selection">
              <el-checkbox 
                v-for="enumItem in validEnums" 
                :key="enumItem.status"
                :checked="localRunStatus.includes(enumItem.status)"
                @change="() => toggleRunStatus(enumItem.status)"
                class="status-checkbox"
              >
                {{ enumItem.status }}
              </el-checkbox>
              <span v-if="validEnums.length === 0" class="no-enums">
                暂无枚举项，请先添加
              </span>
            </div>
          </el-form-item>
          <el-form-item label="停止状态：">
            <div class="checkbox-selection">
              <el-checkbox 
                v-for="enumItem in validEnums" 
                :key="enumItem.status"
                :checked="localStopStatus.includes(enumItem.status)"
                @change="() => toggleStopStatus(enumItem.status)"
                class="status-checkbox"
              >
                {{ enumItem.status }}
              </el-checkbox>
              <span v-if="validEnums.length === 0" class="no-enums">
                暂无枚举项，请先添加
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Tools, Plus, Delete, Classify } from '@element-plus/icons-vue'

export default {
  name: 'MeterConfigDeviceStatusSetting',
  components: {
    Tools,
    Plus,
    Delete,
    Classify
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        paramName: '',
        enums: [{ value: '', status: '' }],
        statusEnumClassification: {
          run_status: [],
          stop_status: []
        }
      })
    },
    title: {
      type: String,
      default: '设备状态枚举配置'
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
  data() {
    return {
      localParamName: this.config.paramName,
      localRunStatus: this.config.statusEnumClassification?.run_status || [],
      localStopStatus: this.config.statusEnumClassification?.stop_status || []
    }
  },
  computed: {
    enums() {
      return this.config.enums || []
    },
    classificationDataStructure() {
      const data = {
        run_status: this.localRunStatus,
        stop_status: this.localStopStatus
      }
      return JSON.stringify(data, null, 2)
    },
    validEnums() {
      return this.enums.filter(item => item.status)
    }
  },
  watch: {
    'config.paramName': {
      handler(newVal) {
        this.localParamName = newVal
      },
      immediate: true
    },
    'config.statusEnumClassification': {
      handler(newVal) {
        if (newVal) {
          this.localRunStatus = newVal.run_status || []
          this.localStopStatus = newVal.stop_status || []
        }
      },
      immediate: true
    }
  },
  methods: {
    handleParamNameChange(value) {
      this.$emit('update:paramName', value)
    },
    toggleRunStatus(status) {
      let newValue = [...this.localRunStatus]
      const index = newValue.indexOf(status)
      if (index > -1) {
        newValue.splice(index, 1)
      } else {
        newValue.push(status)
      }
      this.localRunStatus = newValue
      this.$emit('update:statusClassification', {
        type: 'run_status',
        value: newValue
      })
    },
    toggleStopStatus(status) {
      let newValue = [...this.localStopStatus]
      const index = newValue.indexOf(status)
      if (index > -1) {
        newValue.splice(index, 1)
      } else {
        newValue.push(status)
      }
      this.localStopStatus = newValue
      this.$emit('update:statusClassification', {
        type: 'stop_status',
        value: newValue
      })
    },
    filterStatusInput(row) {
      // 只允许英文，不允许标点符号和特殊字符
      row.status = row.status.replace(/[^a-zA-Z]/g, '')
    },
    addEnum() {
      this.$emit('add-enum', this.name)
    },
    removeEnum(index) {
      this.$emit('remove-enum', this.name, index)
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

.param-select-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.param-select-section:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.param-select-section :deep(.el-form-item) {
  margin-bottom: 0;
}

.param-select-section :deep(.el-select) {
  width: 100%;
  max-width: 300px;
}

.param-select-section :deep(.el-form-label) {
  font-weight: 500;
  color: #495057;
}

.param-select-section :deep(.el-select:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
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

.status-classification-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f2f5;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 16px;
}

.title-icon {
  font-size: 16px;
  color: #409eff;
}

.classification-content {
  padding: 20px;
  border-radius: 8px;
  border: none;
}

.classification-content :deep(.el-form-item) {
  margin-bottom: 20px;
}

.classification-content :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.classification-content :deep(.el-form-label) {
  font-weight: 500;
  color: #495057;
  line-height: 32px;
}

.checkbox-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  min-height: 32px;
}

.status-checkbox {
  margin-right: 0;
}

.status-checkbox :deep(.el-checkbox__label) {
  font-size: 13px;
  color: #606266;
  cursor: pointer;
}

.status-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

.status-checkbox :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #409eff;
  font-weight: 500;
}

.status-checkbox :deep(.el-checkbox__input:hover .el-checkbox__inner) {
  border-color: #c6e2ff;
}

.status-checkbox :deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.no-enums {
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

.checkbox-selection :deep(.el-checkbox) {
  margin-right: 16px;
  margin-bottom: 8px;
}

.classification-desc {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #f0f2f5;
}

.desc-text {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.code-block {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #495057;
  overflow-x: auto;
  margin: 0;
  border: 1px solid #e9ecef;
}

.classification-content :deep(.el-select:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

.classification-content :deep(.el-multiple-select__tags) {
  flex-wrap: wrap;
  gap: 4px;
}
</style>
